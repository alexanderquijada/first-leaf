#!/usr/bin/env node
// Fetches a year of real daily crypto prices from CoinGecko (Demo API) and saves them to
// src/shared/data/raw/coingecko-<coin>.json. Run by hand; the data generator and the site
// only ever read the saved files, so the key never reaches a build or the browser.
//
//   node scripts/fetch-crypto.mjs
//
// The key is read from .env.local (COINGECKO_DEMO_KEY=...), which git ignores. It is sent
// in the x-cg-demo-api-key header, never in a URL, and never written to any file or log.
// Demo keys use the public root URL (api.coingecko.com), not pro-api.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'shared', 'data', 'raw');
const API = 'https://api.coingecko.com/api/v3';

// The app's year ends Sept. 18, 2026 (the last close in the data). CoinGecko's Demo plan only
// answers for the past 365 days, and this was fetched on Sept. 24, 2026, so the earliest daily
// close it gives is Sept. 24, 2025. (Stocks start at their Sept. 19, 2025 anchor.)
export const FIRST_DAY = '2025-09-24';
export const LAST_DAY = '2026-09-18';
export const COINS = [
  { ticker: 'BTC', id: 'bitcoin', name: 'Bitcoin' },
  { ticker: 'ETH', id: 'ethereum', name: 'Ethereum' },
  { ticker: 'SOL', id: 'solana', name: 'Solana' },
];

function readKey() {
  const p = join(ROOT, '.env.local');
  if (!existsSync(p)) throw new Error('No .env.local. Add COINGECKO_DEMO_KEY=... to it (it is git-ignored).');
  const line = readFileSync(p, 'utf8').split('\n').find((l) => l.startsWith('COINGECKO_DEMO_KEY='));
  const key = line?.slice('COINGECKO_DEMO_KEY='.length).trim();
  if (!key) throw new Error('COINGECKO_DEMO_KEY is missing from .env.local.');
  return key;
}

const addDays = (s, n) => { const d = new Date(s + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const unix = (s) => Math.floor(new Date(s + 'T00:00:00Z').getTime() / 1000);

async function fetchCoin(coin, key) {
  // Daily points come at 00:00 UTC. The point at 00:00 UTC on day D+1 is taken as day D's close
  // (CoinGecko's own "daily close" convention), so we ask for one extra day at the end.
  const url = `${API}/coins/${coin.id}/market_chart/range?vs_currency=usd&from=${unix(addDays(FIRST_DAY, 1))}&to=${unix(addDays(LAST_DAY, 1)) + 3600}`;
  const res = await fetch(url, { headers: { accept: 'application/json', 'x-cg-demo-api-key': key } });
  if (!res.ok) throw new Error(`${coin.id}: CoinGecko answered ${res.status} ${(await res.text()).slice(0, 200)}`);
  const body = await res.json();
  const byDay = new Map();
  for (const [ms, price] of body.prices) {
    const t = new Date(ms);
    if (t.getUTCHours() !== 0 || t.getUTCMinutes() !== 0) continue; // only the 00:00 UTC daily points
    byDay.set(addDays(t.toISOString().slice(0, 10), -1), price);
  }
  const days = [];
  for (let d = FIRST_DAY; d <= LAST_DAY; d = addDays(d, 1)) {
    if (!byDay.has(d)) throw new Error(`${coin.id}: no daily close for ${d}`);
    days.push({ date: d, close: Math.round(byDay.get(d) * 100) / 100 });
  }
  return {
    ticker: coin.ticker, id: coin.id, name: coin.name,
    source: 'CoinGecko API (Demo plan), /coins/{id}/market_chart/range, vs_currency=usd',
    sourceUrl: `https://www.coingecko.com/en/coins/${coin.id}`,
    attribution: 'Crypto prices by CoinGecko',
    convention: 'Each date\'s close is CoinGecko\'s 00:00 UTC price on the next day, rounded to cents.',
    fetchedAt: new Date().toISOString(),
    from: FIRST_DAY, to: LAST_DAY,
    daily: days,
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const key = readKey();
  mkdirSync(OUT, { recursive: true });
  for (const coin of COINS) {
    const data = await fetchCoin(coin, key);
    writeFileSync(join(OUT, `coingecko-${coin.id}.json`), JSON.stringify(data, null, 2) + '\n');
    console.log(`${coin.ticker}: ${data.daily.length} daily closes, ${data.daily[0].date} $${data.daily[0].close} to ${data.daily.at(-1).date} $${data.daily.at(-1).close}`);
  }
}
