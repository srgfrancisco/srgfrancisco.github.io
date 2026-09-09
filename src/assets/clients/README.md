# Client logos

Square 400x400 PNG tiles, one per client, drawn on the Upwork portfolio
thumbnail by `src/lib/upwork-card.ts` and referenced by the `logo` field in a
project's frontmatter. A project with no `logo` falls back to a monogram, so
this directory never has to be complete.

Each file is already composited onto its own background. That is the point: the
4 Elements mark is white type, which disappears on white, while every other
mark here is dark and needs white behind it. Deciding that per file, once, at
import, keeps the renderer from having to inspect artwork it cannot see.

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

These are third-party trademarks, included to identify the client of a
delivered project. They are not covered by this repository's licence.
