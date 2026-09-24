import { test, expect } from '../fixtures'
import { load } from '../data'

// F4: learn a word. Word of the day from the data, Next word in glossary order,
// the explanation as a bottom sheet, and 48px related words.
test.use({ viewport: { width: 390, height: 844 } })

test('word of the day, next word, and a bottom sheet with 48px related words', async ({ page }) => {
  const glossary = load('glossary'), meta = load('meta')
  const i = glossary.findIndex((g: { id: string }) => g.id === meta.wordOfTheDay)
  await page.goto('/')
  const card = page.locator('.phome__word')
  await expect(card.locator('.phome__word-term')).toHaveText(glossary[i].term)
  await card.getByRole('button', { name: 'Next word' }).click()
  await expect(card.locator('.phome__word-term')).toHaveText(glossary[(i + 1) % glossary.length].term)
  await card.getByRole('button', { name: /^Read more/ }).click()
  const sheet = page.getByRole('dialog', { name: glossary[(i + 1) % glossary.length].term })
  await expect(sheet).toBeVisible()
  const box = (await sheet.boundingBox())!
  expect(Math.round(box.width)).toBe(390)
  const links = sheet.locator('.fl-termtip__link')
  expect(await links.count()).toBeGreaterThan(0)
  for (const b of await links.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
    expect(b.height).toBeGreaterThanOrEqual(48)
    expect(b.width).toBeGreaterThanOrEqual(48)
  }
})
