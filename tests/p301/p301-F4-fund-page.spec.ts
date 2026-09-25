import { test, expect } from '../fixtures'
import { load, money } from '../data'

// F4: look at an investment. Every page works, including AMZN, TSLA and SOL, which Rosa
// doesn't own. Each shows where its prices come from (ruling B, Phase 2.5).
test.use({ viewport: { width: 1280, height: 900 } })
const funds = load('funds')
const account = load('account')
const STOCK_NOTE = 'Stock prices on Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026 are real. Prices on the days between are modeled.'

test('the investments list shows all ten, with what she has in each', async ({ page }) => {
  await page.goto('/funds')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your investments')
  const rows = page.locator('.funds__table tbody tr')
  await expect(rows).toHaveCount(10)
  for (const f of funds) {
    const row = rows.filter({ hasText: f.name })
    const h = account.holdings.find((x: { ticker: string }) => x.ticker === f.ticker)
    await expect(row).toContainText(f.ticker)
    await expect(row).toContainText(f.kind === 'stock' ? 'Stock' : 'Crypto')
    await expect(row).toContainText(`${f.upsAndDowns} of 5`)
    await expect(row).toContainText(h ? money(h.value) : 'Not owned')
  }
})

for (const f of funds) {
  test(`${f.ticker}'s page works`, async ({ page }) => {
    const h = account.holdings.find((x: { ticker: string }) => x.ticker === f.ticker)
    await page.goto(`/funds/${f.ticker}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`${f.ticker} ${f.name}`)
    await expect(page.getByText(`Ups and downs: ${f.upsAndDowns} of 5`)).toBeVisible()
    await expect(page.getByText(f.about)).toBeVisible()
    if (h) {
      await expect(page.locator('.fund__value')).toHaveText(money(h.value))
      await expect(page.locator('.fund__facts')).toContainText(money(h.costBasis))
      // Ruling 5 (Sept. 25): crypto shows "Amount" with its unit, never "Shares".
      if (f.kind === 'crypto') {
        await expect(page.locator('.fund__facts')).toContainText(`Amount${h.shares.toFixed(8)} ${f.ticker}`)
        await expect(page.locator('.fund__facts')).not.toContainText('Shares')
      } else await expect(page.locator('.fund__facts')).toContainText(`Shares${h.shares.toFixed(4)}`)
    } else await expect(page.getByText("You don't own any yet.")).toBeVisible()
    // Every range draws its own prices, and the table matches the chart.
    const group = page.getByRole('group', { name: 'Time range' })
    for (const name of h ? ['Since you bought', '6 months', '1 year'] : ['6 months', '1 year']) {
      await group.getByRole('button', { name }).click()
      const series = JSON.parse((await page.locator('[data-series]').getAttribute('data-series'))!)[0] as number[]
      expect(series.at(-1)).toBe(f.latestPrice)
      if (name === '1 year') expect(series).toEqual(f.history.weekly.map((w: { close: number }) => w.close))
    }
    await page.getByRole('button', { name: 'Show as table' }).click()
    const prices = await page.locator('.fl-chart__table tbody td:nth-child(2)').allInnerTexts()
    expect(prices).toEqual(f.history.weekly.map((w: { close: number }) => money(w.close)))
    // Where the prices come from: the stock data note, or CoinGecko's credit, never both.
    const credit = page.getByRole('link', { name: /CoinGecko API/ })
    if (f.kind === 'stock') {
      await expect(page.getByText(STOCK_NOTE)).toBeVisible()
      await expect(credit).toHaveCount(0)
      await expect(page.getByText('SIPC protection')).toHaveCount(0)
    } else {
      await expect(credit).toHaveAttribute('href', 'https://www.coingecko.com/en/api/')
      await expect(page.getByText('Powered by CoinGecko API')).toBeVisible()
      await expect(page.getByText(STOCK_NOTE)).toHaveCount(0)
      await expect(page.getByRole('heading', { name: 'Not covered by SIPC protection' })).toBeVisible()
      // Ruling 2 (Sept. 25): only the general fact, never a claim about First Leaf or Rosa's holdings.
      await expect(page.locator('main')).toContainText("SIPC protection covers stocks and cash at a member brokerage if the brokerage fails. It doesn't cover crypto, such as Bitcoin or Ethereum. It never covers a drop in price.")
    }
  })
}

test('stock dividends are the real per-share amounts, paid or still to come', async ({ page }) => {
  await page.goto('/funds/AAPL')
  const card = page.locator('.fund__card').filter({ hasText: 'Dividends' })
  await expect(card).toContainText('$0.27 a share, paid Aug. 13, 2026')
  await page.goto('/funds/NKE')
  await expect(page.locator('.fund__card').filter({ hasText: 'Dividends' })).toContainText('$0.41 a share, to be paid Oct. 1, 2026')
  await page.goto('/funds/AMZN')
  await expect(page.getByText('It does not pay dividends.')).toBeVisible()
})

test('an investment that does not exist says so', async ({ page }) => {
  await page.goto('/funds/NOPE')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('We could not find that investment.')
})
