# Research notes (before the spec)

Standing rule: ground terms and behavior in how the real industry works *before* specifying. These notes record what we checked and where each decision came from. Researched Sept. 23, 2026.

## Advice vs. education

- **FINRA Rule 2111 (Suitability) FAQ.** Marketing and educational material "ordinarily would not, by itself, constitute a 'recommendation'." The deciding factor is whether a communication is a **call to action** about specific securities for a particular customer. Asset-allocation education based on generally accepted theory is excluded when no particular security is recommended.
  → Our rule: flags and lessons explain; they never tell Rosa what to buy or sell. Validator G3 blocks call-to-action phrasing. Source: https://www.finra.org/rules-guidance/key-topics/suitability/faq

## How a real starter account behaves

- **T+1 settlement.** Since May 28, 2024, most U.S. securities trades settle one business day after the trade ("if you sell … on Monday, the transaction will settle on Tuesday").
  → Buys in our data settle the next trading day (rule A12), and "Settling" is a glossary term. Source: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/new-t1-settlement-cycle-what-investors-need-know-investor-bulletin
- **Expense ratio.** "The percentage of a fund's average net assets used each year to pay the fund's operating expenses." It's taken from fund assets, not billed.
  → We never show fees as a bill, and we explain why they are easy to miss. Source: https://www.investor.gov/introduction-investing/investing-basics/glossary/expense-ratio
- **Returned deposits.** Bank transfers into brokerage accounts can be returned by the sending bank (for example, for insufficient funds), typically within a few business days.
  → Rosa's Sept. 1 deposit is returned Sept. 3 and never counts as money put in (rule A4).
- **Uninvested cash, dividends, fee changes, goal pace.** These are the everyday events beginner accounts surface; they became the attention list. Goal pace is measured on deposits only, so a market drop never makes Rosa look "behind."

## Plain language

- **Flesch-Kincaid grade** = 0.39 × (words ÷ sentences) + 11.8 × (syllables ÷ words) − 15.59. Our zero-dependency implementation agrees with the `textstat` Python library (CMU pronouncing dictionary) within about one grade on the 35 texts we cross-checked. After the independent review widened the check to every learner-facing text in the data (87 texts), the highest score is grade 7.4 and the median 3.4; the limit is 8.
- **Term explanations on touch screens:** hover doesn't exist on phones. WCAG 2.1 SC 1.4.13 (Content on Hover or Focus) requires such content to be dismissible, hoverable and persistent. We use the toggletip pattern (a button that opens a panel on click, tap or keyboard): https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html and https://inclusive-components.design/tooltips-toggletips/
- Glossary sources point to the U.S. SEC's investor education site, Investor.gov, **only for general investing concepts**. Terms that are about First Leaf itself or account mechanics (Practice, On pace, Auto-invest, Money you put in and others) have no outside source, because citing the SEC for them would borrow authority we don't have.

## Fonts and imagery licensing

- **Klim Type Foundry test fonts** may not be used "for any commercial purposes … including … any consumer or customer facing applications." Web licenses start at $60 USD per style at the smallest tier (Klim pricing post). https://klim.co.nz/licences/test-fonts/ · https://klim.co.nz/blog/changes-to-eulas-new-pricing/
- **Typewolf** lists The Warren Trust (Alex's first reference) as using exactly Financier Display + Financier Text + National. https://www.typewolf.com/financier-display
- **Open Peeps** is CC0: "you can copy, modify, distribute… even for commercial purposes, without asking permission." https://www.openpeeps.com/

## Name checks

- "Saguaro Credit Union" was a real Tucson credit union (now closed), so it was rejected. "Groundwork" is a real finance card app, so it was rejected. No finance brand called "First Leaf" was found ("Firstleaf" is a wine club, a different industry).

## Deployment verification

- Vercel's GitHub integration creates GitHub **Deployments** per commit with environments named "Production" / "Preview" (or "Production – <project>"). Vercel's own wait-for-deployment action polls `GET /repos/{owner}/{repo}/deployments?sha=<sha>`. Our `check:deploy` does the same with `gh`. https://github.com/vercel/wait-for-deployment-action

## Color

- Contrast was computed with the WCAG relative-luminance formula. Color-blind separation was checked with Machado et al. (2009) simulation matrices (protanopia, deuteranopia, tritanopia) and CIELAB ΔE. Results are in BRIEF.md §6 and the STATUS decision log.
