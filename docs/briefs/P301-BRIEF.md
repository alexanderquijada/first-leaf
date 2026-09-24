# P301 · Operational dashboard: Rosa's weekly review

> **Lens brief, re-planned Sept. 24, 2026** (first written Sept. 23). First Leaf is one app; this case study is one lens on it. Shared foundation: [BRIEF.md](../../BRIEF.md) §1–3 (product, person, how the lenses fit together) and §6 (style). Everything here is made up and is not financial advice.
>
> **Live:** `/` on a laptop (1280px or wider; works from 1024px), plus `/alerts`, `/activity` and `/funds` · **Code:** `src/features/home/`, `src/features/alerts/`, `src/features/activity/`, `src/features/funds/` · **Commits:** prefixed `[P301]`

## Summary

P301 is **First Leaf's Home on a laptop**, plus the Alerts, Activity and Funds pages behind it. Its user is **Rosa, a first-time investor who runs her own starter account**. Once a week she sits down with it and, in about ten minutes, answers four questions without digging through anything:

1. **Does anything need me?** (the alerts)
2. **How is my money doing compared with what I put in?**
3. **Am I on pace with my plan?**
4. **What does that word mean?** (every term explains itself)

**The call we made: alerts first.** The brief asks: *"What would make their morning easier? What would tell them something's off before it becomes a problem?"* The account's owner is its operator, so the first thing on the laptop screen is not her balance but **what's off**: a returned deposit, money waiting in cash, a fee about to rise, a plan falling behind. Each alert says what happened, what it means and what she can do about it, then lets her mark it handled.

**The call we made: the dashboard is the app's Home, not a separate site.** On a laptop, Rosa's Sunday review *is* opening the app. The same Home becomes a 60-second check-in on her phone (P303), with the same data and the same words, because a real product is one app used in different moments.

*Rejected:* a balance-first "hero number" layout like most fintech references. It answers "how much?" before "is anything wrong?", which is the wrong order for a nervous beginner, and it reads as a generic template.
*Rejected:* a separate dashboard behind a landing page. It read as one of three projects instead of a product.

**How this maps to the instructions' Financial Services example** (*account balances, transaction volume, risk flags, regulatory alerts*):

| Their example | In Rosa's dashboard |
|---|---|
| Account balances | Balance, money put in, up or down, cash waiting |
| Transaction volume | Activity: every deposit, buy and dividend, filterable |
| Risk flags | The alerts, and "ups and downs" ratings (1–5) on every fund |
| Regulatory alerts | Fund notices, like FL-GREEN's announced fee change (funds must disclose fee changes) |

## The user

| | |
|---|---|
| **Who** | Rosa, 26, dental hygienist, Tucson. 7 months into her first investing account. |
| **Moment** | Sunday morning, laptop, coffee. 10–15 calm minutes. |
| **Knows** | How a bank account works. Nothing about funds, fees or how markets move. |
| **Feels** | Nervous about losing money. In July a price dip made her pause auto-invest. Embarrassed to ask "dumb" questions. |
| **Success looks like** | She closes the laptop knowing what needs her, having handled it, and having learned at least one word. |
| **Must never happen** | A scary number with no explanation. Anything that reads like the app telling her what to buy. |

## Data

Reads only from `src/shared/data/` through `useScenario` (see BRIEF.md §4). Key facts, checked by the validator:

```json brief-example
{
  "attention.rosa-starter.0.id": "deposit-returned",
  "attention.rosa-starter.0.severity": "needs-you",
  "account.goal.target": 2000,
  "account.goal.behindBy": 150,
  "account.goal.plannedMoneyInToDate": 1400,
  "account.goal.actualMoneyInToDate": 1250,
  "account.autoInvest.pausedOn": "2026-07-14",
  "account.investedValue": 1158.96,
  "account.dividendsTotal": 4.76,
  "account.holdings.3.ticker": "FL-GREEN",
  "account.holdings.3.gainLoss": -6.37
}
```

**What needs Rosa's attention** (generated from rules, so it's true for whichever demo account is showing):

| Severity | Alert | Why it's there | What she can do (never "what to buy") |
|---|---|---|---|
| Needs you | Your $150 deposit from Sept. 1 was sent back | Her bank returned it on Sept. 3 | **Try the deposit again** (demo dialog) |
| Heads-up | Your goal is $150 behind your plan | $1,400 planned vs. $1,250 went through. Deposits only; the market doesn't count. | **Add a one-time deposit** (demo), or keep going |
| Heads-up | $154.76 is waiting in cash | Auto-invest paused since July 14; the Aug. 3 deposit and dividends stayed as cash | **See auto-invest settings** |
| Heads-up | FL-GREEN is raising its yearly fee on Oct. 1 | Announced Sept. 15: 0.45% → 0.75% (0.30 percentage points) on $48.63 ≈ $0.15 more a year | **Open FL-GREEN** to see its fee over time |
| FYI | FL-BOND paid you $0.50 | Dividend on Sept. 15 | Nothing to do |

- Every alert can be **marked handled** (remembered for the session, with "Undo").
- Alerts raised since last Sunday's review (Sept. 13) show a **New** badge.
- **Severity is a word, an icon and a color**, in that order: "Needs you" (terracotta, alert icon), "Heads-up" (mustard, clock icon), "FYI" (forest, info icon). Color never works alone.
- **Every action that would move money opens a demo dialog** that says plainly that nothing real happens in this demo.
- A fee change is described in **percentage points**, never as a percent of the old fee.

