#!/usr/bin/env node
// First Leaf: data generator.
// Produces the JSON files in src/shared/data/ from one seeded source, so the numbers in
// P301, P302 and P303 always agree. Re-running gives identical output. Rules the data must
// obey live in BRIEF.md §4 and are enforced independently by scripts/validate-data.mjs.
// Never hand-edit the generated JSON: change this file, run `npm run data:generate`, then
// `npm run validate`. (glossary.json is hand-written copy and is NOT produced here.)
//
// What is real (ruling B, Phase 2.5): the stock and crypto names and tickers; crypto prices
// (CoinGecko, saved by scripts/fetch-crypto.mjs); the stock anchor closes and dividends in
// docs/research/PRICE-ANCHORS.md. What is invented: Rosa, her accounts, and each stock's
// daily path between its anchors. This script never uses the network.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// FL_FIXTURE=big-move writes a TEST-ONLY copy of the data (a week where NVIDIA moved 9%)
// to tests/fixtures/big-move/, for the Playwright test that proves the big-move alert.
// It never goes into src/shared/data, and check:fixtures proves it never ships.
const FIXTURE = process.env.FL_FIXTURE === 'big-move';
const OUT = FIXTURE ? join(ROOT, 'tests', 'fixtures', 'big-move') : join(ROOT, 'src', 'shared', 'data');
mkdirSync(OUT, { recursive: true });

// ---------- helpers ----------
const r2 = (n) => Math.round(n * 100) / 100;
const r4 = (n) => Math.round(n * 10000) / 10000;
const roundN = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const floorN = (n, d) => Math.floor(n * 10 ** d + 1e-9) / 10 ** d;
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

// U.S. stock market calendar: weekdays minus market holidays. Crypto trades every day.
const HOLIDAYS = ['2025-11-27', '2025-12-25', '2026-01-01', '2026-01-19', '2026-02-16', '2026-04-03', '2026-05-25', '2026-06-19', '2026-07-03', '2026-09-07', '2026-11-26', '2026-12-25'];
const isTradingDay = (s) => dow(s) !== 0 && dow(s) !== 6 && !HOLIDAYS.includes(s);
const nextTradingDay = (s) => { let d = s; while (!isTradingDay(d)) d = addDays(d, 1); return d; };
const prevTradingDay = (s) => { let d = addDays(s, -1); while (!isTradingDay(d)) d = addDays(d, -1); return d; };

