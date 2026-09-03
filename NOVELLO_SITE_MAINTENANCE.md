# Novello Stone approved site baseline

Last locked: 2 September 2026

This document is the source-of-truth checklist for future site edits. Preserve the approved visual system unless a later brief explicitly replaces it.

## Approved bronze-gold material

The canonical implementation is `css/approved-material.css`. All bronze-gold text, numbers, eyebrows, rules, diamonds, frames, accents, and buttons must stay on this six-colour scale:

- Highlight: `#F1D9B7`
- Light gold: `#D2B38C`
- Mid gold: `#B9975F`
- Brand gold: `#A5833F`
- Bronze: `#8C6437`
- Shadow: `#3F2E1B`

Small text uses the light-majority brushed-metal face with a narrow lower shadow. The N monogram, the `Novello Stone` wordmark, and the hero word `stone,` use the matching polished, bevelled front-facing treatment. Do not substitute flat brown, yellow gold, or a separate gradient.

The four engineered-stone quick-guide question headings use the same polished wordmark face and bevel treatment while retaining their approved italic headline typography.

Buttons use the approved smooth satin face with polished inset edges, a 4px corner radius, and the existing 2px pressed movement. Do not reintroduce the earlier grainy button surface or squared corners.

## Approved synchronized light

The canonical implementation is `js/approved-material-beam.js` plus the beam layers in `css/approved-material.css`.

- One viewport-wide top-axis light source controls every bronze-gold surface at a 22-degree diagonal from vertical; the top enters first and the bottom follows last.
- Top-axis travel time: 6200ms. The same running speed continues briefly until the lower end of the diagonal has exited.
- Rest time: 6500ms, while the approved sweep speed remains unchanged.
- White-core strip width: 76px.
- Edge sparkle size: 18px.
- The beam affects bronze-gold material only; it must not wash over photos, video, limestone copy, or the page background.
- Respect `prefers-reduced-motion`.

Do not load the retired `css/chrome-beam.css` or `js/shimmer.js` files. They remain only as historical source and are not part of the approved site.

## Background, hero, and navigation

- The site uses one fixed, seam-free background plane from `img/novello-surfaces/novello-surface-05.webp`.
- Section backgrounds and dividing seams stay transparent.
- The home hero video remains a scrolling hero layer with its existing overlay.
- The navigation remains fixed, transparent, and unblurred so the hero video and shared background show through it.
- Desktop navigation is used above 960px, centred independently of the wordmark. The former top-right quote button is not part of the approved desktop header. At 960px and below, the accessible menu button and full-height mobile menu are used.
- The launch notice is fixed on wider desktops and moves into the page flow on phone/tablet so it cannot cover primary actions.

## Responsive acceptance sizes

Check these widths after any layout, typography, navigation, or image change:

- Compact phone: 320 × 700
- Standard phone: 390 × 844
- Tablet portrait: 768 × 1024
- Compressed/tablet landscape: 900 × 900
- Laptop: 1366 × 768
- 21-inch desktop reference: 1920 × 1080

At every size: no horizontal page overflow, no clipped headings, no overlapping controls, no missing navigation mode, no broken images, and a fixed transparent navigation bar. The complete N and `Novello Stone` wordmark must remain legible at the smallest width.

## Approved responsive typography scale

The canonical display-size layer is `css/typography-scale.css`. It is loaded after `css/approved-material.css` on every public page so it changes only scale and rhythm without replacing the approved typefaces, metallic material, beam, or button styling.

- Wide-screen home hero title: maximum `7.1rem`.
- Wide-screen page title: maximum `6.2rem`.
- Long About, Our Story, and Contact titles: maximum `5.6rem`.
- Section titles: maximum `4.25rem`; closing statements: maximum `4.6rem`.
- Tablet and phone ranges are explicitly stepped down at `1180px`, `960px`, and `720px`.
- Short landscape screens receive a reduced vertical scale at `760px` height and below.

Do not restore the former uncapped `8vw` page-title or `9.3vw` hero-title rules. Any future adjustment should change the shared variables in `css/typography-scale.css`, not add one-off inline sizes to individual pages.

## Text alignment

