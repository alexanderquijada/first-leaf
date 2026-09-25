import { test, expect } from '../fixtures'
import { load, money } from '../data'

// Phase 4: the P301 brief's "Edge cases and empty states" rows not already covered by
// p301-home-scenarios (brand-new, calm), F1 (an alert that doesn't exist), F5 (empty filters)
// and P302 F8/F9 (Practice errors, a search with no match). A one-point chart can't happen:
// data rule F5 proves every range the app draws has at least two points.
test.use({ viewport: { width: 1280, height: 800 } })

const attention = load('attention')
const account = load('account')

test('all alerts handled: "You have handled everything for this week.", and Undo still works', async ({ page }) => {
  const flags = attention[account.id] as { id: string; title: string }[]
  // In-app navigation only: handled alerts last for the session, and a reload starts over.
  await page.goto('/alerts')
  const list = page.locator('.alerts__list')
  for (const f of flags) {
    await list.getByRole('link', { name: f.title }).click()
    await page.getByRole('button', { name: 'Mark as handled' }).click()
  }
  await expect(list).toContainText('You have handled everything for this week.')
  await list.getByRole('button', { name: `Handled (${flags.length})` }).click()
  await list.getByRole('button', { name: /^Undo/ }).first().click()
  await expect(list).not.toContainText('You have handled everything for this week.')
})

test('the calm account: nothing needs you, and the SIPC notice sits under "Good to know", uncounted', async ({ page }) => {
  await page.goto('/?scenario=all-clear')
  const alerts = page.locator('.fl-alerts')
  await expect(alerts).toContainText('Nothing needs you right now.')
  await expect(alerts.getByRole('heading', { name: 'Good to know' })).toBeVisible()
  await expect(alerts).toContainText("SIPC protection doesn't cover crypto")
  await expect(alerts).toContainText('Good to know')
  await expect(alerts).not.toContainText('Just so you know')
  await expect(alerts).not.toContainText('FYI')
  // Ruling (Sept. 25): no badge inside "Good to know"; the heading already says it.
  await expect(alerts.locator('.fl-alerts__row', { hasText: "SIPC protection doesn't cover crypto" }).locator('.fl-severity')).toHaveCount(0)
  // Outside the section, on its own page, the badge stays.
  await alerts.getByRole('link', { name: "SIPC protection doesn't cover crypto" }).click()
  await expect(page.locator('.adetail .fl-severity')).toHaveText('Good to know')
})

test('down, not up: losses say "down" in sentences and carry "down" in table labels', async ({ page }) => {
  const losers = account.holdings.filter((h: { gainLoss: number }) => h.gainLoss < 0)
  expect(losers.length).toBeGreaterThan(0)
  // The week on Home: the market piece is a loss, with a sign and "down" for screen readers.
  const w = account.weeklyChange
  expect(w.marketChange).toBeLessThan(0)
  await page.goto('/')
  await expect(page.locator('.balance')).toContainText(`This week: down ${money(w.totalChange)}.`)
  const cell = page.locator('.week').getByText(`−${money(w.marketChange)}`)
  await expect(cell).toBeVisible()
  await expect(cell).toHaveAttribute('aria-hidden', 'true')
  await expect(page.locator('.week td').filter({ hasText: `−${money(w.marketChange)}` }).locator('.fl-visually-hidden')).toHaveText(`down ${money(w.marketChange)}`)
  // An investment that is down says so in words on its page.
  const h = losers[0]
  await page.goto(`/funds/${h.ticker}`)
  await expect(page.getByRole('main')).toContainText(`Down ${money(h.gainLoss)} on the ${money(h.costBasis)} you paid.`)
})

