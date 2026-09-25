# P301 · Operational dashboard: Rosa's weekly review

> **Lens brief, re-planned Sept. 24, 2026** (first written Sept. 23). First Leaf is one app; this case study is one lens on it. Shared foundation: [BRIEF.md](../../BRIEF.md) §1–3 (product, person, how the lenses fit together) and §6 (style). Rosa and her account are invented; the stock and crypto names are real (ruling B, Phase 2.5; see BRIEF.md §4).
>
> **Live:** `/` on a laptop (1280px or wider; works from 1024px), plus `/alerts`, `/activity` and `/funds` (Investments) · **Code:** `src/features/home/`, `src/features/alerts/`, `src/features/activity/`, `src/features/funds/` · **Commits:** prefixed `[P301]`

## Summary

P301 is **First Leaf's Home on a laptop**, plus the Alerts, Activity and Investments pages behind it. Its user is **Rosa, a first-time investor who runs her own starter account**. Once a week she sits down with it and, in about ten minutes, answers four questions without digging through anything:

1. **Does anything need me?** (the alerts)
2. **How is my money doing compared with what I put in?**
3. **Am I on pace with my plan?**
4. **What does that word mean?** (every term explains itself)

**The call we made: alerts first.** The brief asks: *"What would make their morning easier? What would tell them something's off before it becomes a problem?"* The account's owner is its operator, so the first thing on the laptop screen is not her balance but **what's off**: a returned deposit, money waiting in cash, a big price move, a plan falling behind. Each alert says what happened, what it means and what she can do about it, then lets her mark it handled.

**The call we made: the dashboard is the app's Home, not a separate site.** On a laptop, Rosa's Sunday review *is* opening the app. The same Home becomes a 60-second check-in on her phone (P303), with the same data and the same words, because a real product is one app used in different moments.

*Rejected:* a balance-first "hero number" layout like most fintech references. It answers "how much?" before "is anything wrong?", which is the wrong order for a nervous beginner, and it reads as a generic template.
*Rejected:* a separate dashboard behind a landing page. It read as one of three projects instead of a product.

**How this maps to the instructions' Financial Services example** (*account balances, transaction volume, risk flags, regulatory alerts*):

| Their example | In Rosa's dashboard |
|---|---|
| Account balances | Balance, money put in, up or down, cash waiting |
| Transaction volume | Activity: every deposit, buy and dividend, filterable |
| Risk flags | The alerts (including a big-move alert when a holding moved 7% or more in a week), and "Ups and downs" ratings (1–5) on every investment |
| Regulatory alerts | An account notice with a general fact about SIPC protection and crypto. It never says or implies that First Leaf is a SIPC member or that Rosa's holdings are protected (15 U.S.C. §78jjj(d); BRIEF.md §8) |

## The user

| | |
|---|---|
| **Who** | Rosa, 26, dental hygienist, Tucson. Six months into her first investing account. |
| **Moment** | Sunday morning, laptop, coffee. 10–15 calm minutes. |
| **Knows** | How a bank account works. Nothing about stocks, crypto or how markets move. |
| **Feels** | Nervous about losing money. This summer a price dip made her pause auto-invest. Embarrassed to ask "dumb" questions. |
| **Success looks like** | She closes the laptop knowing what needs her, having handled it, and having learned at least one word. |
| **Must never happen** | A scary number with no explanation. Anything that reads like the app telling her what to buy. |

## Data

Reads only from `src/shared/data/` through `useScenario` (see BRIEF.md §4). Key facts, checked by the validator:

```json brief-example
{
  "attention.rosa-starter.0.id": "deposit-returned",
  "attention.rosa-starter.0.severity": "needs-you",
  "attention.rosa-starter.3.id": "sipc-crypto",
  "account.goal.target": 2000,
  "account.goal.behindBy": 150,
  "account.goal.plannedMoneyInToDate": 1400,
  "account.goal.actualMoneyInToDate": 1250,
  "account.autoInvest.pausedOn": "2026-06-08",
  "account.investedValue": 1056.23,
  "account.dividendsTotal": 2.27,
  "account.holdings.3.ticker": "COST",
  "account.holdings.3.gainLoss": -15.01
}
```

**What needs Rosa's attention** (generated from rules, so it's true for whichever demo account is showing):

