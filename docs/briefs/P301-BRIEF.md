# P301 · Operational dashboard: Rosa's weekly review

> **Lens brief, re-planned Sept. 24, 2026** (first written Sept. 23; updated Sept. 28 for Alex's review round, Phase 6). First Leaf is one app; this case study is one lens on it. Shared foundation: [BRIEF.md](../../BRIEF.md) §1–3 (product, person, how the lenses fit together) and §6 (style). Rosa and her account are invented; the stock and crypto names are real (ruling B, Phase 2.5; see BRIEF.md §4).
>
> **Live:** `/` on a laptop (1280px or wider; works from 1024px), plus `/alerts`, `/activity` and `/funds` (Investments) · **Code:** `src/features/home/`, `src/features/alerts/`, `src/features/activity/`, `src/features/funds/` · **Commits:** prefixed `[P301]`

## Summary

P301 is **First Leaf's Home on a laptop**, plus the Alerts, Activity and Investments pages behind it. Its user is **Rosa, a first-time investor who runs her own starter account**. Once a week she sits down with it and, in about ten minutes, answers four questions without digging through anything:

1. **How is my money doing compared with what I put in?** (the dark balance card)
2. **Does anything need me?** (the alerts, beside the balance)
3. **Am I on pace with my plan?**
4. **What does that finance term mean?** (every real finance term explains itself)

**The call we made: the balance card first, with what needs her beside it** (Alex's review round, Sept. 28). The brief asks: *"What would make their morning easier? What would tell them something's off before it becomes a problem?"* Home opens with the dark balance card on the left, holding everything about her money in one place, and **"Needs your attention"** on the right, at the same top edge. At 1280×800 both are fully visible without scrolling, so what needs her is in view the moment the page opens. Each alert says what happened, what it means and what she can do about it, then lets her move it to Handled.

**The call we made: the dashboard is the app's Home, not a separate site.** On a laptop, Rosa's Sunday review *is* opening the app. The same Home becomes a 60-second check-in on her phone (P303), with the same data and the same words, because a real product is one app used in different moments.

*Replaced Sept. 28:* "alerts first" (the alerts top left, before the balance in reading order). Alex's review put the dark balance card first, because it now holds the whole answer to "how is my money doing?" and reads as the product's anchor. The attention job is kept: the "Needs your attention" card sits right beside the balance at the same height, never below the fold, so a problem still can't hide.
*Rejected:* a separate dashboard with its own front door. It read as one of three projects instead of a product.

**How this maps to the instructions' Financial Services example** (*account balances, transaction volume, risk flags, regulatory alerts*):

| Their example | In Rosa's dashboard |
|---|---|
| Account balances | The dark card: balance, up or down on what she put in, this week, invested, cash, auto-invest |
| Transaction volume | Activity: every deposit, buy and dividend, filterable |
| Risk flags | The alerts (including a big-move alert when a holding moved 7% or more in a week), and a "Volatility: X of 5" rating on every investment |
| Regulatory alerts | The beneficiary alert (a real account-setup item brokerages ask for), and an account notice with a general fact about SIPC protection and crypto. It never says or implies that First Leaf is a SIPC member or that Rosa's holdings are protected (15 U.S.C. §78jjj(d); BRIEF.md §8) |

## The user

| | |
|---|---|
| **Who** | Rosa, 26, dental hygienist, Tucson. Six months into her first investing account. |
| **Moment** | Sunday morning, laptop, coffee. 10–15 calm minutes. |
| **Knows** | How a bank account works. Nothing about stocks, crypto or how markets move. |
| **Feels** | Nervous about losing money, especially after this summer's price dip. Embarrassed to ask "dumb" questions. |
| **Success looks like** | She closes the laptop knowing how her money is doing and what needs her, having handled it, and having learned at least one finance term. |
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
| Needs you | Name a beneficiary for your account | A funded account with no beneficiary named (rule N2). What happened: "A beneficiary is the person who gets the money in your account if you die. You have not named one yet. Brokerages ask so your money can go to the person you choose, with fewer steps for your family." What you can do: "You can add one now, or be reminded later. It takes about a minute." Its terms: Beneficiary, Brokerage account | **Add a beneficiary** opens a short settings sheet (Name, Relationship). Saving marks the alert handled, with Undo. **Remind me later** moves it to Handled for this visit, with Undo |
| Heads-up | A big move: *TICKER* moved up (or down) X% this week | Kept (ruling, Sept. 25), and proven by a validator broken case and a Playwright test that loads a **test-only** week with a 7%+ move (never shipped: a check confirms `dist/` doesn't contain it). Generated **only if the data shows it**: a holding's price moved 7% or more from last Friday's close to this Friday's. It says what happened and that prices move; never what to do about it | **Open *TICKER*** to see its price over time |
| FYI | SIPC protection doesn't cover crypto | An account notice (the "regulatory alerts" example), a general fact only: "SIPC protection covers stocks and cash at a member brokerage if the brokerage fails. It doesn't cover crypto, such as Bitcoin or Ethereum. It never covers a drop in price." Shown while the account holds crypto. Never implies First Leaf is a member | The Finance Terms entry "SIPC protection" |
| FYI | *TICKER* paid you $X | A real dividend paid in the last 7 days, if any (none in the shipped week) | Nothing to do |

For Rosa this is **one needs-you item and one FYI**: "1 thing needs you." The calm account has a beneficiary named (an invented brother), so it shows only the SIPC notice: "Nothing needs you right now." The brand-new account has no alerts.

*Removed Sept. 28 (Alex's review round):* the sent-back Sept. 1 deposit and its retry flow, the cash-waiting alert and the auto-invest pause behind it, and the goal behind plan with its one-time deposit flow. Every deposit arrived and auto-invest never paused, so none of them is true any more. *What we got wrong:* those stories gave a beginner three problems to decode on her first screen and added confusion instead of teaching. The fee-change alert was removed earlier (ruling B, Phase 2.5): stocks and crypto have no yearly fund fee.

- **"N things need you" counts only what Rosa must act on** (needs-you alerts; ratified Sept. 25). Heads-ups are listed but not counted. FYIs sit under "Good to know" and are never counted. The same on the phone.
- Every alert can be **moved to Handled** for this visit, with "Undo": the beneficiary alert through Save or Remind me later, every other alert through **Mark as handled**.
- Alerts raised since last Sunday's review (Sept. 13) show a **New** badge. In the shipped data every alert was raised before Sept. 13, so no badge shows; data rule N1 checks that each flag's "New" matches its date.
- **Severity is a word, an icon and a color**, in that order: "Needs you" (terracotta, alert icon), "Heads-up" (mustard, clock icon), "Good to know" (forest, info icon; approved rewrite 9, Sept. 25). Inside the "Good to know" section, items carry no badge, because the heading already says it (ruling, Sept. 25); the badge shows wherever an FYI appears outside that section, such as its own page. Color never works alone.
- **The beneficiary sheet is a realistic settings flow.** It asks for a name and a relationship (invented data only), saves for this visit, and changes what the app shows until reload. The data files never change.
- A price move is described as a percent of last Friday's price, with the dollar change for Rosa's own holding.

## Layout

**Desktop, 1024px and up (designed at 1280):** the app's left rail (the First Leaf logo, then Home, Activity, Investments, Your Journey, Practice, Finance Terms), a top bar with the greeting, "Prices as of Fri., Sept. 18" and the Phone view toggle, and a 12-column Home on cream. There is no footer disclosure (ruling B).

```
┌ rail ────────┐┌ top bar: Good morning, Rosa.   Prices as of Fri., Sept. 18   [Phone view] ┐
│ [logo]       │├──────────────────────────────────────────────────────────────────────┤
│ First Leaf   ││ ┌─ Balance (PANEL) ──────────┐┌─ Needs your attention ─────────────┐│
│              ││ │ Balance                    ││ 1 thing needs you.                 ││
│ Home         ││ │ $1,536.68                  ││ ● Needs you  Name a beneficiary    ││
│ Activity     ││ │ Up $136.68 on the $1,400   ││              for your account    › ││
│ Investments  ││ │ you put in.                ││ Good to know                       ││
│ Your Journey ││ │ This week: down $1.44.     ││ SIPC protection doesn't cover    › ││
│ Practice     ││ │ Invested ····· $1,534.20   ││ crypto                             ││
│ Finance      ││ │ Cash ·········· $2.48      ││                                    ││
│  Terms       ││ │ You put in ··· $1,400.00   ││                                    ││
│              ││ │ Auto-invest ········· On   ││                                    ││
│              ││ └────────────────────────────┘└────────────────────────────────────┘│
│              ││ ┌─ Balance over time ─────────────── 1 month · 3 months · Since March ┐│
│              ││ │   glowing balance line over a grainy "earned" layer               ││
│              ││ └───────────────────────────────────────────────────────────────────┘│
│              ││ ┌─ Your mix (12): stocks / crypto / cash, then one line per holding ┐│
│              ││ │ AAPL ▬▬▬▬▬ now vs. ▨▨▨▨ the mix you set          26% now · 25% set ││
│              ││ └───────────────────────────────────────────────────────────────────┘│
│              ││ ┌─ Goal: first $2,000 (6) ──────┐┌─ This week (6) ─────────────────┐│
│              ││ │ $1,400 of $2,000 put in       ││ start → market → dividends → end││
│              ││ │ On pace                       ││                                 ││
│              ││ └───────────────────────────────┘└─────────────────────────────────┘│
└──────────────┘└──────────────────────────────────────────────────────────────────────┘
```

- **The dark balance card comes first** (left, and first in reading and keyboard order). It holds the "Balance" label, the big number, "Up $136.68 on the $1,400 you put in.", "This week: down $1.44.", then the rows Invested (with the Invested term), Cash, You put in and Auto-invest.
- **"Needs your attention" sits right beside it**, at the same top edge. At 1280×800 both cards are fully visible without scrolling.
- **Alerts** (`/alerts`, `/alerts/:id`): on a laptop, a two-pane page, with the list on the left and the open alert's detail on the right. Clicking an alert on Home opens it there, so every alert has its own address.
- **Activity** (`/activity`) and **Investments** (`/funds`, `/funds/:ticker`; the route keeps its old name) are full pages reached from the rail.
- **The Investments table stacks when space is narrow** (ruling, Sept. 25): when its content area is under 600px wide (including a laptop at 200% zoom), each holding becomes a stacked row with every value labeled by its column name. No column is hidden and nothing scrolls sideways.
- **Tablet (600–1023px):** the rail becomes top tabs under a top bar with the logo; Home is two columns, the dark balance card left and "Needs your attention" right, at the same top edge; the chart goes full width.
- **Phone (under 600px):** the same Home becomes P303's check-in (see the P303 brief). P301 must not break there, but it isn't designed for it.

## Interactions (the core flows a reviewer can test)

| # | Flow | Steps | Done when |
|---|---|---|---|
| F1 | **Act on an alert** | Home → click "Name a beneficiary for your account" → its detail shows *what happened*, *what it means* (with the Beneficiary and Brokerage account terms) and *what you can do* → **Add a beneficiary** → fill in Name and Relationship → **Save** (or **Remind me later**) | Every alert opens at its own address. Saving marks the alert handled; it moves to a collapsed "Handled" group with Undo, and "1 thing needs you" becomes "Nothing needs you right now." Handled and session state survive navigation and reset on reload. |
| F2 | **Understand any finance term** | Click or tab to any dotted-underlined term → the explanation opens, with its cited source → follow a related term → **Back to** the first term | Works by mouse, keyboard and screen reader on every page. Only real finance terms (Finance Terms entries) have a term button |
| F3 | **Read the balance chart** | Switch 1 month / 3 months / Since March → move across the chart → **Show as table** | Values are read out in words; the table matches the chart |
| F4 | **Look at an investment** | Investments → AAPL, then BTC → ticker badge, price chart (Since you bought / 6 months / 1 year) with its data note (the stock data note, or "Powered by CoinGecko API"), "Volatility: X of 5" (with the Volatility term), dividends (for stocks that pay them), the SIPC notice on crypto pages, what you paid vs. its value | Every investment page works, including AMZN, TSLA and SOL, which Rosa doesn't own |
| F5 | **Check activity** | Activity → filter by type (All / Deposits / Buys / Dividends) → open a row | Every row is Completed, so there is no status filter (removed Sept. 28). Each filter shows only its type; the brand-new account shows a friendly empty state |
| F6 | **Check every scenario** | Open `/?scenario=all-clear`, then `/?scenario=brand-new` (scenarios are reached by URL only; the README lists the links) | Each scenario shows its own account, and every sentence on every card stays true |

## Edge cases and empty states (go-further)

| Case | What Rosa sees |
|---|---|
| **Nothing needs you** (calm account: a beneficiary named) | "Nothing needs you right now." A calm illustration. Any FYI (the SIPC notice, a dividend) still shows under "Good to know", without a badge. The list keeps its space, so the layout doesn't jump. |
| **Brand-new account** ($0) | A welcome state with a mid-century illustration explaining what will appear once she adds money. Charts show a labeled empty frame with one sentence, not a broken axis. |
| **Down, not up** | A holding that is down reads "down $X" in sentences, in terracotta; in tables "−$6.37" with "down" in the accessible label; plus a note that prices going up and down is normal (on the investment's page and in This week). |
| **All alerts handled** | "You've handled everything for this week." Undo stays available. |
| **An alert address that doesn't exist** (`/alerts/nope`) | A friendly "We couldn't find that alert" with a link back to Alerts |
| **An action already taken** | Once a beneficiary is saved, the alert shows that result under "What you can do", in place of the next step and its actions, and moves to Handled (with Undo). So it is never offered twice, and "needs you" no longer counts it. |
| **No alerts at all** (brand-new) | The Alerts page shows only the calm list; there is no "Choose an alert" pane for alerts that don't exist. |
| **Long text, 200% zoom, keyboard only, reduced motion** | Nothing overlaps or gets cut off; the Investments table stacks into labeled rows; focus follows reading order; no motion is needed to understand anything |

## Nice to haves (only after the Definition of Done passes)

- Print or save a one-page weekly summary.
- Keyboard shortcut `?` listing the shortcuts.

## Definition of Done

Each row maps to the numbered items in the *Case Study Learner Instructions* (LI).

| # | Done when… | LI |
|---|---|---|
| 1 | `/` loads on the live site on a laptop and shows the dashboard; `/alerts`, `/activity` and `/funds/AAPL` load directly; the old `/p301` address redirects to `/` | 1 |
| 2 | Flows F1–F6 work end to end on desktop, each with a passing Playwright test | 2 |
| 3 | The build matches this brief: Rosa, retail investing, the balance card first with "Needs your attention" beside it, every real finance term explained and cited | 3, 6 |
| 4 | Nothing-needs-you, brand-new, all-handled, missing alerts and the empty Activity state are handled | 7 |
| 5 | Designed at 1280px and usable at 1024px and 768px; nothing breaks at 390px; no horizontal scroll except inside tables | 8 |
| 6 | Repo root has README (with a P301 reviewer block) and LICENSE; `.claude/`, `CLAUDE.md`, `STATUS.md` and `docs/` hold the AI scaffolding; P301 code lives in its feature folders | 9, 10, 11 |
| 7 | `[P301]` commits show the work arriving phase by phase with descriptive messages; STATUS.md has dated entries from several sessions | 12, 13, 18 |
| 8 | This brief matches what was built (read-through in Phase 5, plus validator rule B1) | 19, 22 |
| 9 | Cream + deep-green panels, serif numbers, mid-century illustration and the First Leaf logo in the rail read as *finance for beginners*, not a generic template | 20, 23 |
| 10 | A first-time investor finds what needs attention within 5 seconds, without help | 21, 24 |
| 11 | The balance-first call is visible in the build: the dark balance card sits left and first in reading order, with "Needs your attention" beside it at the same top edge, both fully visible at 1280×800 | 26, 27 |
| 12 | Every contrast pair and target size in BRIEF.md §9 is measured and recorded in STATUS.md | 26 |
