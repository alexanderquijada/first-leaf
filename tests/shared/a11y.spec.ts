import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { test, expect } from '../fixtures'

// axe-core scans against WCAG 2.2 A and AA. Zero serious or critical violations allowed.
async function seriousViolations(page: Page) {
  // Measure the settled page: a fade-in caught halfway looks like low contrast.
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))))
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  return results.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.impact}: ${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(' | ')})`)
}

const PAGES = ['/', '/story', '/activity', '/alerts']
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

    test('with the phone preview open', async ({ page }) => {
      test.skip(size.width < 600, 'Phone preview is hidden under 600px')
      await page.goto('/?view=phone')
      await expect(page.frameLocator('iframe[title="First Leaf on a phone"]').locator('.fl-bottombar')).toBeVisible()
      expect(await seriousViolations(page)).toEqual([])
    })

  })
}
