# P303 · Mobile experience: the 60-second check-in

> **Plan, written before building (Sept. 23, 2026).** Shared foundation: [BRIEF.md](../../BRIEF.md) §1–3 (product, person, how the pieces relate) and §6 (style). Everything here is made up and is not financial advice.
>
> **Live:** `/p303` (open it on a phone, or narrow your browser to 390px) · **Code:** `src/p303-mobile/` · **Commits:** prefixed `[P303]`

## Summary

**One task, done well:** Rosa opens First Leaf on her phone between other things and, in about 60 seconds and with one hand, learns:

1. **Does anything need me?**
2. **Why did my balance move this week?**
3. **One new word**, if she has another 10 seconds.

Practice (pretend money) is one tab away for later, but the check-in is the product. Everything on the first screen serves the 60-second job.

*Rejected:* shrinking the P301 dashboard to phone size. A dashboard asks you to scan; a check-in answers. The phone screen gets three answers, not twelve widgets.
*Rejected:* a daily-lesson app. That drifts into generic ed-tech and away from financial services.

## The user

| | |
|---|---|
| **Who** | Rosa, 26, dental hygienist. The same person as P301, in a different moment. |
| **Moment** | Standing in line for coffee, or between patients on a weekday. One hand. Likely to be interrupted. |
| **Needs** | A yes/no answer first, a reason second, detail only if she asks. |
| **Constraints** | One thumb. Glare. 60 seconds. |
| **Success looks like** | She puts the phone away knowing whether anything needs her, and doesn't feel anxious. |

## Data

Reads only from `src/shared/data/`. This week's change (the "why did it move" answer) is checked by rule A10: start + deposits + dividends + market change = end, and the per-fund pieces add up to the market change **to the cent**.

```json brief-example
{
  "account.weeklyChange.from": "2026-09-11",
  "account.weeklyChange.to": "2026-09-18",
  "account.weeklyChange.startBalance": 1298.15,
  "account.weeklyChange.deposits": 0,
  "account.weeklyChange.dividends": 0.5,
  "account.weeklyChange.marketChange": 15.07,
  "account.weeklyChange.totalChange": 15.57,
  "account.weeklyChange.endBalance": 1313.72,
  "attention.rosa-starter.0.title": "Your $150 deposit from Sept. 1 was sent back",
  "meta.wordOfTheDay": "expense-ratio"
}
```

**Word of the day:** set in the data (`meta.wordOfTheDay`, "Yearly fee" on Sept. 20). **Next word** follows the glossary order, so it's predictable and testable.

**Flags stay inside P303.** P303 never links into P301's pages. A flag's detail screen shows what it needs inline:

| Flag | What P303's detail shows |
|---|---|
| Deposit sent back | The deposit's dates and status, and a **Try again** demo dialog |
| Goal behind plan | Planned vs. put in, and an **Add a one-time deposit** demo dialog |
| Waiting in cash | Auto-invest status (paused since July 14) with a demo toggle |
| Fee going up | The fund's name, old and new fee, and the dollar difference |
| Dividend paid | Amount, fund and date |

## Layout (designed at 390 × 844, works from 320px)

```
┌──────────────────────────────┐
│ First Leaf        Demo ▾     │  opaque top bar
│                              │
│ Hi, Rosa.                    │
│ $1,313.72                    │  serif, big
│ Up $15.57 this week ⓘ        │
│                              │
│ ┌──────── PANEL ───────────┐ │
│ │ ● 1 thing needs you       │ │  tap → detail
│ │ Your $150 deposit from    │ │
│ │ Sept. 1 was sent back   › │ │
│ │ + 3 heads-ups             │ │
│ └───────────────────────────┘ │
│ ┌ Why it moved this week ──┐ │
│ │ market up $15.07         │ │  tap → waterfall
│ │ dividend $0.50         › │ │
│ └───────────────────────────┘ │
│ ┌ Word of the day ─────────┐ │
│ │ Yearly fee             › │ │
│ └───────────────────────────┘ │
│  Disclaimer                  │
├──────────────────────────────┤
│  Check-in   Practice   Words │  opaque tab bar in the thumb zone
└──────────────────────────────┘
```