## Layout

**Desktop, 1024px and up (designed at 1280):** the app's left rail (Home, Activity, Funds, Your money story, Practice, Words), a top bar with the greeting, "Prices as of Fri., Sept. 18" and the Demo menu, and a 12-column Home on cream. The footer on every page holds the disclaimer and "About this demo".

```
┌ rail ────┐┌ top bar: Good morning, Rosa.   Prices as of Fri., Sept. 18   [Demo ▾] ┐
│ Home     │├──────────────────────────────────────────────────────────────────────┤
│ Activity ││ ┌─ Needs your attention (7 col) ──────────┐┌─ Balance (5, PANEL) ──┐│
│ Funds    ││ │ ● Needs you  Deposit sent back       › ││ $1,313.72             ││
│ Your     ││ │ ◐ Heads-up   Goal $150 behind plan   › ││ Up $63.72 on the      ││
│  money   ││ │ ◐ Heads-up   $154.76 waiting in cash › ││ $1,250 you put in     ││
│  story   ││ │ ◐ Heads-up   FL-GREEN fee going up NEW›││ This week: up $15.57  ││
│ Practice ││ │ ○ FYI        FL-BOND paid you $0.50 NEW││ Auto-invest: paused   ││
│ Words    ││ └─────────────────────────────────────────┘└───────────────────────┘│
│          ││ ┌─ Balance over time: what you put in vs. what it earned ─ 1M 3M All ┐│
│          ││ │   glowing balance line over a grainy "earned" layer               ││
│          ││ └───────────────────────────────────────────────────────────────────┘│
│          ││ ┌─ Your mix (4) ─┐┌─ Goal: first $2,000 (4) ┐┌─ This week (4) ──────┐│
│          ││ │ ring: now vs.  ││ $1,250 of $2,000 put in ││ start → market →     ││
│          ││ │ the mix you set││ $150 behind plan        ││ dividends → end      ││
│          ││ └────────────────┘└─────────────────────────┘└──────────────────────┘│
│          ││ Footer: disclaimer · About this demo                                 │
└──────────┘└──────────────────────────────────────────────────────────────────────┘
```

- **The alerts come first** (top left, where the eye lands, and first in reading order). The balance sits beside them in the dark panel, the futuristic half of the brand.
- **Alerts** (`/alerts`, `/alerts/:id`): on a laptop, a two-pane page, with the list on the left and the open alert's detail on the right. Clicking an alert on Home opens it there, so every alert has its own address.
- **Activity** (`/activity`) and **Funds** (`/funds`, `/funds/:ticker`) are full pages reached from the rail.
- **Tablet (600–1023px):** the rail becomes top tabs; Home is two columns; the chart goes full width.
- **Phone (under 600px):** the same Home becomes P303's check-in (see the P303 brief). P301 must not break there, but it isn't designed for it.

## Interactions (the core flows a reviewer can test)

| # | Flow | Steps | Done when |
|---|---|---|---|
| F1 | **Act on an alert** | Home → click an alert → its detail shows *what happened*, *what it means* (with term explanations) and *what you can do* → use its action → **Mark as handled** | Every alert opens at its own address and closes with Esc or Back. Money actions open a demo dialog. Handled alerts move to a collapsed "Handled" group with Undo. |
| F2 | **Understand any word** | Click or tab to any dotted-underlined term → the explanation opens → follow a related word → **Back to** the first word | Works by mouse, keyboard and screen reader on every page |
| F3 | **Read the balance chart** | Switch 1M / 3M / All → move across the chart → **Show as table** | Values are read out in words; the table matches the chart |
| F4 | **Look at a fund** | Funds → FL-GREEN → price chart (since you bought / 1 year / 5 years), yearly fee with the Oct. 1 change, ups and downs 1–5, what's inside, what you paid vs. its value | Every fund page works, including FL-CALM, which Rosa doesn't own ("You don't own this fund") |
| F5 | **Check activity** | Activity → filter by type (Deposits / Buys / Dividends) and status (Completed / Returned) → open the returned deposit | Filters combine; a combination with no results (e.g. Dividends + Returned) shows a friendly empty state |
| F6 | **Switch demo scenario** | Demo ▾ in the top bar → *Nothing needs you* → *Brand-new account* | Each scenario shows its own account, and every sentence on every card stays true |

## Edge cases and empty states (go-further)

| Case | What Rosa sees |
|---|---|
| **Nothing needs you** (calm account: every deposit went through, auto-invest on) | "Nothing needs you this week." A calm illustration. The FYI (a dividend) still shows under "Just so you know". The list keeps its space, so the layout doesn't jump. |
| **Brand-new account** ($0) | A welcome state with a mid-century illustration explaining what will appear once she adds money. Charts show a labeled empty frame with one sentence, not a broken axis. |
| **Down, not up** | FL-GREEN is down $6.37. In sentences it reads "down $6.37" in terracotta; in tables "−$6.37" with "down" in the accessible label; plus an explanation that ups and downs are normal. |
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
| 1 | `/` loads on the live site on a laptop and shows the dashboard; `/alerts`, `/activity` and `/funds/FL-GREEN` load directly; the old `/p301` address redirects to `/` | 1 |
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
