import type { Page } from '@playwright/test'
import { test, expect, settle } from '../fixtures'

// Your Journey on a phone (P303 lens on P302): the tabs as a 2×2 grid, each at least
// 48px tall, no sideways scroll, and a "Sections" button that opens a bottom sheet.
for (const width of [390, 320]) {
  test.describe(`at ${width}px`, () => {
    test.use({ viewport: { width, height: 844 } })

    test('the section tabs are a 2×2 grid of 48px targets, and nothing scrolls sideways', async ({ page }) => {
      await page.goto('/story')
      const tabs = page.getByRole('tablist', { name: 'Sections' }).getByRole('tab')
      await expect(tabs).toHaveCount(4)
      await settle(page)
      const boxes = await tabs.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON() as DOMRect))
      for (const [i, b] of boxes.entries()) {
        expect(b.height, `tab ${i + 1} height`).toBeGreaterThanOrEqual(48)
        expect(b.left, `tab ${i + 1}`).toBeGreaterThanOrEqual(0)
        expect(b.right, `tab ${i + 1}`).toBeLessThanOrEqual(width)
      }
      const xs = new Set(boxes.map((b) => Math.round(b.left)))
      const ys = new Set(boxes.map((b) => Math.round(b.top)))
      expect(xs.size, 'two columns').toBe(2)
      expect(ys.size, 'two rows').toBe(2)
      // Reading order: 1 2 on the first row, 3 4 on the second.
      expect(boxes[0]!.top).toBe(boxes[1]!.top)
      expect(boxes[2]!.top).toBeGreaterThan(boxes[0]!.top)
      expect(boxes[1]!.left).toBeGreaterThan(boxes[0]!.left)
      for (let n = 1; n <= 4; n++) {
        await tabs.nth(n - 1).click()
        await expect(page.getByRole('tabpanel')).toHaveAttribute('id', `section-${n}`)
        expect(await page.evaluate(() => document.documentElement.scrollWidth), `section ${n}`).toBeLessThanOrEqual(width)
      }
    })

    test('the "Sections" button opens a bottom sheet that jumps to a section', async ({ page }) => {
      await page.goto('/story')
      const button = page.getByRole('tabpanel').getByRole('button', { name: 'Sections' })
      const box = (await button.boundingBox())!
      expect(box.height).toBeGreaterThanOrEqual(48)
      await button.click()
      const sheet = page.locator('.fl-sheet')
      await expect(sheet.getByRole('heading', { name: 'Sections' })).toBeVisible()
      await expect(sheet.getByRole('link')).toHaveText(['Six months in', 'The dip in June', 'Your head start', 'Try it'])
      await sheet.getByRole('link', { name: 'Your head start' }).click()
      await expect(sheet).toHaveCount(0)
      await expect(page).toHaveURL(/#section-3$/)
      await expect(page.getByRole('tabpanel')).toHaveAttribute('id', 'section-3')
      await expect(page.getByRole('tab', { name: /Section 3/ })).toHaveAttribute('aria-selected', 'true')
      await expect(page.getByRole('tab', { name: /Section 3/ })).toBeFocused()
    })
  })
}

test('on a laptop there is no "Sections" button (the tabs are always in view)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/story')
  await expect(page.getByRole('tabpanel').getByRole('button', { name: 'Sections' })).toHaveCount(0)
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  // Animations running longer than 50ms. Reduced motion shortens every animation to 0.01ms,
  // which can still count as running for an instant; only visible change counts.
  const running = (page: Page, colorFades: boolean) =>
    page.evaluate((colorFades) => {
      const color = /color|box-shadow/
      return document
        .getAnimations()
        .filter((a) => a.playState === 'running' && Number(a.effect?.getComputedTiming().duration) > 50)
        .filter((a) => colorFades || !(a instanceof CSSTransition && color.test(a.transitionProperty)))
        .map((a) => `${a instanceof CSSTransition ? a.transitionProperty : a instanceof CSSAnimation ? a.animationName : 'script'} on ${((a.effect as KeyframeEffect).target as Element | null)?.className}`)
    }, colorFades)

  async function everySection(page: Page, colorFades: boolean) {
    await page.goto('/story')
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto')
    for (let n = 1; n <= 4; n++) {
      await page.getByRole('tab', { name: new RegExp(`^Section ${n}`) }).click()
      await expect(page.getByRole('tabpanel')).toHaveAttribute('id', `section-${n}`)
      expect(await running(page, colorFades), `section ${n}`).toEqual([])
    }
    // Toggles and sliders still work, without motion.
    await page.goto('/story#section-2')
    await page.getByRole('button', { name: 'Show events on the chart' }).click()
    expect(await running(page, colorFades), 'events toggle').toEqual([])
    await page.goto('/story#section-3')
    await page.getByRole('slider', { name: /^Then add/ }).focus()
    await page.keyboard.press('End')
    expect(await running(page, colorFades), 'slider').toEqual([])
  }

  test('nothing moves on any section: charts draw at once and the page jumps', async ({ page }) => {
    await everySection(page, false)
  })

  // Failed before Sept. 28's fix: the `button, a` transition rule outranked the reduced-motion `*` rule.
  test('no animation longer than 50ms runs on any section, color fades included', async ({ page }) => {
    await everySection(page, true)
  })
})

// Phase 6.1 review: at 390 the first row of tabs was 78px tall and the second 64px.
test('on a phone both rows of section tabs are the same height', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/story')
  const h = await page.getByRole('tab').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)))
  expect(new Set(h).size, `tab heights ${h.join(', ')}`).toBe(1)
})
