# STATUS: First Leaf (P301 · P302 · P303)

> **Any Claude reading this: read this whole file first.** Then summarize where we left off in 3–5 plain sentences, and **wait for Alex's go-ahead** before changing anything. Update this file at the end of every phase: the phase table, NEXT STEP, the decision log, and known issues.

**Last updated:** Sept. 23, 2026 (planning session, before Phase 0)

## NEXT STEP

Alex runs `setup.sh` once (it creates this repo on GitHub and pushes the first commit). Then he imports the repo into Vercel (Pelipper Post's Vercel account) and pastes the **Phase 0** prompt from `docs/CLAUDE-CODE-PROMPTS.md` into Claude Code.

## Live links

| What | Link |
|---|---|
| GitHub repo | https://github.com/alexanderquijada/first-leaf |
| Live site | _(filled in during Phase 0, after the Vercel import)_ |
| P301 | _(live site)_/p301 |
| P302 | _(live site)_/p302 |
| P303 | _(live site)_/p303 |

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
| 0 · Foundation | ⬜ Scaffold, tokens, fonts, TermTip, Disclaimer, scenario switcher, landing | ⬜ Route shell | ⬜ Route shell | ⬜ Route shell |
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
| Tools | Homebrew, Node (20+), Git, GitHub CLI, Claude Code in VS Code (installed/checked by `setup.sh`) |
| Accounts | GitHub (logged in via `gh`); Vercel (Pelipper Post's account); Claude Code (confirm with `/status`) |

## Decision log

Newest first. Include what we got wrong and why.

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

- **Pelipper Post location:** `setup.sh` looks for it in `~/Projects` and other common folders (and with Spotlight). If it isn't found, Phase 0 skips the pattern comparison. See the setup output.
- **Illustrations:** Open Peeps / Open Doodles are downloaded from their sites in Phase 3. If Claude Code can't fetch them, Alex downloads one zip.
- **`check:deploy`** uses GitHub's Deployments API, which Vercel's GitHub integration writes to. Its first real run happens at the start of Phase 0 and is **unverified until then**.
- **`.claude/settings.local.json`** is committed on purpose (the rubric grades the `.claude` folder). If Claude Code adds it to `.gitignore`, remove that line.
- **Copy is DRAFT** until Alex approves it in Phase 2: all glossary entries, flag text, fund descriptions and story claims.

## Compliance notes

- All data is fictional and generated by `scripts/generate-data.mjs`. Validator rules G1–G5 block real tickers and brands, advice language, absolute safety claims, account numbers, and non-fictional people or accounts.
- The disclaimer is in `meta.json`, on every case study, and in the README.
- No client or Slalom information anywhere.
- Fonts: SIL Open Font License. Illustrations: CC0. Icons: Apache 2.0. See `docs/CREDITS.md`.
