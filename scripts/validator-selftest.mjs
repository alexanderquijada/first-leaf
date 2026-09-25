#!/usr/bin/env node
// Proves the validator can actually catch problems.
// A check that has only ever seen passing data proves nothing, so every rule
// gets at least one deliberately broken dataset here, and this script confirms
// that rule FAILS on it. Then it confirms the real data PASSES every rule.
//
//   npm run validate:selftest
//
// Adding a new rule? Add a broken case for it below, run this, see it fail,
// and only then trust the rule.

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validate, loadData, loadBriefExamples, loadCopy, loadSources } from './validate-data.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const r2 = (n) => Math.round(n * 100) / 100;
const r4 = (n) => Math.round(n * 10000) / 10000;
const clone = (o) => JSON.parse(JSON.stringify(o));
const set = (obj, path, value) => { const k = path.split('.'); const last = k.pop(); const t = k.reduce((o, x) => o[/^\d+$/.test(x) ? +x : x], obj); t[last] = value; };

// Each case: which rule must fail, why this data is broken, and how to break it.
const CASES = [
  { rule: 'S1', why: 'a data file is missing', missing: ['glossary'] },
  { rule: 'S2', why: 'a flag has no title', mutate: (d) => delete d.attention['rosa-starter'][0].title },
  { rule: 'G1', why: 'a real ticker outside the approved lineup (VTI) appears as an investment', mutate: (d) => { d.funds[1].ticker = 'VTI'; } },
  { rule: 'G1', why: 'a lineup ticker carries the wrong company name', mutate: (d) => { d.funds[0].name = 'Apple Computer'; } },
  { rule: 'G2', why: 'a real brand outside the lineup appears in a company description', mutate: (d) => set(d, 'funds.0.about', 'Apple makes the iPhone, like Samsung and Google do.') },
  { rule: 'G2', why: 'a real ticker appears in a flag', mutate: (d) => { d.attention['rosa-starter'][3].body = 'Compare it with SPY before Oct. 1.'; } },
  { rule: 'G3', why: 'a flag tells Rosa what to buy', mutate: (d) => { d.attention['rosa-starter'][2].nextStep = 'You should buy AAPL with this cash.'; } },
  { rule: 'G3', why: 'RULING B: an alert says to buy the dip', mutate: (d) => { d.attention['rosa-starter'][2].nextStep = 'Prices fell, so buy the dip with this cash.'; } },
  { rule: 'G3', why: 'REVIEW FINDING (Sept. 23): an absolute safety claim ("Cash is safe")', mutate: (d) => { d.glossary.find((g) => g.id === 'cash').detail = 'Cash is safe. It does not grow.'; } },
  { rule: 'G3', why: 'REVIEW FINDING (Sept. 23): a soft push to switch funds after a fee change', mutate: (d) => { d.attention['rosa-starter'][3].nextStep = 'Compare fees on each fund page.'; } },
  { rule: 'G3', why: 'REVIEW FINDING (Sept. 23): an unsupported crowd claim in the story', mutate: (d) => { d['story-p302'].claims[0].text = 'Most people guess Theo.'; } },
  { rule: 'G4', why: 'an account number sneaks into activity', mutate: (d) => { d.activity['rosa-starter'].find((a) => a.returnReason).returnReason = 'Bank account 123456789012 was low.'; } },
  { rule: 'G6', why: 'REAL-APP RULING (Sept. 24): the ticker explanation said "In this demo … so you always know it is made up"', mutate: (d) => { d.glossary.find((g) => g.id === 'ticker').detail = 'Real tickers are a few letters long. In this demo, every ticker starts with FL- so you always know it is made up.'; } },
  { rule: 'G6', why: 'REAL-APP RULING (Sept. 24): a description says "made-up companies"', mutate: (d) => set(d, 'funds.0.about', 'It owns bits of about 3,000 made-up U.S. companies, big and small.') },
  { rule: 'G6', why: 'RULING B (Phase 2.5): a glossary line calls the prices simulated', mutate: (d) => { d.glossary.find((g) => g.id === 'price').detail = 'These prices are simulated for learning.'; } },
  { rule: 'G6', why: 'RULING B (Phase 2.5): the practice word says the money is not real', mutate: (d) => { d.glossary.find((g) => g.id === 'practice-mode').detail = 'You start with $1,000 that is not real.'; } },
  { rule: 'G6', why: 'RULING B (Phase 2.5): a story note calls First Leaf a concept app', mutate: (d) => set(d, 'practice.timeMachine.note', 'First Leaf is a concept app, so these prices show how a mix could have moved.') },
  { rule: 'G6', why: 'RULING (Sept. 25): an alert claims "Member SIPC"', mutate: (d) => { d.attention['rosa-starter'].at(-1).body = 'First Leaf Investing, Member SIPC.'; } },
  { rule: 'G6', why: 'RULING (Sept. 25): the glossary says "a SIPC member"', mutate: (d) => { d.glossary.find((g) => g.id === 'sipc-protection').example = 'First Leaf is a SIPC member.'; } },
  { rule: 'G6', why: 'RULING (Sept. 25): an alert says her stocks are "protected by SIPC"', mutate: (d) => { d.attention['rosa-starter'].at(-1).body = 'Your stocks are protected by SIPC.'; } },
  { rule: 'G6', why: 'RULING (Sept. 25): a description says "SIPC-protected"', mutate: (d) => set(d, 'funds.0.about', 'Your Apple shares are SIPC-protected.') },
  { rule: 'G6', why: 'RULING (Sept. 25): a glossary line mentions FDIC', mutate: (d) => { d.glossary.find((g) => g.id === 'cash').detail = 'Cash here is FDIC insured.'; } },
  { rule: 'G6', why: 'RULING (Sept. 25): a story note says "This is not financial advice."', mutate: (d) => { d['story-p302'].assumptions.note += ' This is not financial advice.'; } },
  { rule: 'G6', why: 'RULING (Sept. 25): a note says "not a plan or advice" (advice disclaimer in other words)', mutate: (d) => set(d, 'practice.timeMachine.note', 'This is an example, not a plan or advice.') },
  { rule: 'G6', why: 'RULING (Sept. 25): "Nothing here is investment advice."', mutate: (d) => set(d, 'practice.timeMachine.note', 'Nothing here is investment advice.') },
  { rule: 'N2', why: 'RULING (Sept. 25): a holding moved 9% this week but no big-move alert is shown', mutate: (d) => { const f = d.funds.find((x) => x.ticker === 'NVDA'); const w = f.history.daily.find((x) => x.date === d.account.weeklyChange.from); w.close = r2(f.latestPrice / 1.09); } },
  { rule: 'G6', why: 'a story sentence mentions the case study', mutate: (d) => { d['story-p302'].rosaStory['rosa-starter'].claims[0].text = 'This case study opened on March 2.'; } },
  { rule: 'G6', why: 'the practice note calls the prices fictional', mutate: (d) => set(d, 'practice.timeMachine.note', 'These fictional prices show how a mix could have moved.') },
  { rule: 'G5', why: 'a saver in the story is not marked fictional', mutate: (d) => { d['story-p302'].savers[0].fictional = false; } },
  { rule: 'F1', why: 'a stock price is on a weekend', mutate: (d) => { d.funds[0].history.daily[1].date = '2025-09-20'; } },
  { rule: 'F1', why: 'a stock price is on Thanksgiving 2025 (a market holiday)', mutate: (d) => { const h = d.funds[0].history.daily; const i = h.findIndex((x) => x.date === '2025-11-28'); h.splice(i, 0, { date: '2025-11-27', close: h[i].close }); } },
  { rule: 'F1', why: 'a day is missing from a crypto series (crypto trades every day)', mutate: (d) => { d.funds.find((f) => f.ticker === 'BTC').history.daily.splice(5, 1); } },
  { rule: 'F2', why: 'daily and weekly prices disagree on the same Friday', mutate: (d) => { const f = d.funds[0]; const w = f.history.weekly.find((x) => x.date === f.history.daily[4].date); if (w) w.close += 1; else f.history.weekly.at(-1).close += 1; } },
  { rule: 'F3', why: 'latestPrice is stale', mutate: (d) => { d.funds[1].latestPrice = d.funds[1].latestPrice + 0.5; } },
  { rule: 'F3', why: 'REVIEW FINDING (Sept. 23): the time machine starts before the first price', mutate: (d) => { d.practice.timeMachine.from = '2021-09-20'; } },
  { rule: 'F4', why: 'Costco is rated 5 for ups and downs although its prices say 1', mutate: (d) => { d.funds.find((f) => f.ticker === 'COST').upsAndDowns = 5; } },
  { rule: 'F4', why: 'a stated volatility does not match its prices', mutate: (d) => { d.funds[0].volatility = 0.5; } },
  { rule: 'P1', why: "Apple's Sept. 18, 2026 close is off by a cent from the real close", mutate: (d) => { const f = d.funds[0]; const x = f.history.daily.find((r) => r.date === '2026-09-18'); x.close = r2(x.close + 0.01); f.latestPrice = x.close; } },
  { rule: 'P1', why: "Nike's March 2, 2026 anchor no longer matches PRICE-ANCHORS.md", sources: (s) => { s.anchors.NKE['2026-03-02'] = 70; } },
  { rule: 'P1', why: 'a stock has no documented anchors', sources: (s) => { delete s.anchors.TSLA; } },
  { rule: 'P2', why: 'one Bitcoin price differs from the saved CoinGecko file', mutate: (d) => { d.funds.find((f) => f.ticker === 'BTC').history.daily[100].close += 1; } },
  { rule: 'P2', why: 'the saved CoinGecko file for Ethereum is missing', sources: (s) => { delete s.raw.ETH; } },
  { rule: 'A1', why: 'a holding value does not equal shares x price', mutate: (d) => { d.account.holdings[0].value += 10; } },
  { rule: 'A2', why: 'up/down per fund does not equal value minus cost', mutate: (d) => { d.account.holdings[1].gainLoss += 3; } },
  { rule: 'A3', why: 'balance does not equal funds + cash', mutate: (d) => { d.account.balance += 1; } },
  { rule: 'A3', why: 'the all-clear account (a different scenario) has a wrong balance', mutate: (d) => { d['account-all-clear'].balance += 1; } },
  { rule: 'A4', why: 'money put in counts the returned deposit', mutate: (d) => { d.account.moneyIn += 150; } },
  { rule: 'A5', why: 'cost of a fund does not match its buys', mutate: (d) => { d.account.holdings[2].costBasis += 5; } },
  { rule: 'A6', why: 'cash does not reconcile with activity', mutate: (d) => { d.account.cash += 20; } },
  { rule: 'A7', why: 'overall up/down is wrong', mutate: (d) => { d.account.gainLoss = 999; } },
  { rule: 'F5', why: 'PHASE 4: a first buy on the last price day makes a one-point "Since you bought" chart', mutate: (d) => { const b = d.activity['rosa-starter'].find((a) => a.type === 'buy' && a.ticker === 'AAPL'); b.date = d.meta.lastClose; } },
  { rule: 'A8', why: 'history ends on a different balance', mutate: (d) => { d.account.history.at(-1).balance += 7; } },
  { rule: 'A8', why: 'REAL DEFECT (Sept. 23): daily history summed unrounded fund values and drifted 1 cent from the balance', mutate: (d) => { d.account.history.at(-1).balance = r2(d.account.history.at(-1).balance + 0.01); } },
  { rule: 'A9', why: 'target mix adds to 110%', mutate: (d) => { d.account.targetMix.AAPL = 0.35; } },
  { rule: 'A10', why: 'weekly pieces do not add up', mutate: (d) => { d.account.weeklyChange.marketChange += 4; } },
  { rule: 'A10', why: 'REAL DEFECT (Sept. 23): the 1-cent drift shows up in "why did my balance move"', mutate: (d) => { d.account.weeklyChange.endBalance = r2(d.account.weeklyChange.endBalance + 0.01); } },
  { rule: 'A10', why: 'REAL DEFECT (Sept. 23): per-fund pieces summed to $15.09 while the market change was $15.07', mutate: (d) => { const w = d.account.weeklyChange; w.byFund[0].change = r2(w.byFund[0].change + 0.02); } },
  { rule: 'A11', why: 'goal pace uses the market instead of deposits', mutate: (d) => { d.account.goal.behindBy = 80; } },
  { rule: 'A11', why: 'REVIEW FINDING (Sept. 23): the plan cannot reach the goal ($2,300 of $2,500)', mutate: (d) => { d.account.goal.target = 2500; d.account.goal.progress = r4(d.account.moneyIn / 2500); } },
  { rule: 'A11', why: 'REVIEW FINDING (Sept. 23): goal progress measured by balance, mixing two measures', mutate: (d) => { d.account.goal.progress = r4(d.account.balance / d.account.goal.target); } },
  { rule: 'A12', why: 'a stock buy settles the same day (not T+1)', mutate: (d) => { const b = d.activity['rosa-starter'].find((a) => a.type === 'buy' && a.ticker === 'AAPL'); b.settledDate = b.date; } },
  { rule: 'A12', why: 'a crypto buy is given T+1 settlement (crypto settles the same day)', mutate: (d) => { const b = d.activity['rosa-starter'].find((a) => a.type === 'buy' && a.ticker === 'BTC'); b.settledDate = '2026-03-03'; } },
  { rule: 'A12', why: 'a dividend uses a per-share amount the company never paid', mutate: (d) => { const x = d.activity['rosa-starter'].find((a) => a.type === 'dividend'); x.perShare = 0.5; } },
  { rule: 'A12', why: 'a dividend is paid on shares bought on the ex-date', mutate: (d) => { const x = d.activity['rosa-starter'].find((a) => a.type === 'dividend'); x.sharesOnExDate = r4(x.sharesOnExDate + 0.1); x.amount = r2(x.sharesOnExDate * x.perShare); } },
  { rule: 'A13', why: 'waiting-in-cash date is a month early', mutate: (d) => { d.account.cashSince = '2026-06-01'; } },
  { rule: 'A14', why: 'REVIEW FINDING (Sept. 23): a buy happens after auto-invest was paused', mutate: (d) => { const b = d.activity['rosa-starter'].find((a) => a.type === 'buy'); b.date = '2026-08-03'; } },
  { rule: 'A14', why: 'auto-invest says "on" but a pause date is set', mutate: (d) => { d.account.autoInvest.on = true; } },
  { rule: 'N1', why: 'an FYI flag is listed before a needs-you flag, and uses an unknown term', mutate: (d) => { const l = d.attention['rosa-starter']; l.unshift(l.pop()); l[0].terms = ['nope']; } },
  { rule: 'N1', why: 'a flag is marked New even though it was raised before last review', mutate: (d) => { d.attention['rosa-starter'][0].newSinceLastReview = true; } },
  { rule: 'N2', why: 'a big-move alert appears although no holding moved 7% this week', mutate: (d) => { d.attention['rosa-starter'].splice(3, 0, { ...d.attention['rosa-starter'][1], id: 'big-move-AAPL', movePercent: 0.08 }); } },
  { rule: 'N2', why: 'the SIPC notice is missing although the account holds crypto', mutate: (d) => { d.attention['rosa-starter'] = d.attention['rosa-starter'].filter((f) => f.id !== 'sipc-crypto'); } },
  { rule: 'N2', why: 'RULING B: a fee alert comes back (stocks and crypto have no yearly fund fee)', mutate: (d) => { d.attention['rosa-starter'].push({ ...d.attention['rosa-starter'].at(-1), id: 'fee-going-up' }); } },
  { rule: 'N2', why: 'REVIEW FINDING (Sept. 23): the all-clear account shows a returned-deposit flag its facts do not support', mutate: (d) => { d.attention['rosa-all-clear'].unshift({ ...d.attention['rosa-starter'][0] }); } },
  { rule: 'N2', why: 'a flag is missing even though the account has a returned deposit', mutate: (d) => { d.attention['rosa-starter'].shift(); } },
  { rule: 'N3', why: 'flag copy states a dollar figure that is not in the data', mutate: (d) => { d.attention['rosa-starter'].find((a) => a.id === 'cash-sitting').title = '$987.65 is waiting in cash'; } },
  { rule: 'C1', why: 'REVIEW FINDING (Sept. 23): "Nothing needs you" points at the normal account', mutate: (d) => { d.scenarios.find((s) => s.id === 'all-clear').accountId = 'rosa-starter'; } },
  { rule: 'C2', why: 'brand-new account has money in it', mutate: (d) => { d['account-new'].balance = 50; } },
  { rule: 'T1', why: "Nia's final value is not what the formula gives", mutate: (d) => { d['story-p302'].savers[0].final.value = 300000; } },
  { rule: 'T2', why: 'Theo puts in less than Nia, so "start early beats start big" is not shown', mutate: (d) => { d['story-p302'].savers[1].monthly = 90; } },
  { rule: 'T2', why: 'catch-up amount is not the real minimum', mutate: (d) => { d['story-p302'].catchUp.monthlyNeeded = 250; } },
  { rule: 'T2', why: 'in the bumpy version Theo ends ahead, so the bumpy claim would be false', mutate: (d) => { d['story-p302'].bumpy.theo.at(-1).value = 999999; } },
  { rule: 'T2', why: "REVIEW FINDING (Sept. 23): Theo's slider steps by $5 and can never land on $196", mutate: (d) => { d['story-p302'].catchUp.slider.step = 5; } },
  { rule: 'T3', why: 'bumpy returns grow 8% overall, not 6%', mutate: (d) => { d['story-p302'].bumpy.yearlyReturns = d['story-p302'].bumpy.yearlyReturns.map((r) => r + 0.02); } },
  { rule: 'T3', why: 'REVIEW FINDING (Sept. 23): a staged crash year of -29% near the end', mutate: (d) => { const r = d['story-p302'].bumpy.yearlyReturns; r[r.length - 3] = -0.29; } },
  { rule: 'T3', why: 'REVIEW FINDING (Sept. 23): the note says "average" instead of "overall growth"', mutate: (d) => { d['story-p302'].bumpy.note = 'Same 6% average as the smooth line.'; } },
  { rule: 'T4', why: 'story no longer says the rate is an example nobody can promise', mutate: (d) => { d['story-p302'].assumptions.note = 'Markets grow 6% a year.'; } },
  { rule: 'T4', why: 'the note drops "example" (it would read as a real rate)', mutate: (d) => { d['story-p302'].assumptions.note = 'A steady 6% a year. Real markets go up and down, and nobody can promise a rate.'; } },
  { rule: 'R1', why: 'the story says 99% of the balance is deposits', mutate: (d) => { const c = d['story-p302'].rosaStory['rosa-starter'].claims.find((x) => x.id === 'deposits-share'); c.text = c.text.replace(/\d+%/, '99%'); } },
  { rule: 'R1', why: 'the stored deposits share does not match money in / balance', mutate: (d) => { d['story-p302'].rosaStory['rosa-all-clear'].facts.depositsShare = 0.8; } },
  { rule: 'R1', why: 'the general point of view (used with no history) claims "right now, almost all"', mutate: (d) => { d['story-p302'].pointOfView = "Right now, almost all of Rosa's balance is money she put in. " + d['story-p302'].pointOfView; } },
  { rule: 'R2', why: 'the dip fall is quoted $5 bigger than the history shows', mutate: (d) => { const r = d['story-p302'].rosaStory['rosa-starter']; r.facts.dip.fall = r2(r.facts.dip.fall + 5); } },
  { rule: 'R2', why: 'the dip window moves to June 1 (a hand-picked window)', mutate: (d) => { d['story-p302'].rosaStory['rosa-starter'].facts.dip.window.from = '2026-06-01'; } },
  { rule: 'R2', why: 'the chapter says the dip was in July, but the low was in another month', mutate: (d) => { for (const k of ['rosa-starter', 'rosa-all-clear']) d['story-p302'].rosaStory[k].facts.dip.month = d['story-p302'].rosaStory[k].facts.dip.month === 'July' ? 'June' : 'July'; } },
  { rule: 'R2', why: 'her balance at the low is misstated', mutate: (d) => { d['story-p302'].rosaStory['rosa-starter'].facts.atLow.below = 40; } },
  { rule: 'R3', why: 'the pause is not the trading day after the low, but the story says "the next trading day"', mutate: (d) => { const f = d['story-p302'].rosaStory['rosa-starter'].facts; f.pause.date = '2026-06-10'; d.account.autoInvest.pausedOn = '2026-06-10'; } },
  { rule: 'R3', why: '"back above what you put in" is dated too early', mutate: (d) => { const f = d['story-p302'].rosaStory['rosa-starter'].facts; f.after.backAboveDate = f.pause.date; } },
  { rule: 'R3', why: 'the calm account (auto-invest never paused) tells the paused story', mutate: (d) => { const r = d['story-p302'].rosaStory['rosa-all-clear']; r.claims = r.claims.filter((c) => c.id !== 'kept-buying'); r.claims.push({ id: 'pause', chapter: 3, text: 'You paused auto-invest the next trading day, May 27.' }); } },
  { rule: 'R4', why: 'the calm account has no story of its own', mutate: (d) => { d['story-p302'].rosaStory['rosa-all-clear'] = null; } },
  { rule: 'R4', why: 'a story sentence states a dollar figure that is not one of the checked facts', mutate: (d) => { const c = d['story-p302'].rosaStory['rosa-starter'].claims.find((c) => c.id === 'dip'); c.text = c.text.replace(/\$[\d,.]+/, '$40.00'); } },
  { rule: 'R4', why: 'the brand-new account (no history) is given a story', mutate: (d) => { d['story-p302'].rosaStory['rosa-new'] = d['story-p302'].rosaStory['rosa-starter']; } },
  { rule: 'X1', why: "P302 uses a different age than Rosa's", mutate: (d) => { d['story-p302'].yourTurn.startAge = 30; } },
  { rule: 'X2', why: 'an activity is dated in the future', mutate: (d) => { d.activity['rosa-starter'].at(-1).date = '2026-12-01'; } },
  { rule: 'L1', why: 'a glossary entry links to a term that does not exist', mutate: (d) => { d.glossary[0].related.push('ghost-term'); } },
  { rule: 'L1', why: 'the word of the day is not in the glossary', mutate: (d) => { d.meta.wordOfTheDay = 'ghost-term'; } },
  { rule: 'L2', why: 'an explanation written at college level', mutate: (d) => { d.glossary[0].detail = 'The aggregate valuation encompasses contemporaneous market-determined assessments of constituent positions plus unallocated monetary reserves, recalculated continuously throughout regular exchange sessions.'; } },
  { rule: 'L2', why: 'REAL DEFECT (Sept. 23): the P302 point of view read at grade 9.5', mutate: (d) => { d['story-p302'].pointOfView = 'Starting early does more for you than putting in more money later, because early money has more years to grow on its own growth.'; } },
  { rule: 'L2', why: "REVIEW FINDING (Sept. 23): a company description read at grade 10.7 and was not being checked", mutate: (d) => { d.funds.find((f) => f.ticker === 'NVDA').about = 'Accelerated computing infrastructure underpins contemporary artificial intelligence applications worldwide.'; } },
  { rule: 'L3', why: 'an explanation uses jargon', mutate: (d) => { d.glossary.find((g) => g.id === 'cash').detail = 'Cash has no volatility and full liquidity.'; } },
  { rule: 'L4', why: 'an explanation first line is far too long', mutate: (d) => { d.glossary[1].short = 'Money that you choose to move out of your regular bank account and into this investing account so that you can use it later.'; } },
  // L5 reads the copy files (src/**/copy.json). `copy` breaks a copy file; `mutate` breaks the data.
  { rule: 'L5', why: 'a copy sentence is above grade 8', copy: (c) => { c['src/features/home/copy.json'].welcome.lede = 'Consequently, organizational considerations necessitate comprehensive evaluation of individual circumstances.'; } },
  { rule: 'L5', why: 'a copy sentence uses jargon ("portfolio")', copy: (c) => { c['src/features/home/copy.json'].mix.title = 'Your portfolio today'; } },
  { rule: 'L5', why: 'a copy sentence gives advice', copy: (c) => { c['src/features/funds/copy.json'].notOwnedYet = 'You should buy this fund soon.'; } },
  { rule: 'L5', why: 'a copy sentence uses project language', copy: (c) => { c['src/layouts/copy.json'].phoneView.back = 'Back to the demo'; } },
  { rule: 'L5', why: 'a fee change reads "+0.10%" instead of percentage points', copy: (c) => { c['src/features/alerts/copy.json'].facts.feeChange = '+{points}%'; } },
  { rule: 'L5', why: 'a rate change reads "up 0.10%" instead of percentage points', copy: (c) => { c['src/features/home/copy.json'].mix.even = 'Your return rate went from 5% to 6% this year, up {points}%.'; } },
  { rule: 'L5', why: 'RULING B: a data note turns into a disclaimer ("simulated")', copy: (c) => { c['src/shared/copy.json'].dataNotes.stock = 'Stock prices here are simulated.'; } },
  { rule: 'L5', why: 'money is written "$$" (a "$" before a placeholder that is already money)', copy: (c) => { c['src/features/home/copy.json'].balance.thisWeek = 'This week you added ${amount}.'; } },
  { rule: 'L5', why: 'a sentence shows a signed amount instead of "up $X"', copy: (c) => { c['src/features/home/copy.json'].week.line = 'Your balance went +{balance} this week.'; } },
  { rule: 'L5', why: 'a value has no words saying what it measures', copy: (c) => { c['src/features/home/copy.json'].balance.label = '{balance}'; } },
  { rule: 'L5', why: 'a placeholder has no declared meaning', copy: (c) => { c['src/features/home/copy.json'].week.caption = 'You earned {bonus} this week.'; } },
  { rule: 'L5', why: 'a generated story sentence is above grade 8', mutate: (d) => { d['story-p302'].rosaStory['rosa-all-clear'].claims[0].text = 'Notwithstanding considerable intermediate fluctuations, your accumulated contributions demonstrate substantial improvement.'; } },
  { rule: 'L5', why: 'a generated story sentence writes money without cents or commas', mutate: (d) => { d['story-p302'].rosaStory['rosa-starter'].claims[0].text = 'You started with $150.5 and now have $1313.72.'; } },
  { rule: 'L5', why: 'no copy files were loaded at all', copy: () => ({}) },
  { rule: 'B1', why: 'the brief quotes a balance the data does not have', briefExamples: [{ file: 'BRIEF.md', body: '{ "account.balance": 5000 }' }] },
];

