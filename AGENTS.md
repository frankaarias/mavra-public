# AGTA / MAVRA case study

For frontend changes, read `PRODUCT.md`, `DESIGN.md`, and
`.agents/skills/impeccable/SKILL.md`. Apply the relevant scoped Impeccable playbook.
The user's confirmed brief and scope take priority over generic skill defaults.

- `/` is the case study (`src/pages/CaseStudy.jsx`); `/brand` is the Brand OS
  resource index (`src/pages/Home.jsx`). Do not confuse the filename with its route.
- Keep ES/EN content and link destinations equivalent. Preserve both themes.
- Do not modify MKL/research or competitor code/data unless the user explicitly
  includes it in a new task. A link to either surface is not permission to edit it.
- Verify affected routes at desktop and mobile sizes, including actual navigation.
- Run `npm run build` and `node scripts/audit-case.mjs` for case changes.
- Do not submit the contact form as a test; it sends real email.
- Impeccable is agent guidance, not a frontend dependency. Never import its scripts
  into the site or include its detector/browser tooling in the production bundle.
