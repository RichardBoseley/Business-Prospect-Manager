# smallteam.ai — Design System

A portable design system for **smallteam.ai**, extracted from the live marketing site codebase (`RichardBoseley/smallteam-website-2`, Next.js App Router + Tailwind v4).

Use this folder when designing anything — slides, mocks, marketing pages, prototype screens — that needs to feel like it belongs to smallteam.ai.

---

## Company

**smallteam.ai builds bespoke operational software for small businesses.**

The core offer: custom systems designed around the way a business actually operates — not generic SaaS that forces a team to adapt. Built fast using agentic AI on enterprise-grade infrastructure, delivered in a few weeks, and sold with a modest setup fee plus a low monthly subscription (instead of a large upfront capex build).

Audience: solopreneurs, founder-led companies, service businesses, trades, agencies, consulting firms — typically under 20 staff — that know their systems, spreadsheets, or off-the-shelf tools are underperforming.

The brand is **confident, plain-spoken, and slightly playful.** Operational competence wrapped around a friendly robot mascot. Think "most hyper-efficient, tech-savvy COO you've ever hired" — not "scary enterprise AI".

---

## Products represented

Only one surface is represented in the source repo:

- **Marketing website** — `smallteam.ai` (Next.js 16, React 19, Tailwind v4). Single-page with `/services/[slug]` and `/resources/[slug]` detail pages, an embedded AI chat intake in the hero, and a Calendly booking flow. Built to convert prospects into discovery calls.

Future products mentioned in positioning (not yet represented visually): a CRM, operational management apps, automation tools, job/project management, and client portals — all bespoke per client rather than off-the-shelf.

---

## Sources

- **Codebase:** `github.com/RichardBoseley/smallteam-website-2` (private) — primary source for colours, components, copy tone, interaction patterns.
- **Brand assets folder:** `brand_assets/` inside that repo — logo (robot mascot), brand guideline markdown, two landscape photo backgrounds.
- **Positioning doc:** `smallteam-positioning.md` in the repo — core offer, audience, pricing model.
- **Requirements doc:** `requirements.md` — site structure and copy direction.
- **Brand guideline:** `brand_assets/brand_guideline.md` — voice, personality, palette intent.
- **`CLAUDE.md`** at repo root — the team's own frontend rules (tokens, anti-generic guardrails). Respected in this system.

Access note: the repo is private. A maintainer with access will see everything; otherwise, this folder is the self-contained copy.

---

## Index

```
colors_and_type.css        Dark-first (marketing) tokens — CSS variables + semantic classes (.st-h2, .st-eyebrow, …)
colors_and_type_light.css  Light-first (admin/app) tokens — same token names re-pointed, plus status colours
Light Theme Spec.html      Living spec for the light variant — rendered palette, type, buttons, chips, bars
README.md                  This file — company context, voice, visual foundations, iconography
SKILL.md                   Agent Skills front-matter so this folder works as a Claude Code skill

assets/                    Logos, background photographs, favicon source
preview/                   Design-system preview cards (registered in the Design System tab)
ui_kits/
  marketing_site/          Marketing website UI kit (Nav, Hero, cards, buttons, forms, sections)
```

### Components (compiled, `window.SmallteamAiDesignSystem_ea116a`)

All are marketing-site surfaces — use for the website and promotional pages, not as generic app UI:

- `TopNav` — pill nav over the hero, fixed white nav after scroll
- `Hero` — navy photo hero with chat intake
- `SectionLabel` — capsule eyebrow above section headings
- `WhatWeBuild` — service cards grid
- `OurProcess` — three-step process with connector line
- `Pricing` — featured pricing card
- `FAQ` — accordion
- `CTASection` — dark CTA block with contact form
- `Footer` — minimal navy footer

---

## Two themes: dark-first (marketing) and light-first (app)

The system ships two token files with **identical token names**:

- **`colors_and_type.css`** — the marketing/site theme. White page, navy hero + dark sections, 56px display type. Use for the website, landing pages, decks, and anything promotional.
- **`colors_and_type_light.css`** — the light app theme, created for admin/product surfaces (site manager, dashboards, internal tools). Use for any working UI.

