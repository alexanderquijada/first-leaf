import { test, expect, type Page } from '../fixtures'

// F10: Practice on a phone, with a keypad and a review sheet.
test.use({ viewport: { width: 390, height: 844 } })

async function keys(page: Page, s: string) {
  const pad = page.getByRole('group', { name: 'Number keypad' })
  for (const c of s) await pad.getByRole('button', { name: c === '.' ? 'Decimal point' : c, exact: true }).click()
}
async function clear(page: Page) {
  const del = page.getByRole('group', { name: 'Number keypad' }).getByRole('button', { name: 'Delete' })
  for (let i = 0; i < 10; i++) await del.click()
}

test('the keypad types the amount; each error shows above it and Review stays disabled', async ({ page }) => {
  await page.goto('/practice')
  const err = page.locator('.porder__error').first(), review = page.getByRole('button', { name: 'Review' })
  for (const b of await page.getByRole('group', { name: 'Number keypad' }).getByRole('button').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
    expect(b.height).toBeGreaterThanOrEqual(48)
    expect(b.width).toBeGreaterThanOrEqual(48)
  }
  await keys(page, '.5')
  await expect(err).toHaveText('Enter an amount of $1 or more.')
  await expect(review).toBeDisabled()
  await clear(page)
  await keys(page, '1.234')
  await expect(err).toHaveText('Use no more than 2 decimals, like 25.50.')
  await clear(page)
  await keys(page, '1500')
  await expect(err).toHaveText('You have $1,000.00 in practice money. Enter that much or less.')
  // The error sits above the keypad.
  const eb = (await err.boundingBox())!, kb = (await page.getByRole('group', { name: 'Number keypad' }).boundingBox())!
  expect(eb.y).toBeLessThan(kb.y)
  await page.getByRole('group', { name: 'Buy or sell' }).getByRole('button', { name: 'Sell' }).click()
  await clear(page)
  await keys(page, '10')
  await expect(err).toHaveText('You do not own any AAPL in Practice, so there is nothing to sell. Pick one you own.')
  await expect(review).toBeDisabled()
})

test('review in a bottom sheet, confirm, and the banner is always visible', async ({ page }) => {
  await page.goto('/practice')
  await expect(page.getByRole('note').filter({ hasText: 'Practice money. Nothing here touches your account.' })).toBeInViewport()
  await page.getByRole('radio', { name: /COST/ }).check()
  await keys(page, '200')
  await expect(page.locator('.porder__amount')).toHaveText('$200')
  await page.getByRole('button', { name: 'Review' }).click()
  const sheet = page.getByRole('dialog', { name: 'Check your order' })
  await expect(sheet).toContainText('Buy $200.00 of COST')
  await sheet.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByText('You bought $200.00 of COST with practice money.')).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(page.getByRole('note').filter({ hasText: 'Practice money. Nothing here touches your account.' })).toBeInViewport()
  await expect(page.locator('.practice__table tbody tr:visible, .practice__stack > li:visible')).toHaveCount(1)
})

test('a half-entered order survives leaving and coming back', async ({ page }) => {
  await page.goto('/practice')
  await keys(page, '75')
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click()
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Practice' }).click()
  await expect(page.locator('.porder__amount')).toHaveText('$75')
})
