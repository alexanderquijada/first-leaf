# First Leaf: Project Brief (shared foundation)

> **Status:** Plan, written before building (Sept. 23, 2026). Later changes follow the brief-first loop: this file is updated and committed *before* the code changes. The dated reasons live in [STATUS.md](STATUS.md#decision-log).
>
> **Everything in First Leaf is made up.** Every fund, price, person and account is fictional. It is for learning only and is not financial advice.

## Find your brief

This repo holds **three separate case studies** built on one shared product. Each one has its own brief, its own entry point and its own definition of done. A reviewer only needs **this page's §1–3 (product, person, how the pieces relate) and §6 (style)**, plus the brief for their case study.

| Case study | Brief | Live entry point | In one sentence |
|---|---|---|---|
| **P301 · Operational dashboard** | [docs/briefs/P301-BRIEF.md](docs/briefs/P301-BRIEF.md) | `/p301` | Rosa's Sunday weekly review on her laptop: what needs her, how her money is doing, and what every word means. |
| **P302 · Interactive data story** | [docs/briefs/P302-BRIEF.md](docs/briefs/P302-BRIEF.md) | `/p302` | A scroll story that argues one point: starting early beats starting big. |
| **P303 · Mobile experience** | [docs/briefs/P303-BRIEF.md](docs/briefs/P303-BRIEF.md) | `/p303` | A 60-second check-in on her phone between patients: does anything need me, and why did my balance move? |

The rest of this file is the foundation all three share: product, person, data, style, tech and guardrails.

---

## 1. The product

**First Leaf** is a made-up investing app for people who have never invested before. It is run by a made-up company, *First Leaf Investing*. It gives each new investor a small starter account, plain-language explanations for every financial word, and a **Practice** space with pretend money.

**Industry: Financial Services (retail investing).** We are designing for the part of the industry that serves first-time retail investors, the way brokerages and credit unions do with starter accounts. The design has to feel like a *real account* (balances, deposits, settling trades, fees, dividends) and not like a game or a course.

**Decision: one product, three case studies.** The instructions say reviewers test "against the Project Brief you chose." So each case study must pass completely on its own. We accept the extra work of self-contained briefs, separate folders and separate commit prefixes in exchange for one coherent portfolio piece.
*Rejected:* three unrelated products. That would be easier to review but a weaker story, and three datasets would each be thinner.

## 2. The person: Rosa (fictional)

| | |
|---|---|
| **Who** | Rosa, 26, a dental hygienist in Tucson, Arizona |
| **Where she is** | Opened her first investing account in March 2026 with $500. Adds $150 on the 1st of each month. Has never bought a fund on her own before this account. |
| **What she worries about** | Losing money without knowing why. Words nobody explains ("expense ratio"). Doing something she can't undo. |
| **Devices** | iPhone, one-handed, between patients. Laptop on Sunday mornings. |

**Decision: one person, three different moments.** All three case studies serve Rosa, but each serves a different *moment* with a different *job*. That is what keeps them from being one app at three widths.

| Case study | Rosa's moment | Her job in that moment |
|---|---|---|
| P301 | Sunday morning at her laptop, 10–15 calm minutes | Review everything, notice what's off, understand it |
| P302 | An evening on the couch | Understand one idea well enough to act on it |
| P303 | 60 seconds between patients, one hand | Know if anything needs her, and why her balance moved |

**Decision: the person who runs the account is its owner.** P301's user is Rosa herself, operating her own account. Its job is operational: it surfaces what is off (a returned deposit, money waiting in cash, a fee change, a plan falling behind) before it becomes a problem, and it lets her act on each one. See the P301 brief.
*Considered and rejected:* a staff user who oversees many learners. It would have split the product between two audiences, and Rosa's own weekly review is the moment where catching problems early matters most to her.

## 3. How the three pieces relate

- **Same data, different jobs.** All three read from one fictional dataset (section 4). The same balance, the same deposits and the same person appear everywhere, and the validator proves they agree.
- **Each stands alone.** Each case study has its own URL, works without visiting the others, and repeats the facts it needs. The landing page (`/`) offers three clearly labeled doors.
- **Shared building blocks, separate screens.** Term explanations, the disclaimer, money formatting and the practice-money logic live in `src/shared/`. Screens and layouts live in each case study's own folder. **No case study imports from another case study's folder.**
- **Demo scenarios** let a reviewer see empty and edge states without editing anything. Each scenario has **its own account**, so every sentence stays true in it:
  - *Rosa, 7 months in* (default): a few things need her.
  - *Nothing needs you*: a calmer Rosa. Every deposit went through, auto-invest is on, and she skipped the clean energy fund.
  - *Brand-new account*: she hasn't added money yet.

  Add `?scenario=all-clear` or `?scenario=brand-new` to any P301 or P303 URL, or use the Demo menu.

---

## 4. Shared data universe

All data is **generated** by `scripts/generate-data.mjs` (seeded, so it is the same every run) into `src/shared/data/`. Only `glossary.json` is hand-written copy. Nobody hand-edits the generated JSON: change the generator, re-run it, then validate.

| File | What it holds |
|---|---|
| `meta.json` | Product name, "as of" date, last market close, the disclaimer |
| `persona.json` | Rosa, and her three moments |
| `funds.json` | 5 made-up funds, 5 years of made-up weekly prices, daily prices since Rosa opened her account |
| `account.json` | Rosa's starter account (main demo): balance, cash, what she owns, auto-invest, goal, this week's change, daily history |
| `account-all-clear.json` | The calm version used by the *Nothing needs you* scenario |
| `account-new.json` | The account on the day it opened (empty state) |
| `activity.json` | Every deposit, buy and dividend, per account, including one returned deposit |
| `attention.json` | What needs attention, per account, most urgent first. **Generated from rules**, so a flag appears exactly when the account's facts call for it |
| `scenarios.json` | The three demo scenarios |
| `practice.json` | Practice mode rules ($1,000 pretend money) |
| `story-p302.json` | Every number and claim in the P302 story |
| `glossary.json` | 31 plain-language explanations |

**Dates.** "Today" in the app is **Sunday, Sept. 20, 2026**. The latest prices are from **Friday, Sept. 18, 2026**. Fixing the date means every sentence stays true, including "this week."

**The made-up funds.** Every ticker starts with `FL-`. No real U.S. ticker has that shape, so nothing can be mistaken for a real fund.

| Ticker | Name | Kind | Yearly fee | Ups and downs (1–5) |
|---|---|---|---|---|
| FL-BROAD | Broad U.S. Market Index Fund | Stocks | 0.04% | 4 |
| FL-WORLD | World Markets Index Fund | Stocks | 0.08% | 4 |
| FL-BOND | Steady Bond Index Fund | Bonds | 0.05% | 2 |
| FL-GREEN | Clean Energy Theme Fund | Stocks | 0.45% → 0.75% on Oct. 1 | 5 |
| FL-CALM | Calm Reserve Fund | Reserve (price meant to stay at $1.00) | 0.10% | 1 |

**Rosa's account at a glance** (the validator checks this block against the data):

```json brief-example
{
  "persona.age": 26,
  "account.recurringDeposit.amount": 150,
  "account.balance": 1313.72,
  "account.moneyIn": 1250,
  "account.gainLoss": 63.72,
  "account.cash": 154.76,
  "meta.asOf": "2026-09-20",
  "meta.lastClose": "2026-09-18"
}
```

**How the account behaves, grounded in how real brokerages work:**
- Deposits arrive as **cash** first. While **auto-invest** is on, each deposit buys Rosa's chosen mix (60% FL-BROAD, 20% FL-WORLD, 15% FL-BOND, 5% FL-GREEN) on the day it clears.
- **Rosa paused auto-invest on July 14**, after a price dip made her nervous (FL-BROAD fell from $89.80 to $85.06 in early July). So her **Aug. 3 deposit stayed as cash**, and dividends land in cash too. Cash counts as "waiting" once it reaches $25.
- Buys use that day's closing price, allow parts of a share, and **settle one business day later (T+1)**, matching U.S. rules since May 28, 2024.
- The **Sept. 1 deposit was returned** by her bank on Sept. 3. It never counts as money put in.
- **Her goal counts deposits only:** "Put in my first $2,000" by Feb. 1, 2027. Her plan ($500, then $150 a month) reaches exactly $2,000 by then, and the market can never make her look behind.
- **Yearly fees** are never shown as a bill, because real funds take them out of the fund's value. We explain that.
- The market is closed on weekends and on 2026 U.S. market holidays.

**Validation rules.** `npm run validate` checks every rule below and exits with an error if any fails. `npm run validate:selftest` proves each rule fails on deliberately broken data. The rule IDs match the validator output.

| Group | Rules |
|---|---|
| S · Structure | S1 files exist · S2 required fields · S3 disclaimer says made up / learning only / not financial advice |
| G · Finance guardrails | G1 FL- tickers, marked fictional · G2 no real tickers or brand names · G3 no advice language, no absolute safety claims ("is safe"), no invented crowd claims ("most people") · G4 no account numbers · G5 every person and account fictional |
| F · Funds | F1 prices positive, trading days only · F2 daily and weekly agree · F3 latest price, practice dates and time machine agree · F4 fees 0–2% and announced before they change, ratings 1–5, reserve fund stays $1.00 |
| A · Accounts (every account, every scenario) | A1 value = shares × price · A2 up/down per fund · A3 balance = funds + cash · A4 money in = deposits that went through · A5 cost and shares = buys · A6 cash reconciles · A7 overall up/down · A8 history ends at balance · A9 mix adds to 100% · A10 this week adds up to the cent · A11 goal counts deposits only and the plan reaches it · A12 buys priced right and settle T+1 · A13 "waiting since" date is true · A14 auto-invest behaves as stated |
| N · Attention flags | N1 well formed, most urgent first, "New" is true · N2 each flag appears exactly when the account's facts call for it, with matching numbers · N3 every dollar figure in flag copy exists in that account |
| C · Scenarios | C1 scenarios point at real accounts; "Nothing needs you" has nothing that needs you · C2 brand-new account is truly empty |
| T · P302 story | T1 savers match the growth formula · T2 every claim is true and the sliders can reach it · T3 bumpy version has the same overall growth and no staged crash · T4 the rate is labeled made up |
| X · Cross-case | X1 Rosa's age and deposit agree across P301, P302, P303 · X2 dates agree everywhere |
| L · Plain language | L1 glossary links resolve, word of the day exists · L2 grade 8 or below for **every** learner-facing text in the data (explanations, examples, flags, fund descriptions, story notes, scenario descriptions) · L3 no jargon · L4 explanation first lines ≤ 16 words |
| B · Brief | B1 every `brief-example` block in the briefs matches the data |

---

## 5. Plain language and term explanations

**Decision: every financial word gets a tap-to-open explanation, written at a 6th–8th grade reading level.** Rosa should never need to leave the app to understand a word.

- **Tap, not hover.** Hover doesn't exist on phones, and content that appears only on hover fails WCAG 2.1 SC 1.4.13. Each term is a real `<button>` with a dotted underline. Tap, click, Enter or Space opens a small panel. Esc, tapping outside or the close button closes it. Screen readers announce the explanation when it opens (the "toggletip" pattern).
- **Panel content:** the plain term → one short line (≤ 16 words) → 1–3 sentences of detail → one example → "Related words" links → a source (U.S. SEC's Investor.gov wherever possible).
- **We name the real term too.** For example, "Yearly fee (also called *expense ratio*)." Rosa learns the word the industry uses without having to decode it first.
- **Measured, not hoped for.** The validator scores every explanation, flag and story claim with the Flesch-Kincaid grade formula and fails anything above grade 8 (rule L2). It blocks a jargon list inside explanations (rule L3). We cross-checked our scoring against the `textstat` library, and it agreed within about one grade.
- **Copy is held for approval.** Claude Code drafts copy. Alex approves it before it ships.
- **Copy rules:** complete sentences, not headline fragments. Never label a value without saying what it measures. Card copy must stay true under every filter and every demo scenario. A subtitle is optional and has to earn its place.
- **Money format:** account amounts always show cents ($1,313.72). Whole-dollar amounts in sentences drop them ("$150 deposit"). P302's long-range numbers round to whole dollars ($242,251).
- **Gains and losses (amended Sept. 24, 2026):** in sentences, a change reads as a word with no sign: "up $15.57", "down $5.88". In tables and chart labels it reads "+$15.57" / "−$5.88" (a true minus sign), and the words "up" / "down" are in the accessible label. Color is added in both places, never alone.
- **Rate changes are in percentage points.** A fee going from 0.45% to 0.75% rose "0.30 percentage points", never "+67%". The same goes for returns and mix shares.
- **Honest wording:** never "safe" without saying safe from what ("does not go up or down with the market"). No claims about what "most people" do unless we can cite it. Our own app terms (Practice, On pace, Auto-invest) cite no outside source, because none exists.

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

**Chart colors for categories** (the 5 funds). These are *not* a ramp of greens, because a one-hue ramp can't carry categories. Picked by simulated color-blindness testing: the closest pair still differs by ΔE 17 under protanopia, deuteranopia and tritanopia. Each fund also gets its own halftone/stripe pattern, so color is never the only signal.

| Fund | Color | On panel |
|---|---|---|
| FL-BROAD | lime #C6F36B | 13.8:1 |
| FL-WORLD | sky #8FD3FF | 10.8:1 |
| FL-BOND | periwinkle #6B7FD7 | 4.7:1 |
| FL-GREEN | coral #F08A5D | 7.1:1 |
| FL-CALM | cream #F5F0E6 | 15.5:1 |

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
- **Halftone density** encodes each fund in mix charts, alongside color.
- Every chart has a plain-sentence summary above it and a "Show as table" option. Values are read out in words on hover, focus or tap.
- Motion respects `prefers-reduced-motion`. Without motion, everything still reads.

**Layout rules** (learned on the last project): at most two levels of cards, with separator lines at level three. No row ends in a big empty gap. At least a **24px gutter** between columns of numbers, measured text edge to text edge. When a card count doesn't divide into 12 columns (five funds, say), use a **CSS grid**, not the 12-column grid. Opaque bars over scrolling content.

## 7. Tech

| Choice | Why |
|---|---|
| Vue 3 (`<script setup>`) + Vite + TypeScript + Vue Router | Proven on Alex's machine on Pelipper Post |
| Vuetify **3.x, pinned** (`vuetify@^3`) | Proven; a bare install jumps to 4.x |
| Chart.js + vue-chartjs | Proven; custom plugins for glow and grain |
| Static JSON, no backend | Nothing real to store; keeps the site fast and reviewable |
| State in composables (module scope), not Pinia | Proven pattern; practice-mode and scenario state survive navigation |
| `@fontsource-variable/newsreader`, `@fontsource-variable/hanken-grotesk` | Self-hosted open fonts |
| Vercel, `vercel.json` in the first commit | Pins framework + rewrites so deep links like `/p301/activity` don't 404 |

**Folder structure** (the boundary is enforced by `npm run check:boundaries`):

```
src/
  main.ts, App.vue, router/        app shell and routes (may import everything)
  landing/                         the three doors
  shared/                          data, tokens, components, composables, charts, illustrations
  p301-dashboard/                  P301 screens and components  → imports only from shared/
  p302-story/                      P302 screens and components  → imports only from shared/
  p303-mobile/                     P303 screens and components  → imports only from shared/
scripts/                           data generator, validator, self-test, boundary check, deploy check
docs/briefs/                       one brief per case study
docs/                              setup, prompts, research notes, credits
```

**Routes:** `/` · `/p301` (weekly review) · `/p301/funds` · `/p301/funds/:ticker` · `/p301/activity` · `/p301/practice` · `/p301/learn` · `/p302` · `/p303` (check-in) · `/p303/attention` · `/p303/attention/:id` · `/p303/why` · `/p303/learn` · `/p303/learn/:termId` · `/p303/practice`. Every route is lazy-loaded.

**Password: deferred by decision.** No gate now. All routes sit behind one router and one Vercel project, so a single gate can be added later without touching the case studies.

## 8. Finance guardrails (standing rules)

1. **Everything is invented.** Funds, tickers, prices, returns, people, accounts. No real company names or real tickers, not even with invented numbers (G1, G2).
2. **Teach, never advise.** No call to action about a specific investment ("you should buy", "best fund", "switch to"). FINRA's suitability guidance treats general education as not a recommendation; a call to action about specific securities is what makes it one. Flags say what happened and what it means. Where there is something to do, it is about *money movement or settings* (retry a deposit, add a one-time deposit, auto-invest on or off), always offered as a choice, never *what to invest in* (G3). The one place the words "Buy" and "Sell" appear as buttons is **Practice**, with pretend money.
3. **Real account vs. Practice are always visually separate.** Buying and selling only happen in Practice, with pretend money, under a persistent "Practice money, not real" banner.
4. **A plain disclaimer on every case study** and in the README: *"First Leaf is a made-up company for a design case study. Every fund, price and person here is made up. This is for learning only. It is not financial advice."* (S3)
5. **No real personal or financial data, ever.** No account or routing numbers (G4).
6. **Past prices don't promise anything.** Anywhere past or projected numbers appear, we say they are made up and that no one can promise a rate (T4).

## 9. Accessibility is a gate, not a pass

WCAG 2.1 AA is the floor, and each item is *measured and reported*, not asserted:
- Text under 18px (or under 14px bold): 4.5:1 contrast. Larger text, icons and chart marks: 3:1. Tinted chips get measured one by one.
- Color is never the only signal: severity uses icon + word + color; gains and losses use a word (in sentences) or a sign with the word in the accessible label (in tables and charts), plus color.
- Everything works by keyboard with a visible focus ring; the order follows the reading order.
- Touch targets (amended Sept. 24, 2026): on **P303**, every standalone control is at least **48×48px**; a term inside a sentence uses WCAG 2.5.8's inline exception, and every P303 detail screen also lists its terms as 48px chips under "Words on this screen"; P303 body text has a line-height of at least 1.6. Everywhere else, targets are at least 24×24px (WCAG 2.2 SC 2.5.8).
- Works at 200% zoom and 320px width without horizontal scrolling (except data tables, which scroll inside themselves).
- Charts have text summaries and table alternatives.

## 10. Screen sizes, per case study

| | Phone 360–430px | Tablet 768–1024px | Desktop 1280px+ |
|---|---|---|---|
| **P301** (desktop-first) | Single column, attention list first, nav in a menu | Two columns, nav as top tabs | Full dashboard with side rail |
| **P302** (both) | Chart sits inline after each passage | Inline below 1024px; pinned beside the text from 1024px | Chart pinned beside the text |
| **P303** (mobile-first) | The design target | Centered phone-width column | Centered phone-width column with a short "best on your phone" note. Must not break. |

## 11. What each case study must prove

See the Definition of Done at the end of each brief. Every DoD item is tied to a numbered Approve / Redo / Go-further line in the learner instructions.
