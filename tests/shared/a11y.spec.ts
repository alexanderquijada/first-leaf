import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { test, expect } from '../fixtures'

// axe-core scans against WCAG 2.2 A and AA. Zero serious or critical violations allowed.
async function seriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  return results.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.impact}: ${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(' | ')})`)
}

const PAGES = ['/', '/story', '/activity', '/about']
const WIDTHS = [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
]

for (const size of WIDTHS) {
  test.describe(`axe at ${size.width}px`, () => {
    test.use({ viewport: size })

    for (const path of PAGES) {
      test(`${path} has no serious or critical violations`, async ({ page }) => {
        await page.goto(path)
        await page.evaluate(() => document.fonts.ready)
        expect(await seriousViolations(page)).toEqual([])
      })
    }

    test('with the explanation panel open', async ({ page }) => {
      await page.goto('/')
      await page.locator('main .fl-termtip__button').first().click()
      await expect(page.getByRole('dialog')).toBeVisible()
      expect(await seriousViolations(page)).toEqual([])
    })

    test('with the Demo menu open', async ({ page }) => {
      await page.goto('/')
      await page.locator('.fl-demo__button').click()
      await expect(page.locator('.fl-demo__list')).toBeVisible()
      expect(await seriousViolations(page)).toEqual([])
    })
  })
}