// Ruling (Sept. 25): when the Investments content area is under 600px (a laptop at 200% zoom
// is 640px, so about 592px of content), each holding becomes a stacked row with every value
// labeled by its column name. No hidden columns and no sideways scrolling.
for (const [width, height, what] of [[640, 400, 'a 1280×800 laptop at 200% zoom'], [720, 450, 'a 1440×900 laptop at 200% zoom'], [600, 800, 'a 600px tablet']] as const) {
  test(`on ${what} (${width}×${height}), no Investments column is cut off`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/funds')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your investments')
    const cut = await page.evaluate(() => {
      const out: string[] = []
      const root = document.querySelector('.funds')!
      for (const el of root.querySelectorAll<HTMLElement>('*')) {
        if (el.closest('.fl-visually-hidden')) continue // screen-reader text is 1px wide on purpose
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'visible') out.push(`${el.className} scrolls sideways`)
        if (!el.offsetParent || el.closest('.fl-visually-hidden')) continue
        const r = el.getBoundingClientRect()
        if (r.width && r.right > document.documentElement.clientWidth + 0.5) out.push(`"${el.textContent!.trim().slice(0, 20)}" ends at ${Math.round(r.right)}px`)
      }
      return [...new Set(out)]
    })
    expect(cut).toEqual([])
    // Every holding shows every column, labeled (when the list is stacked).
    if (await page.locator('.funds__stack').isVisible()) for (const h of account.holdings as { ticker: string }[]) {
      const row = page.locator('.funds__stack > li').filter({ has: page.getByRole('link', { name: h.ticker, exact: true }) })
      for (const label of ['Kind', 'Ups and downs', 'Your value', 'Up or down']) await expect(row.getByText(label, { exact: true })).toBeVisible()
    }
  })
}

test('on a laptop at full size, Investments is still a table', async ({ page }) => {
  await page.goto('/funds')
  await expect(page.getByRole('table')).toBeVisible()
  await expect(page.locator('.funds__stack')).toBeHidden()
})

// Phase 5: what the P301 reviewer found.
test('nothing to act on shows a calm illustration, not an empty card', async ({ page }) => {
  await page.goto('/?scenario=all-clear')
  await expect(page.locator('.fl-alerts .fl-scene')).toBeVisible()
  await page.goto('/')
  await expect(page.locator('.fl-alerts .fl-scene')).toHaveCount(0)
})

test('a brand-new account has no "Choose an alert" pane, and a missing alert links back to Alerts', async ({ page }) => {
  await page.goto('/alerts?scenario=brand-new')
  await expect(page.locator('.alerts__list')).toContainText('Nothing needs you right now.')
  await expect(page.getByText('Choose an alert to read it here.')).toHaveCount(0)
  await page.goto('/alerts/nope')
  await page.locator('.alerts__missing').getByRole('link', { name: 'All alerts' }).click()
  await expect(page).toHaveURL(/\/alerts$/)
})

test('a returned deposit is tried again once: then it shows as pending, with no second try', async ({ page }) => {
  await page.goto('/alerts/deposit-returned')
  await page.getByRole('button', { name: 'Try the deposit again' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Continue' }).click()
  await dialog.getByRole('button', { name: 'Confirm deposit' }).click()
  await dialog.getByRole('button', { name: 'Done' }).click()
  const d = page.locator('.adetail')
  await expect(d.getByRole('button', { name: 'Try the deposit again' })).toHaveCount(0)
  await expect(d).toContainText('Your deposit is on its way. It should arrive in 1 to 3 business days.')
  await expect(d).toContainText('Tried againPending since Sept. 20')
})

test('after auto-invest is turned on, the cash alert says so', async ({ page }) => {
  await page.goto('/alerts/cash-sitting')
  const d = page.locator('.adetail')
  await expect(d).not.toContainText('Auto-invest is on. Each deposit buys your mix on the day it arrives.')
  await page.getByRole('button', { name: 'See auto-invest settings' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('switch').click()
  await dialog.getByRole('button', { name: 'Continue' }).click()
  await dialog.getByRole('button', { name: 'Turn on' }).click()
  await dialog.getByRole('button', { name: 'Done' }).click()
  await expect(d).toContainText('Auto-invest is on. Each deposit buys your mix on the day it arrives.')
})

test('no Home card ends in a big empty gap (the tall mix card takes its own row)', async ({ page }) => {
  for (const width of [1280, 1024, 768]) {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')
    await expect(page.locator('.dhome__week')).toBeVisible()
    const gaps = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('.dhome__card')].map((card) => {
        const kids = [...card.querySelectorAll<HTMLElement>('*')].filter((e) => e.offsetParent && !e.closest('.fl-visually-hidden'))
        const bottom = Math.max(...kids.map((e) => e.getBoundingClientRect().bottom))
        return { card: card.className, gap: Math.round(card.getBoundingClientRect().bottom - bottom) }
      }),
    )
    for (const g of gaps) expect(g.gap, `${g.card} at ${width}`).toBeLessThanOrEqual(80)
  }
})
