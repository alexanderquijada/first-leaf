#!/usr/bin/env node
// First Leaf: fictional data generator.
// Produces the JSON files in src/shared/data/ from one seeded source, so the
// numbers in P301, P302 and P303 always agree. Re-running gives identical output.
// Rules the data must obey live in BRIEF.md §4 and are enforced independently
// by scripts/validate-data.mjs. Never hand-edit the generated JSON: change this
// file, run `npm run data:generate`, then `npm run validate`.
// (glossary.json is hand-written copy and is NOT produced here.)
//
// EVERYTHING HERE IS INVENTED. No real funds, tickers, prices, people or accounts.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'shared', 'data');
mkdirSync(OUT, { recursive: true });

// ---------- helpers ----------
const r2 = (n) => Math.round(n * 100) / 100;
const r4 = (n) => Math.round(n * 10000) / 10000;
const floor4 = (n) => Math.floor(n * 10000 + 1e-9) / 10000;
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gauss(rand) {
  let u = 0, v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(s + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
const dow = (s) => new Date(s + 'T00:00:00Z').getUTCDay();
const daysBetween = (a, b) => Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 864e5);

// Invented market calendar: weekdays minus the 2026 U.S. market holidays.
const HOLIDAYS_2026 = ['2026-01-01','2026-01-19','2026-02-16','2026-04-03','2026-05-25','2026-06-19','2026-07-03','2026-09-07','2026-11-26','2026-12-25'];
const isTradingDay = (s) => dow(s) !== 0 && dow(s) !== 6 && !HOLIDAYS_2026.includes(s);
const nextTradingDay = (s) => { let d = s; while (!isTradingDay(d)) d = addDays(d, 1); return d; };

// Money in copy: whole dollars without cents ("$150"), otherwise two decimals ("$154.76").
const fmt = (n) => (Number.isInteger(r2(n))
  ? `$${r2(n).toLocaleString('en-US')}`
  : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const AP_MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const fmtCents = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const apDate = (s) => `${AP_MONTHS[Number(s.slice(5, 7)) - 1]} ${Number(s.slice(8, 10))}`;

// ---------- fixed facts ----------
const AS_OF = '2026-09-20';            // Sunday: the day of Rosa's weekly review
const LAST_CLOSE = '2026-09-18';       // Friday: latest prices in the data
const LAST_REVIEW = '2026-09-13';      // the Sunday before
const HISTORY_START = '2021-09-20';    // 5 years of made-up history
const ACCOUNT_OPENED = '2026-03-02';
const WEEK_START_CLOSE = '2026-09-11'; // "this week" = close Sept. 11 -> close Sept. 18
const WORD_OF_THE_DAY = 'expense-ratio';
const CASH_WAITING = 25;         // dollars of cash before we call it "waiting"

const meta = {
  product: 'First Leaf',
  company: 'First Leaf Investing',
  asOf: AS_OF,
  lastClose: LAST_CLOSE,
  lastReview: LAST_REVIEW,
  cashWaitingThreshold: CASH_WAITING,
  wordOfTheDay: WORD_OF_THE_DAY,
  currency: 'USD',
  fictional: true,
  dataVersion: 2,
  // The on-screen footer disclosure (real-app ruling, Sept. 24). The README carries the full statement.
  disclaimer:
    'Investing involves risk, including losing money you put in. First Leaf is a concept app: accounts, funds and prices shown are simulated. Nothing here is investment advice.',
};

const persona = {
  id: 'rosa',
  firstName: 'Rosa',
  age: 26,
  city: 'Tucson, Arizona',
  job: 'Dental hygienist',
  fictional: true,
  story:
    'Rosa opened her first investing account in March 2026. She had never bought a fund before. She puts in $150 each month. In July, a dip in prices made her nervous, so she paused auto-invest. She wants to understand what her money is doing without feeling lost.',
  worries: [
    'Losing money without knowing why',
    'Words like "expense ratio" that nobody explains',
    'Doing something wrong and not being able to undo it',
  ],
  devices: { phone: 'iPhone, one hand, between other things', laptop: 'Laptop on Sunday mornings' },
  moments: {
    P301: 'Sunday morning at her laptop, doing a calm weekly review of the whole account.',
    P302: 'An evening on the couch, working through one lesson about why starting early matters.',
    P303: 'A 60-second check on her phone between other things, like waiting in line for coffee: does anything need me, and why did my balance move?',
  },
};

// ---------- funds ----------
// The order of this list fixes the random price paths. Don't reorder it.
const FUND_DEFS = [
  { ticker: 'FL-BROAD', name: 'Broad U.S. Market Index Fund', kind: 'stocks', region: 'United States', upsAndDowns: 4,
    expenseRatio: [{ effective: '2021-01-01', value: 0.04 }], mu: 0.085, sigma: 0.17, start: 62.4,
    dividend: { frequency: 'quarterly', annualRate: 0.014 },
    inside: 'It owns bits of about 3,000 U.S. companies, big and small.' },
  { ticker: 'FL-WORLD', name: 'World Markets Index Fund', kind: 'stocks', region: 'Outside the U.S.', upsAndDowns: 4,
    expenseRatio: [{ effective: '2021-01-01', value: 0.08 }], mu: 0.06, sigma: 0.18, start: 41.1,
    dividend: null,
    inside: 'It owns bits of about 7,000 companies. They are in other countries.' },
  { ticker: 'FL-BOND', name: 'Steady Bond Index Fund', kind: 'bonds', region: 'United States', upsAndDowns: 2,
    expenseRatio: [{ effective: '2021-01-01', value: 0.05 }], mu: 0.025, sigma: 0.05, start: 24.8,
    dividend: { frequency: 'monthly', annualRate: 0.036 },
    inside: 'It lends to thousands of governments and big companies.' },
  { ticker: 'FL-GREEN', name: 'Clean Energy Theme Fund', kind: 'stocks', region: 'Worldwide', upsAndDowns: 5,
    expenseRatio: [{ effective: '2021-01-01', value: 0.45 }, { effective: '2026-10-01', value: 0.75, announcedOn: '2026-09-15' }], mu: 0.07, sigma: 0.32, start: 18.3,
    dividend: null,
    inside: 'It owns bits of about 80 companies. They make solar panels, wind power and batteries.' },
  { ticker: 'FL-CALM', name: 'Calm Reserve Fund', kind: 'reserve', region: 'United States', upsAndDowns: 1,
    expenseRatio: [{ effective: '2021-01-01', value: 0.1 }], mu: 0, sigma: 0, start: 1.0,
    dividend: { frequency: 'monthly', annualRate: 0.035 },
    inside: 'It makes very short loans. Its price is meant to stay at $1.00. It pays a little each month.' },
];

const days = [];
for (let d = HISTORY_START; d <= LAST_CLOSE; d = addDays(d, 1)) if (isTradingDay(d)) days.push(d);

const rand = mulberry32(Number(process.env.FL_SEED || 11));
const priceByFund = {};
for (const f of FUND_DEFS) {
  const series = {};
  let p = f.start;
  for (const d of days) {
    if (f.kind !== 'reserve') {
      const ret = f.mu / 252 + (f.sigma / Math.sqrt(252)) * gauss(rand);
      p = Math.max(1, p * Math.exp(ret));
    }
    series[d] = r2(p);
  }
  priceByFund[f.ticker] = series;
}
const priceOn = (ticker, date) => {
  const p = priceByFund[ticker][date];
  if (p === undefined) throw new Error(`no price for ${ticker} on ${date}`);
  return p;
};
const weeklyDates = [];
for (let i = 0; i < days.length; i++) {
  const d = days[i], n = days[i + 1];
  if (!n || dow(n) <= dow(d) || daysBetween(d, n) > 3) weeklyDates.push(d);
}
const accountDays = days.filter((d) => d >= ACCOUNT_OPENED);
const funds = FUND_DEFS.map((f) => ({
  ticker: f.ticker, name: f.name, fictional: true, kind: f.kind, region: f.region, upsAndDowns: f.upsAndDowns,
  expenseRatioHistory: f.expenseRatio, dividend: f.dividend, inside: f.inside,
  latestPrice: priceOn(f.ticker, LAST_CLOSE),
  history: {
    weekly: weeklyDates.map((d) => ({ date: d, close: priceOn(f.ticker, d) })),
    daily: accountDays.map((d) => ({ date: d, close: priceOn(f.ticker, d) })),
  },
}));
const expenseRatioOn = (ticker, date) => FUND_DEFS.find((f) => f.ticker === ticker).expenseRatio.filter((e) => e.effective <= date).at(-1).value;

// ---------- accounts ----------
// One simulator, three accounts: the main demo, a calm "all clear" version, and a brand-new one.
const RECURRING = { amount: 150, dayOfMonth: 1, startedOn: '2026-04-01' };
const GOAL = { id: 'first-2000', name: 'Put in my first $2,000', target: 2000, targetDate: '2027-02-01', measures: 'moneyIn' };
const planDeposits = (upTo) => {
  const out = [{ date: ACCOUNT_OPENED, amount: 500, kind: 'first' }];
  for (let d = RECURRING.startedOn; d <= upTo; d = `${d.slice(0, 5)}${String(Number(d.slice(5, 7)) + 1).padStart(2, '0')}-01`) {
    if (Number(d.slice(5, 7)) > 12) { d = `${Number(d.slice(0, 4)) + 1}-01-01`; if (d > upTo) break; }
    out.push({ date: d, amount: RECURRING.amount, kind: 'recurring' });
  }
  return out;
};

function simulate({ id, mix, autoInvestPausedOn = null, returnedDeposits = {} }) {
  const shares = Object.fromEntries(Object.keys(mix).map((t) => [t, 0]));
  const costBasis = Object.fromEntries(Object.keys(mix).map((t) => [t, 0]));
  let cash = 0, moneyIn = 0, n = 1;
  const activity = []; const history = [];
  const nextId = () => `${id}-${String(n++).padStart(3, '0')}`;
  const deposits = planDeposits(AS_OF);
  const events = [];
  for (const dep of deposits) {
    events.push({ date: nextTradingDay(dep.date), type: 'deposit', dep });
  }
  for (const m of ['03','04','05','06','07','08','09']) events.push({ date: nextTradingDay(`2026-${m}-15`), type: 'dividend', ticker: 'FL-BOND' });
  events.push({ date: nextTradingDay('2026-06-24'), type: 'dividend', ticker: 'FL-BROAD' });
  events.sort((a, b) => a.date.localeCompare(b.date) || (a.type === 'deposit' ? -1 : 1));
  const byDate = {}; for (const e of events) (byDate[e.date] ||= []).push(e);

  for (const d of accountDays) {
    for (const e of byDate[d] || []) {
      if (e.type === 'deposit') {
        const returned = returnedDeposits[e.dep.date];
        activity.push({ id: nextId(), date: e.dep.date, settledDate: d, type: 'deposit', kind: e.dep.kind, amount: e.dep.amount,
          status: returned ? 'returned' : 'completed',
          ...(returned ? { returnedDate: returned, returnReason: 'Your bank sent this money back. Banks do this for a few reasons, such as the account being low that day.' } : {}) });
        if (returned) continue;
        cash = r2(cash + e.dep.amount); moneyIn = r2(moneyIn + e.dep.amount);
        const autoOn = !autoInvestPausedOn || d < autoInvestPausedOn;
        if (autoOn) for (const [t, w] of Object.entries(mix)) {
          const amt = r2(e.dep.amount * w), px = priceOn(t, d), sh = floor4(amt / px);
          shares[t] = r4(shares[t] + sh); costBasis[t] = r2(costBasis[t] + amt); cash = r2(cash - amt);
          activity.push({ id: nextId(), date: d, settledDate: nextTradingDay(addDays(d, 1)), type: 'buy', ticker: t, amount: amt, shares: sh, price: px, status: 'completed', via: 'auto-invest' });
        }
      } else if (e.type === 'dividend' && shares[e.ticker] > 0) {
        const f = FUND_DEFS.find((x) => x.ticker === e.ticker);
        const amt = r2(shares[e.ticker] * priceOn(e.ticker, d) * f.dividend.annualRate / (f.dividend.frequency === 'monthly' ? 12 : 4));
        if (amt > 0) { cash = r2(cash + amt); activity.push({ id: nextId(), date: d, settledDate: d, type: 'dividend', ticker: e.ticker, amount: amt, status: 'completed' }); }
      }
    }
    const invested = r2(Object.keys(shares).reduce((s, t) => s + r2(shares[t] * priceOn(t, d)), 0));
    history.push({ date: d, balance: r2(invested + cash), moneyIn, cash });
  }

  const holdings = Object.keys(shares).map((t) => {
    const value = r2(shares[t] * priceOn(t, LAST_CLOSE));
    return { ticker: t, shares: shares[t], price: priceOn(t, LAST_CLOSE), value, costBasis: costBasis[t], gainLoss: r2(value - costBasis[t]), targetShare: mix[t] };
  });
  const investedValue = r2(holdings.reduce((s, h) => s + h.value, 0));
  const balance = r2(investedValue + cash);
  const gainLoss = r2(balance - moneyIn);
  const dividendsTotal = r2(activity.filter((a) => a.type === 'dividend').reduce((s, a) => s + a.amount, 0));
  // Cash counts as "waiting" once it reaches CASH_WAITING (small leftovers from rounding and dividends don't).
  let cashSince = null;
  if (cash >= CASH_WAITING) for (let i = history.length - 1; i >= 0; i--) if (history[i].cash < CASH_WAITING) { cashSince = history[i + 1].date; break; }

  const start = history.find((r) => r.date === WEEK_START_CLOSE), end = history.at(-1);
  const wk = activity.filter((a) => a.date > WEEK_START_CLOSE && a.date <= LAST_CLOSE && a.status === 'completed');
  const wDep = r2(wk.filter((a) => a.type === 'deposit').reduce((s, a) => s + a.amount, 0));
  const wDiv = r2(wk.filter((a) => a.type === 'dividend').reduce((s, a) => s + a.amount, 0));
  const weeklyChange = {
    from: WEEK_START_CLOSE, to: LAST_CLOSE, startBalance: start.balance, deposits: wDep, withdrawals: 0, dividends: wDiv,
    marketChange: r2(end.balance - start.balance - wDep - wDiv), endBalance: end.balance,
    totalChange: r2(end.balance - start.balance),
    byFund: Object.keys(shares).map((t) => ({ ticker: t, change: r2(shares[t] * (priceOn(t, LAST_CLOSE) - priceOn(t, WEEK_START_CLOSE))) })),
  };
  // Per-fund pieces must add up to the market change to the cent (P303 shows both).
  const diff = r2(weeklyChange.marketChange - weeklyChange.byFund.reduce((s, x) => s + x.change, 0));
  if (diff !== 0) { const big = weeklyChange.byFund.reduce((a, b) => (Math.abs(b.change) > Math.abs(a.change) ? b : a)); big.change = r2(big.change + diff); }

  const planned = r2(deposits.reduce((s, d) => s + d.amount, 0));
  const goal = { ...GOAL, plan: { first: 500, monthly: RECURRING.amount },
    plannedMoneyInToDate: planned, actualMoneyInToDate: moneyIn, behindBy: r2(planned - moneyIn),
    plannedMoneyInByTarget: r2(planDeposits(addDays(GOAL.targetDate, -1)).reduce((s, d) => s + d.amount, 0)),
    progress: r4(moneyIn / GOAL.target) };

  const account = {
    id, ownerId: 'rosa', name: 'Starter account', fictional: true, openedOn: ACCOUNT_OPENED, asOf: AS_OF, lastClose: LAST_CLOSE,
    balance, investedValue, cash, cashSince, moneyIn, gainLoss, gainLossPercent: r4(gainLoss / moneyIn), dividendsTotal,
    recurringDeposit: RECURRING,
    autoInvest: { on: !autoInvestPausedOn, startedOn: ACCOUNT_OPENED, pausedOn: autoInvestPausedOn },
    targetMix: mix, holdings, goal, weeklyChange, history,
  };

  // ----- attention flags: generated from rules, so they are true for THIS account -----
  const flags = [];
  const ret = activity.filter((a) => a.status === 'returned' && daysBetween(a.returnedDate, AS_OF) <= 30).at(-1);
  if (ret) flags.push({ id: 'deposit-returned', severity: 'needs-you', date: ret.returnedDate, raisedOn: ret.returnedDate,
    title: `Your ${fmt(ret.amount)} deposit from ${apDate(ret.date)} was sent back`,
    body: `Your bank sent it back on ${apDate(ret.returnedDate)}, so the money never reached First Leaf. Your funds were not touched.`,
    nextStep: 'Check your bank account first. Then you can try the deposit again.',
    action: { kind: 'retry-deposit', label: 'Try the deposit again' },
    amount: ret.amount, activityId: ret.id, terms: ['returned-deposit', 'recurring-deposit'], route: 'activity' });
  if (goal.behindBy > 0) flags.push({ id: 'goal-behind', severity: 'heads-up', date: AS_OF, raisedOn: ret ? ret.returnedDate : AS_OF,
    title: `Your goal is ${fmt(goal.behindBy)} behind your plan`,
    body: `You planned to put in ${fmt(goal.plannedMoneyInToDate)} by now. So far ${fmt(goal.actualMoneyInToDate)} went through. This only counts deposits, not the market.`,
    nextStep: `You can add a one-time deposit to catch up, or keep going as planned. Either is fine.`,
    action: { kind: 'one-time-deposit', label: 'Add a one-time deposit', amount: goal.behindBy },
    amount: goal.behindBy, goalId: goal.id, terms: ['goal-pace', 'money-in'], route: 'overview' });
  if (cash >= CASH_WAITING && cashSince) flags.push({ id: 'cash-sitting', severity: 'heads-up', date: cashSince, raisedOn: cashSince,
    title: `${fmt(cash)} is waiting in cash`,
    body: autoInvestPausedOn
      ? `Auto-invest has been paused since ${apDate(autoInvestPausedOn)}, so deposits since then stay as cash. Cash does not go up or down with the market.`
      : `This money has been in cash since ${apDate(cashSince)}. Cash does not go up or down with the market.`,
    nextStep: 'It is your choice. You can turn auto-invest back on, or leave it paused.',
    action: { kind: 'auto-invest', label: 'See auto-invest settings' },
    amount: cash, terms: ['cash', 'auto-invest'], route: 'overview' });
  for (const h of holdings) {
    const f = FUND_DEFS.find((x) => x.ticker === h.ticker);
    const up = f.expenseRatio.find((e) => e.effective > AS_OF && daysBetween(AS_OF, e.effective) <= 30);
    if (!up) continue;
    const from = expenseRatioOn(h.ticker, AS_OF), extra = r2(h.value * (up.value - from) / 100);
    flags.push({ id: 'fee-going-up', severity: 'heads-up', date: up.effective, raisedOn: up.announcedOn,
      title: `${h.ticker} is raising its yearly fee on ${apDate(up.effective)}`,
      body: `The fee goes from ${from.toFixed(2)}% to ${up.value.toFixed(2)}%. On the ${fmt(h.value)} you have in it, that is about ${fmt(extra)} more a year.`,
      nextStep: 'Nothing changes in your account unless you choose to. The fund page shows its fee over time.',
      action: { kind: 'open-fund', label: `Open ${h.ticker}` },
      ticker: h.ticker, feeFrom: from, feeTo: up.value, amount: extra, terms: ['expense-ratio'], route: 'fund' });
  }
  const div = activity.filter((a) => a.type === 'dividend' && daysBetween(a.date, AS_OF) <= 7).at(-1);
  if (div) flags.push({ id: 'dividend-paid', severity: 'fyi', date: div.date, raisedOn: div.date,
    title: `${div.ticker} paid you ${fmt(div.amount)}`,
    body: 'Some funds make small payments to the people who own them. It went into your cash.',
    nextStep: 'Nothing to do. This is just so you know.',
    action: null,
    ticker: div.ticker, amount: div.amount, activityId: div.id, terms: ['dividend', 'cash'], route: 'activity' });
  for (const fl of flags) fl.newSinceLastReview = fl.raisedOn > LAST_REVIEW;
  return { account, activity, flags };
}

const main = simulate({ id: 'rosa-starter', mix: { 'FL-BROAD': 0.6, 'FL-WORLD': 0.2, 'FL-BOND': 0.15, 'FL-GREEN': 0.05 },
  autoInvestPausedOn: '2026-07-14', returnedDeposits: { '2026-09-01': '2026-09-03' } });
const calm = simulate({ id: 'rosa-all-clear', mix: { 'FL-BROAD': 0.65, 'FL-WORLD': 0.2, 'FL-BOND': 0.15 } });
const emptyAccount = {
  id: 'rosa-new', ownerId: 'rosa', name: 'Starter account', fictional: true, openedOn: LAST_CLOSE, asOf: AS_OF, lastClose: LAST_CLOSE,
  balance: 0, investedValue: 0, cash: 0, cashSince: null, moneyIn: 0, gainLoss: 0, gainLossPercent: 0, dividendsTotal: 0,
  recurringDeposit: null, autoInvest: { on: false, startedOn: null, pausedOn: null }, targetMix: null, holdings: [], goal: null, weeklyChange: null, history: [],
};

const scenarios = [
  { id: 'normal', label: 'Rosa, 7 months in', description: 'Seven months in. Her account has a few things worth a look.', accountId: 'rosa-starter' },
  { id: 'all-clear', label: 'Nothing needs you', description: 'A calmer version of Rosa. Every deposit went through, auto-invest is on, and she skipped the clean energy fund.', accountId: 'rosa-all-clear' },
  { id: 'brand-new', label: 'Brand-new account', description: 'Rosa just opened her account and has not added money yet.', accountId: 'rosa-new' },
];

// ---------- practice mode ----------
const practice = {
  startingCash: 1000, fictional: true, minOrder: 1, maxDecimals: 2, fractionalShares: true, tradeFee: 0,
  priceDate: LAST_CLOSE, funds: FUND_DEFS.map((f) => f.ticker),
  timeMachine: { from: weeklyDates[0], to: LAST_CLOSE, series: 'weekly',
    note: 'This uses past prices to show how a mix could have moved. The past does not tell you what will happen next.' },
};

// ---------- P302 story: start early beats start big ----------
const RATE = 0.06, END_AGE = 65;
// Your money story's point of view (P302 brief). The "right now" half is only used when rule R1 holds.
const POV_NOW = "Right now, almost all of Rosa's balance is money she put in.";
const POV_REST = 'Growth needs years, so starting early and staying steady matter more than picking the perfect moment.';
// Standing alone (no history yet), the second sentence is split: as one sentence it reads at grade 8.4.
const POV_GENERAL = 'Growth needs years. Starting early and staying steady matter more than picking the perfect moment.';
function project(startAge, monthly, rate = RATE) {
  const i = rate / 12; let v = 0, putIn = 0; const yearly = [{ age: startAge, putIn: 0, value: 0 }];
  for (let age = startAge; age < END_AGE; age++) {
    for (let m = 0; m < 12; m++) { v = v * (1 + i) + monthly; putIn += monthly; }
    yearly.push({ age: age + 1, putIn: r2(putIn), value: r2(v) });
  }
  return { yearly, final: { putIn: r2(putIn), value: r2(v), earned: r2(v - putIn) } };
}
const savers = [
  { id: 'nia', name: 'Nia', startAge: 22, monthly: 100, fictional: true },
  { id: 'theo', name: 'Theo', startAge: 32, monthly: 150, fictional: true },
].map((s) => ({ ...s, ...project(s.startAge, s.monthly) }));
const nia = savers[0], theo = savers[1];
const months = (END_AGE - theo.startAge) * 12, im = RATE / 12;
const monthlyNeeded = Math.ceil(nia.final.value / ((Math.pow(1 + im, months) - 1) / im));

// Bumpy version: invented yearly returns with the same OVERALL growth (6% a year, compounded).
// Chosen so it teaches "ups and downs" without staging a late crash that reads like a forecast:
// no single year worse than -20%, Nia's balance never falls more than 25% from its peak,
// and both endings land within 15% of the smooth endings.
const gm = (arr) => Math.pow(arr.reduce((p, r) => p * (1 + r), 1), 1 / arr.length) - 1;
function bumpyPath(returns, startAge, monthly) {
  let v = 0; const yearly = [{ age: startAge, value: 0 }];
  for (let age = startAge; age < END_AGE; age++) {
    const m = Math.pow(1 + returns[age - nia.startAge], 1 / 12) - 1;
    for (let k = 0; k < 12; k++) v = Math.max(0, v * (1 + m) + monthly);
    yearly.push({ age: age + 1, value: r2(v) });
  }
  return yearly;
}
const maxDrawdown = (ys) => { let peak = 0, dd = 0; for (const y of ys) { peak = Math.max(peak, y.value); if (peak > 0) dd = Math.max(dd, 1 - y.value / peak); } return dd; };
let bumpySeed = 302, yearlyReturns, bNia, bTheo;
for (;; bumpySeed++) {
  const br = mulberry32(bumpySeed);
  let rs = Array.from({ length: END_AGE - nia.startAge }, () => 0.06 + 0.13 * gauss(br));
  for (let k = 0; k < 60; k++) { const g = gm(rs); rs = rs.map((r) => (1 + r) * (1.06 / (1 + g)) - 1); }
  rs = rs.map((r) => r4(r));
  const n = bumpyPath(rs, nia.startAge, nia.monthly), t = bumpyPath(rs, theo.startAge, theo.monthly);
  const close = (a, b) => Math.abs(a / b - 1) <= 0.15; // bumpy ending within 15% of the smooth ending, so bumpiness never looks like a bonus or a disaster
  if (Math.min(...rs) >= -0.2 && rs.some((r) => r < 0) && maxDrawdown(n.slice(5)) <= 0.25 && n.at(-1).value > t.at(-1).value
      && close(n.at(-1).value, nia.final.value) && close(t.at(-1).value, theo.final.value)) { yearlyReturns = rs; bNia = n; bTheo = t; break; }
  if (bumpySeed > 5000) throw new Error('no bumpy seed found');
}

const story = {
  id: 'your-money-story', title: 'Your money story', fictional: true,
  // Shown when an account has no story of its own yet (the brand-new account). Accounts with
  // history carry their own point of view in rosaStory, checked by rule R1.
  pointOfView: POV_GENERAL,
  assumptions: { annualRate: RATE, compounding: 'monthly', contributionTiming: 'end of each month', endAge: END_AGE,
    note: 'An example rate of 6% a year. Real markets go up and down, and nobody can promise a rate.' },
  savers: savers.map(({ id, name, startAge, monthly, fictional, yearly, final }) => ({ id, name, startAge, monthly, fictional, yearly, final })),
  catchUp: { saverId: 'theo', mustMatch: 'nia', monthlyNeeded, slider: { min: 150, max: 300, step: 1 } },
  startAgeSlider: { min: 18, max: 45, step: 1, monthly: 100 },
  bumpy: { seed: bumpySeed, yearlyReturns, overallGrowth: RATE, nia: bNia, theo: bTheo,
    note: 'Same overall growth as the smooth line: 6% a year. The order of good and bad years changes the ending.' },
  yourTurn: { personaId: 'rosa', startAge: persona.age, monthly: RECURRING.amount,
    note: 'This is an example, not a plan or advice.' },
  claims: [
    { id: 'early-ends-ahead', text: 'Nia ends with more money than Theo.' },
    { id: 'early-puts-in-less', text: 'Nia puts in less money than Theo.' },
    { id: 'early-earned-share', text: "Most of Nia's money at 65 came from growth, not from what she put in." },
    { id: 'catch-up-costs-more', text: `To catch up, Theo would need about $${monthlyNeeded} a month.` },
    { id: 'early-ahead-when-bumpy', text: 'Even when the years go up and down, Nia still ends ahead.' },
  ],
  sources: [
    { label: 'Investor.gov compound interest calculator (U.S. SEC)', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' },
  ],
};

// ---------- Your money story: Rosa's own facts and claims, per account (rules R1-R4) ----------
// Every number the story states about Rosa comes from here, and the validator recomputes
// each one from the price and balance history.
const DIP = { ticker: 'FL-BROAD', from: '2026-06-15', to: '2026-07-31' }; // "the dip in July": the biggest drop in this window (the June 26 high into July)
const pct1 = (x) => (Math.round(x * 1000) / 10).toFixed(1);
function findDip() {
  const rows = funds.find((f) => f.ticker === DIP.ticker).history.daily.filter((d) => d.date >= DIP.from && d.date <= DIP.to);
  let peak = rows[0], best = { high: rows[0], low: rows[0], drop: 0 };
  for (const r of rows) {
    if (r.close > peak.close) peak = r;
    const drop = r.close / peak.close - 1;
    if (drop < best.drop) best = { high: peak, low: r, drop };
  }
  return { ticker: DIP.ticker, window: { from: DIP.from, to: DIP.to }, highDate: best.high.date, high: best.high.close,
    lowDate: best.low.date, low: best.low.close, drop: r4(best.low.close / best.high.close - 1) };
}
function rosaStoryFor({ account, activity }) {
  const a = account, h = a.history, dip = findDip();
  const at = h.find((r) => r.date === dip.lowDate);
  const atLow = { date: dip.lowDate, balance: at.balance, moneyIn: at.moneyIn, below: r2(at.moneyIn - at.balance) };
  const share = r4(a.moneyIn / a.balance);
  const paused = a.autoInvest.pausedOn;
  const since = paused || dip.lowDate;
  const backAbove = h.find((r) => r.date > since && r.balance > r.moneyIn);
  const depositsAfter = activity.filter((x) => x.type === 'deposit' && x.status === 'completed' && x.settledDate > since)
    .map((x) => ({ date: x.settledDate, amount: x.amount }));
  const first = activity.find((x) => x.type === 'deposit' && x.kind === 'first');
  const facts = {
    openedOn: a.openedOn, firstDeposit: first.amount, moneyIn: a.moneyIn, balance: a.balance, earned: a.gainLoss,
    depositsShare: share, lastClose: LAST_CLOSE, dip, atLow,
    pause: paused ? { date: paused } : null,
    after: { backAboveDate: backAbove.date, backAboveBalance: backAbove.balance, backAboveMoneyIn: backAbove.moneyIn,
      deposits: depositsAfter, depositsInvested: !paused, upNow: a.gainLoss },
  };
  const list = (xs) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`);
  const claims = [
    { id: 'since-march', chapter: 1, text: `You opened your account on ${apDate(a.openedOn)} with ${fmt(first.amount)}. Since then you have put in ${fmt(a.moneyIn)}. On ${apDate(LAST_CLOSE)} your balance was ${fmtCents(a.balance)}.` },
    { id: 'deposits-share', chapter: 2, text: a.gainLoss >= 0
      ? `About ${Math.round(share * 100)}% of your balance is money you put in. The other ${fmtCents(a.gainLoss)} is what it earned.`
      : `Your balance is ${fmtCents(-a.gainLoss)} below the ${fmt(a.moneyIn)} you put in.` },
    { id: 'dip', chapter: 3, text: `From ${apDate(dip.highDate)} to ${apDate(dip.lowDate)}, ${dip.ticker} fell from ${fmtCents(dip.high)} to ${fmtCents(dip.low)}. That is a drop of ${pct1(-dip.drop)}%.` },
    ...(atLow.below > 0 ? [{ id: 'at-low', chapter: 3, text: `On ${apDate(atLow.date)}, your balance was ${fmtCents(atLow.balance)}. That was ${fmtCents(atLow.below)} below the ${fmt(atLow.moneyIn)} you had put in.` }] : []),
    ...(paused
      ? [{ id: 'pause', chapter: 3, text: `You paused auto-invest the next day, ${apDate(paused)}.` },
         { id: 'back-above', chapter: 3, text: `By ${apDate(backAbove.date)}, your balance was back above what you had put in.` },
         { id: 'cash-after', chapter: 3, text: `After that, your ${list(depositsAfter.map((d) => apDate(d.date)))} deposit${depositsAfter.length > 1 ? 's' : ''} stayed as cash.` }]
      : [{ id: 'back-above', chapter: 3, text: `By ${apDate(backAbove.date)}, your balance was back above what you had put in.` },
         { id: 'kept-buying', chapter: 3, text: `Auto-invest stayed on. Your ${list(depositsAfter.map((d) => apDate(d.date)))} deposit${depositsAfter.length > 1 ? 's' : ''} bought your mix the day ${depositsAfter.length > 1 ? 'they' : 'it'} arrived.` }]),
    { id: 'up-now', chapter: 3, text: a.gainLoss >= 0 ? `On ${apDate(LAST_CLOSE)}, you were up ${fmtCents(a.gainLoss)}.` : `On ${apDate(LAST_CLOSE)}, you were down ${fmtCents(-a.gainLoss)}.` },
  ];
  const pointOfView = share >= 0.9 ? `${POV_NOW} ${POV_REST}` : POV_GENERAL;
  return { accountId: a.id, pointOfView, facts, claims };
}
story.rosaStory = { 'rosa-starter': rosaStoryFor(main), 'rosa-all-clear': rosaStoryFor(calm), 'rosa-new': null };

// ---------- write ----------
const write = (name, obj) => writeFileSync(join(OUT, name), JSON.stringify(obj, null, 2) + '\n');
write('meta.json', meta);
write('persona.json', persona);
write('funds.json', funds);
write('account.json', main.account);
write('account-all-clear.json', calm.account);
write('account-new.json', emptyAccount);
write('activity.json', { 'rosa-starter': main.activity, 'rosa-all-clear': calm.activity, 'rosa-new': [] });
write('attention.json', { 'rosa-starter': main.flags, 'rosa-all-clear': calm.flags, 'rosa-new': [] });
write('scenarios.json', scenarios);
write('practice.json', practice);
write('story-p302.json', story);
console.log(`Wrote data to ${OUT}`);
for (const { account: a, flags } of [main, calm]) console.log(a.id, { balance: a.balance, cash: a.cash, moneyIn: a.moneyIn, gainLoss: a.gainLoss, week: a.weeklyChange.totalChange, goal: [a.goal.behindBy, a.goal.progress, a.goal.plannedMoneyInByTarget], flags: flags.map((f) => `${f.id}${f.newSinceLastReview ? '*' : ''}`) });
console.log({ niaFinal: nia.final, theoFinal: theo.final, monthlyNeeded, bumpySeed, bumpy: [bNia.at(-1).value, bTheo.at(-1).value], minYear: Math.min(...yearlyReturns) });
