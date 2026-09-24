# P302 · Interactive data story: Your money story

> **Lens brief, re-planned Sept. 24, 2026** (first written Sept. 23 as a stand-alone Nia and Theo story). First Leaf is one app; this case study is one lens on it. Shared foundation: [BRIEF.md](../../BRIEF.md) §1–3 (product, person, how the lenses fit together) and §6 (style). Rosa, Nia and Theo are invented; the stock and crypto names and crypto prices are real, and stock prices are modeled between real closes (ruling B, Phase 2.5). Nothing here is a prediction.
>
> **Live:** `/story` (any screen size; the chart pins beside the text from 1024px), plus `/practice` and `/learn` · **Code:** `src/features/story/`, `src/features/practice/`, `src/features/learn/` · **Commits:** prefixed `[P302]`

## Summary

**Your money story** tells Rosa the story of her own first six months in First Leaf, using her (invented) account, and argues one point of view. The story states it on screen, in these words:

> *"Right now, almost all of your balance is money you put in. Growth needs years, so starting early and staying steady matter more than picking the perfect moment."*

(Second person, like the chapters that follow: the story speaks to Rosa. Ruling, Sept. 24.)

It earns that point of view in six chapters. The first four read her own data: her balance since March, how much of it is her own deposits, the dip this summer (when she paused auto-invest) and what happened after, and where her money sits now. The fifth shows why years matter, with two friends, Nia and Theo (invented for the lesson): Nia starts at 22 with $100 a month, Theo waits until 32 and puts in $150, and Nia still ends with more. Then Rosa's own 26-to-65 slider shows it for her. The sixth invites her to try it with practice money in Practice.

**Why this story.** Rosa's reaction to the dip is the most common beginner mistake in miniature: a dip felt like the moment to stop. Her own chart shows that six months is far too short for growth to show up (most of her balance is still her own deposits; rule R1 checks the exact share), and the Nia and Theo lesson shows what the years do. A story about *her* money is more persuasive to her than a story about strangers, and it keeps First Leaf one product instead of an app with an essay attached.

**Practice and the learning moments count toward P302.** Practice (investing with practice money) and the term explanations and Words pages are how the story turns into something Rosa can try and understand, so they are part of this lens.

*Rejected:* the stand-alone "Start early beats start big" story about two strangers. It was sound, but it sat outside the app and never touched Rosa's own money. It lives on as chapter 5.
*Rejected:* "Fees quietly eat your growth." Strong, but it leans on percentages beginners struggle to feel, and stocks and crypto carry no yearly fund fee.
*Rejected:* "Staying invested beats jumping out" told with market forecasts. Nobody can forecast prices honestly. We show what happened to Rosa's own account and stop there.

## The audience

Rosa, 26, and people like her: in their 20s, a few months into investing or about to start. They read on the couch in the evening, on a phone or a laptop, with 5–10 minutes. They don't know the phrase *compound growth*. The story teaches the idea and names it near the end.

## Data

All numbers come from `src/shared/data/` and are re-computed by the validator. **Every claim the story makes is a checked rule**: rules T1–T4 for Nia and Theo, and rules R1–R4 for Rosa's own data (R1–R4 are defined in BRIEF.md §4 now and built in Phase 1).

**Rosa's own data** (the main demo account):

```json brief-example
{
  "account.openedOn": "2026-03-02",
  "account.balance": 1336.8,
  "account.moneyIn": 1250,
  "account.gainLoss": 86.8,
  "account.autoInvest.pausedOn": "2026-05-27",
  "account.cashSince": "2026-06-01",
  "account.history.49.date": "2026-05-11",
  "account.history.49.balance": 833.81,
  "account.history.59.date": "2026-05-26",
  "account.history.59.balance": 799.26,
  "account.history.59.moneyIn": 800,
  "story-p302.rosaStory.rosa-starter.facts.dip.fall": 34.89,
  "story-p302.rosaStory.rosa-starter.facts.dip.month": "May"
}
```

**Every claim about Rosa is a checked rule:**

| Claim on screen | Checked as |
|---|---|
| Most of Rosa's balance is money she put in | Deposits vs. what it earned, from the account (R1; "almost all" only at 90% or more) |
| This summer, her investments dipped | **The dip rule (ruling B, Phase 2.5):** the dip is the **largest 10-trading-day fall in Rosa's portfolio value between April 15 and Aug. 15, 2026**, measured as the market change in her balance with deposits taken out. The chapter title names the month of the low ("The dip in July"). R2 recomputes the window, the fall and the month from the balance history. Each account gets its own dip from its own history. |
| At the low, her balance was below what she had put in | Said only when it's true (R2) |
| She paused auto-invest the next trading day | The pause is the next trading day after the low (A14, R3). The calm account never pauses; its chapter says auto-invest stayed on. |
| After the pause | When her balance was back above what she'd put in, which deposits stayed as cash, and where she is on Sept. 18 (R3) |

