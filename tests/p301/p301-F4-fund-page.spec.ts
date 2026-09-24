import { test, expect } from '../fixtures'
import { load, money } from '../data'

// F4: look at a fund. Every fund page works, including FL-CALM, which Rosa doesn't own.
test.use({ viewport: { width: 1280, height: 900 } })
const funds = load('funds')
const account = load('account')

test('the funds list shows all five funds, with what she has in each', async ({ page }) => {
  await page.goto('/funds')
  const rows = page.locator('.funds__table tbody tr')
  await expect(rows).toHaveCount(5)
  for (const f of funds) {
    const row = rows.filter({ hasText: f.ticker })
    const h = account.holdings.find((x: { ticker: string }) => x.ticker === f.ticker)
    await expect(row).toContainText(`${f.upsAndDowns} of 5`)
    await expect(row).toContainText(h ? money(h.value) : 'Not owned')
  }
})

for (const f of funds) {
  test(`${f.ticker}'s page works`, async ({ page }) => {
    const h = account.holdings.find((x: { ticker: string }) => x.ticker === f.ticker)
    await page.goto(`/funds/${f.ticker}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(f.ticker)
    await expect(page.getByText(`Ups and downs: ${f.upsAndDowns} of 5`)).toBeVisible()
    await expect(page.getByText(f.inside)).toBeVisible()
    if (h) {
      await expect(page.locator('.fund__value')).toHaveText(money(h.value))
      await expect(page.locator('.fund__facts')).toContainText(money(h.costBasis))
    } else await expect(page.getByText("You don't own this fund yet.")).toBeVisible()
    // Every range draws the fund's own prices, and the table matches the chart.
    const group = page.getByRole('group', { name: 'Time range' })
    for (const name of h ? ['Since you bought', '1 year', '5 years'] : ['1 year', '5 years']) {
      await group.getByRole('button', { name }).click()
      const series = JSON.parse((await page.locator('[data-series]').getAttribute('data-series'))!)[0] as number[]
      expect(series.at(-1)).toBe(f.latestPrice)
      if (name === '5 years') expect(series).toEqual(f.history.weekly.map((w: { close: number }) => w.close))
    }
    await page.getByRole('button', { name: 'Show as table' }).click()
    const prices = await page.locator('.fl-chart__table tbody td:nth-child(2)').allInnerTexts()
    expect(prices).toEqual(f.history.weekly.map((w: { close: number }) => money(w.close)))
  })
}

test("FL-GREEN's fee change reads in percentage points", async ({ page }) => {
  await page.goto('/funds/FL-GREEN')
  await expect(page.locator('.fund__card').filter({ hasText: 'Yearly fee' })).toContainText(
    '0.45% to 0.75% on Oct. 1, up 0.30 percentage points.',
  )
  await expect(page.getByText('+67%')).toHaveCount(0)
})

test('a fund that does not exist says so', async ({ page }) => {
  await page.goto('/funds/FL-NOPE')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('We could not find that fund.')
})
