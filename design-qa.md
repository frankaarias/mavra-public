# Brand OS — guided journey and full library

Date: 2026-09-20

## Approved visual targets

The user selected journey option 2, then requested two full-library concepts and
selected library version 1. This is a Product Design image-to-code implementation
inside the existing site, not an Impeccable comp-gate run or a new visual identity.

- Journey: `/workspace/scratch/34f51528fb41/brand-os-proposals/propuesta-2.jpg`
- Library: `/workspace/scratch/34f51528fb41/brand-os-proposals/biblioteca-version-1.jpg`
- Both originals: 1536 × 1024 pixels.

## Browser-rendered evidence

Captures live in `/workspace/scratch/34f51528fb41/brand-os-qa/`:

- `journey-light-es.jpg`, `library-light-es.jpg`: desktop renders.
- `journey-comparison.jpg`, `library-comparison.jpg`: reference on left,
  browser render on right in the same image.
- `library-dark-en.jpg`: desktop dark/English.
- `library-mobile-light-es.jpg`, `library-mobile-dark-en.jpg`: mobile library.

The cloud browser is 1363 × 936. Desktop evidence uses an actual 1536 × 1024 CSS
iframe scaled uniformly to 80%, a 1229 × 819 pixel crop, and the reference scaled
uniformly to the same size. Mobile uses a 390 × 844 CSS iframe at 1:1; its usable
width is 375px after the browser scrollbar. No horizontal overflow was observed
(scrollWidth and clientWidth both 375). Gray outside the frames is the QA harness,
not the product. Full-view comparisons are legible enough to inspect typography,
resource rows, controls and spacing; extra region crops were unnecessary.

## Fidelity and intentional adaptations

- Fonts: existing Cinzel + Inter retained, as explicitly required. The image
  generator's mixed-case serif was not substituted for the site's actual font.
- Layout: selected stage/area at left, focused evidence/resources at right;
  five areas and 19 resources. Existing global navigation is preserved, adding
  its header height relative to the section-only mock. Mobile uses a labelled
  native selector instead of a long desktop rail.
- Colors: shared semantic cream/bronze/ink tokens, flat surfaces, visible dark
  text and actions; no decorative gradients introduced.
- Images: actual English screenshots and existing creative replace illustrative
  generated images. Real guide icons replace unavailable photographic thumbnails;
  no fabricated research figures or new claims were introduced.
- Content: all 19 existing destinations preserved, complete ES/EN surrounding
  copy, shared language and theme controls, precise briefing/scenography anchors.

## Interaction and regression checks

- Journey selection and continuation; URL selection preserved with Back/Forward.
- Library area selection; desktop arrow-key tab navigation and mobile selector.
- Global search across all areas, including accent-insensitive `video` → vídeo.
- No-results recovery; clear search returns focus to the search field.
- Shared language toggle and both themes, desktop and mobile.
- Real resource navigation and back to library.
- Build and `scripts/audit-case.mjs` pass, including a new check of all five areas,
  19 unique resources, bilingual equivalent destinations and existing assets.
- Browser console checked: historical extension metadata errors and an earlier
  HMR error for untouched case-polish.css were present. No error attributable to
  the current interaction checks was observed. No contact form submitted.
- Protected research/MKL and competitor implementations/data unchanged.

## Comparison history and findings

An initial functional issue dropped the #library fragment on area selection.
Fixed by preserving the fragment when navigating with updated search parameters;
verified area switches remain in the library. Empty-search focus recovery was
also implemented. Final visual evidence includes these fixes.

The independent Impeccable finish reviewer returned `ship`: no substantive P0,
P1 or P2 defect established in the supplied visual and source evidence. It
accepted original typography, source assets, icon fallbacks, persistent global
navigation and mobile selector as deliberate adaptations. Documentation updated
separately to reflect the chosen composition.

The mechanical detector ran once and returned only advisory type-scale findings
relative to the minimal existing DESIGN.md ramp. Existing research bundle-size
warnings remain outside this task's protected scope.

final result: passed
