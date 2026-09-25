# STATUS: First Leaf (P301 · P302 · P303)

> **Any Claude reading this: read this whole file first.** Then summarize where we left off in 3–5 plain sentences, and **wait for Alex's go-ahead** before changing anything. Update this file at the end of every phase: the phase table, NEXT STEP, the decision log, and known issues.

**Last updated:** Sept. 25, 2026 (Phase 3 · Visual design and the Phase 2.5 rulings; waiting on Alex's review)

## NEXT STEP

Alex reviews Phase 3:
1. **The live site at three widths.** Home (and `?scenario=all-clear`, `?scenario=brand-new`), `/funds/BTC`, `/story` (chapter 3, "The dip in June"; chapter 4's group bar) and Practice.
2. **`docs/copy/COPY-REVIEW.md`.** 28 DRAFT rows (the rest are APPROVED). The six recommended items are at the top, including one decision: a single name for FYIs.
3. **The Phase 3 deviations** in the decision log.

Then the planning chat issues Phase 4 (edge cases and screen sizes).

## Live links

| What | Link |
|---|---|
| GitHub repo | https://github.com/alexanderquijada/first-leaf |
| Live site | https://first-leaf.vercel.app |
| P301 (Home on a laptop) | https://first-leaf.vercel.app |
| P302 (Your money story) | https://first-leaf.vercel.app/story |
| P303 (Phone preview) | https://first-leaf.vercel.app/?view=phone (or the site on a phone) |

## Decisions already made (do not relitigate)

| Decision | Choice | Why |
|---|---|---|
| Project shape | **One app, three case-study lenses** (Sept. 24). The site opens straight into Rosa's app; no landing page. P301 = Home on a laptop + Alerts, Activity, Funds; P302 = Your money story + Practice, Words; P303 = the app under 600px | Alex's ruling: three doors read as three projects, not one product |
| Phone preview | A top-bar toggle at 600px+ shows the real app in a 390 × 844 phone frame (an iframe); `?view=phone` opens it | Alex's ruling (Sept. 24): a P303 reviewer may never open the site on a phone |
| Product | **First Leaf**, a made-up beginner investing app by made-up *First Leaf Investing* | No clash with any finance brand found in a web check (Sept. 23) |
| Person | **Rosa**, 26, dental hygienist, Tucson (fictional), 7 months into her first account | One person, three moments; see BRIEF.md §2 |
| P301 user | **Rosa's own dashboard**: the person who runs the account is its owner | Alex's call. It's operational because it surfaces what's off first and lets her act |
| P301/P303 interactivity | Lots: pages, pop-ups, actions on flags, filters, practice trading | Alex: "lots of interaction… things to click… fake sandbox investing" |
| Account type | A real (fictional) starter account **plus** a Practice space with pretend money | The real account reads as financial services; Practice gives the sandbox without advice risk |
| Demo scenarios | Three accounts: normal, all-clear, brand-new; flags generated from rules per account | Every sentence must stay true in every scenario |
| Auto-invest | Rosa paused it on July 14 after a price dip; the Aug. 3 deposit waits as cash | Explains the waiting cash honestly; turning it back on is her choice |
| Goal | "Put in my first $2,000" by Feb. 1, 2027; counts deposits only | One measure; the plan reaches it exactly; the market can't make her "behind" |
| P302 story | **Your money story** (Sept. 24): Rosa's own seven months argue "growth needs years, so starting early and staying steady matter more than picking the perfect moment"; Nia and Theo become chapter 5 | Alex's ruling; replaces "Start early beats start big" as the whole story |
| P303 task | 60-second check-in; under 600px Home becomes the check-in, everything else one tap away | Alex's pick; re-shaped as a lens on Sept. 24 |
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
| 0.6 · One app (Sept. 24) | ✅ One-app re-plan, layouts, feature folders, About, redirects, 404 in the app | ✅ Desktop rail, Home placeholder | ✅ Story and Practice placeholders | ✅ Phone shell, bottom tab bar, Phone preview |
| 1A · Core screens, real app (Sept. 24) | ✅ Disclosure, G6/R1–R4/S3/T4, About and Demo menu removed, scenarios by URL, handled and session state, chart helpers, pre-commit hook, project-language crawl | ✅ Laptop Home, Alerts with realistic flows, basic Activity | ✅ Story chapters 1–4 | ✅ Phone check-in Home, phone alert pages, 48px controls |
| 1B · Rest of core flows (Sept. 24) | ✅ Dip rule and point of view, practice state (data frozen), line chart, formula, sheets, toggles, checks widened | ✅ Activity with filters and item pages, Funds and fund pages | ✅ Story chapters 5–6, Practice with time machine, Words | ✅ Phone Activity/Funds, keypad Practice, chapter sheet, 48px everywhere |
| 1 · Core flows | ⬜ Shared composables | ⬜ F1–F8 | ⬜ 8 chapters, guess, sliders, toggle | ⬜ F1–F6 |
| 2 · Plain language (Sept. 24) | ✅ Every string in copy files (no visible change), rule L5 (13 broken cases), calm-story test, copy review table · ✅ Approved rewrites applied in 2.5 | ⬜ Copy approved | ⬜ Copy approved | ⬜ Copy approved |
| 2.5 · Real names, real crypto prices, Phase 2 rewrites (Sept. 24; waiting on copy approval) | ✅ Lineup, real crypto prices, anchored stocks, validator (P1, P2, 49 rules, 114 cases), approved rewrites, no disclaimer, data notes, grouped chart colors, `npm run copy:review` | ✅ Investments, big-move and SIPC alerts | ✅ Story chapters 1, 3, 4 and Practice for the lineup | ✅ Phone screens for the lineup |
| 3 · Visual design + Phase 2.5 rulings (Sept. 25; waiting on review) | ✅ Seed 10 (9.5% dip), SIPC and advice checks, test-only big-move proof, theme, type scale, pills, chart glow/grain/group patterns, illustrations, axe at 3 widths | ✅ Group bar, illustrations, crypto amounts, zero pieces, must-act count | ✅ Chapter marks, group bars, dashed Theo, Practice amounts | ✅ Calm sun, zero pieces |
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

### Sept. 25, 2026: Phase 3 rulings (and the brief for Phase 4)

- **Ratified:**
  - seed 10 and "The dip in June";
  - illustrations in empty states and chapter headers (there has been no landing page since Phase 0.6);
  - Open Peeps only;
  - "N things need you" counts only must-act (needs-you) items;
  - line charts on light cards, and the group bar on the dark panel;
  - "You paid" on buy detail pages;
  - the axe fixes and `scroll-padding-top`;
  - restoring STATUS.md from git after the heredoc mistake.
  Nia vs. Theo stays as built (Theo's line dashed).
- **Copy:**
  - The FYI section is named **"Good to know"** everywhere, on the laptop and the phone (approved rewrite 9). Every "Just so you know" is replaced. Rewrite 9 also renames the "FYI" badge to "Good to know", so the badge and its section use one name.
  - The 28 DRAFT rows from Phase 3 are **approved** and recorded in `docs/copy/approved.json`.
- **Phone view shows only the phone.** `/p303` gets its own layout at 600px and wider: no sidebar, no top bar, no laptop layout. A plain cream background, the phone frame centered and scaled to the window height so the page never scrolls, and "Back to full view" top left (it returns to the laptop page the visitor came from, or to Home). Under 600px there is no frame. The frame is decorative and hidden from screen readers; focus starts inside the phone. P303-BRIEF.md, BRIEF.md §2 and §10 are updated, with a new edge-case row for short laptop windows.
- **Phase 4** covers every edge-case row in the briefs, BRIEF.md §10's screen sizes, 200% zoom, keyboard-only use and measured touch targets.
- **Certificate check (read-only):** asked whether the "Library of Congress Root CA 1" certificate is installed on this Mac. It is not: `security find-certificate` finds nothing in the System or login keychain, run inside or outside the sandbox. The interception seen in Phases 2.5 and 3 happened outside the sandbox too, so it comes from the network, not from a certificate on this Mac.

### Sept. 25, 2026: Phase 3 · Visual design, plus the Phase 2.5 rulings (built; ruled Sept. 25)

**The rulings, applied**
- **Seed 10.** The dip is a 9.5% fall ($80.24), May 21 to June 5, so chapter 3 is "The dip in June". The pause is June 8. Rosa is up $108.50 on $1,250 (balance $1,358.50, $302.27 in cash); the calm account is up $136.68.
- **The stock data note** is Alex's new wording, at grade 4.8, with no exemption.
- **SIPC:** only the general fact, word for word, in the account notice, the glossary and the crypto pages. G6 and the crawl ban membership/protection claims, "FDIC" and any "not … advice" wording. The statute is cited verbatim in `docs/research/SIPC.md`.
- **The big-move alert** is proven by an N2 broken case and by a Playwright project that builds a TEST-ONLY week (NVIDIA up 9%) into `dist-test/`. `npm run check:fixtures` proves `dist/` never contains it.
- **Crypto shows "Amount" with its unit** everywhere, including Practice.
- **Zero pieces are left out of "Why it moved"**; the pieces shown still add up to the cent.
- **Chapter 5's advice line is gone.**
- **"N things need you" counts only needs-you items.** For Rosa that is 1 (the returned deposit). The two heads-ups (goal, cash) are listed but not counted, and the SIPC FYI sits under "Just so you know". The phone says the same.
- **The ten descriptions** are checked against the 10-Ks and project sites (`docs/research/DESCRIPTIONS.md`).
- **Copy sign-off:** `docs/copy/approved.json` records the approved text. `npm run copy:review` marks 704 rows APPROVED and 28 DRAFT (new or changed since).

**Visual design (BRIEF.md §6)**
- **Theme:** a type scale (Newsreader for headlines and big numbers, Hanken Grotesk for the interface), pill buttons (Vuetify default and every feature button), quiet 150ms motion turned off under reduced motion, and `scroll-padding-top` so scrolled content clears the sticky bar.
- **Charts:**
  - glow only on the balance line;
  - grain for "what it earned" over the flat "put in";
  - dip markers alternating above and below the line (apart at 390px);
  - a stocks / crypto / cash group bar on the dark panel, with stripes, dots and lines, a summary above and a key below (Home mix, chapter 4, Practice);
  - Theo's line dashed and the mix card's "you set" bars striped (see the color-blind table).
- **Illustrations:** six Open Peeps (CC0) and original starburst, boomerang, atomic-dot and halftone SVGs. They appear on the brand-new welcome, the empty Activity and Practice states, the 404, the chapter headers and the phone's calm sun.

**Deviations, for Alex to rule on**
- **No "landing doors":** the site has had no landing page since Phase 0.6, so the illustrations went to empty states and chapter headers instead.
- **Open Doodles couldn't be reached** (the network intercepts opendoodles.com); only Open Peeps is used.
- **"N things need you" reads "must act on" as needs-you only.** Heads-ups offer a choice ("Either is fine"), so they are listed but not counted.
- **FYI vs. "Just so you know":** approved rewrite 9 (both "Good to know") conflicts with ruling 8 (section "Just so you know"). Both are left as they were; flagged in the copy review.
- **Line charts stay on paper cards.** The group bar (the only categorical fill chart, with a cream mark) sits on the dark panel. Every mark is measured against the background it is drawn on.
- **Buy detail pages say "You paid"** for the dollar row, so a crypto buy doesn't show two "Amount" rows.

**What we got wrong (and fixed)**
- My first pass left the old SIPC sentence on the crypto pages. It lives in the Investments copy file, not the data; the screenshots caught it.
- Practice scrolled sideways on a phone (533px) once Rosa owned something. The new "0.5950 shares" wording widened the table, the grid didn't let it shrink, and a screen-reader-only span escaped the table's scroll box. It's fixed, and a new test fails on it.
- Axe had never run at 768px. The first run there found focus-driven scrolling hiding a button under the sticky bar.
- Writing this entry, an unquoted shell heredoc ran the backticked file names as commands and dropped the dollar amounts. STATUS.md was restored from git and rewritten; no other file changed.

### Sept. 25, 2026: Phase 2.5 rulings (and the brief for Phase 3)

- **Ratified:**
  - crypto history starting Sept. 24, 2025 (the Demo plan's limit);
  - "Powered by CoinGecko API";
  - the ending of rewrite 3 ("…a $10.99 drop." / "rise");
  - stopping at the unexpected certificate before sending the key.
  Commits that only build as a set are accepted this once. **From now on each commit builds on its own, or its message says it doesn't.**
- **Copy:** the ten recommended rewrites in the Phase 2.5 copy review are **approved**, except where the changes below touch the same text (these win). The Phase 2.5 new copy is approved as changed below. This closes Phase 2's copy sign-off.
- **Changes:**
  1. **The stock data note** is reworded: "Stock prices on Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026 are real. Prices on the days between are modeled." Its reading-level exemption is removed; the CoinGecko credit keeps its exemption (CoinGecko sets that wording).
  2. **SIPC:** nothing on the site may say or imply that First Leaf is a SIPC member or that Rosa's holdings are protected. Falsely claiming SIPC membership or protection is prohibited by federal law (15 U.S.C. §78jjj(d), `docs/research/SIPC.md`). The notice and the glossary word become the general fact: "SIPC protection covers stocks and cash at a member brokerage if the brokerage fails. It doesn't cover crypto, such as Bitcoin or Ethereum. It never covers a drop in price." G6 bans "Member SIPC", "SIPC member", "protected by SIPC", "SIPC-protected" and "FDIC".
  3. **A deeper dip:** use the first seed after 1 where chapter 3's dip is an 8% to 15% fall and every other rule passes. That is seed 10: 9.5% ($80.24), May 21 to June 5, pause June 8. The dip markers must sit visibly apart at 390px.
  4. **The big-move alert stays.** It is proven by a validator broken case and a Playwright test that uses a test-only week with a 7%+ move. That fixture never ships (a check confirms it isn't in `dist/`), and the README doesn't mention it.
  5. **Crypto amounts** are labeled "Amount", with the coin's unit ("0.00136690 BTC"), everywhere, including Practice.
  6. **"Why it moved"** (laptop and phone) leaves out any piece that is $0.00. The pieces shown still add up to the cent (A10).
  7. **Chapter 5** loses "This is an example, not a plan or advice." (disclaimer language). G6 catches "not financial advice" and "not investment advice" in any wording. Chapter 5 still passes G3.
  8. **"N things need you"** counts only what Rosa must act on. FYIs sit under "Just so you know" and are never counted, on the laptop or the phone.
  9. **The ten "What it is" descriptions** are checked against each company's or project's own description, kept factual, and their sources recorded in `docs/research/`.
- **What we got wrong:**
  - The SIPC wording ("Your crypto isn't covered…", "helps get back the stocks and cash in a brokerage account") could be read as saying Rosa's stocks at First Leaf are protected, which implies membership.
  - The stock data note was written above grade 8, and then exempted instead of rewritten.
  - The first dip (4.2%, a low only $0.74 under what she had put in) was too shallow to carry chapter 3.

### Sept. 24, 2026: Phase 2.5 · Real names, real crypto prices and the Phase 2 rewrites (built; waiting on copy approval)

**Done**
- **Prices.**
  - Crypto: real CoinGecko daily closes (Demo API) for BTC, ETH and SOL, saved by `scripts/fetch-crypto.mjs` into `src/shared/data/raw/`. The key is only in `.env.local`, and the generator never uses the network.
  - Stocks: a Brownian bridge in log price through each stock's real close on Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026. The 21 closes come from Nasdaq.com historical prices (5 cross-checked in the news). Each stock's daily volatility is computed once from those closes; the daily series itself is not copied.
  - Dividends: 20 real dividends from company announcements and SEC filings. Everything is recorded in `docs/research/PRICE-ANCHORS.md`.
- **Rosa's account.**
  - Seed 1 meets every condition: both accounts up, a clear dip, the dip unchanged by her pause, nothing needing the calm account.
  - The dip: May 11 to May 26, a $34.89 (4.2%) fall. She paused on May 27, so her June, July and Aug. 3 deposits stayed as cash ($452.11 waiting).
  - On Sept. 18 she is up $86.80 on $1,250, and the calm account is up $119.67.
  - No holding moved 7% this week, so the big-move alert doesn't fire. The SIPC notice shows for both funded accounts.
- **Checker (49 rules, 114 broken cases, each new or changed rule shown failing first).**
  - New: P1 (anchors hit exactly) and P2 (crypto equals the saved CoinGecko files).
  - G1 and G2 allow only the lineup; G3 bans "buy the dip"; G6 bans "simulated", "concept" and "not real".
  - F1 lets crypto trade every day; F4 recomputes "Ups and downs" from the prices.
  - A12 checks crypto settles the same day, 8-decimal crypto shares, and dividends against the documented ones.
  - N2 covers the big-move and SIPC alerts and fails on any fee alert. R2 and R3 cover the data-driven dip.
  - S3 and the fee rules are gone.
- **Screens.**
  - No footer or disclaimer anywhere.
  - "Powered by CoinGecko API" next to crypto prices, and the stock data note next to stock prices, only on price charts and investment pages.
  - Funds becomes Investments, with ticker badges and no logos.
  - Chapters 1, 3 and 4 follow the new data; Practice offers all ten.
  - Approved rewrites 1 to 6 and 8 to 10 are applied.
- **Chart colors.** The 7-color palette fails the color-blind test (ΔE 6.4), so charts group stocks (sky), crypto (coral) and cash (cream): worst pair ΔE 22.7.
- **The copy review** is rebuilt by the committed `npm run copy:review` (719 rows, all DRAFT).

**Deviations, for Alex to rule on**
- **Crypto history starts Sept. 24, 2025, not Sept. 19.** CoinGecko's Demo plan only answers for the past 365 days, and the fetch ran on Sept. 24, 2026. Stocks still start at their Sept. 19 anchor. The time machine starts Sept. 26, 2025, the first weekly close that every investment has.
- **The CoinGecko credit reads "Powered by CoinGecko API", not "Crypto prices by CoinGecko".** Their API terms require "Powered by CoinGecko", and their attribution guide lists "Powered by CoinGecko API" among its accepted wordings. "Crypto prices by CoinGecko" is in neither.
- **The stock data note keeps your exact wording, which reads at grade 9.2.** Rule L5 exempts the two data-source credits from the grade only (the list is `FIXED_WORDING`). The copy review offers an optional two-sentence version.
- **Rewrite 3's ending.** Filled with the change word, the approved opening read "…added up to down $10.99", so it ends "…added up to a $10.99 drop." (or "rise"). DRAFT.
- **"Ups and downs" thresholds.** 1 under 20% a year, 2 under 30%, 3 under 45%, 4 under 65%, 5 above. Costco (19.96%) and Bitcoin (45.01%) sit right at a boundary.
- **Commits.** The data, checker and screen changes are separate commits as asked. The pre-commit hook checks the whole working tree, so each one passed against the finished tree; the data and checker commits don't build green on their own.
- **Also changed:**
  - Practice shares now use 8 decimals for crypto, like the account. At 4, $12 of Bitcoin would buy nothing.
  - The time machine now looks prices up by date, not by list position (crypto's weekly list starts a week later).
  - The CoinGecko link gets a 48px target on phones.

**What we got wrong**
- My first "Ups and downs" name check compared "Nvidia" with "NVIDIA" by exact case, so the lineup's own name was blocked. It now ignores case.
- L5 treated `{market}` as a plain amount, so a falling week read "The market: −$10.99." in a sentence. It is a change now. This was never caught before because the old week was up.
- The crawl's banned list missed "Nothing here is investment advice."; its own check caught that, and the pattern now bans any "investment advice".

### Sept. 24, 2026: Phase 2 rulings and Phase 2.5 ruling B (real names)

**Ruling A: the Phase 2 report**
- **Ratified:** the placeholder renames; L5's scoring (a quoted name counts as one word, a leading label of 3 words or fewer is set aside, hyphenated words split); values labeled by their column header; chapter 4's single key line; the sheet tests waiting for animations.
- **Approved rewrites, applied in Phase 2.5:** (1) "the safe guess" → "the better guess"; (2) the Words "Deposit" example drops Rosa's name; (3) "The whole market change was…" → "Price changes across everything you own added up to…"; (4) "Seven months in" → "Six months in", everywhere, including the README scenario name ("Rosa, six months in"); (5) one deposit-timing sentence everywhere, "It should arrive in 1 to 3 business days."; (6) "practice money" everywhere on screen ("pretend money" may stay in the Practice word's other names, for search); (7) moot, because the fee alert is removed; (8) the "nothing to sell" error says what to do; (9) "1M" / "3M" → "1 month" / "3 months", measured to still fit at 390px; (10) the laptop and phone word "Nothing needs you" and the alert count the same way.
- The script that builds `docs/copy/COPY-REVIEW.md` is committed, so the table can be rebuilt after each approval. No web-page version of the review is needed.

**Ruling B: real names, real crypto prices**
- **What changed:** the five invented `FL-` index funds are replaced by real names and tickers. Rosa's target mix is AAPL 25%, MSFT 20%, NVDA 10%, COST 15%, NKE 10%, BTC 12%, ETH 8%; Practice also offers AMZN, TSLA and SOL. Crypto prices are real CoinGecko daily closes for the 12 months ending Sept. 18, 2026. Stock prices are a random path forced through each stock's real close on Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026. Dividends are the companies' real per-share amounts and dates. History is 12 months for everything. No logos: ticker badges.
- **Why:** relatability for visitors (Apple and Bitcoin mean something; "FL-BROAD" didn't). Stocks are anchored rather than real because the free stock-data licenses (Tiingo, Alpha Vantage, Yahoo) forbid public display; single closing prices are public facts, recorded with their sources.
- **No disclaimer of any kind on the site, footer included.** The only data notes are the CoinGecko credit next to crypto prices and the stock data note, "Daily stock prices are modeled between real closes on Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026." G6 now also bans "simulated", "concept" and "not real".
- **The briefs change first:** the fee alert is removed; a big-move alert (7% or more in a week, only if the data shows one) and an FYI account notice about SIPC protection and crypto are added; chapter 3's dip is data-driven (the largest 10-trading-day fall in Rosa's portfolio value between April 15 and Aug. 15, 2026, with the pause on the next trading day); chapter 4 filters stocks / crypto / cash; Funds becomes Investments (the `/funds` route stays); the glossary drops fund-only words and adds stock, crypto, Bitcoin and SIPC protection.
- **Sequencing (declared):** the brief-example blocks, and removing the disclaimer from `meta.json`, change with the regenerated data in step 2, because the pre-commit hook checks the briefs (B1) and the disclosure (S3) against the current data.

### Sept. 24, 2026: Phase 2 · Plain language (in progress: waiting on Alex's copy approval)

**Done**
- **Copy files.** Every word a person reads or hears lives in `src/shared/copy.json`, `src/layouts/copy.json` or `src/features/<feature>/copy.json`. That includes aria labels, screen-reader-only text, chart descriptions, page titles and month names.
  - Numbers and dates use named placeholders. Each sentence is one template, never joined fragments.
  - `CopyText` fills a template and places a term button or styled amount in its named slot.
  - Proof of no visible change: 0 of 266 text/accessibility snapshots differ. All 8 before/after screenshots are pixel-identical. (Practice at 1280 differed by 28 pixels on one capture; 2 of 3 fresh captures of the same build matched exactly. That's capture noise.)
- **Rule L5.**
  - Fills every copy sentence with each scenario's real values (every glossary entry and alert title where those appear) and also reads the generated story sentences.
  - Checks: grade, jargon, advice and project language, "+X%" for rates, money format, unlabeled values, undeclared placeholders.
  - Self-test: 13 broken cases, each failing for its own reason.
- **Calm-story test.** The calm account's story never mentions pausing, anywhere: text, tables or chart labels. The same check finds "paus" in the paused account, and it was shown failing when pointed there.
- **`docs/copy/COPY-REVIEW.md`.** One section per screen: text as rendered, grade, the other scenarios' versions, suggested rewrite and why. Ten top rewrites and a consistency pass sit at the top.

**Deviations, for Alex to rule on**
- **Placeholder names have one meaning each, app-wide.** L5 fails on any it doesn't know. This found `{value}` meaning a fee in some places ("$1,313.72%") and `{amount}` meaning a raw number in others ("$$150 a month"). Those were renamed: `{fee}`, `{rating}`, `{oldFee}`/`{newFee}`, `{dollars}`, `{startAge}`, `{setting}`. No visible change.
- **How L5 grades.**
  - A quoted name (a term, the industry's word for it, a source, a ticker) counts as one word, because the grade is for our own writing. Without this, "Also called asset allocation" scored 12.5.
  - A leading label of 3 words or fewer ("Example:", "Source:") is set aside, like the ≤3-word label exemption.
  - The syllable counter now splits hyphenated words ("one-time" is 2 syllables, not 3), so "Add a one-time deposit" is no longer a false 9.6.
- **Values labeled somewhere else.** A value with no words around it is allowed only when it's listed in `LABELED_ELSEWHERE` with the visible label that names it: table cells under a column header, the practice mix list, and the keypad amount under "Amount".
- **Three on-screen changes, only where a rule required them (DRAFT):**
  - The phone fund card now says "Your value:".
  - Chapter 4 gets a key line above its rows. Putting the words in each row made "FL-BROAD" break at its hyphen at 390px; tickers there no longer wrap.
  - The buy note is reworded; it scored grade 8.4.
- **The phone sheet tests** now wait for the sheet's slide-in to finish before measuring. They sometimes caught 47.9999px mid-animation. The wait is shared with the axe scans as `settle()`.

**What we got wrong**
- Phase 1 built sentences in code with reused names like `{value}`. Nothing checked what a placeholder meant until L5 filled one with real values.
- Two sheet tests measured mid-animation and passed by luck.

### Sept. 24, 2026: Phase 1B rulings

- **Ratified:** the `/activity/:id` route.
- **The calm account and the July dip.** It shares the market's July dip dates, but its story must never say it paused: the dip is described as a market event only. (A test for this is added in Phase 2.)
- **Ratified:**
  - Rosa's monthly slider, $25–$500 in $5 steps
  - the Words search scope (the term, its other names and its first line)
  - the seven extra commits. Adding the brief flows before their code is the brief-first rule working.

### Sept. 24, 2026: Phase 1B · The rest of the core flows

- **1A rulings applied:**
  - R2 now derives the dip window from the pause date (June 14 to July 14) and was shown failing on the old window first. The dip itself is unchanged.
  - The point of view is in the second person.
  - "Your deposit is on its way. It should arrive in 1 to 3 business days." lives in one place.
  - Dialog and input text are ink.
- **Practice never touches the account, three ways:**
  - it reads only fund prices and practice rules;
  - the account data is deep-frozen at load, so any write throws and fails the test guard;
  - a test snapshots everything Home, Activity and Funds show before and after a full practice session, in all three scenarios. It was shown failing when an order secretly turned auto-invest on.
- **Built:**
  - Activity: combinable filters, a live count, empty states, session items, and item pages at a new `/activity/:id`.
  - Funds and fund pages: all 5 funds, "You don't own this fund yet.", 3 price ranges with tables, FL-GREEN's fee in percentage points, "N of 5".
  - Story chapter 5: the two friends, guess, both sliders, Smooth / Bumpy and your turn; every figure from the validator's formula. Theo's slider reaches $196, and $195 is not enough.
  - Story chapter 6.
  - Practice: every error inline with Review and Confirm disabled; the time machine; Start over with a confirmation; a sticky banner.
  - Words: search, an empty state and all 30 term pages.
  - On the phone: a compact Activity with a filter sheet, fund cards, a keypad Practice with a review sheet, the chapter menu as a sheet, and 48px controls on every page (measured by a test).
- **Found and fixed:**
  - The bottom sheet announced two nested dialogs.
  - `/story#chapter-5` hid the chapter heading under the sticky top bar (the screenshot review caught it).
  - Several 44px or 20px controls (Activity row links, the source link on a word page and in the phone sheet).
  - The loss-on-panel test first measured the wrong element (it passed at 13.75:1 on a gain). It now holds one element, measures coral at 7.11:1, and fails at 2.92:1 without the panel's loss color.
- **What the hook caught:** six blocked commits, all stale or timing-sensitive tests (the old point-of-view text, a "Pending" text clash, 44px rows, counting sliders before they rendered). No broken commit reached the history.
- **Measured:**
  - Contrast: toggles 7.79 / 18.25:1; the banner, ink on lime, 14.52:1; errors 5.92:1; disabled Review 7.30:1; the "Passes Nia" mark 5.51:1 (13px bold); keypad 18.25:1.
  - Size: every control is at least 48px; keypad keys are 100×64.
  - Smallest gaps between number columns: 26px (phone Activity), 29px (Practice table), 32px (Activity), 47px (Funds).
  - The loss on the dark panel: 7.11:1.
- **Deviations (for Alex to rule on):**
  1. **New route `/activity/:id`.** Opening an activity item and the phone's full-page detail both need an address.
  2. **Three extra shared commits:** the line chart and formula, the bottom-sheet fix, and the input-color fix. Also an extra `[docs]` commit that adds P303 flows F8–F11 to the brief before their code.
  3. **The calm account uses the main account's dip window.** It never paused; the market is the same for every account.
  4. **Words searches only the term, its "also called" names and its first line**, not the full explanation, so results stay relevant.
  5. **"Your turn" monthly slider:** $25–$500 in $5 steps (not specified).
- **Copy for approval (DRAFT, grade 7 or below; one-word labels not scored):**
  - **Activity:** "Showing N of M.", "Nothing matches these filters.", "Show everything", "Filters", "Type: … Status: …", "Show N items", the fact labels, "It should arrive in 1 to 3 business days.", "Auto-invest bought it with your deposit.", "We could not find that item."
  - **Funds:** "Not owned", "Down $X on the $Y you paid.", "Price: $X a share.", the price summary, "0.45% to 0.75% on Oct. 1, up 0.30 percentage points. The fund told owners on Sept. 15.", "It has been X% since …", "Ups and downs: N of 5", "1 means its price barely moves. 5 means it moves the most.", the dividend lines, "We could not find that fund."
  - **Chapter 5:** the intro, the guess and replies, the answer, "Why Nia ends ahead", "Every year counts", the slider results, "Starting at 45 still helps. …", "Theo is still behind.", "That is almost twice what Nia puts in.", "Real life is bumpy", "Your turn".
  - **Chapter 6:** "Practice lets you try a mix with money that is not real. Nothing you do there touches your account.", "Go to Practice".
  - **Practice:** "Practice money. It isn't real money." (Alex's), the summary labels, "Place an order", "Pick a fund", the review sentence, the confirmations, "New order", "Nothing yet. Buy a fund to start.", "Your practice mix", the time-machine summary, "Start over?" and its sentence, and the five order errors.
  - **Words:** "Search words", "N words", "No words match “…”. Try “fee” or “fund”." (Alex's), "All words", "Related words", "We could not find that word.", "Try searching for it in Words to know."

### Sept. 24, 2026: Phase 1A rulings

- **Amended: the deposit confirmation** becomes "Your deposit is on its way. It should arrive in 1 to 3 business days." Claude's original line scored grade 10. It lives in one place in the code.
- **Adopted: the point of view in the second person:** "Right now, almost all of your balance is money you put in. Growth needs years, so starting early and staying steady matter more than picking the perfect moment."
- **Amended: the July dip rule.** The dip is the largest high-to-low drop in FL-BROAD in the 30 calendar days before the auto-invest pause (June 14 to July 14), so it is tied to Rosa's action, not a hand-picked window. *Claude's note:* the calm account never paused, so it uses the same window (the market is the same for every account).
- **Ratified:**
  - the pinned story chart, deferred to Phase 3
  - the S3 matching ("not" or "nothing here is" investment advice)
  - the brand-new account's split point of view
  - the phone's fund moves in dollars
  - the extra commits
- **Noted in CLAUDE.md:** the pre-commit hook checks the whole working tree, so commit or discard unrelated changes first.

### Sept. 24, 2026: Phase 1A · Core screens, as a real app

- **Rulings recorded brief first** (`b1ffd71`). A pre-commit hook now runs `npm run check` on every commit (`35b4d3e`). It blocked a deliberately failing test, then four real stale-test or timing problems during this phase, each fixed before the commit went in.
- **Data and rules** (`f2dbb55`):
  - The footer disclosure replaces the old disclaimer.
  - "Made up" and "demo" are gone from every learner-facing string, and the "made-up" glossary term is deleted.
  - Your money story's facts and sentences are generated per account (`rosaStory`).
  - New and changed rules: R1–R4, G6, S3 ("risk", "simulated", "not investment advice") and T4 ("example", "nobody can promise"). All 18 new broken cases showed MISSING first. Result: 47/47 rules, and all 83 cases caught.
- **Caught: the dip's search window matters.** Searched from June 1, "the dip" would be a slower slide from $91.34 on June 2. The window is now June 15 to July 31, which gives the ratified June 26 → July 13 dip ($90.46 → $84.45, −6.6%), and R2 recomputes it from the stored window.
- **Caught: the brand-new point of view read at grade 8.4** when its second sentence stood alone. For that account only it's split into two sentences (5.4). The full point of view stays word for word.
- **Removed:** About (and `/about`, which redirects to `/`), the Demo menu, the phone view's explanatory notes, and "Coming in Phase 1" (now "Coming soon.").
- **Scenarios** ride along on every link through a router guard, and carry into the phone view.
- **Built:**
  - Laptop Home (alerts first).
  - Alerts: two panes on a laptop, and realistic review → confirm → confirmation flows with session state (a Pending deposit, auto-invest on).
  - Mark as handled with Undo.
  - A basic Activity list.
  - Story chapters 1–4 with their toggles and filters.
  - The phone check-in Home (Why it moved in place, the latest three, word of the day).
  - Phone alert pages with 48px "Words on this screen" chips.
- **Accessibility found and fixed:**
  - Vuetify's `v-switch` had no `role="switch"`; it's replaced with a native switch.
  - The page behind a money-flow dialog stayed interactive (axe `target-size`); the app shell is now inert while the dialog is open.
  - Six phone controls were 40–44px; they're now 48px, with a test that measures every standalone control.
  - The axe scans read fading elements mid-animation; they now wait for the page to settle.
- **What went wrong:** four commits were blocked by the new hook because older tests still pointed at placeholder content ("yearly fee" on Home, the Alerts placeholder, "growth on growth" on the story). No broken commit reached the history this phase.
- **Measured:**
  - Contrast: severity badges 5.92 / 6.15 / 7.79:1; New 18.25:1; lime gains on the panel 13.75:1; terracotta losses 5.92:1; buttons and chips 7.79:1; Seen on the panel 10.02:1.
  - Size: every phone control is 48px or more, and the phone bottom tabs are 78×56.
  - Smallest gutter between number columns: 32px (Activity), then 58px (the phone's latest three), 71px (This week) and 133–220px elsewhere.
  - The built app's text contains no project language: the only hits are "deMo" inside Vue's `onVnodeMounted` and the data's `fictional: true` flags, neither of which is ever rendered.
- **Deviations (for Alex to rule on):**
  1. **Your exact confirmation, "Deposit requested. It usually arrives in 1–3 business days.", scores grade 10.0** (9.7 for its second sentence). It ships as you wrote it. The review step uses "It takes 1 to 3 days to arrive, not counting weekends." (5.9). A grade-4.8 alternative for the confirmation: "Deposit requested. It should get here in 1 to 3 workdays."
  2. **The P302 point of view is in the third person** ("Rosa's balance… she put in"), while the chapters speak to her ("your balance"). Suggestion: "Right now, almost all of your balance is money you put in. …"
  3. **The pinned chart beside the text from 1024px is deferred** to Phase 1B/3. Chapters 1–4 show their charts inline at every width.
  4. **S3 accepts "Nothing here is investment advice."** The ruling asked for "not investment advice", which that exact sentence doesn't contain literally; S3 matches "not" or "nothing here is" investment advice.
  5. **On the phone, tapping a fund in Why it moved shows its dollar move** next to the whole market change, not a percent share: with some funds down, one fund's share can exceed 100%.
  6. **Shared code landed in lens commits** where only that lens used it at the time: AlertList (P301 Home), activityText (P301 Alerts), ranges and RangeButtons (P302). There are two extra commits: the project-language crawl with the check:live update, and the 48px fix.
  7. **Activity is a basic list** so a Pending deposit has somewhere to show. Filters (F5) come in 1B.
  8. **The dialog's text is Vuetify's black (#000, 20.66:1)**, not the ink token: the theme has no "on-paper" color. Fix in Phase 3.
- **Copy for approval (DRAFT, grade 7.6 or below unless noted):**
  - **Home:**
    - "Needs your attention"
    - "N alerts need a look."
    - "Nothing needs you this week."
    - "You have handled everything for this week."
    - "Just so you know"
    - "Handled (N)", "Undo" (label), "Mark as handled"
    - "Up $X on the $Y you put in."
    - "This week: up $X."
    - "In funds", "Cash", "You put in"
    - "Auto-invest: On." / "Paused since July 14." (label)
    - the balance-over-time summary
    - "The biggest difference is FL-X: N% now and M% in the mix you set."
    - "$X in cash is not part of your mix."
    - the goal lines
    - "This counts deposits only, not the market."
    - "Your balance went up $X this week."
  - **Welcome:**
    - "Welcome, Rosa." (label)
    - "Your account is open. Here is what happens next."
    - the three steps
    - "Your balance over time will show here after your first deposit arrives."
  - **Alerts:**
    - "What happened", "What it means", "What you can do"
    - the fact labels
    - "Choose an alert to read it here."
    - "We could not find that alert."
    - "It may have been for another account, or it no longer applies."
    - "All alerts"
  - **Flows:**
    - "Try your deposit again" / "Add a one-time deposit" / "Auto-invest"
    - "Check the amount, then continue."
    - "From your bank account" / "To your First Leaf account"
    - the amount error
    - the confirm sentences
    - the auto-invest status and confirm sentences
    - "You can see it as Pending in Activity."
  - **Activity:** "Nothing yet. Your deposits, buys and dividends will show here."
  - **Story:**
    - chapter titles
    - "Show what you put in and what it earned"
    - "Show events on the chart"
    - the event labels
    - "Tap either part to read it."
    - "What it earned is its return. It needs years to grow."
    - "Here is how your money is split today, as of the last prices."
    - the mix summaries
    - the brand-new chapter
    - "Coming soon."
  - **Phone:**
    - "N thing(s) need(s) you"
    - "See N heads-ups"
    - "Nothing needs you today."
    - "Why it moved this week"
    - "The market: … Dividends: …"
    - "The market, fund by fund"
    - "X moved up $Y this week. The whole market change was up $Z."
    - "Some funds went down this week. Ups and downs are normal."
    - "See your funds", "Latest", "See all activity"
    - "Word of the day", "Read more", "Next word"
    - "Words on this screen"
  - **Chart helpers:**
    - "Show as table" / "Hide table"
    - "Move across the chart, tap it, or use the arrow keys to read each day."
    - the readout sentence
  - **Generated story sentences:** everything in `rosaStory`, now data and checked by R1–R4.

### Sept. 24, 2026: Phase 0.6 rulings (and the real-app ruling)

- **Ratified:**
  - the story follows the scenario
  - "Why it moved" opens in place on the phone Home
  - Alerts is two-pane on a laptop
  - Practice and Words belong to P302
  - the app frame and Home load up front
  - the preview frame scales on short desktop windows
  - the 404 folder
  - the sub-page redirects
  - the skip link
  - the corrected July dip numbers. *Claude's planning error: it read every third row of the data.*
- **Temporary:** the story's 90% stand-in, replaced by rule R1 in Phase 1A.
- **Amended:** the tablet Home must show "Prices as of Fri., Sept. 18".
- **Closed:** related-word links in the explanation panel are standalone controls, so under 600px they are at least 48 × 48px (added to the P303 brief).
- **Copy approved:** the 404, the top bar, the skip link and the nav labels.
- **Real-app ruling (Alex, Sept. 24):**
  - Inside the site, First Leaf must read like a real investing app: no "made up", "demo", "case study", "for this project", "fictional" or "for reviewers" on screen. Reviewer and project explanations live only in README.md.
  - The on-screen disclaimer becomes a footer disclosure: *"Investing involves risk, including losing money you put in. First Leaf is a concept app: accounts, funds and prices shown are simulated. Nothing here is investment advice."*
  - About this demo and the Demo menu are removed; scenarios are reached by URL only (listed in the README). The phone toggle is labeled "Phone view". Money actions end in realistic confirmations.
  - The data rules behind the scenes don't loosen: everything is still fictional and marked so in the data.
  - **What we got wrong:** the About page, the Demo menu and the "made up" copy made the site read as an exercise, not a product.
- **Commit guard:** from Phase 1A a pre-commit hook runs `npm run check`, and `--no-verify` is denied. (Phase 0.6 had a commit go in with a failing test.)

### Sept. 24, 2026: Phase 0.6 · One app (built)

- **Built:**
  - `/` is Home. Layouts live in `src/layouts/`: the rail from 1024px, top tabs at 600–1023px, a bottom tab bar under 600px, a skip link, the top bar and a footer with "About this demo".
  - Placeholder pages sit in `src/features/*`. The term demos moved: "yearly fee" to Home, "growth on growth" to the story, "returned deposit" to Alerts.
  - `/about` has real copy (DRAFT).
  - The friendly 404 sits inside the app.
  - `/p301`, `/p302`, `/p303` and their old sub-pages redirect, keeping `?scenario`.
  - Phone preview works, with `?view=phone`.
  - The old landing page, the three shells and ComingSoon are deleted.
- **Checks:**
  - `check:boundaries` enforces the feature rules. Its self-test catches 6 bad imports; the old check missed feature-to-feature.
  - 44 Playwright tests, including axe with the preview open.
  - `check:live` covers the new routes, the `/p301` redirect and `/?view=phone`.
  - Shown failing first:
    - a transparent bottom bar, and a bar covering the footer (the footer ended at 819.9 against a bar top of 787)
    - a nesting preview, and a preview that doesn't move focus
- **What went wrong:**
  - **Commit `13405e2` ([P301] rail + Home) went in with one test failing.** The Demo menu test clicked through the old landing page's doors. My commit command didn't stop on the failing test run. The test was rewritten in `f460bcc`; from then on every commit ran after a passing suite.
  - **A skip-link test was flaky under parallel load:** it pressed Tab before the page rendered. Fixed by waiting for the page heading, then passed 3 runs in a row.
  - **The redirect functions failed type-check under vue-router 5.** The router now infers the types.
  - **The footer test was flaky against the live site** (2 of 3 runs failed). It scrolled before the lazily loaded page had rendered. The live screen showed the footer clear of the bar (763 against 787), so the test was fixed, not the app. It now waits for the heading and polls: 5 of 5 runs pass live, and it still fails when the bar's padding is removed.
- **The full suite passed against the live site:** 44 of 44.
- **Measured** (Chromium, production build):
  - Bottom tabs are 78×56 each; the bottom bar is opaque (#FFFDF8), and so is the top bar (#F5F0E6).
  - Nav text on the phone: 18.25:1 (current 7.79:1). On the tablet: 16.33:1 (current 6.97:1). On the desktop rail: 18.25:1 (current 6.57:1, forest on mint).
  - Rail links are 215×48, tablet tabs 48px tall, the preview toggle 169×48, "Back to full view" 169×48 (7.79:1).
  - The preview frame is scaled to 0.78 at 1280×800 and 0.98 at 768×1024.
- **Deviations (for Alex to rule on):**
  1. The Phone preview frame also scales down on desktop when the window is shorter than the frame (1280×800 → 0.78). The ruling named 600–1023px only.
  2. At 600–1023px the top bar shows the wordmark, the preview toggle and the Demo menu; the greeting and "Prices as of" appear only from 1024px, because they don't fit beside the tabs.
  3. The 404 lives in `src/features/not-found/`, a ninth feature folder that wasn't in the list.
  4. Old sub-page addresses (for example `/p303/learn/expense-ratio`, `/p303/attention`) also redirect to their new pages; the ruling named only `/p301`, `/p302` and `/p303`.
  5. A "Skip to content" link was added (WCAG 2.4.1, now that there's a rail).
  6. The story placeholder shows the point of view's "Right now…" half only when deposits are at least 90% of the balance (a stand-in for rule R1).
- **Copy for approval (DRAFT, grade 7.6 or below):**
  - About this demo (all of it)
  - "We couldn't find that page." / "The link may be old or mistyped." / "Go to Home"
  - "Good morning, Rosa." / "Prices as of Fri., Sept. 18"
  - "Skip to content"
  - Nav labels: Home, Activity, Funds, Your money story (Story on phones), Practice, Words; page titles: Alerts, Alert, Home
  - Phone preview: "Preview on a phone", "Back to full view", "This is the real app at phone size, 390 by 844 pixels.", "Practice here is kept apart from the full view."

### Sept. 24, 2026: Ruling: one app, three lenses (Phase 0.6)

- **Alex's ruling:** First Leaf is one app experience, not three sections. The three case studies are three lenses on the same product.
- **What we got wrong:** the Sept. 23 plan built three doors on a landing page (`/p301`, `/p302`, `/p303`), each with its own shell. We did it to keep each case study separately reviewable, but it read as three projects, not one product. Separate reviewability now comes from the lens briefs, the README blocks, the About page's "For reviewers" map, the commit prefixes and each lens's definition of done, not from separate sites.
- **The new shape:**
  - `/` is Rosa's Home, with routes for alerts, activity, funds, story, practice, learn and about, plus a 404.
  - Old addresses redirect: `/p301` and `/p303` → `/`, `/p302` → `/story`.
  - Navigation: a left rail at 1024px+, top tabs at 600–1023px, a bottom tab bar under 600px.
  - A footer with the disclaimer and "About this demo".
  - Code is organized by feature (`src/features/*`) with shared layouts (`src/layouts/`); features and layouts import only from `src/shared/`.
  - Commit prefixes follow lens ownership: `[P301]` Home on desktop, Alerts, Activity, Funds · `[P302]` Story, Practice, Learn · `[P303]` the phone layout and navigation · `[shared]` everything used at every size.
- **P302 is now "Your money story":**
  - Rosa's own data in chapters 1–4.
  - Nia and Theo in chapter 5, with every T rule kept.
  - Practice in chapter 6.
  - Every claim about Rosa's data becomes a checked rule, R1–R4 (defined in BRIEF.md §4, built in Phase 1).
- **Caught while re-planning: the July dip numbers were wrong in BRIEF.md.** It said FL-BROAD fell "from $89.80 to $85.06". The data's high was **$90.46 on June 26** and the low **$84.45 on July 13** (−6.6%); $85.06 was the July 14 close, the day she paused. The corrected numbers are now brief-example values that B1 checks.
- **Phone preview (Alex's ruling, Sept. 24):**
  - A P303 reviewer may never open the site on a real phone.
  - At 600px and wider, a top-bar toggle, "Preview on a phone", shows the real app in a generic 390 × 844 phone frame (an iframe of the same app, not a mock-up), and `?view=phone` opens it directly.
  - **Known limitation:** Practice state isn't shared between the full view and the phone view (separate app instances); the scenario is carried through the URL.
- **Decisions made in the briefs, for Alex to confirm:**
  1. The story follows the current demo scenario, with a true version of each chapter for each (R4). Brand-new gets a short version of chapters 1–4.
  2. On the phone, "Why it moved" opens in place on Home rather than on its own route, because the route list has no `/why`.
  3. On a laptop, Alerts is a two-pane page (list plus detail), and clicking an alert on Home opens `/alerts/:id`.
  4. The app layout and Home load up front, and every other route is lazy (this resolves "lazy-load every route" against "don't lazy-load the first screen").
  5. Practice and Words flows moved from the P301 brief to the P302 brief. P301 keeps six flows.

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
- **The pre-commit hook checks the working tree, not only what's staged**, so an unstaged broken file can block an unrelated commit (and a staged-only problem is still caught). Acceptable for now.
- **Money has no loss on the dark panel yet in the data** (Rosa is up in every scenario). Coral on the panel is 7.1:1 by the token table, but not yet measured rendered.
- **Phone view limitation (by design):** Practice state isn't shared between the full view and the phone frame; the scenario is carried through the URL. A scenario picked inside the frame doesn't change the full view.
- **The rail's paper background is 100vh tall and sticky.** Full-page screenshots show it ending at one screen height; a real window always shows it full height.
- **Related-word links in the explanation panel are about 27px tall** (71×27 measured). On desktop that's above the 24px minimum. On P303's bottom sheet, the amended rule may count them as standalone controls that need 48px. Needs a ruling before P303's Phase 1 screens.
- **Bundle:** the shared data loaders currently land in one 55 kB chunk (Disclaimer + data). `funds.json` is tree-shaken out for now, but it will join that chunk when a screen uses it. Vuetify's full stylesheet plus MDI is 577 kB of CSS (85 kB gzipped). Neither is a problem yet; watch them in Phase 1.
- **The per-deployment Vercel URL redirects (302).** Use https://first-leaf.vercel.app.

- **Pelipper Post location:** `setup.sh` looks for it in `~/Projects` and other common folders (and with Spotlight). If it isn't found, Phase 0 skips the pattern comparison. See the setup output.
- **Illustrations:** Open Peeps / Open Doodles are downloaded from their sites in Phase 3. If Claude Code can't fetch them, Alex downloads one zip.
- **`.claude/settings.local.json` and global git ignores:** tracked since `c9ae855`. If it ever shows as untracked again, a global ignore is the cause.
- ~~`check:deploy` unverified~~ **Verified Sept. 24** on commit `eb30959`, then again at the end of Phase 0.
- **`.claude/settings.local.json`** is committed on purpose (the rubric grades the `.claude` folder). If Claude Code adds it to `.gitignore`, remove that line.
- **Copy:** Phase 2's sign-off is closed (Sept. 25). `docs/copy/COPY-REVIEW.md` has 28 DRAFT rows (new or changed since), listed at its top; the rest are APPROVED against `docs/copy/approved.json`.
- ~~The big-move alert is untested on screen~~ **Fixed Sept. 25:** a TEST-ONLY week (`tests/fixtures/big-move/`) drives a Playwright test; `check:fixtures` proves it never ships.
- ~~The dip is small~~ **Fixed Sept. 25:** seed 10 gives a 9.5% dip (May 21 to June 5).
- **The copy review is built by `npm run copy:review`** from the copy files, the data and rendered snapshots (390 and 1280). 177 rows use example values because their text isn't on a captured screen: errors, dialog steps, empty states, bare values in table cells. Tablet (768) wasn't captured separately; it uses the same strings.
- ~~Phase 0 UI copy is DRAFT~~ **APPROVED Sept. 24** with two edits (see the rulings entry). The list as it stood: (grade from the validator's scorer in brackets): landing line "A made-up investing app for people who have never invested. It is shown here as three design case studies." (4.9) · "Open P301" door links · P301 "Rosa's weekly review", "The full dashboard is coming in Phase 1." (3.8), "Every fund takes a small yearly fee out of its value." (4.8) · P302 "The story ends by naming the idea behind it: growth on growth." (4.8), "The full story is coming in Phase 1." (3.8) · P303 "Rosa's check-in", "The 60-second check-in is coming in Phase 1." (6.3), "If your bank sends a deposit back, it is called a returned deposit." (5.8) · 404 "We couldn't find that page." / "The link may be old or mistyped. Here are the three case studies." (0.6) · sub-page "Coming in Phase 1." and titles (Your funds, Activity, Practice, Words to know, What needs you, Why it moved, Words) · TermTip labels "Also called", "Example:", "Related words:", "Source:", "Close explanation" · Demo button "Demo: {scenario}" · Money "up +$X" / "down −$X" / "no change" · SeverityBadge "Needs you" / "Heads-up" / "FYI".


## Measured values, Phase 3 (rendered in Chromium, Sept. 25, 2026)

**Every text/background pair actually rendered.** Collected from 15 pages × 3 scenarios × 390/768/1280px, with tables, "Why it moved" and Practice holdings open. Each distinct pair is shown once, at its smallest size. Chips, badges, credits, the Practice banner and severity badges are all included; icon glyphs share their label's color.

| Text / background | Ratio | Needs | Smallest size | Example (where) |
|---|---|---|---|---|
| terracotta #A8431E on cream #F5F0E6 | 5.30:1 | 4.5:1 | 18px | "Down $1.67" (fl-money, 390 /) |
| mustard #7A5C00 on cream #F5F0E6 | 5.51:1 | 4.5:1 | 13px | "Passes Nia: $196" (slider__mark-label, 390 /story) |
| terracotta #A8431E on paper #FFFDF8 | 5.92:1 | 4.5:1 | 14px | "Needs you" (fl-severity, 390 /) |
| mustard #7A5C00 on paper #FFFDF8 | 6.15:1 | 4.5:1 | 14px | "Heads-up" (fl-severity, 390 /alerts) |
| forest #1F5C3B on mint #DDEFD9 | 6.57:1 | 4.5:1 | 13px bold | "AAPL" (fl-badge, 390 /funds) |
| forest #1F5C3B on cream #F5F0E6 | 6.97:1 | 4.5:1 | 15px | "SIPC: What SIPC protects" (a, 390 /learn/sipc-protection) |
| coral #F08A5D on panel #0E1C15 | 7.11:1 | 4.5:1 | 16px | "down $1.67" (fl-money, 768 /) |
| ink-muted #4F4A40 on mint #DDEFD9 | 7.30:1 | 4.5:1 | 16px bold | "Review" (porder__review, 390 /practice) |
| ink-muted #4F4A40 on cream #F5F0E6 | 7.75:1 | 4.5:1 | 13px | "Start at 18" (span, 390 /story) |
| forest #1F5C3B on paper #FFFDF8 | 7.79:1 | 4.5:1 | 13px bold | "Home" (fl-bottombar__label, 390 /) |
| paper #FFFDF8 on forest #1F5C3B | 7.79:1 | 4.5:1 | 16px | "Next word" (phome__next, 390 /) |
| ink-muted #4F4A40 on paper #FFFDF8 | 8.66:1 | 4.5:1 | 14px | "Price" (li, 390 /funds/AAPL) |
| on-panel #B9C7BE on panel #0E1C15 | 10.02:1 | 4.5:1 | 14px | "Stocks" (span, 390 /story) |
| lime #C6F36B on panel #0E1C15 | 13.75:1 | 4.5:1 | 16px | "See 2 heads-ups" (phome__more, 390 /) |
| ink #15130F on lime #C6F36B | 14.52:1 | 4.5:1 | 16px bold | "Practice money. Nothing here t" (practice__banner, 390 /practice) |
| ink #15130F on mint #DDEFD9 | 15.39:1 | 4.5:1 | 16px | "Money you put in" (share__label, 390 /story) |
| cream #F5F0E6 on panel #0E1C15 | 15.46:1 | 4.5:1 | 16px | "Your $150 deposit from Sept. 1" (phome__top-text, 390 /) |
| ink #15130F on cream #F5F0E6 | 16.33:1 | 4.5:1 | 14px | "Phone view" (fl-pp-toggle, 768 /) |
| paper #FFFDF8 on panel #0E1C15 | 17.28:1 | 4.5:1 | 14px | "61% · $829.78" (fl-gm__num, 390 /story) |
| ink #15130F on paper #FFFDF8 | 18.25:1 | 4.5:1 | 13px | "Activity" (fl-bottombar__label, 390 /) |

**Chart marks, against the background each is drawn on** (marks need 3:1):

| Mark | Colors | Ratio | Where |
|---|---|---|---|
| Balance line (the only glow) | forest #1F5C3B on paper #FFFDF8 | 7.79:1 | Home, story ch. 1 and 3, phone |
| "What you put in" edge line | ink-muted #4F4A40 on paper | 8.66:1 | balance charts |
| "What you put in" flat fill | mint #DDEFD9 on paper | 1.19:1 | an area, carried by its 2px edge line, the grain difference and the key |
| Dip event markers | mustard #7A5C00 on paper (ink outline 18.25:1) | 6.15:1 | story ch. 3 |
| Price, Nia, practice-mix lines | forest on paper | 7.79:1 | investment pages, ch. 5, Practice |
| Theo line (dashed) | mustard on paper | 6.15:1 | ch. 5 |
| Axis labels and ticks | ink-muted on paper | 8.66:1 | every line chart |
| Group bar: stocks / crypto / cash | sky #8FD3FF / coral #F08A5D / cream #F5F0E6 on panel #0E1C15 | 10.81 / 7.11 / 15.46:1 | Home mix, ch. 4, Practice |
| Mix "now" / "you set" bars | forest / mustard (striped) on paper | 7.79 / 6.15:1 | Home mix card |
| Ch. 4 and Practice row bars | forest on mint track | 6.57:1 | |

**Color-blind simulation of every chart with categorical color** (Machado 2009 at full severity, CIEDE2000; the bar is ΔE 17):

| Chart | Closest pair (worst case) | Result | Non-color signal |
|---|---|---|---|
| Group bar: stocks / crypto / cash (and the panel) | stocks / cash, protanopia, ΔE 22.7 | passes all three | stripes / dots / lines, and a text key with percentages |
| Nia and Theo | nia / theo, protanopia, ΔE 12.3 | fails protanopia (deuteranopia 17.2, tritanopia 41.5) | line width (4px vs. 2.5px), Theo dashed, labeled key |
| Home mix: now / you set | same colors, ΔE 12.3 | fails protanopia | "you set" striped, each bar labeled ("27% now · 25% set") |
| Balance chart: put in / earned | put in / earned, ΔE 10.8 in normal vision | close by design | flat vs. grain texture, edge lines, key |

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

- All data is generated by `scripts/generate-data.mjs`. Rosa, her accounts and every person are invented. Only the approved lineup's real names and tickers may appear (G1, G2); every other real brand or ticker is blocked. G3–G5 block advice language, absolute safety claims, account numbers and non-fictional people or accounts.
- Crypto prices are real CoinGecko daily closes (Demo API), credited next to every crypto price as their attribution guide requires. Stock prices are modeled between real closes recorded with sources in `docs/research/PRICE-ANCHORS.md`. No company logos.
- There is no on-screen disclaimer (ruling B, Phase 2.5). The README explains the project for reviewers.
- No client or Slalom information anywhere.
- Fonts: SIL Open Font License. Illustrations: CC0. Icons: Apache 2.0. See `docs/CREDITS.md`.
