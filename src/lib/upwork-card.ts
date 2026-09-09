import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

/**
 * Build-time renderer for the portfolio thumbnails behind `/upwork/*.png`.
 *
 * Upwork asks for a 1000x750 file and then never shows it near that size.
 * Measured on the live profile: the portfolio grid renders it at 216x173 with
 * `object-fit: cover`, and the largest it appears anywhere — the "More by"
 * strip inside the detail modal — is 236x189. The detail modal does not
 * enlarge it at all. So the drawing survives at roughly 21.6%, and every size
 * below is chosen from what it becomes at that scale, not from what it looks
 * like in the file.
 *
 *     mark 168px -> 36px     line 58px -> 12.5px     footer 26px -> 5.6px
 *
 * That is the whole budget. The first version of this file reused the social
 * card's structure — eyebrow, title, summary, stack, signature, domain — and
 * at 21.6% everything except the title landed between 3 and 6px, which is the
 * failure mode `thumb-card.ts` already documents at 336px. Hence the different
 * shape here: one large mark, one short line, and a quiet footer. The project
 * name is deliberately absent, because Upwork prints it as a caption directly
 * under the tile and a thumbnail should not repeat its own caption.
 *
 * `cover` into a 1.249 box crops about 6% of a 1.333 image's width, ~15px a
 * side, so nothing meaningful sits within 80px of the left and right edges.
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
 * One accent per mark, so fourteen cards do not read as one card in the grid.
 * These are the vendors' own well-known hues, applied to a word rather than to
 * a logo — no third-party mark is reproduced. Anything unlisted stays on the
 * site's own foreground colour, which is the right answer for `12.5%` and
 * `WCAG 2.2`, where there is no vendor to point at.
 */
const accents: Record<string, string> = {
  Fargate: '#ff9900',
  ECS: '#ff9900',
  EKS: '#ff9900',
  Graviton: '#ff9900',
  SageMaker: '#ff9900',
  'Control Tower': '#ff9900',
  'Transit Gateway': '#ff9900',
  GCP: '#4285f4',
  AKS: '#0089d6',
  Terraform: '#7b42bc',
  OpenTelemetry: '#f5a800',
  Python: '#4b8bbe',
};

const WIDTH = 1000;
const HEIGHT = 750;
/**
 * Wide enough that the ~15px-a-side `cover` crop only ever eats padding. The
 * social card's 64px would leave 49px, which starts to look like a mistake.
 */
const PADDING = 96;

type Node = {
  type: string;
  props: { style?: Record<string, unknown>; children?: unknown };
};

const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown
): Node => ({ type, props: { style, children } });

const CONTENT_WIDTH = WIDTH - PADDING * 2;

/**
 * Advance width per character as a fraction of the font size, for Inter at
 * weight 600. Stepping the size by `mark.length` instead — the first attempt —
 * clipped `SageMaker` and `OpenTelemetry` off the right edge, because a string
 * of capitals is roughly a third wider than the same count of lowercase.
 */
const ADVANCE = { upper: 0.72, lower: 0.55, space: 0.26 };

const estimateWidth = (text: string, size: number) =>
  size *
  [...text].reduce((sum, ch) => {
    if (ch === ' ') return sum + ADVANCE.space;
    // Digits and punctuation sit close enough to capitals to share the number.
    return sum + (ch === ch.toLowerCase() && ch !== ch.toUpperCase()
      ? ADVANCE.lower
      : ADVANCE.upper);
  }, 0);

/**
 * Marks run from 3 characters (`ECS`) to 15 (`Transit Gateway`). 168px is as
 * large as the short ones want to be; anything wider than the column shrinks
 * until it fits on one line. The 0.96 keeps a margin against the estimate
 * being optimistic — the contact sheet in the commit message is the check that
 * it is not.
 */
const markSize = (mark: string) => {
  const fitted = (CONTENT_WIDTH * 0.96) / (estimateWidth(mark, 1) || 1);
  return Math.min(168, Math.floor(fitted));
};

export interface UpworkCardContent {
  /** Headline technology, drawn very large. */
  mark: string;
  /** Two to four words for what was done. */
  line: string;
  /** Client, or "Open source" — footer texture, not a headline. */
  eyebrow: string;
  years?: string;
}

export async function renderUpworkThumb(
  content: UpworkCardContent
): Promise<Buffer> {
  const meta = [content.eyebrow, content.years].filter(Boolean).join(' · ');

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
        // Spacer. The mark sits below centre, clear of the play-button overlay
        // Upwork paints over the middle of every grid tile.
        el('div', { display: 'flex' }),
        el('div', { display: 'flex', flexDirection: 'column' }, [
          el(
            'div',
            {
              display: 'flex',
              fontSize: markSize(content.mark),
              fontWeight: 600,
              letterSpacing: -4,
              lineHeight: 1,
              color: accents[content.mark] ?? color.text,
            },
            content.mark
          ),
          el(
            'div',
            {
              display: 'flex',
              marginTop: 28,
              fontSize: 58,
              fontWeight: 600,
              letterSpacing: -1.2,
              lineHeight: 1.15,
              color: color.text,
            },
            content.line
          ),
        ]),
        el(
          'div',
          {
            display: 'flex',
            borderTop: `1px solid ${color.border}`,
            paddingTop: 26,
            fontSize: 26,
            color: color.faint,
          },
          meta
        ),
      ]
    ) as never,
    { width: WIDTH, height: HEIGHT, fonts }
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}
