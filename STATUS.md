# STATUS: First Leaf (P301 · P302 · P303)

> **Any Claude reading this: read this whole file first.** Then summarize where we left off in 3–5 plain sentences, and **wait for Alex's go-ahead** before changing anything. Update this file at the end of every phase: the phase table, NEXT STEP, the decision log, and known issues.

**Last updated:** Sept. 24, 2026 (Phase 0.5 · Rulings and guardrails)

## NEXT STEP

Alex reviews Phase 0.5:
- "Back to …" in a term explanation (open "yearly fee" on /p301, then a related word)
- the Demo menu
- the approved landing line

Then he rules on the deviations in the Phase 0.5 decision-log entry (especially the permissions file that was never committed, and the related-word link height on P303). Then he pastes the **Phase 1** prompt from `docs/CLAUDE-CODE-PROMPTS.md`. From now on, `npm run check` is the one local gate, and `check:deploy` runs `check:live` itself.

## Live links

| What | Link |
|---|---|
| GitHub repo | https://github.com/alexanderquijada/first-leaf |
| Live site | https://first-leaf.vercel.app |
| P301 | https://first-leaf.vercel.app/p301 |
| P302 | https://first-leaf.vercel.app/p302 |
| P303 | https://first-leaf.vercel.app/p303 |

## Decisions already made (do not relitigate)

| Decision | Choice | Why |
|---|---|---|
| Project shape | One product, one repo, one site for P301, P302 and P303 | Stronger portfolio piece; each case study still stands alone |
| Product | **First Leaf**, a made-up beginner investing app by made-up *First Leaf Investing* | No clash with any finance brand found in a web check (Sept. 23) |
| Person | **Rosa**, 26, dental hygienist, Tucson (fictional), 7 months into her first account | One person, three moments; see BRIEF.md §2 |
| P301 user | **Rosa's own dashboard**: the person who runs the account is its owner | Alex's call. It's operational because it surfaces what's off first and lets her act |
| P301/P303 interactivity | Lots: pages, pop-ups, actions on flags, filters, practice trading | Alex: "lots of interaction… things to click… fake sandbox investing" |
| Account type | A real (fictional) starter account **plus** a Practice space with pretend money | The real account reads as financial services; Practice gives the sandbox without advice risk |
| Demo scenarios | Three accounts: normal, all-clear, brand-new; flags generated from rules per account | Every sentence must stay true in every scenario |
| Auto-invest | Rosa paused it on July 14 after a price dip; the Aug. 3 deposit waits as cash | Explains the waiting cash honestly; turning it back on is her choice |
| Goal | "Put in my first $2,000" by Feb. 1, 2027; counts deposits only | One measure; the plan reaches it exactly; the market can't make her "behind" |
| P302 story | "Start early beats start big" | Alex's pick |
| P303 task | 60-second check-in; flags never leave P303 | Alex's pick; stand-alone review |
| Palette | Cream + deep green-black data panels + lime highlights, near-black text | Alex's pick; blends mid-century and futuristic |
| Fonts | Free stand-ins (Newsreader, Hanken Grotesk) now; Klim Financier/National swap later if licensed | Klim's test fonts can't be published; web licenses start at $60/style |
| Imagery | Open Peeps / Open Doodles (CC0) + original mid-century SVG drawn in code; MDI icons for controls | Clean licenses for a public portfolio |
| Stack | Vue 3 + Vite + TS + Vue Router + Vuetify 3 (pinned) + Chart.js/vue-chartjs; static JSON; composables | Proven on Pelipper Post |
| Hosting | Vercel, **Pelipper Post's Vercel account** | Alex's pick |
| Deploy check | GitHub Deployments API (`npm run check:deploy`), not the Vercel badge | Stale deployments show green while serving old code |
| Password | **Deferred.** Don't build it, don't raise it | Alex's call; one router + one Vercel project keeps a later gate easy |

## Phase table (grouped by case study)

