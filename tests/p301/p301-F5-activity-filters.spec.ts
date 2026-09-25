import { test, expect } from '../fixtures'
import { load } from '../data'

// F5: check activity. Type and status filters combine; empty combinations say so;
// the returned deposit opens its details; session items show with their status.
test.use({ viewport: { width: 1280, height: 900 } })

const acts = load('activity')['rosa-starter'] as { id: string; type: string; status: string }[]
const TYPES = [['All', null], ['Deposits', 'deposit'], ['Buys', 'buy'], ['Dividends', 'dividend']] as const
const STATUSES = [['All', null], ['Completed', 'completed'], ['Pending', 'pending'], ['Returned', 'returned']] as const

test('every type × status combination shows the right rows, or an empty state', async ({ page }) => {
  await page.goto('/activity')
  await expect(page.getByRole('status')).toHaveText(`Showing ${acts.length} of ${acts.length}.`)
  for (const [tl, t] of TYPES) {
    for (const [sl, s] of STATUSES) {
      await page.getByRole('group', { name: 'Type' }).getByRole('button', { name: tl, exact: true }).click()
      await page.getByRole('group', { name: 'Status' }).getByRole('button', { name: sl, exact: true }).click()
      const n = acts.filter((a) => (!t || a.type === t) && (!s || a.status === s)).length
      await expect(page.getByRole('status')).toHaveText(`Showing ${n} of ${acts.length}.`)
      if (n === 0) {
        await expect(page.getByText('Nothing matches these filters.')).toBeVisible()
        await expect(page.locator('.activity__table')).toHaveCount(0)
      } else await expect(page.locator('.activity__table tbody tr')).toHaveCount(n)
    }
  }
  await page.getByRole('button', { name: 'Show everything' }).click()
  await expect(page.locator('.activity__table tbody tr')).toHaveCount(acts.length)
})

test('the returned deposit opens its details', async ({ page }) => {
  await page.goto('/activity')
  await page.getByRole('group', { name: 'Type' }).getByRole('button', { name: 'Deposits' }).click()
  await page.getByRole('group', { name: 'Status' }).getByRole('button', { name: 'Returned' }).click()
  await page.locator('.activity__table').getByRole('link', { name: 'Monthly deposit' }).click()
  const returned = acts.find((x: { status: string }) => x.status === 'returned')
  await expect(page).toHaveURL(new RegExp(`/activity/${returned.id}$`))
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Monthly deposit')
  await expect(page.locator('.adet__facts')).toContainText('Sent back on')
  await expect(page.locator('.adet__facts')).toContainText('Sept. 3')
  await expect(page.getByText('Your bank sent this money back.')).toBeVisible()
  // Back keeps the filters.
  await page.getByRole('link', { name: 'All activity' }).click()
  await expect(page.getByRole('status')).toHaveText(`Showing 1 of ${acts.length}.`)
})

test('a deposit asked for this session shows as Pending, with its own page', async ({ page }) => {
  await page.goto('/alerts/deposit-returned')
  await page.getByRole('button', { name: 'Try the deposit again' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Confirm deposit' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Done' }).click()
  await page.locator('.fl-rail').getByRole('link', { name: 'Activity' }).click()
  await page.getByRole('group', { name: 'Status' }).getByRole('button', { name: 'Pending' }).click()
  await expect(page.locator('.activity__table tbody tr')).toHaveCount(1)
  await page.locator('.activity__table').getByRole('link', { name: 'Deposit, tried again' }).click()
  await expect(page.locator('.adet__facts')).toContainText('Pending')
  await expect(page.getByText('It should arrive in 1 to 3 business days.')).toBeVisible()
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
