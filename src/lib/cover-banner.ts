import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { site } from '../site';

/**
 * Build-time renderer for the profile cover banners behind `/cover/*.png`.
 *
 * Same tokens, fonts and ornament as the social cards in `og-card.ts`, so a
 * profile header and a shared link read as the same person. What changes is the
 * shape: these are wide strips, and the Braintrust one is extreme at 8.1:1.
 *
 * At that ratio a stacked layout has nowhere to stack, so the banner is a single
 * row — wordmark and role on the left, tagline and domain on the right — and the
 * type sizes come from a per-size table rather than a scale factor, because 148px
 * of height does not tolerate a proportional shrink of a 396px design.
 *
 * Fonts follow the same `woff` constraint as `og-card.ts`: satori does not parse
 * `woff2`, so these come from the static `@fontsource/*` packages.
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

export interface CoverSize {
  width: number;
  height: number;
  padding: number;
  wordmark: number;
  role: number;
  tagline: number;
  /** Hidden on the shortest strip, where a second right-hand line crowds it. */
  showDomain: boolean;
}

/**
 * Where each size is used. Braintrust states 1200x148 in its own uploader; the
 * other two are the current LinkedIn and X header dimensions.
 */
export const coverSizes: Record<string, CoverSize> = {
  braintrust: {
    width: 1200,
    height: 148,
    padding: 40,
    wordmark: 46,
    role: 15,
    tagline: 19,
    showDomain: true,
  },
  linkedin: {
    width: 1584,
    height: 396,
    padding: 72,
    wordmark: 92,
    role: 24,
    tagline: 32,
    showDomain: true,
  },
  x: {
    width: 1500,
    height: 500,
    padding: 72,
    wordmark: 96,
    role: 25,
    tagline: 34,
    showDomain: true,
  },
};

type Node = {
  type: string;
  props: { style?: Record<string, unknown>; children?: unknown };
};

const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown
): Node => ({ type, props: { style, children } });

const ROLE = 'Infrastructure Engineer · Rio de Janeiro';
const TAGLINE = 'I make production boring.';

export async function renderCover(size: CoverSize): Promise<Buffer> {
  const svg = await satori(
    el(
      'div',
      {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: size.width,
        height: size.height,
        paddingLeft: size.padding,
        paddingRight: size.padding,
        backgroundColor: color.bg,
        // The site's single ornament, matching `.hero-glow`.
        backgroundImage:
          'radial-gradient(60% 70% at 12% 0%, rgba(120,140,170,0.09) 0%, rgba(8,9,10,0) 72%)',
        fontFamily: 'Inter',
      },
      [
        el('div', { display: 'flex', flexDirection: 'column' }, [
          el(
            'div',
            {
              display: 'flex',
              fontFamily: 'Caveat',
              fontSize: size.wordmark,
              lineHeight: 1,
              color: color.text,
            },
            site.name
          ),
          el(
            'div',
            {
              display: 'flex',
              marginTop: Math.round(size.role * 0.5),
              fontSize: size.role,
              letterSpacing: 1.4,
              color: color.faint,
            },
            ROLE.toUpperCase()
          ),
        ]),
        el(
          'div',
          {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          },
          [
            el(
              'div',
              {
                display: 'flex',
                fontSize: size.tagline,
                fontWeight: 600,
                color: color.muted,
              },
              TAGLINE
            ),
            ...(size.showDomain
              ? [
                  el(
                    'div',
                    {
                      display: 'flex',
                      marginTop: Math.round(size.tagline * 0.45),
                      fontSize: Math.round(size.tagline * 0.72),
                      color: color.faint,
                    },
                    'sergiofrancisco.com'
                  ),
                ]
              : []),
          ]
        ),
      ]
    ) as never,
    { width: size.width, height: size.height, fonts }
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}