The story says what happened and stops there. It never says pausing was right or wrong, and never tells Rosa to turn auto-invest back on; that stays her choice (BRIEF.md §8).

**Nia and Theo** (chapter 5). All numbers come from `story-p302.json`, computed by the generator and re-computed by the validator (rules T1–T4). **Assumption (shown on screen):** an example rate of **6% a year**, added monthly, with money put in at the end of each month, until age 65. The note always says: *"An example rate of 6% a year. Real markets go up and down, and nobody can promise a rate."* On screen Nia and Theo are "two friends"; the data still marks them fictional.

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
| Most of Nia's money at 65 came from growth | $190,651 of $242,251 (79%) is growth (T2) |
| To catch up, Theo would need about $196 a month | $196 is the smallest whole amount that matches Nia ($195 is not enough), and Theo's slider can land on it (T2) |
| Even when the years go up and down, Nia still ends ahead | In the bumpy version, Nia ends at $216,910 vs. Theo's $181,230 (T2) |

**The bumpy version is honest by rule (T3):** the same *overall* growth as the smooth line (6% a year, compounded; the simple average of the years is higher, so we never say "average"). No year is worse than −20%, no staged late crash (Nia's balance never falls more than 25% from a peak), and both endings land within 15% of the smooth ones, so bumpiness never looks like a bonus or a disaster.

**Every scenario gets a true story (R4).** The story reads the current scenario's account through `useScenario`. Rosa's facts and the sentences that state them are generated per account into `story-p302.json` (`rosaStory`), and R1–R4 recompute every number from the price and balance history, so the screen only ever shows checked sentences.
- *Nothing needs you:* auto-invest stayed on, so chapter 3 says so ("auto-invest stayed on and kept buying"), with that account's own numbers ($1,400 of $1,486.94 is deposits, 94.2%).
- *Brand-new account:* there is no history yet, so chapters 1–4 become one short chapter ("Your story starts with your first deposit") and the point of view is stated without the "right now" half. Chapters 5 and 6 work unchanged.

## Narrative and layout

**Decision: a scroll story in six chapters**, each with one sentence of argument and one chart state. At **1024px and wider** the chart stays pinned beside the text and changes as you scroll. **Below 1024px** each chapter carries its own chart inline, because a pinned chart would take half of a small screen. A chapter menu (`#chapter-1` … `#chapter-6`) lets people jump around, and the story never depends on scroll animation.

| # | Chapter | The one thing it says | Chart state | Interaction |
|---|---|---|---|---|
| 1 | Six months in | Here is your balance since March. | Balance over time since March 2, drawn in | **Toggle: "What you put in vs. what it earned"** splits the area into a flat "put in" layer and a grainy "earned" layer. **Time range: 1 month / 3 months / Since March.** |
| 2 | Most of it is still your money | Most of your balance is money you put in. Growth hasn't had time yet. | One bar: deposits vs. earned | Tap either part to read it in words |
| 3 | The dip in *month* (from the data) | Your investments fell over two weeks. You paused auto-invest the next trading day. Here is what happened after. | The balance line with the dip marked | **Toggle: show or hide the events** (the start of the fall, the low, the pause, deposits staying as cash) |
| 4 | Where it is now | Here is how your money is split today. | Her mix: her 5 stocks, 2 cryptocurrencies and cash | **Filter: stocks / crypto / cash** (cash shows an empty state when she has none) |
| 5 | What happens if you keep going | Years do the work. Nia starts at 22 with $100 a month; Theo waits until 32 and puts in $150. | Nia and Theo from 22 to 65 | See the steps below |
| 6 | Try it with practice money | Practice lets you try a mix with practice money. Nothing you do there touches your account. | — | A link into **Practice** |

**Chapter 5, step by step** (every Nia and Theo rule is kept):

| Step | What it says | Chart state | Interaction |
|---|---|---|---|
| 5a Make a guess | Who has more at 65? | Hidden | **Tap Nia or Theo.** The guess is optional. |
| 5b The answer | Nia: $242,251. Theo: $186,213. | Both lines draw to 65; Nia's glows | The reply depends on the guess: "You got it" or "Theo puts in more each month, so he seems like the better guess." |
| 5c Why | Nia put in *less*. Most of her money is growth on growth. | Nia's area splits into "put in" and grainy "growth" | Hover or tap any age to read both layers |
| 5d Every year counts | Every year you wait costs you. | One saver at $100 a month | **Start-age slider, 18–45, step 1**, with the result at 65 in words |
| 5e Can Theo catch up? | Yes, with about $196 a month, nearly twice Nia's. | Theo's line rises with the amount | **Theo's monthly slider, $150–$300, step $1**, with a marker where he passes Nia |
| 5f Real life is bumpy | Real years go up and down. Same overall growth, and Nia still ends ahead. | Smooth vs. bumpy | **Smooth / Bumpy toggle** |
| 5g Your turn | Rosa, 26, $150 a month. "This is an example, not a plan or advice." | One line from 26 to 65 | Start-age and amount sliders, pre-set to Rosa's numbers |

Closing: a three-line takeaway, then **Words from this story** (growth on growth, return, the market) using the shared term explanations, and the sources.

**Practice** (`/practice`): pick one of the 10 investments → amount → review → confirm → see what you own in Practice and your practice mix → **sell** part of it → **Time machine**: how this mix would have moved over the last 12 months → **Start over**. A persistent banner, "Practice money. Nothing here touches your account."; the real account never changes. Inside Practice only, the buttons may say **Buy** and **Sell**.

**Words** (`/learn`, `/learn/:termId`): search every explanation, open one as its own page, follow related words.

## Interaction rules

- **Sliders** are real range inputs. The arrow keys move them, and values are shown and announced in words ("Start at 30. At 65 you'd have…"). Every result comes from the same formula the validator checks.
- **Toggles and filters** are real buttons with a pressed state, and each has a sentence that says what the chart now shows.
- **The guess** is optional. Skipping it still works.
- **Show as table** sits under every chart.
- **Motion respects reduced motion:** with `prefers-reduced-motion`, charts appear in their final state and nothing required is animated.

## Interactions (the core flows a reviewer can test)

| # | Flow | Done when |
|---|---|---|
| F1 | Read chapters 1–4 and use the put-in vs. earned toggle and the time range | The chart and its sentence change together; the numbers match the account |
| F2 | Show and hide the dip's events | The fall, the low, the pause and the deposits that stayed as cash appear and disappear; the table matches |
| F3 | Filter the mix by stocks / crypto / cash | The mix and its sentence change; an empty filter says so |
| F4 | Make a guess, then read the answer | The reply matches the guess; skipping it gives neutral copy |
| F5 | Move the start-age slider and Theo's slider by keyboard | Values are announced in words; Theo's marker appears at $196 |
| F6 | Switch Smooth / Bumpy | The caption explains why the ending differs |
| F7 | Jump to any chapter from the menu or a link (`#chapter-5`) | Each chapter stands alone |
| F8 | Practice: buy, sell, time machine, start over | The banner is always visible; errors are inline; the real account never changes |
| F9 | Words: search "crypto", open "Crypto", follow a related word | A search with no results shows a helpful empty state |

## Edge cases (go-further)

| Case | Handling |
|---|---|
| *Nothing needs you* and *Brand-new account* scenarios | Every chapter's copy is true for that account (R4); brand-new gets the short version of chapters 1–4 |
| Slider at extremes (start at 45; Theo at $300) | Copy stays true: "Starting at 45 still helps. It just has fewer years to grow." |
| Reader jumps straight to a chapter | Each chapter's text stands alone; no chapter depends on an earlier interaction |
| No guess made | Step 5b uses neutral copy |
| Time range shorter than a chapter's events (1 month with the dip's events on) | The sentence says the events are outside this range, and offers "Since March" |
| Practice errors: not enough practice money, selling more than you own, nothing to sell, $0 or blank, letters, more than 2 decimals | An inline message in plain words; Confirm stays disabled until the order is valid |
| Phone in landscape; 200% zoom; reduced motion | Charts reflow; text never sits on top of a chart; nothing required moves |

