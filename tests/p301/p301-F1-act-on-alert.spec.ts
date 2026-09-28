import { test, expect } from '../fixtures'
import { load } from '../data'

// F1: act on an alert. Two panes on a laptop: the beneficiary alert (Phase 6) with its short
// settings sheet, Remind me later, Mark as handled, and Undo.
test.use({ viewport: { width: 1280, height: 800 } })

const attention = load('attention')
const account = load('account')
const flag = attention[account.id].find((f: { id: string }) => f.id === 'beneficiary-missing')
const glossary = load('glossary')
const terms = (glossary.terms ?? glossary) as { id: string; term: string }[]
const termName = (id: string) => terms.find((t) => t.id === id)!.term

test('the beneficiary alert opens at its own address, beside the list, with what happened, what it means and what you can do', async ({ page }) => {
  expect(account.beneficiary).toBeNull()
  await page.goto('/')
  await page.locator('.fl-alerts').getByRole('link', { name: flag.title }).click()
  await expect(page).toHaveURL(/\/alerts\/beneficiary-missing$/)
  const detail = page.locator('.adetail')
  await expect(detail.getByRole('heading', { name: flag.title })).toBeVisible()
  for (const h of ['What happened', 'What it means', 'What you can do']) await expect(detail.getByRole('heading', { name: h })).toBeVisible()
  await expect(detail).toContainText(flag.body)
  await expect(detail).toContainText(flag.nextStep)
  await expect(detail.locator('.adetail__facts')).toHaveText(/Beneficiary\s*Not named yet/)
  // Its terms are term buttons: Beneficiary and Brokerage account.
  expect(flag.terms).toEqual(['beneficiary', 'brokerage-account'])
  for (const id of flag.terms) await expect(detail.locator('.adetail__terms .fl-termtip__button', { hasText: termName(id) })).toBeVisible()
  await expect(detail.getByRole('button', { name: 'Add a beneficiary' })).toBeVisible()
  await expect(detail.getByRole('button', { name: 'Remind me later' })).toBeVisible()
  await expect(page.locator('.alerts__list').getByRole('link', { name: flag.title })).toHaveAttribute('aria-current', 'page')
  // A term opens on click and says what it means.
  await detail.locator('.adetail__terms .fl-termtip__button', { hasText: 'Beneficiary' }).click()
  await expect(page.getByRole('dialog')).toContainText('Beneficiary')
  await page.keyboard.press('Escape')
  // A deep link works on its own.
  await page.goto('/alerts/sipc-crypto')
  await expect(page.locator('.adetail')).toContainText("SIPC protection covers stocks and cash at a member brokerage if the brokerage fails. It doesn't cover crypto, such as Bitcoin or Ethereum. It never covers a drop in price.")
})

