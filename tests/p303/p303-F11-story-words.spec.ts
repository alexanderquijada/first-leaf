import { test, expect, settle } from '../fixtures'

// F11: Your Journey and Finance Terms, fitted to the phone (Phase 6).
test.use({ viewport: { width: 390, height: 844 } })

for (const width of [390, 320]) {
  test(`at ${width}px, the section tabs are a 2×2 grid of 48px tabs, with no sideways scroll`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/story')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your Journey')
    const tabs = page.getByRole('tablist', { name: 'Sections' }).getByRole('tab')
    await expect(tabs).toHaveCount(4)
    const boxes = await tabs.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))
    for (const b of boxes) {
      expect(b.height).toBeGreaterThanOrEqual(48)
      expect(b.width).toBeGreaterThanOrEqual(48)
      expect(b.x + b.width).toBeLessThanOrEqual(width)
    }
    // Two columns, two rows.
    expect(Math.round(boxes[0].y)).toBe(Math.round(boxes[1].y))
    expect(Math.round(boxes[2].y)).toBe(Math.round(boxes[3].y))
    expect(boxes[2].y).toBeGreaterThan(boxes[0].y)
    expect(Math.round(boxes[0].x)).toBe(Math.round(boxes[2].x))
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    // Tapping a tab shows its section.
    await tabs.nth(2).click()
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel').getByRole('heading', { level: 2 })).toHaveText('Start early')
    await expect(page).toHaveURL(/#section-3$/)
  })
}

test('the Sections button opens a bottom sheet that takes you to the section', async ({ page }) => {
  await page.goto('/story')
  await page.getByRole('button', { name: 'Sections' }).click()
  const sheet = page.getByRole('dialog', { name: 'Sections' })
  await expect(sheet).toBeVisible()
  await settle(page) // a sheet caught mid-slide measures 47.9999px
  const links = sheet.getByRole('link')
  await expect(links).toHaveCount(4)
  for (const h of await links.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(h).toBeGreaterThanOrEqual(48)
  await links.filter({ hasText: 'Start early' }).click()
  await expect(sheet).toBeHidden()
  const tab = page.getByRole('tab', { name: /Start early/ })
  await expect(tab).toHaveAttribute('aria-selected', 'true')
  await expect(tab).toBeFocused()
  await expect(tab).toBeInViewport()
  await expect(page.getByRole('tabpanel').getByRole('heading', { level: 2 })).toHaveText('Start early')
  await expect(page).toHaveURL(/#section-3$/)
})

test('Start early: sliders are at least 48px tall and the chart sits inline', async ({ page }) => {
  await page.goto('/story#section-3')
  const sliders = page.getByRole('slider')
  await expect(sliders).toHaveCount(2)
  for (const h of await sliders.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(h).toBeGreaterThanOrEqual(48)
  const chart = (await page.locator('#section-3 canvas').first().boundingBox())!
  expect(chart.x).toBeGreaterThanOrEqual(0)
  expect(chart.x + chart.width).toBeLessThanOrEqual(390)
})

test('Finance Terms has search at the top and 48px result rows', async ({ page }) => {
  await page.goto('/learn')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Finance Terms')
  const search = page.getByLabel('Search finance terms')
  await expect(search).toBeInViewport()
  for (const h of await page.locator('.learn__row').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(h).toBeGreaterThanOrEqual(48)
  await search.fill('crypto')
  await expect(page.locator('.learn__row').first()).toBeVisible()
  await page.locator('.learn__row').filter({ hasText: 'Cryptocurrency' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Cryptocurrency')
})
