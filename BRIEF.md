# First Leaf: Project Brief (shared foundation)

> **Status:** Plan, written before building (Sept. 23, 2026). **Re-planned Sept. 24, 2026 as one app with three case-study lenses.** Later changes follow the brief-first loop: this file is updated and committed *before* the code changes. The dated reasons live in [STATUS.md](STATUS.md#decision-log).
>
> **What is real and what is invented (Alex's ruling B, Sept. 24, 2026, Phase 2.5).** First Leaf, Rosa, her accounts and every person are invented. The **stock and crypto names and tickers are real** (the approved lineup in §4). **Crypto prices are real** CoinGecko daily closes. **Stock prices are modeled**: a random path forced through each stock's real close on three dates, because free stock-data licenses forbid public display. It is not financial advice. (This is a reviewer document; on screen the app reads as a real product and carries no disclaimer. See §1 and §8.)

## Where each case study lives

First Leaf is **one app**. The three case studies are **three lenses on it**: each one is a set of screens at a screen size, with its own brief and its own definition of done. A reviewer only needs **this page's §1–3 (product, person, how the lenses relate) and §6 (style)**, plus the brief for their case study.

| Case study | Where it lives in the app | Screen size to use | Brief | In one sentence |
|---|---|---|---|---|
| **P301 · Operational dashboard** | Home (`/`) on a laptop, plus Alerts (`/alerts`), Activity (`/activity`) and Investments (`/funds`) | Laptop, 1280px wide or more (works from 1024px) | [docs/briefs/P301-BRIEF.md](docs/briefs/P301-BRIEF.md) | Rosa's Sunday weekly review: what needs her, how her money is doing, and what every word means. |
| **P302 · Interactive data story** | Your money story (`/story`), plus Practice (`/practice`) and Words (`/learn`) | Any size; the chart pins beside the text from 1024px | [docs/briefs/P302-BRIEF.md](docs/briefs/P302-BRIEF.md) | Rosa's own six months, told as a story that argues one point: growth needs years, so starting early and staying steady matter more than timing. |
| **P303 · Mobile experience** | The whole app under 600px wide, starting at Home (`/`) | A phone, or a browser narrowed to 390px | [docs/briefs/P303-BRIEF.md](docs/briefs/P303-BRIEF.md) | A 60-second check-in between patients: does anything need me, and why did my balance move? |

The rest of this file is the foundation all three share: product, person, data, style, tech and guardrails.

---

## 1. The product

**First Leaf** is an invented investing app for people who have never invested before. It is run by an invented company, *First Leaf Investing*. It gives each new investor a small starter account that holds real stocks and crypto, plain-language explanations for every financial word, and a **Practice** space with practice money.

**Industry: Financial Services (retail investing).** We are designing for the part of the industry that serves first-time retail investors, the way brokerages and credit unions do with starter accounts. The design has to feel like a *real account* (balances, deposits, settling trades, dividends) and not like a game or a course.

**Decision: one app, three case-study lenses** (Alex's ruling, Sept. 24, 2026). The site opens straight into Rosa's app, on Home. Each case study is a lens on that one app:

| Lens | What it is in the app |
|---|---|
| **P301 · Operational dashboard** | Home on a laptop (alerts first, then balance, balance over time, mix, goal, this week), plus Alerts, Activity and Investments. Every alert has its action (money actions run a realistic review, confirm and confirmation flow), Mark as handled, and "New" badges. |
| **P302 · Interactive data story** | Your money story (`/story`): Rosa's own six months, told in six chapters that argue one point of view, plus the Nia and Theo lesson. Practice (investing with practice money) and the learning moments (term explanations, Words) count toward P302 too. |
| **P303 · Mobile experience** | The same app under 600px wide, designed for a 60-second glance, not a shrunk desktop. Home becomes a check-in. Everything else is one tap away. |

Why: a real product is one app that a person uses in different moments, not three demos. One app means one navigation, one set of words, one account and one voice, so a reviewer sees a coherent product. The case studies stay separately reviewable because each lens has its own brief, its own routes and screen size, its own "Try these" steps in the README, its own commit prefix and its own definition of done.

**Decision: inside the site, First Leaf reads like a real investing app** (Alex's rulings, Sept. 24, 2026). Nothing on screen says "made up", "demo", "case study", "for this project", "fictional", "for reviewers", "simulated", "concept" or "not real" (validator rule G6 and a crawl of the built site). **There is no disclaimer of any kind, footer included** (ruling B, Phase 2.5). The only notes about data are the two a real finance app shows for its data providers: the CoinGecko credit next to crypto prices, and one note on stock charts and stock pages, *"Stock prices on Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026 are real. Prices on the days between are modeled."* Reviewer and project explanations live only in `README.md`. Money actions end in realistic confirmations ("Your deposit is on its way…"), never in "nothing real happens" dialogs. The data rules behind the scenes don't loosen: Rosa and every account are still invented and marked so in the data (G5), and only the approved lineup's real names may appear (G1, G2).
*Why real names (ruling B):* visitors relate to Apple and Bitcoin in a way they never did to invented index funds.
*What we got wrong:* the About page, the Demo menu and the "made up" copy made the site read as an exercise, not a product.

*Rejected by Alex:* three separate sections, each with its own door. It read as three projects, not one product.
*Rejected earlier:* three unrelated products. Easier to review, but a weaker story, and three datasets would each be thinner.

## 2. The person: Rosa (fictional)

| | |
|---|---|
| **Who** | Rosa, 26, a dental hygienist in Tucson, Arizona |
| **Where she is** | Opened her first investing account in March 2026 with $500. Adds $150 on the 1st of each month. Had never bought a stock or crypto before this account. |
| **What she worries about** | Losing money without knowing why. Words nobody explains ("volatility"). Doing something she can't undo. |
| **Devices** | iPhone, one-handed, between patients. Laptop on Sunday mornings. |

**Decision: one person, three different moments.** Every lens serves Rosa, but each serves a different *moment* with a different *job*. That is why the phone layout is designed for its moment instead of being the laptop layout made smaller.

| Lens | Rosa's moment | Her job in that moment |
|---|---|---|
| P301 | Sunday morning at her laptop, 10–15 calm minutes | Review everything, notice what's off, understand it, act on it |
| P302 | An evening on the couch | Understand what her own money has done, and why time matters more than timing |
| P303 | 60 seconds between patients, one hand | Know if anything needs her, and why her balance moved |

**Decision: the person who runs the account is its owner.** P301's user is Rosa herself, operating her own account. Its job is operational: it surfaces what is off (a returned deposit, money waiting in cash, a big price move, a plan falling behind) before it becomes a problem, and it lets her act on each one. See the P301 brief.
*Considered and rejected:* a staff user who oversees many learners. It would have split the product between two audiences, and Rosa's own weekly review is the moment where catching problems early matters most to her.

## 3. How the lenses fit together

- **Same data, same screens, different jobs.** Every screen reads from one fictional dataset (§4). The same balance, deposits and person appear everywhere, and the validator proves they agree.
- **One navigation, shaped by screen size.**

  | Width | Navigation |
  |---|---|
  | 1024px and up | A left rail (Home, Activity, Investments, Your money story, Practice, Words) and a top bar (greeting, "Prices as of Fri., Sept. 18", Phone view) |
  | 600–1023px | A top bar (wordmark, "Prices as of Fri., Sept. 18", Phone view), with the rail's six items as top tabs |
  | Under 600px | An opaque top bar (wordmark) and an opaque bottom tab bar (Home, Activity, Story, Practice, Words) with 48px targets. Investments and Alerts are reached from Home. |

  **Phone view** (Alex's rulings, Sept. 24, 2026; phone-only since Phase 4): at 600px and wider, the top bar has a phone-icon button labeled "Phone view". It opens `/p303/…`, which has its own layout: only the real app inside a generic phone frame (390px wide, 667 to 844px tall), centered on a plain background, with "Back to full view" top left. No sidebar or top bar. Details are in the P303 brief.

  There is no footer disclosure (ruling B, Phase 2.5). There is no About page; `/about` redirects to `/`, and the reviewer map lives in `README.md`.
- **Old addresses still work.** `/p301` redirects to `/`, `/p302` to `/story`, `/about` to `/`, and `?view=phone` to `/p303`. `/p303/…` is the phone-only view (on a phone it shows the same screens full size).
- **Shared building blocks, feature folders.** Term explanations, money formatting, data and state live in `src/shared/`. The shells and navigation live in `src/layouts/`. Each screen family lives in its own feature folder (`src/features/home`, `alerts`, `activity`, `funds`, `story`, `practice`, `learn`, and `not-found` for the 404). **Features and layouts import only from `src/shared/`**, never from each other; the router wires them together.
- **Which lens owns which code** (this sets the commit prefix):

  | Prefix | Owns |
  |---|---|
  | `[P301]` | Home on desktop, Alerts, Activity, Investments |
  | `[P302]` | Your money story, Practice, Words |
  | `[P303]` | The phone layout, phone navigation and phone-specific screens |
  | `[shared]` | Shared code, data, tokens, and layouts used at every size |

- **Scenarios** let a reviewer see empty and edge states without editing anything. They are reached **only by URL** (there is no menu on screen); the README lists the links for each case study. Each scenario has **its own account**, so every sentence stays true in it, including the story's:
  - *Rosa, six months in* (default): a few things need her.
  - *Nothing needs you*: a calmer Rosa. Every deposit went through and auto-invest stayed on.
  - *Brand-new account*: she hasn't added money yet.

  Add `?scenario=normal`, `?scenario=all-clear` or `?scenario=brand-new` to any URL. The choice carries through navigation and into the phone view. Scenario labels and descriptions are for the README only and never appear on screen.

---

## 4. Shared data universe

All data is **generated** by `scripts/generate-data.mjs` (seeded, so it is the same every run) into `src/shared/data/`. Only `glossary.json` is hand-written copy. Nobody hand-edits the generated JSON: change the generator, re-run it, then validate. The generator reads saved price files and makes **no network calls**; only `scripts/fetch-crypto.mjs` uses the network, run by hand.

| File | What it holds |
|---|---|
| `meta.json` | Product name, "as of" date, last market close, the word of the day (no disclaimer since Phase 2.5) |
| `persona.json` | Rosa, and her three moments |
| `funds.json` | The 10 investments (the file keeps its old name): 7 stocks and 3 cryptocurrencies, each with 12 months of daily prices, weekly closes, "Ups and downs" and dividends |
| `raw/coingecko-<coin>.json` | The saved CoinGecko daily prices for BTC, ETH and SOL, with the fetch date and source (no key) |
| `account.json` | Rosa's starter account (main demo): balance, cash, what she owns, auto-invest, goal, this week's change, daily history |
| `account-all-clear.json` | The calm version used by the *Nothing needs you* scenario |
| `account-new.json` | The account on the day it opened (empty state) |
| `activity.json` | Every deposit, buy and dividend, per account, including one returned deposit |
| `attention.json` | What needs attention, per account, most urgent first. **Generated from rules**, so an alert appears exactly when the account's facts call for it |
| `scenarios.json` | The three demo scenarios |
| `practice.json` | Practice rules ($1,000 practice money, 10 investments, a 12-month time machine) |
| `story-p302.json` | Every number and claim in Your money story: Rosa's own facts and claims for each account (`rosaStory`, chapters 1–4) and the Nia and Theo lesson (chapter 5) |
| `glossary.json` | The plain-language explanations |

**Dates.** "Today" in the app is **Sunday, Sept. 20, 2026**. The latest prices are from **Friday, Sept. 18, 2026**. Price history covers the **12 months from Sept. 19, 2025 to Sept. 18, 2026** (CoinGecko's Demo plan reaches back 365 days). Fixing the date means every sentence stays true, including "this week."

**The lineup (ruling B).** Real names and tickers. Rosa's target mix is the percentage column; Practice offers all ten.

| Ticker | Name | Kind | Rosa's mix | Prices |
|---|---|---|---|---|
| AAPL | Apple | Stock | 25% | Modeled between real closes |
| MSFT | Microsoft | Stock | 20% | Modeled between real closes |
| NVDA | NVIDIA | Stock | 10% | Modeled between real closes |
| COST | Costco | Stock | 15% | Modeled between real closes |
| NKE | Nike | Stock | 10% | Modeled between real closes |
| BTC | Bitcoin | Crypto | 12% | Real (CoinGecko) |
| ETH | Ethereum | Crypto | 8% | Real (CoinGecko) |
| AMZN | Amazon | Stock | Practice only | Modeled between real closes |
| TSLA | Tesla | Stock | Practice only | Modeled between real closes |
| SOL | Solana | Crypto | Practice only | Real (CoinGecko) |

- **Crypto prices are real:** CoinGecko daily closes (Demo API) for the 12 months ending Sept. 18, 2026, saved by `scripts/fetch-crypto.mjs` into `src/shared/data/raw/`. Crypto trades every day, so its history includes weekends; Rosa's account still moves on stock trading days.
- **Stock prices are lifelike, not real:** a random path in log price, forced through each stock's **real close** on **Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026** (a bridge between the three anchors), moving with that stock's typical daily volatility. Free stock-data licenses (Tiingo, Alpha Vantage, Yahoo) forbid public display, so no daily stock series is copied from anyone. Each anchor close and its public source is recorded in `docs/research/PRICE-ANCHORS.md`, and rule P1 checks the data hits every anchor exactly.
- **Dividends are real** per-share amounts, ex-dates and pay dates (AAPL, MSFT, COST, NKE, and NVDA only if verified), from each company's investor-relations announcements, recorded with URLs in the same file. Rosa is paid the per-share amount on the shares she held on the ex-date, on the pay date, into cash.
- **"Ups and downs" (1–5)** is computed from each investment's 12-month daily price moves (the standard deviation of daily log returns, times √252 for stocks and √365 for crypto): **1** under 20% a year · **2** 20% to under 30% · **3** 30% to under 45% · **4** 45% to under 65% · **5** 65% or more.
- **No logos.** Company logos are trademarked artwork, so each investment shows a ticker badge.

**Rosa's account at a glance** (the validator checks this block against the data):

```json brief-example
{
  "persona.age": 26,
  "account.recurringDeposit.amount": 150,
  "account.balance": 1358.5,
  "account.moneyIn": 1250,
  "account.gainLoss": 108.5,
  "account.cash": 302.27,
  "account.autoInvest.pausedOn": "2026-06-08",
  "funds.0.ticker": "AAPL",
  "funds.0.history.daily.0.close": 245.5,
  "funds.7.ticker": "BTC",
  "meta.asOf": "2026-09-20",
  "meta.lastClose": "2026-09-18"
}
```

**How the account behaves, grounded in how real brokerages work:**
- Deposits arrive as **cash** first. While **auto-invest** is on, each deposit buys Rosa's chosen mix (the lineup's percentages above) on the day it clears.
- **The dip, and Rosa's pause, come from the data.** The dip is the **largest 10-trading-day fall in Rosa's portfolio value between April 15 and Aug. 15, 2026**, measured as the market change in her balance (deposits taken out). **She paused auto-invest on the next trading day after the low.** Deposits after that stay as cash, and dividends land in cash too. Cash counts as "waiting" once it reaches $25.
- **The seed (ruling, Sept. 25).** The stock paths use the **first random seed after 1 where that dip is an 8% to 15% fall** and every other rule still passes (anchors hit exactly, Rosa up overall, this week adding up to the cent). That is **seed 10**: a **9.5% fall ($80.24) from May 21 to June 5**, so chapter 3 is "The dip in June", and **she pauses on June 8**. Seed 1's 4.2% dip was too shallow to carry the chapter.
- Buys use that day's closing price and allow parts of a share (4 decimal places for stocks, 8 for crypto). Crypto holdings are labeled **"Amount"**, not "Shares", and shown with the coin's unit ("0.00136690 BTC"). **Stock buys settle one business day later (T+1)**, matching U.S. rules since May 28, 2024; crypto buys settle the same day.
- The **Sept. 1 deposit was returned** by her bank on Sept. 3. It never counts as money put in.
- **Her goal counts deposits only:** "Put in my first $2,000" by Feb. 1, 2027. Her plan ($500, then $150 a month) reaches exactly $2,000 by then, and the market can never make her look behind.
- The stock market is closed on weekends and on U.S. market holidays (Nov. 27 and Dec. 25, 2025, and the 2026 holidays). Crypto trades every day.

**Validation rules.** `npm run validate` checks every rule below and exits with an error if any fails. `npm run validate:selftest` proves each rule fails on deliberately broken data. The rule IDs match the validator output.

| Group | Rules |
|---|---|
| S · Structure | S1 files exist · S2 required fields |
| G · Finance guardrails | G1 only the approved lineup's tickers · G2 no real tickers or brand names outside the approved lineup · G3 no advice language, no absolute safety claims ("is safe"), no invented crowd claims ("most people") · G4 no account numbers · G5 every person and account fictional · G6 no project language on screen (made up, demo, case study, this project, for reviewers, fictional, simulated, concept, not real) in any learner-facing text; scenario descriptions are README-only and exempt |
| F · Prices | F1 prices positive; stocks on trading days only, crypto every day · F2 daily and weekly agree · F3 latest price, practice dates and time machine agree · F4 "Ups and downs" matches the 12-month volatility thresholds |
| P · Price sources | P1 each stock hits its three anchor closes in `docs/research/PRICE-ANCHORS.md` exactly · P2 crypto prices match the saved CoinGecko series |
| A · Accounts (every account, every scenario) | A1 value = shares × price · A2 up/down per fund · A3 balance = funds + cash · A4 money in = deposits that went through · A5 cost and shares = buys · A6 cash reconciles · A7 overall up/down · A8 history ends at balance · A9 mix adds to 100% · A10 this week adds up to the cent · A11 goal counts deposits only and the plan reaches it · A12 buys priced right; stocks settle T+1, crypto the same day · A13 "waiting since" date is true · A14 auto-invest behaves as stated |
| N · Attention flags | N1 well formed, most urgent first, "New" is true · N2 each flag appears exactly when the account's facts call for it, with matching numbers · N3 every dollar figure in flag copy exists in that account |
| C · Scenarios | C1 scenarios point at real accounts; "Nothing needs you" has nothing that needs you · C2 brand-new account is truly empty |
| T · P302 story | T1 savers match the growth formula · T2 every claim is true and the sliders can reach it · T3 bumpy version has the same overall growth and no staged crash · T4 the rate is labeled an example that nobody can promise |
| R · Rosa's story | R1 the deposits share of her balance is what the story says, and "almost all" is only said when it is at least 90% · R2 the dip (the largest 10-trading-day fall in her portfolio value between April 15 and Aug. 15, 2026, deposits taken out) and her balance at the low match the balance history · R3 the pause is the next trading day after the low, and everything the story says happened "after" it is true · R4 every scenario has its own true version (brand-new has none), and every number in a story sentence is one of that account's checked facts |
| X · Cross-lens | X1 Rosa's age and deposit agree across every lens · X2 dates agree everywhere |
| L · Plain language | L1 glossary links resolve, word of the day exists · L2 grade 8 or below for **every** learner-facing text in the data (explanations, examples, flags, fund descriptions, story notes, scenario descriptions) · L3 no jargon · L4 explanation first lines ≤ 16 words |
| B · Brief | B1 every `brief-example` block in the briefs matches the data |

---

## 5. Plain language and term explanations

**Decision: every financial word gets a tap-to-open explanation, written at a 6th–8th grade reading level.** Rosa should never need to leave the app to understand a word.

- **Tap, not hover.** Hover doesn't exist on phones, and content that appears only on hover fails WCAG 2.1 SC 1.4.13. Each term is a real `<button>` with a dotted underline. Tap, click, Enter or Space opens a small panel. Esc, tapping outside or the close button closes it. Screen readers announce the explanation when it opens (the "toggletip" pattern).
- **Panel content:** the plain term → one short line (≤ 16 words) → 1–3 sentences of detail → one example → "Related words" links → a source (U.S. SEC's Investor.gov wherever possible).
- **We name the real term too.** For example, "Ups and downs (also called *volatility*)." Rosa learns the word the industry uses without having to decode it first.
- **The words (Phase 2.5).** Terms that only fit funds are removed (index fund, yearly fee, bonds, rebalancing, fund). Added: stock, crypto, Bitcoin, SIPC protection (its wording checked against sipc.org and cited). "Your mix" now means stocks vs. crypto vs. cash. The word of the day is "Ups and downs".
- **Measured, not hoped for.** The validator scores every explanation, flag and story claim with the Flesch-Kincaid grade formula and fails anything above grade 8 (rule L2). It blocks a jargon list inside explanations (rule L3). We cross-checked our scoring against the `textstat` library, and it agreed within about one grade.
- **Copy is held for approval.** Claude Code drafts copy. Alex approves it before it ships.
- **Copy rules:** complete sentences, not headline fragments. Never label a value without saying what it measures. Card copy must stay true under every filter and every demo scenario. A subtitle is optional and has to earn its place.
- **Money format:** account amounts always show cents ($1,358.50). Whole-dollar amounts in sentences drop them ("$150 deposit"). The Nia and Theo lesson's long-range numbers round to whole dollars ($242,251).
- **Gains and losses (amended Sept. 24, 2026):** in sentences, a change reads as a word with no sign: "up $15.57", "down $5.88". In tables and chart labels it reads "+$15.57" / "−$5.88" (a true minus sign), and the words "up" / "down" are in the accessible label. Color is added in both places, never alone.
- **Rate changes are in percentage points.** A share of the mix going from 25% to 28% rose "3 percentage points", never "+12%". The same goes for any rate.
- **Honest wording:** never "safe" without saying safe from what ("does not go up or down with the market"). No claims about what "most people" do unless we can cite it. Our own app terms (Practice, On pace, Auto-invest) cite no outside source, because none exists. No advice about the market, ever: never "buy the dip" (G3).

## 6. Style

**Direction: mid-century modern meets futuristic.** Friendly and warm on the surface; precise, glowing data underneath. Each reference image gave us something specific:

| Reference | What we take | What we leave |
|---|---|---|
| The Warren Trust | Editorial serif at big sizes, the split light/dark layout, halftone illustration | The trust's formality |
| Dwell (real-estate app) | Warm cream background, mid-century desert warmth, rounded cards | Burnt orange as the main color |
| Green phone app (serif numbers, grainy mountain) | Big serif numbers, grainy green gradient shapes, lime pill buttons | 3D renders we can't license |
| Finovia | Lime + deep green pairing, pill buttons, bento card grid | Dense marketing copy |
| GWEI / Equilibrium | Glow on data lines inside dark panels | Crypto neon and dark-everything |
| Nestfin | Warm neutrals, clear hierarchy in a dense dashboard | Orange accents |

**Decision: cream background, with deep green-black panels where the data lives.** The friendly half (cream, serif, hand-drawn people) greets Rosa. The futuristic half (dark panels, glowing lines, grain) holds the numbers. The contrast between them *is* the brand.

**Color tokens** (contrast measured Sept. 23; Phase 3 re-measures in the rendered UI):

| Token | Hex | Use | Measured contrast |
|---|---|---|---|
| `cream` | #F5F0E6 | Page background | — |
| `paper` | #FFFDF8 | Cards on cream | — |
| `panel` | #0E1C15 | Deep green-black data panels | — |
| `panel-raised` | #16291F | Cards inside panels | — |
| `ink` | #15130F | Main text | 16.3:1 on cream |
| `ink-muted` | #4F4A40 | Secondary text | 7.8:1 on cream |
| `forest` | #1F5C3B | Links, key numbers, primary buttons | 7.0:1 on cream |
| `leaf` | #276B43 | Accents (the lighter #2E7D4F failed at 4.4:1, so it is not used for text) | 5.7:1 on cream |
| `lime` | #C6F36B | Highlights, buttons *with ink text*, lines on panels | 13.8:1 on panel; ink on lime 14.5:1 |
| `mint` | #DDEFD9 | Soft fills behind forest text | forest on mint 6.6:1 |
| `on-panel` | #B9C7BE | Secondary text on panels | 10.0:1 on panel |
| `terracotta` | #A8431E | "Needs you" severity, losses (always with icon + words) | 5.3:1 on cream |
| `mustard` | #7A5C00 | "Heads-up" severity (the lighter #8A6A00 failed at 4.5:1) | 5.5:1 on cream |

**Chart colors for categories** (the 7 holdings, plus cash). These are *not* a ramp of greens, because a one-hue ramp can't carry categories. **Tested in Phase 2.5** (Machado 2009 simulation at full severity, CIEDE2000, the bar is ΔE 17): a 7-color per-holding palette fails, with its closest pair at **ΔE 6.4** under deuteranopia. So **charts group the holdings into stocks, crypto and cash**, and the per-holding detail lives in tables and lists, where each row is labeled by its ticker. Of the grouped palettes tested, lime/coral/cream failed deuteranopia (ΔE 13.9); the one below passes all three simulations, with its closest pair at **ΔE 22.7**. Lime stays reserved for the glowing balance line. Color is never the only signal.

| Group | Color | On panel |
|---|---|---|
| Stocks | sky #8FD3FF | 10.8:1 |
| Crypto | coral #F08A5D | 7.1:1 |
| Cash | cream #F5F0E6 | 15.5:1 |

**Type.** Alex's choice is Klim's Financier Display, Financier Text and National. They are paid fonts: Klim's free test fonts can't be used on a public site, and web licenses start at $60 USD per style. **Decision: build with free, open-licensed stand-ins behind one font token each, so a later swap is a one-line change.**

| Role | Wanted (Klim) | Using now (SIL Open Font License) | Where |
|---|---|---|---|
| Display | Financier Display | **Newsreader** (display optical size) | Big numbers, page titles, story headlines |
| Text | Financier Text | **Newsreader** (text optical size) | Story body, explanation panels |
| Interface | National 2 | **Hanken Grotesk** | Navigation, labels, buttons, tables, chart axes |

Fonts are self-hosted from npm (`@fontsource-variable/*`), so the site loads nothing from Google. Numbers use tabular figures in tables and proportional figures in headlines.

**Imagery.**
- **People:** hand-drawn characters from *Open Peeps* / *Open Doodles* by Pablo Stanley (CC0: free for any use, no credit required). Credited anyway in `docs/CREDITS.md`.
- **Mid-century shapes:** starbursts, boomerangs, atomic dots and halftone textures, **drawn as original SVG in code**. No stock graphics, so there is no license risk.
- **Icons:** Material Design Icons (`@mdi/font`, Apache 2.0) for small interface controls only.

**Data visualization: futuristic, but every effect must mean something.**
- **Glow** marks the line you should read first (your balance). Nothing else glows.
- **Grain and gradient fill** show "money it earned," layered on a flat fill for "money you put in." The texture difference *is* the encoding.
- **Mix charts use the three tested groups** (stocks sky, crypto coral, cash cream; §6 above), each with its own halftone or stripe pattern, so color is never the only signal. Per-holding detail stays in tables. Every chart color is measured against the background it is actually drawn on (3:1 for marks): mix charts sit on the dark panel, or cream marks get an outline that passes.
- Every chart has a plain-sentence summary above it and a "Show as table" option. Values are read out in words on hover, focus or tap.
- Motion respects `prefers-reduced-motion`. Without motion, everything still reads.

**Layout rules** (learned on the last project): at most two levels of cards, with separator lines at level three. No row ends in a big empty gap. At least a **24px gutter** between columns of numbers, measured text edge to text edge. When a card count doesn't divide into 12 columns (five funds, say), use a **CSS grid**, not the 12-column grid. Opaque bars over scrolling content.

## 7. Tech

| Choice | Why |
|---|---|
| Vue 3 (`<script setup>`) + Vite + TypeScript + Vue Router | Proven on Alex's machine on Pelipper Post |
| Vuetify **3.x, pinned** (`vuetify@^3`) | Proven; a bare install jumps to 4.x |
| Chart.js + vue-chartjs | Proven; custom plugins for glow and grain |
| Static JSON, no backend | Nothing real to store; keeps the site fast and reviewable. Prices are saved files, never fetched by the site |
| State in composables (module scope), not Pinia | Proven pattern; practice-mode and scenario state survive navigation |
| `@fontsource-variable/newsreader`, `@fontsource-variable/hanken-grotesk` | Self-hosted open fonts |
| Vercel, `vercel.json` in the first commit | Pins framework + rewrites so deep links like `/funds/AAPL` don't 404 |

**Folder structure** (the boundary is enforced by `npm run check:boundaries`):

```
src/
  main.ts, App.vue, router/        app entry and routes; the router wires layouts to features (may import everything)
  shared/                          data, tokens, components, composables, charts, illustrations
  layouts/                         the desktop, tablet and phone shells and navigation  → imports only from shared/
  features/<feature>/              one folder per screen family: home, alerts, activity, funds,
                                   story, practice, learn, not-found  → imports only from shared/ (never another feature)
scripts/                           data generator, validator, self-test, boundary check, icon check, deploy and live checks
docs/briefs/                       one lens brief per case study
docs/                              setup, prompts, research notes, credits
```

**Routes:** `/` (Home) · `/alerts` · `/alerts/:id` · `/activity` · `/funds` · `/funds/:ticker` · `/story` (Your money story) · `/practice` · `/learn` · `/learn/:termId` · a friendly 404. Old addresses redirect: `/p301` → `/`, `/p302` → `/story`, `/p303` → `/`, `/about` → `/`. The app layout and Home load with the first screen (CLAUDE.md §7: don't lazy-load what the first screen needs); every other route is lazy-loaded.

**Password: deferred by decision.** No gate now. All routes sit behind one router and one Vercel project, so a single gate can be added later without touching the case studies.

## 8. Finance guardrails (standing rules)

1. **Only the approved lineup is real** (ruling B, Phase 2.5): AAPL Apple, MSFT Microsoft, NVDA NVIDIA, COST Costco, NKE Nike, AMZN Amazon, TSLA Tesla, BTC Bitcoin, ETH Ethereum, SOL Solana. Every other real company name, brand or ticker is still blocked (G1, G2). Rosa, her accounts and every person are invented. No company logos.
2. **Teach, never advise.** No call to action about a specific investment ("you should buy", "best stock", "switch to", "buy the dip"). FINRA's suitability guidance treats general education as not a recommendation; a call to action about specific securities is what makes it one. Alerts say what happened and what it means. Where there is something to do, it is about *money movement or settings* (retry a deposit, add a one-time deposit, auto-invest on or off), always offered as a choice, never *what to invest in* (G3). The one place the words "Buy" and "Sell" appear as buttons is **Practice**, because it's practice money.
3. **Real account vs. Practice are always visually separate.** Buying and selling only happen in Practice, under a persistent banner: "Practice money. Nothing here touches your account."
4. **Never claim SIPC membership or protection** (ruling, Sept. 25). Falsely claiming SIPC membership or protection is prohibited by federal law (15 U.S.C. §78jjj(d); see `docs/research/SIPC.md`). Nothing on the site may say or imply that First Leaf is a SIPC member or that Rosa's holdings are protected. SIPC appears only as a general fact, verified against sipc.org: *"SIPC protection covers stocks and cash at a member brokerage if the brokerage fails. It doesn't cover crypto, such as Bitcoin or Ethereum. It never covers a drop in price."* G6 bans "Member SIPC", "SIPC member", "protected by SIPC", "SIPC-protected" and "FDIC" on screen.
5. **No disclaimer on screen** (ruling B, Phase 2.5). The only data notes are the CoinGecko credit next to crypto prices and the stock data note on stock charts and stock pages: *"Stock prices on Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026 are real. Prices on the days between are modeled."* (ruling, Sept. 25; it passes the grade-8 rule on its own). No "not financial advice" or "not investment advice" in any wording (G6). The README explains the project for reviewers.
6. **No real personal or financial data, ever.** No account or routing numbers (G4).
7. **Past prices don't promise anything.** Anywhere past or projected numbers appear, we say they are an example and that nobody can promise a rate (T4).

## 9. Accessibility is a gate, not a pass

WCAG 2.1 AA is the floor, and each item is *measured and reported*, not asserted:
- Text under 18px (or under 14px bold): 4.5:1 contrast. Larger text, icons and chart marks: 3:1. Tinted chips get measured one by one.
- Color is never the only signal: severity uses icon + word + color; gains and losses use a word (in sentences) or a sign with the word in the accessible label (in tables and charts), plus color.
- Everything works by keyboard with a visible focus ring; the order follows the reading order.
- Touch targets (amended Sept. 24, 2026): under 600px wide (**P303**), every standalone control is at least **48×48px**; a term inside a sentence uses WCAG 2.5.8's inline exception, and every P303 detail screen also lists its terms as 48px chips under "Words on this screen"; P303 body text has a line-height of at least 1.6. Everywhere else, targets are at least 24×24px (WCAG 2.2 SC 2.5.8).
- Works at 200% zoom and 320px width without horizontal scrolling (except data tables, which scroll inside themselves).
- Charts have text summaries and table alternatives.

## 10. Screen sizes

One app, three layouts. Each lens is designed for its own size; every screen must still work at every size.

| | Phone, under 600px (designed at 390×844, works from 320px) | Tablet, 600–1023px | Desktop, 1024px and up (designed at 1280) |
|---|---|---|---|
| **Navigation** | Opaque top bar and opaque bottom tab bar, 48px targets | Top bar and top tabs | Left rail and top bar |
| **Phone view** (`/p303`) | No frame: the screens fill the phone | Only the phone: its own layout, the frame centered; a short window makes the phone shorter (down to a 667px screen) before scaling it, and text never drops below 14px; "Back to full view" top left | The same; the 390 × 844 frame at full size when the window is tall enough |
| **Home** | **P303's check-in:** balance, up or down this week, a small balance chart, a "needs you" card, why it moved, the last 3 transactions, word of the day | Two columns: alerts, then balance; charts full width | **P301's dashboard:** alerts first (top left), balance beside them, then balance over time, mix, goal, this week |
| **Alerts, Activity, Investments** | Full-screen pages, one tap from Home; alert details end with "Words on this screen" chips | Single column | Two panes where useful (the list with its detail) |
| **Your money story** | The chart sits inline after each passage | Inline below 1024px | The chart is pinned beside the text |
| **Practice, Words** | Full-screen, thumb-friendly | Single column | Single column with room for the practice mix |

## 11. What each case study must prove

See the Definition of Done at the end of each brief. Every DoD item is tied to a numbered Approve / Redo / Go-further line in the learner instructions.