// Money in copy: whole dollars without cents ("$150"), otherwise two decimals ("$154.76").
const fmt = (n) => (Number.isInteger(r2(n))
  ? `$${r2(n).toLocaleString('en-US')}`
  : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const AP_MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtCents = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const apDate = (s) => `${AP_MONTHS[Number(s.slice(5, 7)) - 1]} ${Number(s.slice(8, 10))}`;
const pct1 = (x) => (Math.round(x * 1000) / 10).toFixed(1);

// ---------- sources: saved crypto prices and the verified stock facts ----------
const ANCHOR_DOC = readFileSync(join(ROOT, 'docs', 'research', 'PRICE-ANCHORS.md'), 'utf8');
const block = (name) => JSON.parse(ANCHOR_DOC.match(new RegExp('```json ' + name + '\\n([\\s\\S]*?)```'))[1]);
const ANCHORS = block('price-anchors');
const STOCK_VOL = block('stock-volatility');
const DIVIDENDS = block('dividends');
const coingecko = (id) => JSON.parse(readFileSync(join(ROOT, 'src', 'shared', 'data', 'raw', `coingecko-${id}.json`), 'utf8'));

// ---------- fixed facts ----------
const AS_OF = '2026-09-20';            // Sunday: the day of Rosa's weekly review
const LAST_CLOSE = '2026-09-18';       // Friday: latest prices in the data
const LAST_REVIEW = '2026-09-13';      // the Sunday before
const STOCK_START = '2025-09-19';      // the first stock anchor: 12 months of history
const ACCOUNT_OPENED = '2026-03-02';
const WEEK_START_CLOSE = '2026-09-11'; // "this week" = close Sept. 11 -> close Sept. 18
// Term of the Day (Phase 6): a Finance Terms entry that Home uses (the dark card's Invested row).
const WORD_OF_THE_DAY = 'invested';
const BIG_MOVE = 0.07;                 // a holding moving this much in a week gets a heads-up
// The dip (ruling B, Phase 2.5): the largest 10-trading-day fall in Rosa's portfolio value
// between April 15 and Aug. 15, 2026, measured as the market change in her balance (deposits
// and dividends taken out). Auto-invest keeps buying with every deposit through it (Phase 6).
const DIP_WINDOW = { from: '2026-04-15', to: '2026-08-15', tradingDays: 10 };
// Ruling (Sept. 25): the first seed after 1 where the dip is an 8% to 15% fall: seed 10. Seed 1's
// 4.2% dip was too shallow to carry the story. Alex's ruling (Sept. 28): keep seed 10.
const DIP_MIN = 0.08, DIP_MAX = 0.15;

const meta = {
  product: 'First Leaf',
  company: 'First Leaf Investing',
  asOf: AS_OF,
  lastClose: LAST_CLOSE,
  lastReview: LAST_REVIEW,
  bigMoveThreshold: BIG_MOVE,
  wordOfTheDay: WORD_OF_THE_DAY,
  currency: 'USD',
  fictional: true,
  dataVersion: 4,
};

const persona = {
  id: 'rosa',
  firstName: 'Rosa',
  age: 26,
  city: 'Tucson, Arizona',
  job: 'Dental hygienist',
  fictional: true,
  story:
    'Rosa opened her first investing account in March 2026. She had never bought a stock before. She puts in $150 each month, and auto-invest buys her mix with each deposit. This summer, prices dipped for two weeks, and auto-invest kept buying. She wants to understand what her money is doing without feeling lost.',
  worries: [
    'Losing money without knowing why',
    'Words like "volatility" that nobody explains',
    'Doing something wrong and not being able to undo it',
  ],
  devices: { phone: 'iPhone, one hand, between other things', laptop: 'Laptop on Sunday mornings' },
  moments: {
    P301: 'Sunday morning at her laptop, doing a calm weekly review of the whole account.',
    P302: 'An evening on the couch, working through one lesson about why starting early matters.',
    P303: 'A 60-second check on her phone between other things, like waiting in line for coffee: does anything need me, and why did my balance move?',
  },
};

// ---------- the lineup (ruling B) ----------
// The order of this list fixes the random stock paths. Don't reorder it.
// "about": checked against each 10-K or project site (docs/research/DESCRIPTIONS.md).
const ASSET_DEFS = [
  { ticker: 'AAPL', name: 'Apple', kind: 'stock', about: 'Apple makes the iPhone, the Mac and the iPad. It also sells services like app downloads and music.' },
  { ticker: 'MSFT', name: 'Microsoft', kind: 'stock', about: 'Microsoft makes Windows and Office. It also runs a cloud service, where people and businesses pay to use its computers over the internet.' },
  { ticker: 'NVDA', name: 'NVIDIA', kind: 'stock', about: 'NVIDIA designs computer chips. People use them for video games and to build AI.' },
  { ticker: 'COST', name: 'Costco', kind: 'stock', about: 'Costco runs warehouse stores and websites. Shoppers pay a yearly fee to be members.' },
  { ticker: 'NKE', name: 'Nike', kind: 'stock', about: 'Nike designs and sells sports shoes, clothes and gear. Other companies make most of it.' },
  { ticker: 'AMZN', name: 'Amazon', kind: 'stock', about: 'Amazon runs stores online and in person. It also rents out its computers over the internet.' },
  { ticker: 'TSLA', name: 'Tesla', kind: 'stock', about: 'Tesla makes electric cars. It also makes batteries that store power for homes and businesses.' },
  { ticker: 'BTC', name: 'Bitcoin', kind: 'crypto', coin: 'bitcoin', about: 'Bitcoin is a digital currency. No company or bank runs it.' },
  { ticker: 'ETH', name: 'Ethereum', kind: 'crypto', coin: 'ethereum', about: 'Ethereum is a computer network. It has its own digital currency, called ether. People also run programs on it.' },
  { ticker: 'SOL', name: 'Solana', kind: 'crypto', coin: 'solana', about: 'Solana is a computer network. It has its own digital currency, called SOL. People also run programs on it.' },
];
const DECIMALS = { stock: 4, crypto: 8 };  // parts of a share: 4 places for stocks, 8 for crypto
const MIX = { AAPL: 0.25, MSFT: 0.2, NVDA: 0.1, COST: 0.15, NKE: 0.1, BTC: 0.12, ETH: 0.08 };

// "Ups and downs" (1-5) from the 12-month volatility of daily log returns (BRIEF.md §4).
const UPS_BANDS = [0.2, 0.3, 0.45, 0.65];
const yearlyVol = (closes, perYear) => {
  const r = []; for (let i = 1; i < closes.length; i++) r.push(Math.log(closes[i] / closes[i - 1]));
  const m = r.reduce((a, b) => a + b, 0) / r.length;
  return Math.sqrt(r.reduce((a, b) => a + (b - m) ** 2, 0) / (r.length - 1)) * Math.sqrt(perYear);
};
const upsAndDowns = (v) => 1 + UPS_BANDS.filter((b) => v >= b).length;

const stockDays = [];
for (let d = STOCK_START; d <= LAST_CLOSE; d = addDays(d, 1)) if (isTradingDay(d)) stockDays.push(d);
const accountDays = stockDays.filter((d) => d >= ACCOUNT_OPENED);
// Weekly closes: the last trading day of each week.
const weeklyDates = stockDays.filter((d, i) => { const n = stockDays[i + 1]; return !n || dow(n) <= dow(d) || daysBetween(d, n) > 3; });

// A Brownian bridge in log price, forced through every anchor close exactly.
function stockPath(ticker, rand) {
  const sd = STOCK_VOL[ticker], anchors = ANCHORS[ticker];
  const marks = Object.keys(anchors).sort().map((d) => { const i = stockDays.indexOf(d); if (i < 0) throw new Error(`${ticker} anchor ${d} is not a trading day`); return i; });
  if (marks[0] !== 0 || marks.at(-1) !== stockDays.length - 1) throw new Error(`${ticker} anchors must start and end the history`);
  const w = [0]; for (let i = 1; i < stockDays.length; i++) w.push(w[i - 1] + sd * gauss(rand));
  const lp = new Array(stockDays.length);
  for (let k = 0; k + 1 < marks.length; k++) {
    const a = marks[k], b = marks[k + 1], la = Math.log(anchors[stockDays[a]]), lb = Math.log(anchors[stockDays[b]]);
    for (let t = a; t <= b; t++) lp[t] = la + (w[t] - w[a]) - ((t - a) / (b - a)) * ((w[b] - w[a]) - (lb - la));
  }
  const series = {};
  stockDays.forEach((d, i) => { series[d] = anchors[d] ?? r2(Math.exp(lp[i])); });
  return series;
}

function buildAssets(seed) {
  const rand = mulberry32(seed);
  const priceBy = {};
  for (const a of ASSET_DEFS) {
    if (a.kind === 'stock') priceBy[a.ticker] = stockPath(a.ticker, rand);
    else priceBy[a.ticker] = Object.fromEntries(coingecko(a.coin).daily.map((x) => [x.date, x.close]));
  }
  const assets = ASSET_DEFS.map((a) => {
    const series = priceBy[a.ticker];
    const daily = Object.keys(series).sort().map((d) => ({ date: d, close: series[d] }));
    const vol = yearlyVol(daily.map((x) => x.close), a.kind === 'stock' ? 252 : 365);
    return {
      ticker: a.ticker, name: a.name, kind: a.kind, about: a.about,
      priceSource: a.kind === 'stock' ? 'modeled' : 'coingecko',
      volatility: r4(vol), upsAndDowns: upsAndDowns(vol),
      dividends: DIVIDENDS.filter((x) => x.ticker === a.ticker).map(({ perShare, exDate, payDate }) => ({ perShare, exDate, payDate })),
      latestPrice: series[LAST_CLOSE],
      history: { weekly: weeklyDates.filter((d) => series[d] !== undefined).map((d) => ({ date: d, close: series[d] })), daily },
    };
  });
  const priceOn = (ticker, date) => { const p = priceBy[ticker][date]; if (p === undefined) throw new Error(`no price for ${ticker} on ${date}`); return p; };
  return { assets, priceOn };
}
const kindOf = (t) => ASSET_DEFS.find((a) => a.ticker === t).kind;

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

function findDip(history, activity) {
  const rows = history.filter((r) => r.date >= DIP_WINDOW.from && r.date <= DIP_WINDOW.to);
  const divIn = (a, b) => r2(activity.filter((x) => x.type === 'dividend' && x.date > a && x.date <= b).reduce((s, x) => s + x.amount, 0));
  let best = null;
  for (let i = 0; i + DIP_WINDOW.tradingDays < rows.length; i++) {
    const a = rows[i], b = rows[i + DIP_WINDOW.tradingDays];
    const change = r2(b.balance - a.balance - (b.moneyIn - a.moneyIn) - divIn(a.date, b.date));
    const pct = change / a.balance;
    if (!best || pct < best.pct) best = { a, b, change, pct };
  }
  return {
    window: { from: DIP_WINDOW.from, to: DIP_WINDOW.to }, tradingDays: DIP_WINDOW.tradingDays,
    highDate: best.a.date, highBalance: best.a.balance, lowDate: best.b.date, lowBalance: best.b.balance,
    fall: r2(-best.change), drop: r4(best.pct), month: FULL_MONTHS[Number(best.b.date.slice(5, 7)) - 1],
  };
}

function simulate({ id, mix, priceOn, beneficiary = null }) {
  const shares = Object.fromEntries(Object.keys(mix).map((t) => [t, 0]));
  const costBasis = Object.fromEntries(Object.keys(mix).map((t) => [t, 0]));
  let cash = 0, moneyIn = 0, n = 1;
  const activity = []; const history = []; const sharesAtClose = {};
  const nextId = () => `${id}-${String(n++).padStart(3, '0')}`;
  // A monthly deposit is scheduled on a business day: one due on a weekend (Aug. 1, 2026 is a
  // Saturday) is made the next trading day, so it arrives and buys the same day (Phase 6 review).
  const deposits = planDeposits(AS_OF).map((dep) => ({ ...dep, date: nextTradingDay(dep.date) }));
  const byDate = {};
  for (const dep of deposits) (byDate[nextTradingDay(dep.date)] ||= []).push({ type: 'deposit', dep });
  for (const dv of DIVIDENDS) if (mix[dv.ticker] !== undefined && dv.payDate <= LAST_CLOSE && dv.exDate > ACCOUNT_OPENED) (byDate[nextTradingDay(dv.payDate)] ||= []).push({ type: 'dividend', dv });

  for (const d of accountDays) {
    for (const e of byDate[d] || []) {
      if (e.type === 'deposit') {
        // Every deposit arrives, and auto-invest buys the mix with it the same day (Phase 6).
        activity.push({ id: nextId(), date: e.dep.date, settledDate: d, type: 'deposit', kind: e.dep.kind, amount: e.dep.amount, status: 'completed' });
        cash = r2(cash + e.dep.amount); moneyIn = r2(moneyIn + e.dep.amount);
        for (const [t, w] of Object.entries(mix)) {
          const dec = DECIMALS[kindOf(t)];
          const amt = r2(e.dep.amount * w), px = priceOn(t, d), sh = floorN(amt / px, dec);
          shares[t] = roundN(shares[t] + sh, dec); costBasis[t] = r2(costBasis[t] + amt); cash = r2(cash - amt);
          // Stocks settle one business day later (T+1); crypto settles the same day.
          const settledDate = kindOf(t) === 'stock' ? nextTradingDay(addDays(d, 1)) : d;
          activity.push({ id: nextId(), date: d, settledDate, type: 'buy', ticker: t, amount: amt, shares: sh, price: px, status: 'completed', via: 'auto-invest' });
        }
      } else {
        // Paid on the shares held at the close of the trading day before the ex-dividend date.
        const held = sharesAtClose[prevTradingDay(e.dv.exDate)]?.[e.dv.ticker] ?? 0;
        const amt = r2(held * e.dv.perShare);
        if (amt > 0) { cash = r2(cash + amt); activity.push({ id: nextId(), date: d, settledDate: d, type: 'dividend', ticker: e.dv.ticker, amount: amt, perShare: e.dv.perShare, sharesOnExDate: held, exDate: e.dv.exDate, status: 'completed' }); }
      }
    }
    sharesAtClose[d] = { ...shares };
    const invested = r2(Object.keys(shares).reduce((s, t) => s + r2(shares[t] * priceOn(t, d)), 0));
    history.push({ date: d, balance: r2(invested + cash), moneyIn, cash });
  }

  const holdings = Object.keys(shares).map((t) => {
    const value = r2(shares[t] * priceOn(t, LAST_CLOSE));
    return { ticker: t, kind: kindOf(t), shares: shares[t], price: priceOn(t, LAST_CLOSE), value, costBasis: costBasis[t], gainLoss: r2(value - costBasis[t]), targetShare: mix[t] };
  });
  const investedValue = r2(holdings.reduce((s, h) => s + h.value, 0));
  const balance = r2(investedValue + cash);
  const gainLoss = r2(balance - moneyIn);
  const dividendsTotal = r2(activity.filter((a) => a.type === 'dividend').reduce((s, a) => s + a.amount, 0));

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
  // Per-holding pieces must add up to the market change to the cent (P303 shows both).
  const diff = r2(weeklyChange.marketChange - weeklyChange.byFund.reduce((s, x) => s + x.change, 0));
  if (diff !== 0) { const big = weeklyChange.byFund.reduce((a, b) => (Math.abs(b.change) > Math.abs(a.change) ? b : a)); big.change = r2(big.change + diff); }

  const planned = r2(deposits.reduce((s, d) => s + d.amount, 0));
  const goal = { ...GOAL, plan: { first: 500, monthly: RECURRING.amount },
    plannedMoneyInToDate: planned, actualMoneyInToDate: moneyIn, behindBy: r2(planned - moneyIn),
    plannedMoneyInByTarget: r2(planDeposits(addDays(GOAL.targetDate, -1)).reduce((s, d) => s + d.amount, 0)),
    progress: r4(moneyIn / GOAL.target) };

  const account = {
    id, ownerId: 'rosa', name: 'Starter account', fictional: true, openedOn: ACCOUNT_OPENED, asOf: AS_OF, lastClose: LAST_CLOSE,
    balance, investedValue, cash, moneyIn, gainLoss, gainLossPercent: r4(gainLoss / moneyIn), dividendsTotal,
    recurringDeposit: RECURRING,
    autoInvest: { on: true, startedOn: ACCOUNT_OPENED },
    beneficiary,
    targetMix: mix, holdings, goal, weeklyChange, history,
  };

  // ----- alerts: generated from rules, so they are true for THIS account -----
  const flags = [];
  // A funded account with no beneficiary (Phase 6): the one thing that needs Rosa.
  if (!beneficiary && moneyIn > 0) flags.push({ id: 'beneficiary-missing', severity: 'needs-you', date: ACCOUNT_OPENED, raisedOn: ACCOUNT_OPENED,
    title: 'Name a beneficiary for your account',
    body: 'A beneficiary is the person who gets the money in your account if you die. You have not named one yet. Brokerages ask so your money can go to the person you choose, with fewer steps for your family.',
    nextStep: 'You can add one now, or be reminded later. It takes about a minute.',
    action: { kind: 'beneficiary', label: 'Add a beneficiary' },
    amount: 0, terms: ['beneficiary', 'brokerage-account'], route: 'settings' });
  for (const h of holdings) {
    const p0 = priceOn(h.ticker, WEEK_START_CLOSE), p1 = h.price, move = p1 / p0 - 1;
    if (Math.abs(move) < BIG_MOVE || h.shares <= 0) continue;
    const change = weeklyChange.byFund.find((x) => x.ticker === h.ticker).change;
    flags.push({ id: `big-move-${h.ticker}`, severity: 'heads-up', date: LAST_CLOSE, raisedOn: LAST_CLOSE,
      title: `${h.ticker} moved ${move > 0 ? 'up' : 'down'} ${pct1(Math.abs(move))}% this week`,
      body: `Its price went from ${fmtCents(p0)} on ${apDate(WEEK_START_CLOSE)} to ${fmtCents(p1)} on ${apDate(LAST_CLOSE)}. What you own in it went ${change >= 0 ? 'up' : 'down'} ${fmtCents(Math.abs(change))}.`,
      nextStep: 'Prices go up and down. Nothing changes in your account unless you choose to.',
      action: { kind: 'open-fund', label: `Open ${h.ticker}` },
      ticker: h.ticker, movePercent: r4(move), amount: Math.abs(change), terms: ['volatility'], route: 'fund' });
  }
  const div = activity.filter((a) => a.type === 'dividend' && daysBetween(a.date, AS_OF) <= 7).at(-1);
  const cryptoHeld = holdings.filter((h) => h.kind === 'crypto' && h.shares > 0);
  if (cryptoHeld.length) {
    const firstBuy = activity.find((a) => a.type === 'buy' && kindOf(a.ticker) === 'crypto');
    // A general fact only (ruling, Sept. 25): never say or imply that First Leaf is a SIPC
    // member or that Rosa's holdings are protected (15 U.S.C. §78jjj(d)).
    flags.push({ id: 'sipc-crypto', severity: 'fyi', date: firstBuy.date, raisedOn: firstBuy.date,
      title: "SIPC protection doesn't cover crypto",
      body: "SIPC protection covers stocks and cash at a member brokerage if the brokerage fails. It doesn't cover crypto, such as Bitcoin or Ethereum. It never covers a drop in price.",
      nextStep: 'Nothing to do. This is just so you know.',
      action: null, amount: 0, terms: ['sipc-protection', 'cryptocurrency'], route: 'glossary' });
  }
  if (div) flags.push({ id: 'dividend-paid', severity: 'fyi', date: div.date, raisedOn: div.date,
    title: `${div.ticker} paid you ${fmt(div.amount)}`,
    body: 'Some companies make small payments to the people who own their stock. It went into your cash.',
    nextStep: 'Nothing to do. This is just so you know.',
    action: null,
    ticker: div.ticker, amount: div.amount, activityId: div.id, terms: ['dividend'], route: 'activity' });
  for (const fl of flags) fl.newSinceLastReview = fl.raisedOn > LAST_REVIEW;
  return { account, activity, flags };
}

// ---------- the seed ----------
// Every anchor is hit by construction. Seed 10 (Alex's rulings, Sept. 25 and 28): its dip is an
// 8% to 15% fall, both accounts end up overall, and the calm account has nothing that needs her.
// The two accounts invest every deposit alike; only the beneficiary differs (Phase 6).
const CALM_BENEFICIARY = { name: 'Luis Ortega', relationship: 'Brother', fictional: true };
let SEED, assets, priceOn, main, calm, dip;
{
  SEED = Number(process.env.FL_SEED || 10);
  ({ assets, priceOn } = buildAssets(SEED));
  calm = simulate({ id: 'rosa-all-clear', mix: MIX, priceOn, beneficiary: CALM_BENEFICIARY });
  main = simulate({ id: 'rosa-starter', mix: MIX, priceOn, beneficiary: null });
  dip = findDip(main.account.history, main.activity);
  if (-dip.drop < DIP_MIN || -dip.drop > DIP_MAX) throw new Error(`seed ${SEED}: the dip is ${pct1(-dip.drop)}%, outside 8% to 15%`);
  if (!(main.account.gainLoss > 0 && calm.account.gainLoss > 0)) throw new Error(`seed ${SEED}: an account is down overall`);
  if (calm.flags.some((f) => f.severity !== 'fyi')) throw new Error(`seed ${SEED}: the calm account has something that needs her`);
}
if (FIXTURE) {
  // Lower NVIDIA's Sept. 11 close so it rises 9% this week, then re-run both accounts on it.
  const nv = assets.find((a) => a.ticker === 'NVDA'), p0 = r2(nv.latestPrice / 1.09), base = priceOn;
  for (const k of ['daily', 'weekly']) for (const x of nv.history[k]) if (x.date === WEEK_START_CLOSE) x.close = p0;
  priceOn = (t, d) => (t === 'NVDA' && d === WEEK_START_CLOSE ? p0 : base(t, d));
  main = simulate({ id: 'rosa-starter', mix: MIX, priceOn, beneficiary: null });
  calm = simulate({ id: 'rosa-all-clear', mix: MIX, priceOn, beneficiary: CALM_BENEFICIARY });
  meta.fixture = 'TEST-ONLY: a big-move week for the Playwright test. Never shipped.';
}
const funds = assets;
const emptyAccount = {
  id: 'rosa-new', ownerId: 'rosa', name: 'Starter account', fictional: true, openedOn: LAST_CLOSE, asOf: AS_OF, lastClose: LAST_CLOSE,
  balance: 0, investedValue: 0, cash: 0, moneyIn: 0, gainLoss: 0, gainLossPercent: 0, dividendsTotal: 0,
  recurringDeposit: null, autoInvest: { on: false, startedOn: null }, beneficiary: null, targetMix: null, holdings: [], goal: null, weeklyChange: null, history: [],
};

const scenarios = [
  { id: 'normal', label: 'Rosa, six months in', description: 'Six months in. She has not named a beneficiary yet.', accountId: 'rosa-starter' },
  { id: 'all-clear', label: 'Nothing needs you', description: 'The same six months, with a beneficiary named, so nothing needs her.', accountId: 'rosa-all-clear' },
  { id: 'brand-new', label: 'Brand-new account', description: 'Rosa just opened her account and has not added money yet.', accountId: 'rosa-new' },
];

// ---------- practice ----------
// The time machine starts on the first weekly close where every investment has a price.
const tmFrom = weeklyDates.find((d) => funds.every((f) => f.history.daily.some((x) => x.date === d)));
const practice = {
  startingCash: 1000, fictional: true, minOrder: 1, maxDecimals: 2, fractionalShares: true, tradeFee: 0,
  priceDate: LAST_CLOSE, funds: funds.map((f) => f.ticker),
  timeMachine: { from: tmFrom, to: LAST_CLOSE, series: 'weekly',
    note: 'This uses past prices to show how a mix could have moved. The past does not tell you what will happen next.' },
};

// ---------- P302 story: Your Journey ----------
const RATE = 0.06, END_AGE = 65;
// Your money story's point of view (P302 brief). The "right now" half is only used when rule R1 holds.
const POV_NOW = 'Right now, almost all of your balance is money you put in.'; // second person (ruling, Sept. 24)
const POV_REST = 'Growth needs years, so starting early and staying steady matter more than picking the perfect moment.';
// Standing alone (no history yet), the second sentence is split: as one sentence it reads at grade 8.4.
const POV_GENERAL = 'Growth needs years. Starting early and staying steady matter more than picking the perfect moment.';
// Your head start (section 3, Phase 6.1): two lines, both Rosa, from her age now to 65. "Keep
// going" starts from what the account has invested today and adds her recurring deposit every
// month; "Start again later" starts from the same amount, adds nothing for the delay, then adds
// the chosen amount. Money goes in at the end of each month, and the rate compounds monthly.
function headStartLine(start, monthly, delayYears, startAge, rate = RATE) {
  const i = rate / 12; let v = start; const yearly = [{ age: startAge, value: r2(v) }];
  for (let age = startAge; age < END_AGE; age++) {
    for (let m = 0; m < 12; m++) v = v * (1 + i) + ((age - startAge) * 12 + m >= delayYears * 12 ? monthly : 0);
    yearly.push({ age: age + 1, value: r2(v) });
  }
  return yearly;
}
const DELAY = { min: 1, max: 15, step: 1, default: 5 }, ADD = { min: 150, max: 300, step: 1, default: 150 };
// The smallest whole monthly amount that makes the later line reach the keep-going line at 65, or
// null when no amount on the slider does. (It doesn't depend on the starting amount: that part
// grows the same way on both lines.)
const catchUpFor = (years, start) => {
  const keep = headStartLine(start, RECURRING.amount, 0, persona.age).at(-1).value;
  for (let m = ADD.min; m <= ADD.max; m += ADD.step) if (headStartLine(start, m, years, persona.age).at(-1).value >= keep) return m;
  return null;
};
const headStartFor = (account) => {
  const start = account.investedValue;
  return { start, keepGoing: headStartLine(start, RECURRING.amount, 0, persona.age),
    laterDefault: headStartLine(start, ADD.default, DELAY.default, persona.age) };
};

const story = {
  id: 'your-journey', title: 'Your Journey', fictional: true,
  // Shown when an account has no story of its own yet (the brand-new account). Accounts with
  // history carry their own point of view in rosaStory, checked by rule R1.
  pointOfView: POV_GENERAL,
  assumptions: { annualRate: RATE, compounding: 'monthly', contributionTiming: 'end of each month', endAge: END_AGE,
    note: 'An example rate of 6% a year. Real markets go up and down, and nobody can promise a rate.' },
  headStart: {
    personaId: persona.id, startAge: persona.age, endAge: END_AGE, monthly: RECURRING.amount, delay: DELAY, add: ADD,
    catchUp: Array.from({ length: DELAY.max - DELAY.min + 1 }, (_, k) => DELAY.min + k).map((years) => ({ years, monthly: catchUpFor(years, main.account.investedValue) })),
    accounts: { 'rosa-starter': headStartFor(main.account), 'rosa-all-clear': headStartFor(calm.account), 'rosa-new': headStartFor(emptyAccount) },
  },
  sources: [
    { label: 'Investor.gov compound interest calculator (U.S. SEC)', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' },
  ],
};

// ---------- Your money story: Rosa's own facts and claims, per account (rules R1-R4) ----------
// Every number the story states about Rosa comes from here, and the validator recomputes
// each one from the balance history. Each account's dip is found in its own history.
function rosaStoryFor({ account, activity }) {
  const a = account, h = a.history, dp = findDip(h, activity);
  const at = h.find((r) => r.date === dp.lowDate);
  const atLow = { date: dp.lowDate, balance: at.balance, moneyIn: at.moneyIn, below: r2(at.moneyIn - at.balance) };
  const share = r4(a.moneyIn / a.balance);
  const backAbove = h.find((r) => r.date > dp.lowDate && r.balance > r.moneyIn);
  // Every deposit from the start of the fall on: auto-invest bought the mix with each one.
  const depositsFrom = activity.filter((x) => x.type === 'deposit' && x.status === 'completed' && x.settledDate > dp.highDate)
    .map((x) => ({ date: x.settledDate, amount: x.amount }));
  const first = activity.find((x) => x.type === 'deposit' && x.kind === 'first');
  const facts = {
    openedOn: a.openedOn, firstDeposit: first.amount, moneyIn: a.moneyIn, balance: a.balance, earned: a.gainLoss,
    depositsShare: share, lastClose: LAST_CLOSE, dip: dp, atLow,
    after: { backAboveDate: backAbove.date, backAboveBalance: backAbove.balance, backAboveMoneyIn: backAbove.moneyIn,
      deposits: depositsFrom, depositsInvested: true, upNow: a.gainLoss },
  };
  const list = (xs) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`);
  const claims = [
    { id: 'since-march', chapter: 1, text: `You opened your account on ${apDate(a.openedOn)} with ${fmt(first.amount)}. Since then you have put in ${fmt(a.moneyIn)}. On ${apDate(LAST_CLOSE)} your balance was ${fmtCents(a.balance)}.` },
    { id: 'deposits-share', chapter: 2, text: a.gainLoss >= 0
      ? `About ${Math.round(share * 100)}% of your balance is money you put in. The other ${fmtCents(a.gainLoss)} is what it earned.`
      : `Your balance is ${fmtCents(-a.gainLoss)} below the ${fmt(a.moneyIn)} you put in.` },
    { id: 'dip', chapter: 3, text: `From ${apDate(dp.highDate)} to ${apDate(dp.lowDate)}, falling prices took ${fmtCents(dp.fall)} off your balance. That is a drop of ${pct1(-dp.drop)}%.` },
    ...(atLow.below > 0 ? [{ id: 'at-low', chapter: 3, text: `On ${apDate(atLow.date)}, your balance was ${fmtCents(atLow.balance)}. That was ${fmtCents(atLow.below)} below the ${fmt(atLow.moneyIn)} you had put in.` }] : []),
    { id: 'back-above', chapter: 3, text: `By ${apDate(backAbove.date)}, your balance was back above what you had put in.` },
    { id: 'kept-buying', chapter: 3, text: `Auto-invest kept buying through the dip. Your ${list(depositsFrom.map((d) => apDate(d.date)))} deposits each bought your mix the day they arrived.` },
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
if (FIXTURE) writeFileSync(join(OUT, 'glossary.json'), readFileSync(join(ROOT, 'src', 'shared', 'data', 'glossary.json')));
console.log(`Wrote data to ${OUT} (seed ${SEED})`);
console.log('dip', dip);
for (const { account: a, flags } of [main, calm]) console.log(a.id, { balance: a.balance, cash: a.cash, moneyIn: a.moneyIn, gainLoss: a.gainLoss, week: a.weeklyChange.totalChange, goal: [a.goal.behindBy, a.goal.progress], flags: flags.map((f) => `${f.id}${f.newSinceLastReview ? '*' : ''}`) });
console.log(funds.map((f) => `${f.ticker} ${f.latestPrice} vol ${f.volatility} ups ${f.upsAndDowns}`).join(' | '));
console.log('head start', story.headStart.catchUp.map((c) => `${c.years}y:${c.monthly ?? '-'}`).join(' '), Object.fromEntries(Object.entries(story.headStart.accounts).map(([k, v]) => [k, [v.start, v.keepGoing.at(-1).value]])));
