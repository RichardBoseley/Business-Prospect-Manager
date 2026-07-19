# Handoff: outreach by smallteam.ai — local business outreach CRM

## Overview
"outreach" is a smallteam.ai product: a local-business outreach and lightweight CRM tool for venue/service businesses (first customer: Game On Entertainment Centre, Cranbourne West VIC). A user defines a **promotion** (offer), searches for **local businesses** that match it, reviews an AI-ranked **shortlist**, approves **AI-drafted personalised emails**, then works replies through a **pipeline** with per-lead timelines, multiple contacts, notes and reminders. A permanent **do-not-contact** register enforces Spam Act 2003 compliance.

## About the Design Files
The file in this bundle (`Game On Outreach.dc.html` + `image-slot.js` + `_ds/` design-system assets) is a **design reference created in HTML** — a clickable prototype showing intended look and behaviour, not production code to copy. The task is to **recreate this design in the target codebase's environment** (React/Next.js recommended, matching smallteam.ai's stack: Next.js App Router + React + Tailwind v4) using its established patterns. If no environment exists yet, scaffold a Next.js app. All data in the prototype is mock/in-memory; the real build needs persistence and real integrations (see State Management).

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, shadows and copy are final and follow the smallteam.ai light design system. Recreate pixel-perfectly. The only lo-fi placeholders: the map block in the lead drawer (striped placeholder — implement with a real map or static map image) and the promotion photo slots.

## Brand / Design System
- Product brand: **outreach by smallteam.ai** — wordmark rendered as HTML text: `outreach` (weight 800) with `by smallteam.ai` beneath (`smallteam` navy 700, `.ai` teal 800). Robot logo `assets/smallteam-robologo.png`, never squished (`h-X w-auto`), never recoloured.
- The customer business (Game On) is a **workspace**, shown at the sidebar bottom — the app is multi-tenant/white-label by design.
- Load design tokens from `_ds/.../colors_and_type_light.css` (bundled). Key tokens below under Design Tokens.
- Font: **Inter** (Google Fonts, weights 300–800). No emoji anywhere. Icons: bespoke inline SVG, stroke-only 1.3–1.8px, rounded caps/joins (inventory in the prototype: mail, eye/open, cursor-click, reply-arrow, pencil/note, bell/reminder, padlock/DNC, calendar-check/booked, phone, person, search, flag).
- Australian English in all copy ("organise", sentence case everywhere, never title case).

## Screens / Views

### App shell
- Fixed left sidebar 224px, white, 1.5px right border `#E8ECF0`. Logo block top; nav groups under non-clickable uppercase headers (10px, weight 600, tracking 0.14em, `#9AA5B1`, hairline top border between groups): **Overview** (Dashboard — with amber count badge "4"), **Campaigns** (Promotions, Find businesses, Shortlist, Campaign copy), **CRM** (Pipeline, Do not contact), **Workspace** (Settings). Active item: weight 600, navy text, `rgba(0,194,168,0.08)` bg, 6px radius. Inactive: `#6C757D`, hover `#F4F6FA`.
- Sidebar footer: workspace name "Game On Entertainment Centre / Cranbourne West VIC · 2 venues".
- Main content: max-width 860–1200px per screen (dashboard 1120), padding 32px 40px 64px, fade-up entry animation 300ms `cubic-bezier(0.4,0,0.2,1)`.

### 1. Dashboard
- H1 28px/700/-0.03em + date line "· 4 leads need action today". "New promotion" primary button top-right.
- 5 KPI cards in grid `1.5fr 1fr 1fr 1fr 1fr`, all **clickable → pipeline pre-filtered**: Emails sent this week (118, with daily-limit progress bar "23 of 30 daily limit used today" → stage Contacted), Opens (74, "63% — indicative only" → Opened), Clicks (22 → Clicked), Replies (9 → Replied), New warm leads (4, teal-bordered emphasis card → "Warm leads" saved list).
- Follow-up queue table (Business/Suburb/Last activity/Stage/View): leads that replied/clicked and aren't actioned, plus any lead with a due reminder. Reminders render as amber bell badge "Reminder — {date} {time}". Rows clickable → lead drawer.