How the flip works:

| Token | Marketing (dark-first) | Light app theme |
|---|---|---|
| `--color-bg` | `#FFFFFF` | `#F4F6FA` — canvas behind panels |
| `--color-surface` | `#F4F6FA` | `#FFFFFF` — panels, bars, cards |
| `--color-brand` (ink) | `#181214` near-black | `#0A1628` navy — reads more branded on light UI |
| `--color-navy` | background colour | ink + rare dark elements (toasts, hint pills) |
| `--color-accent` teal | CTA, links | unchanged — CTA, links, focus, selection |
| Type scale | 56/40/36 marketing sizes | 34/28/20 admin density; same weights/tracking |
| Radii, shadows, motion | unchanged | unchanged (+ `--shadow-panel` for slide-overs) |

Light-theme-only semantic tokens (the marketing palette never needed state):

- **Draft amber** — `--color-draft` `#9A5B00` text / `--color-draft-dot` `#E8960C` / `--color-draft-soft`. Means exactly one thing: *unpublished changes*.
- **Success green** — `--color-success` `#0E8A63`. Live / deploy succeeded.
- **Danger red** — `--color-danger` `#C03530`. Discard, destructive, failed deploys.
- **`--focus-ring`** — 3px teal ring for keyboard-heavy admin UI.
- **`--color-surface-alt`** — inset wells / hover fills on white panels.

The light file also ships ready-made component classes: `.st-btn-primary/-secondary/-ghost/-danger`, `.st-input`, `.st-panel`, `.st-chip-draft/-staged/-success/-danger`.

Usage: load one file per surface (marketing pages get `colors_and_type.css`, app screens get `colors_and_type_light.css`). The light file declares its tokens on both `:root` and `.theme-light`, so it can also be loaded *after* the marketing file and scoped with `class="theme-light"` on a wrapper.

Everything else — voice, casing, wordmark, logo rules, no-emoji, hairlines, teal-tinted shadows, motion — applies to both themes.

---

## Content fundamentals (voice & copy)

**Voice.** Authoritative but unshowy. Plain English. Direct. Smart-but-not-arrogant. The brand's own guideline phrase is *"your most hyper-efficient, tech-savvy COO"* — capable, focused, no fluff.

**Pronouns.** Address the reader as **"you"** / **"your business"**. The company speaks as **"we"** (collective) — never as an individual founder. Never "I". Examples from the site: *"We listen to how your business currently operates"*, *"we design a solution that delivers the greatest operational benefit"*.

**Tense & mood.** Active voice. Present tense. Imperative for CTAs (*"Start the conversation"*, *"Learn how it works"*, *"Get in touch"*).

**Casing.** Sentence case for headings, section eyebrows, CTAs — every visible string. **Never title case.** The brand name itself is intentionally lowercase: **`smallteam.ai`** — always one word, all lowercase, with `.ai` in teal + extrabold as an inline accent when rendered.

**Spelling.** Australian/British English. The site uses *optimised*, *organisation*, *analyse*, *personalise*, *colour* in longer copy (though CSS tokens keep American `color` for DX). Keep this if you're writing new copy.

**Punctuation quirks.**
- Em-dashes with spaces for mid-sentence breaks: *"Typical systems — including CRMs, job trackers, or client portals — can be live in weeks."*
- Sentences often fragment for emphasis: *"Bespoke software. Subscription pricing."* / *"Weeks. Not months."* / *"One prompt. Whole app. No kidding."*
- Ellipsis sparingly, mostly in placeholder text.

**Sentence length.** Short. One idea per sentence. Lists of 3–5 bullets are preferred over dense paragraphs. The guideline literally says *"High use of bullet points and scannable text."*

**Benefit-led, never feature-dumping.** Copy leads with the outcome (saved time, reduced cost, smoother operations), then names the mechanism. Example: *"Automating even a few hours of manual admin per week typically covers the monthly cost many times over. Savings start quickly."*

