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

## Phase 0.5 · Rulings and guardrails

**What Alex should look at when it's done:** the rulings are recorded in STATUS.md and the briefs; `npm run check` runs every local check in one go; `check:deploy` prints https://first-leaf.vercel.app and runs `check:live`; term explanations have a "Back to …" button after a related word.
**Likely to go wrong:** a new check that has never been seen failing; the axe scan flagging Vuetify's own markup; the devtools plugin leaking into the production build.

```text
PHASE 0.5 · RULINGS AND GUARDRAILS. This prompt is your go-ahead for Phase 0.5 only.

Read CLAUDE.md and STATUS.md first. Follow CLAUDE.md exactly. Brief first: STEP 1 is docs only and is committed before any code changes.

STEP 1: Record Alex's rulings (docs only, one commit)
a. STATUS.md decision log, new entry "Sept. 24, 2026: Phase 0 rulings":
   - Ratified: three extra fix commits; Node ^22.18.0 || >=24.12.0; dev-only devtools plugin (must not ship in the production build: confirm in STEP 3); Playwright config + test:e2e + Demo menu test; per-route page titles; shared "Coming in Phase 1" page (temporary); favicon removal (original First Leaf icon comes in Phase 3, add to known issues).
   - Amended: related words in the explanation panel get a "Back to {previous term}" button.
   - Amended: P303 touch targets. Every standalone control stays at least 48x48px. Terms inside sentences use WCAG 2.5.8's inline exception ("the target is in a sentence or its size is otherwise constrained by the line-height of non-target text"). Every P303 detail screen also lists its terms as 48px chips under "Words on this screen". P303 body text line-height at least 1.6.
   - Adopted from the Pelipper Post comparison: live-site check; console-error and NaN/undefined guard on every test; icon-name check; Vuetify and scoped-style traps; percentage points for rate changes; 24px minimum gutter between number columns; CSS grid when a card count doesn't divide into 12; keep Vite chunk-size warnings visible and don't lazy-load first-screen content; merge every file the scaffold overwrote; .env* in .gitignore; every new check must be shown failing first. Documentation only: a last-resort manual deploy, labeled unverified.
   - Not a gap: "deny Write" for Pelipper. Claude Code checks file writes against Edit rules, and Edit is already denied. The real gap was Bash commands like cp/mv touching that folder; closed in STEP 2.
   - Copy: Phase 0 copy APPROVED with two edits: landing line becomes "A made-up investing app for people who have never invested. This site shows it as three design case studies." Money in sentences reads "up $15.57" / "down $5.88" (word, no sign). In tables and chart labels it reads "+$15.57" / "−$5.88", with the word "up"/"down" in the accessible label. Everything else in the Phase 0 copy list is approved as written.
b. docs/briefs/P303-BRIEF.md: replace the 48px bullet with the amended touch-target rule above, and add "Words on this screen" chips to the flag-detail and "Why it moved" screens.
c. BRIEF.md §5 copy rules: add the percentage-points rule (fee 0.45% → 0.75% is "0.30 percentage points", never "+67%") and the amended money format. BRIEF.md §6 layout rules: 24px minimum gutter between number columns; CSS grid when a card count doesn't divide into 12. BRIEF.md §9: replace the touch-target bullet with the amended rule.
d. CLAUDE.md: in §3 add npm run check:live (after check:deploy), the console/NaN guard, and "a new check must be shown failing, on screen, before app code changes". In §7 add: theme-based selectors silently fail in scoped styles; beating Vuetify takes a two-class selector, and watch rounded="lg" in component defaults and v-container's max-width caps; never silence Vite's chunk-size warning; don't lazy-load what the first screen needs; after any scaffold or generator, diff and merge every file it overwrote; verify every mdi- icon name against the installed font. In §8 the amended touch-target rule.
e. docs/SETUP.md and scripts/setup.sh: the Node check becomes "22.18 or newer (or 24.12+)". Run `bash -n scripts/setup.sh`.
f. .gitignore: add .env* (keep .env.example trackable if one is ever added).
g. docs/CLAUDE-CODE-PROMPTS.md: save this prompt as "Phase 0.5 · Rulings and guardrails" between Phase 0 and Phase 1, and add a redirect prompt "Vercel's build queue is stuck (last resort, unverified)": build locally with the Vercel CLI and deploy the prebuilt output, only if check:deploy shows the build stuck in the queue, and record it in the decision log.
Commit: [docs] Record Phase 0 rulings and amend the briefs, CLAUDE.md and setup docs

STEP 2: Guardrails (code)
1. Live-site check: add "firstLeaf": { "productionUrl": "https://first-leaf.vercel.app" } to package.json. Write scripts/check-live.mjs: fetch /, /p301, /p302, /p303, /p301/funds/FL-GREEN and /p303/learn/expense-ratio from the production URL (each must be 200 and return the app's HTML), then compare the /assets/*.js and *.css file names in the live index.html with a fresh local dist/index.html; they must match exactly. Add npm run check:live. Make check:deploy run check:live after a successful deploy and print the production URL, not the protected per-deployment URL. Show check:live FAILING first (e.g. against a deliberately different local build), then passing.
2. Test guard: a shared Playwright fixture used by every spec that fails the test on any console error or uncaught page error, and fails if visible text contains NaN, undefined, null or [object Object] as whole words. Show it failing on a temporary broken page, then remove that page.
3. Icon check: scripts/check-icons.mjs: every mdi-* class used in src/ exists in the installed @mdi/font CSS. Add --selftest with a fake bad name. npm run check:icons.
4. Accessibility scans: add @axe-core/playwright. Scan /, /p301, /p302, /p303 at 390 and 1280, plus the states with the explanation panel open and the Demo menu open. Zero serious or critical violations. Lock the open Demo menu's structure with a Playwright aria snapshot.
5. TermTip: add "Back to {previous term}" when you arrive via a related word (a small history stack). Focus goes to the new heading on forward and back to the related-word link on Back. Add a Playwright test.
6. Money.vue: apply the amended format (word in sentences; sign in tables with the word in the accessible label).
7. Permissions in .claude/settings.local.json: allow Bash(rm *), Bash(mv *), Bash(cp *), Bash(mkdir *), Bash(lsof *). Deny Bash(*pelipper*), Bash(rm -rf ~*), Bash(rm -rf /*), Bash(git branch -D*), Bash(git branch * -D*), Bash(git push *--delete*), Bash(git rebase*), Bash(git clean*), Bash(git commit --amend*), Bash(git filter-branch*). Keep every existing rule. Validate the JSON.
8. Add npm run check that runs, in order: build, validate, validate:selftest, check:boundaries, check:boundaries:selftest, check:icons, check:icons --selftest, test:e2e.
Commits, each its own:
[shared] Add a live-site check and point check:deploy at the public URL
[shared] Fail every test on console errors or NaN/undefined on screen
[shared] Add an icon-name check and axe accessibility scans
[shared] Add Back navigation to term explanations and the amended money format
[shared] Tighten Claude Code permissions for the reference folder and git history
[shared] Add npm run check as the one command for all local checks

STEP 3: Verify, then finish
- Paste the output of npm run check, check:deploy and check:live.
- Confirm the devtools plugin is not in the production build (search dist/ for it and paste the result).
- Diff our original files from the first commit (.gitignore, README.md, LICENSE, package.json scripts, CLAUDE.md, STATUS.md) against now and confirm nothing of ours was lost in the scaffold.
- Paste `git log --oneline` for every commit so far. If any Phase 0 commit subject is shorter than the one planned in docs/CLAUDE-CODE-PROMPTS.md, say so. Do NOT rewrite history.
- Commit: [docs] Record Phase 0.5 in STATUS.md. Push, run check:deploy, and give me the CLAUDE.md §11 report.
```

