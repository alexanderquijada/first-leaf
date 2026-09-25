import { test, expect } from '../fixtures'
import { load, money } from '../data'

// Phase 4: the P301 brief's "Edge cases and empty states" rows not already covered by
// p301-home-scenarios (brand-new, calm), F1 (an alert that doesn't exist), F5 (empty filters)
// and P302 F8/F9 (Practice errors, a search with no match). A one-point chart can't happen:
// data rule F5 proves every range the app draws has at least two points.
test.use({ viewport: { width: 1280, height: 800 } })

const attention = load('attention')
const account = load('account')

test('all alerts handled: "You have handled everything for this week.", and Undo still works', async ({ page }) => {
  const flags = attention[account.id] as { id: string; title: string }[]
  // In-app navigation only: handled alerts last for the session, and a reload starts over.
  await page.goto('/alerts')
  const list = page.locator('.alerts__list')
  for (const f of flags) {
    await list.getByRole('link', { name: f.title }).click()
    await page.getByRole('button', { name: 'Mark as handled' }).click()
  }
  await expect(list).toContainText('You have handled everything for this week.')
  await list.getByRole('button', { name: `Handled (${flags.length})` }).click()
  await list.getByRole('button', { name: /^Undo/ }).first().click()
  await expect(list).not.toContainText('You have handled everything for this week.')
})

test('the calm account: nothing needs you, and the SIPC notice sits under "Good to know", uncounted', async ({ page }) => {
  await page.goto('/?scenario=all-clear')
  const alerts = page.locator('.fl-alerts')
  await expect(alerts).toContainText('Nothing needs you right now.')
  await expect(alerts.getByRole('heading', { name: 'Good to know' })).toBeVisible()
  await expect(alerts).toContainText("SIPC protection doesn't cover crypto")
  await expect(alerts).toContainText('Good to know')
  await expect(alerts).not.toContainText('Just so you know')
  await expect(alerts).not.toContainText('FYI')
})

test('down, not up: losses say "down" in sentences and carry "down" in table labels', async ({ page }) => {
  const losers = account.holdings.filter((h: { gainLoss: number }) => h.gainLoss < 0)
  expect(losers.length).toBeGreaterThan(0)
  // The week on Home: the market piece is a loss, with a sign and "down" for screen readers.
  const w = account.weeklyChange
  expect(w.marketChange).toBeLessThan(0)
  await page.goto('/')
  await expect(page.locator('.balance')).toContainText(`This week: down ${money(w.totalChange)}.`)
  const cell = page.locator('.week').getByText(`−${money(w.marketChange)}`)
  await expect(cell).toBeVisible()
  await expect(cell).toHaveAttribute('aria-hidden', 'true')
  await expect(page.locator('.week td').filter({ hasText: `−${money(w.marketChange)}` }).locator('.fl-visually-hidden')).toHaveText(`down ${money(w.marketChange)}`)
  // An investment that is down says so in words on its page.
  const h = losers[0]
  await page.goto(`/funds/${h.ticker}`)
  await expect(page.getByRole('main')).toContainText(`Down ${money(h.gainLoss)} on the ${money(h.costBasis)} you paid.`)
})