### 2. Promotions
- Card grid (auto-fill, min 320px). Each card: name, status chip (Active green / Draft amber, dot + pill), **pencil edit icon-button top-right** (opens wizard pre-filled, finish = "Save changes"), description, 5-stat row (Targets/Sent/Opened/Clicked/Replied), footer "Find businesses →" link; Draft cards also get a **Publish** button (flips to Active).
- Mock promos: Christmas Corporate Parties (Active, 12/23/14/6/3), School Holiday Group Deals (Active, 18/30/19/8/5), Weekday Team Building (Draft, zeros).

### 3. New/edit promotion wizard (modal, 640px, 3-step dots)
- Step 1 "What's the offer?": name input, description textarea, AI-suggested selling-point chips (toggle) + add-your-own input, 3 photo drop slots.
- Step 2 "Who does it suit?": audience checkbox cards (label + hint), 5 suggested + **add custom audience** input.
- Step 3 "Review": offer/selling points/audiences summary → "Create promotion" (lands as Draft).

### 4. Find businesses
- Promotion selector card (which promo this search feeds).
- Criteria panel: **Location** — segmented "Distance from venue" / "Named areas". Distance: venue dropdown (defaults to primary venue, link to Settings), 5–40 min drive slider. Areas: toggle chips + add-area input.
- **Business type** — chip toggles with search filter + selected count. **Industry** — chip toggles. **Business size** — "?" opens tooltip popover (S = 1–9 staff, M = 10–29, L = 30+, estimated from public signals); segmented "Size bands" (S/M/L toggles) / "Staff range" (min–max sliders 1–100).
- Search button with 900ms spinner → navigates to Shortlist.

### 5. Shortlist
- "{n} of 15 matches for {promo} — click a column to sort". Filter dropdowns: type, size, contact method.
- Table: checkbox, Business (name + suburb + AI fit rationale line), Type, Size badge, Contact-method icon (mail/person/phone with tooltip), Fit score pill (colour-banded ≥80 green / ≥65 teal / else amber). Sortable headers with ↓↑ arrows.
- Flags: "Previously contacted (Mar 2026) — view history" amber pill; do-not-contact rows locked at 45% opacity, excluded from selection.
- Sticky footer bar: "{n} selected — pre-ticked for top matches…" + "Add to campaign →" → Campaign copy.

### 6. Campaign copy
- Header: approval progress ({a} of {t} + bar), "Approve all & queue for sending" (→ "✓ Queued for sending", disabled), caption "Sends in daily batches of ~30".
- Left: target list (300px) with teal left-border active state and green check for approved.
- Right: email preview — To line (primary contact), subject, body (AI-drafted, personalised per business: hook referencing their business, drive time, size-appropriate group rates, sender block, compliance footer with one-click unsubscribe). Actions: **Approve** (auto-advances to next unapproved), **Edit** (subject + body become inputs, Save/Cancel), **↻ Regenerate** (cycles 3 draft variants).

### 7. Pipeline
- Multi-select filter dropdowns (Promotion, Industry, Area, Size, Last activity) — each a popover with checkboxes + "All"; button shows "Label: All / X / n selected"; "Clear filters ✕" link.
- Stage strip: New → Selected → Contacted → Opened → Clicked → Replied → Potential → Booked → Not interested, each cell count + label, clickable toggle-filter, arrows between.
- Left: Saved lists (All businesses, Warm leads 4, Potentials 1, No contact 30+ days 4). Right: filtered table (Business/Suburb/Stage/Last activity), rows → drawer.

### 8. Lead drawer (slide-over, 760px, from right, 280ms)
- Header: name, stage chip, meta line (type · suburb · size ⓘ · drive time), close ✕.
- Left column: AI summary panel (teal-tinted), map placeholder with address, entity/ABN/website/phone/email grid, **Contacts** section — avatar initials, name, Primary pill, role, email · phone; "Make primary" on others; "+ Add contact" expands a form (Name, Role, Email optional, Phone optional). Action row: Set reminder (expands **date + optional time** picker), Mark as potential, Mark not interested; "Add to Do-Not-Contact" → red confirm panel ("permanently excluded… can't be undone") → sets stage, adds timeline entry, appears on DNC screen.
- Right column, two tabs:
  - **Timeline**: icon-in-circle entries (colour-coded by category: teal = outbound/engagement, green = reply/booked, amber = note/reminder, red = DNC, grey = system) with connector line, date, "View email/reply" links. Note entries show headline; detailed notes expand ("details ▾") to full body. Multi-contact flow demoed on Stepz: Emailed Sarah → Sarah replied "talk to Jack Fielding" → Emailed Jack → reminder.
  - **Notes & emails ({n})**: cards for every detailed note, sent email, pasted reply and attachment (kind chip Note/Email/File, title, meta, body).