- Editorial reading sections remain deliberately left-aligned within their grids.
- Closing invitation sections use one centred axis for the heading, supporting copy, and action.
- Closing copy is capped at `680px`; closing headings are capped at `820px`.
- Decorative section kickers are omitted from closing invitations to avoid a competing duplicate-text axis.
- Do not add page-specific left alignment or one-sided margins to centred closing copy.

## Adding real-work images

1. Keep original photographs outside the website as the archive copy.
2. Add web-ready images to the relevant folder under `img/` (for example `img/services/` or `img/materials/`). Use a descriptive lowercase filename such as `mossel-bay-marble-island-installation.webp`.
3. Prefer WebP for photographs. Use JPEG only when a supplied workflow requires it, and PNG only for genuine transparency. Do not enlarge a small source image.
4. Export gallery/detail images at roughly 1600–2200px on the long edge; use about 2400px for a full-width hero. Aim for a practical web file size without visible banding or texture loss.
5. Preserve the existing image container and its aspect ratio. Use `object-fit: cover` for framed editorial photos and `object-fit: contain` only when the complete object must remain visible.
6. Add accurate, concise alt text describing the actual work, material, and location when known. Decorative duplicates should use an empty alt attribute.
7. Keep explicit `width` and `height` attributes when possible to prevent page movement. Use `loading="lazy"` for below-the-fold images; do not lazy-load the first visible hero image.
8. Do not bake text, the N logo, the beam, or bronze-gold effects into project photos. Those remain live site layers.
9. Re-run the responsive acceptance sizes and verify image crops at phone, tablet, laptop, and 21-inch desktop before approval.

## Material navigation and browser

The Materials navigation contains two distinct client journeys: `Origin of Materials` at `history-of-stone.html` for the editorial history, and `Explore Materials` at `explore-materials.html` for the interactive catalogue. Do not merge the catalogue back into the history page.

The `Explore Materials` page is an original Novello surface-palette catalogue. It currently contains 38 visual directions across Marble, Granite, Quartzite, Onyx, Limestone, Travertine, Engineered Stone, Large-Format Porcelain, and Terrazzo.

- Material-family buttons, free-text search, and application filtering are controlled by `js/material-catalogue.js`.
- The responsive catalogue uses four columns on wide screens, three on compact desktops, two on tablets, and one on phones.
- The application map covers kitchens, bathrooms, architectural surfaces, outdoor work, commercial counters, and bespoke furniture.
- Catalogue images are inspiration references, not a live stock list. Final slab, batch, finish, technical suitability, and availability must be confirmed before quotation.
- Every family shown must retain a verified South African supply route. Never imply that a visual direction is a named stock item; confirm the exact locally obtainable product and live stock before quotation.
- Most imported texture studies are ambientCG CC0 assets; the expanded image-source note and attribution links remain visible at the bottom of the palette.
- Preserve the Novello naming, copy, filtering behaviour, typography, and layout. Do not copy competitor grids, filters, product names, copy, or visual branding.

## Service-area content and links

- The approved home-page `On the road` section is the copy block headed `Built for the whole corridor.` beside the four-stop route. The retired fleet montage, fleet image, and `A fleet built for the corridor.` heading must not return.
- Mossel Bay is the operating base and uses a Google Maps place-search link.
- Hartenbos, Dana Bay, Groot Brak, Klein Brak, George, Wilderness, Sedgefield, Knysna, and Plettenberg Bay use Google Maps driving-direction links to Mossel Bay.
- Keep the same location names and destinations wherever the service area is repeated on Home, Our Story, About, or Contact. Do not leave a duplicate as plain text when the approved version is interactive.
- If a service-area image is changed, update its alt text and all genuinely duplicated instances in the same release.

## Safe update procedure

When changing `css/approved-material.css` or `js/approved-material-beam.js`, update `APPROVED_MATERIAL_VERSION` in `js/layout.js` and the matching query string on every public HTML page. This prevents an older cached finish from appearing during review.

Before handoff, verify all public routes return successfully, JavaScript parses, CSS braces balance, every page references the same approved-material version, and browser checks show no error overlay or broken imagery.