const { data: real, missing: realMissing } = loadData();
const realBrief = loadBriefExamples();
const realCopy = loadCopy();
const realSources = loadSources();
let bad = 0;

console.log('1) Each rule must FAIL on its broken data\n');
for (const c of CASES) {
  const d = clone(real);
  let missing = [];
  if (c.missing) { missing = c.missing; for (const m of missing) delete d[m]; }
  if (c.mutate) c.mutate(d);
  if (c.file) d[c.file.name] = JSON.parse(readFileSync(join(HERE, c.file.path), 'utf8'));
  let copy = clone(realCopy);
  if (c.copy) copy = c.copy(copy) ?? copy;
  const sources = clone(realSources); if (c.sources) c.sources(sources);
  const res = validate(d, { missing, briefExamples: c.briefExamples || realBrief, copy, sources });
  const r = res.find((x) => x.id === c.rule);
  const failed = r && !r.ok;
  if (!failed) bad++;
  console.log(`${failed ? 'ok  ' : 'MISS'}  ${c.rule.padEnd(4)} fails when ${c.why}${failed ? '' : '  <-- rule did NOT catch this'}`);
}

const covered = new Set(CASES.map((c) => c.rule));
const all = validate(clone(real), { missing: realMissing, briefExamples: realBrief, copy: clone(realCopy), sources: clone(realSources) });
const uncovered = all.map((r) => r.id).filter((id) => !covered.has(id));
if (uncovered.length) { bad++; console.log(`\nMISS  rules with no broken case: ${uncovered.join(', ')}`); }

console.log('\n2) Real data must PASS every rule\n');
for (const r of all) { if (!r.ok) bad++; console.log(`${r.ok ? 'ok  ' : 'FAIL'}  ${r.id.padEnd(4)} ${r.name}${r.ok ? '' : '\n        - ' + r.errors.join('\n        - ')}`); }

console.log(bad ? `\nSELF-TEST FAILED (${bad} problem${bad > 1 ? 's' : ''}).` : `\nSelf-test passed: ${CASES.length} broken cases caught, ${all.length} rules pass on real data.`);
process.exit(bad ? 1 : 0);