- **Most important thing highest, most-used controls lowest.** Answers sit at the top; navigation sits at the bottom, within reach of the thumb.
- **Every touch target is at least 48 × 48px** (above WCAG's 44px enhanced target), with 8px between targets.
- **The top and bottom bars are opaque**, so text scrolling behind them can never ruin contrast.
- **Desktop:** a centered 480px-wide column on cream, with a short note that it's designed for phones. Nothing breaks, stretches or overflows.

## Interactions (the core flows a reviewer can test)

| # | Flow | Steps | Done when |
|---|---|---|---|
| F1 | **Glance** | Open `/p303` | Balance, this week's change and the "needs you" count are visible without scrolling at 390 × 844 |
| F2 | **See what needs me** | Tap the attention card → list → tap a flag → detail (what happened, what it means, what you can do) → back | Back returns to where she was; opened flags show as "Seen" for the session |
| F3 | **Understand why it moved** | Tap "Why it moved" → a waterfall from last Friday's balance to this Friday's: market change, dividends, deposits → tap a fund for its share of the move | The pieces add up exactly (A10), and each piece has a term explanation |
| F4 | **Learn a word** | Tap Word of the day → explanation → **Next word** or a related word | Works one-handed; Back works |
| F5 | **Practice** | Practice tab → pick a fund → amount keypad → review sheet → confirm → see it in "What you own in Practice" | The "Practice money, not real" banner is always visible; the real account never changes |
| F6 | **Switch demo scenario** | Demo ▾ → Nothing needs you / Brand-new | The home screen shows that scenario's account, and every sentence stays true |

**Term explanations on a phone** open as a bottom sheet (easier to reach and read than a floating bubble), with the same content and accessibility as everywhere else.

## Edge cases and empty states (go-further)

| Case | What Rosa sees |
|---|---|
| **Nothing needs you** (calm account) | "Nothing needs you today." A small mid-century sun. The FYI dividend shows under "Just so you know." The card keeps its size. |
| **Brand-new account** | "Welcome, Rosa." What happens after the first deposit, in three short steps. No $0.00 charts. |
| **Funds that went down** | In "Why it moved," FL-WORLD (down $5.88) and FL-BOND (down $0.85) show the word "down", a minus sign and terracotta, next to an explanation that ups and downs are normal. Never red alone. |
| **Practice errors** (not enough pretend money, $0, more than 2 decimals) | An inline message above the keypad; Confirm stays disabled |
| **Interrupted mid-flow** | Practice keeps the half-entered order in memory for the session |
| **Large text (200%) / small phone (320px) / landscape** | Cards grow taller, never wider; nothing gets cut off |

## Nice to haves

- Swipe between flags in the detail view.
- An add-to-home-screen icon and theme color (web app manifest).

## Definition of Done

| # | Done when… | LI |
|---|---|---|
| 1 | `/p303` loads on the live site on a real phone, directly and from the landing page | 1 |
| 2 | Flows F1–F6 work end to end at 390px, each with a passing Playwright test | 2 |
| 3 | It does *one* job, the check-in, for Rosa in a financial-services context, as this brief describes | 3, 6 |
| 4 | Nothing-needs-you, brand-new, down-moving funds and every Practice error are handled | 7 |
| 5 | Works at 320px, 390px, 768px and 1280px; the desktop view doesn't break | 8 |
| 6 | Repo root has README (with a P303 reviewer block) and LICENSE; AI scaffolding in `.claude/`, `CLAUDE.md`, `STATUS.md`, `docs/`; P303 code lives only in `src/p303-mobile/` | 9, 10, 11 |
| 7 | `[P303]` commits show the work arriving phase by phase; STATUS.md has dated entries from several sessions | 12, 13, 18 |
| 8 | This brief matches what was built (read-through in Phase 5, plus rule B1) | 19, 22 |
| 9 | Thumb-zone navigation, 48px targets and glanceable type feel designed *for a phone*, not squeezed onto one | 20, 23, 26 |
| 10 | Someone who has never invested can answer "does anything need me?" within 5 seconds | 21, 24 |
| 11 | The calls in this brief are visible: three answers on the first screen, nothing that needs scanning, and flags that never leave P303 | 27 |