---

## Phase 0.6 · One app

**What Alex should look at when it's done:** the site opens straight into Rosa's app (no landing page); the rail at 1280, the top tabs at 768 and the bottom tab bar at 390; `/p301`, `/p302` and `/p303` redirect; About this demo; Phone preview at `/?view=phone`; the three rewritten lens briefs.
**Likely to go wrong:** tests and check:live still pointing at the old addresses; a feature importing another feature; the bottom tab bar covering the footer; the phone preview nesting itself.

```text
PHASE 0.6 · ONE APP. This prompt is your go-ahead for Phase 0.6 only.

Read CLAUDE.md, STATUS.md, BRIEF.md and docs/briefs/*.md first. Alex's ruling (Sept. 24): First Leaf is ONE app experience, not three sections. The three case studies are three lenses on the same product. Brief first: STEP 1 is docs only and is committed before any code changes.

THE NEW SHAPE (use this in the docs and the code)
- The site opens straight into the app (/ is Rosa's Home). No landing page with three doors.
- Routes: / (Home) · /alerts · /alerts/:id · /activity · /funds · /funds/:ticker · /story ("Your money story") · /practice · /learn · /learn/:termId · /about ("About this demo": who Rosa is, the disclaimer, the demo scenarios, and a short "For reviewers" map of where each case study lives) · 404. Old addresses redirect: /p301 → /, /p302 → /story, /p303 → /.
- Navigation: 1024px and up, a left rail (Home, Activity, Funds, Your money story, Practice, Words) plus a top bar (greeting, "Prices as of Fri., Sept. 18", Demo menu). 600–1023px, top tabs. Under 600px, an opaque top bar (wordmark, Demo menu) and an opaque bottom tab bar (Home, Activity, Story, Practice, Words) with 48px targets; Funds and Alerts are reached from Home. Footer on every page: disclaimer + "About this demo".
- Case-study lenses:
  P301 Operational dashboard = Home on a laptop (alerts first, balance, balance over time, mix, goal, this week) plus Alerts, Activity, Funds. Every alert has its action (demo dialogs for money actions), Mark as handled, New badges.
  P302 Interactive data story = /story. Point of view (state it on screen): "Right now, almost all of Rosa's balance is money she put in. Growth needs years, so starting early and staying steady matter more than picking the perfect moment." Chapters: (1) Seven months in: balance over time since March, drawn in; toggle "What you put in vs. what it earned". (2) Most of it is still your money: the share of the balance that is deposits. (3) The dip in July: what happened, when auto-invest was paused, what happened after; toggle to show or hide those events on the chart. (4) Where it is now: the mix, with a filter by stocks / bonds / cash. (5) What happens if you keep going: the Nia and Theo lesson (existing story-p302.json numbers, sliders, smooth/bumpy toggle) and Rosa's own 26-to-65 slider. (6) Try it with pretend money: a link into Practice. Time-range filter (1M / 3M / Since March) on the balance chart. Animations respect reduced motion. Practice (sandbox investing) and the learning moments (term explanations, Words) count toward P302.
  P303 Mobile experience = the same app under 600px, designed for a 60-second glance, not a shrunk desktop. Home becomes a check-in: balance, up/down this week, a small balance-over-time chart, a "needs you" card, "why it moved", the last 3 transactions, and word of the day. Everything else is one tap away. Alert details stay full-screen pages with "Words on this screen" chips. Touch-target rules stay as amended in Phase 0.5.
- Every claim in the story about Rosa's own data must be a checked validator rule, just like the Nia/Theo claims (implemented in Phase 1, defined in the brief now): the deposits share of her balance, the size and dates of the July dip, the auto-invest pause date, and anything the story says happened "after".

STEP 1: Docs only (brief first), one commit
a. BRIEF.md: rewrite §1–3 around "one app, three lenses" with the table above and the reasoning. Replace "Find your brief" with a table of where each case study lives in the app (the route and the screen size). Keep §4–§11, updating routes, the folder structure (below), the screen-size table and anything that says "three doors", "/p301", "/p302" or "/p303". Record the rejected alternative: "three separate sections behind a landing page. Rejected by Alex: it read as three projects, not one product."
b. Rewrite docs/briefs/P301-BRIEF.md, P302-BRIEF.md and P303-BRIEF.md as lens briefs. Keep each self-contained (Summary · The user · Data · Layout · Interactions · Edge cases · Nice to haves · Definition of Done mapped to LI numbers), as forward-looking decisions with reasons. P302 keeps every Nia/Theo rule and adds the Rosa chapters. P303 must say plainly why the phone layout is designed for the phone, not squeezed (quote the learner instructions' "not just about making things smaller"). Keep all brief-example blocks valid (npm run validate must pass); fix their paths if needed.
c. README "For reviewers": one block per case study with the live link to the right route, which screen size to use, the brief, and "Try these" steps that match the new routes. Update the repo map.
d. CLAUDE.md: new folder boundaries and commit-prefix rule (below). STATUS.md: decision-log entry for this ruling (including what we got wrong: three doors made it read as three projects), the decisions table, the phase table (add 0.6), NEXT STEP.
e. docs/CLAUDE-CODE-PROMPTS.md: save this prompt as "Phase 0.6 · One app". Mark the old Phase 1–5 prompts "SUPERSEDED: will be reissued for the one-app shape" (don't delete them).
Commit: [docs] Re-plan First Leaf as one app with three case-study lenses

STEP 2: Restructure the code (no new features)
- Folders: src/shared/ (unchanged role) · src/layouts/ (the desktop, tablet and phone shells and navigation) · src/features/<feature>/ for home, alerts, activity, funds, story, practice, learn, about. Features import only from src/shared/. Layouts may import from src/shared/ only (the router wires layouts and features together). Update scripts/check-boundaries.mjs for these rules and extend its --selftest with a feature-to-feature import that must fail.
- Commit prefixes from now on: [P301] Home-on-desktop, Alerts, Activity, Funds · [P302] Story, Practice, Learn · [P303] phone layout, phone navigation and phone-specific screens · [shared] shared code, data, tokens, layouts used at every size · [docs].
- Move the existing term-explanation demos into the new pages as placeholders ("Coming in Phase 1" plus the disclaimer). Delete the old landing page and the /p301, /p302 and /p303 shells; add the redirects. Build /about now (real copy, grade 8 or below, held for approval).
- Update every Playwright test, the axe scans, check:live's route list (/, /story, /activity, /funds/FL-GREEN, /learn/expense-ratio, /about, /p301 redirect) and the aria snapshot for the new structure.

STEP 3: Verify, then finish
- npm run check, check:deploy (with check:live). Screenshots of /, /story, /activity and /about at 390, 768 and 1280: describe them, including the rail, the tabs and the bottom tab bar.
- Measure: bottom-tab targets (at least 48x48), bar opacity, and contrast of the nav text.
- In the report, paste the Summary section of each rewritten brief (P301, P302, P303) word for word so Alex can review them.
Commits: [docs] (STEP 1) · [shared] Restructure into one app with shared layouts and feature folders · [P303] Add the phone shell with the bottom tab bar · [P301] Add the desktop rail and Home placeholder · [P302] Add Your money story and Practice placeholders · [shared] Add About this demo and redirects from the old case-study addresses · [docs] Record Phase 0.6 in STATUS.md
Push, run check:deploy, and give me the CLAUDE.md §11 report.
```

