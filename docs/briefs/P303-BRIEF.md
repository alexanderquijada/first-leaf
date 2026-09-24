# P303 · Mobile experience: the 60-second check-in

> **Lens brief, re-planned Sept. 24, 2026** (first written Sept. 23 as a separate phone site). First Leaf is one app; this case study is one lens on it. Shared foundation: [BRIEF.md](../../BRIEF.md) §1–3 (product, person, how the lenses fit together) and §6 (style). Everything here is made up and is not financial advice.
>
> **Live:** the whole app under 600px wide, starting at `/`. Open it on a phone, narrow your browser to 390px, or on a laptop use **Phone view**: https://first-leaf.vercel.app/?view=phone · **Code:** `src/layouts/` (the phone shell and navigation) and the phone-specific parts of each feature · **Commits:** prefixed `[P303]`

## Summary

P303 is **First Leaf on Rosa's phone**: the same app, with the same account and the same words, designed for a different moment. Rosa opens it between other things and, in about 60 seconds and with one hand, learns:

1. **Does anything need me?**
2. **Why did my balance move this week?**
3. **One new word**, if she has another 10 seconds.

Under 600px wide, Home becomes a **check-in**: her balance, up or down this week, a small balance-over-time chart, a "needs you" card, why it moved, her last 3 transactions and the word of the day. Everything else (alerts, activity, funds, the story, Practice, Words) is one tap away, through the bottom tab bar or a card on Home.

**Why it's designed for the phone, not squeezed onto it.** The learner instructions say mobile design is *"not just about making things smaller."* The laptop Home (P301) asks Rosa to scan a dashboard for ten calm minutes; the phone Home answers three questions in sixty seconds. So the phone gets different decisions, not smaller boxes:
- **Answers, not widgets.** Three answers at the top. The laptop's mix ring and goal card move one tap away.
- **Thumbs, not a mouse.** Navigation sits in a bottom tab bar in the thumb zone, and every standalone control is at least 48 × 48px.
- **Interruption-proof.** Every screen makes sense on its own. Alert details are full pages with their words listed as chips, so nothing depends on a hover or a small inline tap.

*Rejected:* shrinking the laptop dashboard to phone size. A dashboard asks you to scan; a check-in answers.
*Rejected:* a separate phone site behind a landing page. It read as a second product. Rosa has one app.
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

