import { computed, reactive } from 'vue'
import { funds, getFund, practiceRules, type Ticker } from '../data'
import { formatMoney } from '../format'

// Practice: pretend money for trying things. Module scope, so a half-finished
// session survives navigation; reloading starts over. It reads fund prices and
// practice rules only: it has no way to reach Rosa's account (and the account
// data is frozen, so any write would throw).

const r2 = (n: number) => Math.round(n * 100) / 100
const r4 = (n: number) => Math.round(n * 10000) / 10000
const floor4 = (n: number) => Math.floor(n * 10000 + 1e-9) / 10000

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
  if (t === '') return 'Enter an amount of $1 or more.'
  if (!/^\d*\.?\d*$/.test(t) || t === '.') return 'Enter a number, like 25 or 25.50.'
  if (/\.\d{3,}$/.test(t)) return `Use no more than ${practiceRules.maxDecimals} decimals, like 25.50.`
  const n = Number(t)
  if (!(n >= practiceRules.minOrder)) return 'Enter an amount of $1 or more.'
  if (side === 'buy' && n > state.cash + 1e-9) return `You have ${formatMoney(state.cash)} in practice money. Enter that much or less.`
  if (side === 'sell') {
    const v = valueOf(ticker)
    if (v <= 0) return `You do not own any ${ticker} in Practice.`
    if (n > v + 1e-9) return `You own ${formatMoney(v)} of ${ticker} in Practice. Enter that much or less.`
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
      const shares = floor4(amount / price)
      const lot = state.lots[ticker] ?? { shares: 0, paid: 0 }
      state.lots[ticker] = { shares: r4(lot.shares + shares), paid: r2(lot.paid + amount) }
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
    const shares = r4(amount / price)
    const left = r4(lot.shares - shares)
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
    const weekly = funds[0]!.history.weekly.filter((w) => w.date >= practiceRules.timeMachine.from && w.date <= practiceRules.timeMachine.to)
    return weekly.map((w, i) => ({
      date: w.date,
      value: r2(held.reduce((s, h) => s + h.shares * (getFund(h.ticker)!.history.weekly[i]?.close ?? 0), 0)),
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
