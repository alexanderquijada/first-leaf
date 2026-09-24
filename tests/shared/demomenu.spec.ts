import { test, expect } from '@playwright/test'

test('the Demo menu switches scenario by keyboard, updates the URL and keeps focus', async ({ page }) => {
  await page.goto('/p301')
  const button = page.locator('.fl-demo__button')
  await expect(button).toContainText('Rosa, 7 months in')
  await button.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.fl-demo__list')).toBeVisible()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/scenario=all-clear/)
  await expect(button).toContainText('Nothing needs you')
  await expect(button).toBeFocused()
})

test('the scenario comes from the URL and survives in-app navigation', async ({ page }) => {
  await page.goto('/p303?scenario=brand-new')
  await expect(page.locator('.fl-demo__button')).toContainText('Brand-new account')
  await page.getByRole('link', { name: 'First Leaf' }).click()
  await page.getByRole('link', { name: /P301/ }).click()
  await expect(page.locator('.fl-demo__button')).toContainText('Brand-new account')
})

test('an unknown scenario falls back to the main demo', async ({ page }) => {
  await page.goto('/p301?scenario=nonsense')
  await expect(page.locator('.fl-demo__button')).toContainText('Rosa, 7 months in')
})
