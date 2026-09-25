import { test, expect } from '../fixtures'
import { load, money } from '../data'

// F3: why it moved. Opens in place; the pieces add up to the cent; each fund can be read.
test.use({ viewport: { width: 390, height: 844 } })

test('why it moved opens in place and adds up to the cent', async ({ page }) => {
  const w = load('account').weeklyChange
  await page.goto('/')
  const btn = page.getByRole('button', { name: 'Why it moved this week' })
  await expect(btn).toHaveAttribute('aria-expanded', 'false')
  await btn.click()
  await expect(btn).toHaveAttribute('aria-expanded', 'true')
  await expect(page).toHaveURL(/\/$/) // it opens in place, not on another page
  const body = page.locator('#phome-why-body')
  await expect(body.locator('tr').first()).toContainText(money(w.startBalance))
  await expect(body.locator('tr.is-end')).toContainText(money(w.endBalance))
  // Read the numbers off the screen and add them up.
  const cents = async (row: number) => {
    const td = body.locator('tbody tr').nth(row).locator('td')
    const shown = (await td.locator('[aria-hidden="true"]').count()) ? td.locator('[aria-hidden="true"]') : td
    const t = (await shown.innerText()).replace(/[$,+]/g, '').replace('−', '-')
    return Math.round(Number(t) * 100)
  }
  // Every row but the last (the end balance) is a piece; $0.00 pieces are left out (ruling 6),
  // so the rows shown must still add up to the end balance, to the cent.
  const n = await body.locator('tbody tr').count()
  let sum = 0
  for (let i = 0; i < n - 1; i++) sum += await cents(i)
  expect(sum).toBe(Math.round(w.endBalance * 100))
  expect(n - 2).toBe([w.marketChange, w.dividends, w.deposits].filter((x: number) => x !== 0).length)
  await expect(body.locator('tbody')).not.toContainText('$0.00')
  await expect(page.locator('main')).not.toContainText('no change')
  // Fund by fund: the pieces add up to the market change.
  const fundCents = (await body.locator('.phome__fund .fl-tabular [aria-hidden="true"]').allInnerTexts()).map((t) => Math.round(Number(t.replace(/[$,+]/g, '').replace('−', '-')) * 100))
  expect(fundCents.reduce((x, y) => x + y, 0)).toBe(Math.round(w.marketChange * 100))
  // An investment that went down says so in words, and the note explains it.
  const down = w.byFund.find((x: { change: number }) => x.change < 0)
  await body.getByRole('button', { name: new RegExp(down.ticker) }).click()
  await expect(body).toContainText(`${down.ticker} moved down ${money(down.change)} this week.`)
  await expect(body).toContainText(`Price changes across everything you own added up to a ${money(w.marketChange)} ${w.marketChange < 0 ? 'drop' : 'rise'}.`)
  await expect(body).toContainText('Ups and downs are normal.')
  // Its words, as 48px chips.
  const chips = body.getByRole('region', { name: 'Words on this screen' }).locator('.fl-termtip__button')
  await expect(chips).toHaveCount(4)
  for (const b of await chips.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
    expect(b.height).toBeGreaterThanOrEqual(48)
    expect(b.width).toBeGreaterThanOrEqual(48)
  }
})
