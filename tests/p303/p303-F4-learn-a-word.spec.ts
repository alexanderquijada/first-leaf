import { test, expect } from '../fixtures'
import { load } from '../data'

// F4: learn a finance term. Term of the Day from the data (Phase 6: "Invested" for Sept. 20),
// Next term in Finance Terms order, the explanation as a bottom sheet, and 48px related terms.
test.use({ viewport: { width: 390, height: 844 } })

test('Term of the Day is "Invested", and Read more opens its explanation as a bottom sheet', async ({ page }) => {
  const glossary = load('glossary'), meta = load('meta')
  expect(meta.wordOfTheDay).toBe('invested')
  const today = glossary.find((g: { id: string }) => g.id === meta.wordOfTheDay)
  await page.goto('/')
  const card = page.locator('.phome__word')
  await expect(card.getByRole('heading', { level: 2 })).toHaveText('Term of the Day')
  await expect(card.locator('.phome__word-term')).toHaveText('Invested')
  await expect(card).toContainText(today.short)
  await expect(page.getByText('Word of the day')).toHaveCount(0)
  const readMore = card.getByRole('button', { name: /^Read more/ })
  await expect(readMore).toHaveAccessibleName('Read more about Invested')
  await readMore.click()
  const sheet = page.getByRole('dialog', { name: 'Invested' })
  await expect(sheet).toBeVisible()
  await expect(sheet).toContainText(today.short)
  const box = (await sheet.boundingBox())!
  expect(Math.round(box.width)).toBe(390)
  expect(Math.round(box.y + box.height)).toBe(844)
  await page.keyboard.press('Escape')
  await expect(sheet).toBeHidden()
  await expect(readMore).toBeFocused()
})

test('Next term moves through Finance Terms in order, and each explanation has 48px related terms', async ({ page }) => {
  const glossary = load('glossary'), meta = load('meta')
  const i = glossary.findIndex((g: { id: string }) => g.id === meta.wordOfTheDay)
  await page.goto('/')
  const card = page.locator('.phome__word')
  const next = card.getByRole('button', { name: 'Next term' })
  await expect(card.getByRole('button', { name: 'Next word' })).toHaveCount(0)
  for (const b of await card.getByRole('button').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
    expect(b.height).toBeGreaterThanOrEqual(48)
    expect(b.width).toBeGreaterThanOrEqual(48)
  }
  await next.click()
  const second = glossary[(i + 1) % glossary.length]
  await expect(card.locator('.phome__word-term')).toHaveText(second.term)
  await card.getByRole('button', { name: /^Read more/ }).click()
  const sheet = page.getByRole('dialog', { name: second.term })
  await expect(sheet).toBeVisible()
  const links = sheet.locator('.fl-termtip__link')
  expect(await links.count()).toBeGreaterThan(0)
  for (const b of await links.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
    expect(b.height).toBeGreaterThanOrEqual(48)
    expect(b.width).toBeGreaterThanOrEqual(48)
  }
  await sheet.getByRole('button', { name: 'Close explanation' }).click()
  await expect(sheet).toBeHidden()
  // Next term keeps going and wraps around at the end of Finance Terms.
  for (let k = 2; k <= glossary.length; k++) {
    await next.click()
    await expect(card.locator('.phome__word-term')).toHaveText(glossary[(i + k) % glossary.length].term)
  }
})
