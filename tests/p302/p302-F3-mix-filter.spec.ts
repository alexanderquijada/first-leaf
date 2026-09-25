import { test, expect } from '../fixtures'
import { load, money } from '../data'

// F3: filter "Where it is now" by stocks, crypto and cash (ruling B, Phase 2.5).
const a = load('account')
const funds = load('funds')
const kindOf = (t: string) => funds.find((f: { ticker: string }) => f.ticker === t).kind
const pct = (v: number) => Math.round((v / a.balance) * 100)
test('the mix filters by stocks, crypto and cash, and each sentence matches', async ({ page }) => {
  await page.goto('/story')
  const ch4 = page.locator('#chapter-4')
  const show = ch4.getByRole('group', { name: 'Show' })
  await expect(show.getByRole('button')).toHaveText(['All', 'Stocks', 'Crypto', 'Cash'])
  const crypto = a.holdings.filter((h: { ticker: string }) => kindOf(h.ticker) === 'crypto')
  const stocks = a.holdings.filter((h: { ticker: string }) => kindOf(h.ticker) === 'stock')
  const sum = (hs: { value: number }[]) => Math.round(hs.reduce((s, h) => s + h.value, 0) * 100) / 100
  await show.getByRole('button', { name: 'Crypto' }).click()
  await expect(ch4.locator('.where__name')).toHaveText(crypto.map((h: { ticker: string }) => h.ticker))
  await expect(ch4.locator('.fl-chart__summary')).toHaveText(`Crypto is ${money(sum(crypto))} of your balance, or ${pct(sum(crypto))}%.`)
  await show.getByRole('button', { name: 'Stocks' }).click()
  await expect(ch4.locator('.where__name')).toHaveText(stocks.map((h: { ticker: string }) => h.ticker))
  await expect(ch4.locator('.fl-chart__summary')).toHaveText(`Stocks are ${money(sum(stocks))} of your balance, or ${pct(sum(stocks))}%.`)
  await show.getByRole('button', { name: 'Cash' }).click()
  await expect(ch4.locator('.fl-chart__summary')).toHaveText(`Cash is ${money(a.cash)} of your balance, or ${pct(a.cash)}%.`)
  await show.getByRole('button', { name: 'All' }).click()
  await expect(ch4.locator('.where__name')).toHaveText([...a.holdings.map((h: { ticker: string }) => h.ticker), 'Cash'])
  await expect(ch4.locator('.fl-chart__summary')).toHaveText(`Your ${money(a.balance)} is split across ${a.holdings.length} investments and cash.`)
})
