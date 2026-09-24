import { test, expect, settle } from '../fixtures'
import { load, money } from '../data'

// F8: activity one-handed. F9: funds as cards and a phone-first fund page.
test.use({ viewport: { width: 390, height: 844 } })
const acts = load('activity')['rosa-starter'] as { type: string; status: string }[]

test('activity is a compact list; filters live in a 48px bottom sheet; rows open full pages', async ({ page }) => {
  await page.goto('/activity')
  await expect(page.locator('.activity__row')).toHaveCount(acts.length)
  await page.getByRole('button', { name: 'Filters' }).click()
  const sheet = page.getByRole('dialog', { name: 'Filters' })
  await expect(sheet).toBeVisible()
  await settle(page) // a sheet caught mid-slide measures 47.9999px
  for (const b of await sheet.getByRole('button').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(b).toBeGreaterThanOrEqual(48)
  await sheet.getByRole('group', { name: 'Type' }).getByRole('button', { name: 'Dividends' }).click()
  await sheet.getByRole('group', { name: 'Status' }).getByRole('button', { name: 'Returned' }).click()
  await expect(sheet.getByRole('button', { name: 'Show 0 items' })).toBeVisible()
  await sheet.getByRole('button', { name: 'Show 0 items' }).click()
  await expect(page.getByText('Nothing matches these filters.')).toBeVisible()
  await page.getByRole('button', { name: 'Show everything' }).click()
  await page.locator('.activity__row').filter({ hasText: 'Returned' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Monthly deposit')
  await expect(page.getByRole('region', { name: 'Words on this screen' })).toBeVisible()
  const rows = await page.locator('.activity__row').count()
  expect(rows).toBe(0) // it's a full page, not a panel beside the list
})

test('funds are cards, and a fund page leads with value and up or down', async ({ page }) => {
  const account = load('account')
  await page.goto('/funds')
  await expect(page.locator('.funds__card')).toHaveCount(5)
  await expect(page.locator('.funds__card').filter({ hasText: 'FL-CALM' })).toContainText('Not owned')
  for (const b of await page.locator('.funds__card').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(b).toBeGreaterThanOrEqual(48)
  await page.locator('.funds__card').filter({ hasText: 'FL-GREEN' }).click()
  const h = account.holdings.find((x: { ticker: string }) => x.ticker === 'FL-GREEN')
  await expect(page.locator('.fund__value')).toHaveText(money(h.value))
  // Order: value first, then the chart, then the fee, then "4 of 5".
  const y = async (sel: string) => (await page.locator(sel).first().boundingBox())!.y
  const value = await y('.fund__value'), chart = await y('.fl-chart'), fee = await y('#fund-fee'), ups = await y('#fund-ups')
  expect(value < chart && chart < fee && fee < ups).toBe(true)
  await expect(page.getByRole('region', { name: 'Words on this screen' })).toBeVisible()
})
