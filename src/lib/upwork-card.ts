import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

/**
 * Build-time renderer for the portfolio thumbnails behind `/upwork/*.png`.
 *
 * Upwork asks for a 1000x750 file and then never shows it near that size.
 * Measured on the live profile: the portfolio grid renders it at 216x173 with
 * `object-fit: cover`, and the largest it appears anywhere — the "More by"
 * strip inside the detail modal — is 236x189. The detail modal does not
 * enlarge it. So the drawing survives at roughly 21.6%, and every size below
 * is chosen from what it becomes at that scale.
 *
 *     logo 220px -> 48px     title 56px -> 12px     year 38px -> 8px
 *
 * Three elements is the budget. An earlier version of this file carried six —
 * eyebrow, title, summary, stack, signature, domain — and at 21.6% everything
 * but the title landed between 3 and 6px, which is the failure mode
 * `thumb-card.ts` already documents at 336px.
 *
 * `cover` into a 1.249 box crops about 6% of a 1.333 image's width, ~32px a
 * side in source pixels, so the 96px padding is what keeps content clear of
 * the crop rather than being generous.
 *
 * Fonts follow the same `woff` constraint as `og-card.ts`: satori does not
 * parse `woff2`, so these come from the static `@fontsource/*` packages.
 */

const require = createRequire(import.meta.url);
const fontFile = (spec: string) => readFile(require.resolve(spec));

const fonts = await Promise.all([
  fontFile('@fontsource/inter/files/inter-latin-400-normal.woff'),
  fontFile('@fontsource/inter/files/inter-latin-600-normal.woff'),
]).then(([regular, semibold]) => [
  { name: 'Inter', data: regular, weight: 400 as const, style: 'normal' as const },
  { name: 'Inter', data: semibold, weight: 600 as const, style: 'normal' as const },
]);

/** Token values mirrored from `src/styles/global.css`; satori has no CSS vars. */
const color = {
  bg: '#08090a',
  text: '#e6e6e6',
  muted: '#8a8f98',
  faint: '#787e86',
  border: '#1c1f23',
};

/**
 * Monogram accents. Not brand colours — these belong to the card, not to the
 * client, and exist so fourteen tiles do not read as one tile in the grid.
 * Picked off the client name so a given project keeps its colour between
 * builds.
 */
const ACCENTS = ['#e08a3c', '#4f8ef7', '#8b6fd4', '#3fa88a', '#c2607a', '#5aa7c4'];

const accentFor = (name: string) => {
  const sum = [...name].reduce((n, ch) => n + ch.charCodeAt(0), 0);
  return ACCENTS[sum % ACCENTS.length];
};

/**
 * Initials for the logo fallback: the first letter of up to two significant
 * words, or the first two letters when the name is a single word. "Art of
 * Problem Solving" is AP, not AOP, because the small words are noise at 41px
 * on screen.
 */
const NOISE = new Set(['of', 'the', 'and', 'for', 'media', 'holding']);

const monogram = (name: string) => {
  const words = name
    .split(/\s+/)
    .filter((w) => w && !NOISE.has(w.toLowerCase()));
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

const WIDTH = 1000;
const HEIGHT = 750;
const PADDING = 96;
const CONTENT_WIDTH = WIDTH - PADDING * 2;
const LOGO = 220;

type Node = {
  type: string;
  props: { style?: Record<string, unknown>; children?: unknown; src?: string };
};

const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown
): Node => ({ type, props: { style, children } });

/**
 * Advance width per character as a fraction of the font size, for Inter at
 * weight 600. Sizing text by `length` instead clipped the long strings, since
 * a run of capitals is roughly a third wider than the same count of lowercase.
 */
const ADVANCE = { upper: 0.72, lower: 0.55, space: 0.26 };

const estimateWidth = (text: string) =>
  [...text].reduce((sum, ch) => {
    if (ch === ' ') return sum + ADVANCE.space;
    const isLower = ch === ch.toLowerCase() && ch !== ch.toUpperCase();
    return sum + (isLower ? ADVANCE.lower : ADVANCE.upper);
  }, 0);

/**
 * Titles run from 24 to 59 characters. Three lines is the most that fits above
 * the rule, so the size steps down by how many lines the title needs at 56px,
 * which is the smallest that still clears 12px on screen.
 */
const titleSize = (title: string) => {
  const lines = Math.ceil((estimateWidth(title) * 56) / CONTENT_WIDTH);
  return lines > 3 ? 48 : 56;
};

/**
 * Logos are read off disk and inlined as data URIs. Satori has no filesystem
 * and will silently drop an `img` it cannot fetch, so a missing or unreadable
 * file falls back to the monogram rather than rendering an empty box.
 */
const CLIENT_LOGOS = path.join(process.cwd(), 'src/assets/clients');

const logoDataUri = async (file: string): Promise<string | null> => {
  try {
    const buf = await readFile(path.join(CLIENT_LOGOS, file));
    const mime = file.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
};

export interface UpworkCardContent {
  /** Client, or "Open source" — the footer line under the title. */
  eyebrow: string;
  title: string;
  years?: string;
  /** Filename inside `src/assets/clients`, when one exists. */
  logo?: string;
  /**
   * What the monogram is built from when there is no logo. The client, for a
   * case study; the project itself for an open-source one, where the eyebrow
   * says "Open source" and would draw a meaningless OS.
   */
  monogramFrom: string;
}

export async function renderUpworkThumb(
  content: UpworkCardContent
): Promise<Buffer> {
  const src = content.logo ? await logoDataUri(content.logo) : null;

  /**
   * Logos arrive already square and already sitting on their own background,
   * normalised at import time — see the note in `src/assets/clients`. That is
   * deliberate: whether a mark needs white behind it or dark depends on the
   * artwork, and baking the answer into the file keeps that judgement out of
   * the renderer, which cannot see what it is drawing.
   */
  const badge = src
    ? ({
        type: 'img',
        props: {
          src,
          style: {
            width: LOGO,
            height: LOGO,
            borderRadius: 24,
            objectFit: 'cover',
          },
        },
      } as Node)
    : el(
        'div',
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: LOGO,
          height: LOGO,
          borderRadius: 24,
          border: `2px solid ${color.border}`,
          backgroundColor: '#0e1013',
          fontSize: 76,
          fontWeight: 600,
          letterSpacing: -2,
          color: accentFor(content.monogramFrom),
        },
        monogram(content.monogramFrom)
      );

  const svg = await satori(
    el(
      'div',
      {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: WIDTH,
        height: HEIGHT,
        padding: PADDING,
        backgroundColor: color.bg,
        // The site's single ornament, matching `.hero-glow`.
        backgroundImage:
          'radial-gradient(60% 70% at 12% 0%, rgba(120,140,170,0.09) 0%, rgba(8,9,10,0) 72%)',
        fontFamily: 'Inter',
      },
      [
        badge,
        el('div', { display: 'flex', flexDirection: 'column' }, [
          el(
            'div',
            {
              display: 'flex',
              fontSize: titleSize(content.title),
              fontWeight: 600,
              letterSpacing: -1.4,
              lineHeight: 1.14,
              color: color.text,
            },
            content.title
          ),
          el(
            'div',
            {
              display: 'flex',
              marginTop: 30,
              paddingTop: 26,
              borderTop: `1px solid ${color.border}`,
              fontSize: 38,
              color: color.muted,
            },
            [content.eyebrow, content.years].filter(Boolean).join(' · ')
          ),
        ]),
      ]
    ) as never,
    { width: WIDTH, height: HEIGHT, fonts }
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}