**No emoji.** Not in headlines, not in body copy, not in UI labels. The brand has a mascot for personality; emoji would feel generic.

**Key phrases and taglines.**
- *"Custom software built for your business."* (hero H1)
- *"Automate your business. Do more with less."* (hero sub)
- *"Bespoke software. Subscription pricing."* (model section)
- *"Weeks, not months."* / *"No large upfront cost."* / *"One predictable monthly fee."*
- *"Every system is different because every business is different."*
- *"Start the conversation"* (final CTA, soft — never "Buy now" / "Sign up free")
- *"Punch above your weight."* / *"Your AI co-worker."* / *"Do more with less."* (from brand guideline — use sparingly)

**Taboos.** Avoid *leverage* as a verb, *solutions* as a noun for products, *revolutionary*, *cutting-edge*, *seamless*, *unlock your potential*. Avoid startup-bro energy. Avoid per-feature pricing tables — the model is one setup fee + one monthly fee, described in prose.

---

## Visual foundations

**Dominant colour story.** Two colours carry the identity: **teal `#00C2A8`** and **deep navy `#0A1628`**. Everything else is white, light grey, or a near-black text colour. The palette is deliberately small — no secondary accents, no purples/pinks/gradients beyond the navy hero.

**Background rhythm.** The homepage alternates navy → white → surface grey → navy → white → surface. Dark sections sit between light ones for intentional contrast. Dark sections tend to carry the "aspirational" beats (hero, model, examples, final CTA). Light sections do the explaining (problem, process, pricing, FAQ).

**Hero background.** Full-bleed landscape photograph (sky-over-city-lake) with a double overlay — a vertical navy gradient `rgba(10,22,40,.6) → .25 → .65` plus a radial vignette `transparent 35% → rgba(10,22,40,.5) 100%`. Not painted illustration. Not an abstract gradient. A real photograph, darkened.

**Other dark sections** use lighter solid navy `#0d1f3a` or stack a second landscape photo under the same overlay treatment.

**Typography.** Single family — **Inter** (weights 300/400/500/600/700/800 loaded). Never paired with a serif or display face. All hierarchy comes from weight + size + tracking. Large headlines use tight tracking (`-0.03em` display, `-0.02em` section H2). Body runs at `1.7` line-height for breathability. Eyebrows are uppercase, 11px, `letter-spacing: 0.1em`, teal or mint.

**Spacing.** Sections are `py-24` (96px vertical). Content max-width is **1160px**. Grid gutters are 16–24px. Card inner padding is 28–32px. The feel is spacious but not airy — content columns stay narrow enough to read (the prose copy blocks cap at ~500–700px).

**Borders.** Hairline 1–1.5px. On light bg: `#E8ECF0`. On dark: `rgba(255,255,255,0.08–0.18)`. Active / focused / "featured" states switch to teal: `#00C2A8` at 100% for strong emphasis, or `rgba(0,194,168,0.35)` for softer card borders.

**Corner radii.** Small and consistent.
- `6px` — buttons, inputs, flat cards, "friendlier than rocket.new's 0px but still tight"
- `10px` — feature cards, pricing cards, panels
- `12px` — elevated panels, chat surface
- `14px` — hero prompt input (the one big floating element)
- `100px` (pill) — section eyebrow labels, nav pill, suggestion chips

**Shadows.** Two systems:
- **Teal-tinted** for elevated/active interactive elements: `0 4px 14px rgba(0,194,168,.28)` on primary CTAs, `0 2px 12px rgba(0,194,168,.07)` for active tab cards, `0 8px 32px rgba(0,194,168,.12)` for hover-lift.
- **Neutral soft** for content panels: `0 1px 3px rgba(0,0,0,.06), 0 8px 32px rgba(0,0,0,.04)`.
- Never flat `shadow-md`. Always layered, coloured, low-opacity. The guideline is explicit about this.

