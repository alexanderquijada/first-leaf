import { test, expect } from '../fixtures'

// F1: act on an alert. Two panes on a laptop, realistic money flows, Mark as handled.
test.use({ viewport: { width: 1280, height: 800 } })

test('an alert opens at its own address, beside the list, with what happened, what it means and what you can do', async ({ page }) => {
  await page.goto('/')
  await page.locator('.fl-alerts').getByRole('link', { name: /deposit from Sept. 1 was sent back/ }).click()
  await expect(page).toHaveURL(/\/alerts\/deposit-returned$/)
  const detail = page.locator('.adetail')
  await expect(detail.getByRole('heading', { name: 'Your $150 deposit from Sept. 1 was sent back' })).toBeVisible()
  for (const h of ['What happened', 'What it means', 'What you can do']) await expect(detail.getByRole('heading', { name: h })).toBeVisible()
  await expect(detail).toContainText('Sent back on')
  await expect(detail).toContainText('Sept. 3')
  await expect(page.locator('.alerts__list').getByRole('link', { name: /deposit from Sept. 1/ })).toHaveAttribute('aria-current', 'page')
  // A deep link works on its own.
  await page.goto('/alerts/fee-going-up')
  await expect(page.locator('.adetail')).toContainText('+0.30 percentage points')
})

test('Try the deposit again: review → confirm → confirmation, then Pending in Activity', async ({ page }) => {
  await page.goto('/alerts/deposit-returned')
  await page.getByRole('button', { name: 'Try the deposit again' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('$150.00')
  await dialog.getByRole('button', { name: 'Continue' }).click()
  await expect(dialog).toContainText('You are about to ask your bank for a $150 deposit.')
  await dialog.getByRole('button', { name: 'Confirm deposit' }).click()
  await expect(dialog).toContainText('Your deposit is on its way. It should arrive in 1 to 3 business days.')
  await dialog.getByRole('button', { name: 'Done' }).click()
  await page.locator('.fl-rail').getByRole('link', { name: 'Activity' }).click()
  const first = page.locator('tbody tr').first()
  await expect(first).toContainText('Deposit, tried again')
  await expect(first).toContainText('$150.00')
  await expect(first).toContainText('Pending')
})

test('Add a one-time deposit is filled in, and checks the amount', async ({ page }) => {
  await page.goto('/alerts/goal-behind')
  await page.getByRole('button', { name: 'Add a one-time deposit' }).click()
  const dialog = page.getByRole('dialog')
  const input = dialog.getByLabel('Amount in dollars')
  await expect(input).toHaveValue('150')
  await input.fill('12.345')
  await expect(dialog.getByRole('alert')).toHaveText('Enter an amount from $1 to $10,000, with no more than 2 decimals.')
  await expect(dialog.getByRole('button', { name: 'Continue' })).toBeDisabled()
  await input.fill('75')
  await dialog.getByRole('button', { name: 'Continue' }).click()
  await dialog.getByRole('button', { name: 'Confirm deposit' }).click()
  await expect(dialog).toContainText('Your deposit is on its way.')
})

test('auto-invest can be turned on, with a confirmation, and Home shows it', async ({ page }) => {
  await page.goto('/alerts/cash-sitting')
  await page.getByRole('button', { name: 'See auto-invest settings' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('Auto-invest is paused. It has been off since July 14.')
  await dialog.getByRole('switch').click()
  await dialog.getByRole('button', { name: 'Continue' }).click()
  await expect(dialog).toContainText('The $154.76 already in cash stays as cash.')
  await dialog.getByRole('button', { name: 'Turn on' }).click()
  await expect(dialog).toContainText('Auto-invest is on.')
  await dialog.getByRole('button', { name: 'Done' }).click()
  await page.locator('.fl-rail').getByRole('link', { name: 'Home' }).click()
  await expect(page.locator('.balance')).toContainText('Auto-invest: On.')
})

test('Mark as handled moves an alert to Handled, Undo brings it back, and it survives navigation but not a reload', async ({ page }) => {
  await page.goto('/alerts/goal-behind')
  await page.getByRole('button', { name: 'Mark as handled' }).click()
  const list = page.locator('.alerts__list')
  await expect(list).toContainText('3 alerts need a look.')
  await list.getByRole('button', { name: 'Handled (1)' }).click()
  await expect(list.locator('.fl-alerts__done')).toContainText('Your goal is $150 behind your plan')
  // Survives navigation.
  await page.locator('.fl-rail').getByRole('link', { name: 'Activity' }).click()
  await page.locator('.fl-rail').getByRole('link', { name: 'Home' }).click()
  await expect(page.locator('.fl-alerts')).toContainText('3 alerts need a look.')
  // Undo.
  await page.locator('.fl-alerts').getByRole('button', { name: 'Handled (1)' }).click()
  await page.locator('.fl-alerts').getByRole('button', { name: /^Undo/ }).click()
  await expect(page.locator('.fl-alerts')).toContainText('4 alerts need a look.')
  // Handle again, then reload: the session resets.
  await page.goto('/alerts/goal-behind')
  await page.getByRole('button', { name: 'Mark as handled' }).click()
  await page.reload()
  await expect(page.locator('.alerts__list')).toContainText('4 alerts need a look.')
})

test('a pending deposit survives navigation and resets on reload', async ({ page }) => {
  await page.goto('/alerts/deposit-returned')
  await page.getByRole('button', { name: 'Try the deposit again' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Confirm deposit' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Done' }).click()
  await page.locator('.fl-rail').getByRole('link', { name: 'Activity' }).click()
  await expect(page.locator('.activity__table tbody tr').first()).toContainText('Pending')
  await page.reload()
  await expect(page.locator('.activity__table tbody td', { hasText: 'Pending' })).toHaveCount(0)
})

test('an alert that does not exist, or not in this account, says so', async ({ page }) => {
  await page.goto('/alerts/nope')
  await expect(page.getByRole('heading', { name: 'We could not find that alert.' })).toBeVisible()
  await page.goto('/alerts/deposit-returned?scenario=all-clear')
  await expect(page.getByRole('heading', { name: 'We could not find that alert.' })).toBeVisible()
})

test('Open FL-GREEN goes to the fund page', async ({ page }) => {
  await page.goto('/alerts/fee-going-up')
  await page.getByRole('link', { name: 'Open FL-GREEN' }).click()
  await expect(page).toHaveURL(/\/funds\/FL-GREEN$/)
})
