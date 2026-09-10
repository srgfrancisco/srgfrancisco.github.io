import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';

/**
 * Lookup for the client logo tiles in `src/assets/clients`, shared by the home
 * page strip and the case study header so the two cannot drift apart.
 *
 * The tiles are square and already composited onto the background their own
 * artwork needs — white behind the dark marks, dark behind the light ones. See
 * the note in that directory. Consumers draw them as-is; nothing here inspects
 * or recolours artwork.
 */

const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/clients/*.png',
  { eager: true }
);

/**
 * A `logo` naming a file that does not exist is a content error, and the repo's
 * habit is to break the build rather than the page. Astro's `Image` would
 * accept `undefined` and fail somewhere less legible, so catch it here with the
 * filename in the message.
 */
export function logoFor(filename: string): ImageMetadata {
  const mod = files[`../assets/clients/${filename}`];
  if (!mod) {
    throw new Error(
      `client logo not found: src/assets/clients/${filename} — referenced by a project's \`logo\` field`
    );
  }
  return mod.default;
}

export interface ClientLogo {
  src: ImageMetadata;
  /** Client name, used as the link's accessible name. */
  client: string;
  href: string;
}

/**
 * One tile per logo file, in `order`. Kojo holds two case studies and one mark,
 * so thirteen projects yield twelve tiles; the earliest entry supplies the link.
 */
export function uniqueLogos(
  entries: CollectionEntry<'projects'>[]
): ClientLogo[] {
  const seen = new Set<string>();

  return [...entries]
    .sort((a, b) => a.data.order - b.data.order)
    .flatMap((entry) => {
      const { logo, client } = entry.data;
      if (!logo || seen.has(logo)) return [];
      seen.add(logo);
      return [{ src: logoFor(logo), client, href: `/case-${entry.id}` }];
    });
}
