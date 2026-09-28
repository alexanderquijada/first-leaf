import { test, expect } from '../fixtures'
import { load } from '../data'

// Phase 6.1: every page's main title (h1) uses one shared style (--type-h1): the same font,
// size, weight and line height on every page at each width. Your Journey's title was larger.
const buy = load('activity')['rosa-starter'].find((a: { type: string }) => a.type === 'buy').id
const PAGES = ['/', '/alerts', '/alerts/beneficiary-missing', '/alerts/nope', '/activity', `/activity/${buy}`, '/activity/nope',
  '/funds', '/funds/AAPL', '/funds/nope', '/story', '/practice', '/learn', '/learn/volatility', '/learn/nope', '/nope']

for (const width of [390, 768, 1280]) {
  test(`every page title has the same font, size, weight and line height at ${width}px`, async ({ page }, info) => {
    test.setTimeout(90_000)
    await page.setViewportSize({ width, height: 900 })
    const seen: Record<string, string[]> = {}
    for (const path of PAGES) {
      await page.goto(path)
      const h1 = page.locator('main h1').first()
      await expect(h1).toHaveCount(1)
      const style = await h1.evaluate((e) => {
        const cs = getComputedStyle(e)
        return `${cs.fontFamily.split(',')[0]} ${cs.fontSize} ${cs.fontWeight} ${cs.lineHeight}`
      })
      ;(seen[style] ||= []).push(path)
    }
    info.annotations.push({ type: `h1 at ${width}px`, description: Object.entries(seen).map(([s, p]) => `${s}: ${p.join(', ')}`).join(' | ') })
    expect(Object.keys(seen), `h1 styles at ${width}px: ${JSON.stringify(seen)}`).toHaveLength(1)
  })
}