**Added during Phase 0.6 (Alex, Sept. 24):**

```text
ADD TO PHASE 0.6 · PHONE PREVIEW (Alex's ruling, Sept. 24)

Why: a P303 reviewer may never open the site on a real phone. They need a one-click way to see the real phone design on a laptop.

Brief first (include in the STEP 1 docs commit, or a separate [docs] commit before the code):
- BRIEF.md (navigation and §10 screen sizes) and the P303 brief: add "Phone preview". At 600px and wider, the top bar has a phone-icon toggle button, labeled "Preview on a phone" (aria-pressed on/off). On: the page shows the real app inside a generic rounded phone frame, 390x844 CSS px, centered on cream, with a "Back to full view" button beside it. It is NOT a mock-up: the frame is an iframe of the same app, so real phone breakpoints, bottom tabs and touch targets apply. It opens on the current route and demo scenario. The URL param ?view=phone opens it directly (shareable reviewer link). Hidden under 600px. The frame must not imitate any real device brand. Known limitation: Practice state is not shared between the full view and the phone view (separate app instances); the scenario is carried via the URL.
- README P303 block: primary link https://first-leaf.vercel.app/?view=phone, plus "or open the site on your phone". "Try these" starts with "Click the phone icon in the top bar, or use the link above."
- STATUS decision log: record the ruling and the limitation.

Code (commit as [P303] Add a phone preview so reviewers can see the phone design on a laptop):
- src/layouts/: a PhonePreview component and a top-bar toggle. The iframe src is the current route plus ?embed=phone&scenario=<current>. In embed mode the app hides the toggle and never nests another preview. Route changes in the full view while the preview is open update the iframe; ?view=phone opens it on load.
- Accessibility: the toggle is a real button with a visible label or tooltip and aria-pressed. The iframe has title="First Leaf on a phone". Focus moves into the frame on open and back to the toggle on close. Esc closes it. Respect reduced motion for any open/close animation.
- The frame itself: 390x844 screen area, rounded corners, a thin dark bezel, no notch or brand shapes. At 600–1023px scale it down to fit the viewport height, keeping the 390px layout inside (CSS transform on the frame, not a narrower iframe).
- Tests: toggle on/off; ?view=phone opens it; the preview shows the bottom tab bar and the phone Home; scenario carries over; no nested preview in embed mode; axe scan with the preview open. Add /?view=phone to check:live.
- Screenshots at 1280 and 768 with the preview open: describe them.
```

