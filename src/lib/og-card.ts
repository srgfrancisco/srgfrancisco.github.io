import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { site } from '../site';

/**
 * Build-time renderer for the per-page social cards behind `/og/*.png`.
 *
 * Satori parses `woff` but not `woff2`, so the fonts come from the static
 * `@fontsource/*` packages rather than the `@fontsource-variable/*` ones the
 * site itself loads. Both are the same typefaces at the same version; the
 * variable packages ship woff2 only.
 *
 * Satori emits SVG, which sharp rasterises. LinkedIn and Slack will not render
 * an SVG card, and LinkedIn caches whatever it fetched first — so the output
 * has to be a real PNG from the start.
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

type Node = {
  type: string;
  props: { style?: Record<string, unknown>; children?: unknown };
};

const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown
): Node => ({ type, props: { style, children } });

export interface CardContent {
  /** Small uppercase line above the title: the client, or "Open source". */
  eyebrow: string;
  title: string;
  summary: string;
  /** Engagement window, omitted where the dates cannot be stated precisely. */
  years?: string;
  stack: string[];
}

export async function renderCard(content: CardContent): Promise<Buffer> {
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
        width: 1200,
        height: 630,
        padding: 80,
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
            fontSize: 20,
            letterSpacing: 2,
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
              fontSize: 68,
              fontWeight: 600,
              letterSpacing: -1.9,
              lineHeight: 1.05,
              color: color.text,
            },
            content.title
          ),
          el(
            'div',
            {
              display: 'flex',
              marginTop: 24,
              fontSize: 30,
              lineHeight: 1.4,
              color: color.muted,
              maxWidth: 900,
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
            paddingTop: 28,
          },
          [
            el(
              'div',
              { display: 'flex', fontSize: 18, color: color.faint },
              // Four is what fits on one line at 18px without wrapping.
              content.stack.slice(0, 4).join('  ·  ')
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
                    fontSize: 44,
                    color: color.text,
                  },
                  site.name
                ),
                el(
                  'div',
                  { display: 'flex', fontSize: 20, color: color.faint },
                  'sergiofrancisco.com'
                ),
              ]
            ),
          ]
        ),
      ]
    ) as never,
    { width: 1200, height: 630, fonts }
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}
