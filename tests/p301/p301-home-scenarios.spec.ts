import { test, expect } from '../fixtures'
import { apDate, load, money, moneyShort, SCENARIOS } from '../data'

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
    await expect(panel.locator('.balance__big')).toHaveText(money(a.balance))
    await expect(panel).toContainText(`${a.gainLoss >= 0 ? 'Up' : 'Down'} ${money(a.gainLoss)} on the ${moneyShort(a.moneyIn)} you put in.`)
    await expect(panel).toContainText(`This week: ${a.weeklyChange.totalChange >= 0 ? 'up' : 'down'} ${money(a.weeklyChange.totalChange)}.`)
    await expect(panel).toContainText(a.autoInvest.on ? 'Auto-invest: On.' : `Auto-invest: Paused since ${apDate(a.autoInvest.pausedOn)}.`)
    await expect(panel).toContainText(`Invested${money(a.investedValue)}`)
    await expect(panel).toContainText(`Cash${money(a.cash)}`)

    const flags = attention[a.id]
    const needs = flags.filter((f: { severity: string }) => f.severity !== 'fyi')
    const alerts = page.locator('.fl-alerts')
    if (needs.length) await expect(alerts).toContainText(needs.length === 1 ? '1 thing needs you.' : `${needs.length} things need you.`)
    else await expect(alerts).toContainText('Nothing needs you right now.')
    for (const f of flags) await expect(alerts).toContainText(f.title)

    const g = a.goal
    const goal = page.locator('.goal')
    await expect(goal).toContainText(`${moneyShort(g.actualMoneyInToDate)} of ${moneyShort(g.target)} put in`)
    if (g.behindBy > 0) await expect(goal).toContainText(`so you are ${moneyShort(g.behindBy)} behind.`)
    else await expect(goal).toContainText('You are on pace with your plan.')

    const w = a.weeklyChange
    const week = page.locator('.week')
    await expect(week).toContainText(money(w.startBalance))
    await expect(week).toContainText(money(w.endBalance))
    await expect(week).toContainText(`${w.marketChange >= 0 ? '+' : '−'}${money(w.marketChange)}`)
    // The pieces add up to the cent.
    expect(Math.round((w.startBalance + w.marketChange + w.dividends + w.deposits) * 100)).toBe(Math.round(w.endBalance * 100))
  })
}

test('alerts come first: top left, before the balance in reading order', async ({ page }) => {
  await page.goto('/')
  const alerts = (await page.locator('.fl-alerts').boundingBox())!
  const balance = (await page.locator('.balance').boundingBox())!
  expect(alerts.x).toBeLessThan(balance.x)
  const order = await page.evaluate(() => {
    const a = document.querySelector('.fl-alerts')!, b = document.querySelector('.balance')!
    return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? 'alerts first' : 'balance first'
  })
  expect(order).toBe('alerts first')
})
