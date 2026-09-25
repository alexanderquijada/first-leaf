import { test, expect } from '../fixtures'
import { load, money } from '../data'

// F3: read the balance chart: ranges, values in words, and a table that matches the chart.
test.use({ viewport: { width: 1280, height: 800 } })

test('ranges change the chart, and the table shows the same series', async ({ page }) => {
  const a = load('account')
  await page.goto('/')
  const frame = page.locator('.fl-chart').filter({ hasText: 'Balance over time' })
  for (const [name, days] of [['1 month', 1], ['3 months', 3], ['Since March', 0]] as const) {
    await frame.getByRole('button', { name }).click()
    await expect(frame.getByRole('button', { name })).toHaveAttribute('aria-pressed', 'true')
    const series: number[] = JSON.parse((await frame.locator('[data-series]').getAttribute('data-series'))!)
    const from = new Date('2026-09-18T00:00:00Z')
    from.setUTCMonth(from.getUTCMonth() - days)
    const expected = days ? a.history.filter((r: { date: string }) => r.date >= from.toISOString().slice(0, 10)) : a.history
    expect(series).toEqual(expected.map((r: { balance: number }) => r.balance))

    await frame.getByRole('button', { name: 'Show as table' }).click()
    const cells = await frame.locator('tbody tr td:nth-child(2)').allInnerTexts()
    expect(cells).toEqual(series.map(money))
    await frame.getByRole('button', { name: 'Hide table' }).click()
  }
})

test('arrow keys read each day out in words', async ({ page }) => {
  await page.goto('/')
  const chart = page.locator('.fl-chart').filter({ hasText: 'Balance over time' }).locator('[data-series]')
  await chart.focus()
  await page.keyboard.press('End')
  const readout = page.locator('.fl-balchart__readout')
  const a = load('account')
  await expect(readout).toHaveText(`Sept. 18: balance ${money(a.balance)}. You had put in ${money(a.moneyIn)}, so you were ${a.gainLoss >= 0 ? 'up' : 'down'} ${money(a.gainLoss)}.`)
  await page.keyboard.press('ArrowLeft')
  await expect(readout).toContainText('Sept. 17: balance')
})
