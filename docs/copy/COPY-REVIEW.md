# Copy review · Phase 6

**Status:** Phase 2's copy sign-off is closed (Alex, Sept. 25). A row is **APPROVED** while its text still matches what Alex signed off (`docs/copy/approved.json`) and **DRAFT** when it is new or changed since, so DRAFT rows are exactly what needs a look. Nothing in the "Suggested rewrite" column has been applied.

**What this covers:** all 536 pieces of text a person can read or hear in First Leaf: every string in the copy files and the text that comes from the data (alerts, the ten investments, the story's sentences, the glossary). Built by `npm run copy:review` from the live pages.

**How to read a row**

- **Where it appears:** the screens where it was found on the laptop (1280px) and phone (390px) layouts, and where it lives (`file:key`, or `data:` for data files).
- **Text as shown:** as rendered for Rosa's normal account. Strings not on a captured screen are filled with example values, and say so.
- **Grade:** Flesch-Kincaid, as rule L5 scores it; "label" means 3 words or fewer. The limit is 8. Only CoinGecko's fixed credit is exempt.
- **Other scenario versions:** the "Nothing needs you" and brand-new accounts.
- **Suggested rewrite / Why:** a suggestion to approve, or a note on why the row changed.

## Recommended rewrites, in order

At most ten, most important first. Each one links to its row below.

1. Approve the Phase 6 rows (all DRAFT): the beneficiary alert and its sheet, the Your Journey sections, the Finance Terms entries and their sources, and the renamed navigation.
2. Optional, carried from Phase 2: the below-what-you-put-in chart sentence (**H13**) and "you set" on the mix card (**H27**).

## Consistency pass

**One name for one idea.** FYIs are "Good to know" as a badge and as a section, on the laptop and the phone. Everything else checked in Phases 2 and 3 still passes.

**Finance Terms.** Only real finance terms are term buttons, each with a source on Investor.gov, SEC.gov, FINRA.org, SIPC.org, IRS.gov or ConsumerFinance.gov (rules L1 and L6). The page and the navigation say "Finance Terms"; the word "chapter" is gone (Your Journey has sections).

**SIPC.** Only the general fact appears, in three places: the account notice, the Finance Terms entry and the crypto investment pages. G6 and the site crawl block membership and protection claims, "FDIC" and any "not … advice" wording.

## Screen by screen

### App frame (every screen)

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| A1<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`layouts:wordmark`</sub> | First Leaf | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A2<br>APPROVED | Home (laptop); Alerts (laptop); Activity (laptop); and 12 more screens<br><sub>`layouts:greeting`</sub> | Good morning, Rosa. | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A3<br>APPROVED | Home (laptop); Alerts (laptop); Activity (laptop); and 12 more screens<br><sub>`layouts:pricesAsOf`</sub> | Prices as of Fri., Sept. 18 | -0.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| A4<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`layouts:skip`</sub> | Skip to content | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A5<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`layouts:navLabel`</sub> | Main | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A6<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`layouts:nav.home.label`</sub> | Home | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A7<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`layouts:nav.home.short`</sub> | Home | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A8<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`layouts:nav.activity.label`</sub> | Activity | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A9<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`layouts:nav.activity.short`</sub> | Activity | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A10<br>APPROVED | Home (laptop); Alerts (laptop); Activity (laptop); and 12 more screens<br><sub>`layouts:nav.funds.label`</sub> | Investments | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A11<br>APPROVED | Home (laptop); Alerts (laptop); Activity (laptop); and 12 more screens<br><sub>`layouts:nav.funds.short`</sub> | Investments | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A12<br>DRAFT | Your Journey (laptop, phone); Home (laptop); Alerts (laptop); and 13 more screens<br><sub>`layouts:nav.story.label`</sub> | Your Journey | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A13<br>DRAFT | Home (phone); Alerts (phone); Activity (phone); and 6 more screens<br><sub>`layouts:nav.story.short`</sub> | Journey | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A14<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`layouts:nav.practice.label`</sub> | Practice | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A15<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`layouts:nav.practice.short`</sub> | Practice | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A16<br>DRAFT | Finance Terms (laptop, phone); Home (laptop); Alerts (laptop); and 12 more screens<br><sub>`layouts:nav.learn.label`</sub> | Finance Terms | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A17<br>DRAFT | Home (phone); Alerts (phone); Activity (phone); and 6 more screens<br><sub>`layouts:nav.learn.short`</sub> | Terms | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A18<br>APPROVED | Home (laptop); Alerts (laptop); Activity (laptop); and 12 more screens<br><sub>`layouts:phoneView.toggle`</sub> | Phone view | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A19<br>APPROVED | App frame (every screen)<br><sub>`layouts:phoneView.frameTitle`</sub> | First Leaf on a phone *(not on a captured screen; example values)* | -1.8 | Same words wherever it shows | — |  |
| A20<br>APPROVED | Phone view<br><sub>`layouts:phoneView.back`</sub> | Back to full view | -2.2 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| A21<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`layouts:pageTitles.home`</sub> | Home | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A22<br>APPROVED | Alerts (laptop, phone); Add a beneficiary sheet; Add a beneficiary sheet (saved); Beneficiary alert (reminded)<br><sub>`layouts:pageTitles.alerts`</sub> | Alerts | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A23<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`layouts:pageTitles.activity`</sub> | Activity | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A24<br>APPROVED | Investments (laptop, phone)<br><sub>`layouts:pageTitles.funds`</sub> | Your investments | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A25<br>DRAFT | Your Journey (laptop, phone); Home (laptop); Alerts (laptop); and 13 more screens<br><sub>`layouts:pageTitles.story`</sub> | Your Journey | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A26<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`layouts:pageTitles.practice`</sub> | Practice | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A27<br>DRAFT | Finance Terms (laptop, phone); Home (laptop); Alerts (laptop); and 12 more screens<br><sub>`layouts:pageTitles.learn`</sub> | Finance Terms | label | Nothing needs you: same<br>Brand-new: same | — |  |
| A28<br>APPROVED | App frame (every screen)<br><sub>`layouts:pageTitles.notFound`</sub> | Page not found *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| A29<br>APPROVED | App frame (every screen)<br><sub>`layouts:documentTitle`</sub> | Activity · First Leaf *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |

### Home

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| H1<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`home:title`</sub> | Home | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H2<br>APPROVED | Home (laptop, phone); Your Journey (laptop, phone); Term explanation<br><sub>`home:balance.label`</sub> | Balance | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H3<br>APPROVED | Home (laptop, phone); Term explanation<br><sub>`home:balance.vsPutIn`</sub> | Up $136.68 on the $1,400 you put in. | 2.3 | Nothing needs you: same<br>Brand-new: not shown | — | Changed in Phase 6: the sentence moved inside the dark balance card on every size. |
| H4<br>APPROVED | Home (laptop, phone); Term explanation<br><sub>`home:balance.thisWeek`</sub> | This week: down $1.44. | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H5<br>APPROVED | Home (laptop, phone); Finance Terms (laptop, phone); Term explanation<br><sub>`home:balance.inFunds`</sub> | Invested | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H6<br>APPROVED | Home (laptop, phone); Term explanation; Practice (after buying)<br><sub>`home:balance.cash`</sub> | Cash | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H7<br>APPROVED | Home (laptop, phone); Your Journey (laptop, phone); Term explanation<br><sub>`home:balance.youPutIn`</sub> | You put in | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H8<br>DRAFT | Home (laptop, phone); Term explanation<br><sub>`home:balance.autoInvest`</sub> | Auto-invest | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H9<br>DRAFT | Home (laptop, phone); Term explanation<br><sub>`home:balance.on`</sub> | On | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H10<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:chart.title`</sub> | Balance over time | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H11<br>APPROVED | Home (phone)<br><sub>`home:chart.phoneTitle`</sub> | Balance since March | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H12<br>APPROVED | Home (laptop, phone); Term explanation<br><sub>`home:chart.nowUp`</sub> | On Sept. 18, your balance was $1,536.68. That is $1,400.00 you put in and $136.68 it earned. | 3.0 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H13<br>APPROVED | Home<br><sub>`home:chart.nowDown`</sub> | On Sept. 18, your balance was $1,336.80. That is $1,250.00 you put in and $5.00 less than that. *(not on a captured screen; example values)* | 3.0 | Not on a captured screen; the values change with the account | On {date}, your balance was {balance}. That is {earned} less than the {moneyIn} you put in. | Shows only when the balance is below what you put in, exactly when a reader is worried. |
| H14<br>APPROVED | Home (laptop, phone); Term explanation<br><sub>`home:chart.range`</sub> | From March 2 to Sept. 18, it went from $499.88 to $1,536.68. *(and 1 more like it)* | 4.8 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H15<br>APPROVED | Home (laptop, phone); Investments (laptop, phone); Your Journey (laptop, phone); Activity (laptop)<br><sub>`home:chart.colDate`</sub> | Date | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H16<br>APPROVED | Home (laptop, phone); Your Journey (laptop, phone); Term explanation<br><sub>`home:chart.colBalance`</sub> | Balance | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H17<br>APPROVED | Home (laptop, phone); Your Journey (laptop, phone); Term explanation<br><sub>`home:chart.colPutIn`</sub> | You put in | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H18<br>APPROVED | Home (laptop, phone); Your Journey (laptop, phone)<br><sub>`home:chart.colEarned`</sub> | It earned | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H19<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:chart.emptyTitle`</sub> | Balance over time | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H20<br>APPROVED | Home (laptop)<br><sub>`home:chart.empty`</sub> | Your balance over time will show here after your first deposit arrives. *(only in the brand-new account)* | 6.8 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| H21<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:mix.title`</sub> | Your mix | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H22<br>APPROVED | Home<br><sub>`home:mix.even`</sub> | Each investment is at the share you set. *(not on a captured screen; example values)* | 2.3 | Same words wherever it shows | — |  |
| H23<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:mix.biggestGap`</sub> | The biggest difference is NKE: 6% now and 10% in the mix you set. | 5.9 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H24<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:mix.lede`</sub> | Your mix now, next to the mix you set. | -0.3 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H25<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:mix.listLabel`</sub> | Your mix now and the mix you set | -0.7 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H26<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:mix.now`</sub> | The biggest difference is NKE: 6% now *(and 14 more like it)* | 5.7 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H27<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:mix.set`</sub> | · 25% set *(and 5 more like it)* | label | Nothing needs you: same<br>Brand-new: not shown |  · you set {set}% | "35% set" reads like shorthand. Optional. |
| H28<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:mix.cash`</sub> | $2.48 in cash is not part of your mix. | 1.0 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H29<br>APPROVED | Activity (laptop, phone); Home (laptop); Investments (laptop)<br><sub>`home:mix.colFund`</sub> | Investment | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H30<br>APPROVED | Home (laptop)<br><sub>`home:mix.colNow`</sub> | Now | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H31<br>APPROVED | Home (laptop)<br><sub>`home:mix.colSet`</sub> | You set | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H32<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:goal.title`</sub> | Goal: Put in my first $2,000 | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H33<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:goal.progress`</sub> | $1,400 of $2,000 put in, with a target of Feb. 1, 2027. | 5.8 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H34<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:goal.barLabel`</sub> | Money put in toward your goal | 2.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H35<br>APPROVED | Home (laptop, phone); Activity (laptop, phone); Investments (laptop, phone); and 13 more screens<br><sub>`home:goal.barValue`</sub> | Term of the Day *(and 78 more like it)* | -2.2 | Nothing needs you: same<br>Brand-new: “Term of the Day” | — |  |
| H36<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:goal.onPace`</sub> | You are on pace with your plan. | -1.1 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H37<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:goal.note`</sub> | This counts deposits only, not the market. | 5.7 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H38<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:week.title`</sub> | This week | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H39<br>APPROVED | Home (laptop); Term explanation<br><sub>`home:week.line`</sub> | Your balance went down $1.44 this week. | 2.3 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H40<br>APPROVED | Home (laptop, phone); Term explanation<br><sub>`home:week.caption`</sub> | How your balance moved this week | 0.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H41<br>APPROVED | Home (laptop, phone); Your Journey (laptop, phone); Sections sheet; and 2 more screens<br><sub>`home:week.startBalance`</sub> | Sept. 11 balance *(and 9 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H42<br>APPROVED | Home (laptop, phone); Term explanation<br><sub>`home:week.market`</sub> | The market | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H43<br>APPROVED | Investments (laptop, phone); Activity (laptop)<br><sub>`home:week.dividends`</sub> | Dividends | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H44<br>APPROVED | Activity (laptop)<br><sub>`home:week.deposits`</sub> | Deposits | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H45<br>APPROVED | Home (laptop, phone); Your Journey (laptop, phone); Sections sheet; and 2 more screens<br><sub>`home:week.endBalance`</sub> | Sept. 11 balance *(and 9 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H46<br>APPROVED | Home (phone)<br><sub>`home:welcome.title`</sub> | Welcome, Rosa. *(only in the brand-new account)* | label | Nothing needs you: not shown<br>Brand-new: “Welcome, Rosa.” | — |  |
| H47<br>APPROVED | Home (phone)<br><sub>`home:welcome.lede`</sub> | Your account is open. Here is what happens next. *(only in the brand-new account)* | 1.9 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| H48<br>APPROVED | Home (phone)<br><sub>`home:welcome.step1`</sub> | Add money from your bank. It should arrive in 1 to 3 business days. *(only in the brand-new account)* | 4.0 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| H49<br>DRAFT | Home (phone)<br><sub>`home:welcome.step2`</sub> | When it arrives, you will see it as cash in your account. *(only in the brand-new account)* | 2.9 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| H50<br>APPROVED | Home (phone)<br><sub>`home:welcome.step3`</sub> | Then you choose what to do with it, such as turning on auto-invest. *(only in the brand-new account)* | 4.9 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| H51<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Add a beneficiary sheet; Term explanation<br><sub>`home:phone.needsOne`</sub> | 1 thing needs you | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| H52<br>APPROVED | Home<br><sub>`home:phone.needsMany`</sub> | 2 things need you *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| H53<br>APPROVED | Home<br><sub>`home:phone.headsUpOne`</sub> | 1 heads-up *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| H54<br>APPROVED | Home<br><sub>`home:phone.headsUpMany`</sub> | 2 heads-ups *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| H55<br>APPROVED | Home (phone)<br><sub>`home:phone.nothing`</sub> | Nothing needs you right now. *(only in the Nothing needs you account)* | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| H56<br>APPROVED | Home<br><sub>`home:phone.seeHeadsUpOne`</sub> | See 1 heads-up *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| H57<br>APPROVED | Home<br><sub>`home:phone.seeHeadsUpMany`</sub> | See 2 heads-ups *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| H58<br>APPROVED | Alerts (laptop, phone); Home (laptop); Add a beneficiary sheet; and 3 more screens<br><sub>`home:phone.fyiTitle`</sub> | Good to know | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H59<br>APPROVED | Home<br><sub>`home:phone.seen`</sub> | Seen *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| H60<br>APPROVED | Home (phone)<br><sub>`home:phone.whyTitle`</sub> | Why it moved this week | -1.8 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H61<br>APPROVED | Home (phone)<br><sub>`home:phone.whyMarket`</sub> | The market: down $1.44. | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H62<br>APPROVED | Home<br><sub>`home:phone.whyDividends`</sub> | Dividends: {dividends}. *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| H63<br>APPROVED | Home<br><sub>`home:phone.whyDeposits`</sub> | Deposits: {deposits}. *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| H64<br>APPROVED | Home (phone)<br><sub>`home:phone.byFundTitle`</sub> | Each investment's part | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H65<br>APPROVED | Home<br><sub>`home:phone.fundMoveUp`</sub> | AAPL moved down $10.99 this week. Price changes across everything you own added up to a $150 rise. *(not on a captured screen; example values)* | 3.7 | Not on a captured screen; the values change with the account | — |  |
| H66<br>APPROVED | Home<br><sub>`home:phone.fundMoveDown`</sub> | AAPL moved down $10.99 this week. Price changes across everything you own added up to a $150 drop. *(not on a captured screen; example values)* | 3.7 | Not on a captured screen; the values change with the account | — |  |
| H67<br>APPROVED | Home (laptop, phone); Term explanation<br><sub>`home:phone.someDown`</sub> | Some of your investments went down this week. Ups and downs are normal. | 1.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H68<br>APPROVED | Home (phone)<br><sub>`home:phone.seeFunds`</sub> | See your investments | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H69<br>APPROVED | Home (phone)<br><sub>`home:phone.latest`</sub> | Latest | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H70<br>APPROVED | Home (phone)<br><sub>`home:phone.seeActivity`</sub> | See all activity | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| H71<br>DRAFT | Home (phone)<br><sub>`home:phone.wordOfTheDay`</sub> | Term of the Day | -2.2 | Nothing needs you: same<br>Brand-new: same | — |  |
| H72<br>APPROVED | Home (phone)<br><sub>`home:phone.readMore`</sub> | Read more | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H73<br>APPROVED | Home (phone); Alerts (laptop, phone); Add a beneficiary sheet; Beneficiary alert (reminded)<br><sub>`home:phone.readMoreAbout`</sub> | about Invested *(and 2 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| H74<br>DRAFT | Home (phone)<br><sub>`home:phone.nextWord`</sub> | Next term | label | Nothing needs you: same<br>Brand-new: same | — |  |

### Alerts

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| L1<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Add a beneficiary sheet; and 3 more screens<br><sub>`shared:severity.needs-you`</sub> | Needs you | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L2<br>APPROVED | Alerts<br><sub>`shared:severity.heads-up`</sub> | Heads-up *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L3<br>APPROVED | Alerts (laptop, phone); Home (laptop); Add a beneficiary sheet; and 3 more screens<br><sub>`shared:severity.fyi`</sub> | Good to know | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L4<br>APPROVED | Alerts (laptop, phone); Home (laptop); Add a beneficiary sheet; and 3 more screens<br><sub>`shared:alerts.title`</sub> | Needs your attention | label | Nothing needs you: same<br>Brand-new: same | — |  |
| L5<br>APPROVED | Alerts (laptop, phone); Home (laptop); Add a beneficiary sheet; Term explanation<br><sub>`shared:alerts.countOne`</sub> | 1 thing needs you. | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L6<br>APPROVED | Alerts<br><sub>`shared:alerts.countMany`</sub> | 2 things need you. *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| L7<br>APPROVED | Add a beneficiary sheet (saved); Beneficiary alert (reminded)<br><sub>`shared:alerts.allHandled`</sub> | You have handled everything for this week. | 4.0 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L8<br>APPROVED | Home (phone)<br><sub>`shared:alerts.nothing`</sub> | Nothing needs you right now. *(only in the Nothing needs you account)* | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| L9<br>APPROVED | Alerts (laptop, phone); Home (laptop); Add a beneficiary sheet; and 3 more screens<br><sub>`shared:alerts.fyiTitle`</sub> | Good to know | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L10<br>APPROVED | Alerts<br><sub>`shared:alerts.new`</sub> | New *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L11<br>APPROVED | Alerts<br><sub>`shared:alerts.seen`</sub> | Seen *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L12<br>APPROVED | Add a beneficiary sheet (saved); Beneficiary alert (reminded)<br><sub>`shared:alerts.handled`</sub> | Handled (1) | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L13<br>APPROVED | Add a beneficiary sheet (saved); Beneficiary alert (reminded)<br><sub>`shared:alerts.undo`</sub> | Undo | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L14<br>APPROVED | Alerts<br><sub>`shared:alerts.undoWhich`</sub> | : Name a beneficiary for your account *(a bare value; example values)* | 0.5 | Not on a captured screen; the values change with the account | — |  |
| L15<br>APPROVED | Alerts<br><sub>`shared:alerts.undone`</sub> | Name a beneficiary for your account: moved back to your alerts. *(not on a captured screen; example values)* | 2.6 | Not on a captured screen; the values change with the account | — |  |
| L16<br>APPROVED | Alerts (laptop, phone); Add a beneficiary sheet; Add a beneficiary sheet (saved); Beneficiary alert (reminded)<br><sub>`alerts:title`</sub> | Alerts | label | Nothing needs you: same<br>Brand-new: same | — |  |
| L17<br>APPROVED | Alerts<br><sub>`alerts:detailTitle`</sub> | Alert *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L18<br>APPROVED | Alerts<br><sub>`alerts:new`</sub> | New *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L19<br>APPROVED | Alerts (laptop, phone); Add a beneficiary sheet; Add a beneficiary sheet (saved); Beneficiary alert (reminded)<br><sub>`alerts:whatHappened`</sub> | What happened | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L20<br>APPROVED | Alerts (laptop, phone); Activity (laptop, phone); Add a beneficiary sheet; and 2 more screens<br><sub>`alerts:whatItMeans`</sub> | What it means | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L21<br>APPROVED | Alerts (laptop, phone); Add a beneficiary sheet; Add a beneficiary sheet (saved); Beneficiary alert (reminded)<br><sub>`alerts:whatYouCanDo`</sub> | What you can do | -2.2 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L22<br>APPROVED | Alerts<br><sub>`alerts:termLine`</sub> | Volatility: How much an investment's price tends to jump around. *(a bare value; example values)* | 3.7 | Not on a captured screen; the values change with the account | — |  |
| L23<br>APPROVED | Alerts (laptop, phone)<br><sub>`alerts:markHandled`</sub> | Mark as handled | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L24<br>APPROVED | Add a beneficiary sheet (saved); Beneficiary alert (reminded)<br><sub>`alerts:handled`</sub> | Handled | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L25<br>APPROVED | Add a beneficiary sheet (saved); Beneficiary alert (reminded)<br><sub>`alerts:undo`</sub> | Undo | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L26<br>APPROVED | Alerts<br><sub>`alerts:markedStatus`</sub> | Marked as handled. *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L27<br>APPROVED | Alerts<br><sub>`alerts:undoneStatus`</sub> | Moved back to your alerts. *(not on a captured screen; example values)* | 0.5 | Same words wherever it shows | — |  |
| L28<br>APPROVED | Alerts (laptop, phone)<br><sub>`alerts:notFound`</sub> | We could not find that alert. | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| L29<br>APPROVED | Alerts (laptop, phone)<br><sub>`alerts:notFoundWhy`</sub> | It may have been for another account, or it no longer applies. | 5.8 | Nothing needs you: same<br>Brand-new: same | — |  |
| L30<br>APPROVED | Alerts (laptop)<br><sub>`alerts:choose`</sub> | Choose an alert to read it here. | 0.6 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L31<br>APPROVED | Alerts (laptop, phone)<br><sub>`alerts:allAlerts`</sub> | All alerts | label | Nothing needs you: same<br>Brand-new: same | — |  |
| L32<br>APPROVED | Activity (laptop, phone); Investments (laptop, phone); Practice (phone)<br><sub>`alerts:facts.amount`</sub> | Amount | label | Nothing needs you: same<br>Brand-new: same | — |  |
| L33<br>APPROVED | Activity (laptop, phone); Home (laptop); Investments (laptop)<br><sub>`alerts:facts.fund`</sub> | Investment | label | Nothing needs you: same<br>Brand-new: same | — |  |
| L34<br>APPROVED | Activity (laptop, phone)<br><sub>`alerts:facts.paidOn`</sub> | Paid on | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L35<br>APPROVED | Alerts<br><sub>`alerts:facts.priceOn`</sub> | Price on Sept. 18 *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| L36<br>APPROVED | Alerts<br><sub>`alerts:facts.move`</sub> | Price move *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L37<br>APPROVED | Alerts<br><sub>`alerts:facts.moveValue`</sub> | up 52% *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| L38<br>APPROVED | Alerts<br><sub>`alerts:facts.up`</sub> | up *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L39<br>APPROVED | Alerts<br><sub>`alerts:facts.down`</sub> | down *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| L40<br>APPROVED | Alerts<br><sub>`alerts:facts.yourChange`</sub> | What you own in it *(not on a captured screen; example values)* | -1.8 | Same words wherever it shows | — |  |
| L41<br>DRAFT | Alerts (laptop, phone); Finance Terms (laptop, phone); Add a beneficiary sheet; and 2 more screens<br><sub>`alerts:facts.beneficiary`</sub> | Beneficiary | label | Nothing needs you: same<br>Brand-new: same | — |  |
| L42<br>DRAFT | Alerts (laptop, phone); Add a beneficiary sheet; Beneficiary alert (reminded)<br><sub>`alerts:facts.notNamed`</sub> | Not named yet | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L43<br>DRAFT | Alerts<br><sub>`alerts:facts.named`</sub> | Rosa, {relationship} *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| L44<br>DRAFT | Alerts (laptop, phone); Add a beneficiary sheet<br><sub>`alerts:remindLater`</sub> | Remind me later | label | Nothing needs you: not shown<br>Brand-new: not shown | — | New in Phase 6: the second choice on the beneficiary alert. |
| L45<br>DRAFT | Beneficiary alert (reminded)<br><sub>`alerts:remindedStatus`</sub> | We will remind you the next time you open First Leaf. | 2.6 | Nothing needs you: not shown<br>Brand-new: not shown | — | New in Phase 6: what "Remind me later" confirms. |
| L46<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Add a beneficiary sheet; and 3 more screens<br><sub>`data:attention.beneficiary-missing.title`</sub> | Name a beneficiary for your account | 0.5 | Nothing needs you: not shown<br>Brand-new: not shown | — | New in Phase 6: the one thing that needs Rosa in the default account. |
| L47<br>DRAFT | Alerts (laptop, phone); Add a beneficiary sheet; Add a beneficiary sheet (saved); Beneficiary alert (reminded)<br><sub>`data:attention.beneficiary-missing.body`</sub> | A beneficiary is the person who gets the money in your account if you die. You have not named one yet. Brokerages ask so your money can go to the person you choose, with fewer steps for your family. | 4.3 | Nothing needs you: not shown<br>Brand-new: not shown | — | New in Phase 6: explains what a beneficiary is and why brokerages ask. |
| L48<br>DRAFT | Alerts (laptop, phone); Add a beneficiary sheet; Beneficiary alert (reminded)<br><sub>`data:attention.beneficiary-missing.nextStep`</sub> | You can add one now, or be reminded later. It takes about a minute. | 2.3 | Nothing needs you: not shown<br>Brand-new: not shown | — | New in Phase 6: offers the choice, never pushes it. |
| L49<br>DRAFT | Alerts (laptop, phone); Add a beneficiary sheet; Add a beneficiary sheet (saved)<br><sub>`data:attention.beneficiary-missing.action.label`</sub> | Add a beneficiary | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| L50<br>APPROVED | Alerts (laptop, phone); Home (laptop); Add a beneficiary sheet; and 3 more screens<br><sub>`data:attention.sipc-crypto.title`</sub> | SIPC protection doesn't cover crypto | 0.7 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L51<br>APPROVED | Alerts (laptop, phone); Investments (laptop, phone); Finance Terms (laptop, phone)<br><sub>`data:attention.sipc-crypto.body`</sub> | SIPC protection covers stocks and cash at a member brokerage if the brokerage fails. It doesn't cover crypto, such as Bitcoin or Ethereum. It never covers a drop in price. | 4.9 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| L52<br>APPROVED | Alerts (laptop, phone)<br><sub>`data:attention.sipc-crypto.nextStep`</sub> | Nothing to do. This is just so you know. | -0.7 | Nothing needs you: same<br>Brand-new: not shown | — |  |

### Add a beneficiary

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| M1<br>DRAFT | Alerts (laptop, phone); Add a beneficiary sheet; Add a beneficiary sheet (saved)<br><sub>`shared:beneficiaryFlow.title`</sub> | Add a beneficiary | label | Nothing needs you: not shown<br>Brand-new: not shown | — | New in Phase 6: the beneficiary alert replaces the removed deposit stories; this is its sheet. |
| M2<br>DRAFT | Add a beneficiary sheet<br><sub>`shared:beneficiaryFlow.intro`</sub> | Name the person who would get this account if you die. You can change it at any time. | 1.0 | Nothing needs you: not shown<br>Brand-new: not shown | — | New in Phase 6: the beneficiary sheet explains what it sets. |
| M3<br>DRAFT | Add a beneficiary sheet<br><sub>`shared:beneficiaryFlow.nameLabel`</sub> | Name | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M4<br>DRAFT | Add a beneficiary sheet<br><sub>`shared:beneficiaryFlow.nameError`</sub> | Enter their name. | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M5<br>DRAFT | Add a beneficiary sheet<br><sub>`shared:beneficiaryFlow.relationshipLabel`</sub> | Relationship | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M6<br>DRAFT | Add a beneficiary sheet<br><sub>`shared:beneficiaryFlow.relationshipHint`</sub> | For example, sister, partner or friend. | 6.4 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M7<br>DRAFT | Add a beneficiary sheet<br><sub>`shared:beneficiaryFlow.relationshipError`</sub> | Enter how you know them. | 0.5 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M8<br>DRAFT | Add a beneficiary sheet<br><sub>`shared:beneficiaryFlow.save`</sub> | Save | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M9<br>DRAFT | Add a beneficiary sheet<br><sub>`shared:beneficiaryFlow.cancel`</sub> | Cancel | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| M10<br>DRAFT | Add a beneficiary sheet (saved)<br><sub>`shared:beneficiaryFlow.saved`</sub> | Saved. Ana Ruiz is now the beneficiary of your account. | -0.7 | Nothing needs you: not shown<br>Brand-new: not shown | — | New in Phase 6: the confirmation after saving a beneficiary. |
| M11<br>DRAFT | Add a beneficiary sheet (saved)<br><sub>`shared:beneficiaryFlow.done`</sub> | Done | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |

### Activity

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| V1<br>APPROVED | Activity (laptop, phone)<br><sub>`shared:activity.firstDeposit`</sub> | First deposit | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V2<br>APPROVED | Activity (laptop, phone)<br><sub>`shared:activity.monthlyDeposit`</sub> | Monthly deposit | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V3<br>APPROVED | Home (phone); Activity (laptop, phone)<br><sub>`shared:activity.bought`</sub> | Bought ETH *(and 13 more like it)* | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V4<br>APPROVED | Home (phone); Activity (laptop, phone)<br><sub>`shared:activity.dividend`</sub> | MSFT paid you *(and 20 more like it)* | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V5<br>APPROVED | Activity (laptop, phone)<br><sub>`shared:activity.status.completed`</sub> | Completed | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V6<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`activity:title`</sub> | Activity | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V7<br>APPROVED | Activity<br><sub>`activity:detailTitle`</sub> | Activity item *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| V8<br>APPROVED | Activity (phone)<br><sub>`activity:empty`</sub> | Nothing yet. Your deposits, buys and dividends will show here. *(only in the brand-new account)* | 4.1 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| V9<br>DRAFT | Activity (phone)<br><sub>`activity:filterSummary`</sub> | Type: All. | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V10<br>DRAFT | Activity (phone)<br><sub>`activity:filters`</sub> | Filter | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V11<br>APPROVED | Activity (laptop)<br><sub>`activity:type`</sub> | Type | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V12<br>APPROVED | Activity<br><sub>`activity:showOne`</sub> | Show 1 item *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| V13<br>APPROVED | Activity<br><sub>`activity:showMany`</sub> | Show 2 items *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| V14<br>APPROVED | Activity (laptop, phone)<br><sub>`activity:count`</sub> | Showing 64 of 64. | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V15<br>DRAFT | Activity<br><sub>`activity:none`</sub> | Nothing matches this filter. *(not on a captured screen; example values)* | 3.7 | Same words wherever it shows | — |  |
| V16<br>APPROVED | Activity<br><sub>`activity:showEverything`</sub> | Show everything *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| V17<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`activity:tableLabel`</sub> | Activity | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V18<br>APPROVED | Activity (laptop)<br><sub>`activity:caption`</sub> | Activity, newest first | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V19<br>APPROVED | Home (laptop, phone); Investments (laptop, phone); Your Journey (laptop, phone); Activity (laptop)<br><sub>`activity:col.date`</sub> | Date | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V20<br>APPROVED | Activity (laptop)<br><sub>`activity:col.what`</sub> | What | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V21<br>APPROVED | Activity (laptop, phone); Investments (laptop, phone); Practice (phone)<br><sub>`activity:col.amount`</sub> | Amount | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V22<br>APPROVED | Activity (laptop, phone)<br><sub>`activity:col.status`</sub> | Status | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V23<br>APPROVED | Activity (laptop)<br><sub>`activity:types.all`</sub> | All | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V24<br>APPROVED | Activity (laptop)<br><sub>`activity:types.deposit`</sub> | Deposits | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V25<br>APPROVED | Activity (laptop)<br><sub>`activity:types.buy`</sub> | Buys | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V26<br>APPROVED | Investments (laptop, phone); Activity (laptop)<br><sub>`activity:types.dividend`</sub> | Dividends | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V27<br>APPROVED | Activity (laptop, phone)<br><sub>`activity:allActivity`</sub> | All activity | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V28<br>APPROVED | Activity (laptop, phone); Investments (laptop, phone); Practice (phone)<br><sub>`activity:facts.amount`</sub> | Amount | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V29<br>APPROVED | Activity (laptop, phone)<br><sub>`activity:facts.status`</sub> | Status | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V30<br>APPROVED | Activity (laptop, phone)<br><sub>`activity:facts.arrivedOn`</sub> | Arrived on | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| V31<br>APPROVED | Activity (laptop, phone); Home (laptop); Investments (laptop)<br><sub>`activity:facts.fund`</sub> | Investment | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V32<br>APPROVED | Activity<br><sub>`activity:facts.fundValue`</sub> | AAPL, Rosa *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| V33<br>APPROVED | Activity (laptop, phone)<br><sub>`activity:facts.boughtOn`</sub> | Bought on | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| V34<br>APPROVED | Activity (laptop, phone); Investments (laptop, phone)<br><sub>`activity:facts.price`</sub> | Price | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V35<br>APPROVED | Activity (laptop, phone); Investments (laptop, phone)<br><sub>`activity:facts.shares`</sub> | Shares | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V36<br>APPROVED | Activity (laptop, phone)<br><sub>`activity:facts.settledOn`</sub> | Settled on | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| V37<br>APPROVED | Activity (laptop, phone)<br><sub>`activity:facts.paidOn`</sub> | Paid on | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| V38<br>APPROVED | Activity (laptop, phone); Investments (laptop, phone); Practice (phone)<br><sub>`activity:facts.amountCoin`</sub> | Amount | label | Nothing needs you: same<br>Brand-new: same | — |  |
| V39<br>APPROVED | Activity (laptop, phone)<br><sub>`activity:facts.paid`</sub> | You paid | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| V40<br>APPROVED | Activity (laptop, phone)<br><sub>`activity:buyNote`</sub> | Auto-invest used your deposit to buy it. | 7.4 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| V41<br>APPROVED | Alerts (laptop, phone); Activity (laptop, phone); Add a beneficiary sheet; and 2 more screens<br><sub>`activity:whatItMeans`</sub> | What it means | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| V42<br>APPROVED | Activity<br><sub>`activity:termLine`</sub> | Volatility: How much an investment's price tends to jump around. *(a bare value; example values)* | 3.7 | Not on a captured screen; the values change with the account | — |  |
| V43<br>APPROVED | Activity (phone)<br><sub>`activity:notFound`</sub> | We could not find that item. *(only in the Nothing needs you account)* | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| V44<br>APPROVED | Activity (phone)<br><sub>`activity:notFoundWhy`</sub> | It may have been for another account. *(only in the Nothing needs you account)* | 4.0 | Nothing needs you: same<br>Brand-new: same | — |  |

### Investments

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| F1<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:title`</sub> | Your investments | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F2<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:tableLabel`</sub> | Your investments | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F3<br>APPROVED | Investments (laptop)<br><sub>`funds:caption`</sub> | All investments, with what you have in each | 2.3 | Nothing needs you: same<br>Brand-new: same | — |  |
| F4<br>APPROVED | Activity (laptop, phone); Home (laptop); Investments (laptop)<br><sub>`funds:col.fund`</sub> | Investment | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F5<br>APPROVED | Investments (laptop)<br><sub>`funds:col.kind`</sub> | Kind | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F6<br>DRAFT | Home (phone); Investments (laptop, phone); Finance Terms (laptop, phone)<br><sub>`funds:col.ups`</sub> | Volatility | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F7<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:col.value`</sub> | Your value | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F8<br>APPROVED | Your Journey (laptop, phone); Investments (laptop); Practice (after buying)<br><sub>`funds:col.change`</sub> | Up or down | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F9<br>APPROVED | Investments (laptop, phone); Finance Terms (laptop, phone); Term explanation<br><sub>`funds:kind.stock`</sub> | Stock | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F10<br>APPROVED | Investments (laptop, phone); Home (laptop); Term explanation<br><sub>`funds:kind.crypto`</sub> | Crypto | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F11<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:upsValue`</sub> | Volatility: 2 of 5 *(and 34 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F12<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:notOwned`</sub> | Not owned | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F13<br>APPROVED | Investments (phone)<br><sub>`funds:cardValue`</sub> | Your value: $404.26 · up $54.26 *(and 6 more like it)* | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| F14<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:allFunds`</sub> | All investments | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F15<br>APPROVED | Investments<br><sub>`funds:nameLine`</sub> | Stock *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| F16<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:whatYouHave`</sub> | What you have | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F17<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:vsPaid`</sub> | Up $54.26 on the $350.00 you paid. *(and 6 more like it)* | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| F18<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:facts.value`</sub> | Your value | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F19<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:facts.paid`</sub> | What you paid | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| F20<br>APPROVED | Activity (laptop, phone); Investments (laptop, phone)<br><sub>`funds:facts.shares`</sub> | Shares | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| F21<br>APPROVED | Activity (laptop, phone); Investments (laptop, phone)<br><sub>`funds:facts.price`</sub> | Price | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F22<br>APPROVED | Activity (laptop, phone); Investments (laptop, phone); Practice (phone)<br><sub>`funds:facts.amount`</sub> | Amount | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F23<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:notOwnedYet`</sub> | You don't own any yet. | -1.8 | Nothing needs you: same<br>Brand-new: same | — |  |
| F24<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:priceNow`</sub> | Price: $253.71 a share. *(and 1 more like it)* | label | Nothing needs you: same<br>Brand-new: “Price: $336.13 a share.” | — |  |
| F25<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:chart.title`</sub> | Price over time | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F26<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:chart.summary`</sub> | From March 2, 2026 to Sept. 18, 2026, the price went from $264.72 to $336.13. *(and 9 more like it)* | 6.8 | Nothing needs you: same<br>Brand-new: “From Sept. 19, 2025 to Sept. 18, 2026, the price went from $245.50 to $336.13.” | — |  |
| F27<br>APPROVED | Activity (laptop, phone); Investments (laptop, phone)<br><sub>`funds:chart.series`</sub> | Price | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F28<br>APPROVED | Investments<br><sub>`funds:chart.day`</sub> | Sept. 18: price $336.13. *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| F29<br>APPROVED | Home (laptop, phone); Investments (laptop, phone); Your Journey (laptop, phone); Activity (laptop)<br><sub>`funds:chart.colDate`</sub> | Date | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F30<br>APPROVED | Activity (laptop, phone); Investments (laptop, phone)<br><sub>`funds:chart.colPrice`</sub> | Price | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F31<br>APPROVED | Investments (laptop, phone); Your Journey (laptop, phone); Home (laptop); and 2 more screens<br><sub>`funds:chart.range`</sub> | Time range | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F32<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:chart.since`</sub> | Since you bought | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| F33<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:chart.6m`</sub> | 6 months | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F34<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:chart.1y`</sub> | 1 year | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F35<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:about.heading`</sub> | What it is | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F36<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:ups.heading`</sub> | Volatility: 2 of 5 *(and 4 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F37<br>DRAFT | Home (phone); Investments (laptop, phone); Finance Terms (laptop, phone)<br><sub>`funds:ups.termWord`</sub> | Volatility | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F38<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:ups.scale`</sub> | 1 means its price barely moves. 5 means it moves the most. | 2.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| F39<br>APPROVED | Investments (laptop, phone); Activity (laptop)<br><sub>`funds:dividends.heading`</sub> | Dividends | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F40<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:dividends.intro`</sub> | Apple pays a dividend for each share you own before its ex-dividend date. *(and 4 more like it)* | 1.9 | Nothing needs you: same<br>Brand-new: same | — |  |
| F41<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:dividends.dividendWord`</sub> | dividend | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F42<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:dividends.exDateWord`</sub> | ex-dividend date | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F43<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:dividends.paid`</sub> | $0.26 a share, paid Nov. 13, 2025 *(and 17 more like it)* | 4.0 | Nothing needs you: same<br>Brand-new: same | — |  |
| F44<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:dividends.upcoming`</sub> | $0.25 a share, to be paid Oct. 1, 2026 *(and 1 more like it)* | 3.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| F45<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:dividends.yours`</sub> | You got $0.49 in dividends from it. *(and 4 more like it)* | 4.0 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| F46<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:dividends.none`</sub> | It does not pay dividends. | 2.9 | Nothing needs you: same<br>Brand-new: same | — |  |
| F47<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:sipc.heading`</sub> | Not covered by SIPC protection | 0.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| F48<br>APPROVED | Alerts (laptop, phone); Investments (laptop, phone); Finance Terms (laptop, phone)<br><sub>`funds:sipc.termWord`</sub> | SIPC protection | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F49<br>APPROVED | Alerts (laptop, phone); Investments (laptop, phone); Finance Terms (laptop, phone)<br><sub>`funds:sipc.body`</sub> | SIPC protection covers stocks and cash at a member brokerage if the brokerage fails. It doesn't cover crypto, such as Bitcoin or Ethereum. It never covers a drop in price. | 4.9 | Nothing needs you: same<br>Brand-new: same | — |  |
| F50<br>APPROVED | Investments<br><sub>`funds:notFound`</sub> | We could not find that investment. *(not on a captured screen; example values)* | 2.5 | Same words wherever it shows | — |  |
| F51<br>APPROVED | Investments (laptop, phone)<br><sub>`funds:priceNowCrypto`</sub> | Price: $112.70 for one SOL. | label | Nothing needs you: same<br>Brand-new: “Price: $80,873.58 for one BTC.” | — |  |
| F52<br>DRAFT | Investments (laptop, phone)<br><sub>`funds:lossNote`</sub> | Prices go up and down. What you own can be down for a while and up later, or the other way around. | 2.6 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| F53<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.AAPL.name`</sub> | Apple | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F54<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.AAPL.about`</sub> | Apple makes the iPhone, the Mac and the iPad. It also sells services like app downloads and music. | 4.3 | Nothing needs you: same<br>Brand-new: same | — |  |
| F55<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.MSFT.name`</sub> | Microsoft | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F56<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.MSFT.about`</sub> | Microsoft makes Windows and Office. It also runs a cloud service, where people and businesses pay to use its computers over the internet. | 7.9 | Nothing needs you: same<br>Brand-new: same | — |  |
| F57<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.NVDA.name`</sub> | NVIDIA | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F58<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.NVDA.about`</sub> | NVIDIA designs computer chips. People use them for video games and to build AI. | 4.0 | Nothing needs you: same<br>Brand-new: same | — |  |
| F59<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.COST.name`</sub> | Costco | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F60<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.COST.about`</sub> | Costco runs warehouse stores and websites. Shoppers pay a yearly fee to be members. | 4.8 | Nothing needs you: same<br>Brand-new: same | — |  |
| F61<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.NKE.name`</sub> | Nike | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F62<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.NKE.about`</sub> | Nike designs and sells sports shoes, clothes and gear. Other companies make most of it. | 2.3 | Nothing needs you: same<br>Brand-new: same | — |  |
| F63<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.AMZN.name`</sub> | Amazon | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F64<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.AMZN.about`</sub> | Amazon runs stores online and in person. It also rents out its computers over the internet. | 6.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| F65<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.TSLA.name`</sub> | Tesla | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F66<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.TSLA.about`</sub> | Tesla makes electric cars. It also makes batteries that store power for homes and businesses. | 6.2 | Nothing needs you: same<br>Brand-new: same | — |  |
| F67<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.BTC.name`</sub> | Bitcoin | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F68<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.BTC.about`</sub> | Bitcoin is a digital currency. No company or bank runs it. | 5.9 | Nothing needs you: same<br>Brand-new: same | — |  |
| F69<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.ETH.name`</sub> | Ethereum | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F70<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.ETH.about`</sub> | Ethereum is a computer network. It has its own digital currency, called ether. People also run programs on it. | 6.8 | Nothing needs you: same<br>Brand-new: same | — |  |
| F71<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.SOL.name`</sub> | Solana | label | Nothing needs you: same<br>Brand-new: same | — |  |
| F72<br>APPROVED | Investments (laptop, phone)<br><sub>`data:funds.SOL.about`</sub> | Solana is a computer network. It has its own digital currency, called SOL. People also run programs on it. | 6.1 | Nothing needs you: same<br>Brand-new: same | — |  |

### Your Journey

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| S1<br>DRAFT | Your Journey (laptop, phone); Home (laptop); Alerts (laptop); and 13 more screens<br><sub>`story:title`</sub> | Your Journey | label | Nothing needs you: same<br>Brand-new: same | — | Renamed in Phase 6: "Your money story" is now "Your Journey". |
| S2<br>DRAFT | Your Journey (laptop, phone); Sections sheet<br><sub>`story:sections`</sub> | Sections | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S3<br>DRAFT | Your Journey (laptop, phone); Sections sheet<br><sub>`story:sectionNum`</sub> | Section 1 *(and 7 more like it)* | label | Nothing needs you: same<br>Brand-new: “Section 1” | — |  |
| S4<br>DRAFT | Your Journey (laptop, phone); Sections sheet<br><sub>`story:names.1`</sub> | Six months in | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S5<br>DRAFT | Your Journey (laptop, phone); Sections sheet<br><sub>`story:names.2`</sub> | The dip in June *(and 1 more like it)* | -2.2 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S6<br>DRAFT | Your Journey (laptop, phone); Sections sheet<br><sub>`story:names.3`</sub> | Start early | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S7<br>DRAFT | Your Journey (laptop, phone); Sections sheet<br><sub>`story:names.4`</sub> | Try it | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S8<br>DRAFT | Your Journey (phone)<br><sub>`story:names.2new`</sub> | The dip *(only in the brand-new account)* | label | Nothing needs you: not shown<br>Brand-new: same | — |  |
| S9<br>DRAFT | Your Journey (laptop, phone); Sections sheet<br><sub>`story:next`</sub> | Next: The dip in June *(and 2 more like it)* | label | Nothing needs you: same<br>Brand-new: “Next: The dip” | — | New in Phase 6: every section ends with a button to the next one. |
| S10<br>DRAFT | Your Journey (phone)<br><sub>`story:newClaim`</sub> | Once your first deposit arrives, this page will show how your money has moved. *(only in the brand-new account)* | 5.0 | Nothing needs you: not shown<br>Brand-new: same | — |  |
| S11<br>DRAFT | Your Journey (laptop, phone); Sections sheet<br><sub>`story:one.rateLine`</sub> | Shown as a percent, what it earned is called your rate of return. | 1.6 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S12<br>DRAFT | Your Journey (laptop, phone); Sections sheet<br><sub>`story:one.rateWord`</sub> | rate of return | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S13<br>APPROVED | Your Journey (laptop, phone); Sections sheet<br><sub>`story:sinceMarch.chartTitle`</sub> | Your balance since March | 0.7 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S14<br>APPROVED | Your Journey (laptop, phone); Sections sheet<br><sub>`story:sinceMarch.summary`</sub> | From March 2 to Sept. 18, your balance went from $499.88 to $1,536.68. | 5.8 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S15<br>APPROVED | Your Journey (laptop, phone); Sections sheet<br><sub>`story:sinceMarch.layers`</sub> | Show what you put in and what it earned | -0.3 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S16<br>APPROVED | Home (laptop, phone); Investments (laptop, phone); Your Journey (laptop, phone); Activity (laptop)<br><sub>`story:sinceMarch.colDate`</sub> | Date | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S17<br>APPROVED | Home (laptop, phone); Your Journey (laptop, phone); Term explanation<br><sub>`story:sinceMarch.colBalance`</sub> | Balance | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S18<br>APPROVED | Home (laptop, phone); Your Journey (laptop, phone); Term explanation<br><sub>`story:sinceMarch.colMoneyIn`</sub> | You put in | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S19<br>APPROVED | Home (laptop, phone); Your Journey (laptop, phone)<br><sub>`story:sinceMarch.colEarned`</sub> | It earned | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S20<br>DRAFT | Your Journey<br><sub>`story:sinceMarch.chartTitle1m`</sub> | Your balance in the last month *(not on a captured screen; example values)* | 0.5 | Same words wherever it shows | — |  |
| S21<br>DRAFT | Your Journey<br><sub>`story:sinceMarch.chartTitle3m`</sub> | Your balance in the last 3 months *(not on a captured screen; example values)* | 2.3 | Same words wherever it shows | — |  |
| S22<br>DRAFT | Your Journey (laptop, phone); Sections sheet<br><sub>`story:sinceMarch.layersOn`</sub> | The flat layer is what you put in, and the grainy layer above it is what it earned. | 5.9 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S23<br>DRAFT | Your Journey<br><sub>`story:sinceMarch.layersOff`</sub> | The chart shows your balance as one line. *(not on a captured screen; example values)* | 0.8 | Same words wherever it shows | — |  |
| S24<br>APPROVED | Your Journey (laptop, phone)<br><sub>`story:dip.high`</sub> | May 21: Your investments started to fall. | 2.9 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S25<br>APPROVED | Your Journey (laptop, phone)<br><sub>`story:dip.low`</sub> | June 5: The fall hit its low. | -1.8 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S26<br>APPROVED | Your Journey (laptop, phone)<br><sub>`story:dip.backAbove`</sub> | June 15: Your balance was back above what you had put in. | 2.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S27<br>APPROVED | Your Journey (laptop, phone)<br><sub>`story:dip.depositInvested`</sub> | June 1: Your deposit bought your mix. *(and 3 more like it)* | 2.9 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S28<br>APPROVED | Your Journey (laptop, phone)<br><sub>`story:dip.summary`</sub> | Your balance from April 15 to Sept. 18, with the dip and what came after. | 6.0 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S29<br>APPROVED | Home (laptop, phone); Investments (laptop, phone); Your Journey (laptop, phone); Activity (laptop)<br><sub>`story:dip.colDate`</sub> | Date | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S30<br>APPROVED | Home (laptop, phone); Your Journey (laptop, phone); Term explanation<br><sub>`story:dip.colBalance`</sub> | Balance | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S31<br>APPROVED | Home (laptop, phone); Your Journey (laptop, phone); Term explanation<br><sub>`story:dip.colMoneyIn`</sub> | You put in | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S32<br>APPROVED | Your Journey (laptop, phone); Investments (laptop); Practice (after buying)<br><sub>`story:dip.colDiff`</sub> | Up or down | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S33<br>APPROVED | Your Journey (laptop, phone)<br><sub>`story:dip.chartTitle`</sub> | The dip and what came after | 0.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S34<br>APPROVED | Your Journey (laptop, phone)<br><sub>`story:dip.showEvents`</sub> | Show events on the chart | 0.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S35<br>APPROVED | Your Journey (laptop, phone)<br><sub>`story:dip.eventsLabel`</sub> | Events on the chart | 0.7 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S36<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:dip.eventsOn`</sub> | A diamond marks each event, and the list below the chart names them. | 4.0 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S37<br>DRAFT | Your Journey<br><sub>`story:dip.eventsOff`</sub> | The chart shows your balance without the events. *(not on a captured screen; example values)* | 3.8 | Same words wherever it shows | — |  |
| S38<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:dip.dcaLine`</sub> | Buying the same amount every month is called dollar-cost averaging. | 5.0 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S39<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:dip.dcaWord`</sub> | dollar-cost averaging | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| S40<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:startEarly.meet`</sub> | Nia starts at 22 with $100 a month. Theo starts at 32 with $150. | 2.3 | Nothing needs you: same<br>Brand-new: same | — |  |
| S41<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:startEarly.why`</sub> | Nia puts in less, but her money has 10 more years of compounding. | 3.1 | Nothing needs you: same<br>Brand-new: same | — |  |
| S42<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:startEarly.compoundingWord`</sub> | compounding | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S43<br>DRAFT | Your Journey<br><sub>`story:startEarly.theoAge`</sub> | Theo's start age *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| S44<br>DRAFT | Your Journey<br><sub>`story:startEarly.theoMonthly`</sub> | Theo each month *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| S45<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:startEarly.startAt`</sub> | Start at 18 *(and 2 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S46<br>DRAFT | Your Journey (laptop, phone); Finance Terms (laptop, phone)<br><sub>`story:startEarly.perMonth`</sub> | $150 a month *(and 3 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S47<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:startEarly.passesMark`</sub> | Passes Nia: $196 | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S48<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:startEarly.result`</sub> | At 65, Theo has $186,213. Nia has $242,251. | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S49<br>DRAFT | Your Journey<br><sub>`story:startEarly.passes`</sub> |  Theo passes Nia. *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| S50<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:startEarly.behind`</sub> | Theo is still behind. | 0.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| S51<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:startEarly.chartTitle`</sub> | Nia and Theo from 18 to 65 *(and 1 more like it)* | 2.3 | Nothing needs you: same<br>Brand-new: same | — |  |
| S52<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:startEarly.nia`</sub> | Nia | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S53<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:startEarly.theo`</sub> | Theo | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S54<br>DRAFT | Your Journey<br><sub>`story:startEarly.day`</sub> | Age 30: Nia has $242,251. $186,213 *(not on a captured screen; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| S55<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:startEarly.theoHas`</sub> | Theo has $186,213. | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S56<br>DRAFT | Your Journey<br><sub>`story:startEarly.theoNotYet`</sub> | Theo has not started yet. *(not on a captured screen; example values)* | -1.8 | Same words wherever it shows | — |  |
| S57<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:startEarly.notStarted`</sub> | Not started | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S58<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:startEarly.colAge`</sub> | Age | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S59<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:tryIt.claim`</sub> | Practice lets you try a mix with practice money. Nothing you do there touches your account. | 3.0 | Nothing needs you: same<br>Brand-new: same | — |  |
| S60<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:tryIt.timeMachine`</sub> | Its time machine shows how a mix could have moved over the last year. | 3.4 | Nothing needs you: same<br>Brand-new: same | — |  |
| S61<br>DRAFT | Your Journey (laptop, phone)<br><sub>`story:tryIt.go`</sub> | Go to Practice | label | Nothing needs you: same<br>Brand-new: same | — |  |
| S62<br>APPROVED | Your Journey<br><sub>`story:slider.label`</sub> | Start age: Start at 30 *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| S63<br>APPROVED | Your Journey (laptop, phone); Sections sheet<br><sub>`data:rosaStory.pointOfView`</sub> | Right now, almost all of your balance is money you put in. Growth needs years, so starting early and staying steady matter more than picking the perfect moment. | 6.3 | Nothing needs you: same<br>Brand-new: “Growth needs years. Starting early and staying steady matter more than picking the perfect moment.” | — |  |
| S64<br>DRAFT | Your Journey (laptop, phone); Sections sheet<br><sub>`data:rosaStory.deposits-share`</sub> | About 91% of your balance is money you put in. The other $136.68 is what it earned. | 3.7 | Nothing needs you: same<br>Brand-new: not shown (short story) | — |  |
| S65<br>APPROVED | Your Journey (laptop, phone)<br><sub>`data:rosaStory.dip`</sub> | From May 21 to June 5, falling prices took $80.24 off your balance. That is a drop of 9.5%. | 3.6 | Nothing needs you: same<br>Brand-new: not shown (short story) | — |  |
| S66<br>DRAFT | Your Journey (laptop, phone)<br><sub>`data:rosaStory.kept-buying`</sub> | Auto-invest kept buying through the dip. Your June 1, July 1, Aug. 3 and Sept. 1 deposits each bought your mix the day they arrived. | 6.7 | Nothing needs you: same<br>Brand-new: not shown (short story) | — |  |
| S67<br>APPROVED | Your Journey (laptop, phone)<br><sub>`data:story.assumptions.note`</sub> | An example rate of 6% a year. Real markets go up and down, and nobody can promise a rate. | 4.3 | Nothing needs you: same<br>Brand-new: same | — |  |

### Practice

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| P1<br>APPROVED | Practice<br><sub>`shared:practiceErrors.min`</sub> | Enter an amount of $1 or more. *(not on a captured screen; example values)* | 4.0 | Same words wherever it shows | — |  |
| P2<br>APPROVED | Practice<br><sub>`shared:practiceErrors.notNumber`</sub> | Enter a number, like 25 or 25.50. *(not on a captured screen; example values)* | 5.7 | Same words wherever it shows | — |  |
| P3<br>APPROVED | Practice (error)<br><sub>`shared:practiceErrors.decimals`</sub> | Use no more than 2 decimals, like 25.50. | 5.2 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P4<br>APPROVED | Practice<br><sub>`shared:practiceErrors.notEnough`</sub> | You have $452.11 in practice money. Enter that much or less. *(not on a captured screen; example values)* | 2.6 | Not on a captured screen; the values change with the account | — |  |
| P5<br>APPROVED | Practice<br><sub>`shared:practiceErrors.noneOwned`</sub> | You do not own any AAPL in Practice, so there is nothing to sell. Pick one you own. *(not on a captured screen; example values)* | 1.0 | Not on a captured screen; the values change with the account | — |  |
| P6<br>APPROVED | Practice<br><sub>`shared:practiceErrors.tooMuch`</sub> | You own $246.92 of AAPL in Practice. Enter that much or less. *(not on a captured screen; example values)* | 1.5 | Not on a captured screen; the values change with the account | — |  |
| P7<br>APPROVED | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`practice:title`</sub> | Practice | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P8<br>APPROVED | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:banner`</sub> | Practice money. Nothing here touches your account. | 4.3 | Nothing needs you: same<br>Brand-new: same | — |  |
| P9<br>APPROVED | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:sum.left`</sub> | Practice money left | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P10<br>APPROVED | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:sum.inFunds`</sub> | In practice investments | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P11<br>APPROVED | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:sum.total`</sub> | Total in Practice | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P12<br>APPROVED | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:ownHeading`</sub> | What you own in Practice | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| P13<br>APPROVED | Practice (laptop, phone); Practice (error)<br><sub>`practice:ownEmpty`</sub> | Nothing yet. Buy a stock or crypto to start. | -0.7 | Nothing needs you: same<br>Brand-new: same | — |  |
| P14<br>APPROVED | Activity (laptop, phone); Home (laptop); Investments (laptop)<br><sub>`practice:col.fund`</sub> | Investment | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P15<br>APPROVED | Practice (after buying)<br><sub>`practice:col.shares`</sub> | Owned | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P16<br>APPROVED | Practice (laptop, phone); Practice (after buying)<br><sub>`practice:col.value`</sub> | Value | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P17<br>APPROVED | Practice (after buying)<br><sub>`practice:col.paid`</sub> | Paid | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P18<br>APPROVED | Your Journey (laptop, phone); Investments (laptop); Practice (after buying)<br><sub>`practice:col.change`</sub> | Up or down | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P19<br>APPROVED | Practice (after buying)<br><sub>`practice:mixHeading`</sub> | Your practice mix | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P20<br>APPROVED | Practice<br><sub>`practice:percent`</sub> | 52% *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| P21<br>APPROVED | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:timeMachine.title`</sub> | Time machine | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P22<br>APPROVED | Practice (after buying)<br><sub>`practice:timeMachine.summary`</sub> | If you had held this mix since Sept. 26, 2025, it would be worth $100.00 on Sept. 18, 2026. On Sept. 26, 2025 it would have been worth $78.51. | 5.1 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P23<br>APPROVED | Practice (laptop, phone); Practice (error)<br><sub>`practice:timeMachine.empty`</sub> | Buy an investment to see how your mix would have moved. | 2.6 | Nothing needs you: same<br>Brand-new: same | — |  |
| P24<br>APPROVED | Practice (laptop, phone)<br><sub>`practice:timeMachine.colWeek`</sub> | Week of | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P25<br>APPROVED | Practice (laptop, phone); Practice (after buying)<br><sub>`practice:timeMachine.colValue`</sub> | Value | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P26<br>APPROVED | Practice (after buying)<br><sub>`practice:timeMachine.series`</sub> | Your practice mix | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P27<br>APPROVED | Practice<br><sub>`practice:timeMachine.day`</sub> | Sept. 18: your practice mix would be worth $246.92. *(not on a captured screen; example values)* | 3.7 | Not on a captured screen; the values change with the account | — |  |
| P28<br>APPROVED | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:startOver`</sub> | Start over | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P29<br>APPROVED | Practice<br><sub>`practice:startOverTitle`</sub> | Start over? *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| P30<br>APPROVED | Practice<br><sub>`practice:startOverBody`</sub> | This clears your practice investments and sets your practice money back to $150. *(not on a captured screen; example values)* | 6.7 | Not on a captured screen; the values change with the account | — |  |
| P31<br>APPROVED | Add a beneficiary sheet<br><sub>`practice:cancel`</sub> | Cancel | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P32<br>APPROVED | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`practice:order.title`</sub> | Place an order | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P33<br>APPROVED | Practice (laptop, phone); Practice (error)<br><sub>`practice:order.side`</sub> | Buy or sell | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P34<br>APPROVED | Practice (laptop, phone); Practice (error)<br><sub>`practice:order.buy`</sub> | Buy | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P35<br>APPROVED | Practice (laptop, phone); Practice (error)<br><sub>`practice:order.sell`</sub> | Sell | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P36<br>APPROVED | Practice (laptop, phone); Practice (error)<br><sub>`practice:order.pickFund`</sub> | Pick an investment | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P37<br>APPROVED | Practice (laptop); Practice (error)<br><sub>`practice:order.amountLabel`</sub> | Amount in dollars | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P38<br>APPROVED | Practice (laptop); Practice (error)<br><sub>`practice:order.dollar`</sub> | $ | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P39<br>APPROVED | Activity (laptop, phone); Investments (laptop, phone); Practice (phone)<br><sub>`practice:order.phoneAmountLabel`</sub> | Amount | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P40<br>APPROVED | Practice<br><sub>`practice:order.phoneAmount`</sub> | $150 *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| P41<br>APPROVED | Practice (phone)<br><sub>`practice:order.keypad`</sub> | Number keypad | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P42<br>APPROVED | Practice (phone)<br><sub>`practice:order.delete`</sub> | Delete | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P43<br>APPROVED | Practice (phone)<br><sub>`practice:order.decimal`</sub> | Decimal point | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P44<br>APPROVED | Practice (laptop, phone); Practice (error)<br><sub>`practice:order.review`</sub> | Review | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P45<br>APPROVED | Practice<br><sub>`practice:order.checkOrder`</sub> | Check your order *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| P46<br>APPROVED | Practice<br><sub>`practice:order.reviewBuy`</sub> | Buy $150 of AAPL at $336.13 a share. That is about {quantity} shares. *(not on a captured screen; example values)* | 1.5 | Not on a captured screen; the values change with the account | — |  |
| P47<br>APPROVED | Practice<br><sub>`practice:order.reviewSell`</sub> | Sell $150 of AAPL at $336.13 a share. That is about {quantity} shares. *(not on a captured screen; example values)* | 1.5 | Not on a captured screen; the values change with the account | — |  |
| P48<br>APPROVED | Practice<br><sub>`practice:order.noFee`</sub> |  There is no fee. *(not on a captured screen; example values)* | -2.2 | Same words wherever it shows | — |  |
| P49<br>DRAFT | Practice<br><sub>`practice:order.marketLine`</sub> | It is a market order, filled at the latest price. *(not on a captured screen; example values)* | 1.0 | Same words wherever it shows | — |  |
| P50<br>DRAFT | Practice<br><sub>`practice:order.orderWord`</sub> | market order *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| P51<br>APPROVED | Practice<br><sub>`practice:order.back`</sub> | Back *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| P52<br>APPROVED | Practice<br><sub>`practice:order.confirm`</sub> | Confirm *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| P53<br>APPROVED | Practice (after buying)<br><sub>`practice:order.bought`</sub> | You bought $100.00 of AAPL with practice money. | 3.8 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P54<br>APPROVED | Practice<br><sub>`practice:order.sold`</sub> | You sold $150 of AAPL. That money is back in your practice money. *(not on a captured screen; example values)* | 2.4 | Not on a captured screen; the values change with the account | — |  |
| P55<br>APPROVED | Practice (after buying)<br><sub>`practice:order.newOrder`</sub> | New order | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| P56<br>APPROVED | Practice<br><sub>`practice:order.reviewBuyCrypto`</sub> | Buy $150 of AAPL at $336.13 for one AAPL. That is about {quantity}. *(not on a captured screen; example values)* | 1.5 | Not on a captured screen; the values change with the account | — |  |
| P57<br>APPROVED | Practice<br><sub>`practice:order.reviewSellCrypto`</sub> | Sell $150 of AAPL at $336.13 for one AAPL. That is about {quantity}. *(not on a captured screen; example values)* | 1.5 | Not on a captured screen; the values change with the account | — |  |
| P58<br>APPROVED | Finance Terms (laptop, phone); Term explanation; Practice (after buying)<br><sub>`practice:ownedShares`</sub> | 0.2975 shares *(and 10 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| P59<br>APPROVED | Practice (laptop, phone); Practice (error); Practice (after buying)<br><sub>`data:practice.timeMachine.note`</sub> | This uses past prices to show how a mix could have moved. The past does not tell you what will happen next. | 1.0 | Nothing needs you: same<br>Brand-new: same | — |  |

### Finance Terms

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| W1<br>DRAFT | Finance Terms (laptop, phone); Home (laptop); Alerts (laptop); and 12 more screens<br><sub>`learn:title`</sub> | Finance Terms | label | Nothing needs you: same<br>Brand-new: same | — | Renamed in Phase 6: "Words" is now "Finance Terms". |
| W2<br>DRAFT | Finance Terms (laptop, phone); Finance Terms (no match)<br><sub>`learn:search`</sub> | Search finance terms | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W3<br>DRAFT | Finance Terms<br><sub>`learn:countOne`</sub> | 1 term *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| W4<br>DRAFT | Home (phone); Alerts (phone); Activity (phone); and 4 more screens<br><sub>`learn:countMany`</sub> | Search finance terms *(and 6 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W5<br>DRAFT | Finance Terms (no match)<br><sub>`learn:none`</sub> | No terms match “zebra”. Try “stock” or “crypto”. | -2.2 | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| W6<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`learn:allWords`</sub> | All finance terms | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W7<br>APPROVED | Finance Terms (laptop, phone); Term explanation<br><sub>`learn:alsoCalled`</sub> | Also called market value *(and 6 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W8<br>APPROVED | Finance Terms (laptop, phone); Term explanation<br><sub>`learn:example`</sub> | Example: 3 shares at a closing price of $20 each are $60 invested. *(and 14 more like it)* | 4.8 | Nothing needs you: same<br>Brand-new: same | — |  |
| W9<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`learn:related`</sub> | Related terms | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W10<br>APPROVED | Finance Terms (laptop, phone); Term explanation<br><sub>`learn:source`</sub> | Source: IRS: Retirement topics, beneficiary *(and 2 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W11<br>APPROVED | Investments (laptop, phone); Finance Terms (laptop, phone); Term explanation<br><sub>`learn:newTab`</sub> | (opens in a new tab) | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| W12<br>DRAFT | Finance Terms<br><sub>`learn:notFound`</sub> | We could not find that term. *(not on a captured screen; example values)* | -1.4 | Same words wherever it shows | — |  |
| W13<br>DRAFT | Finance Terms<br><sub>`learn:notFoundWhy`</sub> | Try searching for it in Finance Terms. *(not on a captured screen; example values)* | 2.3 | Same words wherever it shows | — |  |
| W14<br>APPROVED | Finance Terms (laptop, phone); Term explanation<br><sub>`learn:labelWord`</sub> | Example: | label | Nothing needs you: same<br>Brand-new: same | — |  |
| W15<br>DRAFT | Home (laptop, phone); Finance Terms (laptop, phone); Term explanation<br><sub>`data:glossary.invested.term`</sub> | Invested | label | Same in every scenario | — |  |
| W16<br>DRAFT | Finance Terms (laptop, phone); Term explanation<br><sub>`data:glossary.invested.alsoCalled`</sub> | market value | label | Same in every scenario | — |  |
| W17<br>DRAFT | Home (phone); Finance Terms (laptop, phone); Term explanation<br><sub>`data:glossary.invested.short`</sub> | What the stocks and crypto you own are worth today. | 1.3 | Same in every scenario | — | New in Phase 6: "Invested" is the term on the dark card, from Investor.gov. |
| W18<br>DRAFT | Finance Terms (laptop, phone); Term explanation<br><sub>`data:glossary.invested.detail`</sub> | The value today of the stocks and crypto you own. It goes up and down as their prices change, so it can be more or less than the money you put in. | 3.6 | Same in every scenario | — |  |
| W19<br>DRAFT | Finance Terms (laptop, phone); Term explanation<br><sub>`data:glossary.invested.example`</sub> | 3 shares at a closing price of $20 each are $60 invested. | 4.8 | Same in every scenario | — |  |
| W20<br>APPROVED | Investments (laptop, phone); Finance Terms (laptop, phone); Term explanation<br><sub>`data:glossary.stock.term`</sub> | Stock | label | Same in every scenario | — |  |
| W21<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.stock.alsoCalled`</sub> | shares of a company | label | Same in every scenario | — |  |
| W22<br>APPROVED | Finance Terms (laptop, phone)<br><sub>`data:glossary.stock.short`</sub> | A small piece of a company that you can own. | 2.5 | Same in every scenario | — |  |
| W23<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.stock.detail`</sub> | When the company does well, its stock can grow. It can also drop fast. That is why a stock's price goes up and down. | 0.8 | Same in every scenario | — |  |
| W24<br>APPROVED | Finance Terms (laptop, phone)<br><sub>`data:glossary.stock.example`</sub> | Owning one share of Apple means you own a tiny piece of Apple. | 4.9 | Same in every scenario | — |  |
| W25<br>APPROVED | Activity (laptop, phone); Investments (phone); Finance Terms (laptop, phone); Term explanation<br><sub>`data:glossary.share.term`</sub> | Share | label | Same in every scenario | — |  |
| W26<br>DRAFT | Activity (laptop, phone); Finance Terms (laptop, phone)<br><sub>`data:glossary.share.short`</sub> | One unit of a company's stock that you can buy or sell. | 3.8 | Same in every scenario | — |  |
| W27<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.share.detail`</sub> | Each share has a price. When the price goes up, every share you own is worth more. You can also own part of a share. | 0.9 | Same in every scenario | — |  |
| W28<br>APPROVED | Finance Terms (laptop, phone)<br><sub>`data:glossary.share.example`</sub> | If one share costs $50 and you own 2 shares, you have $100. | 4.0 | Same in every scenario | — |  |
| W29<br>DRAFT | Alerts (laptop, phone); Investments (phone); Finance Terms (laptop, phone); Term explanation<br><sub>`data:glossary.cryptocurrency.term`</sub> | Cryptocurrency | label | Same in every scenario | — |  |
| W30<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.cryptocurrency.alsoCalled`</sub> | crypto, crypto asset | label | Same in every scenario | — |  |
| W31<br>DRAFT | Alerts (laptop, phone); Finance Terms (laptop, phone)<br><sub>`data:glossary.cryptocurrency.short`</sub> | Digital money that no government or bank runs. | 6.7 | Same in every scenario | — |  |
| W32<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.cryptocurrency.detail`</sub> | It lives on a network of computers. Its price can swing a lot in a single day. It trades every day, even on weekends. | 3.3 | Same in every scenario | — |  |
| W33<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.cryptocurrency.example`</sub> | Bitcoin and Ethereum are two kinds of crypto. | 3.8 | Same in every scenario | — |  |
| W34<br>APPROVED | Activity (laptop, phone); Investments (phone); Finance Terms (laptop, phone)<br><sub>`data:glossary.dividend.term`</sub> | Dividend | label | Same in every scenario | — |  |
| W35<br>APPROVED | Activity (laptop, phone); Finance Terms (laptop, phone)<br><sub>`data:glossary.dividend.short`</sub> | A small payment some companies make to the people who own their stock. | 4.9 | Same in every scenario | — |  |
| W36<br>APPROVED | Finance Terms (laptop, phone)<br><sub>`data:glossary.dividend.detail`</sub> | A company can share part of what it earns with its owners. It pays a set amount for each share you owned before a certain date. In First Leaf, the payment lands in your cash. | 3.1 | Same in every scenario | — |  |
| W37<br>APPROVED | Finance Terms (laptop, phone)<br><sub>`data:glossary.dividend.example`</sub> | A company pays 27 cents a share. If you own 2 shares, you get 54 cents. | 3.0 | Same in every scenario | — |  |
| W38<br>DRAFT | Activity (laptop, phone); Investments (phone); Finance Terms (laptop, phone)<br><sub>`data:glossary.ex-dividend-date.term`</sub> | Ex-dividend date | label | Same in every scenario | — |  |
| W39<br>DRAFT | Activity (laptop, phone); Finance Terms (laptop, phone)<br><sub>`data:glossary.ex-dividend-date.short`</sub> | The date that decides who gets the next dividend. | 1.0 | Same in every scenario | — |  |
| W40<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.ex-dividend-date.detail`</sub> | A company sets this date for each dividend it pays. If you own a share before that date, you get the payment. If you buy on or after it, you wait for the next one. | 2.4 | Same in every scenario | — |  |
| W41<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.ex-dividend-date.example`</sub> | Say the date is Nov. 10. You must own the share by Nov. 9 to get that payment. | 1.7 | Same in every scenario | — |  |
| W42<br>DRAFT | Home (phone); Investments (laptop, phone); Finance Terms (laptop, phone)<br><sub>`data:glossary.volatility.term`</sub> | Volatility | label | Same in every scenario | — |  |
| W43<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.volatility.short`</sub> | How much an investment's price tends to jump around. | 3.7 | Same in every scenario | — |  |
| W44<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.volatility.detail`</sub> | We rate each one from 1, calm, to 5, bumpy, using how much its price moved each day over the past year. Bumpy ones can grow more over time, but they can also fall more on a bad day. | 6.2 | Same in every scenario | — |  |
| W45<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.volatility.example`</sub> | Costco is a 1. Solana is a 5. | label | Same in every scenario | — |  |
| W46<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.compounding.term`</sub> | Compounding | label | Same in every scenario | — |  |
| W47<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.compounding.alsoCalled`</sub> | growth on growth, compound interest | label | Same in every scenario | — |  |
| W48<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.compounding.short`</sub> | When your money earns money, and then that new money earns money too. | 4.9 | Same in every scenario | — |  |
| W49<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.compounding.detail`</sub> | It starts small and speeds up over time, like a snowball rolling downhill. The more years it has, the bigger it gets. | 3.2 | Same in every scenario | — |  |
| W50<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.compounding.example`</sub> | $100 that grows 6% becomes $106. The next year, the 6% is on $106, not $100. | 4.5 | Same in every scenario | — |  |
| W51<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.rate-of-return.term`</sub> | Rate of return | label | Same in every scenario | — |  |
| W52<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.rate-of-return.alsoCalled`</sub> | return | label | Same in every scenario | — |  |
| W53<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.rate-of-return.short`</sub> | How much your money grew or shrank, shown as a percent. | 2.6 | Same in every scenario | — |  |
| W54<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.rate-of-return.detail`</sub> | A percent makes it easy to compare big and small amounts. A 5% return on $100 is $5. A 5% return on $1,000 is $50. | 4.2 | Same in every scenario | — |  |
| W55<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.rate-of-return.example`</sub> | Up $5 on $100 is a 5% rate of return. | 3.8 | Same in every scenario | — |  |
| W56<br>DRAFT | Activity (laptop, phone); Finance Terms (laptop, phone)<br><sub>`data:glossary.dollar-cost-averaging.term`</sub> | Dollar-cost averaging | label | Same in every scenario | — |  |
| W57<br>DRAFT | Activity (laptop, phone); Finance Terms (laptop, phone)<br><sub>`data:glossary.dollar-cost-averaging.short`</sub> | Buying the same dollar amount on a set schedule, whatever the price. | 7.8 | Same in every scenario | — |  |
| W58<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.dollar-cost-averaging.detail`</sub> | When prices are low, the same dollars buy more shares. When prices are high, they buy fewer. Auto-invest does this with each monthly deposit. | 3.3 | Same in every scenario | — |  |
| W59<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.dollar-cost-averaging.example`</sub> | $150 on the first of each month buys more shares in a month when prices dipped. | 3.2 | Same in every scenario | — |  |
| W60<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.market-order.term`</sub> | Market order | label | Same in every scenario | — |  |
| W61<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.market-order.short`</sub> | An order to buy or sell right away at the current price. | 3.8 | Same in every scenario | — |  |
| W62<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.market-order.detail`</sub> | It fills fast, but the price can be a little different from the last price you saw. Practice fills each order at the latest price. | 3.9 | Same in every scenario | — |  |
| W63<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.market-order.example`</sub> | A market order for $50 of a stock buys $50 of it at the current price. | 4.4 | Same in every scenario | — |  |
| W64<br>DRAFT | Activity (laptop, phone); Finance Terms (laptop, phone)<br><sub>`data:glossary.settlement.term`</sub> | Settlement | label | Same in every scenario | — |  |
| W65<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.settlement.alsoCalled`</sub> | settling, T+1 | label | Same in every scenario | — |  |
| W66<br>APPROVED | Activity (laptop, phone); Finance Terms (laptop, phone)<br><sub>`data:glossary.settlement.short`</sub> | The short wait after you buy or sell before the trade is final. | 4.0 | Same in every scenario | — |  |
| W67<br>APPROVED | Finance Terms (laptop, phone)<br><sub>`data:glossary.settlement.detail`</sub> | In the U.S., most trades are final one business day later. Until then, the trade shows as settling. | 3.0 | Same in every scenario | — |  |
| W68<br>APPROVED | Finance Terms (laptop, phone)<br><sub>`data:glossary.settlement.example`</sub> | You buy on Monday. It is final on Tuesday. | 1.9 | Same in every scenario | — |  |
| W69<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Finance Terms (laptop, phone); and 3 more screens<br><sub>`data:glossary.brokerage-account.term`</sub> | Brokerage account | label | Same in every scenario | — |  |
| W70<br>DRAFT | Alerts (laptop, phone); Activity (laptop, phone); Finance Terms (laptop, phone); and 3 more screens<br><sub>`data:glossary.brokerage-account.short`</sub> | An account you use to buy, sell and hold stocks and other investments. | 4.9 | Same in every scenario | — |  |
| W71<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.brokerage-account.detail`</sub> | A brokerage holds your investments and your cash for you. Your First Leaf starter account is a brokerage account. | 3.7 | Same in every scenario | — |  |
| W72<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.brokerage-account.example`</sub> | You put money into your brokerage account, then buy shares with it. | 2.6 | Same in every scenario | — |  |
| W73<br>DRAFT | Alerts (laptop, phone); Finance Terms (laptop, phone); Add a beneficiary sheet; and 2 more screens<br><sub>`data:glossary.beneficiary.term`</sub> | Beneficiary | label | Same in every scenario | — |  |
| W74<br>DRAFT | Alerts (laptop, phone); Finance Terms (laptop, phone); Add a beneficiary sheet; and 2 more screens<br><sub>`data:glossary.beneficiary.short`</sub> | The person you choose to get your account if you die. | 2.6 | Same in every scenario | — |  |
| W75<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.beneficiary.detail`</sub> | You name them ahead of time. Then the money can go to them with fewer steps for your family. You can change who it is at any time. | 2.0 | Same in every scenario | — |  |
| W76<br>DRAFT | Finance Terms (laptop, phone)<br><sub>`data:glossary.beneficiary.example`</sub> | Rosa can name her brother. If she dies, her account goes to him. | 1.5 | Same in every scenario | — |  |
| W77<br>APPROVED | Alerts (laptop, phone); Investments (laptop, phone); Finance Terms (laptop, phone)<br><sub>`data:glossary.sipc-protection.term`</sub> | SIPC protection | label | Same in every scenario | — |  |
| W78<br>APPROVED | Finance Terms (laptop, phone)<br><sub>`data:glossary.sipc-protection.alsoCalled`</sub> | SIPC coverage | label | Same in every scenario | — |  |
| W79<br>APPROVED | Alerts (laptop, phone); Finance Terms (laptop, phone)<br><sub>`data:glossary.sipc-protection.short`</sub> | Protection for stocks and cash at a member brokerage that fails. | 5.9 | Same in every scenario | — |  |
| W80<br>APPROVED | Alerts (laptop, phone); Investments (laptop, phone); Finance Terms (laptop, phone)<br><sub>`data:glossary.sipc-protection.detail`</sub> | SIPC protection covers stocks and cash at a member brokerage if the brokerage fails. It doesn't cover crypto, such as Bitcoin or Ethereum. It never covers a drop in price. | 4.9 | Same in every scenario | — |  |
| W81<br>APPROVED | Finance Terms (laptop, phone)<br><sub>`data:glossary.sipc-protection.example`</sub> | If a member brokerage closed and shares went missing, SIPC would work to get them back to their owners. | 6.7 | Same in every scenario | — |  |

### Charts (every chart)

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| C1<br>APPROVED | Sections sheet; Term explanation; Practice (error); Practice (after buying)<br><sub>`shared:chart.showTable`</sub> | Show as table | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| C2<br>APPROVED | Home (laptop, phone); Investments (laptop, phone); Your Journey (laptop, phone); Practice (laptop, phone)<br><sub>`shared:chart.hideTable`</sub> | Hide table | label | Nothing needs you: same<br>Brand-new: same | — |  |
| C3<br>APPROVED | Home (laptop, phone); Investments (laptop, phone); Your Journey (laptop, phone); Practice (laptop, phone)<br><sub>`shared:chart.asTable`</sub> | Balance since March, as a table *(and 7 more like it)* | 2.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| C4<br>APPROVED | Your Journey (laptop, phone); Home (laptop); Sections sheet; Term explanation<br><sub>`shared:chart.readHint`</sub> | Move across the chart, tap it, or use the arrow keys to read each day. | 3.6 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C5<br>APPROVED | Investments (laptop, phone); Your Journey (laptop, phone); Practice (after buying)<br><sub>`shared:chart.readHintSeries`</sub> | Move across the chart, tap it, or use the arrow keys to read it. | 3.4 | Nothing needs you: same<br>Brand-new: same | — |  |
| C6<br>APPROVED | Home (laptop, phone); Your Journey (laptop, phone); Sections sheet; Term explanation<br><sub>`shared:chart.keyboardDays`</sub> | Balance since March. Use the left and right arrow keys to read each day. *(and 3 more like it)* | -0.5 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C7<br>APPROVED | Investments (laptop, phone); Your Journey (laptop, phone); Practice (after buying)<br><sub>`shared:chart.keyboardSeries`</sub> | Price over time. Use the left and right arrow keys to read it. *(and 2 more like it)* | -0.6 | Nothing needs you: same<br>Brand-new: same | — |  |
| C8<br>APPROVED | Investments (laptop, phone); Your Journey (laptop, phone); Home (laptop); and 3 more screens<br><sub>`shared:chart.key`</sub> | Chart key | label | Nothing needs you: same<br>Brand-new: same | — |  |
| C9<br>APPROVED | Your Journey (laptop, phone); Home (laptop); Sections sheet; Term explanation<br><sub>`shared:chart.putIn`</sub> | What you put in | -2.2 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C10<br>APPROVED | Your Journey (laptop, phone); Home (laptop); Sections sheet; Term explanation<br><sub>`shared:chart.earned`</sub> | What it earned | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C11<br>APPROVED | Your Journey (laptop, phone)<br><sub>`shared:chart.events`</sub> | Events | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C12<br>APPROVED | Home (laptop, phone); Your Journey (laptop, phone); Term explanation<br><sub>`shared:chart.balance`</sub> | Balance | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C13<br>APPROVED | Charts (every chart)<br><sub>`shared:chart.tooltip`</sub> | Balance: $246.92 *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| C14<br>APPROVED | Charts (every chart)<br><sub>`shared:chart.dayReadout`</sub> | Sept. 18: balance $1,336.80. You had put in $1,250.00, so you were down $10.99. *(not on a captured screen; example values)* | 3.2 | Not on a captured screen; the values change with the account | — |  |
| C15<br>APPROVED | Investments (laptop, phone); Your Journey (laptop, phone); Home (laptop); and 2 more screens<br><sub>`shared:ranges.group`</sub> | Time range | label | Nothing needs you: same<br>Brand-new: same | — |  |
| C16<br>APPROVED | Your Journey (laptop, phone); Home (laptop); Sections sheet; Term explanation<br><sub>`shared:ranges.1m.label`</sub> | 1 month | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C17<br>APPROVED | Your Journey (laptop, phone); Home (laptop); Sections sheet; Term explanation<br><sub>`shared:ranges.3m.label`</sub> | 3 months | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| C18<br>APPROVED | Your Journey (laptop, phone); Home (laptop); Sections sheet; Term explanation<br><sub>`shared:ranges.all.label`</sub> | Since March | label | Nothing needs you: same<br>Brand-new: not shown | — |  |

### Term explanations and sheets (every screen)

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| E1<br>APPROVED | Term explanations and sheets (every screen)<br><sub>`shared:placeholder.soon`</sub> | Coming soon. *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| E2<br>DRAFT | Home (phone); Alerts (phone); Activity (phone); Investments (phone)<br><sub>`shared:wordChips.title`</sub> | Finance terms on this screen | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| E3<br>APPROVED | Sections sheet<br><sub>`shared:sheet.close`</sub> | Close | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| E4<br>APPROVED | Finance Terms (laptop, phone); Term explanation<br><sub>`shared:termTip.alsoCalled`</sub> | Also called market value *(and 6 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| E5<br>APPROVED | Finance Terms (laptop, phone); Term explanation<br><sub>`shared:termTip.example`</sub> | Example: | label | Nothing needs you: same<br>Brand-new: same | — |  |
| E6<br>DRAFT | Term explanation<br><sub>`shared:termTip.related`</sub> | Related terms: | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| E7<br>APPROVED | Finance Terms (laptop, phone); Term explanation<br><sub>`shared:termTip.source`</sub> | Source: | label | Nothing needs you: same<br>Brand-new: same | — |  |
| E8<br>APPROVED | Investments (laptop, phone); Finance Terms (laptop, phone); Term explanation<br><sub>`shared:termTip.newTab`</sub> | (opens in a new tab) | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| E9<br>APPROVED | Term explanation<br><sub>`shared:termTip.close`</sub> | Close explanation | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| E10<br>APPROVED | Phone view<br><sub>`shared:termTip.back`</sub> | Back to full view | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| E11<br>APPROVED | Investments (laptop, phone); Practice (after buying)<br><sub>`shared:dataNotes.stock`</sub> | Stock prices on Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026 are real. Prices on the days between are modeled. | 4.8 | Nothing needs you: same<br>Brand-new: same | — |  |
| E12<br>APPROVED | Investments (laptop, phone)<br><sub>`shared:dataNotes.crypto`</sub> | Powered by CoinGecko API | label | Nothing needs you: same<br>Brand-new: same | — |  |
| E13<br>APPROVED | Term explanations and sheets (every screen)<br><sub>`shared:dataNotes.cryptoLink`</sub> | CoinGecko API *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| E14<br>APPROVED | Term explanations and sheets (every screen)<br><sub>`shared:dataNotes.cryptoUrl`</sub> | https://www.coingecko.com/en/api/ *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |
| E15<br>APPROVED | Investments (laptop, phone); Finance Terms (laptop, phone); Term explanation<br><sub>`shared:dataNotes.newTab`</sub> | (opens in a new tab) | 0.5 | Nothing needs you: same<br>Brand-new: same | — |  |
| E16<br>APPROVED | Home (laptop); Term explanation; Practice (after buying)<br><sub>`shared:mixGroups.stocks`</sub> | Stocks | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| E17<br>APPROVED | Investments (laptop, phone); Home (laptop); Term explanation<br><sub>`shared:mixGroups.crypto`</sub> | Crypto | label | Nothing needs you: same<br>Brand-new: same | — |  |
| E18<br>APPROVED | Home (laptop, phone); Term explanation; Practice (after buying)<br><sub>`shared:mixGroups.cash`</sub> | Cash | label | Nothing needs you: same<br>Brand-new: not shown | — |  |
| E19<br>APPROVED | Term explanations and sheets (every screen)<br><sub>`shared:mixGroups.part`</sub> | Rosa 52% *(a bare value; example values)* | label | Not on a captured screen; the values change with the account | — |  |
| E20<br>APPROVED | Home (laptop); Term explanation; Practice (after buying)<br><sub>`shared:mixGroups.summary`</sub> | Your balance by kind: Stocks 78%, Crypto 22%, Cash 0.2%. *(and 1 more like it)* | 4.8 | Nothing needs you: same<br>Brand-new: not shown | — |  |
| E21<br>DRAFT | Home (laptop, phone); Alerts (laptop, phone); Activity (laptop, phone); and 13 more screens<br><sub>`shared:brand.name`</sub> | First Leaf | label | Nothing needs you: same<br>Brand-new: same | — |  |

### Numbers and dates (every screen)

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| N1<br>APPROVED | Home (phone); Investments (laptop, phone); Your Journey (laptop, phone); and 2 more screens<br><sub>`shared:change.up`</sub> | up $1.03 *(and 17 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| N2<br>APPROVED | Home (laptop, phone); Investments (laptop, phone); Finance Terms (laptop, phone); Term explanation<br><sub>`shared:change.down`</sub> | down $1.44 *(and 14 more like it)* | label | Nothing needs you: same<br>Brand-new: same | — |  |
| N3<br>APPROVED | Practice (after buying)<br><sub>`shared:change.none`</sub> | no change | label | Nothing needs you: not shown<br>Brand-new: not shown | — |  |
| N4<br>APPROVED | Every date<br><sub>`shared:dates.months`</sub> | Jan., Feb., March, April, May, June, July, Aug., Sept., Oct., Nov., Dec. *(not on a captured screen; example values)* | 2.9 | Same words wherever it shows | — |  |
| N5<br>APPROVED | Every date<br><sub>`shared:dates.days`</sub> | Sun., Mon., Tue., Wed., Thu., Fri., Sat. *(not on a captured screen; example values)* | label | Same words wherever it shows | — |  |

### Page not found

| # | Where it appears | Text as shown (normal scenario) | Grade | Other scenario versions | Suggested rewrite | Why |
|---|---|---|---|---|---|---|
| X1<br>APPROVED | Page not found (laptop, phone)<br><sub>`not-found:title`</sub> | We couldn't find that page. | -1.8 | Nothing needs you: same<br>Brand-new: same | — |  |
| X2<br>APPROVED | Page not found (laptop, phone)<br><sub>`not-found:why`</sub> | The link may be old or mistyped. | 0.6 | Nothing needs you: same<br>Brand-new: same | — |  |
| X3<br>APPROVED | Page not found (laptop, phone)<br><sub>`not-found:home`</sub> | Go to Home | label | Nothing needs you: same<br>Brand-new: same | — |  |

