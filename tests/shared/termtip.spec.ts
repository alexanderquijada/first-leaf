import { test, expect } from '../fixtures'
import { load } from '../data'

// The first finance term on each of these pages has a working explanation (BRIEF.md §5). Phase 6:
// only real finance terms are buttons ("Invested" on the dark card, "Rate of return" in Your
// Journey's first section, "Beneficiary" on the beneficiary alert).
const SHELLS = [
  { path: '/', term: 'Invested', short: 'What the stocks and crypto you own are worth today.' },
  { path: '/story', term: 'Rate of return', short: 'How much your money grew or shrank' },
  { path: '/alerts/beneficiary-missing', term: 'Beneficiary', short: 'The person you choose to get your account if you die.' },
]

for (const { path, term, short } of SHELLS) {
  test.describe(`TermTip on ${path}`, () => {
    test('opens with Enter, shows the explanation, closes with Esc and returns focus', async ({ page }) => {
      await page.goto(path)
      const button = page.locator('main .fl-termtip__button').first()
      await expect(button).toHaveAttribute('aria-expanded', 'false')

      await button.focus()
      await page.keyboard.press('Enter')

      const panel = page.getByRole('dialog', { name: term })
      await expect(panel).toBeVisible()
      await expect(panel).toContainText(short)
      await expect(panel).toBeFocused()
      await expect(button).toHaveAttribute('aria-expanded', 'true')

      await page.keyboard.press('Escape')
      await expect(panel).toBeHidden()
      await expect(button).toBeFocused()
      await expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    test('opens with Space and closes with the close button', async ({ page }) => {
      await page.goto(path)
      const button = page.locator('main .fl-termtip__button').first()
      await button.focus()
      await page.keyboard.press('Space')
      const panel = page.getByRole('dialog', { name: term })
      await expect(panel).toBeVisible()
      await panel.getByRole('button', { name: 'Close explanation' }).click()
      await expect(panel).toBeHidden()
      await expect(button).toBeFocused()
    })
  })
}

// Phase 6: only real finance terms are buttons. The plain words that used to be terms are text.
test('every term button on these pages opens a Finance Terms entry', async ({ page }) => {
  const terms = new Set((load('glossary') as { term: string }[]).map((g) => g.term))
  const found: string[] = []
  for (const path of ['/', '/story#section-1', '/story#section-2', '/story#section-3', '/alerts/beneficiary-missing', '/alerts/sipc-crypto', '/activity/rosa-starter-035', '/funds/AAPL', '/funds/BTC']) {
    await page.goto(path)
    await page.locator('main').waitFor()
    const buttons = page.locator('main .fl-termtip__button')
    const n = await buttons.count()
    expect(n, `${path} has at least one term`).toBeGreaterThan(0)
    for (let i = 0; i < n; i++) {
      const b = buttons.nth(i)
      if (!(await b.isVisible())) continue
      await b.click()
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
      const name = (await dialog.getAttribute('aria-label')) ?? (await dialog.getByRole('heading').first().innerText())
      if (!terms.has(name.trim())) found.push(`${path}: "${name.trim()}"`)
      await page.keyboard.press('Escape')
      await expect(dialog).toHaveCount(0)
    }
  }
  expect(found).toEqual([])
})

test('a related word opens its own explanation, and a click outside closes it', async ({ page }) => {
  await page.goto('/')
  await page.locator('main .fl-termtip__button').first().click()
  const panel = page.getByRole('dialog', { name: 'Invested' })
  await expect(panel).toBeVisible()
  const related = panel.locator('.fl-termtip__link').first()
  const relatedName = (await related.innerText()).trim()
  await related.click()
  await expect(page.getByRole('dialog', { name: relatedName })).toBeVisible()
  await page.mouse.click(5, 5)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('under 600px wide the explanation opens as a bottom sheet', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/alerts/beneficiary-missing')
  await page.locator('main .fl-termtip__button').first().click()
  const panel = page.getByRole('dialog', { name: 'Beneficiary' })
  await expect(panel).toBeVisible()
  const box = (await panel.boundingBox())!
  expect(Math.round(box.x)).toBe(0)
  expect(Math.round(box.width)).toBe(390)
  expect(Math.round(box.y + box.height)).toBe(844)
})

test('after a related word, "Back to" returns to the previous word with focus on that link', async ({ page }) => {
  await page.goto('/')
  await page.locator('main .fl-termtip__button').first().click()
  const first = page.getByRole('dialog', { name: 'Invested' })
  await expect(first).toBeVisible()
  await expect(first.getByRole('button', { name: /^Back to/ })).toHaveCount(0)

  // Forward by keyboard: focus lands on the new word's heading.
  const related = first.locator('.fl-termtip__link').first()
  const relatedName = (await related.innerText()).trim()
  await related.focus()
  await page.keyboard.press('Enter')
  const second = page.getByRole('dialog', { name: relatedName })
  await expect(second).toBeVisible()
  await expect(second.getByRole('heading', { name: relatedName })).toBeFocused()

  // Back: the first word again, with focus on the link that was followed.
  await second.getByRole('button', { name: 'Back to Invested' }).click()
  const again = page.getByRole('dialog', { name: 'Invested' })
  await expect(again).toBeVisible()
  await expect(again.getByRole('button', { name: relatedName, exact: true })).toBeFocused()
  await expect(again.getByRole('button', { name: /^Back to/ })).toHaveCount(0)

  // Esc still closes and returns focus to the word in the sentence.
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.locator('main .fl-termtip__button').first()).toBeFocused()
})
