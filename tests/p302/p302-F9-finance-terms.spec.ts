import { test, expect } from '../fixtures'
import { load } from '../data'

// F9: Finance Terms (/learn). Search, an empty state, every term page with its related
// terms, its source on a government or regulator site, and a way back.
const glossary = load('glossary') as { id: string; term: string; related: string[]; short: string; source: { url: string } }[]
const SOURCES = /^https:\/\/(www\.)?(investor\.gov|sec\.gov|finra\.org|sipc\.org|irs\.gov|consumerfinance\.gov)\//

test('the page is "Finance Terms"; search finds "crypto" and opens Cryptocurrency with its investor.gov source', async ({ page }) => {
  await page.goto('/learn')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Finance Terms')
  await expect(page.getByRole('status')).toHaveText(`${glossary.length} terms`)
  await page.getByLabel('Search finance terms').fill('crypto')
  await expect(page.locator('.learn__row').first()).toBeVisible()
  await page.getByRole('link', { name: /^Cryptocurrency/ }).click()
  await expect(page).toHaveURL(/\/learn\/cryptocurrency$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cryptocurrency')
  const source = page.locator('.term__source a')
  await expect(page.locator('.term__source')).toContainText('Source:')
  await expect(source).toHaveAttribute('href', /^https:\/\/www\.investor\.gov\//)
  await expect(source).toHaveAttribute('target', '_blank')
  await page.goBack()
  await page.getByLabel('Search finance terms').fill('zebra')
  await expect(page.getByText('No terms match “zebra”. Try “stock” or “crypto”.')).toBeVisible()
  await expect(page.locator('.learn__row')).toHaveCount(0)
})

test('every term page opens directly, with its related terms, its source and a way back', async ({ page }) => {
  for (const g of glossary) {
    await page.goto(`/learn/${g.id}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(g.term)
    await expect(page.getByText(g.short)).toBeVisible()
    await expect(page.locator('.term__related a')).toHaveCount(g.related.length)
    expect(g.source.url, g.id).toMatch(SOURCES)
    await expect(page.locator('.term__source a'), g.id).toHaveAttribute('href', g.source.url)
  }
  await page.goto('/learn/sipc-protection')
  await page.locator('.term__related a').first().click()
  await expect(page).not.toHaveURL(/sipc-protection/)
  await page.getByRole('link', { name: 'All finance terms' }).click()
  await expect(page).toHaveURL(/\/learn$/)
})

test('an unknown term says so', async ({ page }) => {
  await page.goto('/learn/nope')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('We could not find that term.')
})
