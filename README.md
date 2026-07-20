# outreach by smallteam.ai

Local-business outreach and lightweight CRM for venue and service businesses.
First customer workspace: Game On Entertainment Centre, Cranbourne West VIC.

Built from the design handoff in `design_handoff_outreach_crm/` — a
pixel-faithful recreation of the prototype as a Next.js (App Router) + React +
Tailwind v4 application.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the root redirects to `/dashboard`.

## What's here

- **Screens** — Dashboard, Promotions (with the 3-step promotion wizard),
  Find businesses, Shortlist, Campaign copy, Pipeline, lead drawer
  (slide-over on any screen), Do not contact and Settings.
- **Design tokens** — `src/styles/colors_and_type_light.css` is the bundled
  smallteam.ai light-theme token source; Inter is loaded via `next/font`.
- **Data layer** — `src/lib/data/` holds the seed data from the prototype
  (15 businesses, 3 promotions, contacts, timelines) behind typed entities
  (`src/lib/types.ts`) shaped after the handoff's state-management section, so
  real persistence can replace it without touching the screens.
- **Service stubs** — `src/lib/services/` defines interfaces for business
  discovery, AI email drafting, email send/track and the unsubscribe endpoint,
  each with a mock implementation returning the prototype data.

## Structure

```
src/
  app/            routes (one per screen) + global styles
  components/     app shell, sidebar, lead drawer, wizard, screens
  lib/            store, types, seed data, services, lead history builders
  styles/         design-system token stylesheet
```

The permanent do-not-contact register models Spam Act 2003 compliance:
entries cannot be deleted from the app.