test('Add a beneficiary: empty fields say what to enter, a valid save confirms, and the alert moves to Handled', async ({ page }) => {
  await page.goto('/')
  await page.locator('.fl-alerts').getByRole('link', { name: flag.title }).click()
  const detail = page.locator('.adetail')
  await detail.getByRole('button', { name: 'Add a beneficiary' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading', { name: 'Add a beneficiary' })).toBeVisible()
  const name = dialog.getByLabel('Name', { exact: true })
  const rel = dialog.getByLabel('Relationship')
  await expect(name).toHaveValue('')
  await expect(rel).toHaveValue('')
  // Save with both fields empty: each says what to enter.
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(dialog).toContainText('Enter their name.')
  await expect(dialog).toContainText('Enter how you know them.')
  await expect(name).toHaveAttribute('aria-invalid', 'true')
  await expect(rel).toHaveAttribute('aria-invalid', 'true')
  // Only the name: the relationship still says what to enter.
  await name.fill('Ana Ruiz')
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(dialog).not.toContainText('Enter their name.')
  await expect(dialog).toContainText('Enter how you know them.')
  await rel.fill('sister')
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(dialog.getByRole('status')).toHaveText('Saved. Ana Ruiz is now the beneficiary of your account.')
  await dialog.getByRole('button', { name: 'Done' }).click()
  await expect(dialog).toHaveCount(0)
  // The alert now shows who, in its fact row and under "What you can do", with no second offer.
  await expect(detail.locator('.adetail__facts')).toHaveText(/Beneficiary\s*Ana Ruiz, sister/)
  await expect(detail).toContainText('Saved. Ana Ruiz is now the beneficiary of your account.')
  await expect(detail).not.toContainText(flag.nextStep)
  await expect(detail.getByRole('button', { name: 'Add a beneficiary' })).toHaveCount(0)
  await expect(detail.getByRole('button', { name: 'Remind me later' })).toHaveCount(0)
  await expect(detail.getByText('Handled', { exact: true })).toBeVisible()
  await expect(detail.getByRole('button', { name: 'Undo' })).toBeVisible()
  const list = page.locator('.alerts__list')
  await list.getByRole('button', { name: 'Handled (1)' }).click()
  await expect(list.locator('.fl-alerts__done')).toContainText(flag.title)
  await expect(list.locator('.fl-alerts__done').getByRole('button', { name: /^Undo/ })).toBeVisible()
  // Home (in-app navigation: a reload starts a new session) no longer counts it.
  await page.locator('.fl-rail').getByRole('link', { name: 'Home' }).click()
  const home = page.locator('.fl-alerts')
  await expect(home).not.toContainText('1 thing needs you.')
  await expect(home.getByRole('link', { name: flag.title })).toHaveCount(0)
  // With its only needs-you item handled, the card says so (P301 brief, "All alerts handled").
  await expect(home).toContainText('You have handled everything for this week.')
  // Kept for this visit only: a reload starts over.
  await page.reload()
  await expect(page.locator('.fl-alerts')).toContainText('1 thing needs you.')
  await page.goto('/alerts/beneficiary-missing')
  await expect(page.locator('.adetail .adetail__facts')).toHaveText(/Beneficiary\s*Not named yet/)
})

test('Remind me later moves the beneficiary alert to Handled, and Undo brings it back', async ({ page }) => {
  await page.goto('/alerts/beneficiary-missing')
  const detail = page.locator('.adetail')
  await detail.getByRole('button', { name: 'Remind me later' }).click()
  const list = page.locator('.alerts__list')
  await expect(list).not.toContainText('1 thing needs you.')
  await expect(detail.getByText('Handled', { exact: true })).toBeVisible()
  await expect(detail.getByRole('button', { name: 'Remind me later' })).toHaveCount(0)
  // Reminding is not naming: the fact row still says no one is named.
  await expect(detail.locator('.adetail__facts')).toHaveText(/Beneficiary\s*Not named yet/)
  await list.getByRole('button', { name: 'Handled (1)' }).click()
  await expect(list.locator('.fl-alerts__done')).toContainText(flag.title)
  // Survives navigation.
  await page.locator('.fl-rail').getByRole('link', { name: 'Activity' }).click()
  await page.locator('.fl-rail').getByRole('link', { name: 'Home' }).click()
  const home = page.locator('.fl-alerts')
  await expect(home.getByRole('link', { name: flag.title })).toHaveCount(0)
  // Undo from Home's Handled group.
  await home.getByRole('button', { name: 'Handled (1)' }).click()
  await home.getByRole('button', { name: /^Undo/ }).click()
  await expect(home).toContainText('1 thing needs you.')
  await expect(home.getByRole('link', { name: flag.title })).toBeVisible()
  // Undo on the alert itself, too.
  await home.getByRole('link', { name: flag.title }).click()
  await detail.getByRole('button', { name: 'Remind me later' }).click()
  await detail.getByRole('button', { name: 'Undo' }).click()
  await expect(detail.getByRole('button', { name: 'Remind me later' })).toBeVisible()
  await expect(page.locator('.alerts__list')).toContainText('1 thing needs you.')
})

test('Mark as handled moves the SIPC notice to Handled, Undo brings it back, and it survives navigation but not a reload', async ({ page }) => {
  await page.goto('/alerts/sipc-crypto')
  await page.getByRole('button', { name: 'Mark as handled' }).click()
  const list = page.locator('.alerts__list')
  // An FYI is never counted, so the count stays.
  await expect(list).toContainText('1 thing needs you.')
  await list.getByRole('button', { name: 'Handled (1)' }).click()
  await expect(list.locator('.fl-alerts__done')).toContainText("SIPC protection doesn't cover crypto")
  await page.locator('.fl-rail').getByRole('link', { name: 'Activity' }).click()
  await page.locator('.fl-rail').getByRole('link', { name: 'Home' }).click()
  const home = page.locator('.fl-alerts')
  await expect(home.getByRole('heading', { name: 'Good to know' })).toHaveCount(0)
  await home.getByRole('button', { name: 'Handled (1)' }).click()
  await home.getByRole('button', { name: /^Undo/ }).click()
  await expect(home.getByRole('heading', { name: 'Good to know' })).toBeVisible()
  // Handle again, then reload: the session resets.
  await page.goto('/alerts/sipc-crypto')
  await page.getByRole('button', { name: 'Mark as handled' }).click()
  await page.reload()
  await expect(page.locator('.alerts__list').getByRole('button', { name: /^Handled/ })).toHaveCount(0)
})

test('an alert that does not exist, was removed, or is not in this account, says so', async ({ page }) => {
  for (const url of [
    '/alerts/nope',
    // The removed stories (Phase 6) never come back.
    '/alerts/deposit-returned',
    '/alerts/goal-behind',
    '/alerts/cash-sitting',
    // The calm account has a beneficiary named, so it has no beneficiary alert.
    '/alerts/beneficiary-missing?scenario=all-clear',
  ]) {
    await page.goto(url)
    await expect(page.getByRole('heading', { name: 'We could not find that alert.' }), url).toBeVisible()
  }
})

test('the all-clear account has a beneficiary named and no beneficiary alert', async ({ page }) => {
  const calm = load('account-all-clear')
  expect(calm.beneficiary?.name).toBeTruthy()
  expect(attention[calm.id].map((f: { id: string }) => f.id)).not.toContain('beneficiary-missing')
  await page.goto('/alerts?scenario=all-clear')
  const list = page.locator('.alerts__list')
  await expect(list).toContainText('Nothing needs you right now.')
  await expect(list).not.toContainText('beneficiary')
})

test('the SIPC notice is a "Good to know" notice with its term explained, and no fee alert exists any more', async ({ page }) => {
  await page.goto('/alerts/sipc-crypto')
  const detail = page.locator('.adetail')
  await expect(detail.getByRole('heading', { name: "SIPC protection doesn't cover crypto" })).toBeVisible()
  await expect(detail).toContainText('Good to know')
  await expect(detail.getByRole('button', { name: 'SIPC protection' }).first()).toBeVisible()
  await page.goto('/alerts/fee-going-up')
  await expect(page.getByRole('heading', { name: 'We could not find that alert.' })).toBeVisible()
})

// Failed before the fix (Phase 6): Undo after Save put the alert back while it still named Ana Ruiz.
test('Undo after saving a beneficiary leaves the alert consistent: not named, and Add a beneficiary offered again', async ({ page }) => {
  await page.goto('/alerts/beneficiary-missing')
  const detail = page.locator('.adetail')
  await detail.getByRole('button', { name: 'Add a beneficiary' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Name', { exact: true }).fill('Ana Ruiz')
  await dialog.getByLabel('Relationship').fill('sister')
  await dialog.getByRole('button', { name: 'Save' }).click()
  await dialog.getByRole('button', { name: 'Done' }).click()
  await detail.getByRole('button', { name: 'Undo' }).click()
  await expect(page.locator('.alerts__list')).toContainText('1 thing needs you.')
  await expect(detail.locator('.adetail__facts')).toHaveText(/Beneficiary\s*Not named yet/)
  await expect(detail).toContainText(flag.nextStep)
  await expect(detail.getByRole('button', { name: 'Add a beneficiary' })).toBeVisible()
})