Reads only from `src/shared/data/` through `useScenario`. This week's change (the "why did it move" answer) is checked by rule A10: start + deposits + dividends + market change = end, and the per-fund pieces add up to the market change **to the cent**.

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
  "meta.wordOfTheDay": "expense-ratio",
  "activity.rosa-starter.34.type": "dividend",
  "activity.rosa-starter.33.status": "returned",
  "activity.rosa-starter.32.type": "dividend"
}
```

**Last 3 transactions:** the newest three items in the account's activity (for Rosa: the Sept. 15 dividend, the returned Sept. 1 deposit, the Aug. 17 dividend). A returned deposit shows its status in words, not only in color.

**Word of the day:** set in the data (`meta.wordOfTheDay`, "Yearly fee" on Sept. 20). **Next word** follows the glossary order, so it's predictable and testable.

**An alert's detail stays a phone page.** It shows what it needs inline and ends with **"Words on this screen"** chips:

| Alert | What the phone detail shows |
|---|---|
| Deposit sent back | The deposit's dates and status, and **Try again** (review → confirm → "Your deposit is on its way.") |
| Goal behind plan | Planned vs. put in, and **Add a one-time deposit** (the same flow, amount filled in) |
| Waiting in cash | Auto-invest status (paused since July 14) with an On/Off switch and a confirmation |
| Fee going up | The fund's name, old and new fee (0.30 percentage points), and the dollar difference |
| Dividend paid | Amount, fund and date |

## Layout (designed at 390 × 844, works from 320px)

```
┌──────────────────────────────┐
│ First Leaf                   │  opaque top bar
│                              │
│ $1,313.72                    │  serif, big
│ Up $15.57 this week          │
│ ╭─╮_╭╮__╱‾  small balance    │  chart since March
│                              │
│ ┌──────── PANEL ───────────┐ │
│ │ ● 1 thing needs you       │ │  tap → the alert's page
│ │ Your $150 deposit from    │ │
│ │ Sept. 1 was sent back   › │ │
│ │ + 3 heads-ups           › │ │  tap → Alerts
│ └───────────────────────────┘ │
│ ┌ Why it moved this week ──┐ │
│ │ market up $15.07         │ │  tap → opens in place:
│ │ dividend $0.50         › │ │  waterfall, per fund, word chips
│ └───────────────────────────┘ │
│ ┌ Latest ──────────────────┐ │
│ │ Sept. 15  FL-BOND paid you│ │
│ │ Sept. 1   Deposit returned│ │
│ │ Aug. 17   FL-BOND paid you│ │
│ └───────────────────────────┘ │
│ ┌ Word of the day ─────────┐ │
│ │ Yearly fee             › │ │
│ └───────────────────────────┘ │
│ Risk disclosure (footer)      │
├──────────────────────────────┤
│ Home Activity Story Practice Words │  opaque tab bar, 48px targets
└──────────────────────────────┘
```

- **Most important thing highest, most-used controls lowest.** Answers sit at the top; navigation sits at the bottom, within reach of the thumb.
- **Bottom tab bar:** Home, Activity, Story, Practice, Words, each with an icon and a word. **Funds and Alerts are reached from Home** (the "needs you" card, and each holding in the check-in).
- **Touch targets (amended Sept. 24, 2026).** Every standalone control (buttons, tabs, list rows, chips, the keypad, close buttons) is at least **48 × 48px**, with 8px between targets. A term explanation inside a sentence uses WCAG 2.5.8's inline exception ("the target is in a sentence or its size is otherwise constrained by the line-height of non-target text"). So that no one has to hit a small inline word, every P303 detail screen also lists its terms as 48px chips under **"Words on this screen"**. P303 body text has a line-height of at least 1.6.
- **The top and bottom bars are opaque**, so text scrolling behind them can never ruin contrast.
- **Why it moved** opens in place on Home (a disclosure), not on a separate page: the waterfall, the per-fund breakdown and its "Words on this screen" chips. This keeps the 60-second job on one screen.
- **At 600px and wider** the app switches to the tablet and laptop layouts (P301's Home). P303 is judged under 600px.

## Phone view (for reviewing on a laptop)

A P303 reviewer may never open the site on a real phone, so the app offers a one-click way to see the real phone design on a laptop.

- **Where:** at 600px and wider, the top bar has a phone-icon toggle button labeled **"Phone view"** (`aria-pressed` on or off). It's hidden under 600px.
- **On:** the page shows the real app inside a generic rounded phone frame (a 390 × 844 CSS px screen area, a thin dark bezel, rounded corners), centered on cream, with a **"Back to full view"** button beside it. The only note beside the frame is "Practice here is kept apart from the full view.", shown only while Practice is open; nothing on screen explains the project.
- **It is not a mock-up.** The frame is an iframe of the same app, so the real phone breakpoints, bottom tabs and touch targets apply. It opens on the current route and demo scenario, and it follows route changes in the full view.
- **Shareable:** `?view=phone` opens it directly (the reviewer link is https://first-leaf.vercel.app/?view=phone).
- **The frame never imitates a real device brand:** no notch, no camera cutout, no brand shapes.
- **Between 600 and 1023px** the frame scales down to fit the viewport height (a CSS transform on the frame); the 390px layout inside stays the same.
- **Accessibility:** the toggle is a real button with a visible label or tooltip. The iframe is titled "First Leaf on a phone". Focus moves into the frame on open and back to the toggle on close. Esc closes it. Any open or close animation respects reduced motion.
- **Known limitation:** the full view and the phone view are separate app instances, so Practice state isn't shared between them. The demo scenario is carried over through the URL.

## Interactions (the core flows a reviewer can test)

| # | Flow | Steps | Done when |
|---|---|---|---|
| F1 | **Glance** | Open `/` on a phone (or Phone view) | Balance, this week's change and the "needs you" card are visible without scrolling at 390 × 844 |
| F2 | **See what needs me** | Tap the "needs you" card → the alert's page (what happened, what it means, what you can do, "Words on this screen") → back → Alerts list | Back returns to where she was; opened alerts show as "Seen" for the session |
| F3 | **Understand why it moved** | Tap "Why it moved" → the waterfall from last Friday's balance to this Friday's: market change, dividends, deposits → tap a fund for its share of the move | The pieces add up exactly (A10), each piece has a term explanation, and its words are listed as 48px chips under "Words on this screen" |
| F4 | **Learn a word** | Tap Word of the day → its page → **Next word** or a related word | Works one-handed; Back works |
| F5 | **Move around one-handed** | Use the bottom tab bar: Activity, Story, Practice, Words, Home | Every tab is at least 48 × 48px, shows where you are, and keeps its place |
| F6 | **Check every scenario** | Open `/?scenario=all-clear&view=phone`, then `/?scenario=brand-new&view=phone` (by URL only) | Home shows that scenario's account, and every sentence stays true |
| F7 | **Review on a laptop** | Click the phone icon in the top bar, or open `/?view=phone` | The real phone Home and bottom tab bar show inside the frame, on the same route and scenario |

**Term explanations on a phone** open as a bottom sheet (easier to reach and read than a floating bubble), with the same content and accessibility as everywhere else. **Related-word links in the sheet are standalone controls, so under 600px each is at least 48 × 48px** (ruling, Sept. 24).

## Edge cases and empty states (go-further)

| Case | What Rosa sees |
|---|---|
| **Nothing needs you** (calm account) | "Nothing needs you today." A small mid-century sun. The FYI dividend shows under "Just so you know." The card keeps its size. |
| **Brand-new account** | "Welcome, Rosa." What happens after the first deposit, in three short steps. No $0.00 charts, and no empty "Latest" list. |
| **Funds that went down** | In "Why it moved," FL-WORLD and FL-BOND show "−$5.88" and "−$0.85" in terracotta, with "down" in the accessible label, next to an explanation that ups and downs are normal. In sentences: "down $5.88". Never red alone. |
| **Interrupted mid-flow** | Practice keeps the half-entered order in memory for the session |
| **Large text (200%) / small phone (320px) / landscape** | Cards grow taller, never wider; nothing gets cut off; the tab bar stays usable |

## Nice to haves

- Swipe between alerts on an alert's page.
- An add-to-home-screen icon and theme color (web app manifest).

## Definition of Done

| # | Done when… | LI |
|---|---|---|
| 1 | `/` loads on the live site on a real phone and in Phone view (`/?view=phone`); the old `/p303` address redirects to `/` | 1 |
| 2 | Flows F1–F7 work end to end at 390px, each with a passing Playwright test | 2 |
| 3 | Under 600px, Home does *one* job, the check-in, for Rosa in a financial-services context, as this brief describes | 3, 6 |
| 4 | Nothing-needs-you, brand-new, down-moving funds and interruptions are handled | 7 |
| 5 | Works at 320px and 390px; at 600px and up the app switches cleanly to the tablet and laptop layouts | 8 |
| 6 | Repo root has README (with a P303 reviewer block) and LICENSE; AI scaffolding in `.claude/`, `CLAUDE.md`, `STATUS.md`, `docs/`; P303 code lives in `src/layouts/` and the phone parts of each feature | 9, 10, 11 |
| 7 | `[P303]` commits show the work arriving phase by phase; STATUS.md has dated entries from several sessions | 12, 13, 18 |
| 8 | This brief matches what was built (read-through in Phase 5, plus rule B1) | 19, 22 |
| 9 | Thumb-zone navigation, 48px targets and glanceable type feel designed *for a phone*, not squeezed onto one | 20, 23, 26 |
| 10 | Someone who has never invested can answer "does anything need me?" within 5 seconds | 21, 24 |
| 11 | The calls in this brief are visible: three answers on the first screen, nothing that needs scanning, and alert pages that stand on their own | 27 |
