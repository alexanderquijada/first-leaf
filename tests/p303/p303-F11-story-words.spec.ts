import { test, expect } from '../fixtures'

// F11: the story and Words, fitted to the phone.
test.use({ viewport: { width: 390, height: 844 } })

test('the chapter menu is a bottom sheet that takes you to the chapter', async ({ page }) => {
  await page.goto('/story')
  await expect(page.getByRole('navigation', { name: 'Chapters' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Chapters' }).click()
  const sheet = page.getByRole('dialog', { name: 'Chapters' })
  for (const h of await sheet.getByRole('link').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(h).toBeGreaterThanOrEqual(48)
  await sheet.getByRole('link', { name: 'What happens if you keep going' }).click()
  await expect(sheet).toBeHidden()
  const heading = page.getByRole('heading', { name: 'What happens if you keep going' })
  await expect(heading).toBeInViewport()
  await expect(heading).toBeFocused()
  await expect(page).toHaveURL(/#chapter-5$/)
})

test('story sliders are at least 48px tall and the charts sit inline', async ({ page }) => {
  await page.goto('/story#chapter-5')
  const sliders = page.getByRole('slider')
  expect(await sliders.count()).toBe(4)
  for (const h of await sliders.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(h).toBeGreaterThanOrEqual(48)
  const chart = (await page.locator('#chapter-5 canvas').first().boundingBox())!
  expect(chart.x).toBeGreaterThanOrEqual(0)
  expect(chart.x + chart.width).toBeLessThanOrEqual(390)
})

test('Words has search at the top and 48px result rows', async ({ page }) => {
  await page.goto('/learn')
  const search = page.getByLabel('Search words')
  await expect(search).toBeInViewport()
  for (const h of await page.locator('.learn__row').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(h).toBeGreaterThanOrEqual(48)
  await search.fill('cash')
  await page.locator('.learn__row').first().click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Cash')
})
