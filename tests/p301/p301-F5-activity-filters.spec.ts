import { test, expect } from '../fixtures'
import { load, money } from '../data'

// F5: check activity. Every row went through (Phase 6), so the only filter is by type;
// each row opens its own page, and Back keeps the filter.
test.use({ viewport: { width: 1280, height: 900 } })

const acts = load('activity')['rosa-starter'] as { id: string; type: string; status: string; amount: number; date: string }[]
const TYPES = [['All', null], ['Deposits', 'deposit'], ['Buys', 'buy'], ['Dividends', 'dividend']] as const

test('every row in the data went through', () => {
  expect(acts.length).toBeGreaterThan(0)
  for (const a of acts) expect(a.status, a.id).toBe('completed')
})

test('the type filter shows the right rows, and there is no status filter', async ({ page }) => {
  await page.goto('/activity')
  await expect(page.getByRole('status')).toHaveText(`Showing ${acts.length} of ${acts.length}.`)
  await expect(page.getByRole('group', { name: 'Status' })).toHaveCount(0)
  const group = page.getByRole('group', { name: 'Type' })
  await expect(group.getByRole('button')).toHaveText(TYPES.map(([l]) => l))
  for (const [label, t] of TYPES) {
    await group.getByRole('button', { name: label, exact: true }).click()
    await expect(group.getByRole('button', { name: label, exact: true })).toHaveAttribute('aria-pressed', 'true')
    const n = acts.filter((a) => !t || a.type === t).length
    expect(n).toBeGreaterThan(0)
    await expect(page.getByRole('status')).toHaveText(`Showing ${n} of ${acts.length}.`)
    await expect(page.locator('.activity__table tbody tr')).toHaveCount(n)
  }
})

test('every row is Completed; none says Returned or Pending', async ({ page }) => {
  await page.goto('/activity')
  const status = await page.locator('.activity__table tbody tr td:nth-child(4)').allInnerTexts()
  expect(status).toHaveLength(acts.length)
  expect(new Set(status)).toEqual(new Set(['Completed']))
  const table = page.locator('.activity__table')
  for (const word of ['Returned', 'Pending', 'Sent back', 'tried again']) await expect(table).not.toContainText(word)
})

test('a deposit opens its details, and Back keeps the filter', async ({ page }) => {
  const deposits = acts.filter((a) => a.type === 'deposit')
  // The table is newest first.
  const newest = [...deposits].sort((a, b) => b.date.localeCompare(a.date))[0]!
  await page.goto('/activity')
  await page.getByRole('group', { name: 'Type' }).getByRole('button', { name: 'Deposits' }).click()
  await page.locator('.activity__table tbody tr').first().getByRole('link').click()
  await expect(page).toHaveURL(new RegExp(`/activity/${newest.id}$`))
  const facts = page.locator('.adet__facts')
  await expect(facts).toContainText(money(newest.amount))
  await expect(facts).toContainText('Completed')
  await expect(facts).not.toContainText('Sent back')
  await page.getByRole('link', { name: 'All activity' }).click()
  await expect(page.getByRole('status')).toHaveText(`Showing ${deposits.length} of ${acts.length}.`)
})

test('number columns keep at least 24px between them', async ({ page }) => {
  await page.goto('/activity')
  const gap = await page.evaluate(() => {
    let min = Infinity
    for (const tr of document.querySelectorAll('.activity__table tbody tr')) {
      const cells = [...tr.children]
      const r = (el: Element) => { const x = document.createRange(); x.selectNodeContents(el); return x.getBoundingClientRect() }
      for (let i = 0; i + 1 < cells.length; i++) min = Math.min(min, r(cells[i + 1]!).left - r(cells[i]!).right)
    }
    return min
  })
  expect(gap).toBeGreaterThanOrEqual(24)
})

test('the brand-new account has no activity yet', async ({ page }) => {
  await page.goto('/activity?scenario=brand-new')
  await expect(page.getByText('Nothing yet. Your deposits, buys and dividends will show here.')).toBeVisible()
})