| Phase | Shared | P301 dashboard | P302 story | P303 mobile |
|---|---|---|---|---|
| Plan (Sept. 23) | ✅ Briefs, data (3 accounts), validator (42 rules, 65 broken cases), AI docs, setup script | ✅ Brief | ✅ Brief | ✅ Brief |
| 0 · Foundation (Sept. 24) | ✅ Scaffold, tokens, fonts, TermTip, Disclaimer, DemoMenu, Money, SeverityBadge, landing, 404 | ✅ Route shell | ✅ Route shell | ✅ Route shell |
| 0.5 · Rulings and guardrails (Sept. 24) | ✅ check:live, test guard, check:icons, axe scans, Demo menu semantics, TermTip Back, money format, permissions, `npm run check` | — | — | — |
| 1 · Core flows | ⬜ Shared composables | ⬜ F1–F8 | ⬜ 8 chapters, guess, sliders, toggle | ⬜ F1–F6 |
| 2 · Plain language | ⬜ Copy files + validator rule L5 for UI copy | ⬜ Copy approved | ⬜ Copy approved | ⬜ Copy approved |
| 3 · Visual design | ⬜ Tokens applied, chart glow/grain/halftone, illustrations | ⬜ | ⬜ | ⬜ |
| 4 · Edge cases + sizes | ⬜ | ⬜ Scenarios, errors, 390/768/1280 | ⬜ Extremes, deep links, 390/768/1280 | ⬜ Scenarios, errors, 320–1280 |
| 5 · Verification | ⬜ README final | ⬜ Walked vs. own DoD | ⬜ Walked vs. own DoD | ⬜ Walked vs. own DoD |

## Environment