**Cards.** Three archetypes:
1. *Problem/pain card* — flat `#F4F6FA` background, 6px radius, 3px left border in `--color-border` (subtle, neutral — NOT coloured-accent).
2. *Feature card* — 10px radius, white bg, 1.5px border, faint shadow on hover, border goes teal on hover, lift by 2–4px.
3. *Dark glass card* — on navy bg: `rgba(255,255,255,0.04–0.08)` bg, 1px `rgba(255,255,255,0.08–0.14)` border, 10–12px radius. Often `backdrop-filter: blur(12px)`.

**Transparency + blur.** Used deliberately — not decoratively.
- Chat bubbles and suggestion pills over the hero photo: `rgba(255,255,255,0.10–0.15)` with `backdrop-filter: blur(8-12px)`.
- The sticky navigation pill over the hero: `#303964` @ some alpha with `backdrop-filter: blur(18px)`.
- Sticky white nav post-scroll: `bg-white/97` + `backdrop-blur-md`.
Rule: use blur only over complex imagery; never over flat coloured backgrounds.

**Gradients.** Used only as image overlays (darkening the hero and examples photo backgrounds) and as a subtle inner glow on the sticky-fixed blobs inside the featured pricing card. No hero colour-gradient on solid fills. No purple→blue SaaS slop.

**Grain / texture.** None. The brand guideline mentions adding SVG noise for depth but the live site does not use it. Stick with clean flat surfaces.

**Imagery colour treatment.** Cool — blue/teal-shifted. Landscape photos used as hero backgrounds are desaturated by the navy overlay. No warm filters, no black-and-white, no duotone beyond the accidental teal-shift from overlay tinting. All imagery should read as "calm, cool, contemplative".

**Animation.** Restrained and purposeful.
- Only `transform` and `opacity` animate. Never `transition-all`.
- Durations: 150ms (hover state), 200ms (most transitions), 280–300ms (slide-ins, panel fades), 350–450ms (section enters).
- Easing: `cubic-bezier(0.4,0,0.2,1)` for motion in the UI; spring-like for framer-motion card illustrations (`transition={{ type: 'spring', stiffness: 280, damping: 22 }}`).
- Specific motifs: fade-up on content enter, marquee scroll on examples carousel (32s linear infinite, pauses on hover), service card illustrations animate internal SVG on card hover, cursor blink on hero animated-placeholder text.

**Hover states.**
- Buttons: background darkens to `--color-accent-h` (`#00a891`), element translates up 1px.
- Cards: border turns teal (`rgba(0,194,168,0.3–0.35)`), soft teal shadow appears, lift 2–4px.
- Nav links: colour shifts to `--color-brand`, tiny grey-surface background pill appears.
- Pill chips on hero: bg `rgba(255,255,255,.12)`, border `rgba(255,255,255,.5)`, text goes fully white.

**Active / press states.** No universal shrink. Buttons don't scale down. Some icon buttons scale up +5% (`hover:scale-105`). Focus-visible rings are expected on every interactive element per the `CLAUDE.md` rules (even though the codebase often relies on the browser default — reproduce them explicitly in mocks).

**Layout rules.**
- Page content centered in `max-w-[1160px]`, `px-6` horizontal (24px outer gutter).
- Hero and dark-background sections extend full-bleed; content still respects `1160px`.
- Sections: `py-24` vertical. Heading block: centered, with eyebrow → H2 → 500px max-width muted lead paragraph, `mt-3` between heading and lead.
- Two-column "problem vs approach" splits use `gap-[72px]` for large horizontal breathing.
- Fixed top nav (60px tall, 1.5px bottom border) slides in after 68px scroll. On home, a transparent pill nav is absolutely positioned over the hero instead.

**Protection vs capsule.** The pill-shaped glass nav over the photo is the main protection pattern — it houses links that must remain readable against the photo. Eyebrows use capsule backgrounds (`.st-eyebrow-pill`) when they sit in the middle of a visually busy area. Over flat backgrounds, a plain uppercase eyebrow (no capsule) is fine.

**Data / charts / illustrations.** Service-card illustrations are hand-crafted inline SVG at 260×80 viewBox, animating on hover via framer-motion (see `WhatWeBuild.jsx`). They use teal + navy + white, occasional muted red for "bad/old" states. Illustrations are *functional* — they show what the service does — not decorative.

