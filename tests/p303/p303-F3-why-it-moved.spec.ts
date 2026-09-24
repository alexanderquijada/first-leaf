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
  const [start, market, divs, deps] = [await cents(0), await cents(1), await cents(2), await cents(3)]
  expect(start + market + divs + deps).toBe(Math.round(w.endBalance * 100))
  // Fund by fund: the pieces add up to the market change.
  const fundCents = (await body.locator('.phome__fund .fl-tabular [aria-hidden="true"]').allInnerTexts()).map((t) => Math.round(Number(t.replace(/[$,+]/g, '').replace('−', '-')) * 100))
  expect(fundCents.reduce((x, y) => x + y, 0)).toBe(Math.round(w.marketChange * 100))
  // A fund that went down says so in words, and the note explains it.
  await body.getByRole('button', { name: /FL-WORLD/ }).click()
  await expect(body).toContainText('FL-WORLD moved down')
  await expect(body).toContainText('Ups and downs are normal.')
  // Its words, as 48px chips.
  const chips = body.getByRole('region', { name: 'Words on this screen' }).locator('.fl-termtip__button')
  await expect(chips).toHaveCount(4)
  for (const b of await chips.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
    expect(b.height).toBeGreaterThanOrEqual(48)
    expect(b.width).toBeGreaterThanOrEqual(48)
  }
})
