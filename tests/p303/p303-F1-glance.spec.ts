import { test, expect } from '../fixtures'
import { load, money, SCENARIOS } from '../data'

// F1: glance. At 390 × 844, without scrolling: balance, this week, what needs you.
test.use({ viewport: { width: 390, height: 844 } })
const attention = load('attention')

test('balance, this week and the needs-you card are visible without scrolling', async ({ page }) => {
  await page.goto('/')
  const barTop = (await page.locator('.fl-bottombar').boundingBox())!.y
  for (const sel of ['.phome__big', '.phome__week', '.phome__needs-title', '.phome__top']) {
    const b = (await page.locator(sel).boundingBox())!
    expect(b.y + b.height, `${sel} fits above the tab bar`).toBeLessThanOrEqual(barTop)
  }
})

for (const s of SCENARIOS) {
  test(`the phone Home tells the truth for ?scenario=${s.id}`, async ({ page }) => {
    const a = load(s.file)
    await page.goto(`/?scenario=${s.id}`)
    if (!a.history.length) {
      await expect(page.getByRole('heading', { name: 'Welcome, Rosa.' })).toBeVisible()
      await expect(page.locator('canvas')).toHaveCount(0)
      await expect(page.getByRole('heading', { name: 'Word of the day' })).toBeVisible()
      return
    }
    await expect(page.locator('.phome__big')).toHaveText(money(a.balance))
    await expect(page.locator('.phome__week')).toHaveText(`${a.weeklyChange.totalChange >= 0 ? 'Up' : 'Down'} ${money(a.weeklyChange.totalChange)} this week`)
    const flags = attention[a.id]
    const needs = flags.filter((f: { severity: string }) => f.severity === 'needs-you')
    const title = page.locator('.phome__needs-title')
    if (needs.length) await expect(title).toHaveText(`${needs.length} thing needs you`)
    else if (flags.some((f: { severity: string }) => f.severity === 'heads-up')) await expect(title).toContainText('heads-up')
    else await expect(title).toHaveText('Nothing needs you right now.')
    // The latest three transactions are the newest three in the data.
    const acts = load('activity')[a.id].slice(-3).reverse()
    const rows = page.locator('.phome__latest li')
    await expect(rows).toHaveCount(3)
    for (let i = 0; i < 3; i++) await expect(rows.nth(i)).toContainText(money(acts[i].amount))
  })
}