**Don'ts (inherited from the repo's own `CLAUDE.md`).**
- No default Tailwind blue/indigo as primary.
- No `transition-all`.
- No flat `shadow-md`.
- Never squish the logo — always `h-X w-auto`.
- Don't improve or embellish a reference layout — match it.

---

## Iconography

**Approach.** The brand leans on its **robot mascot** as the primary visual character — not a unified line-icon set. Where icons are needed, the site uses lightweight custom inline SVGs in the **same stroke-based style**: 1.4–1.8px stroke weight, rounded line caps and joins, square viewBoxes (12, 14, 16, 20). Colours: `currentColor` for nav/utility, `#00C2A8` for accent checks, `#fff` for primary-button arrows.

**Exact icon inventory** (from codebase reads):
- Arrow-up (submit button): 16×16, stroke 2, rounded caps.
- Arrow-right (CTA suffix, "Learn more" card footer): 14×14, stroke 1.4–1.6, rounded.
- Chevron-down (FAQ accordion, scroll hint): 16–20×16–20, stroke 1.5.
- Check (bulleted list, submission success): 10×10 small or 48×48 hero-size, stroke 1.5–2.5.
- Refresh/rotate (chat reset): 12×12, stroke 1.4.
- Speech-bubble (chat CTA): 18×18, stroke 1.5.
- Send-up-arrow (chat composer): 14×14 inside a 32×32 teal circle.
- Back-chevron (modal back): 12×12.
- Warning dot / bang (service card): hand-crafted as part of the illustration, not a reused icon.

**No icon font. No icon library.** Lucide, Heroicons, Font Awesome are not in `package.json`. If a design needs an icon that's not in the inventory above, draw a new inline SVG that matches: stroke-only, 1.4–1.8px, rounded joins, same colour rules. If a larger set is unavoidable, the nearest CDN match is **Lucide** (same stroke-based feel) — flag the substitution.

**No emoji.** Zero usage in any file in the codebase.

**Unicode.** Very sparing — an em-dash in copy, `&hellip;` for ellipsis, `×` not used as close-button (the chat modal draws its own SVG). The one notable character use is `$$$` as an 8pt text label inside the "replacing systems" SVG to signal "expensive".

**Logo usage.**
- File: `assets/smallteam-robologo.png` — a friendly teal + dark-navy robot head with antennas and headphones, hand-drawn style. Aspect ~3:2, transparent background.
- Used at 28–32px in headers/footers; accompanies the `smallteam.ai` wordmark with 8px gap.
- Also appears at 28×28 as the "avatar" next to every assistant message in the hero chat.
- Larger inline decorative use (badge / 404 / marketing splash) is fine.
- **Never squish.** Always size via `h-X w-auto` or wrap in `overflow-hidden` circular container if circular crop needed.
- Never recolour. Never add a drop shadow. The dark navy outline is integral to the logo.

**Wordmark.** Text-rendered inline: `smallteam` in `--color-brand` (or white on dark) + `.ai` in `--color-accent`, `font-weight: 800`, tracking `-0.02em`. There is no SVG wordmark file — always rendered as HTML text so it scales cleanly.

---

## Notes & caveats

- **Fonts:** Inter loaded from Google Fonts CDN; no `.ttf` / `.woff2` files shipped in this system. Acceptable because the live site also uses `next/font/google`.
- **Icons:** No unified icon set exists. All site icons are bespoke inline SVGs. If a mock needs many icons, propose Lucide and flag it to the user.
- **No product app yet.** Only the marketing site is represented. CRM and operational-app surfaces referenced in positioning don't exist in code yet.
- **Third background image referenced** (`smallteam-background-citysuburbs-GENNB.jpg` in `LetsGetStarted.jsx`) was **not present** in the repo's `brand_assets/` folder at import time. The two photos that do exist (`skycitylake`, `williamstown`) cover hero and examples-carousel backgrounds.
