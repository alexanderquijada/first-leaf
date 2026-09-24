# P302 · Interactive data story: Start early beats start big

> **Plan, written before building (Sept. 23, 2026).** Shared foundation: [BRIEF.md](../../BRIEF.md) §1–3 (product, person, how the pieces relate) and §6 (style). Every number here is made up to teach one idea. It is not a prediction and not financial advice.
>
> **Live:** `/p302` · **Code:** `src/p302-story/` · **Commits:** prefixed `[P302]`

## Summary

**The point of view:** *Starting early does more for you than putting in more money later. Early money has more years to grow on top of its own growth.*

The story follows two made-up friends. **Nia** starts at 22 and puts in **$100 a month**. **Theo** waits until 32 and puts in **$150 a month**, which is 50% more. At 65, Nia has more **even though she put in less**. The story then earns its point of view honestly: it lets the reader try to make Theo catch up, and it shows what happens when the years go up and down instead of growing smoothly.

**Why this story.** The most common thing beginners say is *"I'll start when I earn more."* That belief costs them the one thing money can't buy back: time. The insight is surprising, it can be shown truthfully with simple invented numbers, and it gives Rosa (the learner in P301/P303) a reason to keep her $150 a month going.

*Rejected:* "Fees quietly eat your growth." Strong, but it leans on percentages beginners struggle to feel. "Staying invested beats jumping out" is hard to show honestly with invented data without implying a market forecast.

## The audience

People in their 20s and early 30s who haven't started investing, typified by Rosa (26). They read on the couch in the evening, on a phone or a laptop, with 5–10 minutes. They don't know the phrase *compound growth*. The story teaches the idea and only names it at the end.

## Data

All numbers come from `src/shared/data/story-p302.json`, computed by the generator and re-computed by the validator (rules T1–T4).

**Assumption (shown on screen):** a made-up steady **6% a year**, added monthly, with money put in at the end of each month, until age 65. The note always says: *"Real markets go up and down, and nobody can promise a rate."*

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

**Every claim on screen is a checked rule (T2):**

| Claim on screen | Checked as |
|---|---|
| Nia ends with more money than Theo | $242,251 > $186,213 |
| Nia puts in less money than Theo | $51,600 < $59,400 |
| Most of Nia's money at 65 came from growth | $190,651 of $242,251 (79%) is growth |
| To catch up, Theo would need about $196 a month | $196 is the smallest whole amount that matches Nia ($195 is not enough), and Theo's slider can land on it |
| Even when the years go up and down, Nia still ends ahead | In the bumpy version, Nia ends at $216,910 vs. Theo's $181,230 |

**The bumpy version is honest by rule (T3):** the same *overall* growth as the smooth line (6% a year, compounded; the simple average of the years is higher, so we never say "average"). No year is worse than −20%, no staged late crash (Nia's balance never falls more than 25% from a peak), and both endings land within 15% of the smooth ones, so bumpiness never looks like a bonus or a disaster.

## Narrative and layout

**Decision: a scroll story in eight short chapters**, each with one sentence of argument and one chart state. At **1024px and wider** the chart stays pinned beside the text and changes as you scroll. **Below 1024px** each chapter carries its own chart inline, because a pinned chart would take half of a small screen. A chapter menu and a "Skip to the answer" link let people jump around, and the story never depends on scroll animation.

| # | Chapter | The one thing it says | Chart state | Interaction |
|---|---|---|---|---|
| 1 | Two friends | Same job, same pay. Nia starts at 22 with $100 a month. Theo waits until 32 and puts in $150. | Two empty timelines, 22 → 65 | — |
| 2 | Make a guess | Who has more at 65? | Hidden | **Tap Nia or Theo.** The story remembers the guess. |
| 3 | The answer | Nia: $242,251. Theo: $186,213. | Both lines draw to 65; Nia's glows | The reply depends on the guess: "You got it" or "Theo puts in more each month, so he seems like the safe guess." |
| 4 | Why | Nia put in *less*. Most of her money is growth on growth. | Nia's area splits into a flat "put in" layer and a grainy "growth" layer | Hover/tap any age to read both layers |
| 5 | Try it | Every year you wait costs you. | One saver at $100 a month | **Start-age slider, 18–45, step 1**, with the result at 65 in words |
| 6 | Can Theo catch up? | Yes, with about $196 a month, nearly twice Nia's. | Theo's line rises with the amount | **Theo's monthly slider, $150–$300, step $1**, with a marker where he passes Nia |
| 7 | Real life is bumpy | Real years go up and down. Same overall growth, and Nia still ends ahead. | Smooth vs. bumpy | **Smooth / Bumpy toggle** |
| 8 | Your turn | An example: Rosa, 26, $150 a month. "This uses Rosa, a made-up learner, as an example. It is not a plan for you." | One line from 26 to 65 | Start-age and amount sliders, pre-set to Rosa's numbers |

Closing: a three-line takeaway, then **Words from this story** (growth on growth, return, the market) using the shared term explanations, the sources and the disclaimer.

## Interaction rules

- **Sliders** are real range inputs. The arrow keys move them, and values are shown and announced in words ("Start at 30. At 65 you'd have…"). Every result comes from the same formula the validator checks.
- **The guess** is optional. Skipping it still works.
- **Show as table** sits under every chart.
- **Reduced motion:** charts appear in their final state; nothing required is animated.

## Edge cases (go-further)

| Case | Handling |
|---|---|
| Slider at extremes (start at 45; Theo at $300) | Copy stays true: "Starting at 45 still helps. It just has fewer years to grow." |
| Reader jumps straight to chapter 6 or 8 from the chapter menu or a link (`#chapter-6`) | Each chapter's text stands alone; no chapter depends on an earlier interaction |
| No guess made | Chapter 3 uses neutral copy |
| Phone in landscape; 200% zoom | Charts reflow; text never sits on top of a chart |
| Bumpy toggle | The caption explains why the ending differs: the order of good and bad years matters |

## Nice to haves

- A share card with the reader's own slider result.
- A subtle "snowball" illustration that grows chapter by chapter.

## Definition of Done

| # | Done when… | LI |
|---|---|---|
| 1 | `/p302` loads on the live site, directly and from the landing page | 1 |
| 2 | All 8 chapters, the guess, both sliders, the toggle, the chapter menu and "Show as table" work, each with a passing Playwright test | 2 |
| 3 | The story argues the point of view in this brief, using exactly the numbers in this brief | 3, 6 |
| 4 | Extremes, skipped guesses, deep links to every chapter and reduced motion are handled | 7 |
| 5 | Reads well at 390px, 768px and 1280px: pinned chart from 1024px, inline below | 8 |
| 6 | Repo root has README (with a P302 reviewer block) and LICENSE; AI scaffolding in `.claude/`, `CLAUDE.md`, `STATUS.md`, `docs/`; P302 code lives only in `src/p302-story/` | 9, 10, 11 |
| 7 | `[P302]` commits show the story arriving phase by phase; STATUS.md has dated entries from several sessions | 12, 13, 18 |
| 8 | Every claim passes validator rule T2, the bumpy version passes T3, and this brief matches what was built | 19, 22 |
| 9 | Serif storytelling type, grain-for-growth and mid-century illustration make it read as editorial finance for beginners | 20, 23, 26 |
| 10 | A reader who has never invested can say the point of view back after reading | 21 |
| 11 | The calls in this brief are visible: one point of view stated up front, an honest counter-case (chapters 6–7), and no chart without a sentence | 27 |