## Nice to haves

- A share card with the reader's own slider result.
- A subtle "snowball" illustration that grows chapter by chapter.

## Definition of Done

| # | Done when… | LI |
|---|---|---|
| 1 | `/story` loads on the live site, directly and from the app's navigation; the old `/p302` address redirects there | 1 |
| 2 | All six chapters, the chapter 5 steps, every toggle, filter and slider, the chapter menu, "Show as table", Practice and Words work, each with a passing Playwright test | 2 |
| 3 | The story states and argues the point of view in this brief, using exactly the numbers in this brief | 3, 6 |
| 4 | Every demo scenario, slider extremes, skipped guesses, deep links, Practice errors and reduced motion are handled | 7 |
| 5 | Reads well at 390px, 768px and 1280px: pinned chart from 1024px, inline below | 8 |
| 6 | Repo root has README (with a P302 reviewer block) and LICENSE; AI scaffolding in `.claude/`, `CLAUDE.md`, `STATUS.md`, `docs/`; P302 code lives in its feature folders | 9, 10, 11 |
| 7 | `[P302]` commits show the story arriving phase by phase; STATUS.md has dated entries from several sessions | 12, 13, 18 |
| 8 | Every claim passes T1–T4 and R1–R4, and this brief matches what was built | 19, 22 |
| 9 | Serif storytelling type, grain-for-growth and mid-century illustration make it read as editorial finance for beginners | 20, 23, 26 |
| 10 | A reader who has never invested can say the point of view back after reading | 21 |
| 11 | The calls in this brief are visible: one point of view stated on screen, Rosa's own data first, an honest counter-case (5e–5f), and no chart without a sentence | 27 |
