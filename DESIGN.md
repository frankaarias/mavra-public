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

The shared editorial container is 1180px with fluid horizontal padding. Follow
the existing header and section alignment. Brand OS uses two editorial previews
per row on wide screens, compact image-over-text previews at intermediate widths,
and one column on phones. Its 19-resource catalog remains a grouped list.
Home scope facts use separators rather than an additional row of boxed cards.

## Elevation & Depth

Flat surfaces at rest. Use a single separator for grouping and quiet hover states.
Do not add decorative gradients, glow, glass panels or nested card borders.

## Shapes

Existing 6–8px image/control corners are intentional. Preserve them rather than
applying generic skill defaults for larger radii or pill-shaped controls.

## Components

Previews link directly to full resources. Screenshots are English source captures;
surrounding descriptions and labels follow the global language. Resource labels
identify guides, briefs, tools and visual pieces without resembling buttons.
Focus outlines use the accent. Touch links in featured connections are at least
44px tall. Motion is limited to existing short hover/disclosure transitions and
must respect `prefers-reduced-motion`.

## Do's and Don'ts

- Do preserve actual copy, routes, source evidence and the user's protected data.
- Do check Home and Brand OS together in both themes and languages.
- Don't interpret Impeccable as permission to replace fonts, colors or attribution.
- Don't add animated decoration merely to demonstrate that the skill is installed.