- Note composer at bottom of Timeline tab: segmented **Quick note** (one-line input) / **Detailed note** (headline — shows in timeline — + body textarea for pasted email content/call notes).

### 9. Do not contact
- Explainer with padlock icon: "Permanently excluded from all current and future campaigns."
- Table: Business, Reason (Unsubscribed via link / Requested by reply / Manual), Added date, padlock. Footer note: entries can't be deleted — Spam Act 2003. Manual additions from drawer appear here.

### 10. Settings
- **Venues**: list rows (name, address, Primary pill; Make primary / Remove on others) + add-venue form. Primary venue is the default for distance search.
- **Named areas**: removable chips + add input (feeds Find businesses area list).

## Interactions & Behavior
- All navigation client-side; drawer overlays any screen (scrim `rgba(10,22,40,0.30)`, click-outside closes).
- Buttons: hover bg `#00a891`, translateY(-1px), 200ms. Cards: hover teal border/shadow, lift 2px. Only transform/opacity animate; easing `cubic-bezier(0.4,0,0.2,1)`; 150–300ms.
- Approve auto-advance; regenerate clears manual edits; edits override drafts.
- Reminder saved → timeline entry + dashboard queue badge.
- DNC is irreversible in-app; DNC businesses excluded from selection everywhere.

## State Management (real build)
- Entities: Workspace (venues, named areas, daily send limit), Promotion (name, desc, selling points, audiences, photos, status draft/active, metrics), Business (identity, ABN, address, size estimate, industry, type, fit score + rationale per promotion, flags: previously-contacted, DNC), Contact (name, role, email, phone, isPrimary — primary changeable over time), TimelineEvent (kind, date, actor contact, payload), Note (headline + optional body), Email (draft variants, approved copy, sent/opened/clicked/replied), Reminder (date, optional time), DNCEntry (reason, date, permanent).
- Needs: business-discovery/enrichment source (search by radius/areas/type/industry/size), AI drafting (subject + body variants from promotion + business signals), email send/track with per-day batch cap (default 30, configurable 10–50), unsubscribe endpoint writing DNCEntry.
- Prototype tweak props to carry over as settings: `dailyLimit` (10–50, default 30), `showRationale` (fit-rationale line on shortlist).

## Design Tokens
- Canvas `#F4F6FA`; surface/panels `#FFFFFF`; ink/navy `#0A1628`; muted `#6C757D`; faint `#9AA5B1`; borders `#E8ECF0` (hairline 1–1.5px), row dividers `#F4F6FA`; table header bg `#F9FAFC`.
- Accent teal `#00C2A8` (hover `#00a891`, deep `#00775f`); success green `#0E8A63`; draft/warning amber text `#9A5B00`, dot `#E8960C`, soft `rgba(255,170,0,0.12)`; danger red `#C03530`.
- Soft tints: teal `rgba(0,194,168,0.06–0.16)`, navy `rgba(10,22,40,0.06)`.
- Radii: 6px buttons/inputs, 8px wells, 10px cards, 12px panels, 100px pills. Focus ring: `0 0 0 3px rgba(0,194,168,0.15)` + teal border.
- Shadows: panel `0 1px 3px rgba(0,0,0,.06), 0 8px 32px rgba(0,0,0,.04)`; primary CTA `0 4px 14px rgba(0,194,168,.28)`; popover `0 8px 32px rgba(10,22,40,.14)`; drawer `-24px 0 48px rgba(10,22,40,.10)`.
- Type (Inter): H1 28/700/-0.03em; section H2 17/600/-0.02em; body 13–14; table meta 12–13; uppercase labels 10–11/600/0.08–0.14em; KPI numbers 28/700; stage-strip numbers 19/700.

## Assets
- `assets/smallteam-robologo.png` — smallteam.ai robot logo (from brand assets).
- `_ds/smallteam-ai-design-system-.../colors_and_type_light.css` — light theme tokens.
- All icons are inline SVG in the prototype markup — copy paths directly.

## Files
- `Game On Outreach.dc.html` — the full prototype (all 10 screens, mock data for 15 businesses, all interactions). Template markup is in the `<x-dc>` body; behaviour/mock data in the trailing script.
- `image-slot.js` — drag-drop photo placeholder used in the wizard (prototype-only; replace with real upload).
