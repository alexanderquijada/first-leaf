# P303 · Mobile experience: the 60-second check-in

> **Lens brief, re-planned Sept. 24, 2026** (first written Sept. 23 as a separate phone site; updated Sept. 28 for Alex's review round, Phase 6). First Leaf is one app; this case study is one lens on it. Shared foundation: [BRIEF.md](../../BRIEF.md) §1–3 (product, person, how the lenses fit together) and §6 (style). Rosa and her account are invented; the stock and crypto names are real (ruling B, Phase 2.5; see BRIEF.md §4).
>
> **Live:** the whole app under 600px wide, starting at `/`. Open it on a phone, narrow your browser to 390px, or on a laptop use **Phone view**: https://first-leaf.vercel.app/p303 · **Code:** `src/layouts/` (the phone shell and navigation) and the phone-specific parts of each feature · **Commits:** prefixed `[P303]`

## Summary

P303 is **First Leaf on Rosa's phone**: the same app, with the same account and the same words, designed for a different moment. Rosa opens it between other things and, in about 60 seconds and with one hand, learns:

1. **How is my money doing?** (the dark balance card)
2. **Does anything need me?** (the needs-you card, right under it)
3. **Why did my balance move this week?**
4. **One new finance term**, if she has another 10 seconds.

Under 600px wide, Home becomes a **check-in**: the dark balance card on top (with Balance inside it), the "needs you" card underneath, then why it moved, a small balance-over-time chart, her last 3 transactions and the Term of the Day. Everything else (alerts, activity, investments, Your Journey, Practice, Finance Terms) is one tap away, through the bottom tab bar or a card on Home.

**Why it's designed for the phone, not squeezed onto it.** The learner instructions say mobile design is *"not just about making things smaller."* The laptop Home (P301) asks Rosa to scan a dashboard for ten calm minutes; the phone Home answers three questions in sixty seconds. So the phone gets different decisions, not smaller boxes:
- **Answers, not widgets.** The answers sit at the top: her balance card, then what needs her. The laptop's mix ring and goal card move one tap away.
- **Thumbs, not a mouse.** Navigation sits in a bottom tab bar in the thumb zone, and every standalone control is at least 48 × 48px.
- **Interruption-proof.** Every screen makes sense on its own. Alert details are full pages with their finance terms listed as chips, so nothing depends on a hover or a small inline tap.

*Rejected:* shrinking the laptop dashboard to phone size. A dashboard asks you to scan; a check-in answers.
*Rejected:* a separate phone site with its own front door. It read as a second product. Rosa has one app.
*Replaced Sept. 28:* the balance as a block of big text above the card, and "needs you" above everything else. Alex's review put Balance inside the dark card, on top, with the needs-you card right under it; both are still visible without scrolling at 390 × 844, so the "does anything need me?" answer stays on the first screen.
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
  "account.weeklyChange.startBalance": 1538.12,
  "account.weeklyChange.deposits": 0,
  "account.weeklyChange.dividends": 0,
  "account.weeklyChange.marketChange": -1.44,
  "account.weeklyChange.totalChange": -1.44,
  "account.weeklyChange.endBalance": 1536.68,
  "attention.rosa-starter.0.title": "Name a beneficiary for your account",
  "attention.rosa-starter.0.terms": ["beneficiary", "brokerage-account"],
  "meta.wordOfTheDay": "invested",
  "activity.rosa-starter.63.type": "dividend",
  "activity.rosa-starter.63.ticker": "MSFT",
  "activity.rosa-starter.62.type": "buy",
  "activity.rosa-starter.61.type": "buy"
}
```

**The dark balance card** holds, in this order: the "Balance" label, the big number ($1,536.68), "Up $136.68 on the $1,400 you put in.", "This week: down $1.44.", then the rows Invested (with the Invested term), Cash, You put in and Auto-invest. It is the same card as on the laptop, and it replaces the balance block that used to sit outside it.

**Last 3 transactions:** the newest three items in the account's activity (for Rosa: the Sept. 10 Microsoft dividend and the Sept. 1 auto-invest buys of Ethereum and Bitcoin). Every item is completed.

**Term of the Day** (was "Word of the day"): set in the data (`meta.wordOfTheDay`), drawn only from Finance Terms entries: **"Invested"** on Sept. 20, the term on the dark card. **Next term** moves to the next entry in Finance Terms order, so it's predictable and testable.

**An alert's detail stays a phone page.** It shows what it needs inline and ends with **"Finance terms on this screen"** chips:

| Alert | What the phone detail shows |
|---|---|
| Name a beneficiary for your account | What a beneficiary is and why brokerages ask, then **Add a beneficiary** (a short settings sheet: Name and Relationship; saving marks it handled, with Undo) and **Remind me later** (moves it to Handled for this visit, with Undo). Chips: Beneficiary, Brokerage account |
| A big move (only if the data has one) | The investment, last Friday's and this Friday's price, the percent move, and what it did to Rosa's holding in dollars |
| SIPC protection and crypto | The general fact only: "SIPC protection covers stocks and cash at a member brokerage if the brokerage fails. It doesn't cover crypto, such as Bitcoin or Ethereum. It never covers a drop in price." Never implies First Leaf is a member (BRIEF.md §8). Chips: SIPC protection, Cryptocurrency |
| Dividend paid (only if one was paid in the last 7 days) | Amount, company and date |

The sent-back deposit, goal-behind-plan and cash-waiting alerts, and their flows, are removed (Sept. 28; see BRIEF.md §4).

## Layout (designed at 390 × 844, works from 320px)

```
┌──────────────────────────────┐
│ [logo] First Leaf            │  opaque top bar
│                              │
│ ┌──────── PANEL ───────────┐ │
│ │ Balance                   │ │
│ │ $1,536.68                 │ │  serif, big
│ │ Up $136.68 on the $1,400  │ │
│ │ you put in.               │ │
│ │ This week: down $1.44.    │ │
│ │ Invested         $1,534.20│ │
│ │ Cash                 $2.48│ │
│ │ You put in       $1,400.00│ │
│ │ Auto-invest             On│ │
│ └───────────────────────────┘ │
│ ┌ Needs your attention ─────┐ │
│ │ ● 1 thing needs you       │ │  tap → the alert's page
│ │ Name a beneficiary for    │ │
│ │ your account            › │ │
│ └───────────────────────────┘ │
│ ┌ Why it moved this week ──┐ │
│ │ The market: down $1.44.  │ │  tap → opens in place: waterfall,
│ └───────────────────────────┘ │  per fund, term chips, Investments
│ ┌ Balance since March ─────┐ │
│ │ ╭─╮_╭╮__╱‾  small chart  │ │
│ └───────────────────────────┘ │
│ ┌ Latest ──────────────────┐ │
│ │ the 3 newest activity rows│ │
│ │ (date, what, amount)      │ │
│ └───────────────────────────┘ │
│ ┌ Term of the Day ─────────┐ │
│ │ Invested                 │ │  Read more (a sheet) · Next term
│ └───────────────────────────┘ │
├──────────────────────────────┤
│ Home Activity Journey Practice Terms │  opaque tab bar, 48px targets
└──────────────────────────────┘
```

- **The dark balance card comes first, the needs-you card right under it** (Sept. 28). At 390 × 844 both are visible without scrolling. Reading and keyboard order match what you see.
- **Most important thing highest, most-used controls lowest.** Answers sit at the top; navigation sits at the bottom, within reach of the thumb.
- **Bottom tab bar:** Home, Activity, Journey, Practice, Terms, each with an icon and a word. "Terms" is short for Finance Terms, which doesn't fit one line in a 64px tab at 320px; the page title stays "Finance Terms". **Investments and Alerts are reached from Home** (the "needs you" card, and "See your investments" inside Why it moved).
- **Touch targets (amended Sept. 24, 2026).** Every standalone control (buttons, tabs, list rows, chips, the keypad, close buttons) is at least **48 × 48px**, with 8px between targets. A term explanation inside a sentence uses WCAG 2.5.8's inline exception ("the target is in a sentence or its size is otherwise constrained by the line-height of non-target text"). So that no one has to hit a small inline word, every P303 detail screen also lists its finance terms as 48px chips under **"Finance terms on this screen"**. P303 body text has a line-height of at least 1.6.
- **The top bar carries the First Leaf logo** (the one fixed lockup; BRIEF.md §6).
- **The top and bottom bars are opaque**, so text scrolling behind them can never ruin contrast.
- **Why it moved** opens in place on Home (a disclosure), not on a separate page: the waterfall, the per-fund breakdown and its "Finance terms on this screen" chips. This keeps the 60-second job on one screen.
- **At 600px and wider** the app switches to the tablet and laptop layouts (P301's Home). P303 is judged under 600px.

## Phone view: only the phone (for reviewing on a laptop)

A P303 reviewer may never open the site on a real phone, so the app offers a one-click way to see the real phone design on a laptop. **Ruling (Sept. 24, built in Phase 4): phone view shows ONLY the phone.**

- **Where it lives:** `/p303` and every `/p303/…` address (for example `/p303/story`). The "Phone view" button in the laptop top bar opens the same page there. Old `?view=phone` links redirect to it.
- **600px and wider:** no sidebar, no top bar, no laptop layout at all. `/p303` has its own layout, not the laptop one with pieces hidden. It shows:
  - a plain full-window cream background;
  - the phone frame, centered horizontally and vertically. **Text never renders below 14px** (ruling, Sept. 25): a short window first makes the phone **shorter**, keeping its full 390px width (the screen can drop to 667px tall, the iPhone SE screen); only after that is the whole phone scaled down, and never so far that 16px body text drops below 14px. From a 719px-tall window up, the phone is at full size and no text is below 14px; in a shorter window, the smallest labels (14px) can render at about 12px. **The page never scrolls** (only the content inside the phone scrolls; checked at 1280×800, 1440×900, 1280×720 and 768×1024). The frame edge is measured at 3:1 or better against the background.
- **Outside the phone, top left, only:** **"Back to full view"**, which returns to the laptop page the visitor came from, or to the laptop Home if they arrived at `/p303` directly. Scenarios are chosen by URL only, so there is no account switcher to bring along. No other text or controls.
- **Under 600px (a real phone):** no frame. `/p303/…` opens the same screens full size.
- **It is not a mock-up.** The phone screen is an iframe of the same app, 390px wide and 667 to 844px tall, so the real phone breakpoints, bottom tabs and touch targets apply. It opens on the matching page and the current scenario.
- **Accessibility:** the frame is decorative and hidden from screen readers. The phone screen keeps its own landmarks, headings and page title (the window title follows it). Focus starts inside the phone; the keyboard order is the outside control, then the phone. It never imitates a real device brand: no notch, no camera cutout.
- **Known limitation:** the full view and the phone view are separate app instances, so Practice state isn't shared between them. The scenario carries over in the URL.

## Interactions (the core flows a reviewer can test)

| # | Flow | Steps | Done when |
|---|---|---|---|
| F1 | **Glance** | Open `/` on a phone (or Phone view) | The dark balance card (Balance, up or down, this week) and the "needs you" card under it are visible without scrolling at 390 × 844 |
| F2 | **See what needs me** | Tap the "needs you" card → "Name a beneficiary for your account" (what happened, what you can do, "Finance terms on this screen") → back to Home → Alerts list | Back returns to where she was; opened alerts show as "Seen" for the session |
| F3 | **Understand why it moved** | Tap "Why it moved" → the waterfall from last Friday's balance to this Friday's: market change, dividends, deposits (a piece that is $0.00 is left out; ruling, Sept. 25) → tap an investment for its piece of the move, in dollars and against the market's total | The pieces add up exactly (A10), and the finance terms the breakdown shows (only those) are listed as 48px chips under "Finance terms on this screen" |
| F4 | **Learn a finance term** | On Home's Term of the Day, tap **Read more** (its explanation opens in a bottom sheet, with related terms and its source), or **Next term** for another term | Works one-handed; the sheet closes with its close button or Esc |
| F5 | **Move around one-handed** | Use the bottom tab bar: Activity, Journey, Practice, Terms, Home | Every tab is at least 48 × 48px, shows where you are (a bar, bold and color), and the bar keeps its place at the bottom while the page scrolls |
| F6 | **Check every scenario** | Open `/p303?scenario=all-clear`, then `/p303?scenario=brand-new` (by URL only) | Home shows that scenario's account, and every sentence stays true |
| F7 | **Review on a laptop** | Click **Phone view** in the top bar, or open `/p303` | Only the phone shows: no sidebar or top bar, the frame centered and never scrolling the page, "Back to full view" returns to where you were |
| F8 | **Check activity one-handed** | Activity tab → a compact list (date, what, amount) → **Filters** opens a bottom sheet (type: All / Deposits / Buys / Dividends, 48px) → tap a row | The row opens as a full page with its finance terms as chips; every row is Completed, so there is no status filter; the brand-new account shows a friendly empty state |
| F9 | **Look at an investment** | Home or Activity → Investments → a card (ticker badge, name, value, up or down) → the investment page | The page leads with value and up or down, then a small price chart (Since you bought / 6 months / 1 year) with its data note, then "Volatility: X of 5", dividends if any, and the SIPC notice on crypto pages |
| F10 | **Practice with a keypad** | Practice tab → pick an investment → amount on a large number keypad → review in a bottom sheet → confirm | Errors show above the keypad and Confirm stays disabled; the "Practice money. Nothing here touches your account." banner is always visible |
| F11 | **Read Your Journey and Finance Terms on a phone** | Journey tab → the section tabs as a 2×2 grid, or **Sections** opens a bottom sheet → a section; sliders are at least 48px tall · Terms tab → search at the top → 48px result rows | No sideways scroll at 320px; charts sit inline; every control is at least 48 × 48px |

**Term explanations on a phone** open as a bottom sheet (easier to reach and read than a floating bubble), with the same content and accessibility as everywhere else. **Related-term links in the sheet are standalone controls, so under 600px each is at least 48 × 48px** (ruling, Sept. 24).

## Edge cases and empty states (go-further)

| Case | What Rosa sees |
|---|---|
| **Nothing needs you** (calm account, with a beneficiary named; or after Rosa saves one or taps Remind me later) | "Nothing needs you right now." A small mid-century sun. Any FYI (the SIPC notice, a dividend) shows under "Good to know," without a badge (the heading already says it). The card keeps its size. |
| **Brand-new account** | "Welcome, Rosa." What happens after the first deposit, in three short steps. No $0.00 charts, and no empty "Latest" list. |
| **Investments that went down** | In "Why it moved," any holding that fell this week shows "−$X" in terracotta, with "down" in the accessible label, next to a note that prices going up and down is normal. In sentences: "down $X". Never red alone. |
| **Interrupted mid-flow** | Practice keeps the half-entered order in memory for the session |
| **Short laptop window (1280×720)** | In phone view, the phone gets shorter (down to a 667px screen) before it is scaled; at 1280×720 it fits at full size, so no text drops below its designed size. The page never scrolls, only the phone's content does |
| **Large text (200%) / small phone (320px) / landscape** | Cards grow taller, never wider; nothing gets cut off; rows wrap their amounts under the words; a word too long for the screen breaks. The tab bar stays usable: its labels grow only as far as five tabs fit (about 4vw), as phone tab bars do. |

## Nice to haves

- Swipe between alerts on an alert's page.
- An add-to-home-screen icon and theme color (web app manifest).

## Definition of Done

| # | Done when… | LI |
|---|---|---|
| 1 | `/` loads on the live site on a real phone, and `/p303` shows only the phone on a laptop | 1 |
| 2 | Flows F1–F7 work end to end at 390px, each with a passing Playwright test | 2 |
| 3 | Under 600px, Home does *one* job, the check-in, for Rosa in a financial-services context, as this brief describes | 3, 6 |
| 4 | Nothing-needs-you, brand-new, down-moving funds and interruptions are handled | 7 |
| 5 | Works at 320px and 390px; at 600px and up the app switches cleanly to the tablet and laptop layouts | 8 |
| 6 | Repo root has README (with a P303 reviewer block) and LICENSE; AI scaffolding in `.claude/`, `CLAUDE.md`, `STATUS.md`, `docs/`; P303 code lives in `src/layouts/` and the phone parts of each feature | 9, 10, 11 |
| 7 | `[P303]` commits show the work arriving phase by phase; STATUS.md has dated entries from several sessions | 12, 13, 18 |
| 8 | This brief matches what was built (read-through in Phase 5, plus rule B1) | 19, 22 |
| 9 | Thumb-zone navigation, 48px targets and glanceable type feel designed *for a phone*, not squeezed onto one | 20, 23, 26 |
| 10 | Someone who has never invested can answer "does anything need me?" within 5 seconds | 21, 24 |
| 11 | The calls in this brief are visible: the balance card first with the needs-you card right under it on the first screen, nothing that needs scanning, and alert pages that stand on their own | 27 |
