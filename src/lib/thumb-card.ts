import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { site } from '../site';
import type { CardContent } from './og-card';

/**
 * Build-time renderer for the small project thumbnails behind `/thumb/*.png`.
 *
 * Same content and same tokens as the social cards in `og-card.ts`, at the
 * 336x164 a Braintrust project thumbnail is rendered at. The aspect ratios are
 * close enough (2.05:1 against the card's 1.90:1) that the layout carries over,
 * but the type does not scale down linearly: at 28% of the card's width the
 * `summary` lands under 9px, which is decoration rather than text. So the
 * summary is dropped and the title carries the card, which is also what a
 * thumbnail is read for.
 *
 * Fonts follow the same `woff` constraint as `og-card.ts`: satori does not
 * parse `woff2`, so these come from the static `@fontsource/*` packages.
 */

const require = createRequire(import.meta.url);
const fontFile = (spec: string) => readFile(require.resolve(spec));

const fonts = await Promise.all([
  fontFile('@fontsource/inter/files/inter-latin-400-normal.woff'),
  fontFile('@fontsource/inter/files/inter-latin-600-normal.woff'),
  fontFile('@fontsource/caveat/files/caveat-latin-500-normal.woff'),
]).then(([regular, semibold, script]) => [
  { name: 'Inter', data: regular, weight: 400 as const, style: 'normal' as const },
  { name: 'Inter', data: semibold, weight: 600 as const, style: 'normal' as const },
  { name: 'Caveat', data: script, weight: 500 as const, style: 'normal' as const },
]);

/** Token values mirrored from `src/styles/global.css`; satori has no CSS vars. */
const color = {
  bg: '#08090a',
  text: '#e6e6e6',
  muted: '#8a8f98',
  faint: '#787e86',
  border: '#1c1f23',
};

const WIDTH = 336;
const HEIGHT = 164;
const PADDING = 18;

type Node = {
  type: string;
  props: { style?: Record<string, unknown>; children?: unknown };
};

const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown
): Node => ({ type, props: { style, children } });

/**
 * Titles run from 24 to 52 characters across the collection, and the box is
 * three lines tall at most. Stepping the size keeps the long ones inside the
 * card without shrinking the short ones into empty space.
 */
const titleSize = (title: string) => {
  if (title.length > 46) return 15;
  if (title.length > 34) return 17;
  return 19;
};

export async function renderThumb(content: CardContent): Promise<Buffer> {
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
        el(
          'div',
          {
            display: 'flex',
            fontSize: 8,
            letterSpacing: 1.2,
            color: color.faint,
            fontWeight: 500,
          },
          content.eyebrow.toUpperCase()
        ),
        el(
          'div',
          {
            display: 'flex',
            fontSize: titleSize(content.title),
            fontWeight: 600,
            letterSpacing: -0.4,
            lineHeight: 1.15,
            color: color.text,
          },
          content.title
        ),
        el(
          'div',
          {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: `1px solid ${color.border}`,
            paddingTop: 8,
          },
          [
            el(
              'div',
              { display: 'flex', fontSize: 8, color: color.faint },
              // Three fits on one line at 8px; four wraps on the longest names.
              content.stack.slice(0, 3).join('  ·  ')
            ),
            el(
              'div',
              {
                display: 'flex',
                fontFamily: 'Caveat',
                fontSize: 16,
                color: color.muted,
              },
              site.name
            ),
          ]
        ),
      ]
    ) as never,
    { width: WIDTH, height: HEIGHT, fonts }
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}
