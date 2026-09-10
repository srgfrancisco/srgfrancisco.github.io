# Client logos

Square 400x400 PNG tiles, one per client, referenced by the `logo` field in a
project's frontmatter and drawn on two surfaces:

- the client strip on the home page (`src/components/ClientLogos.astro`),
- the Upwork portfolio thumbnail (`src/lib/upwork-card.ts`).

The strip resolves the file through `src/lib/client-logos.ts`, which throws with
the filename when a `logo` names a file that is not here — a content error
should break the build, not the page. The thumbnail renderer falls back to a
monogram instead, so this directory never has to be complete.

The case study pages deliberately carry no mark. A 44px chip beside the eyebrow
was tried and dropped: at that size it competed with the client name printed
next to it and added nothing the eyebrow was not already saying.

Each file is already composited onto its own background. That is the point: the
4 Elements and Kojo marks are light type, which disappears on white, while every
other mark here is dark and needs white behind it. Deciding that per file, once,
at import, keeps the renderers from having to inspect artwork they cannot see.

It also rules out doing it in CSS later. `filter: invert()`, `mix-blend-mode`
and grayscale-until-hover all appear to work on the ten dark marks and mangle
the two light ones. The tiles are drawn as tiles, as they are.

To add one: trim the artwork, fit it inside a 400x400 tile with ~56px of
padding, and flatten it onto white — or onto the mark's own dark, if the
artwork is light. Keep the filename equal to the content entry's id.

## Provenance

All but one came from Sérgio, either from his logo folder outside this repo or
handed over directly. The exception is `sight-machine.png`, taken from
`sightmachine.com`'s `apple-touch-icon.png`: it is the icon alone, with no
wordmark, and is the first one to replace if a better file turns up.

`kojo.png` keeps the plate colour from the artwork it arrived on (#31302e)
rather than white, because the wordmark is yellow.

`toptal-mark.png` is the blue mark cropped out of the full lockup, kept as an
alternative to `toptal.png`. The lockup is wired up because it still reads at
48px and matches the other lockups in the set; the mark is bolder in a grid
but says less. Swapping is one line of frontmatter.

These are third-party trademarks, included to identify the client of a
delivered project. They are not covered by this repository's licence.
