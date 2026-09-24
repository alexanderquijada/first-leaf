import { test, expect } from '../fixtures'

// F3: filter "Where it is now" by stocks, bonds, reserve and cash.
test('the mix filters by kind, with an empty state for reserve', async ({ page }) => {
  await page.goto('/story')
  const ch4 = page.locator('#chapter-4')
  await ch4.getByRole('group', { name: 'Show' }).getByRole('button', { name: 'Bonds' }).click()
  await expect(ch4.locator('.where__name')).toHaveText(['FL-BOND'])
  await expect(ch4.locator('.fl-chart__summary')).toHaveText('Bonds are $168.57 of your balance, or 13%.')
  await ch4.getByRole('group', { name: 'Show' }).getByRole('button', { name: 'Reserve' }).click()
  await expect(ch4.locator('.where__row')).toHaveCount(0)
  await expect(ch4.locator('.fl-chart__summary')).toHaveText('You do not own any reserve funds right now.')
  await ch4.getByRole('group', { name: 'Show' }).getByRole('button', { name: 'Stocks' }).click()
  await expect(ch4.locator('.where__name')).toHaveText(['FL-BROAD', 'FL-WORLD', 'FL-GREEN'])
  await ch4.getByRole('group', { name: 'Show' }).getByRole('button', { name: 'All' }).click()
  await expect(ch4.locator('.where__name')).toHaveText(['FL-BROAD', 'FL-WORLD', 'FL-BOND', 'FL-GREEN', 'Cash'])
})
