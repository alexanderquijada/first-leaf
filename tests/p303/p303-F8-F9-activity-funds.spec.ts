import { test, expect, settle } from '../fixtures'
import { load, money } from '../data'

// F8: activity one-handed. F9: funds as cards and a phone-first fund page.
test.use({ viewport: { width: 390, height: 844 } })
const acts = load('activity')['rosa-starter'] as { type: string; status: string }[]

test('activity is a compact list; the type filter lives in a 48px bottom sheet; rows open full pages', async ({ page }) => {
  await page.goto('/activity')
  await expect(page.locator('.activity__row')).toHaveCount(acts.length)
  // Every row went through (Phase 6): no Returned or Pending rows, and no status filter.
  expect(new Set(acts.map((a) => a.status))).toEqual(new Set(['completed']))
  await expect(page.locator('.activity__row.is-completed')).toHaveCount(acts.length)
  await expect(page.locator('main')).not.toContainText(/Returned|Pending/)
  await page.getByRole('button', { name: 'Filter' }).click()
  const sheet = page.getByRole('dialog', { name: 'Filter' })
  await expect(sheet).toBeVisible()
  await settle(page) // a sheet caught mid-slide measures 47.9999px
  for (const b of await sheet.getByRole('button').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(b).toBeGreaterThanOrEqual(48)
  await expect(sheet.getByRole('group')).toHaveCount(1)
  await expect(sheet.getByRole('group', { name: 'Type' }).getByRole('button')).toHaveText(['All', 'Deposits', 'Buys', 'Dividends'])
  await expect(sheet.getByRole('group', { name: 'Status' })).toHaveCount(0)
  const dividends = acts.filter((a) => a.type === 'dividend').length
  await sheet.getByRole('group', { name: 'Type' }).getByRole('button', { name: 'Dividends' }).click()
  await sheet.getByRole('button', { name: `Show ${dividends} items` }).click()
  await expect(page.locator('.activity__row')).toHaveCount(dividends)
  await expect(page.locator('.activity__summary')).toHaveText('Type: Dividends.')
  // A deposit opens as its own page with its finance terms as 48px chips.
  await page.getByRole('button', { name: 'Filter' }).click()
  await sheet.getByRole('group', { name: 'Type' }).getByRole('button', { name: 'Deposits' }).click()
  await sheet.getByRole('button', { name: /^Show \d+ items$/ }).click()
  await page.locator('.activity__row').first().click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Monthly deposit')
  const chips = page.getByRole('region', { name: 'Finance terms on this screen' }).locator('.fl-termtip__button')
  await expect(chips).toHaveText(['Dollar-cost averaging', 'Brokerage account'])
  for (const h of await chips.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(h).toBeGreaterThanOrEqual(48)
  expect(await page.locator('.activity__row').count()).toBe(0) // it's a full page, not a panel beside the list
})

test('investments are cards, and an investment page leads with value and up or down', async ({ page }) => {
  const account = load('account')
  await page.goto('/funds')
  await expect(page.locator('.funds__card')).toHaveCount(10)
  await expect(page.locator('.funds__card').filter({ hasText: 'Solana' })).toContainText('Not owned')
  for (const b of await page.locator('.funds__card').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(b).toBeGreaterThanOrEqual(48)
  await page.locator('.funds__card').filter({ hasText: 'Nike' }).click()
  const h = account.holdings.find((x: { ticker: string }) => x.ticker === 'NKE')
  await expect(page.locator('.fund__value')).toHaveText(money(h.value))
  // Order: value first, then the chart and its data note, then what it is, then "Ups and downs".
  const y = async (sel: string) => (await page.locator(sel).first().boundingBox())!.y
  const value = await y('.fund__value'), chart = await y('.fl-chart'), note = await y('.fl-source'), about = await y('#fund-about'), ups = await y('#fund-ups')
  expect(value < chart && chart < note && note < about && about < ups).toBe(true)
  await expect(page.locator('main')).toContainText(/Volatility: \d of 5/)
  const chips = page.getByRole('region', { name: 'Finance terms on this screen' }).locator('.fl-termtip__button')
  await expect(chips).toHaveText(['Stock', 'Share', 'Volatility', ...(load('funds').find((f: { ticker: string }) => f.ticker === 'NKE').dividends.length ? ['Dividend', 'Ex-dividend date'] : [])])
  for (const h of await chips.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(h).toBeGreaterThanOrEqual(48)
})