| Severity | Alert | Why it's there | What she can do (never "what to buy") |
|---|---|---|---|
| Needs you | Your $150 deposit from Sept. 1 was sent back | Her bank returned it on Sept. 3 | **Try the deposit again** (review, confirm, confirmation) |
| Heads-up | Your goal is $150 behind your plan | $1,400 planned vs. $1,250 went through. Deposits only; the market doesn't count. | **Add a one-time deposit** (same flow, amount filled in), or keep going |
| Heads-up | $X is waiting in cash | Auto-invest paused since the day after the dip's low (data-driven, BRIEF.md §4); later deposits and dividends stayed as cash | **See auto-invest settings** |
| Heads-up | A big move: *TICKER* moved up (or down) X% this week | Kept (ruling, Sept. 25), and proven by a validator broken case and a Playwright test that loads a **test-only** week with a 7%+ move (never shipped: a check confirms `dist/` doesn't contain it). Generated **only if the data shows it**: a holding's price moved 7% or more from last Friday's close to this Friday's. It says what happened and that prices move; never what to do about it | **Open *TICKER*** to see its price over time |
| FYI | SIPC protection doesn't cover crypto | An account notice (the "regulatory alerts" example), a general fact only: "SIPC protection covers stocks and cash at a member brokerage if the brokerage fails. It doesn't cover crypto, such as Bitcoin or Ethereum. It never covers a drop in price." Shown while the account holds crypto. Never implies First Leaf is a member | The glossary word "SIPC protection" |
| FYI | *TICKER* paid you $X | A real dividend paid in the last 7 days, if any | Nothing to do |

The fee-change alert is removed (ruling B, Phase 2.5): stocks and crypto have no yearly fund fee.

- **"N things need you" counts only what Rosa must act on** (needs-you and heads-up alerts). FYIs sit under "Just so you know" and are never counted (ruling, Sept. 25). The same on the phone.
- Every alert can be **marked handled** (remembered for the session, with "Undo").
- Alerts raised since last Sunday's review (Sept. 13) show a **New** badge.
- **Severity is a word, an icon and a color**, in that order: "Needs you" (terracotta, alert icon), "Heads-up" (mustard, clock icon), "FYI" (forest, info icon). Color never works alone.
- **Every money action is a realistic flow:** review → confirm → confirmation, and it changes what the app shows for the rest of the session (a Pending deposit in Activity, "Auto-invest: On"). Reloading resets it; the data files never change.
  - *Try the deposit again* ends with "Your deposit is on its way. It should arrive in 1 to 3 business days." and a Pending deposit in Activity. (The line lives in one place in the code and is used everywhere.)
  - *Add a one-time deposit* is the same flow with the amount filled in.
  - *See auto-invest settings* shows the paused status with an On/Off switch and a confirmation.
- A price move is described as a percent of last Friday's price, with the dollar change for Rosa's own holding.

## Layout

**Desktop, 1024px and up (designed at 1280):** the app's left rail (Home, Activity, Investments, Your money story, Practice, Words), a top bar with the greeting, "Prices as of Fri., Sept. 18" and the Phone view toggle, and a 12-column Home on cream. There is no footer disclosure (ruling B).

```
┌ rail ────────┐┌ top bar: Good morning, Rosa.   Prices as of Fri., Sept. 18   [Phone view] ┐
│ Home         │├──────────────────────────────────────────────────────────────────────┤
│ Activity     ││ ┌─ Needs your attention (7 col) ──────────┐┌─ Balance (5, PANEL) ──┐│
│ Investments  ││ │ ● Needs you  Deposit sent back       › ││ $X                    ││
│ Your money   ││ │ ◐ Heads-up   Goal $150 behind plan   › ││ Up $X on the          ││
│  story       ││ │ ◐ Heads-up   $X waiting in cash      › ││ $1,250 you put in     ││
│ Practice     ││ │ ◐ Heads-up   A big move (if any) NEW › ││ This week: up $X      ││
│ Words        ││ │ ○ FYI        Crypto and SIPC         › ││ Auto-invest: paused   ││
│              ││ └─────────────────────────────────────────┘└───────────────────────┘│
│              ││ ┌─ Balance over time ─────────────── 1 month · 3 months · Since March ┐│
│              ││ │   glowing balance line over a grainy "earned" layer               ││
│              ││ └───────────────────────────────────────────────────────────────────┘│
│              ││ ┌─ Your mix (4) ─┐┌─ Goal: first $2,000 (4) ┐┌─ This week (4) ──────┐│
│              ││ │ now vs. the    ││ $1,250 of $2,000 put in ││ start → market →     ││
│              ││ │ mix you set    ││ $150 behind plan        ││ dividends → end      ││
│              ││ └────────────────┘└─────────────────────────┘└──────────────────────┘│
└──────────────┘└──────────────────────────────────────────────────────────────────────┘
```

- **The alerts come first** (top left, where the eye lands, and first in reading order). The balance sits beside them in the dark panel, the futuristic half of the brand.
- **Alerts** (`/alerts`, `/alerts/:id`): on a laptop, a two-pane page, with the list on the left and the open alert's detail on the right. Clicking an alert on Home opens it there, so every alert has its own address.
- **Activity** (`/activity`) and **Investments** (`/funds`, `/funds/:ticker`; the route keeps its old name) are full pages reached from the rail.
- **Tablet (600–1023px):** the rail becomes top tabs; Home is two columns; the chart goes full width.
- **Phone (under 600px):** the same Home becomes P303's check-in (see the P303 brief). P301 must not break there, but it isn't designed for it.

## Interactions (the core flows a reviewer can test)

| # | Flow | Steps | Done when |
|---|---|---|---|
| F1 | **Act on an alert** | Home → click an alert → its detail shows *what happened*, *what it means* (with term explanations) and *what you can do* → use its action → **Mark as handled** | Every alert opens at its own address. Money actions run review → confirm → confirmation and change the session (a Pending deposit, auto-invest on). Handled alerts move to a collapsed "Handled" group with Undo; handled and session state survive navigation and reset on reload. |
| F2 | **Understand any word** | Click or tab to any dotted-underlined term → the explanation opens → follow a related word → **Back to** the first word | Works by mouse, keyboard and screen reader on every page |
| F3 | **Read the balance chart** | Switch 1 month / 3 months / Since March → move across the chart → **Show as table** | Values are read out in words; the table matches the chart |
| F4 | **Look at an investment** | Investments → AAPL, then BTC → ticker badge, price chart (Since you bought / 6 months / 1 year) with its data note (the stock data note, or "Crypto prices by CoinGecko"), "Ups and downs: X of 5", dividends (for stocks that pay them), the SIPC notice on crypto pages, what you paid vs. its value | Every investment page works, including AMZN, TSLA and SOL, which Rosa doesn't own |
| F5 | **Check activity** | Activity → filter by type (Deposits / Buys / Dividends) and status (Completed / Returned) → open the returned deposit | Filters combine; a combination with no results (e.g. Dividends + Returned) shows a friendly empty state |
| F6 | **Check every scenario** | Open `/?scenario=all-clear`, then `/?scenario=brand-new` (scenarios are reached by URL only; the README lists the links) | Each scenario shows its own account, and every sentence on every card stays true |

## Edge cases and empty states (go-further)

| Case | What Rosa sees |
|---|---|
| **Nothing needs you** (calm account: every deposit went through, auto-invest on) | "Nothing needs you right now." A calm illustration. Any FYI (the SIPC notice, a dividend) still shows under "Just so you know". The list keeps its space, so the layout doesn't jump. |
| **Brand-new account** ($0) | A welcome state with a mid-century illustration explaining what will appear once she adds money. Charts show a labeled empty frame with one sentence, not a broken axis. |
| **Down, not up** | A holding that is down reads "down $X" in sentences, in terracotta; in tables "−$6.37" with "down" in the accessible label; plus an explanation that ups and downs are normal. |
| **All alerts handled** | "You've handled everything for this week." Undo stays available. |
| **An alert address that doesn't exist** (`/alerts/nope`) | A friendly "We couldn't find that alert" with a link back to Alerts |
| **Long text, 200% zoom, keyboard only, reduced motion** | Nothing overlaps or gets cut off; focus follows reading order; no motion is needed to understand anything |

## Nice to haves (only after the Definition of Done passes)

- Print or save a one-page weekly summary.
- Keyboard shortcut `?` listing the shortcuts.

## Definition of Done

Each row maps to the numbered items in the *Case Study Learner Instructions* (LI).

| # | Done when… | LI |
|---|---|---|
| 1 | `/` loads on the live site on a laptop and shows the dashboard; `/alerts`, `/activity` and `/funds/AAPL` load directly; the old `/p301` address redirects to `/` | 1 |
| 2 | Flows F1–F6 work end to end on desktop, each with a passing Playwright test | 2 |
| 3 | The build matches this brief: Rosa, retail investing, alerts first, every term explained | 3, 6 |
| 4 | Nothing-needs-you, brand-new, all-handled, missing alerts and every empty filter are handled | 7 |
| 5 | Designed at 1280px and usable at 1024px and 768px; nothing breaks at 390px; no horizontal scroll except inside tables | 8 |
| 6 | Repo root has README (with a P301 reviewer block) and LICENSE; `.claude/`, `CLAUDE.md`, `STATUS.md` and `docs/` hold the AI scaffolding; P301 code lives in its feature folders | 9, 10, 11 |
| 7 | `[P301]` commits show the work arriving phase by phase with descriptive messages; STATUS.md has dated entries from several sessions | 12, 13, 18 |
| 8 | This brief matches what was built (read-through in Phase 5, plus validator rule B1) | 19, 22 |
| 9 | Cream + deep-green panels, serif numbers and mid-century illustration read as *finance for beginners*, not a generic template | 20, 23 |
| 10 | A first-time investor finds what needs attention within 5 seconds, without help | 21, 24 |
| 11 | The alerts-first call is visible in the build: the alerts sit top left, before the balance in reading order | 26, 27 |
| 12 | Every contrast pair and target size in BRIEF.md §9 is measured and recorded in STATUS.md | 26 |
