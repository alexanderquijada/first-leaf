import type { Locator, Page } from '@playwright/test'
import { test, expect, settle } from '../fixtures'

// Phase 6.2: range buttons sit on their own line directly under the card title, left-aligned,
// and never move when a different range is chosen (the title's length changes with the range).
// The selected button has one clean edge (no doubled line on its left).
const CARDS = [
  { path: '/', first: '1 month' },
  { path: '/story#section-1', first: '1 month' },
  { path: '/funds/AAPL', first: '1 year' },
]

async function rangeCard(page: Page, first: string): Promise<{ card: Locator; group: Locator }> {
  const card = page.locator('.fl-chart').filter({ has: page.getByRole('button', { name: first, exact: true }) }).first()
  return { card, group: card.getByRole('group').filter({ has: page.getByRole('button', { name: first, exact: true }) }) }
}
const round = (b: { x: number; y: number }) => `${Math.round(b.x)},${Math.round(b.y)}`

for (const width of [390, 768, 1280]) {
  test(`range buttons sit under the card title and never move, at ${width}px`, async ({ page }) => {
    test.setTimeout(60_000)
    await page.setViewportSize({ width, height: 900 })
    for (const { path, first } of CARDS) {
      await page.goto(path)
      const { card, group } = await rangeCard(page, first)
      if (!(await group.count())) {
        // The phone's Home chart is the small check-in chart, with no range buttons.
        expect(width < 600 && path === '/', `${path} at ${width} has range buttons`).toBe(true)
        continue
      }
      await group.scrollIntoViewIfNeeded()
      const buttons = group.getByRole('button')
      const n = await buttons.count()
      const where = async () => {
        await settle(page)
        const title = (await card.locator('.fl-chart__title').boundingBox())!
        const g = (await group.boundingBox())!
        const bs = await buttons.evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY } }))
        return { title, g, bs: bs.map(round).join(' ') }
      }
      const start = await where()
      // On their own line, under the title, lined up with its left edge.
      expect(start.g.y, `${path} at ${width}: buttons under the title`).toBeGreaterThanOrEqual(start.title.y + start.title.height - 1)
      expect(Math.abs(start.g.x - start.title.x), `${path} at ${width}: left-aligned with the title`).toBeLessThanOrEqual(1)
      for (let i = 0; i < n; i++) {
        await buttons.nth(i).click()
        await expect(buttons.nth(i)).toHaveAttribute('aria-pressed', 'true')
        const now = await where()
        expect(now.bs, `${path} at ${width}: after choosing "${await buttons.nth(i).innerText()}"`).toBe(start.bs)
        // The selected button's left edge is its own color, not a second line.
        const edge = await buttons.nth(i).evaluate((e) => { const cs = getComputedStyle(e); return cs.borderLeftWidth === '0px' || cs.borderLeftColor === cs.backgroundColor })
        expect(edge, `${path} at ${width}: "${await buttons.nth(i).innerText()}" has one clean left edge`).toBe(true)
      }
    }
  })
}
