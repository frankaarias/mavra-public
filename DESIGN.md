---
name: AGTA MAVRA Case Study
description: Existing editorial identity, retained across the case and its library.
colors:
  dark-bg: '#0b0a09'
  dark-surface: '#15100d'
  dark-ink: '#e9e1d5'
  dark-muted: '#b9b1a6'
  dark-accent: '#d69d4c'
  light-bg: '#f4efe7'
  light-surface: '#e7ded1'
  light-ink: '#211b16'
  light-muted: '#62584e'
  light-accent: '#895115'
typography:
  display:
    fontFamily: 'Cinzel, serif'
    fontSize: 'clamp(2rem, 3.6vw, 3.1rem)'
    fontWeight: 400
    lineHeight: 1.18
  body:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1rem'
    lineHeight: 1.75
---

# AGTA / MAVRA visual conventions

## Overview

This records the existing, user-approved identity, not a new visual direction.
Let genuine brand imagery and concise explanations carry the case. Brand OS is
a continuation of the case study, not a separate application design.

## Colors

Source of truth: `.case-study` and its light variant in `src/index.css`.
Use the semantic `--case-*` properties in components, not copied hex values.
Accents identify links and actions. Secondary copy must remain readable in both
themes; do not achieve hierarchy by making it faint.

## Typography

Cinzel for editorial headings, Inter through `--font-sans` for prose and controls.
Preserve the explicitly requested AGTA attribution. Keep body copy around 65–75ch
where practical; compact resource descriptions are deliberately shorter.
Balance headings and test Spanish text expansion rather than shrinking all type.

## Layout

The shared case-study editorial container is 1180px with fluid horizontal padding;
Brand OS expands to 1380px while retaining the header and section alignment.
Its guided journey pairs a vertical stage rail with one detail panel: a real
preview, an explanation of the connection and a resource link. Desktop preview
height adapts to the viewport (140–300px) so the complete detail block remains
visible on ordinary laptop screens; mobile uses a natural stacked flow.
The full library uses the same rail-and-detail layout for five areas containing
2, 4, 4, 4 and 5 resources respectively. Resource rows pair a thumbnail with
the title, description and opening action, separated by quiet rules.

At intermediate widths, resource actions sit beneath their descriptions. At
760px and below, each rail becomes a labelled native selector above a single
detail column, search fills the available width, and journey actions stack.
Home scope facts retain separators rather than an additional row of boxed cards.

## Elevation & Depth

Flat surfaces at rest. Use a single separator for grouping and quiet hover states.
Do not add decorative gradients, glow, glass panels or nested card borders.

## Shapes

Existing 6–8px image/control corners are intentional. Preserve them rather than
applying generic skill defaults for larger radii or pill-shaped controls.

## Components

Journey previews and complete resource rows link directly to existing resources.
Use actual source screenshots and existing creative; screenshots retain their
English source content while surrounding descriptions and labels follow the
global language. Resources without a corresponding source image use a simple
icon thumbnail. Opening actions identify guides, briefs, tools and visual pieces.

Desktop stage and area controls form vertical keyboard-operable tabs. The selected
item uses the existing surface tone and an accent underline; mobile exposes the
same selection through a labelled native select. The journey's primary action
opens its resource, followed by related-resource links. Sequential “Continue with”
controls are omitted; the rail/selector owns movement between stages and areas.
The full-library view uses `#library`; stage and area query parameters preserve
selection through navigation. Search matches all 19 resources across areas in
Spanish and English without sensitivity to accents or case, with a result count,
an empty state and a clear action.

Focus outlines use the accent. Related-resource links are at least 44px tall,
and mobile selectors at least 48px. Motion is limited to existing short
hover/disclosure transitions and must respect `prefers-reduced-motion`.

## Do's and Don'ts

- Do preserve actual copy, routes, source evidence and the user's protected data.
- Do check Home and Brand OS together in both themes and languages.
- Don't interpret Impeccable as permission to replace fonts, colors or attribution.
- Don't add animated decoration merely to demonstrate that the skill is installed.
