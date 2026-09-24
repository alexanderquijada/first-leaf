import { test, expect } from '@playwright/test'

// Each case study's shell has one working term explanation (BRIEF.md §5).
const SHELLS = [
  { path: '/p301', term: 'Yearly fee', short: 'What a fund charges each year to run' },
  { path: '/p302', term: 'Growth on growth', short: 'When your money earns money' },
  { path: '/p303', term: 'Returned deposit', short: 'A deposit your bank sent back' },
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

test('a related word opens its own explanation, and a click outside closes it', async ({ page }) => {
  await page.goto('/p301')
  await page.locator('main .fl-termtip__button').first().click()
  const panel = page.getByRole('dialog', { name: 'Yearly fee' })
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
  await page.goto('/p303')
  await page.locator('main .fl-termtip__button').first().click()
  const panel = page.getByRole('dialog', { name: 'Returned deposit' })
  await expect(panel).toBeVisible()
  const box = (await panel.boundingBox())!
  expect(Math.round(box.x)).toBe(0)
  expect(Math.round(box.width)).toBe(390)
  expect(Math.round(box.y + box.height)).toBe(844)
})
