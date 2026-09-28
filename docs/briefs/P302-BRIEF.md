# P302 · Interactive data story: Your Journey

> **Lens brief, re-planned Sept. 24, 2026** (first written Sept. 23 as a stand-alone story about two invented savers; reshaped Sept. 28 for Alex's review round, Phase 6, from "Your money story" in six chapters to "Your Journey" in four sections). First Leaf is one app; this case study is one lens on it. Shared foundation: [BRIEF.md](../../BRIEF.md) §1–3 (product, person, how the lenses fit together) and §6 (style). Rosa is invented; the stock and crypto names and crypto prices are real, and stock prices are modeled between real closes (ruling B, Phase 2.5). Nothing here is a prediction.
>
> **Live:** `/story` (any screen size; one section at a time, chosen with visual tabs), plus `/practice` and `/learn` (Finance Terms) · **Code:** `src/features/story/`, `src/features/practice/`, `src/features/learn/` · **Commits:** prefixed `[P302]`

## Summary

**Your Journey** tells Rosa the story of her own first six months in First Leaf, using her (invented) account, and argues one point of view. The story states it on screen, in these words:

> *"Right now, almost all of your balance is money you put in. Growth needs years, so starting early and staying steady matter more than picking the perfect moment."*

(Second person, like the sections that follow: the story speaks to Rosa. Ruling, Sept. 24.)

It earns that point of view in **four short sections**, shown one at a time. **Six months in** reads her own balance since March and shows that almost all of it is money she put in. **The dip in June** shows the two weeks when prices fell, and that auto-invest kept buying through them. **Your head start** shows why years matter with her own money: two lines, both Rosa, from 26 to 65. One keeps adding $150 a month; the other stops now and starts again later, and needs a bigger monthly amount to catch up. **Try it** invites her to try a mix with practice money in Practice.

**Why this story.** A dip is the moment a beginner is most likely to feel like stopping. Rosa's own chart shows what happened when she didn't: auto-invest kept buying, and within ten days of the low her balance was back above what she had put in. It also shows that six months is far too short for growth to show up (most of her balance is still her own deposits; rule R1 checks the exact share), and her head start shows what the years do. A story about *her* money is more persuasive to her than a story about strangers, and it keeps First Leaf one product instead of an app with an essay attached.

**Practice and the learning moments count toward P302.** Practice (investing with practice money), the term explanations and the Finance Terms pages are how the story turns into something Rosa can try and understand, so they are part of this lens.

*Replaced Sept. 28 (Alex's review round):* the six-chapter scroll story with a pinned chart, whose chapter 5 alone had seven steps (a guess, the answer, why, every year counts, catch-up, smooth vs. bumpy, and "your turn"), plus a closing. *What we got wrong:* it ran too long, and a reader on the couch lost the point before the end. The guess, the smooth and bumpy switch, the "your turn" step, the closing, the mix chapter and the pause are removed; "chapters" are now "sections", and the word "chapter" never appears on the site (G6).
*Rejected:* the stand-alone "Start early beats start big" story about two strangers. It was sound, but it sat outside the app and never touched Rosa's own money. It lived on as section 3 until Sept. 28 (Phase 6.1), when section 3 became Rosa's own "Your head start": a story about strangers is weaker than one about her.
*Rejected:* "Fees quietly eat your growth." Strong, but it leans on percentages beginners struggle to feel, and stocks and crypto carry no yearly fund fee.
*Rejected:* "Staying invested beats jumping out" told with market forecasts. Nobody can forecast prices honestly. We show what happened to Rosa's own account and stop there.

## The audience

Rosa, 26, and people like her: in their 20s, a few months into investing or about to start. They read on the couch in the evening, on a phone or a laptop, with 5 minutes. They don't know the word *compounding*. The story teaches the idea and names it in section 3, with its Finance Terms entry.

## Data

All numbers come from `src/shared/data/` and are re-computed by the validator. **Every claim the story makes is a checked rule**: rules T1–T4 for her head start, and rules R1–R4 for Rosa's own data (defined in BRIEF.md §4).

**Rosa's own data** (the main demo account):

```json brief-example
{
  "account.openedOn": "2026-03-02",
  "account.balance": 1536.68,
  "account.moneyIn": 1400,
  "account.gainLoss": 136.68,
  "account.autoInvest.on": true,
  "account.history.57.date": "2026-05-21",
  "account.history.57.balance": 846.01,
  "account.history.67.date": "2026-06-05",
  "account.history.67.balance": 915.77,
  "account.history.67.moneyIn": 950,
  "account.history.73.date": "2026-06-15",
  "story-p302.rosaStory.rosa-starter.facts.depositsShare": 0.9111,
  "story-p302.rosaStory.rosa-starter.facts.dip.fall": 80.24,
  "story-p302.rosaStory.rosa-starter.facts.dip.month": "June",
  "story-p302.rosaStory.rosa-starter.facts.after.depositsInvested": true,
  "story-p302.rosaStory.rosa-starter.claims.1.text": "About 91% of your balance is money you put in. The other $136.68 is what it earned.",
  "story-p302.rosaStory.rosa-starter.claims.5.text": "Auto-invest kept buying through the dip. Your June 1, July 1, Aug. 3 and Sept. 1 deposits each bought your mix the day they arrived."
}
```

**Every claim about Rosa is a checked rule:**

| Claim on screen | Checked as |
|---|---|
| About 91% of her balance is money she put in; the other $136.68 is what it earned | Deposits vs. what it earned, from the account (R1; "almost all" only at 90% or more) |
| From May 21 to June 5, falling prices took $80.24 off her balance, a drop of 9.5% | **The dip rule (ruling B, Phase 2.5):** the dip is the **largest 10-trading-day fall in Rosa's portfolio value between April 15 and Aug. 15, 2026**, measured as the market change in her balance with deposits taken out. The section title names the month of the low ("The dip in June"). The data uses the first seed after 1 where this dip is an 8% to 15% fall (seed 10: 9.5%, May 21 to June 5; ruling, Sept. 25). R2 recomputes the window, the fall and the month from the balance history. Each account gets its own dip from its own history. On the chart, the dip's event markers sit visibly apart, even at 390px. |
| Auto-invest kept buying through the dip: her June 1, July 1, Aug. 3 and Sept. 1 deposits each bought her mix the day they arrived | Auto-invest ran every month with no pause (A14), and every deposit named was invested the day it arrived (R3) |

The story says what happened and stops there. It describes the dip and what auto-invest did; it never suggests what anyone should do about a dip (BRIEF.md §8).

**Your head start** (section 3; rebuilt Sept. 28, Phase 6.1). Two lines, **both Rosa**, from her age now (26, from the persona) to 65. All numbers come from `story-p302.json` (`headStart`), computed by the generator and re-computed by the validator (rules T1–T4). **Assumption (shown on screen):** an example rate of **6% a year**, added monthly, with money put in at the end of each month. The note always says: *"An example rate of 6% a year. Real markets go up and down, and nobody can promise a rate."*
- **Keep going** (solid line): the account's invested amount today ($1,534.20), plus $150 a month (her recurring deposit) until 65.
- **Start again later** (dashed line): the same starting amount, but she stops adding money now and starts again after the delay, adding the "Then add" amount each month until 65.
- **Sliders:** "Start again in" (1 to 15 years, step 1, default 5) and "Then add" ($150 to $300 a month, step $1, default $150). A marker on "Then add" reads "Catches up at $X a month": the smallest whole amount that makes the later line reach the keep-going line at 65. When no amount up to $300 does, the slider says so instead.
- **Brand-new account:** she has nothing invested yet, so both lines start at $0, and the lines are "Start now" and "Start later" ("Start in" on the slider).

```json brief-example
{
  "story-p302.headStart.startAge": 26,
  "story-p302.headStart.endAge": 65,
  "story-p302.headStart.monthly": 150,
  "story-p302.headStart.delay.default": 5,
  "story-p302.headStart.add.max": 300,
  "story-p302.headStart.accounts.rosa-starter.start": 1534.2,
  "story-p302.headStart.accounts.rosa-starter.keepGoing.39.value": 295460.82,
  "story-p302.headStart.accounts.rosa-starter.laterDefault.39.value": 215382.8,
  "story-p302.headStart.catchUp.0.monthly": 161,
  "story-p302.headStart.catchUp.4.monthly": 211,
  "story-p302.headStart.catchUp.9.monthly": 300,
  "story-p302.headStart.catchUp.14.monthly": null
}
```

| Claim on screen | Checked as |
|---|---|
| Both lines start from what she has invested today | Each account's starting amount equals its invested value (T1) |
| Keeping going could reach $295,461 at 65 | The keep-going line matches the growth formula, year by year (T1) |
| Catch-up amounts: 1 year $161, 5 years $211, 10 years $300, 15 years none up to $300 | For every delay, the amount is the smallest whole dollar that reaches the keep-going line at 65, one dollar less falls short, and the slider can land on it (T2) |
| Only Rosa is in the lesson | The head start uses her age and her $150 recurring deposit, and no other person is named anywhere on screen (T3, G6) |

The data no longer holds the two invented savers, the bumpy years or the "your turn" numbers (removed Sept. 28, Phase 6.1).

**Every scenario gets a true story (R4).** The story reads the current scenario's account through `useScenario`. Rosa's facts and the sentences that state them are generated per account into `story-p302.json` (`rosaStory`), and R1–R4 recompute every number from the price and balance history, so the screen only ever shows checked sentences.
- *Nothing needs you:* the same six months as the default account (only the beneficiary differs), so sections 1 and 2 read the same, with that account's own checked numbers.
- *Brand-new account:* there is no history yet, so section 1 is named **Your start** and section 2 **When prices dip** (no section names a time she has not had). Section 1 states the point of view without the "right now" half and says the page will show how her money moves once her first deposit arrives; section 2 says prices sometimes fall for a while, and this section will show how her money moved through a dip. Sections 3 and 4 work unchanged.

## Narrative and layout

**Decision: four short sections, one shown at a time, chosen with visual tabs** (Alex's review round, Sept. 28). Each section has **one chart or interaction**, **at most 60 words of body text**, and ends with a **"Next: *name*"** button that moves to the next section; the last ends with **"Go to Practice"**.

- **The tabs** sit across the page under the title, left-aligned. Each tab has its number, its name and a small original mid-century drawing drawn in code. The current tab is filled lime with ink text. They follow the WAI-ARIA tabs pattern: the arrow keys move between tabs, Enter or Space selects one, and the selection is announced.
- **On a phone** the same tabs form a 2×2 grid (no sideways scroll at 320px; each tab at least 48px tall), plus a **"Sections"** button that opens the bottom-sheet picker for jumping once the grid has scrolled away.
- **Deep links:** `#section-1` … `#section-4` open that section. Old links still work: `#chapter-1`, `#chapter-2` and `#chapter-4` open section 1; `#chapter-3` opens section 2; `#chapter-5` opens section 3; `#chapter-6` opens section 4.
- The story never depends on scroll animation.

| # | Section | What it says (at most 60 words) | Chart or interaction |
|---|---|---|---|
| 1 | Six months in | The point of view ("Right now, almost all of your balance is money you put in. Growth needs years, so starting early and staying steady matter more than picking the perfect moment."), then "About 91% of your balance is money you put in. The other $136.68 is what it earned." and "Shown as a percent, what it earned is called your rate of return." (with the Rate of return term) | **Balance over time** since March 2, with the "put in" and grainy "earned" layers (**toggle: what you put in vs. what it earned**) and a **time range: 1 month / 3 months / Since March** |
| 2 | The dip in June | "From May 21 to June 5, falling prices took $80.24 off your balance. That is a drop of 9.5%." then "Auto-invest kept buying through the dip. Your June 1, July 1, Aug. 3 and Sept. 1 deposits each bought your mix the day they arrived." and "Buying the same amount every month is called dollar-cost averaging." (with the Dollar-cost averaging term). It describes only; it never suggests what anyone should do | **The dip chart:** the balance line with the dip marked, and a **toggle to show or hide the events** (the start of the fall, the low, the day her balance was back above what she put in, and the deposits auto-invest bought with) |
| 3 | Your head start | "You started at 26. If you keep adding $150 a month, here's where it could be at 65. Waiting means less time for compounding, so catching up costs more." (with the Compounding term; Alex's suggested ending, "so you'd need to add more to catch up", was shortened to keep the section at 59 of 60 words); the live result sentence ("At 65: $295,461 if you keep going, $215,383 if you wait."); the rate note. Second person; no other people; it describes and never tells her what to do (G3) | **One chart of both lines** from 26 to 65 (Keep going solid, Start again later dashed, each named in the legend and the table), with **sliders "Start again in" (1–15 years) and "Then add" ($150–$300 a month)**; a marker, "Catches up at $211 a month" (for 5 years), which screen readers hear with the slider; its label stays inside the track at every delay |
| 4 | Try it | "Practice lets you try a mix with practice money. Nothing you do there touches your account." and "Its time machine shows how a mix could have moved over the last year." | **"Go to Practice"** |

**Practice** (`/practice`): pick one of the 10 investments → amount → review → confirm → see what you own in Practice and your practice mix → **sell** part of it → **Time machine**: how this mix would have moved over the last 12 months → **Start over**. There is no banner (removed Sept. 28, Phase 6.1: it pushed Practice's title out of line with every other page). Practice stays separate from the real account in two ways: every Practice amount is labeled "Practice money" ("Practice money: $1,000.00", "Practice money left to use", "Practice money invested"; what she owns, her practice mix and the time machine sit under "What you own in Practice" and "Your practice mix", and the mix reads "Your practice money by kind"), and every buy or sell review says "This uses practice money." The real account never changes. Inside Practice only, the buttons may say **Buy** and **Sell**. Crypto holdings show **"Amount"** with the coin's unit ("0.00247299 BTC"), never "Shares".

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
| F4 | Section 3: move "Start again in" and "Then add" by keyboard | Values are announced in words; the result sentence and the dashed line change; the marker shows the catch-up amount for the delay ($211 a month at 5 years), or the slider says no amount up to $300 catches up |
| F5 | Open a section by link (`#section-3`), and an old link (`#chapter-5`) | Each opens the right section, and each section stands alone |
| F6 | On a phone: use the 2×2 tab grid, then the **Sections** button's sheet | No sideways scroll at 320px; every tab is at least 48px tall |
| F7 | Practice: buy, **New order**, sell, time machine, start over | Every amount is labeled "Practice money"; every review says "This uses practice money."; errors are inline; the real account never changes |
| F8 | Finance Terms: search "crypto", open **Cryptocurrency**, follow a related term | A search with no results shows a helpful empty state |

## Edge cases (go-further)

| Case | Handling |
|---|---|
| *Nothing needs you* and *Brand-new account* scenarios | Every section's copy is true for that account (R4); brand-new gets the short version of sections 1 and 2 |
| Slider at extremes (start again in 1 or 15 years; add $150 or $300) | The result sentence and the marker stay true at every position |
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
