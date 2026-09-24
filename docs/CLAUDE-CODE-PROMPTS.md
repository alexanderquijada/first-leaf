# Claude Code prompts

Every phase prompt for First Leaf, in order, plus redirect prompts for common problems. Alex pastes one prompt per phase into Claude Code in VS Code (opened on `~/Projects/first-leaf`) and pastes Claude Code's report back into the planning chat.

- **One phase per session.** Each prompt is its own go-ahead.
- Phases move **all three case studies forward together**, with separate commits per case study.
- Before each phase, the planning chat re-issues the prompt with anything learned since. The copy saved here is the version that was actually run.

---

## Phase 0 · Foundation

**What Alex should look at when it's done:** the live site's landing page shows three doors; `/p301`, `/p302`, `/p303` each open (even though they're mostly empty); tapping the dotted-underlined word on each opens an explanation that closes with Esc; the disclaimer shows on every page.
**Likely to go wrong:** the Vue scaffold landing in a nested folder; Vuetify installing as 4.x; fonts falling back to Times; the first Vercel import picking the wrong framework (it shouldn't; `vercel.json` pins it).

```text
PHASE 0 · FOUNDATION. This prompt is your go-ahead for Phase 0 only.

Read CLAUDE.md, STATUS.md, BRIEF.md and docs/briefs/*.md first. Follow CLAUDE.md exactly.

STEP 1: Prove the deploy check works before building anything
- Run `npm run check:deploy`. It should find a successful Production deployment for the current commit (the placeholder page). Report the result and the live URL it prints.
- If it fails, stop and tell me exactly what it printed. Don't try to fix Vercel settings from here.

STEP 2: Compare with Pelipper Post (READ-ONLY)
- Read these files in the Pelipper Post folder listed in CLAUDE.md §10: CLAUDE.md, the status doc (PELIPPER-POST-STATUS.md or similar), SETUP.md, CLAUDE-CODE-PROMPTS.md, scripts/validate-data.mjs, vercel.json, .claude/settings.local.json.
- NEVER edit, run write commands in, commit in, or push from that folder.
- Report, as a short list: any rule, check or pattern in those files that is missing from ours. Don't copy content. Don't change our docs yet; I'll rule on each item.
- If the folder doesn't exist, say so and skip this step.

STEP 3: Scaffold in the repo root
- Run `npm create vue@latest scaffold-tmp -- --ts --router` (non-interactive: TypeScript and Vue Router only; if it still asks questions, answer No to everything else). Move everything up into the repo root, MERGE package.json (keep all our existing scripts; replace our placeholder "build" with the scaffold's real build, which must include type-checking), and delete the temporary folder.
- Delete starter leftovers (HelloWorld, AboutView, logo, starter CSS). Delete scripts/placeholder-build.mjs.
- Install: vuetify@^3, vite-plugin-vuetify, @mdi/font, chart.js, vue-chartjs, @fontsource-variable/newsreader, @fontsource-variable/hanken-grotesk. Dev: @playwright/test, then `npx playwright install chromium`.
- Report the exact installed versions. Confirm Vuetify's major version is 3.

STEP 4: Design tokens and theme (src/shared/tokens/)
- Colors exactly as in BRIEF.md §6 (including the 5 chart colors) as CSS variables and as a Vuetify light theme named firstLeaf.
- Font variables --font-display, --font-text (Newsreader) and --font-ui (Hanken Grotesk), self-hosted via @fontsource. Tabular numbers in tables.
- Base background is cream; body text is ink.

STEP 5: Shared data and state (src/shared/)
- data/index.ts: typed loaders and TypeScript interfaces for every JSON file in src/shared/data/.
- composables/useScenario.ts: module-scope state; reads ?scenario=normal|all-clear|brand-new from the URL; looks up the scenario's accountId in scenarios.json and exposes THAT account (account.json, account-all-clear.json or account-new.json) plus attention[accountId] and activity[accountId]. Screens never import account.json directly.
- composables/useGlossary.ts: look up terms by id.

STEP 6: Shared components (src/shared/components/)
- TermTip.vue: the toggletip in BRIEF.md §5. A real <button> with a dotted underline; opens on click, tap, Enter or Space; closes on Esc, outside click and a close button; focus moves into the panel and back to the button on close; the content is announced to screen readers. Panel shows term, "also called", short line, detail, example, related words (each opens its own explanation) and the source link. Under 600px wide it opens as a bottom sheet.
- Disclaimer.vue: renders meta.disclaimer. Never retype the text.
- DemoMenu.vue: switches scenario (labels and descriptions from scenarios.json) and updates the URL.
- Money.vue: formats dollars; gains and losses show a sign AND the word "up"/"down", not color alone.
- SeverityBadge.vue: icon + word + color for needs-you / heads-up / fyi.

STEP 7: Landing page and routes
- Landing (/): the title "First Leaf", one short line, and three clearly labeled doors: "P301 · Operational dashboard", "P302 · Interactive data story", "P303 · Mobile experience". Each has the one-sentence description from BRIEF.md's "Find your brief" table. Disclaimer at the bottom.
- Router: every route in BRIEF.md §7, all lazy-loaded, plus a friendly 404 with links to the three doors.
- Route shells: /p301, /p302 and /p303 each show their title, one working TermTip (P301: "expense-ratio", P302: "compound-growth", P303: "returned-deposit"), and the Disclaimer. P301 and P303 also show the DemoMenu. Sub-routes show "Coming in Phase 1" plus the disclaimer.
- Landing and case-study folders import ONLY from src/shared (see CLAUDE.md §6).

STEP 8: Verify (paste the key output lines)
- npm run build · npm run validate · npm run validate:selftest · npm run check:boundaries · npm run check:boundaries:selftest
- Write tests/shared/termtip.spec.ts (Playwright): on each of /p301, /p302 and /p303 the TermTip opens with Enter, the panel text is visible, Esc closes it, and focus returns to the button. Run it and paste the result.
- Screenshots of /, /p301, /p302, /p303 at 390x844, 768x1024 and 1280x800. Look at them and describe what you see. Check that the fonts really are Newsreader and Hanken Grotesk (report the computed font-family of an h1 and a button).
- Measure and report the contrast of: body text on cream, the TermTip underline color on cream, the TermTip panel text, and the DemoMenu text.

STEP 9: Commit and push, in this order, each as its own commit
1. [shared] Scaffold Vue 3, Vite, TypeScript, Router and Vuetify 3 in the repo root
2. [shared] Add design tokens, self-hosted fonts and the First Leaf Vuetify theme
3. [shared] Add typed data loaders, scenario state and glossary lookup
4. [shared] Add TermTip, Disclaimer, DemoMenu, Money and SeverityBadge components
5. [shared] Add landing page with the three case-study doors and a 404 page
6. [P301] Add the weekly-review route shell with a working term explanation
7. [P302] Add the story route shell with a working term explanation
8. [P303] Add the check-in route shell with a working term explanation
9. [docs] Record Phase 0 in STATUS.md and add the live URL to README and STATUS
Push, then run npm run check:deploy and report the commit hash it confirms.

Then give me the end-of-phase report in the shape set out in CLAUDE.md §11.
```

---

## Phase 1 · Core flows (all three)

**Look at:** every flow in each brief's Interactions table works end to end, even if it looks plain.
**Likely to go wrong:** state resetting when you navigate (it must live at module scope); chart hover values that don't match the table; the practice account accidentally changing the real account.

```text
PHASE 1 · CORE FLOWS. This prompt is your go-ahead for Phase 1 only.

Read CLAUDE.md, STATUS.md and all three briefs. Build every flow in each brief's "Interactions" table so it works end to end. Use the design tokens, but don't polish visuals yet (that's Phase 3). Use the copy already in the data files; put any new sentences you need in your report under "Copy for approval".

SHARED FIRST
- src/shared/composables/usePractice.ts: module-scope practice portfolio. Starts with practice.json startingCash. Buy/sell at latestPrice, parts of shares allowed, min order $1, no fees. Validation errors: not enough pretend money, selling more than you own, $0/blank, non-numbers, more than 2 decimals. Reset. Time machine: value of the current practice mix over the weekly history. It must NEVER touch the real account data.
- src/shared/composables/useSeen.ts: session-scope "seen" flags for P303.
- src/shared/charts/: Chart.js registration, theme defaults from tokens, and a "Show as table" helper.

P301 (src/p301-dashboard/): Weekly review page with the layout in the P301 brief, then flows F1–F8: flag side panel with each flag's action (every money action opens a demo dialog that says nothing real happens; "See auto-invest settings" shows the paused status with a demo-only toggle), "New" badges from newSinceLastReview, Mark as handled with Undo (session state), term explanations, growth chart 1M/3M/All with a table view, funds list and fund pages (all 5 funds, including FL-CALM, which Rosa doesn't own), activity with combinable type + status filters and an empty result state (e.g. Dividends + Returned), Practice (buy, sell, review, confirm, "What you own in Practice", practice mix, time machine, start over, a persistent "Practice money, not real" banner), Words to know with search and an empty state, DemoMenu.

P302 (src/p302-story/): all 8 chapters from the P302 brief with the numbers from story-p302.json (never recompute differently from the validator's formula). The guess, the start-age slider (startAgeSlider: 18–45, step 1), Theo's monthly slider (catchUp.slider: $150–$300, step $1, with a marker where he passes Nia), the Smooth/Bumpy toggle (say "overall growth", never "average"), the chapter menu with #chapter-1…#chapter-8 anchors, "Skip to the answer", and "Show as table" under each chart. Chart pinned beside the text at 1024px and wider; inline per chapter below that.

P303 (src/p303-mobile/): check-in home, attention list and detail with "Seen" (flag details stay inside P303 and show related info inline, per the table in the P303 brief; never link into /p301), Why it moved (the waterfall adds up exactly: start + market + dividends + deposits = end, with the per-fund breakdown), Word of the day (meta.wordOfTheDay; Next word follows glossary order), Practice with a keypad and a review sheet, an opaque bottom tab bar (Check-in, Practice, Words), DemoMenu. Designed at 390x844.

TESTS: Playwright specs in tests/p301/, tests/p302/ and tests/p303/, one per flow, named after the flow IDs in the briefs (e.g. p301-F5-activity-filters.spec.ts). Run them all.

VERIFY: build, validate, validate:selftest, check:boundaries, all Playwright specs, screenshots at 390/768/1280 of every new screen (describe them). Confirm with a test that Practice never changes account data.

COMMITS (each its own):
[shared] Add practice-mode, seen-flags and chart-helper composables
[P301] Build the weekly review with the attention list and flag panel
[P301] Add funds, fund pages and activity with filters
[P301] Add Practice with the time machine, and Words to know
[P302] Build the eight-chapter story with the guess and chapter menu
[P302] Add the start-age and catch-up sliders and the smooth/bumpy toggle
[P303] Build the check-in home and the attention list and detail
[P303] Add Why it moved, Word of the day and mobile Practice
[docs] Record Phase 1 in STATUS.md
Push, run check:deploy, then give the CLAUDE.md §11 report.
```

---

## Phase 2 · Plain language (copy you approve)

**Look at:** `docs/copy/COPY-REVIEW.md`. Every sentence a learner reads, with its grade level. Mark anything you want changed.
**Likely to go wrong:** copy that's true in the normal scenario but false in *Brand-new* or *Nothing needs you*; labels without a unit ("High").

```text
PHASE 2 · PLAIN LANGUAGE. This prompt is your go-ahead for Phase 2 only.

Goal: every sentence a learner reads is short, true in every scenario, jargon-free, and approved by Alex.

1. Move every user-facing sentence out of the components into copy files: src/shared/copy.json, src/p301-dashboard/copy.json, src/p302-story/copy.json, src/p303-mobile/copy.json. Components read from them.
2. Extend scripts/validate-data.mjs with rule L5 "UI copy reads at grade 8 or below, uses no jargon and no advice language". It scans all four copy files with the same scorer, jargon list and advice patterns. Add broken cases to validator-selftest.mjs, show L5 FAIL first, then fix the copy until it PASSES.
3. Check every sentence against each demo scenario (normal, all-clear, brand-new). Any sentence that becomes untrue in a scenario needs a scenario-specific version.
4. Write docs/copy/COPY-REVIEW.md: a table per case study with Where it appears | Text | Grade | Status (DRAFT). Include the glossary and flag copy from the data files too.
5. Commit the move, the new rule and ONLY the copy changes needed to pass L5 and stay true in every scenario. Everything stays marked DRAFT. Don't make purely stylistic rewrites. Push, then show me COPY-REVIEW.md. I'll approve or edit, and my edits become a separate commit.

COMMITS: [shared] Move shared copy into copy.json and add validator rule L5 · [P301] Move dashboard copy into copy.json · [P302] Move story copy into copy.json · [P303] Move check-in copy into copy.json · [docs] Add the copy review table and record Phase 2 in STATUS.md
Then the CLAUDE.md §11 report.
```

---

## Phase 3 · Visual design

**Look at:** does it feel like *mid-century modern meets futuristic*, and like *finance for a nervous beginner*? Look at the dark panels, the glow, the grain, the illustrations and the serif numbers.
**Likely to go wrong:** tinted chips failing contrast; glow used decoratively (it must only mark the line to read first); illustrations that are too busy; Vuetify overriding custom styles.

```text
PHASE 3 · VISUAL DESIGN. This prompt is your go-ahead for Phase 3 only.

Apply BRIEF.md §6 across all three case studies.
- Cream pages, deep green-black data panels, lime highlights, serif (Newsreader) for big numbers and headlines, Hanken Grotesk for the interface. Pill buttons. At most two levels of cards.
- Charts (src/shared/charts/): a glow plugin used ONLY on the line to read first; a grain/gradient fill that means "money it earned" over a flat fill for "money you put in"; a halftone or stripe pattern per fund in mix charts, alongside the 5 tested chart colors. Plain-sentence summaries above each chart.
- Illustrations: download Open Peeps and/or Open Doodles SVGs (CC0) from their official sites into src/shared/illustrations/. If you can't download them, STOP and tell me; I'll download the zip. Draw the mid-century shapes (starbursts, boomerangs, atomic dots, halftone textures) as original SVG components. Use them for empty states, the landing doors and story chapter headers. No stock art.
- Motion: subtle and meaningful; fully respects prefers-reduced-motion.
- Fix layout problems with Vuetify props and utility classes; never !important.

VERIFY: measure and put into STATUS.md a contrast table for every text/background and icon/background pair actually rendered (including every chip and badge), plus a color-blind simulation (protanopia, deuteranopia, tritanopia) of each chart that uses categorical color. Screenshots at 390/768/1280 of every screen: describe them. build, validate, selftest, boundaries, all Playwright specs.

COMMITS: [shared] Apply the First Leaf theme, type scale and pill buttons · [shared] Add chart glow, grain and halftone plugins with summaries · [shared] Add mid-century SVG shapes and licensed illustrations · [P301] Apply visual design to the dashboard · [P302] Apply visual design to the story · [P303] Apply visual design to the check-in · [docs] Record measured contrast and Phase 3 in STATUS.md
Then the CLAUDE.md §11 report.
```

---

## Phase 4 · Edge cases, empty states, screen sizes

**Look at:** switch every demo scenario on P301 and P303; try to break Practice; resize to 320px and 1280px; zoom to 200%; use only the keyboard.
**Likely to go wrong:** layout jumps when the attention list is empty; charts with one data point; P303 stretching on desktop; P301 tables overflowing on phones.

```text
PHASE 4 · EDGE CASES AND SCREEN SIZES. This prompt is your go-ahead for Phase 4 only.

Work through every row of the "Edge cases and empty states" table in each brief, and the screen-size table in BRIEF.md §10.
- P301: brand-new, all-clear, a loss state, every Practice error, empty filters and search, a one-point chart; usable at 390, 768 and 1280.
- P302: slider extremes, no guess, deep links to each chapter (#chapter-1 to #chapter-8), reduced motion; 390 and 1280; landscape phone.
- P303: nothing-needs-you, brand-new, down-week copy, every Practice error, interrupted flow; 320, 390, 768, 1280 (the desktop view must not break).
- Everywhere: 200% zoom with no horizontal scroll (tables may scroll inside themselves); keyboard-only with visible focus; touch targets at least 48px on P303 and 24px elsewhere (measure and report).
Add a Playwright spec for each edge case. Screenshots of each state at each relevant width: describe them.

COMMITS: [shared] … (only if shared components change) · [P301] Handle empty, all-clear and error states and small screens · [P302] Handle slider extremes, deep links and reduced motion · [P303] Handle empty and error states from 320px to desktop · [docs] Record Phase 4 in STATUS.md
Then the CLAUDE.md §11 report.
```

---

## Phase 5 · Verification, one case study at a time

**Look at:** three separate reviewer reports, one per case study, each written as if the reviewer has never heard of the other two.
**Likely to go wrong:** the README block pointing at the wrong route; a brief that no longer matches what was built.

```text
PHASE 5 · VERIFICATION. This prompt is your go-ahead for Phase 5 only.

For EACH case study separately (P301, then P302, then P303), use a fresh subagent that is given: the live URL, that case study's README "For reviewers" block, BRIEF.md §1–3 and §6, and that case study's brief. For "does it work" and "does it look right" it judges ONLY that case study and must not read the other two briefs or case-study folders. For "is the repo set up right" it may look at the whole repo (root files, structure, commit history filtered by that case study's prefix), because that is what a real reviewer sees.
The subagent walks the case study like a Protogen reviewer, against:
- that brief's Definition of Done (every row), and
- the learner instructions' three dimensions: Does it work (1–3, 7–8), Is the repo set up right (9–13, 18–19), Does it look right and show thinking (20–22, 26–27).
It reports PASS / FAIL with evidence (screenshots, commands, measured values) for each row.

Then:
1. Fix every FAIL (brief-first if behavior changes: update the brief, commit, then fix).
2. Re-run the failed rows.
3. Make sure each brief matches what was built (rule B1 plus a read-through).
4. Final README: live links in every reviewer block; confirm every step in "Try these" works exactly as written.
5. STATUS.md: all phases ✅, final measured values, the full decision log, known issues.

COMMITS: [P301]/[P302]/[P303] fixes as needed · [docs] Final README reviewer blocks and STATUS for submission
Then give me the three reviewer reports and the CLAUDE.md §11 report.
```

---

## Redirect prompts (paste when something goes wrong)

**The live site shows old code**
```text
The live site isn't showing the latest change. Don't trust the Vercel badge. Run `npm run check:deploy` and paste its full output. If it times out in "Initializing", Vercel's free plan builds one project at a time across the whole account, so tell me and stop. If it failed, paste the build log link. Don't change vercel.json unless the log proves it's the cause.
```

**A layout or style fix "didn't take"**
```text
That style change didn't take effect. Vuetify's styles are probably overriding it. Inspect the element, report the computed style and which rule wins, then fix it with Vuetify props or utility classes, not !important. Take before/after screenshots at 390 and 1280 and describe them.
```

**Something looks low-contrast**
```text
Measure the contrast of every text/background and icon/background pair on this screen and paste a table with the ratios. Anything under 4.5:1 for text below 18px (or 3:1 for large text and icons) fails. Fix the failures by changing the pairing, not by deepening a tint of the same hue as the text. Re-measure and paste the new table.
```

**Copy became untrue or unclear**
```text
Some copy is wrong for the current situation. Check every sentence on this screen against all three demo scenarios (normal, all-clear, brand-new) and every filter state. List each sentence that becomes untrue, with a proposed rewrite at grade 8 or below. Don't apply the rewrites; show them to me for approval.
```

**You changed something the brief didn't ask for**
```text
This goes beyond the brief. List everything you did that isn't in BRIEF.md or the case study brief, and say why for each item. Don't undo anything yet. I'll rule on each item (ratify / decline / amend), and the rulings go into the STATUS.md decision log.
```

**Works in dev but the Vercel build fails**
```text
The Vercel build failed. Run `npm run build` locally, paste the first error, fix it, and run the build again until it passes. The dev server tolerates type errors the build rejects. Then push and run check:deploy.
```

**Resuming after a break**
```text
Read STATUS.md, CLAUDE.md and BRIEF.md. Summarize where we left off in 3–5 plain sentences, list any known issues, and tell me what NEXT STEP says. Then wait for my go-ahead.
```
