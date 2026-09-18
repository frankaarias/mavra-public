# MAVRA compact layout and interaction QA · 2026-09-18

final result: passed

## Target and evidence
- Selected source: /workspace/scratch/34f51528fb41/generated_images/exec-fed44ad4-2629-44a9-b986-6222daa09c15.png (1536 × 1024 design board).
- Rendered implementation: local Vite preview, desktop browser viewport 1363 × 936 CSS px (screenshots at 1×).
- Desktop dark ES: /workspace/scratch/mavra-final-dark.jpg.
- Desktop light ES: /workspace/scratch/mavra-final-light.jpg.
- Final cards: /workspace/scratch/mavra-final-cards-v3.jpg.
- Mobile: /workspace/scratch/mavra-motion-mobile.jpg; actual application inside a 390 × 844 CSS px iframe viewport, not a simulated screenshot scaling.
- Combined hero comparison: /workspace/scratch/mavra-comparison.jpg.
- Combined focused cards/CTA comparison: /workspace/scratch/mavra-cards-comparison.jpg.
- Reference panels cropped from the board and implementation content cropped from desktop screenshots, then proportionally normalized to approximately 680–727 px wide. Comparisons assess composition, not pixel identity: the mock uses illustrative imagery/copy and a different panel size. Both artifacts were opened and visually compared together.

## Fidelity review
- Typography: existing Cinzel display and sans-serif reading/control fonts retained. Short card titles and moderate hero size preserve hierarchy. Real Spanish heading wraps to three lines versus the illustrative two-line heading; expected content difference.
- Layout: balanced two-column hero, three-photo composition, three compact evidence cards, rounded CTA band, consistent 8 px card radii. Existing challenge, scope, team attribution and real contact form retained beyond the mock's abbreviated page.
- Tokens: existing dark/ivory/copper theme tokens retained. Light action uses existing darker copper for readable white text; no new palette or gradients.
- Assets: actual Pinterest creatives and English Research capture replace invented mock images. No fabricated product outputs or commercial claims. Image previews link to actual evidence; hero photographs open the full original.
- Content: full decision detail remains available in native disclosures in both languages; collective voice and Frank Arias/Santi Rojas attribution preserved.

## Comparison history
1. P2: uneven card heights and excessive visible detail compared with the compact target. Moved full reasoning into native disclosures; shortened visible card copy without deleting the full explanation.
2. P2: third card's extra evidence link caused a 14 px mismatch. Reserved 7 rem for desktop evidence links. Final rendered card heights: 524.15625 px for all three. Final screenshot and combined comparison above show the fix.
3. Post-fix comparison: no remaining actionable P0/P1/P2 differences within the agreed adaptation using real assets and existing copy.

## Interaction verification
- ES/EN changes open disclosure contents without closing it.
- Native disclosure opens with Enter; visible focus treatment present.
- Primary hero action reaches evidence; contact CTA reaches the original form.
- Empty form focuses required name field; no test email was sent.
- Hover button computed translation: -2 px; 180 ms transition.
- Hover photograph computed scale: 1.02; 220 ms transition.
- Mobile menu opens, links to Brand OS and closes; Escape closes it and returns focus through the menu button ref.
- Light/dark and language controls exercised on desktop and 390 px mobile viewport.
- No horizontal overflow observed on desktop; mobile composition visually fits its viewport.
- Reduced-motion CSS disables animations/transitions and hover displacement. OS preference emulation was unavailable; reviewed in source rather than claiming a browser-emulated test.
- Browser console checked: no application errors; unrelated browser-extension metadata errors excluded.
- Production build and existing bilingual evidence audit pass. Existing large Research chunk warning remains; Research/MKL/competitor implementation and data untouched.

## Follow-up polish
- None blocking. Native details animate content on opening; closing remains immediate for reliable native disclosure behavior.
