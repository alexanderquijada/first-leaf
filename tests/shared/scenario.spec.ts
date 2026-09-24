import { test, expect } from '../fixtures'

// Scenarios are reached by URL only (BRIEF.md §3). There is no menu on screen.
test('?scenario= rides along on every in-app link', async ({ page }) => {
  await page.goto('/story?scenario=brand-new')
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Activity' }).click()
  await expect(page).toHaveURL(/\/activity\?scenario=brand-new$/)
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Your money story' }).click()
  await expect(page).toHaveURL(/\/story\?scenario=brand-new$/)
  await expect(page.getByText('Right now, almost all')).toHaveCount(0)
})

test('an unknown scenario falls back to the main account', async ({ page }) => {
  await page.goto('/story?scenario=nonsense')
  await expect(page.getByText("Right now, almost all of Rosa's balance is money she put in.")).toBeVisible()
})

test.describe('with the phone view open', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('?scenario= carries into the phone view', async ({ page }) => {
    await page.goto('/story?scenario=brand-new&view=phone')
    const frame = page.locator('iframe[title="First Leaf on a phone"]')
    expect(await frame.getAttribute('src')).toContain('scenario=brand-new')
    await expect(page.frameLocator('iframe[title="First Leaf on a phone"]').getByText('Growth needs years. Starting early')).toBeVisible()
  })
})