| | |
|---|---|
| Machine | Alex's MacBook Pro (Apple silicon) |
| Project folder | `~/Projects/first-leaf` |
| Reference (read-only) | Pelipper Post at `~/Projects/pelipper-post` |
| Tools | Homebrew, Node (22.18 or newer, or 24.12+), Git, GitHub CLI, Claude Code in VS Code (installed/checked by `setup.sh`) |
| Accounts | GitHub (logged in via `gh`); Vercel (Pelipper Post's account); Claude Code (confirm with `/status`) |

## Decision log

Newest first. Include what we got wrong and why.

### Sept. 24, 2026: Phase 0.5 · Rulings and guardrails

- **The rulings were recorded brief first** (`16125fe`, docs only), before any code changed.
- **New guardrails, each shown failing first:**
  - **`check:live`:** six pages must return 200 with the app's HTML, and the live asset file names must match a fresh local build.
    - It failed (exit 1) against a deliberately different local build, and against a site that isn't ours.
    - `check:deploy` now prints https://first-leaf.vercel.app and runs `check:live`.
  - **Test guard (`tests/fixtures.ts`):** fails any test on a console error, an uncaught error, or NaN/undefined/null/[object Object] on screen.
    - It caught all five breakages on a temporary broken page (since removed).
    - A meta-test fails if a spec skips the guard.
  - **`check:icons`:** its self-test catches a fake name, and a misspelled real icon failed.
  - **axe scans (WCAG 2.2 AA, zero serious or critical):** 4 pages × 2 widths, plus the open panel and the open Demo menu. They failed on a deliberately low-contrast token.
  - **`npm run check`:** stops with exit 1 at the first failing step.
- **Caught: the aria snapshot found a defect axe missed.**
  - Vuetify puts `aria-owns` on the menu button, which pulled the whole list into the button's accessible name ("Demo: Rosa, 7 months in Rosa, 7 months in The main demo…").
  - The choices were plain list items under `aria-haspopup="menu"`.
  - Now: the button keeps its own name, and the choices are a "Demo scenarios" menu of radio items with the current one checked.
  - The snapshot fails on the old markup and passes on the new.
- **Caught: `.claude/settings.local.json` had never been committed.** A global git ignore on Alex's machine (`~/.config/git/ignore`) excludes `**/.claude/settings.local.json`, so the "committed on purpose" note was untrue from the first commit. It's now force-added and tracked (`c9ae855`). Other machines with the same global ignore still track it, because git only ignores untracked files.
- **TermTip Back:**
  - After a related word, "Back to {previous term}" appears (48px tall). It sends focus to the related-word link; going forward sends focus to the new heading.
  - Tab stays inside the panel from the heading too.
- **Money:** the approved format. It was checked on a temporary probe page, since Money isn't on a real page yet:
  - in sentences: "up $15.57" in forest, "down $5.88" in terracotta
  - in tables: "+$15.57" / "−$5.88", read as "up $15.57" / "down $5.88"
- **Deviations (for Alex to rule on):**
  - `check:icons:selftest` is its own script, matching `check:boundaries:selftest`. `npm run check:icons -- --selftest` also works.
  - The Demo menu's semantics fix went into the icon-and-axe commit, because the aria snapshot that found it belongs there.
  - The Demo menu has a new accessible name, "Demo scenarios". It's screen-reader-only copy, **DRAFT**.
  - The Back button's wording "Back to {term}" was set by the ruling; its arrow icon is `mdi-arrow-left`.
  - The approved landing line went in with the TermTip/Money commit.
  - BRIEF.md §9 and CLAUDE.md §8 said "sign + word + color" for gains and losses. Both were changed to match the money ruling.
  - `setup.sh`'s embedded payload (a snapshot of the first commit) was left as it was; only its live Node check changed.
- **Verified:**
  - Nothing of ours was lost in the scaffold (diff against `eb30959`: only filled placeholders and ruled amendments were removed).
  - The devtools plugin is not in `dist/` (0 matches for "devtools").
  - All nine Phase 0 commit subjects match the plan exactly.

### Sept. 24, 2026: Phase 0 rulings

Alex ruled on the Phase 0 deviations, the Pelipper Post comparison and the Phase 0 copy.

- **Ratified:**
  - the three extra fix commits
  - `engines.node` `^22.18.0 || >=24.12.0`
  - the dev-only devtools plugin (it must not ship in the production build; confirmed in Phase 0.5)
  - the Playwright config, `test:e2e` and the Demo menu test
  - per-route page titles
  - the shared "Coming in Phase 1" page (temporary)
  - the favicon removal (an original First Leaf icon comes in Phase 3)
- **Amended: related words.** A related word in the explanation panel gets a "Back to {previous term}" button.
- **Amended: P303 touch targets.**
  - Every standalone control stays at least 48×48px.
  - A term inside a sentence uses WCAG 2.5.8's inline exception ("the target is in a sentence or its size is otherwise constrained by the line-height of non-target text").
  - Every P303 detail screen also lists its terms as 48px chips under "Words on this screen".
  - P303 body text has a line-height of at least 1.6.
  - Recorded in the P303 brief, BRIEF.md §9 and CLAUDE.md §8.
- **Adopted from the Pelipper Post comparison:**
  - a live-site check (`check:live`)
  - a console-error and NaN/undefined guard on every test
  - an icon-name check
  - the Vuetify and scoped-style traps (CLAUDE.md §7)
  - percentage points for rate changes (BRIEF.md §5)
  - a 24px minimum gutter between number columns, and a CSS grid when a card count doesn't divide into 12 (BRIEF.md §6)
  - Vite chunk-size warnings stay visible, and first-screen content is not lazy-loaded
  - after any scaffold or generator, merge every file it overwrote
  - `.env*` in `.gitignore`
  - every new check is shown failing first
  - *Documentation only:* a last-resort manual deploy, labeled unverified (redirect prompt in `docs/CLAUDE-CODE-PROMPTS.md`).
- **Not a gap: "deny Write" for Pelipper.** Claude Code checks file writes against the Edit rules, and Edit is already denied. The real gap was Bash commands like `cp`/`mv` touching that folder, closed in Phase 0.5.
- **Copy: the Phase 0 copy is APPROVED, with two edits.**
  - The landing line becomes "A made-up investing app for people who have never invested. This site shows it as three design case studies."
  - Money in sentences reads "up $15.57" / "down $5.88" (a word, no sign). In tables and chart labels it reads "+$15.57" / "−$5.88", with "up"/"down" in the accessible label.
  - This replaces "sign + word + color" in BRIEF.md §5 and §9 and CLAUDE.md §8, which were updated to match.
- **Node check:** `setup.sh` and `docs/SETUP.md` now require Node 22.18 or newer (or 24.12+).

### Sept. 24, 2026: Phase 0 · Foundation

- **The deploy check works.** Before any code, `check:deploy` confirmed commit `eb30959` (the placeholder) live on Production. The per-deployment URL it prints (`first-leaf-…-alex-quijada-s-projects.vercel.app`) redirects (302), probably because of Vercel's deployment protection. The public URL is **https://first-leaf.vercel.app**, which served the placeholder's "First Leaf" heading.
- **Installed versions:** vue 3.5.43, vue-router 5.3.1, **vuetify 3.13.5** (major 3, as required), vite-plugin-vuetify 2.1.3, @mdi/font 7.4.47, chart.js 4.5.1, vue-chartjs 5.3.4, @fontsource-variable/newsreader 5.3.0, @fontsource-variable/hanken-grotesk 5.3.0, @playwright/test 1.63.0, vite 8.3.1, typescript 6.0.3, vue-tsc 3.3.11.
- **One source for tokens.** `src/shared/tokens/tokens.ts` holds every color and font stack. It writes the CSS variables (`--color-*`, `--chart-fl-*`, `--font-display|text|ui`) and feeds the `firstLeaf` Vuetify theme, so the two can't drift apart.
- **Caught: Vuetify quietly lowered text contrast.** By default it draws text at 87% opacity (secondary text at 60%). The theme sets both to 100%, because our muted color is its own measured token. Measured ink on cream: 16.33:1.
- **Found by measuring, fixed in their own commits** (all after the planned shells):
  1. *Two `<main>` landmarks on every page.* Vuetify's `v-main` renders a `<main>` around each page's own `<main>`. It now renders as a `div`.
  2. *Keyboard focus got lost after a Demo menu choice.* It fell onto the page body. A `ref` inside Vuetify's activator slot is never set, so the first fix didn't work. Focus now returns to the Demo button once the menu has closed. A Playwright test was shown to fail on the old code first.
  3. *The landing doors wrapped 2 + 1 at 768px,* leaving a large empty gap. They're now one column below 900px and three across above it.
  4. *One-word last lines:* "big" alone on P302's headline at 1280px, and "1." alone on P303 at 390px. Headlines now use balanced wrapping, and P303 keeps "Phase&nbsp;1" together.
  5. *The landing line scored grade 8.4* (limit 8). It's now two sentences, grade 4.9.
- **Deviations (for Alex to rule on):**
  - Three extra `[shared]` fix commits after the nine planned ones. History can't be rewritten, so the fixes couldn't be folded into earlier commits.
  - `engines.node` is now `^22.18.0 || >=24.12.0`, the scaffold's requirement for Vite 8 and TypeScript 6. It was `>=20`.
  - Kept the scaffold's `vite-plugin-vue-devtools` (dev server only). Removed Vue's favicon along with the other starter files; there's no First Leaf favicon yet.
  - Added `playwright.config.ts` (tests run against the production build), a `test:e2e` script, and `tests/shared/demomenu.spec.ts`, which wasn't asked for, to hold the focus fix in place.
  - Added a page title per route ("Activity · First Leaf") for tabs and screen readers.
  - A related word in a term explanation replaces the panel's content. There's no Back button; Esc returns to the original word.
  - The sub-routes use one shared "Coming in Phase 1" page (`src/shared/components/ComingSoon.vue`) instead of a placeholder per case study.
- **Pelipper Post comparison (read-only):** 13 gaps and some permission differences, reported to Alex for a ruling. Nothing was copied, and our docs haven't changed yet.

### Sept. 23, 2026: independent review of the plan (before any code)

A separate reviewer agent, with no knowledge of how the plan was made, read every brief against the learner instructions. It found **3 blocking issues and 9 important ones**. All were fixed the same day. Each fix is now a broken case in the validator self-test (marked "REVIEW FINDING"), so it can't come back.

- **Blocking: "Nothing needs you" lied.** That scenario reused the normal account, so its goal card still said "$150 behind." **What we got wrong:** scenarios were a filter over one account's flags, not separate accounts. **Fix:** every scenario now has its own account, flags are *generated from rules* per account, and rule N2 checks each flag appears exactly when the facts call for it.
- **Blocking: a README step couldn't be done** ("filter to a status with no results": deposits only had two statuses). Rewritten to a step that works (Dividends + Returned).
- **Blocking: P301's framing read as gaming the rubric.** The brief said a staff role was "safer for the word 'operational'." Rewritten as a positive decision ("the person who runs the account is its owner"). We also added an action to every flag, "Mark as handled", "New since last Sunday" badges, and a table mapping the instructions' Financial Services example to the dashboard.
- **The goal mixed two measures** (progress by balance, pace by deposits), and the plan couldn't reach it ($2,300 of $2,500). Now it's one measure: "Put in my first $2,000 by Feb. 1, 2027." The plan reaches it exactly (rule A11).
- **Uninvested August cash had no explanation.** Added auto-invest: Rosa paused it on July 14 after a real dip in the data (FL-BROAD $89.80 → $85.06). Rule A14 checks it.
- **P302's bumpy version staged a late crash** (−29% near 65) and called the growth an "average" (the simple average was 7%, not 6%). Now it says "overall growth", no year is worse than −20%, there's no drawdown over 25%, and both endings land within 15% of the smooth ones (rule T3).
- **Finance wording:** "Cash is safe", "Try it with pretend money first" (implies doing it for real next), "Compare fees" (a nudge to switch), "Most people guess Theo" (unsupported), and SEC citations on app-only terms. All removed; G3 now blocks the patterns.
- **Reading level didn't cover everything.** Fund descriptions (FL-GREEN was grade 10.7), examples and scenario text weren't scored. L2 now covers every learner-facing text in the data (87 texts; highest 7.4, median 3.4).
- **Smaller fixes:** "FL-CASH / Cash Reserve Fund" was confusable with cash in the account, so it was renamed FL-CALM "Calm Reserve Fund". Touch targets are unified at 48px on P303. P302's pinned chart starts at 1024px everywhere. Theo's slider steps by $1 so it can land on $196. The time machine starts on the first real price. The Phase 0/2/5 prompts were clarified. US spellings throughout.

### Sept. 23, 2026: planning session (claude.ai, before any code)

- **Validator caught three real defects before a line of UI existed.**
  1. *One-cent drift:* the daily balance history added up unrounded fund values, so "this week" ended at $1,313.73 while the balance said $1,313.72. Fixed in the generator; kept as a broken case (A8, A10).
  2. *Grade 9.5 copy:* the P302 point-of-view sentence was above our grade-8 limit. Rewritten as two sentences (L2).
  3. *Per-fund pieces didn't add up:* the "why it moved" breakdown summed to $15.09 against a $15.07 total. The rule had a 5-cent tolerance, which was **wrong**: P303 promises the pieces add up exactly. Tightened to the cent; the generator assigns the rounding remainder (A10).
- **The self-test caught a mislabeled check.** The one-cent drift was first filed under A3 (balance = funds + cash). The self-test showed A3 doesn't catch it; A8 and A10 do. Relabeled.
- **We got the P301 risk wrong at first.** Claude first proposed a staff role for P301 and called a beginner-owned P301 "the biggest risk." Alex pointed out that the instructions allow "any role" and that reviewers grade against our own brief. He was right. The dashboard is operational through its job: catching problems early.
- **Alex expanded P301/P303 interactivity:** pages to click into, pop-ups, and a Practice sandbox with pretend money, alongside the fictional real account.
- **Fonts:** Alex asked for Klim's Financier Display, Financier Text and National. These are paid fonts (the test fonts are evaluation-only). We build with free stand-ins behind font tokens.
- **Palette checks:** the lighter leaf green (#2E7D4F, 4.4:1) and mustard (#8A6A00, 4.5:1) failed text contrast on cream, so both were darkened. The first categorical chart palette collapsed sky and lilac under red-green color blindness (ΔE 5). Replaced; the worst pair is now ΔE 17.
- **Seed choice:** the first random seed left Rosa down $18 overall. We picked a seed where she is up $63.72 (5.1%) so the default mood is calm. FL-GREEN is still down $6.37, so a loss state appears naturally.

## Known issues / open items

- ~~TermTip buttons inside a sentence are 29px tall~~ **Ruled Sept. 24:** the inline exception applies, and P303 detail screens add 48px "Words on this screen" chips (built in Phase 1).
- **No favicon yet.** Vue's was removed in Phase 0; an original First Leaf icon comes in Phase 3.
- **`scripts/setup.sh` embeds a snapshot of the first commit's files** (its payload). Only its live Node check was updated; the payload stays as it was on Sept. 23, because setup has already run.
- **Money and SeverityBadge aren't on any page yet.** They're built but not rendered, so their colors (terracotta losses, mustard "Heads-up") will be measured in the rendered UI in Phase 1.
- ~~Demo menu semantics~~ **Fixed Sept. 24:** a labelled menu of `menuitemradio` items, locked by an aria snapshot. A pass with a real screen reader (VoiceOver) is still worth doing.
- **Related-word links in the explanation panel are about 27px tall** (71×27 measured). On desktop that's above the 24px minimum. On P303's bottom sheet, the amended rule may count them as standalone controls that need 48px. Needs a ruling before P303's Phase 1 screens.
- **Bundle:** the shared data loaders currently land in one 55 kB chunk (Disclaimer + data). `funds.json` is tree-shaken out for now, but it will join that chunk when a screen uses it. Vuetify's full stylesheet plus MDI is 577 kB of CSS (85 kB gzipped). Neither is a problem yet; watch them in Phase 1.
- **The per-deployment Vercel URL redirects (302).** Use https://first-leaf.vercel.app.

- **Pelipper Post location:** `setup.sh` looks for it in `~/Projects` and other common folders (and with Spotlight). If it isn't found, Phase 0 skips the pattern comparison. See the setup output.
- **Illustrations:** Open Peeps / Open Doodles are downloaded from their sites in Phase 3. If Claude Code can't fetch them, Alex downloads one zip.
- **`.claude/settings.local.json` and global git ignores:** tracked since `c9ae855`. If it ever shows as untracked again, a global ignore is the cause.
- ~~`check:deploy` unverified~~ **Verified Sept. 24** on commit `eb30959`, then again at the end of Phase 0.
- **`.claude/settings.local.json`** is committed on purpose (the rubric grades the `.claude` folder). If Claude Code adds it to `.gitignore`, remove that line.
- **Copy is DRAFT** until Alex approves it in Phase 2: all glossary entries, flag text, fund descriptions and story claims.
- ~~Phase 0 UI copy is DRAFT~~ **APPROVED Sept. 24** with two edits (see the rulings entry). The list as it stood: (grade from the validator's scorer in brackets): landing line "A made-up investing app for people who have never invested. It is shown here as three design case studies." (4.9) · "Open P301" door links · P301 "Rosa's weekly review", "The full dashboard is coming in Phase 1." (3.8), "Every fund takes a small yearly fee out of its value." (4.8) · P302 "The story ends by naming the idea behind it: growth on growth." (4.8), "The full story is coming in Phase 1." (3.8) · P303 "Rosa's check-in", "The 60-second check-in is coming in Phase 1." (6.3), "If your bank sends a deposit back, it is called a returned deposit." (5.8) · 404 "We couldn't find that page." / "The link may be old or mistyped. Here are the three case studies." (0.6) · sub-page "Coming in Phase 1." and titles (Your funds, Activity, Practice, Words to know, What needs you, Why it moved, Words) · TermTip labels "Also called", "Example:", "Related words:", "Source:", "Close explanation" · Demo button "Demo: {scenario}" · Money "up +$X" / "down −$X" / "no change" · SeverityBadge "Needs you" / "Heads-up" / "FYI".


## Measured values (Phase 0, rendered in Chromium from the production build)

| Pair | Foreground → background | Size | Ratio | Needs |
|---|---|---|---|---|
| Body text on cream | #15130F → #F5F0E6 | 18px | **16.33:1** | 4.5 |
| Muted text (eyebrow, disclaimer) on cream | #4F4A40 → #F5F0E6 | 14–16px | **7.75:1** | 4.5 |
| TermTip dotted underline on cream | #1F5C3B → #F5F0E6 | 2px line | **6.97:1** | 3 |
| TermTip panel text (term, short line, detail) | #15130F → #FFFDF8 | 16–22px | **18.25:1** | 4.5 |
| TermTip "also called" and source | #4F4A40 → #FFFDF8 | 14px | **8.66:1** | 4.5 |
| TermTip related-word and source links | #1F5C3B → #FFFDF8 | 14–15px | **7.79:1** | 4.5 |
| Demo button text and border | #15130F → #F5F0E6 | 14px | **16.33:1** | 4.5 |
| Demo menu choice label | #15130F → #FFFDF8 | 16px bold | **18.25:1** | 4.5 |
| Demo menu description | #4F4A40 → #FFFDF8 | 14px | **8.66:1** | 4.5 |
| Demo menu check icon | #1F5C3B → #FFFDF8 | 24px icon | **7.79:1** | 3 |
| Landing door link "Open P30X" | #1F5C3B → #FFFDF8 | 16px bold | **7.79:1** | 4.5 |

**Fonts, computed:** h1 = `"Newsreader Variable", Georgia, …` (56–88px); buttons and body = `"Hanken Grotesk Variable", system-ui, …`. `document.fonts.check()` is true for both, and both faces report `loaded`.
**Phase 0.5 additions:** TermTip "Back to …" button is 161×48 (desktop) / 210×48 (390), #1F5C3B on #FFFDF8 = **7.79:1** at 15px/600. The axe scans report zero serious or critical violations on /, /p301, /p302 and /p303 at 390 and 1280, with the panel open and with the Demo menu open.
**Target sizes:** Demo button 211×48, TermTip close button 48×48, related-word links 71×27, inline TermTip button 79×29 (see Known issues).

## Compliance notes

- All data is fictional and generated by `scripts/generate-data.mjs`. Validator rules G1–G5 block real tickers and brands, advice language, absolute safety claims, account numbers, and non-fictional people or accounts.
- The disclaimer is in `meta.json`, on every case study, and in the README.
- No client or Slalom information anywhere.
- Fonts: SIL Open Font License. Illustrations: CC0. Icons: Apache 2.0. See `docs/CREDITS.md`.
