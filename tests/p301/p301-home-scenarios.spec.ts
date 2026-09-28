import { test, expect } from '../fixtures'
import { load, money, moneyShort, SCENARIOS } from '../data'

// Every scenario's laptop Home shows that account's own numbers, and no sentence is false.
test.use({ viewport: { width: 1280, height: 800 } })

const attention = load('attention')

for (const s of SCENARIOS) {
  test(`Home tells the truth for ?scenario=${s.id}`, async ({ page }) => {
    const a = load(s.file)
    await page.goto(`/?scenario=${s.id}`)
    if (!a.history.length) {
      await expect(page.getByRole('heading', { name: 'Welcome, Rosa.' })).toBeVisible()
      await expect(page.getByText('Your balance over time will show here after your first deposit arrives.')).toBeVisible()
      await expect(page.locator('canvas')).toHaveCount(0)
      await expect(page.getByText('Needs your attention')).toHaveCount(0)
      return
    }
    const panel = page.locator('.balance')
    await expect(panel.locator('.balance__label')).toHaveText('Balance')
    await expect(panel.locator('.balance__big')).toHaveText(money(a.balance))
    await expect(panel).toContainText(`${a.gainLoss >= 0 ? 'Up' : 'Down'} ${money(a.gainLoss)} on the ${moneyShort(a.moneyIn)} you put in.`)
    await expect(panel).toContainText(`This week: ${a.weeklyChange.totalChange >= 0 ? 'up' : 'down'} ${money(a.weeklyChange.totalChange)}.`)
    // The rows, in order: Invested (a finance term), Cash, You put in, Auto-invest.
    expect(a.autoInvest.on).toBe(true)
    expect(a.autoInvest.pausedOn).toBeUndefined()
    const rows = panel.locator('.balance__parts > div')
    await expect(rows).toHaveText([`Invested${money(a.investedValue)}`, `Cash${money(a.cash)}`, `You put in${money(a.moneyIn)}`, 'Auto-investOn'])
    await expect(rows.nth(0).locator('dt .fl-termtip__button')).toHaveText('Invested')
    for (const i of [1, 2, 3]) await expect(rows.nth(i).locator('.fl-termtip__button')).toHaveCount(0)
    // The parts add up to the balance, to the cent.
    expect(Math.round((a.investedValue + a.cash) * 100)).toBe(Math.round(a.balance * 100))

    const flags = attention[a.id]
    // Ruling 8 (Sept. 25): only what Rosa must act on (needs-you) is counted.
    const needs = flags.filter((f: { severity: string }) => f.severity === 'needs-you')
    const alerts = page.locator('.fl-alerts')
    if (needs.length) await expect(alerts).toContainText(needs.length === 1 ? '1 thing needs you.' : `${needs.length} things need you.`)
    else await expect(alerts).toContainText('Nothing needs you right now.')
    for (const f of flags) await expect(alerts).toContainText(f.title)

    const g = a.goal
    const goal = page.locator('.goal')
    await expect(goal).toContainText(`${moneyShort(g.actualMoneyInToDate)} of ${moneyShort(g.target)} put in`)
    // Every planned deposit arrived (rule A13), so the goal is on pace.
    expect(g.behindBy).toBe(0)
    await expect(goal).toContainText('You are on pace with your plan.')
    await expect(goal).not.toContainText('behind')

    const w = a.weeklyChange
    const week = page.locator('.week')
    await expect(week).toContainText(money(w.startBalance))
    await expect(week).toContainText(money(w.endBalance))
    await expect(week).toContainText(`${w.marketChange >= 0 ? '+' : '−'}${money(w.marketChange)}`)
    // The pieces add up to the cent.
    expect(Math.round((w.startBalance + w.marketChange + w.dividends + w.deposits) * 100)).toBe(Math.round(w.endBalance * 100))
  })
}

// Phase 6: the dark balance card comes first. It sits LEFT of "Needs your attention", at the
// same top edge, both fully in view at 1280×800 without scrolling; balance first in reading
// and keyboard order too. The same order at 768×1024.
for (const [width, height] of [[1280, 800], [768, 1024]] as const) {
  test(`the balance card comes first, beside "Needs your attention", at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    const balance = (await page.locator('.balance').boundingBox())!
    const card = page.locator('.fl-alerts').locator('xpath=ancestor::*[contains(@class,"dhome__card")][1]')
    const alerts = (await card.boundingBox())!
    expect(balance.x + balance.width).toBeLessThanOrEqual(alerts.x)
    expect(Math.abs(balance.y - alerts.y)).toBeLessThanOrEqual(1)
    if (width === 1280) {
      // Fully visible without scrolling.
      expect(await page.evaluate(() => window.scrollY)).toBe(0)
      for (const box of [balance, alerts]) {
        expect(box.y).toBeGreaterThanOrEqual(0)
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.y + box.height).toBeLessThanOrEqual(height)
        expect(box.x + box.width).toBeLessThanOrEqual(width)
      }
    }
    const order = await page.evaluate(() => {
      const a = document.querySelector('.fl-alerts')!, b = document.querySelector('.balance')!
      return b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING ? 'balance first' : 'alerts first'
    })
    expect(order).toBe('balance first')
  })
}

test('in keyboard order, the balance card\'s term comes before the alerts', async ({ page }) => {
  await page.goto('/')
  const invested = page.locator('.balance .fl-termtip__button', { hasText: 'Invested' })
  const firstAlert = page.locator('.fl-alerts a').first()
  await invested.focus()
  await expect(invested).toBeFocused()
  // Tab forward from Invested reaches the first alert link without going back up the page.
  for (let i = 0; i < 10 && !(await firstAlert.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press('Tab')
  await expect(firstAlert).toBeFocused()
})
