import { test, expect } from '../fixtures'
import { readFileSync } from 'node:fs'
import { apDate, money } from '../data'

// Ruling 4 (Sept. 25): the big-move alert, proven on a TEST-ONLY week (tests/fixtures/big-move/,
// served by the "big-move" project from dist-test/, never shipped). NVIDIA rises 9% this week.
test.use({ viewport: { width: 1280, height: 900 } })
const load = (f: string) => JSON.parse(readFileSync(new URL(`../fixtures/big-move/${f}.json`, import.meta.url), 'utf8'))
const account = load('account'), funds = load('funds')
const flag = load('attention')['rosa-starter'].find((f: { id: string }) => f.id === 'big-move-NVDA')
const nv = funds.find((f: { ticker: string }) => f.ticker === 'NVDA')
const w = account.weeklyChange
const close = (d: string) => nv.history.daily.find((x: { date: string }) => x.date === d).close

test('a 7%+ week raises a big-move heads-up, with its facts', async ({ page }) => {
  expect(flag.movePercent).toBeGreaterThanOrEqual(0.07)
  await page.goto('/')
  const alerts = page.locator('.fl-alerts')
  await expect(alerts).toContainText('NVDA moved up 9.0% this week')
  // Ruling 8: only must-act items are counted (the returned deposit); the heads-ups, including
  // the big move, are listed but not counted, and the SIPC FYI sits under "Good to know".
  await expect(alerts).toContainText('1 thing needs you.')
  await alerts.getByRole('link', { name: /NVDA moved up/ }).click()
  await expect(page).toHaveURL(/\/alerts\/big-move-NVDA$/)
  const d = page.locator('.adetail')
  await expect(d).toContainText('Heads-up')
  await expect(d).toContainText(`Price on ${apDate(w.from)}${money(close(w.from))}`)
  await expect(d).toContainText(`Price on ${apDate(w.to)}${money(close(w.to))}`)
  await expect(d).toContainText('Price moveup 9.0%')
  await expect(d).toContainText('Prices go up and down. Nothing changes in your account unless you choose to.')
  await d.getByRole('link', { name: 'Open NVDA' }).click()
  await expect(page).toHaveURL(/\/funds\/NVDA$/)
})
