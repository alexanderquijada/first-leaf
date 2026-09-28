import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { test, expect, settle } from '../fixtures'

// axe-core scans against WCAG 2.2 A and AA. Zero serious or critical violations allowed.
async function seriousViolations(page: Page) {
  // Measure the settled page: a fade-in caught halfway looks like low contrast.
  await settle(page)
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  return results.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.impact}: ${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(' | ')})`)
}

const PAGES = ['/', '/story', '/story#section-1', '/story#section-2', '/story#section-3', '/story#section-4', '/activity', '/activity/rosa-starter-035', '/alerts', '/alerts/beneficiary-missing', '/alerts/sipc-crypto', '/alerts/nope', '/funds', '/funds/AAPL', '/funds/BTC', '/practice', '/learn', '/learn/volatility', '/learn/beneficiary', '/?scenario=all-clear', '/?scenario=brand-new', '/story?scenario=brand-new', '/story?scenario=brand-new#section-2', '/activity?scenario=brand-new']
const WIDTHS = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
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

    test('with the Add a beneficiary sheet open', async ({ page }) => {
      await page.goto('/alerts/beneficiary-missing')
      await page.getByRole('button', { name: 'Add a beneficiary' }).click()
      await expect(page.getByRole('dialog', { name: 'Add a beneficiary' })).toBeVisible()
      await expect.poll(() => page.locator('.v-overlay__content').evaluate((e) => getComputedStyle(e).opacity)).toBe('1')
      expect(await seriousViolations(page)).toEqual([])
    })

    test('with the tables shown and Why it moved open', async ({ page }) => {
      await page.goto('/')
      if (size.width < 600) await page.getByRole('button', { name: 'Why it moved this week' }).click()
      await page.getByRole('button', { name: 'Show as table' }).first().click()
      // Playwright's click scrolls the button into view, which can leave the chart's range
      // buttons under the sticky top bar at 768px; axe then reports them as obscured. That's
      // the test's scroll position, not the page, so measure from the top of the page.
      await page.evaluate(() => window.scrollTo(0, 0))
      expect(await seriousViolations(page)).toEqual([])
    })

    test('Practice with an order error showing', async ({ page }) => {
      await page.goto('/practice')
      if (size.width < 600) {
        const pad = page.getByRole('group', { name: 'Number keypad' })
        await pad.getByRole('button', { name: '9', exact: true }).click()
        for (let i = 0; i < 4; i++) await pad.getByRole('button', { name: '9', exact: true }).click()
      } else await page.getByLabel('Amount in dollars').fill('99999')
      await expect(page.getByRole('alert').first()).toContainText('practice money')
      // The keypad clicks scroll the page, which can leave the fund picker under the sticky top
      // bar (Phase 6.1: no banner above it any more); measure from the top, as above.
      await page.evaluate(() => window.scrollTo(0, 0))
      expect(await seriousViolations(page)).toEqual([])
    })

    test('Finance Terms with no results, and Your head start with a slider moved', async ({ page }) => {
      await page.goto('/learn')
      await page.getByLabel('Search finance terms').fill('zebra')
      expect(await seriousViolations(page)).toEqual([])
      await page.goto('/story#section-3')
      const slider = page.getByRole('slider').first()
      await slider.focus()
      await page.keyboard.press('ArrowRight')
      expect(await seriousViolations(page)).toEqual([])
    })

    test('with the Add a beneficiary sheet showing its errors', async ({ page }) => {
      await page.goto('/alerts/beneficiary-missing')
      await page.getByRole('button', { name: 'Add a beneficiary' }).click()
      const sheet = page.getByRole('dialog', { name: 'Add a beneficiary' })
      await sheet.getByRole('button', { name: 'Save' }).click()
      await expect(sheet).toContainText('Enter their name.')
      await expect.poll(() => page.locator('.v-overlay__content').evaluate((e) => getComputedStyle(e).opacity)).toBe('1')
      expect(await seriousViolations(page)).toEqual([])
    })

    test('the phone sheets open (filter, sections, practice review)', async ({ page }) => {
      test.skip(size.width >= 600, 'These sheets are phone-only')
      await page.goto('/activity')
      await page.getByRole('button', { name: 'Filter' }).click()
      await expect(page.getByRole('dialog', { name: 'Filter' })).toBeVisible()
      expect(await seriousViolations(page)).toEqual([])
      await page.goto('/story')
      await page.getByRole('button', { name: 'Sections' }).click()
      await expect(page.getByRole('dialog', { name: 'Sections' })).toBeVisible()
      expect(await seriousViolations(page)).toEqual([])
      await page.goto('/practice')
      for (const k of ['5', '0']) await page.getByRole('group', { name: 'Number keypad' }).getByRole('button', { name: k, exact: true }).click()
      await page.getByRole('button', { name: 'Review' }).click()
      await expect(page.getByRole('dialog', { name: 'Check your order' })).toBeVisible()
      expect(await seriousViolations(page)).toEqual([])
    })

    test('with the phone view open on Practice', async ({ page }) => {
      test.skip(size.width < 600, 'Phone view has no frame under 600px')
      await page.goto('/p303/practice')
      await expect(page.frameLocator('iframe[title="First Leaf on a phone"]').locator('.porder__keys')).toBeVisible()
      expect(await seriousViolations(page)).toEqual([])
    })

    test('in phone view (/p303)', async ({ page }) => {
      test.skip(size.width < 600, 'Phone view has no frame under 600px')
      await page.goto('/p303')
      await expect(page.frameLocator('iframe[title="First Leaf on a phone"]').locator('.fl-bottombar')).toBeVisible()
      expect(await seriousViolations(page)).toEqual([])
    })

  })
}