---

## Phase 1A · Core screens, as a real app

**What Alex should look at when it's done:** the laptop Home and Alerts (try a money flow, Mark as handled, Undo); /story chapters 1–4; the phone check-in at /?view=phone; all three scenarios by URL; nothing on screen reads as a project.
**Likely to go wrong:** a sentence that is false in one scenario; a story number that isn't a checked fact; a phone control under 48px; project language leaking back through a placeholder.

```text
PHASE 1A · CORE SCREENS, AS A REAL APP. This prompt is your go-ahead for Phase 1A only.

Read CLAUDE.md, STATUS.md, BRIEF.md and all three lens briefs first. Follow CLAUDE.md exactly. Build what the briefs describe; use tokens but don't polish visuals yet (Phase 3). All new sentences go in the report under "Copy for approval", marked DRAFT, each at grade 8 or below.

ALEX'S RULING (Sept. 24): inside the site, First Leaf must read like a real investing app. No "made up", "demo", "case study", "for this project", "fictional" or "for reviewers" language anywhere on screen. Reviewer and project explanations live only in README.md. The data rules behind the scenes do not loosen.

STEP 0: Rulings, docs and a commit guard (before any feature code)
a. STATUS.md decision log "Sept. 24: Phase 0.6 rulings":
   - Ratified: story follows the scenario; "Why it moved" opens in place on the phone Home; Alerts two-pane on laptop; Practice and Words in P302; app frame + Home load up front; preview frame scales on short desktop windows; 404 folder; sub-page redirects; skip link; corrected July dip numbers (Claude's planning error: it read every third row of the data).
   - Temporary: the story's 90% stand-in, replaced by rule R1 in this phase.
   - Amended: tablet Home must show "Prices as of Fri., Sept. 18".
   - Closed: related-word links are standalone controls, so under 600px they are at least 48x48px. Add to the P303 brief.
   - Copy approved: 404, top bar, skip link, nav labels.
   - Real-app ruling (this prompt). What we got wrong: the About page, the Demo menu and the "made up" copy made the site read as an exercise, not a product.
b. Docs for the real-app ruling: BRIEF.md, all three lens briefs, CLAUDE.md §5 and README.md.
   - The on-screen disclaimer becomes a footer disclosure: "Investing involves risk, including losing money you put in. First Leaf is a concept app: accounts, funds and prices shown are simulated. Nothing here is investment advice."
   - README keeps the full statement (fictional data, learning only, not financial advice), holds the whole reviewer map, and lists the scenario links for each case study: ?scenario=normal, ?scenario=all-clear, ?scenario=brand-new, plus /?view=phone for P303.
   - Remove About this demo from the routes, folders and brief tables. Demo scenarios are reached only by URL.
   - The phone toggle is labeled "Phone view".
   - Money actions end in realistic confirmations, never "nothing real happens" dialogs.
c. Commit guard: add .githooks/pre-commit running `npm run check`, and a "prepare" script that sets `git config core.hooksPath .githooks`. Add deny rules Bash(git commit *--no-verify*) and Bash(git push *--no-verify*). Show the hook blocking a commit with a deliberately failing test, then remove the failure.
Commits: [docs] Record the Phase 0.6 rulings and make First Leaf read as a real app · [shared] Run all checks before every commit

STEP 1: Shared foundations
- Data (change scripts/generate-data.mjs and glossary.json, then validate; never hand-edit generated JSON):
  - meta.disclaimer = the footer disclosure.
  - Remove "made-up" / "made up" / "demo" from every learner-facing string. Fund descriptions: "It owns bits of about 3,000 U.S. companies, big and small." (and the same pattern for the others). Story note: "An example rate of 6% a year. Real markets go up and down, and nobody can promise a rate." Nia and Theo are "two friends". yourTurn.note: "This is an example, not a plan or advice." practice.timeMachine.note: drop "made-up" and keep "The past does not tell you what will happen next."
  - Glossary: delete the "made-up" term and every link to it. Ticker detail: "Real tickers are a few letters long. First Leaf funds all start with FL-." Rewrite any other line that mentions a demo or made-up data. Keep "Practice" (pretend money is a real app feature).
  - Keep fictional:true on every fund, person and account.
- Validator (scripts/validate-data.mjs), each change with broken cases in validator-selftest.mjs, shown FAILING first, then passing:
  - Implement R1–R4 (Rosa's story claims as defined in BRIEF.md). Generate any numbers the story needs in the generator. Replace the story's 90% stand-in with R1's data.
  - S3: the footer disclosure must say "risk", "simulated" and "not investment advice".
  - New G6 "No project language on screen": fail if any learner-facing string contains made up / made-up / demo / case study / this project / for reviewers / fictional. Scenario descriptions are reviewer-only (README) and are exempt, but keep them plain.
  - T4 now requires "example" and "nobody can promise". Update X1 and L1 for the removed glossary term. G1–G5 stay unchanged.
- Remove from the UI: the About page, its route (/about redirects to /), its footer link and its tests; the Demo menu (useScenario still reads ?scenario= and carries it through navigation and into the phone view); the phone preview's explanatory notes (keep only "Practice here is kept apart from the full view", shown only while Practice is open). Rename the phone toggle to "Phone view" with the same accessibility rules.
- src/shared/composables/:
  - useHandled: module scope; handled alerts plus Undo; survives navigation; resets on reload.
  - useSession: module scope; realistic session-only state from money actions, e.g. a Pending deposit in Activity, "Auto-invest: On" after turning it on. The data files never change; reload resets it.
- src/shared/charts/: Chart.js registration, token colors, a plain-sentence summary above every chart, "Show as table", values read out in words on hover, focus or tap. The table and the chart come from the same series.
- Money and SeverityBadge now appear on real pages: measure their rendered contrast and report it.

STEP 2: P301 lens (laptop, 1024px and up)
- Home: the layout in the P301 brief.
  - Alerts first: severity word + icon + color, New badges, count.
  - Balance panel: balance, up/down vs. money put in, this week, auto-invest status.
  - Balance over time: 1M / 3M / Since March; "What you put in" vs. "What it earned" layers; table.
  - Your mix: now vs. the mix you set.
  - Goal: money put in vs. plan, deposits only.
  - This week: start → market → dividends → end, adding up to the cent.
- Alerts at /alerts and /alerts/:id: two panes, deep links work.
  - Detail shows what happened, what it means (term explanations) and what you can do.
  - Every money action is a realistic flow: review → confirm → confirmation, with session state. "Try the deposit again" ends with "Deposit requested. It usually arrives in 1–3 business days." and a Pending deposit in Activity. "Add a one-time deposit" is the same flow with the amount prefilled. "See auto-invest settings" shows the paused status with a working session-only On/Off toggle and a confirmation.
  - Mark as handled, with Undo; handled alerts collapse into a "Handled" group.
- Every scenario: the calm account shows "Nothing needs you this week" with the FYI under "Just so you know"; the brand-new account shows a welcome state; no sentence is false in any scenario.

STEP 3: P302 lens (/story chapters 1–4)
- Chapter 1 "Seven months in": balance since March, drawn in (reduced motion: shown whole), with the toggle "What you put in / What it earned" and the 1M / 3M / Since March filter.
- Chapter 2 "Most of it is still your money": the deposits share of her balance (R1).
- Chapter 3 "The dip in July": the dip's dates and size and the auto-invest pause (R2–R4), with a toggle to show or hide those events on the chart.
- Chapter 4 "Where it is now": the mix, with a stocks / bonds / reserve / cash filter.
- The point of view on screen, exactly as in the P302 brief. A chapter menu with #chapter-1 to #chapter-4 anchors. Chapters 5–6 show "Coming soon" (no project language).
- Every chart: summary sentence, table, keyboard access. Every claim comes from checked data.

STEP 4: P303 lens (under 600px, and inside the phone view)
- Phone Home check-in: balance, up/down this week, a small balance-over-time chart, the "needs you" card (count + top alert), "Why it moved" opening in place (market, dividends, deposits, and per fund, adding up to the cent), the last 3 transactions, and word of the day (meta.wordOfTheDay) with "Next word" in glossary order.
- Alert detail as a full page: what happened, what it means, what you can do (the same realistic flows), Mark as handled, and "Words on this screen" as 48px chips. Opened alerts show "Seen".
- Term explanations as a bottom sheet; related-word links at least 48x48px.
- Every scenario (by URL) works on the phone Home.

STEP 5: Verify
- npm run check (including R1–R4, S3, G6, T4 and their broken cases), then check:deploy with check:live. Update check:live's routes: remove /about (now a redirect to /) and add every new route.
- Search the built app's on-screen text for made up, demo, case study, project, reviewer and fictional, and paste the result. It must be empty apart from the footer's "concept app".
- Playwright tests named after the flow IDs in each brief, plus: handled state and session state survive navigation and reset on reload; chart table values equal the chart's data; every scenario's Home has no false sentence (assert the visible numbers against the data); the Demo menu and About page are gone; ?scenario= carries into the phone view.
- axe scans on every new page and state, at 390 and 1280, and with the phone view open.
- Screenshots of Home, /alerts, /alerts/deposit-returned and /story at 390, 768 and 1280, in all three scenarios (by URL): describe them.
- Measure: every new chip, badge and button (contrast and size), the gutter between number columns (at least 24px), and the grade of every new sentence.

COMMITS (each its own; the hook runs all checks before each):
[docs] Record the Phase 0.6 rulings and make First Leaf read as a real app
[shared] Run all checks before every commit
[shared] Replace the disclaimer and project language, and add rules R1–R4, G6 to the data checker
[shared] Remove About and the Demo menu, keep scenarios by URL, rename Phone view
[shared] Add handled-alert and session state, and chart helpers with summaries and tables
[P301] Build the laptop Home with alerts first, balance over time, mix, goal and this week
[P301] Build Alerts with realistic money flows and Mark as handled
[P302] Build story chapters 1–4 on Rosa's own data, with toggles and filters
[P303] Build the phone check-in Home with Why it moved and word of the day
[P303] Build phone alert details with words-on-this-screen chips
[docs] Record Phase 1A in STATUS.md
Push, run check:deploy, and give me the CLAUDE.md §11 report.
```

