# P302 · Interactive data story: Your Journey

> **Lens brief, re-planned Sept. 24, 2026** (first written Sept. 23 as a stand-alone Nia and Theo story; reshaped Sept. 28 for Alex's review round, Phase 6, from "Your money story" in six chapters to "Your Journey" in four sections). First Leaf is one app; this case study is one lens on it. Shared foundation: [BRIEF.md](../../BRIEF.md) §1–3 (product, person, how the lenses fit together) and §6 (style). Rosa, Nia and Theo are invented; the stock and crypto names and crypto prices are real, and stock prices are modeled between real closes (ruling B, Phase 2.5). Nothing here is a prediction.
>
> **Live:** `/story` (any screen size; one section at a time, chosen with visual tabs), plus `/practice` and `/learn` (Finance Terms) · **Code:** `src/features/story/`, `src/features/practice/`, `src/features/learn/` · **Commits:** prefixed `[P302]`

## Summary

**Your Journey** tells Rosa the story of her own first six months in First Leaf, using her (invented) account, and argues one point of view. The story states it on screen, in these words:

> *"Right now, almost all of your balance is money you put in. Growth needs years, so starting early and staying steady matter more than picking the perfect moment."*

(Second person, like the sections that follow: the story speaks to Rosa. Ruling, Sept. 24.)

It earns that point of view in **four short sections**, shown one at a time. **Six months in** reads her own balance since March and shows that almost all of it is money she put in. **The dip in June** shows the two weeks when prices fell, and that auto-invest kept buying through them. **Start early** shows why years matter, with two friends, Nia and Theo (invented for the lesson): Nia starts at 22 with $100 a month, Theo waits until 32 and puts in $150, and Nia still ends with more. **Try it** invites her to try a mix with practice money in Practice.

**Why this story.** A dip is the moment a beginner is most likely to feel like stopping. Rosa's own chart shows what happened when she didn't: auto-invest kept buying, and within ten days of the low her balance was back above what she had put in. It also shows that six months is far too short for growth to show up (most of her balance is still her own deposits; rule R1 checks the exact share), and the Nia and Theo lesson shows what the years do. A story about *her* money is more persuasive to her than a story about strangers, and it keeps First Leaf one product instead of an app with an essay attached.

**Practice and the learning moments count toward P302.** Practice (investing with practice money), the term explanations and the Finance Terms pages are how the story turns into something Rosa can try and understand, so they are part of this lens.

*Replaced Sept. 28 (Alex's review round):* the six-chapter scroll story with a pinned chart, whose chapter 5 alone had seven steps (a guess, the answer, why, every year counts, catch-up, smooth vs. bumpy, and "your turn"), plus a closing. *What we got wrong:* it ran too long, and a reader on the couch lost the point before the end. The guess, the smooth and bumpy switch, the "your turn" step, the closing, the mix chapter and the pause are removed; "chapters" are now "sections", and the word "chapter" never appears on the site (G6).
*Rejected:* the stand-alone "Start early beats start big" story about two strangers. It was sound, but it sat outside the app and never touched Rosa's own money. It lives on as section 3.
*Rejected:* "Fees quietly eat your growth." Strong, but it leans on percentages beginners struggle to feel, and stocks and crypto carry no yearly fund fee.
*Rejected:* "Staying invested beats jumping out" told with market forecasts. Nobody can forecast prices honestly. We show what happened to Rosa's own account and stop there.

## The audience

Rosa, 26, and people like her: in their 20s, a few months into investing or about to start. They read on the couch in the evening, on a phone or a laptop, with 5 minutes. They don't know the word *compounding*. The story teaches the idea and names it in section 3, with its Finance Terms entry.

## Data

All numbers come from `src/shared/data/` and are re-computed by the validator. **Every claim the story makes is a checked rule**: rules T1–T4 for Nia and Theo, and rules R1–R4 for Rosa's own data (defined in BRIEF.md §4).

**Rosa's own data** (the main demo account):

```json brief-example
{
  "account.openedOn": "2026-03-02",
  "account.balance": 1358.5,
  "account.moneyIn": 1250,
  "account.gainLoss": 108.5,
  "account.autoInvest.pausedOn": "2026-06-08",
  "account.cashSince": "2026-07-01",
  "account.history.57.date": "2026-05-21",
  "account.history.57.balance": 846.01,
  "account.history.67.date": "2026-06-05",
  "account.history.67.balance": 915.77,
  "account.history.67.moneyIn": 950,
  "story-p302.rosaStory.rosa-starter.facts.dip.fall": 80.24,
  "story-p302.rosaStory.rosa-starter.facts.dip.month": "June"
}
```

**Every claim about Rosa is a checked rule:**

| Claim on screen | Checked as |
|---|---|
| About 91% of her balance is money she put in; the other $136.68 is what it earned | Deposits vs. what it earned, from the account (R1; "almost all" only at 90% or more) |
| From May 21 to June 5, falling prices took $80.24 off her balance, a drop of 9.5% | **The dip rule (ruling B, Phase 2.5):** the dip is the **largest 10-trading-day fall in Rosa's portfolio value between April 15 and Aug. 15, 2026**, measured as the market change in her balance with deposits taken out. The section title names the month of the low ("The dip in June"). The data uses the first seed after 1 where this dip is an 8% to 15% fall (seed 10: 9.5%, May 21 to June 5; ruling, Sept. 25). R2 recomputes the window, the fall and the month from the balance history. Each account gets its own dip from its own history. On the chart, the dip's event markers sit visibly apart, even at 390px. |
| Auto-invest kept buying through the dip: her June 1, July 1, Aug. 3 and Sept. 1 deposits each bought her mix the day they arrived | Auto-invest ran every month with no pause (A14), and every deposit named was invested the day it arrived (R3) |

The story says what happened and stops there. It describes the dip and what auto-invest did; it never suggests what anyone should do about a dip (BRIEF.md §8).

**Nia and Theo** (section 3). All numbers come from `story-p302.json`, computed by the generator and re-computed by the validator (rules T1–T4). **Assumption (shown on screen):** an example rate of **6% a year**, added monthly, with money put in at the end of each month, until age 65. The note always says: *"An example rate of 6% a year. Real markets go up and down, and nobody can promise a rate."* On screen Nia and Theo are "two friends"; the data still marks them fictional.

```json brief-example
{
  "story-p302.savers.0.name": "Nia",
  "story-p302.savers.0.startAge": 22,
  "story-p302.savers.0.monthly": 100,
  "story-p302.savers.0.final.putIn": 51600,
  "story-p302.savers.0.final.value": 242251.43,
  "story-p302.savers.1.name": "Theo",
  "story-p302.savers.1.startAge": 32,
  "story-p302.savers.1.monthly": 150,
  "story-p302.savers.1.final.putIn": 59400,
  "story-p302.savers.1.final.value": 186212.95,
  "story-p302.catchUp.monthlyNeeded": 196,
  "story-p302.bumpy.nia.43.value": 216910.23,
  "story-p302.bumpy.theo.33.value": 181229.75,
  "story-p302.yourTurn.startAge": 26,
  "story-p302.yourTurn.monthly": 150
}
```

| Claim on screen | Checked as |
|---|---|
| Nia ends with more money than Theo | $242,251 > $186,213 (T2) |
| Nia puts in less money than Theo | $51,600 < $59,400 (T2) |
| Theo passes Nia at $196 a month when he starts at 32 | $196 is the smallest whole amount that matches Nia ($195 is not enough), and Theo's slider can land on it (T2) |

The data still holds the bumpy years and the "your turn" numbers, and rules T2 and T3 still check them, but they no longer appear on screen (simplified Sept. 28).

**Every scenario gets a true story (R4).** The story reads the current scenario's account through `useScenario`. Rosa's facts and the sentences that state them are generated per account into `story-p302.json` (`rosaStory`), and R1–R4 recompute every number from the price and balance history, so the screen only ever shows checked sentences.
- *Nothing needs you:* the same six months as the default account (only the beneficiary differs), so sections 1 and 2 read the same, with that account's own checked numbers.
- *Brand-new account:* there is no history yet, so sections 1 and 2 say her story starts with her first deposit, and the point of view is stated without the "right now" half. Sections 3 and 4 work unchanged.

## Narrative and layout

**Decision: four short sections, one shown at a time, chosen with visual tabs** (Alex's review round, Sept. 28). Each section has **one chart or interaction**, **at most 60 words of body text**, and ends with a **"Next: *name*"** button that moves to the next section; the last ends with **"Go to Practice"**.

- **The tabs** sit across the page under the title, left-aligned. Each tab has its number, its name and a small original mid-century drawing drawn in code. The current tab is filled lime with ink text. They follow the WAI-ARIA tabs pattern: the arrow keys move between tabs, Enter or Space selects one, and the selection is announced.
- **On a phone** the same tabs form a 2×2 grid (no sideways scroll at 320px; each tab at least 48px tall), plus a **"Sections"** button that opens the bottom-sheet picker for jumping once the grid has scrolled away.
- **Deep links:** `#section-1` … `#section-4` open that section. Old links still work: `#chapter-1`, `#chapter-2` and `#chapter-4` open section 1; `#chapter-3` opens section 2; `#chapter-5` opens section 3; `#chapter-6` opens section 4.
- The story never depends on scroll animation.

| # | Section | What it says (at most 60 words) | Chart or interaction |
|---|---|---|---|
| 1 | Six months in | The point of view ("Right now, almost all of your balance is money you put in. Growth needs years, so starting early and staying steady matter more than picking the perfect moment."), then "About 91% of your balance is money you put in. The other $136.68 is what it earned." and "What it earned is its rate of return." (with the Rate of return term) | **Balance over time** since March 2, with the "put in" and grainy "earned" layers (**toggle: what you put in vs. what it earned**) and a **time range: 1 month / 3 months / Since March** |
| 2 | The dip in June | "From May 21 to June 5, falling prices took $80.24 off your balance. That is a drop of 9.5%." then "Auto-invest kept buying through the dip. Your June 1, July 1, Aug. 3 and Sept. 1 deposits each bought your mix the day they arrived." and "Buying the same amount every month is called dollar-cost averaging." (with the Dollar-cost averaging term). It describes only; it never suggests what anyone should do | **The dip chart:** the balance line with the dip marked, and a **toggle to show or hide the events** (the start of the fall, the low, and the deposits auto-invest bought with) |
| 3 | Start early | Nia (22, $100 a month) and Theo (32, $150 a month); "Nia puts in less, but her money has ten more years of compounding." (with the Compounding term); the result sentence (who has more at 65, and that Theo passes Nia at $196 a month when he starts at 32); the rate note | **One chart of both** savers from their start to 65, with **sliders for Theo's start age (18–45, step 1) and monthly amount ($150–$300, step $1)**; a marker shows where Theo passes Nia |
| 4 | Try it | Practice lets you try a mix with practice money, and the time machine shows how that mix would have moved over the last 12 months. Nothing you do there touches your account | **"Go to Practice"** |

**Practice** (`/practice`): pick one of the 10 investments → amount → review → confirm → see what you own in Practice and your practice mix → **sell** part of it → **Time machine**: how this mix would have moved over the last 12 months → **Start over**. A persistent banner, "Practice money. Nothing here touches your account."; the real account never changes. Inside Practice only, the buttons may say **Buy** and **Sell**. Crypto holdings show **"Amount"** with the coin's unit ("0.00247299 BTC"), never "Shares".

**Finance Terms** (`/learn`, `/learn/:termId`; was "Words"): the 15 real finance terms, each with its cited source. Search every entry, open one as its own page, follow related terms.

## Interaction rules

- **Section tabs** are WAI-ARIA tabs: arrow keys move, Enter or Space selects, and the selection is announced. The **Next** button at the end of each section selects the next tab.
- **Sliders** are real range inputs. The arrow keys move them, and values are shown and announced in words. Every result comes from the same formula the validator checks.
- **Toggles** are real buttons with a pressed state, and each has a sentence that says what the chart now shows. A chart's title follows its time range ("Your balance in the last month").
- **Show as table** sits under every chart.
- **Motion respects reduced motion:** with `prefers-reduced-motion`, charts appear in their final state and nothing required is animated.

## Interactions (the core flows a reviewer can test)

| # | Flow | Done when |
|---|---|---|
| F1 | Move through sections 1–4 with the tabs (by mouse, and by arrow keys plus Enter or Space) and with the **Next** buttons | One section shows at a time; the current tab is lime with ink text; the selection is announced; the last section ends with "Go to Practice" |
| F2 | Section 1: turn the put-in vs. earned layers off and on, and switch the time range to **1 month** | The chart and its sentence change together; the numbers match the account |
| F3 | Section 2: show and hide the dip's events | The start of the fall, the low and the deposits appear and disappear; the table matches |
| F4 | Section 3: move Theo's start-age and monthly sliders by keyboard | Values are announced in words; the marker appears where Theo passes Nia ($196 a month when he starts at 32) |
| F5 | Open a section by link (`#section-3`), and an old link (`#chapter-5`) | Each opens the right section, and each section stands alone |
| F6 | On a phone: use the 2×2 tab grid, then the **Sections** button's sheet | No sideways scroll at 320px; every tab is at least 48px tall |
| F7 | Practice: buy, **New order**, sell, time machine, start over | The banner is always visible; errors are inline; the real account never changes |
| F8 | Finance Terms: search "crypto", open **Cryptocurrency**, follow a related term | A search with no results shows a helpful empty state |

## Edge cases (go-further)

| Case | Handling |
|---|---|
| *Nothing needs you* and *Brand-new account* scenarios | Every section's copy is true for that account (R4); brand-new gets the short version of sections 1 and 2 |
| Slider at extremes (Theo starts at 45; Theo at $300) | The result sentence stays true at every position |
| Reader opens a section directly | Each section's text stands alone; no section depends on an earlier interaction |
| Chart axes | Every chart's axis ends on its last label (65 for section 3), and stacked "put in" / "earned" areas start at $0, so the layers aren't exaggerated |
| Practice errors: not enough practice money, selling more than you own, nothing to sell, $0 or blank, letters, more than 2 decimals | An inline message in plain words; Confirm stays disabled until the order is valid |
| Phone in landscape; 320px; 200% zoom; reduced motion | The tabs never scroll sideways; charts reflow; text never sits on top of a chart; nothing required moves |

## Nice to haves

- A share card with the reader's own slider result.

## Definition of Done

| # | Done when… | LI |
|---|---|---|
| 1 | `/story` loads on the live site, directly and from the app's navigation ("Your Journey"; the phone tab "Journey"); the old `/p302` address redirects there | 1 |
| 2 | All four sections, the tabs, the Next buttons, every toggle and slider, the Sections sheet on a phone, "Show as table", Practice and Finance Terms work, each with a passing Playwright test | 2 |
| 3 | The story states and argues the point of view in this brief, using exactly the numbers in this brief, in at most 60 words of body text per section | 3, 6 |
| 4 | Every demo scenario, slider extremes, deep links (new and old), Practice errors and reduced motion are handled | 7 |
| 5 | Reads well at 390px, 768px and 1280px: tabs in one row from 600px, a 2×2 grid below | 8 |
| 6 | Repo root has README (with a P302 reviewer block) and LICENSE; AI scaffolding in `.claude/`, `CLAUDE.md`, `STATUS.md`, `docs/`; P302 code lives in its feature folders | 9, 10, 11 |
| 7 | `[P302]` commits show the story arriving phase by phase; STATUS.md has dated entries from several sessions | 12, 13, 18 |
| 8 | Every claim passes T1–T4 and R1–R4, the word "chapter" never appears on screen (G6), and this brief matches what was built | 19, 22 |
| 9 | Serif storytelling type, grain-for-growth and the mid-century tab drawings make it read as editorial finance for beginners | 20, 23, 26 |
| 10 | A reader who has never invested can say the point of view back after reading | 21 |
| 11 | The calls in this brief are visible: one point of view stated on screen, Rosa's own data first, one chart per section, and no chart without a sentence | 27 |
