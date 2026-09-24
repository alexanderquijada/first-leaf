import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { test, expect } from '../fixtures'

// axe-core scans against WCAG 2.2 A and AA. Zero serious or critical violations allowed.
async function seriousViolations(page: Page) {
  // Measure the settled page: a fade-in caught halfway looks like low contrast.
  // (Only animations that end: an infinite one, such as a spinner, never finishes.
  // Two frames first, so a transition that starts on the next frame is counted.)
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => undefined)),
    ),
  )
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  return results.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.impact}: ${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(' | ')})`)
}

const PAGES = ['/', '/story', '/activity', '/alerts', '/alerts/deposit-returned', '/alerts/nope', '/?scenario=all-clear', '/?scenario=brand-new', '/story?scenario=brand-new']
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
      await page.goto('/story')
      await page.locator('main .fl-termtip__button').first().click()
      await expect(page.getByRole('dialog')).toBeVisible()
      expect(await seriousViolations(page)).toEqual([])
    })

    test('with a money flow open', async ({ page }) => {
      await page.goto('/alerts/cash-sitting')
      await page.getByRole('button', { name: 'See auto-invest settings' }).click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await expect.poll(() => page.locator('.v-overlay__content').evaluate((e) => getComputedStyle(e).opacity)).toBe('1')
      expect(await seriousViolations(page)).toEqual([])
    })

    test('with the tables shown and Why it moved open', async ({ page }) => {
      await page.goto('/')
      if (size.width < 600) await page.getByRole('button', { name: 'Why it moved this week' }).click()
      await page.getByRole('button', { name: 'Show as table' }).first().click()
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
