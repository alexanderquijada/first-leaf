import { computed, reactive } from 'vue'
import { funds, getFund, practiceRules, type Ticker } from '../data'
import { copy, fill } from '../copy'
import { formatMoney } from '../format'

const E = copy.practiceErrors

// Practice: pretend money for trying things. Module scope, so a half-finished
// session survives navigation; reloading starts over. It reads fund prices and
// practice rules only: it has no way to reach Rosa's account (and the account
// data is frozen, so any write would throw).

const r2 = (n: number) => Math.round(n * 100) / 100
// Parts of a share: 4 decimal places for stocks, 8 for crypto (as in the real account).
const places = (t: Ticker) => (getFund(t)?.kind === 'crypto' ? 8 : 4)
const roundTo = (n: number, t: Ticker) => Math.round(n * 10 ** places(t)) / 10 ** places(t)
const floorTo = (n: number, t: Ticker) => Math.floor(n * 10 ** places(t) + 1e-9) / 10 ** places(t)

interface Lot {
  shares: number
  paid: number
}
export type Side = 'buy' | 'sell'

const state = reactive({
  cash: practiceRules.startingCash,
  lots: {} as Partial<Record<Ticker, Lot>>,
})

const priceOf = (t: Ticker) => getFund(t)?.latestPrice ?? 0
const valueOf = (t: Ticker) => r2((state.lots[t]?.shares ?? 0) * priceOf(t))

/** The error for an order, or '' when it can go ahead. Checked in a fixed order. */
export function orderError(side: Side, ticker: Ticker, text: string): string {
  const t = text.trim().replace(/^\$/, '').replace(/,/g, '')
  if (t === '') return E.min
  if (!/^\d*\.?\d*$/.test(t) || t === '.') return E.notNumber
  if (/\.\d{3,}$/.test(t)) return fill(E.decimals, { decimals: practiceRules.maxDecimals })
  const n = Number(t)
  if (!(n >= practiceRules.minOrder)) return E.min
  if (side === 'buy' && n > state.cash + 1e-9) return fill(E.notEnough, { cash: formatMoney(state.cash) })
  if (side === 'sell') {
    const v = valueOf(ticker)
    if (v <= 0) return fill(E.noneOwned, { ticker })
    if (n > v + 1e-9) return fill(E.tooMuch, { value: formatMoney(v), ticker })
  }
  return ''
}

export function usePractice() {
  const holdings = computed(() =>
    (Object.keys(state.lots) as Ticker[])
      .map((t) => ({ ticker: t, shares: state.lots[t]!.shares, paid: state.lots[t]!.paid, price: priceOf(t), value: valueOf(t) }))
      .map((h) => ({ ...h, gainLoss: r2(h.value - h.paid) })),
  )
  const invested = computed(() => r2(holdings.value.reduce((s, h) => s + h.value, 0)))
  const total = computed(() => r2(invested.value + state.cash))
  const mix = computed(() => holdings.value.map((h) => ({ ticker: h.ticker, share: invested.value ? h.value / invested.value : 0 })))

  /** Buy or sell by dollar amount at the latest price, in parts of a share, with no fee. */
  function place(side: Side, ticker: Ticker, text: string): { shares: number; amount: number } | null {
    if (orderError(side, ticker, text)) return null
    const amount = r2(Number(text.trim().replace(/^\$/, '').replace(/,/g, '')))
    const price = priceOf(ticker)
    if (side === 'buy') {
      const shares = floorTo(amount / price, ticker)
      const lot = state.lots[ticker] ?? { shares: 0, paid: 0 }
      state.lots[ticker] = { shares: roundTo(lot.shares + shares, ticker), paid: r2(lot.paid + amount) }
      state.cash = r2(state.cash - amount)
      return { shares, amount }
    }
    const lot = state.lots[ticker]!
    const value = valueOf(ticker)
    if (amount >= value - 0.005) {
      // Selling all of it.
      delete state.lots[ticker]
      state.cash = r2(state.cash + value)
      return { shares: lot.shares, amount: value }
    }
    const shares = roundTo(amount / price, ticker)
    const left = roundTo(lot.shares - shares, ticker)
    state.lots[ticker] = { shares: left, paid: r2(lot.paid * (left / lot.shares)) }
    state.cash = r2(state.cash + amount)
    return { shares, amount }
  }

  function startOver() {
    state.cash = practiceRules.startingCash
    state.lots = {}
  }

  /** Time machine: what today's practice mix would have been worth each week. */
  const timeMachine = computed(() => {
    const held = holdings.value
    if (!held.length) return []
    // Weekly closes from the stock calendar; each holding's price is looked up by date
    // (crypto trades every day, so it has a price on every one of them).
    const weekly = funds.find((f) => f.kind === 'stock')!.history.weekly.filter((w) => w.date >= practiceRules.timeMachine.from && w.date <= practiceRules.timeMachine.to)
    const closeOn = (ticker: string, date: string) => getFund(ticker)!.history.daily.find((d) => d.date === date)?.close ?? 0
    return weekly.map((w) => ({
      date: w.date,
      value: r2(held.reduce((s, h) => s + h.shares * closeOn(h.ticker, w.date), 0)),
    }))
  })

  return {
    cash: computed(() => state.cash),
    holdings,
    invested,
    total,
    mix,
    place,
    startOver,
    timeMachine,
    priceOf,
    valueOf,
    orderError,
  }
}
