import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { site } from '../site';
import type { CardContent } from './og-card';

/**
 * Build-time renderer for the portfolio thumbnails behind `/upwork/*.png`.
 *
 * Same content and same tokens as `og-card.ts`, at the 1000x750 an Upwork
 * portfolio thumbnail is rendered at. That is 4:3 — near square — where the
 * other two renderers are landscape (1.90:1 and 2.05:1), so this is a layout
 * of its own rather than a rescale: the vertical room goes into air between
 * the three blocks rather than into more content.
 *
 * The `summary` comes back here. It was dropped from `thumb-card.ts` because
 * at 336px wide it fell under 9px and read as decoration; at three times the
 * width it is text again, and the stack line fits five names instead of three.
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

const WIDTH = 1000;
const HEIGHT = 750;
const PADDING = 64;

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
 * Titles run from 24 to 52 characters across the collection. Two lines is the
 * comfortable height here; stepping the size keeps the long ones from taking a
 * third without shrinking the short ones away from the edges.
 */
const titleSize = (title: string) => {
  if (title.length > 46) return 50;
  if (title.length > 34) return 56;
  return 62;
};

export async function renderUpworkThumb(content: CardContent): Promise<Buffer> {
  const meta = [content.eyebrow.toUpperCase(), content.years]
    .filter(Boolean)
    .join(' · ');

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
            fontSize: 18,
            letterSpacing: 1.8,
            color: color.faint,
            fontWeight: 500,
          },
          meta
        ),
        el('div', { display: 'flex', flexDirection: 'column' }, [
          el(
            'div',
            {
              display: 'flex',
              fontSize: titleSize(content.title),
              fontWeight: 600,
              letterSpacing: -1.6,
              lineHeight: 1.08,
              color: color.text,
            },
            content.title
          ),
          el(
            'div',
            {
              display: 'flex',
              marginTop: 26,
              fontSize: 27,
              lineHeight: 1.45,
              color: color.muted,
            },
            content.summary
          ),
        ]),
        el(
          'div',
          {
            display: 'flex',
            flexDirection: 'column',
            borderTop: `1px solid ${color.border}`,
            paddingTop: 26,
          },
          [
            el(
              'div',
              { display: 'flex', fontSize: 17, color: color.faint },
              // Five is what fits on one line at 17px without wrapping.
              content.stack.slice(0, 5).join('  ·  ')
            ),
            el(
              'div',
              {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: 20,
              },
              [
                el(
                  'div',
                  {
                    display: 'flex',
                    fontFamily: 'Caveat',
                    fontSize: 40,
                    color: color.text,
                  },
                  site.name
                ),
                el(
                  'div',
                  { display: 'flex', fontSize: 18, color: color.faint },
                  'sergiofrancisco.com'
                ),
              ]
            ),
          ]
        ),
      ]
    ) as never,
    { width: WIDTH, height: HEIGHT, fonts }
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}
