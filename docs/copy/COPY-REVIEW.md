# Copy review · Phase 2.5

**Status: every row is DRAFT, waiting for Alex.** This table **supersedes the Phase 2 table** (Sept. 24). Phase 2's approved rewrites 1 to 6 and 8 to 10 are applied; rows they changed say so in the "Why" column ("Changed by approved rewrite N"). Rewrite 7 (the fee sentence) is moot: the fee alert is gone. Nothing in the "Suggested rewrite" column below has been applied.

**What this covers:** all 719 pieces of text a person can read or hear in First Leaf. That includes every string in the copy files (`src/shared/copy.json`, `src/layouts/copy.json`, `src/features/*/copy.json`) and the text that comes from the data (alerts, the ten investments, the story's sentences, the glossary). Built by `npm run copy:review` from the live pages.

**How to read a row**

- **Where it appears:** the screens where it was found on the laptop (1280px) and phone (390px) layouts. The small code is where it lives, `file:key` (`data:` for the data files).
- **Text as shown:** exactly as rendered for Rosa's normal account, taken from the live pages. Only when a string isn't on any captured screen (an error, a dialog step, a value in a table cell) is it filled with example values, and it says so.
- **Grade:** the Flesch-Kincaid grade as rule L5 scores it. A leading label of 3 words or fewer ("Example:") is set aside, and "label" means every sentence is 3 words or fewer (exempt). The limit is 8. The two data-source credits keep fixed wording and are exempt from the grade only.
- **Other scenario versions:** what the same text says for the "Nothing needs you" account and the brand-new account.
- **Suggested rewrite / Why:** a suggestion to approve, or a note that an approved rewrite changed the row. A dash with no note means keep it as it is.

## Recommended rewrites, in order

At most ten, most important first. Each one links to its row below.

1. Approve the ending of rewrite 3: "…added up to a $10.99 drop." / "…a $10.99 rise." (**H73**). Filled with the change word, it read "added up to down $10.99".
2. Approve the new SIPC notice (**L66**) and the new word "SIPC protection" (**W109**). Decide whether the app should say, or avoid saying, that First Leaf is a SIPC member.
3. Approve the ten "What it is" descriptions (**F50** and the nine rows after it).
4. Approve the new words: Stock, Crypto, Bitcoin (**W98**).
5. Crypto pages: "Shares" → "How much you own" (**F20**). "0.00136690 shares" of Bitcoin reads oddly.
6. "Dividends: no change." → "No dividends this week." when there are none (**H70**).
7. Approve the data-driven dip sentence (**S120**).
8. Optional: split the stock data note into two shorter sentences (**E11**). Your wording is kept exactly until you say otherwise.
9. "FYI" → "Good to know", matching its section (**L3**, **L9**). Carried from Phase 2.
10. "Requested on" → "Asked for on" (**V40**). Carried from Phase 2.

## Consistency pass

Each finding points to its rows. Rows without a suggestion passed.

**Voice.** Every screen speaks to "you". Rosa's name appears only in the greeting and the brand-new welcome. The Deposit example no longer names her (approved rewrite 2). Passes.

**One word per idea.**
- *Practice money:* one name everywhere on screen (approved rewrite 6). "Pretend money" stays only in the Practice word's other names, for search. Passes.
- *Investment vs. fund:* "fund" is gone from the screen. The page is "Your investments", the column is "Investment", and the kind is "Stock" or "Crypto". Passes.
- *Shares for crypto:* stocks and crypto share the label "Shares" (**F20**).
- *Deposit timing:* one sentence everywhere, "It should arrive in 1 to 3 business days." (approved rewrite 5). Passes.
- *Needs you:* the laptop and phone both say "Nothing needs you right now." and "N things need you." (approved rewrite 10). Passes.
- *FYI vs. Just so you know:* still two names (**L3**).

**No disclaimer (ruling B).** No "simulated", "concept", "not real" or "not investment advice" anywhere. Rule G6 and the site crawl check this. The only data notes are the CoinGecko credit ("Powered by CoinGecko API", the wording their terms and attribution guide both accept) and the stock data note.

**Sentence case, dates, money.** Passes. "1 month" and "3 months" replace "1M" and "3M" (approved rewrite 9). Dates follow AP style. Money follows the house format; rule L5 checks every sentence.

**Every value labeled.** Passes (L5). Values in table cells and lists are labeled by their column or heading.

**Error messages.** The "nothing to sell" error now says what to do (approved rewrite 8). Passes.

## Screen by screen

### App frame (every screen)

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| A1<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`layouts:wordmark`</sub> | First Leaf | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A2<br>DRAFT | Home (laptop); Alerts (laptop); Activity (laptop); and 12 more screens<br><sub>`layouts:greeting`</sub> | Good morning, Rosa. | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A3<br>DRAFT | Home (laptop); Alerts (laptop); Activity (laptop); and 12 more screens<br><sub>`layouts:pricesAsOf`</sub> | Prices as of Fri., Sept. 18 | -0.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| A4<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`layouts:skip`</sub> | Skip to content | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A5<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`layouts:navLabel`</sub> | Main | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A6<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`layouts:nav.home.label`</sub> | Home | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A7<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`layouts:nav.home.short`</sub> | Home | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A8<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`layouts:nav.activity.label`</sub> | Activity | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A9<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`layouts:nav.activity.short`</sub> | Activity | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A10<br>DRAFT | Home (laptop); Alerts (laptop); Activity (laptop); and 12 more screens<br><sub>`layouts:nav.funds.label`</sub> | Investments | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A11<br>DRAFT | Home (laptop); Alerts (laptop); Activity (laptop); and 12 more screens<br><sub>`layouts:nav.funds.short`</sub> | Investments | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A12<br>DRAFT | Your money story (laptop, phone); Home (laptop); Alerts (laptop); and 12 more screens<br><sub>`layouts:nav.story.label`</sub> | Your money story | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A13<br>DRAFT | Home (phone); Alerts (phone); Activity (phone); and 5 more screens<br><sub>`layouts:nav.story.short`</sub> | Story | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A14<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`layouts:nav.practice.label`</sub> | Practice | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A15<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`layouts:nav.practice.short`</sub> | Practice | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A16<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`layouts:nav.learn.label`</sub> | Words | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A17<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`layouts:nav.learn.short`</sub> | Words | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A18<br>DRAFT | Home (laptop); Alerts (laptop); Activity (laptop); and 12 more screens<br><sub>`layouts:phoneView.toggle`</sub> | Phone view | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A19<br>DRAFT | Phone view<br><sub>`layouts:phoneView.heading`</sub> | Phone preview | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| A20<br>DRAFT | App frame (every screen)<br><sub>`layouts:phoneView.frameTitle`</sub> | First Leaf on a phone *(not on a captured screen; example values)* | -1.8 | Same words wherever it shows | — |  |
| A21<br>DRAFT | Phone view<br><sub>`layouts:phoneView.back`</sub> | Back to full view | -2.2 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| A22<br>DRAFT | App frame (every screen)<br><sub>`layouts:phoneView.practiceNote`</sub> | Practice here is kept apart from the full view. *(not on a captured screen; example values)* | 2.3 | Same words wherever it shows | — |  |
| A23<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`layouts:pageTitles.home`</sub> | Home | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A24<br>DRAFT | Alerts (laptop, phone); Try-again dialog; Auto-invest dialog<br><sub>`layouts:pageTitles.alerts`</sub> | Alerts | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A25<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`layouts:pageTitles.activity`</sub> | Activity | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A26<br>DRAFT | Investments (laptop, phone)<br><sub>`layouts:pageTitles.funds`</sub> | Your investments | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A27<br>DRAFT | Your money story (laptop, phone); Home (laptop); Alerts (laptop); and 12 more screens<br><sub>`layouts:pageTitles.story`</sub> | Your money story | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A28<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`layouts:pageTitles.practice`</sub> | Practice | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A29<br>DRAFT | Words (laptop, phone); Words (no match)<br><sub>`layouts:pageTitles.learn`</sub> | Words to know | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A30<br>DRAFT | App frame (every screen)<br><sub>`layouts:pageTitles.notFound`</sub> | Page not found *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| A31<br>DRAFT | App frame (every screen)<br><sub>`layouts:documentTitle`</sub> | Activity · First Leaf *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |

### Home

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| H1<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`home:title`</sub> | Home | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H2<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone); Words (laptop, phone); Word explanation<br><sub>`home:balance.label`</sub> | Balance | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H3<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:balance.vsPutIn`</sub> | Up $86.80 on the $1,250 you put in. | 2.3 | Nothing needs you: “Up $119.67 on the $1,400 you put in.”<br>Brand-new: not shown | — |  |
| H4<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:balance.putInWord`</sub> | put in | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H5<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:balance.thisWeek`</sub> | This week: down $10.99. | label | Nothing needs you: “This week: down $18.02.”<br>Brand-new: not shown | — |  |
| H6<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:balance.inFunds`</sub> | Invested | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H7<br>DRAFT | Alerts (laptop, phone); Your money story (laptop, phone); Home (laptop); and 2 more screens<br><sub>`home:balance.cash`</sub> | Cash | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H8<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone); Word explanation<br><sub>`home:balance.youPutIn`</sub> | You put in | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H9<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Words (laptop, phone); and 3 more screens<br><sub>`home:balance.autoInvestWord`</sub> | Auto-invest | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H10<br>DRAFT | Home (laptop)<br><sub>`home:balance.autoOn`</sub> | Auto-invest: On. *(only in the Nothing needs you account)* | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H11<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:balance.autoPausedSince`</sub> | Auto-invest: Paused since May 27. | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| H12<br>DRAFT | Home<br><sub>`home:balance.autoPaused`</sub> | Auto-invest: Paused. *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| H13<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:chart.title`</sub> | Balance over time | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H14<br>DRAFT | Home (phone)<br><sub>`home:chart.phoneTitle`</sub> | Balance since March | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H15<br>DRAFT | Home (laptop, phone); Word explanation<br><sub>`home:chart.nowUp`</sub> | On Sept. 18, your balance was $1,336.80. That is $1,250.00 you put in and $86.80 it earned. | 3.0 | Nothing needs you: “On Sept. 18, your balance was $1,519.67. That is $1,400.00 you put in and $119.67 it earned.”<br>Brand-new: not shown | — |  |
| H16<br>DRAFT | Home<br><sub>`home:chart.nowDown`</sub> | On Sept. 18, your balance was $1,336.80. That is $1,250.00 you put in and $5.00 less than that. *(not on a captured screen; example values)* | 3.0 | Not on a captured screen; the values change with the account | On {date}, your balance was {balance}. That is {earned} less than the {moneyIn} you put in. | Shows only when the balance is below what you put in, exactly when a reader is worried. The current wording is hard to follow. |
| H17<br>DRAFT | Home (laptop, phone); Word explanation<br><sub>`home:chart.range`</sub> | From March 2 to Sept. 18, it went from $499.88 to $1,336.80. *(and 1 more like it)* | 4.8 | Nothing needs you: “From March 2 to Sept. 18, it went from $499.88 to $1,519.67.”<br>Brand-new: not shown | — |  |
| H18<br>DRAFT | Home (laptop, phone); Investments (laptop, phone); Your money story (laptop, phone); Activity (laptop)<br><sub>`home:chart.colDate`</sub> | Date | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H19<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone); Words (laptop, phone); Word explanation<br><sub>`home:chart.colBalance`</sub> | Balance | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H20<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone); Word explanation<br><sub>`home:chart.colPutIn`</sub> | You put in | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H21<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone)<br><sub>`home:chart.colEarned`</sub> | It earned | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H22<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:chart.emptyTitle`</sub> | Balance over time | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H23<br>DRAFT | Home (laptop)<br><sub>`home:chart.empty`</sub> | Your balance over time will show here after your first deposit arrives. *(only in the brand-new account)* | 6.8 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| H24<br>DRAFT | Words (laptop, phone); Home (laptop); Word explanation<br><sub>`home:mix.title`</sub> | Your mix | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H25<br>DRAFT | Home<br><sub>`home:mix.even`</sub> | Each investment is at the share you set. *(not on a captured screen; example values)* | 2.3 | Same words wherever it shows | — |  |
| H26<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:mix.biggestGap`</sub> | The biggest difference is NKE: 6% now and 10% in the mix you set. | 5.9 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H27<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:mix.lede`</sub> | Your mix now, next to the mix you set. | -0.3 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H28<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:mix.mixWord`</sub> | mix | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H29<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:mix.listLabel`</sub> | Your mix now and the mix you set | -0.7 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H30<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:mix.now`</sub> | The biggest difference is NKE: 6% now *(and 13 more like it)* | 5.7 | Nothing needs you: “The biggest difference is NKE: 6% now”<br>Brand-new: not shown | — |  |
| H31<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:mix.set`</sub> | · 25% set *(and 5 more like it)* | label | Nothing needs you: same<br>Brand-new: not shown |  · you set {set}% | "35% set" reads like shorthand. Optional. |
| H32<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:mix.cash`</sub> | $452.11 in cash is not part of your mix. | 1.0 | Nothing needs you: “$2.47 in cash is not part of your mix.”<br>Brand-new: not shown | — |  |
| H33<br>DRAFT | Activity (laptop, phone); Home (laptop); Investments (laptop); Practice (after buying)<br><sub>`home:mix.colFund`</sub> | Investment | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H34<br>DRAFT | Home (laptop)<br><sub>`home:mix.colNow`</sub> | Now | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H35<br>DRAFT | Home (laptop)<br><sub>`home:mix.colSet`</sub> | You set | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H36<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:goal.title`</sub> | Goal: Put in my first $2,000 | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H37<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:goal.progress`</sub> | $1,250 of $2,000 put in, with a target of Feb. 1, 2027. | 5.8 | Nothing needs you: “$1,400 of $2,000 put in, with a target of Feb. 1, 2027.”<br>Brand-new: not shown | — |  |
| H38<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:goal.barLabel`</sub> | Money put in toward your goal | 2.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H39<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`home:goal.barValue`</sub> | Word of the day *(and 75 more like it)* | -2.2 | Nothing needs you: “Word of the day”<br>Brand-new: “Word of the day” | — |  |
| H40<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:goal.behind`</sub> | Your plan had $1,400 put in by now, so you are $150 behind. | 4.0 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| H41<br>DRAFT | Home (laptop)<br><sub>`home:goal.onPace`</sub> | You are on pace with your plan. *(only in the Nothing needs you account)* | -1.1 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H42<br>DRAFT | Home (laptop)<br><sub>`home:goal.paceWord`</sub> | pace *(only in the Nothing needs you account)* | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H43<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:goal.note`</sub> | This counts deposits only, not the market. | 5.7 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H44<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:week.title`</sub> | This week | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H45<br>DRAFT | Home (laptop); Word explanation<br><sub>`home:week.line`</sub> | Your balance went down $10.99 this week. | 2.3 | Nothing needs you: “Your balance went down $18.02 this week.”<br>Brand-new: not shown | — |  |
| H46<br>DRAFT | Home (laptop, phone); Word explanation<br><sub>`home:week.caption`</sub> | How your balance moved this week | 0.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H47<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone); Word explanation<br><sub>`home:week.startBalance`</sub> | Sept. 11 balance *(and 18 more like it)* | label | Nothing needs you: “Sept. 11 balance”<br>Brand-new: same | — |  |
| H48<br>DRAFT | Home (laptop, phone); Words (laptop, phone); Word explanation<br><sub>`home:week.market`</sub> | The market | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H49<br>DRAFT | Home (laptop, phone); Investments (laptop, phone); Activity (laptop); Word explanation<br><sub>`home:week.dividends`</sub> | Dividends | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H50<br>DRAFT | Home (laptop, phone); Activity (laptop); Word explanation<br><sub>`home:week.deposits`</sub> | Deposits | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H51<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone); Word explanation<br><sub>`home:week.endBalance`</sub> | Sept. 11 balance *(and 18 more like it)* | label | Nothing needs you: “Sept. 11 balance”<br>Brand-new: same | — |  |
| H52<br>DRAFT | Home (phone)<br><sub>`home:welcome.title`</sub> | Welcome, Rosa. *(only in the brand-new account)* | label | Nothing needs you: not shown<br>Brand-new: “Welcome, Rosa.” | — |  |
| H53<br>DRAFT | Home (phone)<br><sub>`home:welcome.lede`</sub> | Your account is open. Here is what happens next. *(only in the brand-new account)* | 1.9 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| H54<br>DRAFT | Home (phone)<br><sub>`home:welcome.step1`</sub> | Add money from your bank. It should arrive in 1 to 3 business days. *(only in the brand-new account)* | 4.0 | Nothing needs you: not shown<br>Brand-new: same | — | Changed by approved rewrite 5 (Phase 2). |
| H55<br>DRAFT | Home (phone)<br><sub>`home:welcome.step2`</sub> | When it arrives, it waits as cash in your account. *(only in the brand-new account)* | 2.5 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| H56<br>DRAFT | Your money story (laptop, phone)<br><sub>`home:welcome.cashWord`</sub> | cash | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H57<br>DRAFT | Home (phone)<br><sub>`home:welcome.step3`</sub> | Then you choose what to do with it, such as turning on auto-invest. *(only in the brand-new account)* | 4.9 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| H58<br>DRAFT | Home (phone)<br><sub>`home:welcome.autoInvestWord`</sub> | auto-invest *(only in the brand-new account)* | label | Nothing needs you: not shown<br>Brand-new: same | — |  |
| H59<br>DRAFT | Home (laptop, phone); Word explanation<br><sub>`home:phone.weekChange`</sub> | Down $10.99 this week *(and 4 more like it)* | label | Nothing needs you: “Down $18.02 this week”<br>Brand-new: not shown | — |  |
| H60<br>DRAFT | Home (phone)<br><sub>`home:phone.needsOne`</sub> | 1 thing needs you | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| H61<br>DRAFT | Alerts (laptop, phone); Home (laptop); Try-again dialog; and 2 more screens<br><sub>`home:phone.needsMany`</sub> | 3 things need you | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| H62<br>DRAFT | Home<br><sub>`home:phone.headsUpOne`</sub> | 1 heads-up *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| H63<br>DRAFT | Home (phone)<br><sub>`home:phone.headsUpMany`</sub> | See 2 heads-ups | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| H64<br>DRAFT | Home (phone)<br><sub>`home:phone.nothing`</sub> | Nothing needs you right now. *(only in the Nothing needs you account)* | 0.5 | Nothing needs you: same<br>Brand-new: same | — | Changed by approved rewrite 10 (Phase 2). |
| H65<br>DRAFT | Home<br><sub>`home:phone.seeHeadsUpOne`</sub> | See 1 heads-up *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| H66<br>DRAFT | Home (phone)<br><sub>`home:phone.seeHeadsUpMany`</sub> | See 2 heads-ups | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| H67<br>DRAFT | Alerts (laptop, phone); Home (laptop); Try-again dialog; and 2 more screens<br><sub>`home:phone.fyiTitle`</sub> | Just so you know | -2.2 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H68<br>DRAFT | Home<br><sub>`home:phone.seen`</sub> | Seen *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| H69<br>DRAFT | Home (phone)<br><sub>`home:phone.whyTitle`</sub> | Why it moved this week | -1.8 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H70<br>DRAFT | Home (phone)<br><sub>`home:phone.whyShort`</sub> | The market: down $10.99. Dividends: no change. | label | Nothing needs you: “The market: down $18.02. Dividends: no change.”<br>Brand-new: not shown | The market: {market}. No dividends this week. (when there are none) | "Dividends: no change." reads as if dividends could go up or down. Phase 2 suggested "Dividends paid you {dividends}"; this adds the no-dividend version. |
| H71<br>DRAFT | Home (phone)<br><sub>`home:phone.byFundTitle`</sub> | Each investment's part | label | Nothing needs you: same<br>Brand-new: not shown | Approve as shown | New: "The market, investment by investment" scored grade 10.0, so it is shortened to a label. |
| H72<br>DRAFT | Home<br><sub>`home:phone.fundMoveUp`</sub> | AAPL moved down $10.99 this week. Price changes across everything you own added up to a $150 rise. *(not on a captured screen; example values)* | 3.7 | Not on a captured screen; the values change with the account | — | Changed by approved rewrite 3 (Phase 2). The ending "a $X rise" is new; see the recommended rewrites. |
| H73<br>DRAFT | Home<br><sub>`home:phone.fundMoveDown`</sub> | AAPL moved down $10.99 this week. Price changes across everything you own added up to a $150 drop. *(not on a captured screen; example values)* | 3.7 | Not on a captured screen; the values change with the account | Approve as shown: "…added up to a $10.99 drop." | Rewrite 3 approved the opening "Price changes across everything you own added up to…". Filled with the change word, it read "added up to down $10.99", so it ends with "a $10.99 drop" (or "rise"). Needs your OK. |
| H74<br>DRAFT | Home (phone)<br><sub>`home:phone.someDown`</sub> | Some of your investments went down this week. Ups and downs are normal. | 1.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H75<br>DRAFT | Home (phone)<br><sub>`home:phone.seeFunds`</sub> | See your investments | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H76<br>DRAFT | Home (phone)<br><sub>`home:phone.latest`</sub> | Latest | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H77<br>DRAFT | Home<br><sub>`home:phone.latestStatus`</sub> |  · Pending *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| H78<br>DRAFT | Home (phone)<br><sub>`home:phone.seeActivity`</sub> | See all activity | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H79<br>DRAFT | Home (phone)<br><sub>`home:phone.wordOfTheDay`</sub> | Word of the day | -2.2 | Nothing needs you: same<br>Brand-new: same | — |  |
| H80<br>DRAFT | Home (phone)<br><sub>`home:phone.readMore`</sub> | Read more | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H81<br>DRAFT | Home (phone); Your money story (laptop, phone)<br><sub>`home:phone.readMoreAbout`</sub> | about Ups and downs *(and 2 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H82<br>DRAFT | Home (phone)<br><sub>`home:phone.nextWord`</sub> | Next word | label | Nothing needs you: same<br>Brand-new: same | — |  |

### Alerts

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| L1<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Try-again dialog; and 2 more screens<br><sub>`shared:severity.needs-you`</sub> | Needs you | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L2<br>DRAFT | Alerts (laptop, phone); Home (laptop); Try-again dialog; and 2 more screens<br><sub>`shared:severity.heads-up`</sub> | Heads-up | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L3<br>DRAFT | Alerts (laptop, phone); Home (laptop); Try-again dialog; and 2 more screens<br><sub>`shared:severity.fyi`</sub> | FYI | label | Nothing needs you: same<br>Brand-new: not shown | Good to know | "FYI" is an abbreviation, and its section is called "Just so you know". One name for one idea. |
| L4<br>DRAFT | Alerts (laptop, phone); Home (laptop); Try-again dialog; and 2 more screens<br><sub>`shared:alerts.title`</sub> | Needs your attention | label | Nothing needs you: same<br>Brand-new: same | — |  |
| L5<br>DRAFT | Alerts<br><sub>`shared:alerts.countOne`</sub> | 1 thing needs you. *(not on a captured screen; example values)* | label | Same words wherever it shows | — | Changed by approved rewrite 10 (Phase 2). |
| L6<br>DRAFT | Alerts (laptop, phone); Home (laptop); Try-again dialog; and 2 more screens<br><sub>`shared:alerts.countMany`</sub> | 3 things need you. | label | Nothing needs you: not shown<br>Brand-new: not shown | — | Changed by approved rewrite 10 (Phase 2). |
| L7<br>DRAFT | Alerts<br><sub>`shared:alerts.allHandled`</sub> | You have handled everything for this week. *(not on a captured screen; example values)* | 4.0 | Same words wherever it shows | — |  |
| L8<br>DRAFT | Home (phone)<br><sub>`shared:alerts.nothing`</sub> | Nothing needs you right now. *(only in the Nothing needs you account)* | 0.5 | Nothing needs you: same<br>Brand-new: same | — | Changed by approved rewrite 10 (Phase 2). |
| L9<br>DRAFT | Alerts (laptop, phone); Home (laptop); Try-again dialog; and 2 more screens<br><sub>`shared:alerts.fyiTitle`</sub> | Just so you know | -2.2 | Nothing needs you: same<br>Brand-new: not shown | Good to know | Matches the badge (see the row above). |
| L10<br>DRAFT | Alerts<br><sub>`shared:alerts.new`</sub> | New *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L11<br>DRAFT | Alerts<br><sub>`shared:alerts.seen`</sub> | Seen *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L12<br>DRAFT | Alerts<br><sub>`shared:alerts.handled`</sub> | Handled (2) *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| L13<br>DRAFT | Alerts<br><sub>`shared:alerts.undo`</sub> | Undo *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L14<br>DRAFT | Alerts<br><sub>`shared:alerts.undoWhich`</sub> | : Your $150 deposit from Sept. 1 was sent back *(a bare value; example values)* | 5.0 | Not on a captured screen; the values change with the account | — |  |
| L15<br>DRAFT | Alerts<br><sub>`shared:alerts.undone`</sub> | Your $150 deposit from Sept. 1 was sent back: moved back to your alerts. *(not on a captured screen; example values)* | 5.9 | Not on a captured screen; the values change with the account | — |  |
| L16<br>DRAFT | Alerts (laptop, phone); Try-again dialog; Auto-invest dialog<br><sub>`alerts:title`</sub> | Alerts | label | Nothing needs you: same<br>Brand-new: same | — |  |
| L17<br>DRAFT | Alerts<br><sub>`alerts:detailTitle`</sub> | Alert *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L18<br>DRAFT | Alerts<br><sub>`alerts:new`</sub> | New *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L19<br>DRAFT | Alerts (laptop, phone); Try-again dialog; Auto-invest dialog<br><sub>`alerts:whatHappened`</sub> | What happened | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L20<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Try-again dialog; Auto-invest dialog<br><sub>`alerts:whatItMeans`</sub> | What it means | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L21<br>DRAFT | Alerts (laptop, phone); Try-again dialog; Auto-invest dialog<br><sub>`alerts:whatYouCanDo`</sub> | What you can do | -2.2 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L22<br>DRAFT | Alerts<br><sub>`alerts:termLine`</sub> | Ups and downs: How much an investment's price tends to jump around. *(a bare value; example values)* | 3.7 | Not on a captured screen; the values change with the account | — |  |
| L23<br>DRAFT | Alerts (laptop, phone); Try-again dialog; Auto-invest dialog<br><sub>`alerts:markHandled`</sub> | Mark as handled | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L24<br>DRAFT | Alerts<br><sub>`alerts:handled`</sub> | Handled *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L25<br>DRAFT | Alerts<br><sub>`alerts:undo`</sub> | Undo *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L26<br>DRAFT | Alerts<br><sub>`alerts:markedStatus`</sub> | Marked as handled. *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L27<br>DRAFT | Alerts<br><sub>`alerts:undoneStatus`</sub> | Moved back to your alerts. *(not on a captured screen; example values)* | 0.5 | Same words wherever it shows | — |  |
| L28<br>DRAFT | Alerts (laptop, phone)<br><sub>`alerts:notFound`</sub> | We could not find that alert. | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| L29<br>DRAFT | Alerts (laptop, phone)<br><sub>`alerts:notFoundWhy`</sub> | It may have been for another account, or it no longer applies. | 5.8 | Nothing needs you: same<br>Brand-new: same | — |  |
| L30<br>DRAFT | Alerts (laptop)<br><sub>`alerts:choose`</sub> | Choose an alert to read it here. | 0.6 | Nothing needs you: same<br>Brand-new: same | — |  |
| L31<br>DRAFT | Alerts (phone)<br><sub>`alerts:allAlerts`</sub> | All alerts | label | Nothing needs you: same<br>Brand-new: same | — |  |
| L32<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Your money story (laptop, phone); and 2 more screens<br><sub>`alerts:facts.amount`</sub> | Amount | label | Nothing needs you: same<br>Brand-new: same | — |  |
| L33<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Try-again dialog<br><sub>`alerts:facts.askedOn`</sub> | Asked for on | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L34<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Try-again dialog<br><sub>`alerts:facts.sentBackOn`</sub> | Sent back on | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L35<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Try-again dialog<br><sub>`alerts:facts.status`</sub> | Status | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L36<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Try-again dialog<br><sub>`alerts:facts.returned`</sub> | Returned | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L37<br>DRAFT | Alerts (laptop, phone)<br><sub>`alerts:facts.planByNow`</sub> | Your plan by now | -2.2 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L38<br>DRAFT | Alerts (laptop, phone)<br><sub>`alerts:facts.putInSoFar`</sub> | Put in so far | -2.2 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L39<br>DRAFT | Alerts (laptop, phone)<br><sub>`alerts:facts.behindBy`</sub> | Behind by | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L40<br>DRAFT | Alerts (laptop, phone); Your money story (laptop, phone); Home (laptop); and 2 more screens<br><sub>`alerts:facts.cash`</sub> | Cash | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L41<br>DRAFT | Alerts (laptop, phone); Auto-invest dialog<br><sub>`alerts:facts.waitingSince`</sub> | Waiting since | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L42<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Words (laptop, phone); and 3 more screens<br><sub>`alerts:facts.autoInvest`</sub> | Auto-invest | label | Nothing needs you: same<br>Brand-new: same | — |  |
| L43<br>DRAFT | Alerts<br><sub>`alerts:facts.on`</sub> | On *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L44<br>DRAFT | Auto-invest dialog<br><sub>`alerts:facts.off`</sub> | Off | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L45<br>DRAFT | Alerts (laptop, phone); Home (laptop); Auto-invest dialog; Word explanation<br><sub>`alerts:facts.pausedSince`</sub> | Paused since May 27 *(and 1 more like it)* | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L46<br>DRAFT | Activity (laptop, phone); Home (laptop); Investments (laptop); Practice (after buying)<br><sub>`alerts:facts.fund`</sub> | Investment | label | Nothing needs you: same<br>Brand-new: same | — |  |
| L47<br>DRAFT | Activity (laptop, phone)<br><sub>`alerts:facts.paidOn`</sub> | Paid on | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L48<br>DRAFT | Alerts<br><sub>`alerts:facts.priceOn`</sub> | Price on Sept. 18 *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| L49<br>DRAFT | Alerts<br><sub>`alerts:facts.move`</sub> | Price move *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L50<br>DRAFT | Alerts<br><sub>`alerts:facts.moveValue`</sub> | up 52% *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| L51<br>DRAFT | Alerts<br><sub>`alerts:facts.up`</sub> | up *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L52<br>DRAFT | Alerts<br><sub>`alerts:facts.down`</sub> | down *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L53<br>DRAFT | Alerts<br><sub>`alerts:facts.yourChange`</sub> | What you own in it *(not on a captured screen; example values)* | -1.8 | Same words wherever it shows | — |  |
| L54<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Try-again dialog; and 2 more screens<br><sub>`data:attention.deposit-returned.title`</sub> | Your $150 deposit from Sept. 1 was sent back | 5.0 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L55<br>DRAFT | Alerts (laptop, phone); Try-again dialog<br><sub>`data:attention.deposit-returned.body`</sub> | Your bank sent it back on Sept. 3, so the money never reached First Leaf. Your investments were not touched. | 3.1 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L56<br>DRAFT | Alerts (laptop, phone); Try-again dialog<br><sub>`data:attention.deposit-returned.nextStep`</sub> | Check your bank account first. Then you can try the deposit again. | 2.5 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L57<br>DRAFT | Alerts (laptop, phone); Try-again dialog<br><sub>`data:attention.deposit-returned.action.label`</sub> | Try the deposit again | 6.6 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L58<br>DRAFT | Alerts (laptop, phone); Home (laptop); Try-again dialog; and 2 more screens<br><sub>`data:attention.goal-behind.title`</sub> | Your goal is $150 behind your plan | 2.3 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L59<br>DRAFT | Alerts (laptop, phone)<br><sub>`data:attention.goal-behind.body`</sub> | You planned to put in $1,400 by now. So far $1,250 went through. This only counts deposits, not the market. | 2.4 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L60<br>DRAFT | Alerts (laptop, phone)<br><sub>`data:attention.goal-behind.nextStep`</sub> | You can add a one-time deposit to catch up, or keep going as planned. Either is fine. | 2.3 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L61<br>DRAFT | Alerts (laptop, phone)<br><sub>`data:attention.goal-behind.action.label`</sub> | Add a one-time deposit | 6.6 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L62<br>DRAFT | Alerts (laptop, phone); Home (laptop); Try-again dialog; and 2 more screens<br><sub>`data:attention.cash-sitting.title`</sub> | $452.11 is waiting in cash | 2.9 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L63<br>DRAFT | Alerts (laptop, phone); Auto-invest dialog<br><sub>`data:attention.cash-sitting.body`</sub> | Auto-invest has been paused since May 27, so deposits since then stay as cash. Cash does not go up or down with the market. | 4.3 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L64<br>DRAFT | Alerts (laptop, phone); Auto-invest dialog<br><sub>`data:attention.cash-sitting.nextStep`</sub> | It is your choice. You can turn auto-invest back on, or leave it paused. | 1.5 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L65<br>DRAFT | Alerts (laptop, phone); Auto-invest dialog<br><sub>`data:attention.cash-sitting.action.label`</sub> | See auto-invest settings | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L66<br>DRAFT | Alerts (laptop, phone); Home (laptop); Try-again dialog; and 2 more screens<br><sub>`data:attention.sipc-crypto.title`</sub> | Crypto is not covered by SIPC protection | 5.7 | Nothing needs you: same<br>Brand-new: not shown | Approve as shown | New account notice (the "regulatory alerts" example). Worded from sipc.org. It says what SIPC covers without claiming First Leaf is a member firm; you may want that stated or avoided. |
| L67<br>DRAFT | Alerts (laptop, phone)<br><sub>`data:attention.sipc-crypto.body`</sub> | SIPC protection helps get back the stocks and cash in a brokerage account if the firm fails. It does not cover crypto, like your Bitcoin and Ethereum. | 5.8 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L68<br>DRAFT | Alerts (laptop, phone)<br><sub>`data:attention.sipc-crypto.nextStep`</sub> | Nothing to do. This is just so you know. | -0.7 | Nothing needs you: same<br>Brand-new: not shown | — |  |

### Money actions (deposit and auto-invest)

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| M1<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:deposit.confirmation`</sub> | Your deposit is on its way. It should arrive in 1 to 3 business days. *(not on a captured screen; example values)* | 4.6 | Same words wherever it shows | — |  |
| M2<br>DRAFT | Try-again dialog<br><sub>`shared:moneyFlow.titleRetry`</sub> | Try your deposit again | 6.6 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M3<br>DRAFT | Alerts (laptop, phone)<br><sub>`shared:moneyFlow.titleOneTime`</sub> | Add a one-time deposit | 6.6 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M4<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Words (laptop, phone); and 3 more screens<br><sub>`shared:moneyFlow.titleAutoInvest`</sub> | Auto-invest | label | Nothing needs you: same<br>Brand-new: same | — |  |
| M5<br>DRAFT | Try-again dialog<br><sub>`shared:moneyFlow.checkAmount`</sub> | Check the amount, then continue. | 5.2 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M6<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Your money story (laptop, phone); and 2 more screens<br><sub>`shared:moneyFlow.amount`</sub> | Amount | label | Nothing needs you: same<br>Brand-new: same | — |  |
| M7<br>DRAFT | Practice (laptop); Practice (error)<br><sub>`shared:moneyFlow.amountLabel`</sub> | Amount in dollars | label | Nothing needs you: same<br>Brand-new: same | — |  |
| M8<br>DRAFT | Try-again dialog<br><sub>`shared:moneyFlow.from`</sub> | From | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M9<br>DRAFT | Try-again dialog<br><sub>`shared:moneyFlow.fromValue`</sub> | Your bank account | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M10<br>DRAFT | Try-again dialog<br><sub>`shared:moneyFlow.to`</sub> | To | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M11<br>DRAFT | Try-again dialog<br><sub>`shared:moneyFlow.toValue`</sub> | Your First Leaf account | 0.7 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M12<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.amountError`</sub> | Enter an amount from $1 to $10,000, with no more than 2 decimals. *(not on a captured screen; example values)* | 7.6 | Same words wherever it shows | — |  |
| M13<br>DRAFT | Home (phone); Try-again dialog<br><sub>`shared:moneyFlow.timing`</sub> | It should arrive in 1 to 3 business days. | 6.3 | Nothing needs you: not shown<br>Brand-new: same | — | Changed by approved rewrite 5 (Phase 2). |
| M14<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.confirmDeposit`</sub> | You are about to ask your bank for a $150 deposit. It should arrive in 1 to 3 business days. *(not on a captured screen; example values)* | 5.4 | Not on a captured screen; the values change with the account | — | Changed by approved rewrite 5 (Phase 2). |
| M15<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.seeInActivity`</sub> | You can see it as Pending in Activity. *(not on a captured screen; example values)* | 5.2 | Same words wherever it shows | — |  |
| M16<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.autoOnNow`</sub> | Auto-invest is on. Each deposit buys your mix on the day it arrives. *(not on a captured screen; example values)* | 4.2 | Same words wherever it shows | — |  |
| M17<br>DRAFT | Auto-invest dialog<br><sub>`shared:moneyFlow.autoPausedSince`</sub> | Auto-invest is paused. It has been off since May 27. | 2.9 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M18<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.autoOff`</sub> | Auto-invest is off. *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| M19<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Words (laptop, phone); and 3 more screens<br><sub>`shared:moneyFlow.switchLabel`</sub> | Auto-invest | label | Nothing needs you: same<br>Brand-new: same | — |  |
| M20<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.on`</sub> | On *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| M21<br>DRAFT | Auto-invest dialog<br><sub>`shared:moneyFlow.off`</sub> | Off | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M22<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.confirmOn`</sub> | Turn on auto-invest? From now on, each deposit will buy your mix on the day it arrives. The $452.11 already in cash stays as cash. *(not on a captured screen; example values)* | 3.7 | Not on a captured screen; the values change with the account | — |  |
| M23<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.confirmOff`</sub> | Pause auto-invest? New deposits will stay as cash until you turn it back on. *(not on a captured screen; example values)* | 4.0 | Same words wherever it shows | — |  |
| M24<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.doneOn`</sub> | Auto-invest is on. *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| M25<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.donePaused`</sub> | Auto-invest is paused. *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| M26<br>DRAFT | Try-again dialog; Auto-invest dialog<br><sub>`shared:moneyFlow.cancel`</sub> | Cancel | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M27<br>DRAFT | Try-again dialog; Auto-invest dialog<br><sub>`shared:moneyFlow.continue`</sub> | Continue | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M28<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.back`</sub> | Back *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| M29<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.confirmDepositButton`</sub> | Confirm deposit *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| M30<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.turnOn`</sub> | Turn on *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| M31<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.pause`</sub> | Pause *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| M32<br>DRAFT | Money actions (deposit and auto-invest)<br><sub>`shared:moneyFlow.done`</sub> | Done *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |

### Activity

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| V1<br>DRAFT | Activity<br><sub>`shared:activity.oneTimeDeposit`</sub> | One-time deposit *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| V2<br>DRAFT | Activity<br><sub>`shared:activity.retriedDeposit`</sub> | Deposit, tried again *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| V3<br>DRAFT | Activity (laptop, phone)<br><sub>`shared:activity.firstDeposit`</sub> | First deposit | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V4<br>DRAFT | Activity (laptop, phone)<br><sub>`shared:activity.monthlyDeposit`</sub> | Monthly deposit | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V5<br>DRAFT | Activity (laptop, phone)<br><sub>`shared:activity.bought`</sub> | Bought ETH *(and 13 more like it)* | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V6<br>DRAFT | Home (phone); Activity (laptop, phone)<br><sub>`shared:activity.dividend`</sub> | MSFT paid you *(and 20 more like it)* | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V7<br>DRAFT | Activity (laptop, phone)<br><sub>`shared:activity.status.completed`</sub> | Completed | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V8<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Try-again dialog<br><sub>`shared:activity.status.returned`</sub> | Returned | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V9<br>DRAFT | Activity (laptop)<br><sub>`shared:activity.status.pending`</sub> | Pending | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V10<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`activity:title`</sub> | Activity | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V11<br>DRAFT | Activity<br><sub>`activity:detailTitle`</sub> | Activity item *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| V12<br>DRAFT | Activity (phone)<br><sub>`activity:empty`</sub> | Nothing yet. Your deposits, buys and dividends will show here. *(only in the brand-new account)* | 4.1 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| V13<br>DRAFT | Activity (phone)<br><sub>`activity:filterSummary`</sub> | Type: All. Status: All. | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V14<br>DRAFT | Activity (phone)<br><sub>`activity:filters`</sub> | Filters | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V15<br>DRAFT | Activity (laptop)<br><sub>`activity:type`</sub> | Type | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V16<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Try-again dialog<br><sub>`activity:status`</sub> | Status | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V17<br>DRAFT | Activity<br><sub>`activity:showOne`</sub> | Show 1 item *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| V18<br>DRAFT | Activity<br><sub>`activity:showMany`</sub> | Show 2 items *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| V19<br>DRAFT | Activity (laptop, phone)<br><sub>`activity:count`</sub> | Showing 36 of 36. | label | Nothing needs you: “Showing 64 of 64.”<br>Brand-new: not shown | — |  |
| V20<br>DRAFT | Activity<br><sub>`activity:none`</sub> | Nothing matches these filters. *(not on a captured screen; example values)* | 3.7 | Same words wherever it shows | — |  |
| V21<br>DRAFT | Activity<br><sub>`activity:showEverything`</sub> | Show everything *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| V22<br>DRAFT | Activity<br><sub>`activity:rowStatus`</sub> |  · Pending *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| V23<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`activity:tableLabel`</sub> | Activity | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V24<br>DRAFT | Activity (laptop)<br><sub>`activity:caption`</sub> | Activity, newest first | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V25<br>DRAFT | Home (laptop, phone); Investments (laptop, phone); Your money story (laptop, phone); Activity (laptop)<br><sub>`activity:col.date`</sub> | Date | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V26<br>DRAFT | Activity (laptop)<br><sub>`activity:col.what`</sub> | What | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V27<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Your money story (laptop, phone); and 2 more screens<br><sub>`activity:col.amount`</sub> | Amount | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V28<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Try-again dialog<br><sub>`activity:col.status`</sub> | Status | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V29<br>DRAFT | Your money story (laptop, phone); Activity (laptop)<br><sub>`activity:types.all`</sub> | All | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V30<br>DRAFT | Home (laptop, phone); Activity (laptop); Word explanation<br><sub>`activity:types.deposit`</sub> | Deposits | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V31<br>DRAFT | Activity (laptop)<br><sub>`activity:types.buy`</sub> | Buys | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V32<br>DRAFT | Home (laptop, phone); Investments (laptop, phone); Activity (laptop); Word explanation<br><sub>`activity:types.dividend`</sub> | Dividends | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V33<br>DRAFT | Your money story (laptop, phone); Activity (laptop)<br><sub>`activity:statuses.all`</sub> | All | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V34<br>DRAFT | Activity (laptop, phone)<br><sub>`activity:statuses.completed`</sub> | Completed | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V35<br>DRAFT | Activity (laptop)<br><sub>`activity:statuses.pending`</sub> | Pending | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V36<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Try-again dialog<br><sub>`activity:statuses.returned`</sub> | Returned | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V37<br>DRAFT | Activity (laptop, phone)<br><sub>`activity:allActivity`</sub> | All activity | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V38<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Your money story (laptop, phone); and 2 more screens<br><sub>`activity:facts.amount`</sub> | Amount | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V39<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Try-again dialog<br><sub>`activity:facts.status`</sub> | Status | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V40<br>DRAFT | Activity<br><sub>`activity:facts.requestedOn`</sub> | Requested on *(not on a captured screen; example values)* | label | Same words wherever it shows | Asked for on | Every other deposit, and the alert, say "Asked for on". One word per idea. |
| V41<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Try-again dialog<br><sub>`activity:facts.askedOn`</sub> | Asked for on | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| V42<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Try-again dialog<br><sub>`activity:facts.sentBackOn`</sub> | Sent back on | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| V43<br>DRAFT | Activity<br><sub>`activity:facts.arrivedOn`</sub> | Arrived on *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| V44<br>DRAFT | Activity (laptop, phone); Home (laptop); Investments (laptop); Practice (after buying)<br><sub>`activity:facts.fund`</sub> | Investment | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V45<br>DRAFT | Activity<br><sub>`activity:facts.fundValue`</sub> | AAPL, Rosa *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| V46<br>DRAFT | Activity (laptop, phone)<br><sub>`activity:facts.boughtOn`</sub> | Bought on | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| V47<br>DRAFT | Activity (laptop, phone); Investments (laptop, phone)<br><sub>`activity:facts.price`</sub> | Price | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V48<br>DRAFT | Activity (laptop, phone); Investments (laptop, phone); Practice (after buying)<br><sub>`activity:facts.shares`</sub> | Shares | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V49<br>DRAFT | Activity (laptop, phone)<br><sub>`activity:facts.settledOn`</sub> | Settled on | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| V50<br>DRAFT | Activity (laptop, phone)<br><sub>`activity:facts.paidOn`</sub> | Paid on | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| V51<br>DRAFT | Home (phone); Try-again dialog<br><sub>`activity:pendingNote`</sub> | It should arrive in 1 to 3 business days. | 6.3 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| V52<br>DRAFT | Activity (laptop, phone)<br><sub>`activity:buyNote`</sub> | Auto-invest used your deposit to buy it. | 7.4 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| V53<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Try-again dialog; Auto-invest dialog<br><sub>`activity:whatItMeans`</sub> | What it means | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V54<br>DRAFT | Activity<br><sub>`activity:termLine`</sub> | Ups and downs: How much an investment's price tends to jump around. *(a bare value; example values)* | 3.7 | Not on a captured screen; the values change with the account | — |  |
| V55<br>DRAFT | Activity (phone)<br><sub>`activity:notFound`</sub> | We could not find that item. *(only in the Nothing needs you account)* | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| V56<br>DRAFT | Activity (phone)<br><sub>`activity:notFoundWhy`</sub> | It may have been for another account. *(only in the Nothing needs you account)* | 4.0 | Nothing needs you: same<br>Brand-new: same | — |  |

### Investments

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| F1<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:title`</sub> | Your investments | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F2<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:tableLabel`</sub> | Your investments | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F3<br>DRAFT | Investments (laptop)<br><sub>`funds:caption`</sub> | All investments, with what you have in each | 2.3 | Nothing needs you: same<br>Brand-new: same | — |  |
| F4<br>DRAFT | Activity (laptop, phone); Home (laptop); Investments (laptop); Practice (after buying)<br><sub>`funds:col.fund`</sub> | Investment | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F5<br>DRAFT | Investments (laptop)<br><sub>`funds:col.kind`</sub> | Kind | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F6<br>DRAFT | Home (phone); Investments (laptop, phone); Words (laptop, phone)<br><sub>`funds:col.ups`</sub> | Ups and downs | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F7<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:col.value`</sub> | Your value | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F8<br>DRAFT | Your money story (laptop, phone); Words (laptop, phone); Investments (laptop); Practice (after buying)<br><sub>`funds:col.change`</sub> | Up or down | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F9<br>DRAFT | Investments (laptop, phone); Words (laptop, phone)<br><sub>`funds:kind.stock`</sub> | Stock | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F10<br>DRAFT | Alerts (laptop, phone); Investments (laptop, phone); Your money story (laptop, phone); Words (laptop, phone)<br><sub>`funds:kind.crypto`</sub> | Crypto | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F11<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:upsValue`</sub> | Ups and downs: 2 of 5 *(and 34 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F12<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:notOwned`</sub> | Not owned | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F13<br>DRAFT | Investments (phone)<br><sub>`funds:cardValue`</sub> | Your value: $246.92 · up $46.92 *(and 6 more like it)* | label | Nothing needs you: “Your value: $400.84 · up $50.84”<br>Brand-new: not shown | — |  |
| F14<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:allFunds`</sub> | All investments | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F15<br>DRAFT | Investments<br><sub>`funds:nameLine`</sub> | Stock *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| F16<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:whatYouHave`</sub> | What you have | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F17<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:vsPaid`</sub> | Up $46.92 on the $200.00 you paid. *(and 6 more like it)* | label | Nothing needs you: “Up $50.84 on the $350.00 you paid.”<br>Brand-new: not shown | — |  |
| F18<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:facts.value`</sub> | Your value | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F19<br>DRAFT | Investments (laptop, phone); Words (laptop, phone)<br><sub>`funds:facts.paid`</sub> | What you paid | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F20<br>DRAFT | Activity (laptop, phone); Investments (laptop, phone); Practice (after buying)<br><sub>`funds:facts.shares`</sub> | Shares | label | Nothing needs you: same<br>Brand-new: not shown | For crypto: "How much you own" | "Shares" of Bitcoin reads oddly (0.00136690 shares). Stocks keep "Shares"; crypto could say "How much you own". |
| F21<br>DRAFT | Activity (laptop, phone); Investments (laptop, phone)<br><sub>`funds:facts.price`</sub> | Price | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F22<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:notOwnedYet`</sub> | You don't own any yet. | -1.8 | Nothing needs you: same<br>Brand-new: same | — |  |
| F23<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:priceNow`</sub> | Price: $253.71 a share. *(and 2 more like it)* | label | Nothing needs you: same<br>Brand-new: “Price: $336.13 a share.” | — |  |
| F24<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:chart.title`</sub> | Price over time | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F25<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:chart.summary`</sub> | From March 2, 2026 to Sept. 18, 2026, the price went from $264.72 to $336.13. *(and 9 more like it)* | 6.8 | Nothing needs you: same<br>Brand-new: “From Sept. 19, 2025 to Sept. 18, 2026, the price went from $245.50 to $336.13.” | — |  |
| F26<br>DRAFT | Activity (laptop, phone); Investments (laptop, phone)<br><sub>`funds:chart.series`</sub> | Price | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F27<br>DRAFT | Investments<br><sub>`funds:chart.day`</sub> | Sept. 18: price $336.13. *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| F28<br>DRAFT | Home (laptop, phone); Investments (laptop, phone); Your money story (laptop, phone); Activity (laptop)<br><sub>`funds:chart.colDate`</sub> | Date | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F29<br>DRAFT | Activity (laptop, phone); Investments (laptop, phone)<br><sub>`funds:chart.colPrice`</sub> | Price | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F30<br>DRAFT | Investments (laptop, phone); Your money story (laptop, phone); Home (laptop); Word explanation<br><sub>`funds:chart.range`</sub> | Time range | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F31<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:chart.since`</sub> | Since you bought | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| F32<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:chart.6m`</sub> | 6 months | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F33<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:chart.1y`</sub> | 1 year | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F34<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:about.heading`</sub> | What it is | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F35<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:ups.heading`</sub> | Ups and downs: 2 of 5 *(and 4 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F36<br>DRAFT | Home (phone); Investments (laptop, phone); Words (laptop, phone)<br><sub>`funds:ups.termWord`</sub> | Ups and downs | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F37<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:ups.scale`</sub> | 1 means its price barely moves. 5 means it moves the most. | 2.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| F38<br>DRAFT | Home (laptop, phone); Investments (laptop, phone); Activity (laptop); Word explanation<br><sub>`funds:dividends.heading`</sub> | Dividends | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F39<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:dividends.intro`</sub> | Apple pays a dividend for each share you own before its ex-dividend date. *(and 4 more like it)* | 6.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| F40<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:dividends.dividendWord`</sub> | dividend | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F41<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:dividends.paid`</sub> | $0.26 a share, paid Nov. 13, 2025 *(and 17 more like it)* | 4.0 | Nothing needs you: same<br>Brand-new: same | — |  |
| F42<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:dividends.upcoming`</sub> | $0.25 a share, to be paid Oct. 1, 2026 *(and 1 more like it)* | 3.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| F43<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:dividends.yours`</sub> | You got $0.40 in dividends from it. *(and 4 more like it)* | 4.0 | Nothing needs you: “You got $0.49 in dividends from it.”<br>Brand-new: not shown | — |  |
| F44<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:dividends.none`</sub> | It does not pay dividends. | 2.9 | Nothing needs you: same<br>Brand-new: same | — |  |
| F45<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:sipc.heading`</sub> | Not covered by SIPC protection | 5.2 | Nothing needs you: same<br>Brand-new: same | — |  |
| F46<br>DRAFT | Alerts (laptop, phone); Investments (laptop, phone); Words (laptop, phone)<br><sub>`funds:sipc.termWord`</sub> | SIPC protection | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F47<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:sipc.body`</sub> | SIPC protection helps get back stocks and cash if a brokerage firm fails. It does not cover crypto. | 3.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| F48<br>DRAFT | Investments<br><sub>`funds:notFound`</sub> | We could not find that investment. *(not on a captured screen; example values)* | 2.5 | Same words wherever it shows | — |  |
| F49<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.AAPL.name`</sub> | Apple | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F50<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.AAPL.about`</sub> | Apple makes the iPhone, the Mac and the iPad. It also sells apps, music and other services. | 4.4 | Nothing needs you: same<br>Brand-new: same | Approve all ten | New one-line descriptions for the ten investments ("What it is"). Plain facts about each company or coin, no opinions. |
| F51<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.MSFT.name`</sub> | Microsoft | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F52<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.MSFT.about`</sub> | Microsoft makes Windows and Office. It also runs a big cloud, where people rent its computers. | 5.2 | Nothing needs you: same<br>Brand-new: same | — |  |
| F53<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.NVDA.name`</sub> | NVIDIA | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F54<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.NVDA.about`</sub> | NVIDIA designs computer chips. They run video games and AI. | 4.1 | Nothing needs you: same<br>Brand-new: same | — |  |
| F55<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.COST.name`</sub> | Costco | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F56<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.COST.about`</sub> | Costco runs big warehouse stores. Members pay a yearly fee to shop there and buy in bulk. | 3.0 | Nothing needs you: same<br>Brand-new: same | — |  |
| F57<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.NKE.name`</sub> | Nike | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F58<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.NKE.about`</sub> | Nike makes and sells sports shoes, clothes and gear. | -0.3 | Nothing needs you: same<br>Brand-new: same | — |  |
| F59<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.AMZN.name`</sub> | Amazon | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F60<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.AMZN.about`</sub> | Amazon runs a huge online store. It also rents out computer power over the internet. | 7.0 | Nothing needs you: same<br>Brand-new: same | — |  |
| F61<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.TSLA.name`</sub> | Tesla | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F62<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.TSLA.about`</sub> | Tesla makes electric cars. It also makes big batteries for homes. | 4.8 | Nothing needs you: same<br>Brand-new: same | — |  |
| F63<br>DRAFT | Investments (laptop, phone); Words (laptop, phone)<br><sub>`data:funds.BTC.name`</sub> | Bitcoin | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F64<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.BTC.about`</sub> | Bitcoin is a digital currency. No company or bank runs it. | 5.9 | Nothing needs you: same<br>Brand-new: same | — |  |
| F65<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.ETH.name`</sub> | Ethereum | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F66<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.ETH.about`</sub> | Ethereum is a digital currency. It also runs small programs on its own network. | 6.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| F67<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.SOL.name`</sub> | Solana | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F68<br>DRAFT | Investments (laptop, phone)<br><sub>`data:funds.SOL.about`</sub> | Solana is a digital currency. It also runs small programs on its own network. | 6.5 | Nothing needs you: same<br>Brand-new: same | — |  |

### Your money story

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| S1<br>DRAFT | Your money story (laptop, phone); Home (laptop); Alerts (laptop); and 12 more screens<br><sub>`story:title`</sub> | Your money story | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S2<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:chapters`</sub> | Chapters | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S3<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:chapterNum`</sub> | Chapter 1 *(and 5 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S4<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:titles.1`</sub> | Six months in | label | Nothing needs you: same<br>Brand-new: not shown | — | Changed by approved rewrite 4 (Phase 2). |
| S5<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:titles.2`</sub> | Most of it is still your money | 0.6 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S6<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:titles.3`</sub> | The dip in May | -2.2 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S7<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:titles.4`</sub> | Where it is now | -2.2 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S8<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:titles.5`</sub> | What happens if you keep going | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| S9<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:titles.6`</sub> | Try it with practice money | 2.9 | Nothing needs you: same<br>Brand-new: same | — | Changed by approved rewrite 6 (Phase 2). |
| S10<br>DRAFT | Your money story (phone)<br><sub>`story:titles.new`</sub> | Your story starts with your first deposit *(only in the brand-new account)* | 4.0 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| S11<br>DRAFT | Your money story (phone)<br><sub>`story:newClaim`</sub> | Once your first deposit arrives, this story will show how your money has moved. *(only in the brand-new account)* | 5.9 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| S12<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:sinceMarch.chartTitle`</sub> | Your balance since March | 0.7 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S13<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:sinceMarch.summary`</sub> | From March 2 to Sept. 18, your balance went from $499.88 to $1,336.80. | 5.8 | Nothing needs you: “From March 2 to Sept. 18, your balance went from $499.88 to $1,519.67.”<br>Brand-new: not shown | — |  |
| S14<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:sinceMarch.layers`</sub> | Show what you put in and what it earned | -0.3 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S15<br>DRAFT | Home (laptop, phone); Investments (laptop, phone); Your money story (laptop, phone); Activity (laptop)<br><sub>`story:sinceMarch.colDate`</sub> | Date | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S16<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone); Words (laptop, phone); Word explanation<br><sub>`story:sinceMarch.colBalance`</sub> | Balance | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S17<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone); Word explanation<br><sub>`story:sinceMarch.colMoneyIn`</sub> | You put in | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S18<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone)<br><sub>`story:sinceMarch.colEarned`</sub> | It earned | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S19<br>DRAFT | Your money story<br><sub>`story:share.readIn`</sub> | $150 of your balance is money you put in. That is 52%. *(not on a captured screen; example values)* | 2.5 | Not on a captured screen; the values change with the account | — |  |
| S20<br>DRAFT | Your money story<br><sub>`story:share.readEarned`</sub> | $150 is what it earned. That is 52%. *(not on a captured screen; example values)* | 0.7 | Not on a captured screen; the values change with the account | — |  |
| S21<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:share.readHint`</sub> | Tap either part to read it. | 0.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S22<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:share.colPart`</sub> | Part | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S23<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Your money story (laptop, phone); and 2 more screens<br><sub>`story:share.colAmount`</sub> | Amount | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S24<br>DRAFT | Activity (laptop, phone); Investments (phone); Your money story (laptop, phone); Words (laptop, phone)<br><sub>`story:share.colShare`</sub> | Share | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S25<br>DRAFT | Your money story<br><sub>`story:share.percent`</sub> | 52% *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| S26<br>DRAFT | Alerts (laptop, phone); Your money story (laptop, phone); Words (laptop, phone)<br><sub>`story:share.partIn`</sub> | Money you put in | 0.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| S27<br>DRAFT | Your money story (laptop, phone); Home (laptop); Word explanation<br><sub>`story:share.partEarned`</sub> | What it earned | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S28<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:share.chartTitle`</sub> | Your balance, in two parts | 0.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S29<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:share.note`</sub> | What it earned is its return. It needs years to grow. | -0.6 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S30<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:share.returnWord`</sub> | return | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S31<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:dip.high`</sub> | May 11: Your investments started to fall. | 2.9 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S32<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:dip.low`</sub> | May 26: The fall hit its low. | -1.8 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S33<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:dip.paused`</sub> | May 27: You paused auto-invest. | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| S34<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:dip.backAbove`</sub> | May 28: Your balance was back above what you had put in. | 2.5 | Nothing needs you: “May 27: Your balance was back above what you had put in.”<br>Brand-new: not shown | — |  |
| S35<br>DRAFT | Your money story (phone)<br><sub>`story:dip.depositInvested`</sub> | June 1: Your deposit bought your mix. *(only in the Nothing needs you account)* | 2.9 | Nothing needs you: “June 1: Your deposit bought your mix.”<br>Brand-new: not shown | — |  |
| S36<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:dip.depositCash`</sub> | June 1: Your deposit stayed as cash. *(and 2 more like it)* | 2.9 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| S37<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:dip.summary`</sub> | Your balance from April 15 to Sept. 18, with the dip and what came after. | 6.0 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S38<br>DRAFT | Home (laptop, phone); Investments (laptop, phone); Your money story (laptop, phone); Activity (laptop)<br><sub>`story:dip.colDate`</sub> | Date | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S39<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone); Words (laptop, phone); Word explanation<br><sub>`story:dip.colBalance`</sub> | Balance | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S40<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone); Word explanation<br><sub>`story:dip.colMoneyIn`</sub> | You put in | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S41<br>DRAFT | Your money story (laptop, phone); Words (laptop, phone); Investments (laptop); Practice (after buying)<br><sub>`story:dip.colDiff`</sub> | Up or down | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S42<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:dip.chartTitle`</sub> | The dip and what came after | 0.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S43<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:dip.showEvents`</sub> | Show events on the chart | 0.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S44<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:dip.eventsLabel`</sub> | Events on the chart | 0.7 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S45<br>DRAFT | Your money story (laptop, phone); Activity (laptop)<br><sub>`story:mix.filters.all`</sub> | All | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S46<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:mix.filters.stocks`</sub> | Stocks | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S47<br>DRAFT | Alerts (laptop, phone); Investments (laptop, phone); Your money story (laptop, phone); Words (laptop, phone)<br><sub>`story:mix.filters.crypto`</sub> | Crypto | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S48<br>DRAFT | Alerts (laptop, phone); Your money story (laptop, phone); Home (laptop); and 2 more screens<br><sub>`story:mix.filters.cash`</sub> | Cash | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S49<br>DRAFT | Alerts (laptop, phone); Your money story (laptop, phone); Home (laptop); and 2 more screens<br><sub>`story:mix.cash`</sub> | Cash | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S50<br>DRAFT | Your money story<br><sub>`story:mix.summaryOne`</sub> | Your $1,336.80 is split across 1 investment. *(not on a captured screen; example values)* | 7.4 | Not on a captured screen; the values change with the account | — |  |
| S51<br>DRAFT | Your money story<br><sub>`story:mix.summaryMany`</sub> | Your $1,336.80 is split across 2 investments. *(not on a captured screen; example values)* | 7.4 | Not on a captured screen; the values change with the account | — |  |
| S52<br>DRAFT | Your money story<br><sub>`story:mix.summaryOneCash`</sub> | Your $1,336.80 is split across 2 investment and cash. *(not on a captured screen; example values)* | 6.3 | Not on a captured screen; the values change with the account | — |  |
| S53<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:mix.summaryManyCash`</sub> | Your $1,336.80 is split across 7 investments and cash. | 6.3 | Nothing needs you: “Your $1,519.67 is split across 7 investments and cash.”<br>Brand-new: not shown | — |  |
| S54<br>DRAFT | Your money story<br><sub>`story:mix.noStocks`</sub> | You do not own any stocks right now. *(not on a captured screen; example values)* | -0.7 | Same words wherever it shows | — |  |
| S55<br>DRAFT | Your money story<br><sub>`story:mix.noCrypto`</sub> | You do not own any crypto right now. *(not on a captured screen; example values)* | 0.8 | Same words wherever it shows | — |  |
| S56<br>DRAFT | Your money story<br><sub>`story:mix.stocksShare`</sub> | Stocks are $150 of your balance, or 52%. *(not on a captured screen; example values)* | 3.8 | Not on a captured screen; the values change with the account | — |  |
| S57<br>DRAFT | Your money story<br><sub>`story:mix.cryptoShare`</sub> | Crypto is $150 of your balance, or 52%. *(not on a captured screen; example values)* | 5.2 | Not on a captured screen; the values change with the account | — |  |
| S58<br>DRAFT | Your money story<br><sub>`story:mix.noCash`</sub> | You have no cash waiting right now. *(not on a captured screen; example values)* | 0.6 | Same words wherever it shows | — |  |
| S59<br>DRAFT | Your money story<br><sub>`story:mix.cashShare`</sub> | Cash is $150 of your balance, or 52%. *(not on a captured screen; example values)* | 3.8 | Not on a captured screen; the values change with the account | — |  |
| S60<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:mix.colWhere`</sub> | Where | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S61<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Your money story (laptop, phone); and 2 more screens<br><sub>`story:mix.colAmount`</sub> | Amount | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S62<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:mix.colShare`</sub> | Share of balance | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S63<br>DRAFT | Your money story<br><sub>`story:mix.percent`</sub> | 52% *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| S64<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:mix.claim`</sub> | Here is how your money is split today, as of the last prices. | 3.1 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S65<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:mix.chartTitle`</sub> | Where your money is | 0.7 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S66<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:mix.filterGroup`</sub> | Show | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S67<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:mix.rowsKey`</sub> | Each row shows the amount and its share of your balance. | 2.6 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S68<br>DRAFT | Your money story (laptop, phone); Home (laptop); Word explanation<br><sub>`story:mix.rowNums`</sub> | $246.92 · 18% *(and 29 more like it)* | label | Nothing needs you: “$400.84 · 26%”<br>Brand-new: not shown | — |  |
| S69<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:mix.words`</sub> | Words: stocks, crypto, cash. | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S70<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:mix.stocksWord`</sub> | stocks | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S71<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:mix.cashWord`</sub> | cash | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S72<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:mix.cryptoWord`</sub> | crypto | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S73<br>DRAFT | Your money story<br><sub>`story:keepGoing.gotIt`</sub> | You got it. *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| S74<br>DRAFT | Your money story<br><sub>`story:keepGoing.theoGuess`</sub> | Theo puts in more each month, so he seems like the better guess. *(not on a captured screen; example values)* | 2.2 | Same words wherever it shows | — | Changed by approved rewrite 1 (Phase 2). |
| S75<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.noGuess`</sub> | Here is how it turns out. | -1.4 | Nothing needs you: same<br>Brand-new: same | — |  |
| S76<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.nia`</sub> | Nia | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S77<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.theo`</sub> | Theo | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S78<br>DRAFT | Your money story<br><sub>`story:keepGoing.day`</sub> | Age 30: Nia has $242,251. $186,213 *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| S79<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.theoHas`</sub> | Theo has $186,213. | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S80<br>DRAFT | Your money story<br><sub>`story:keepGoing.theoNotYet`</sub> | Theo has not started yet. *(not on a captured screen; example values)* | -1.8 | Same words wherever it shows | — |  |
| S81<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.notStarted`</sub> | Not started | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S82<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.colAge`</sub> | Age | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S83<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.meet`</sub> | Meet two friends, Nia and Theo. Nia starts at 22 and puts in $100 a month. Theo waits until 32 and puts in $150 a month. | 1.9 | Nothing needs you: same<br>Brand-new: same | — |  |
| S84<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.guessHeading`</sub> | Make a guess: who has more at 65? | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| S85<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.guessLabel`</sub> | Your guess | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S86<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.result`</sub> | Here is how it turns out. At 65, Nia has $242,251. Theo has $186,213. | 0.6 | Nothing needs you: same<br>Brand-new: same | — |  |
| S87<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.friendsTitle`</sub> | Nia and Theo from 22 to 65 *(and 1 more like it)* | 2.3 | Nothing needs you: same<br>Brand-new: same | — |  |
| S88<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.whyHeading`</sub> | Why Nia ends ahead | 0.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| S89<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.why`</sub> | Nia put in $51,600. Theo put in $59,400. Most of Nia's money at 65 came from growth, not from what she put in. That is growth on growth: your money earns money, and that money earns more. | 2.0 | Nothing needs you: same<br>Brand-new: same | — |  |
| S90<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.growthWord`</sub> | growth on growth | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S91<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.everyYear`</sub> | Every year counts | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S92<br>DRAFT | Your money story<br><sub>`story:keepGoing.startAge`</sub> | Start age *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| S93<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.startAt`</sub> | Start at 18 *(and 3 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S94<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.startResult`</sub> | Start at 22. At 65 you would have $242,251. You would put in $51,600. | 1.4 | Nothing needs you: same<br>Brand-new: same | — |  |
| S95<br>DRAFT | Your money story<br><sub>`story:keepGoing.startLate`</sub> |  Starting at 30 still helps. It just has fewer years to grow. *(not on a captured screen; example values)* | 1.5 | Not on a captured screen; the values change with the account | — |  |
| S96<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.catchUpHeading`</sub> | Can Theo catch up? | -2.2 | Nothing needs you: same<br>Brand-new: same | — |  |
| S97<br>DRAFT | Your money story<br><sub>`story:keepGoing.theoMonthly`</sub> | Theo each month *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| S98<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.perMonth`</sub> | $150 a month *(and 5 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S99<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.passesMark`</sub> | Passes Nia: $196 | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S100<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.catchUp`</sub> | At $150 a month, Theo ends with $186,213. Nia ends with $242,251. | 1.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| S101<br>DRAFT | Your money story<br><sub>`story:keepGoing.passes`</sub> |  At $150 a month, Theo passes Nia. *(not on a captured screen; example values)* | 0.6 | Not on a captured screen; the values change with the account | — |  |
| S102<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.behind`</sub> | Theo is still behind. | 0.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| S103<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.catchUpNote`</sub> | To catch up, Theo would need about $196 a month. That is almost twice what Nia puts in. | 1.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| S104<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.bumpyHeading`</sub> | Real life is bumpy | 0.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| S105<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.growth`</sub> | Growth | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S106<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.smooth`</sub> | Smooth | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S107<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.bumpy`</sub> | Bumpy | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S108<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.smoothTitle`</sub> | Smooth years | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S109<br>DRAFT | Your money story<br><sub>`story:keepGoing.bumpyTitle`</sub> | Bumpy years *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| S110<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.shapeSummary`</sub> | Same overall growth as the smooth line: 6% a year. The order of good and bad years changes the ending. Nia ends with $242,251. Theo ends with $186,213. | 1.9 | Nothing needs you: same<br>Brand-new: same | — |  |
| S111<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.yourTurn`</sub> | Your turn | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S112<br>DRAFT | Your money story<br><sub>`story:keepGoing.eachMonth`</sub> | Each month *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| S113<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:keepGoing.yourResult`</sub> | Start at 26 with $150 a month. At 65 you would have $279,627. | 2.4 | Nothing needs you: same<br>Brand-new: same | — |  |
| S114<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:practice.claim`</sub> | Practice lets you try a mix with practice money. Nothing you do there touches your account. | 3.0 | Nothing needs you: same<br>Brand-new: same | — | Changed by approved rewrite 6 (Phase 2). |
| S115<br>DRAFT | Your money story (laptop, phone)<br><sub>`story:practice.go`</sub> | Go to Practice | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S116<br>DRAFT | Your money story<br><sub>`story:slider.label`</sub> | Start age: Start at 30 *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| S117<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:rosaStory.pointOfView`</sub> | Right now, almost all of your balance is money you put in. Growth needs years, so starting early and staying steady matter more than picking the perfect moment. | 6.3 | Nothing needs you: same<br>Brand-new: “Growth needs years. Starting early and staying steady matter more than picking the perfect moment.” | — |  |
| S118<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:rosaStory.since-march`</sub> | You opened your account on March 2 with $500. Since then you have put in $1,250. On Sept. 18 your balance was $1,336.80. | 3.3 | Nothing needs you: “You opened your account on March 2 with $500. Since then you have put in $1,400. On Sept. 18 your balance was $1,519.67.”<br>Brand-new: not shown (short story) | — |  |
| S119<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:rosaStory.deposits-share`</sub> | About 94% of your balance is money you put in. The other $86.80 is what it earned. | 3.7 | Nothing needs you: “About 92% of your balance is money you put in. The other $119.67 is what it earned.”<br>Brand-new: not shown (short story) | — |  |
| S120<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:rosaStory.dip`</sub> | From May 11 to May 26, falling prices took $34.89 off your balance. That is a drop of 4.2%. | 3.6 | Nothing needs you: same<br>Brand-new: not shown (short story) | Approve as shown | New dip sentence (data-driven dip): "From May 11 to May 26, falling prices took $34.89 off your balance. That is a drop of 4.2%." |
| S121<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:rosaStory.at-low`</sub> | On May 26, your balance was $799.26. That was $0.74 below the $800 you had put in. | 3.7 | Nothing needs you: same<br>Brand-new: not shown (short story) | — |  |
| S122<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:rosaStory.pause`</sub> | You paused auto-invest the next trading day, May 27. | 6.3 | Nothing needs you: not shown<br>Brand-new: not shown (short story) | — |  |
| S123<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:rosaStory.back-above`</sub> | By May 28, your balance was back above what you had put in. | 4.0 | Nothing needs you: “By May 27, your balance was back above what you had put in.”<br>Brand-new: not shown (short story) | — |  |
| S124<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:rosaStory.cash-after`</sub> | After that, your June 1, July 1 and Aug. 3 deposits stayed as cash. | 7.6 | Nothing needs you: not shown<br>Brand-new: not shown (short story) | — |  |
| S125<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:rosaStory.up-now`</sub> | On Sept. 18, you were up $86.80. | label | Nothing needs you: “On Sept. 18, you were up $119.67.”<br>Brand-new: not shown (short story) | — |  |
| S126<br>DRAFT | Your money story (phone)<br><sub>`data:rosaStory.kept-buying`</sub> | Auto-invest stayed on. Your June 1, July 1, Aug. 3 and Sept. 1 deposits bought your mix the day they arrived. *(the “Nothing needs you” account only)* | 6.5 | Normal: not shown<br>Brand-new: not shown | — |  |
| S127<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:story.claims.early-ends-ahead`</sub> | Nia ends with more money than Theo. | 0.6 | Nothing needs you: same<br>Brand-new: same | — |  |
| S128<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:story.claims.early-puts-in-less`</sub> | Nia puts in less money than Theo. | 0.6 | Nothing needs you: same<br>Brand-new: same | — |  |
| S129<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:story.claims.early-earned-share`</sub> | Most of Nia's money at 65 came from growth, not from what she put in. | 3.6 | Nothing needs you: same<br>Brand-new: same | — |  |
| S130<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:story.claims.catch-up-costs-more`</sub> | To catch up, Theo would need about $196 a month. | 2.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| S131<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:story.claims.early-ahead-when-bumpy`</sub> | Even when the years go up and down, Nia still ends ahead. | 2.9 | Nothing needs you: same<br>Brand-new: same | — |  |
| S132<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:story.assumptions.note`</sub> | An example rate of 6% a year. Real markets go up and down, and nobody can promise a rate. | 4.3 | Nothing needs you: same<br>Brand-new: same | — |  |
| S133<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:story.bumpy.note`</sub> | Same overall growth as the smooth line: 6% a year. The order of good and bad years changes the ending. | 3.1 | Nothing needs you: same<br>Brand-new: same | — |  |
| S134<br>DRAFT | Your money story (laptop, phone)<br><sub>`data:story.yourTurn.note`</sub> | This is an example, not a plan or advice. | 3.7 | Nothing needs you: same<br>Brand-new: same | — |  |

### Practice

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| P1<br>DRAFT | Practice<br><sub>`shared:practiceErrors.min`</sub> | Enter an amount of $1 or more. *(not on a captured screen; example values)* | 4.0 | Same words wherever it shows | — |  |
| P2<br>DRAFT | Practice<br><sub>`shared:practiceErrors.notNumber`</sub> | Enter a number, like 25 or 25.50. *(not on a captured screen; example values)* | 5.7 | Same words wherever it shows | — |  |
| P3<br>DRAFT | Practice (error)<br><sub>`shared:practiceErrors.decimals`</sub> | Use no more than 2 decimals, like 25.50. | 5.2 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P4<br>DRAFT | Practice<br><sub>`shared:practiceErrors.notEnough`</sub> | You have $452.11 in practice money. Enter that much or less. *(not on a captured screen; example values)* | 2.6 | Not on a captured screen; the values change with the account | — |  |
| P5<br>DRAFT | Practice<br><sub>`shared:practiceErrors.noneOwned`</sub> | You do not own any AAPL in Practice, so there is nothing to sell. Pick one you own. *(not on a captured screen; example values)* | 1.0 | Not on a captured screen; the values change with the account | — | Changed by approved rewrite 8 (Phase 2). |
| P6<br>DRAFT | Practice<br><sub>`shared:practiceErrors.tooMuch`</sub> | You own $246.92 of AAPL in Practice. Enter that much or less. *(not on a captured screen; example values)* | 1.5 | Not on a captured screen; the values change with the account | — |  |
| P7<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`practice:title`</sub> | Practice | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P8<br>DRAFT | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:banner`</sub> | Practice money. Nothing here touches your account. | 4.3 | Nothing needs you: same<br>Brand-new: same | — | Changed by ruling B (Phase 2.5): "Practice money. Nothing here touches your account." |
| P9<br>DRAFT | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:sum.left`</sub> | Practice money left | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P10<br>DRAFT | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:sum.inFunds`</sub> | In practice investments | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P11<br>DRAFT | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:sum.total`</sub> | Total in Practice | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P12<br>DRAFT | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:ownHeading`</sub> | What you own in Practice | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| P13<br>DRAFT | Practice (laptop, phone); Practice (error)<br><sub>`practice:ownEmpty`</sub> | Nothing yet. Buy a stock or crypto to start. | 0.6 | Nothing needs you: same<br>Brand-new: same | — |  |
| P14<br>DRAFT | Activity (laptop, phone); Home (laptop); Investments (laptop); Practice (after buying)<br><sub>`practice:col.fund`</sub> | Investment | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P15<br>DRAFT | Activity (laptop, phone); Investments (laptop, phone); Practice (after buying)<br><sub>`practice:col.shares`</sub> | Shares | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| P16<br>DRAFT | Practice (laptop, phone); Words (laptop, phone); Word explanation; Practice (after buying)<br><sub>`practice:col.value`</sub> | Value | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P17<br>DRAFT | Practice (after buying)<br><sub>`practice:col.paid`</sub> | Paid | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P18<br>DRAFT | Your money story (laptop, phone); Words (laptop, phone); Investments (laptop); Practice (after buying)<br><sub>`practice:col.change`</sub> | Up or down | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P19<br>DRAFT | Practice (after buying)<br><sub>`practice:mixHeading`</sub> | Your practice mix | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P20<br>DRAFT | Practice<br><sub>`practice:percent`</sub> | 52% *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| P21<br>DRAFT | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:timeMachine.title`</sub> | Time machine | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P22<br>DRAFT | Practice (after buying)<br><sub>`practice:timeMachine.summary`</sub> | If you had held this mix since Sept. 26, 2025, it would be worth $100.00 on Sept. 18, 2026. On Sept. 26, 2025 it would have been worth $75.74. | 5.1 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P23<br>DRAFT | Practice (laptop, phone); Practice (error)<br><sub>`practice:timeMachine.empty`</sub> | Buy an investment to see how your mix would have moved. | 2.6 | Nothing needs you: same<br>Brand-new: same | — |  |
| P24<br>DRAFT | Practice (laptop, phone)<br><sub>`practice:timeMachine.colWeek`</sub> | Week of | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P25<br>DRAFT | Practice (laptop, phone); Words (laptop, phone); Word explanation; Practice (after buying)<br><sub>`practice:timeMachine.colValue`</sub> | Value | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P26<br>DRAFT | Practice (after buying)<br><sub>`practice:timeMachine.series`</sub> | Your practice mix | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P27<br>DRAFT | Practice<br><sub>`practice:timeMachine.day`</sub> | Sept. 18: your practice mix would be worth $246.92. *(not on a captured screen; example values)* | 3.7 | Not on a captured screen; the values change with the account | — |  |
| P28<br>DRAFT | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:startOver`</sub> | Start over | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P29<br>DRAFT | Practice<br><sub>`practice:startOverTitle`</sub> | Start over? *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| P30<br>DRAFT | Practice<br><sub>`practice:startOverBody`</sub> | This clears your practice investments and sets your practice money back to $150. *(not on a captured screen; example values)* | 6.7 | Not on a captured screen; the values change with the account | — |  |
| P31<br>DRAFT | Try-again dialog; Auto-invest dialog<br><sub>`practice:cancel`</sub> | Cancel | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P32<br>DRAFT | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:order.title`</sub> | Place an order | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P33<br>DRAFT | Practice (laptop, phone); Practice (error)<br><sub>`practice:order.side`</sub> | Buy or sell | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P34<br>DRAFT | Practice (laptop, phone); Practice (error)<br><sub>`practice:order.buy`</sub> | Buy | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P35<br>DRAFT | Practice (laptop, phone); Practice (error)<br><sub>`practice:order.sell`</sub> | Sell | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P36<br>DRAFT | Practice (laptop, phone); Practice (error)<br><sub>`practice:order.pickFund`</sub> | Pick an investment | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P37<br>DRAFT | Practice (laptop); Practice (error)<br><sub>`practice:order.amountLabel`</sub> | Amount in dollars | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P38<br>DRAFT | Practice (laptop); Practice (error)<br><sub>`practice:order.dollar`</sub> | $ | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P39<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Your money story (laptop, phone); and 2 more screens<br><sub>`practice:order.phoneAmountLabel`</sub> | Amount | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P40<br>DRAFT | Practice<br><sub>`practice:order.phoneAmount`</sub> | $150 *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| P41<br>DRAFT | Practice (phone)<br><sub>`practice:order.keypad`</sub> | Number keypad | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P42<br>DRAFT | Practice (phone)<br><sub>`practice:order.delete`</sub> | Delete | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P43<br>DRAFT | Practice (phone)<br><sub>`practice:order.decimal`</sub> | Decimal point | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P44<br>DRAFT | Practice (laptop, phone); Practice (error)<br><sub>`practice:order.review`</sub> | Review | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P45<br>DRAFT | Practice<br><sub>`practice:order.checkOrder`</sub> | Check your order *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| P46<br>DRAFT | Practice<br><sub>`practice:order.reviewBuy`</sub> | Buy $150 of AAPL at $336.13 a share. That is about 0.7346 shares. *(not on a captured screen; example values)* | 2.4 | Not on a captured screen; the values change with the account | — |  |
| P47<br>DRAFT | Practice<br><sub>`practice:order.reviewSell`</sub> | Sell $150 of AAPL at $336.13 a share. That is about 0.7346 shares. *(not on a captured screen; example values)* | 2.4 | Not on a captured screen; the values change with the account | — |  |
| P48<br>DRAFT | Practice<br><sub>`practice:order.noFee`</sub> |  There is no fee. *(not on a captured screen; example values)* | -2.2 | Same words wherever it shows | — |  |
| P49<br>DRAFT | Practice<br><sub>`practice:order.back`</sub> | Back *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| P50<br>DRAFT | Practice<br><sub>`practice:order.confirm`</sub> | Confirm *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| P51<br>DRAFT | Practice (after buying)<br><sub>`practice:order.bought`</sub> | You bought $100.00 of AAPL with practice money. | 3.8 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P52<br>DRAFT | Practice<br><sub>`practice:order.sold`</sub> | You sold $150 of AAPL. That money is back in your practice money. *(not on a captured screen; example values)* | 2.4 | Not on a captured screen; the values change with the account | — | Changed by approved rewrite 6 (Phase 2). |
| P53<br>DRAFT | Practice (after buying)<br><sub>`practice:order.newOrder`</sub> | New order | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P54<br>DRAFT | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`data:practice.timeMachine.note`</sub> | This uses past prices to show how a mix could have moved. The past does not tell you what will happen next. | 1.0 | Nothing needs you: same<br>Brand-new: same | — |  |

### Words

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| W1<br>DRAFT | Words (laptop, phone); Words (no match)<br><sub>`learn:title`</sub> | Words to know | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W2<br>DRAFT | Words (laptop, phone); Words (no match)<br><sub>`learn:search`</sub> | Search words | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W3<br>DRAFT | Words<br><sub>`learn:countOne`</sub> | 1 word *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| W4<br>DRAFT | Words (laptop, phone); Word explanation; Words (no match)<br><sub>`learn:countMany`</sub> | Search words *(and 5 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W5<br>DRAFT | Words (no match)<br><sub>`learn:none`</sub> | No words match “zebra”. Try “stock” or “crypto”. | -0.8 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| W6<br>DRAFT | Words (laptop, phone)<br><sub>`learn:allWords`</sub> | All words | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W7<br>DRAFT | Words (laptop, phone); Word explanation<br><sub>`learn:alsoCalled`</sub> | Also called risk level, volatility *(and 1 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W8<br>DRAFT | Words (laptop, phone); Word explanation<br><sub>`learn:example`</sub> | Example: Costco is a 1. Solana is a 5. *(and 1 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W9<br>DRAFT | Words (laptop, phone)<br><sub>`learn:related`</sub> | Related words | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W10<br>DRAFT | Words (laptop, phone)<br><sub>`learn:source`</sub> | Source: I | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W11<br>DRAFT | Investments (laptop, phone); Words (laptop, phone)<br><sub>`learn:newTab`</sub> | (opens in a new tab) | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| W12<br>DRAFT | Words<br><sub>`learn:notFound`</sub> | We could not find that word. *(not on a captured screen; example values)* | -1.4 | Same words wherever it shows | — |  |
| W13<br>DRAFT | Words<br><sub>`learn:notFoundWhy`</sub> | Try searching for it in Words to know. *(not on a captured screen; example values)* | 0.8 | Same words wherever it shows | — |  |
| W14<br>DRAFT | Words (laptop, phone); Word explanation<br><sub>`learn:labelWord`</sub> | Example: | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W15<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone); Words (laptop, phone); Word explanation<br><sub>`data:glossary.balance.term`</sub> | Balance | label | Same in every scenario | — |  |
| W16<br>DRAFT | Word explanation<br><sub>`data:glossary.balance.alsoCalled`</sub> | account value | label | Same in every scenario | — |  |
| W17<br>DRAFT | Words (laptop, phone); Word explanation<br><sub>`data:glossary.balance.short`</sub> | The total value of everything in your account right now. | 7.2 | Same in every scenario | — |  |
| W18<br>DRAFT | Word explanation<br><sub>`data:glossary.balance.detail`</sub> | It adds up what your investments are worth today and any cash you have. It changes on days the market is open. | 3.2 | Same in every scenario | — |  |
| W19<br>DRAFT | Word explanation<br><sub>`data:glossary.balance.example`</sub> | If your investments are worth $900 and you have $100 in cash, your balance is $1,000. | 6.9 | Same in every scenario | — |  |
| W20<br>DRAFT | Home (phone); Activity (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.deposit.term`</sub> | Deposit | label | Same in every scenario | — |  |
| W21<br>DRAFT | Activity (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.deposit.short`</sub> | Money you move from your bank into your investing account. | 6.0 | Same in every scenario | — |  |
| W22<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.deposit.detail`</sub> | A deposit lands as cash first. If auto-invest is on, it then buys your chosen mix for you. *(not on a captured screen; example values)* | 3.7 | Same in every scenario | — |  |
| W23<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.deposit.example`</sub> | You move $150 from your bank on the first of each month. *(not on a captured screen; example values)* | 1.9 | Same in every scenario | — | Changed by approved rewrite 2 (Phase 2). |
| W24<br>DRAFT | Alerts (laptop, phone); Words (laptop, phone); Try-again dialog<br><sub>`data:glossary.recurring-deposit.term`</sub> | Recurring deposit | label | Same in every scenario | — |  |
| W25<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.recurring-deposit.alsoCalled`</sub> | automatic deposit *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W26<br>DRAFT | Alerts (laptop, phone); Words (laptop, phone); Try-again dialog<br><sub>`data:glossary.recurring-deposit.short`</sub> | A deposit that happens on its own on the same day each month. | 4.0 | Same in every scenario | — |  |
| W27<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.recurring-deposit.detail`</sub> | You set it up once. After that, the money moves each month without you doing anything. You can stop it at any time. *(not on a captured screen; example values)* | 1.8 | Same in every scenario | — |  |
| W28<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.recurring-deposit.example`</sub> | A $150 deposit on the first of every month. *(not on a captured screen; example values)* | 6.3 | Same in every scenario | — |  |
| W29<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Words (laptop, phone); and 3 more screens<br><sub>`data:glossary.auto-invest.term`</sub> | Auto-invest | label | Same in every scenario | — |  |
| W30<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.auto-invest.alsoCalled`</sub> | automatic investing *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W31<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Words (laptop, phone); Auto-invest dialog<br><sub>`data:glossary.auto-invest.short`</sub> | A setting that puts each deposit into your chosen mix for you. | 5.8 | Same in every scenario | — |  |
| W32<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.auto-invest.detail`</sub> | When it is on, new money buys your funds on the day it arrives. When it is paused, new money waits as cash until you decide. You can turn it on or off at any time. *(not on a captured screen; example values)* | 2.5 | Same in every scenario | — |  |
| W33<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.auto-invest.example`</sub> | With auto-invest on, a $150 deposit buys your funds on the same day. *(not on a captured screen; example values)* | 6.7 | Same in every scenario | — |  |
| W34<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Words (laptop, phone); Try-again dialog<br><sub>`data:glossary.returned-deposit.term`</sub> | Returned deposit | label | Same in every scenario | — |  |
| W35<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.returned-deposit.alsoCalled`</sub> | bounced deposit *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W36<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Words (laptop, phone); Try-again dialog<br><sub>`data:glossary.returned-deposit.short`</sub> | A deposit your bank sent back instead of paying it. | 4.8 | Same in every scenario | — |  |
| W37<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.returned-deposit.detail`</sub> | Banks do this for a few reasons, such as the account being low that day. The money never reached your investing account, so nothing you own was sold or lost. *(not on a captured screen; example values)* | 5.2 | Same in every scenario | — |  |
| W38<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.returned-deposit.example`</sub> | You ask for a $150 deposit on the 1st, and it comes back on the 3rd. *(not on a captured screen; example values)* | 6.5 | Same in every scenario | — |  |
| W39<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Words (laptop, phone); and 2 more screens<br><sub>`data:glossary.cash.term`</sub> | Cash in your account | 0.7 | Same in every scenario | — |  |
| W40<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.cash.alsoCalled`</sub> | uninvested cash *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W41<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Words (laptop, phone); Auto-invest dialog<br><sub>`data:glossary.cash.short`</sub> | Money in your account that is not invested yet. | 3.7 | Same in every scenario | — |  |
| W42<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.cash.detail`</sub> | Cash does not go down when the market drops. It also does not grow when the market goes up. *(not on a captured screen; example values)* | 1.8 | Same in every scenario | — |  |
| W43<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.cash.example`</sub> | A new deposit waits as cash until it is used to buy a stock or crypto. *(not on a captured screen; example values)* | 5.4 | Same in every scenario | — |  |
| W44<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.ticker.term`</sub> | Ticker | label | Same in every scenario | — |  |
| W45<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.ticker.alsoCalled`</sub> | symbol *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W46<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.ticker.short`</sub> | A short code for a stock or a crypto, a bit like a username. | 4.2 | Same in every scenario | — |  |
| W47<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.ticker.detail`</sub> | Tickers are a few letters long. Stocks and crypto each have their own. *(not on a captured screen; example values)* | 1.5 | Same in every scenario | — |  |
| W48<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.ticker.example`</sub> | AAPL is the ticker for Apple. BTC is the ticker for Bitcoin. *(not on a captured screen; example values)* | 2.5 | Same in every scenario | — |  |
| W49<br>DRAFT | Activity (laptop, phone); Investments (phone); Your money story (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.share.term`</sub> | Share | label | Same in every scenario | — |  |
| W50<br>DRAFT | Activity (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.share.short`</sub> | One unit of a stock or a crypto that you can buy or sell. | 3.4 | Same in every scenario | — |  |
| W51<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.share.detail`</sub> | Each share has a price. When the price goes up, every share you own is worth more. *(not on a captured screen; example values)* | 0.9 | Same in every scenario | — |  |
| W52<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.share.example`</sub> | If one share costs $50 and you own 2 shares, you have $100. *(not on a captured screen; example values)* | 4.0 | Same in every scenario | — |  |
| W53<br>DRAFT | Activity (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.fractional-share.term`</sub> | Part of a share | -2.2 | Same in every scenario | — |  |
| W54<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.fractional-share.alsoCalled`</sub> | fractional share *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W55<br>DRAFT | Activity (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.fractional-share.short`</sub> | A piece of one share, so you can invest a small amount. | 2.9 | Same in every scenario | — |  |
| W56<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.fractional-share.detail`</sub> | You do not need to buy a whole share. If a share costs $100, you can still invest $10 and own one tenth of a share. *(not on a captured screen; example values)* | 3.1 | Same in every scenario | — |  |
| W57<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.fractional-share.example`</sub> | $10 buys 0.1 of a $100 share. With crypto, $12 can buy a tiny part of one Bitcoin. *(not on a captured screen; example values)* | 4.3 | Same in every scenario | — |  |
| W58<br>DRAFT | Investments (phone); Words (laptop, phone)<br><sub>`data:glossary.price.term`</sub> | Share price | label | Same in every scenario | — |  |
| W59<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.price.alsoCalled`</sub> | price *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W60<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.price.short`</sub> | What one share costs at the latest price. | 0.8 | Same in every scenario | — |  |
| W61<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.price.detail`</sub> | Stock prices change on each day the market is open. On weekends and holidays, you see the last price from when it was open. Crypto trades every day. *(not on a captured screen; example values)* | 3.6 | Same in every scenario | — |  |
| W62<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.price.example`</sub> | A share might cost $95 on Monday and $97 on Friday. *(not on a captured screen; example values)* | 4.8 | Same in every scenario | — |  |
| W63<br>DRAFT | Practice (laptop, phone); Words (laptop, phone); Word explanation; Practice (after buying)<br><sub>`data:glossary.market-value.term`</sub> | Value | label | Same in every scenario | — |  |
| W64<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.market-value.alsoCalled`</sub> | market value *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W65<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.market-value.short`</sub> | What your shares are worth at the latest price. | 1.0 | Same in every scenario | — |  |
| W66<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.market-value.detail`</sub> | It is the number of shares you own times the latest price. It moves each time the price moves. *(not on a captured screen; example values)* | 1.2 | Same in every scenario | — |  |
| W67<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.market-value.example`</sub> | 3 shares at $20 each have a value of $60. *(not on a captured screen; example values)* | 4.8 | Same in every scenario | — |  |
| W68<br>DRAFT | Alerts (laptop, phone); Your money story (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.money-in.term`</sub> | Money you put in | 0.7 | Same in every scenario | — |  |
| W69<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.money-in.alsoCalled`</sub> | net deposits, contributions *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W70<br>DRAFT | Alerts (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.money-in.short`</sub> | The total of your deposits that went through. | 3.8 | Same in every scenario | — |  |
| W71<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.money-in.detail`</sub> | It does not count deposits that were sent back. Compare it with your balance to see how much the market added or took away. *(not on a captured screen; example values)* | 3.8 | Same in every scenario | — |  |
| W72<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.money-in.example`</sub> | You put in $500, then $150 five times. That adds up to $1,250. *(not on a captured screen; example values)* | 1.5 | Same in every scenario | — |  |
| W73<br>DRAFT | Investments (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.cost-basis.term`</sub> | What you paid | label | Same in every scenario | — |  |
| W74<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.cost-basis.alsoCalled`</sub> | cost basis *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W75<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.cost-basis.short`</sub> | The total amount you spent to buy an investment. | 5.0 | Same in every scenario | — |  |
| W76<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.cost-basis.detail`</sub> | Compare it with the investment's value today. If the value is higher, you are up. If it is lower, you are down. *(not on a captured screen; example values)* | 3.4 | Same in every scenario | — |  |
| W77<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.cost-basis.example`</sub> | You spent $60 on a stock that is now worth $66. You are up $6. *(not on a captured screen; example values)* | 1.5 | Same in every scenario | — |  |
| W78<br>DRAFT | Your money story (laptop, phone); Words (laptop, phone); Investments (laptop); Practice (after buying)<br><sub>`data:glossary.gain-loss.term`</sub> | Up or down | label | Same in every scenario | — |  |
| W79<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.gain-loss.alsoCalled`</sub> | gain or loss *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W80<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.gain-loss.short`</sub> | How much more or less your money is worth than what you put in. | 2.5 | Same in every scenario | — |  |
| W81<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.gain-loss.detail`</sub> | Being up means it grew. Being down means it shrank. Until you sell, it can still change. *(not on a captured screen; example values)* | -0.9 | Same in every scenario | — |  |
| W82<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.gain-loss.example`</sub> | You put in $100 and it is worth $105. You are up $5. *(not on a captured screen; example values)* | 1.5 | Same in every scenario | — |  |
| W83<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.return.term`</sub> | Return | label | Same in every scenario | — |  |
| W84<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.return.short`</sub> | How much your money grew or shrank, shown as a percent. | 2.6 | Same in every scenario | — |  |
| W85<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.return.detail`</sub> | A percent makes it easy to compare big and small amounts. A 5% return on $100 is $5. A 5% return on $1,000 is $50. *(not on a captured screen; example values)* | 5.1 | Same in every scenario | — |  |
| W86<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.return.example`</sub> | Up $5 on $100 is a 5% return. *(not on a captured screen; example values)* | 5.2 | Same in every scenario | — |  |
| W87<br>DRAFT | Home (phone); Activity (laptop, phone); Investments (phone); Words (laptop, phone)<br><sub>`data:glossary.dividend.term`</sub> | Dividend | label | Same in every scenario | — |  |
| W88<br>DRAFT | Activity (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.dividend.short`</sub> | A small payment some companies make to the people who own their stock. | 4.9 | Same in every scenario | — |  |
| W89<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.dividend.detail`</sub> | A company can share part of what it earns with its owners. It pays a set amount for each share you owned before a certain date. In First Leaf, the payment lands in your cash. *(not on a captured screen; example values)* | 3.1 | Same in every scenario | — |  |
| W90<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.dividend.example`</sub> | A company pays 27 cents a share. If you own 2 shares, you get 54 cents. *(not on a captured screen; example values)* | 3.0 | Same in every scenario | — |  |
| W91<br>DRAFT | Investments (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.stock.term`</sub> | Stock | label | Same in every scenario | — |  |
| W92<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.stock.alsoCalled`</sub> | shares of a company, equity *(not on a captured screen; example values)* | 7.6 | Same in every scenario | — |  |
| W93<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.stock.short`</sub> | A small piece of a company that you can own. | 2.5 | Same in every scenario | — |  |
| W94<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.stock.detail`</sub> | When the company does well, its stock can grow. It can also drop fast. That is why stocks have ups and downs. *(not on a captured screen; example values)* | 0.7 | Same in every scenario | — |  |
| W95<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.stock.example`</sub> | Owning one share of Apple means you own a tiny piece of Apple. *(not on a captured screen; example values)* | 4.9 | Same in every scenario | — |  |
| W96<br>DRAFT | Alerts (laptop, phone); Investments (laptop, phone); Your money story (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.crypto.term`</sub> | Crypto | label | Same in every scenario | — |  |
| W97<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.crypto.alsoCalled`</sub> | cryptocurrency, digital asset *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W98<br>DRAFT | Alerts (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.crypto.short`</sub> | Digital money that no government or bank runs. | 6.7 | Same in every scenario | Approve as shown | New word (crypto), with Bitcoin and SIPC protection. All DRAFT. |
| W99<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.crypto.detail`</sub> | Crypto lives on a network of computers. Its price can swing a lot in a single day. It trades every day, even on weekends. *(not on a captured screen; example values)* | 3.8 | Same in every scenario | — |  |
| W100<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.crypto.example`</sub> | Bitcoin and Ethereum are two kinds of crypto. *(not on a captured screen; example values)* | 5.2 | Same in every scenario | — |  |
| W101<br>DRAFT | Investments (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.bitcoin.term`</sub> | Bitcoin | label | Same in every scenario | — |  |
| W102<br>DRAFT | Home (laptop, phone); Investments (laptop, phone); Your money story (laptop, phone); and 3 more screens<br><sub>`data:glossary.bitcoin.alsoCalled`</sub> | BTC | label | Same in every scenario | — |  |
| W103<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.bitcoin.short`</sub> | The first and best-known crypto. | 2.9 | Same in every scenario | — |  |
| W104<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.bitcoin.detail`</sub> | Bitcoin started in 2009. No company runs it. You can own a tiny part of one Bitcoin. *(not on a captured screen; example values)* | 2.6 | Same in every scenario | — |  |
| W105<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.bitcoin.example`</sub> | $18 can buy a small part of one Bitcoin. *(not on a captured screen; example values)* | 2.3 | Same in every scenario | — |  |
| W106<br>DRAFT | Alerts (laptop, phone); Investments (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.sipc-protection.term`</sub> | SIPC protection | label | Same in every scenario | — |  |
| W107<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.sipc-protection.alsoCalled`</sub> | SIPC coverage *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W108<br>DRAFT | Alerts (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.sipc-protection.short`</sub> | Help getting your stocks and cash back if your brokerage firm fails. | 3.8 | Same in every scenario | — |  |
| W109<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.sipc-protection.detail`</sub> | If a brokerage firm that is a SIPC member fails, SIPC works to give back your stocks and cash, up to $500,000. That includes up to $250,000 in cash. It does not cover a drop in prices. It does not cover crypto like Bitcoin or Ethereum. *(not on a captured screen; example values)* | 3.8 | Same in every scenario | Approve as shown | New word, checked against sipc.org ($500,000 including $250,000 cash; no cover for price drops or for crypto that is not a security). |
| W110<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.sipc-protection.example`</sub> | If your firm closed and your shares went missing, SIPC would work to get them back to you. *(not on a captured screen; example values)* | 3.9 | Same in every scenario | — |  |
| W111<br>DRAFT | Words (laptop, phone); Home (laptop); Word explanation<br><sub>`data:glossary.your-mix.term`</sub> | Your mix | label | Same in every scenario | — |  |
| W112<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.your-mix.alsoCalled`</sub> | asset allocation *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W113<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.your-mix.short`</sub> | How your money is split between stocks, crypto and cash. | 3.7 | Same in every scenario | — |  |
| W114<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.your-mix.detail`</sub> | Each part moves in its own way. Crypto usually jumps around more than stocks. Cash does not move with the market. You pick the split. *(not on a captured screen; example values)* | 1.0 | Same in every scenario | — |  |
| W115<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.your-mix.example`</sub> | A mix of 80% stocks and 20% crypto. *(not on a captured screen; example values)* | 3.8 | Same in every scenario | — |  |
| W116<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.spreading-out.term`</sub> | Spreading out | label | Same in every scenario | — |  |
| W117<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.spreading-out.alsoCalled`</sub> | diversification *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W118<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.spreading-out.short`</sub> | Owning many different things so one bad one hurts you less. | 4.8 | Same in every scenario | — |  |
| W119<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.spreading-out.detail`</sub> | If one company has a bad year, the others can help balance it out. *(not on a captured screen; example values)* | 5.0 | Same in every scenario | — |  |
| W120<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.spreading-out.example`</sub> | Owning five companies instead of just one. *(not on a captured screen; example values)* | 5.7 | Same in every scenario | — |  |
| W121<br>DRAFT | Home (phone); Investments (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.ups-and-downs.term`</sub> | Ups and downs | label | Same in every scenario | — |  |
| W122<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.ups-and-downs.alsoCalled`</sub> | risk level, volatility | label | Same in every scenario | — |  |
| W123<br>DRAFT | Home (phone); Words (laptop, phone)<br><sub>`data:glossary.ups-and-downs.short`</sub> | How much an investment's price tends to jump around. | 3.7 | Same in every scenario | — |  |
| W124<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.ups-and-downs.detail`</sub> | We rate each one from 1, calm, to 5, bumpy, using how much its price moved each day over the past year. Bumpy ones can grow more over time, but they can also fall more on a bad day. | 6.2 | Same in every scenario | — |  |
| W125<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.ups-and-downs.example`</sub> | Costco is a 1. Solana is a 5. | label | Same in every scenario | — |  |
| W126<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.compound-growth.term`</sub> | Growth on growth | label | Same in every scenario | — |  |
| W127<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.compound-growth.alsoCalled`</sub> | compound growth, compounding *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W128<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.compound-growth.short`</sub> | When your money earns money, and then that new money earns money too. | 4.9 | Same in every scenario | — |  |
| W129<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.compound-growth.detail`</sub> | It starts small and speeds up over time, like a snowball rolling downhill. The more years it has, the bigger it gets. *(not on a captured screen; example values)* | 3.2 | Same in every scenario | — |  |
| W130<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.compound-growth.example`</sub> | $100 that grows 6% becomes $106. The next year, the 6% is on $106, not $100. *(not on a captured screen; example values)* | 4.5 | Same in every scenario | — |  |
| W131<br>DRAFT | Activity (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.settlement.term`</sub> | Settling | label | Same in every scenario | — |  |
| W132<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.settlement.alsoCalled`</sub> | settlement, T+1 *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W133<br>DRAFT | Activity (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.settlement.short`</sub> | The short wait after you buy or sell before the trade is final. | 4.0 | Same in every scenario | — |  |
| W134<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.settlement.detail`</sub> | In the U.S., most trades are final one business day later. Until then, the trade shows as settling. *(not on a captured screen; example values)* | 3.7 | Same in every scenario | — |  |
| W135<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.settlement.example`</sub> | You buy on Monday. It is final on Tuesday. *(not on a captured screen; example values)* | 1.9 | Same in every scenario | — |  |
| W136<br>DRAFT | Alerts (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.goal-pace.term`</sub> | On pace | label | Same in every scenario | — |  |
| W137<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.goal-pace.alsoCalled`</sub> | goal pace *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W138<br>DRAFT | Alerts (laptop, phone); Words (laptop, phone)<br><sub>`data:glossary.goal-pace.short`</sub> | Whether your deposits are keeping up with your plan. | 5.0 | Same in every scenario | — |  |
| W139<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.goal-pace.detail`</sub> | It only looks at the money you put in. It does not change when the market goes up or down. *(not on a captured screen; example values)* | 1.9 | Same in every scenario | — |  |
| W140<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.goal-pace.example`</sub> | You planned to put in $1,400 by now and put in $1,250. You are $150 behind. *(not on a captured screen; example values)* | 2.3 | Same in every scenario | — |  |
| W141<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 12 more screens<br><sub>`data:glossary.practice-mode.term`</sub> | Practice | label | Same in every scenario | — |  |
| W142<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.practice-mode.alsoCalled`</sub> | practice mode, pretend money *(not on a captured screen; example values)* | 6.6 | Same in every scenario | — |  |
| W143<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.practice-mode.short`</sub> | Practice money for trying things before you do them for real. | 3.7 | Same in every scenario | — | Changed by approved rewrite 6 (Phase 2). |
| W144<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.practice-mode.detail`</sub> | You start with $1,000 in practice money. Nothing you do here touches your account, and you can start over at any time. *(not on a captured screen; example values)* | 3.7 | Same in every scenario | — |  |
| W145<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.practice-mode.example`</sub> | Buy a stock with practice money and see how it would have moved. *(not on a captured screen; example values)* | 3.1 | Same in every scenario | — | Changed by approved rewrite 6 (Phase 2). |
| W146<br>DRAFT | Home (laptop, phone); Words (laptop, phone); Word explanation<br><sub>`data:glossary.the-market.term`</sub> | The market | label | Same in every scenario | — |  |
| W147<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.the-market.alsoCalled`</sub> | stock market *(not on a captured screen; example values)* | label | Same in every scenario | — |  |
| W148<br>DRAFT | Words (laptop, phone)<br><sub>`data:glossary.the-market.short`</sub> | All the people buying and selling investments. | 7.4 | Same in every scenario | — |  |
| W149<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.the-market.detail`</sub> | When more people want to buy, prices go up. When more people want to sell, prices go down. The stock market is open on weekdays, but not on some holidays. Crypto trades every day. *(not on a captured screen; example values)* | 3.0 | Same in every scenario | — |  |
| W150<br>DRAFT | Words, and every explanation of this word<br><sub>`data:glossary.the-market.example`</sub> | Prices can change every minute while the market is open. *(not on a captured screen; example values)* | 7.2 | Same in every scenario | — |  |

### Charts (every chart)

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| C1<br>DRAFT | Word explanation; Practice (error); Practice (after buying)<br><sub>`shared:chart.showTable`</sub> | Show as table | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| C2<br>DRAFT | Home (laptop, phone); Investments (laptop, phone); Your money story (laptop, phone); Practice (laptop, phone)<br><sub>`shared:chart.hideTable`</sub> | Hide table | label | Nothing needs you: same<br>Brand-new: same | — |  |
| C3<br>DRAFT | Home (laptop, phone); Investments (laptop, phone); Your money story (laptop, phone); Practice (laptop, phone)<br><sub>`shared:chart.asTable`</sub> | Balance since March, as a table *(and 10 more like it)* | 2.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| C4<br>DRAFT | Your money story (laptop, phone); Home (laptop); Word explanation<br><sub>`shared:chart.readHint`</sub> | Move across the chart, tap it, or use the arrow keys to read each day. | 3.6 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C5<br>DRAFT | Investments (laptop, phone); Your money story (laptop, phone); Practice (after buying)<br><sub>`shared:chart.readHintSeries`</sub> | Move across the chart, tap it, or use the arrow keys to read it. | 3.4 | Nothing needs you: same<br>Brand-new: same | — |  |
| C6<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone); Word explanation<br><sub>`shared:chart.keyboardDays`</sub> | Balance since March. Use the left and right arrow keys to read each day. *(and 3 more like it)* | -0.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C7<br>DRAFT | Investments (laptop, phone); Your money story (laptop, phone); Practice (after buying)<br><sub>`shared:chart.keyboardSeries`</sub> | Price over time. Use the left and right arrow keys to read it. *(and 3 more like it)* | -0.6 | Nothing needs you: same<br>Brand-new: same | — |  |
| C8<br>DRAFT | Investments (laptop, phone); Your money story (laptop, phone); Home (laptop); and 2 more screens<br><sub>`shared:chart.key`</sub> | Chart key | label | Nothing needs you: same<br>Brand-new: same | — |  |
| C9<br>DRAFT | Your money story (laptop, phone); Home (laptop); Word explanation<br><sub>`shared:chart.putIn`</sub> | What you put in | -2.2 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C10<br>DRAFT | Your money story (laptop, phone); Home (laptop); Word explanation<br><sub>`shared:chart.earned`</sub> | What it earned | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C11<br>DRAFT | Your money story (laptop, phone)<br><sub>`shared:chart.events`</sub> | Events | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C12<br>DRAFT | Home (laptop, phone); Your money story (laptop, phone); Words (laptop, phone); Word explanation<br><sub>`shared:chart.balance`</sub> | Balance | label | Nothing needs you: same<br>Brand-new: same | — |  |
| C13<br>DRAFT | Charts (every chart)<br><sub>`shared:chart.tooltip`</sub> | Balance: $246.92 *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| C14<br>DRAFT | Charts (every chart)<br><sub>`shared:chart.dayReadout`</sub> | Sept. 18: balance $1,336.80. You had put in $1,250.00, so you were down $10.99. *(not on a captured screen; example values)* | 3.2 | Not on a captured screen; the values change with the account | — |  |
| C15<br>DRAFT | Investments (laptop, phone); Your money story (laptop, phone); Home (laptop); Word explanation<br><sub>`shared:ranges.group`</sub> | Time range | label | Nothing needs you: same<br>Brand-new: same | — |  |
| C16<br>DRAFT | Your money story (laptop, phone); Home (laptop); Word explanation<br><sub>`shared:ranges.1m.label`</sub> | 1 month | label | Nothing needs you: same<br>Brand-new: not shown | — | Changed by approved rewrite 9 (Phase 2). Measured at 390px: the three buttons fit on one row, each 48px tall. |
| C17<br>DRAFT | Your money story (laptop, phone); Home (laptop); Word explanation<br><sub>`shared:ranges.1m.name`</sub> | Last month | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C18<br>DRAFT | Your money story (laptop, phone); Home (laptop); Word explanation<br><sub>`shared:ranges.3m.label`</sub> | 3 months | label | Nothing needs you: same<br>Brand-new: not shown | — | Changed by approved rewrite 9 (Phase 2). |
| C19<br>DRAFT | Your money story (laptop, phone); Home (laptop); Word explanation<br><sub>`shared:ranges.3m.name`</sub> | Last 3 months | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C20<br>DRAFT | Your money story (laptop, phone); Home (laptop); Word explanation<br><sub>`shared:ranges.all.label`</sub> | Since March | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C21<br>DRAFT | Your money story (laptop, phone); Home (laptop); Word explanation<br><sub>`shared:ranges.all.name`</sub> | Since March | label | Nothing needs you: same<br>Brand-new: not shown | — |  |

### Word explanations and sheets (every screen)

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| E1<br>DRAFT | Word explanations and sheets (every screen)<br><sub>`shared:placeholder.soon`</sub> | Coming soon. *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| E2<br>DRAFT | Home (phone); Alerts (phone); Activity (phone); Investments (phone)<br><sub>`shared:wordChips.title`</sub> | Words on this screen | -2.2 | Nothing needs you: same<br>Brand-new: same | — |  |
| E3<br>DRAFT | Word explanations and sheets (every screen)<br><sub>`shared:sheet.close`</sub> | Close *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| E4<br>DRAFT | Words (laptop, phone); Word explanation<br><sub>`shared:termTip.alsoCalled`</sub> | Also called risk level, volatility *(and 1 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| E5<br>DRAFT | Words (laptop, phone); Word explanation<br><sub>`shared:termTip.example`</sub> | Example: | label | Nothing needs you: same<br>Brand-new: same | — |  |
| E6<br>DRAFT | Word explanation<br><sub>`shared:termTip.related`</sub> | Related words: | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| E7<br>DRAFT | Words (laptop, phone)<br><sub>`shared:termTip.source`</sub> | Source: | label | Nothing needs you: same<br>Brand-new: same | — |  |
| E8<br>DRAFT | Investments (laptop, phone); Words (laptop, phone)<br><sub>`shared:termTip.newTab`</sub> | (opens in a new tab) | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| E9<br>DRAFT | Word explanation<br><sub>`shared:termTip.close`</sub> | Close explanation | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| E10<br>DRAFT | Phone view<br><sub>`shared:termTip.back`</sub> | Back to full view | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| E11<br>DRAFT | Investments (laptop, phone); Practice (after buying)<br><sub>`shared:dataNotes.stock`</sub> | Daily stock prices are modeled between real closes on Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026. | 9.2 | Nothing needs you: same<br>Brand-new: same | Optional: "Daily stock prices are modeled. They match the real closes on Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026." | Your wording from ruling B is kept exactly (grade 9.2, exempt as a fixed credit). Two shorter sentences would read lower, if you want that. |
| E12<br>DRAFT | Investments (laptop, phone)<br><sub>`shared:dataNotes.crypto`</sub> | Powered by CoinGecko API | label | Nothing needs you: same<br>Brand-new: same | — |  |
| E13<br>DRAFT | Word explanations and sheets (every screen)<br><sub>`shared:dataNotes.cryptoLink`</sub> | CoinGecko API *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| E14<br>DRAFT | Word explanations and sheets (every screen)<br><sub>`shared:dataNotes.cryptoUrl`</sub> | https://www.coingecko.com/en/api/ *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| E15<br>DRAFT | Investments (laptop, phone); Words (laptop, phone)<br><sub>`shared:dataNotes.newTab`</sub> | (opens in a new tab) | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |

### Numbers and dates (every screen)

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| N1<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Investments (laptop, phone); and 5 more screens<br><sub>`shared:change.up`</sub> | up $5.02 *(and 19 more like it)* | label | Nothing needs you: “up $8.94”<br>Brand-new: same | — |  |
| N2<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Investments (laptop, phone); and 3 more screens<br><sub>`shared:change.down`</sub> | down $10.99 *(and 15 more like it)* | label | Nothing needs you: “down $18.02”<br>Brand-new: same | — |  |
| N3<br>DRAFT | Home (laptop, phone); Word explanation; Practice (after buying)<br><sub>`shared:change.none`</sub> | no change | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| N4<br>DRAFT | Every date<br><sub>`shared:dates.months`</sub> | Jan., Feb., March, April, May, June, July, Aug., Sept., Oct., Nov., Dec. *(not on a captured screen; example values)* | 2.9 | Same words wherever it shows | — |  |
| N5<br>DRAFT | Every date<br><sub>`shared:dates.days`</sub> | Sun., Mon., Tue., Wed., Thu., Fri., Sat. *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |

### Page not found

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| X1<br>DRAFT | Page not found (laptop, phone)<br><sub>`not-found:title`</sub> | We couldn't find that page. | -1.8 | Nothing needs you: same<br>Brand-new: same | We could not find that page. | The other four "could not find" messages don't use a contraction. Pick one style. |
| X2<br>DRAFT | Page not found (laptop, phone)<br><sub>`not-found:why`</sub> | The link may be old or mistyped. | 0.6 | Nothing needs you: same<br>Brand-new: same | — |  |
| X3<br>DRAFT | Page not found (laptop, phone)<br><sub>`not-found:home`</sub> | Go to Home | label | Nothing needs you: same<br>Brand-new: same | — |  |

