import { test, expect } from '../fixtures'

// Real-app ruling (Sept. 24): nothing on screen may read as a project or exercise.
// This crawls every page in every scenario, at phone and laptop widths, with the
// usual things opened, and searches the rendered text.
const BANNED = /made[- ]up|\bdemo\b|case stud(y|ies)|\bproject\b|reviewer|fictional|phase \d/i
const PAGES = ['/', '/alerts', '/alerts/deposit-returned', '/alerts/cash-sitting', '/activity', '/activity/rosa-starter-034', '/activity/rosa-starter-002', '/funds', '/funds/FL-GREEN', '/funds/FL-CALM', '/story', '/practice', '/learn', '/learn/expense-ratio', '/learn/practice-mode', '/nope']
const SCENARIOS = ['normal', 'all-clear', 'brand-new']

for (const width of [390, 1280]) {
  test(`no project language on any page at ${width}px`, async ({ page }) => {
    test.setTimeout(180_000)
    await page.setViewportSize({ width, height: 900 })
    const hits: string[] = []
    for (const s of SCENARIOS) {
      for (const path of PAGES) {
        await page.goto(`${path}${path.includes('?') ? '&' : '?'}scenario=${s}`)
        await page.locator('main').waitFor()
        // Open what can be opened: tables, Why it moved, and one explanation.
        const show = page.getByRole('button', { name: 'Show as table' })
        while (await show.count()) await show.first().click()
        const why = page.getByRole('button', { name: 'Why it moved this week' })
        if (await why.count()) await why.click()
        const tip = page.locator('main .fl-termtip__button').first()
        if (await tip.count()) await tip.click()
        const text = await page.evaluate(() => document.body.innerText)
        const m = text.match(BANNED)
        if (m) hits.push(`${s} ${path}: "${m[0]}" in …${text.slice(Math.max(0, (m.index ?? 0) - 40), (m.index ?? 0) + 40).replace(/\s+/g, ' ')}…`)
      }
    }
    expect(hits).toEqual([])
  })
}

test('the only disclosure words are the footer’s', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('footer')).toContainText('First Leaf is a concept app')
})
