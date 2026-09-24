import { test, expect } from '../fixtures'
import { load } from '../data'

// F9: Words. Search, an empty state, every term page with related words and Back.
const glossary = load('glossary') as { id: string; term: string; related: string[]; short: string }[]

test('search finds "fee", and a search with no match says so', async ({ page }) => {
  await page.goto('/learn')
  await expect(page.getByRole('status')).toHaveText(`${glossary.length} words`)
  await page.getByLabel('Search words').fill('fee')
  await expect(page.locator('.learn__row').first()).toBeVisible()
  await page.getByRole('link', { name: /Yearly fee/ }).click()
  await expect(page).toHaveURL(/\/learn\/expense-ratio$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Yearly fee')
  await page.goBack()
  await page.getByLabel('Search words').fill('zebra')
  await expect(page.getByText('No words match “zebra”. Try “fee” or “fund”.')).toBeVisible()
  await expect(page.locator('.learn__row')).toHaveCount(0)
})

test('every term page opens directly, with its related words and a way back', async ({ page }) => {
  for (const g of glossary) {
    await page.goto(`/learn/${g.id}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(g.term)
    await expect(page.getByText(g.short)).toBeVisible()
    const chips = page.locator('.term__related a')
    await expect(chips).toHaveCount(g.related.length)
  }
  await page.goto('/learn/expense-ratio')
  await page.locator('.term__related a').first().click()
  await expect(page).not.toHaveURL(/expense-ratio/)
  await page.getByRole('link', { name: 'All words' }).click()
  await expect(page).toHaveURL(/\/learn$/)
})

test('an unknown word says so', async ({ page }) => {
  await page.goto('/learn/nope')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('We could not find that word.')
})