---

## Phase 1 · Core flows (all three)

> **SUPERSEDED: will be reissued for the one-app shape** (Sept. 24, 2026). Kept for the record; don't run it as written.

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

> **SUPERSEDED: will be reissued for the one-app shape** (Sept. 24, 2026). Kept for the record; don't run it as written.

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

> **SUPERSEDED: will be reissued for the one-app shape** (Sept. 24, 2026). Kept for the record; don't run it as written.

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

> **SUPERSEDED: will be reissued for the one-app shape** (Sept. 24, 2026). Kept for the record; don't run it as written.

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

> **SUPERSEDED: will be reissued for the one-app shape** (Sept. 24, 2026). Kept for the record; don't run it as written.

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

**Vercel's build queue is stuck (last resort, unverified)**
```text
Use this ONLY if `npm run check:deploy` timed out with the build stuck in the queue ("Initializing" or "Queued") because another project on the same Vercel account holds the one build slot, and it can't wait. This route has never been tried on this project, so treat it as unverified. Build locally with the Vercel CLI and deploy the prebuilt output: `npx vercel pull --yes --environment=production`, then `npx vercel build --prod`, then `npx vercel deploy --prebuilt --prod`. Then run `npm run check:live` to prove the live site serves the same build as local. Record it in the STATUS.md decision log: the date, why the queue was stuck, the commands you ran and their output, and whether check:live passed. Don't change vercel.json or any Vercel settings.
```

**Works in dev but the Vercel build fails**
```text
The Vercel build failed. Run `npm run build` locally, paste the first error, fix it, and run the build again until it passes. The dev server tolerates type errors the build rejects. Then push and run check:deploy.
```

**Resuming after a break**
```text
Read STATUS.md, CLAUDE.md and BRIEF.md. Summarize where we left off in 3–5 plain sentences, list any known issues, and tell me what NEXT STEP says. Then wait for my go-ahead.
```
