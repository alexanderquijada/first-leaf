import { test, expect, type Page } from '../fixtures'
import { load, money, SCENARIOS } from '../data'

// Phase 4: the P303 brief's "Edge cases and empty states" rows, from a 320px phone up.
// Covered elsewhere: nothing-needs-you and brand-new at 390 (F1), Practice errors and an
// interrupted order at 390 (F10), no sideways scroll and 48px targets at 320 (edge-sizes).
test.use({ viewport: { width: 320, height: 640 } })

const account = load('account')

async function keys(page: Page, s: string) {
  const pad = page.getByRole('group', { name: 'Number keypad' })
  for (const c of s) await pad.getByRole('button', { name: c === '.' ? 'Decimal point' : c, exact: true }).click()
}

for (const s of SCENARIOS) {
  test(`at 320px, the check-in fits and the tab bar works (?scenario=${s.id})`, async ({ page }) => {
    await page.goto(`/?scenario=${s.id}`)
    const bar = page.locator('.fl-bottombar')
    await expect(bar).toBeVisible()
    for (const b of await bar.getByRole('link').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
      expect(b.width).toBeGreaterThanOrEqual(48)
      expect(b.height).toBeGreaterThanOrEqual(48)
    }
    const a = load(s.file)
    if (a.history.length) {
      await expect(page.locator('.phome__big')).toHaveText(money(a.balance))
      await expect(page.locator('.phome__big')).toBeInViewport()
      // Cards grow taller, never wider.
      const cards = await page.locator('.phome > *').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().right))
      for (const r of cards) expect(r).toBeLessThanOrEqual(320 - 16 + 0.5)
    } else {
      await expect(page.getByRole('heading', { name: 'Welcome, Rosa.' })).toBeVisible()
    }
    await bar.getByRole('link', { name: 'Activity' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Activity')
  })
}

test('at 320px, an alert title gets the row to itself instead of a narrow column beside its badge', async ({ page }) => {
  for (const s of ['normal', 'all-clear']) {
    await page.goto(`/?scenario=${s}`)
    const row = page.locator('.phome__needs .phome__top').first()
    const [r, t] = [(await row.boundingBox())!, (await row.locator('.phome__top-text').boundingBox())!]
    expect(t.width, s).toBeGreaterThanOrEqual(r.width * 0.6)
  }
})

test('nothing needs you: the SIPC notice sits under "Good to know" on the phone', async ({ page }) => {
  await page.goto('/?scenario=all-clear')
  const card = page.locator('.phome__needs')
  await expect(card.getByRole('heading', { level: 2 })).toHaveText('Nothing needs you right now.')
  await expect(card.getByRole('heading', { name: 'Good to know' })).toBeVisible()
  await expect(card).toContainText("SIPC protection doesn't cover crypto")
  // Ruling (Sept. 25): no badge inside "Good to know" on the phone either.
  await expect(card.locator('.fl-severity')).toHaveCount(0)
})

test('a down week says "down" in words, and says ups and downs are normal', async ({ page }) => {
  const w = account.weeklyChange
  expect(w.totalChange).toBeLessThan(0)
  await page.goto('/')
  await expect(page.locator('.phome__week')).toHaveText(`Down ${money(w.totalChange)} this week`)
  await page.getByRole('button', { name: /Why it moved/ }).click()
  const why = page.locator('.phome__why')
  await expect(why).toContainText(`The market: down ${money(w.marketChange)}.`)
  if (account.holdings.some((h: { weekChange?: number }) => (h.weekChange ?? 0) < 0)) await expect(why).toContainText('Ups and downs are normal.')
})

test('at 320px, every Practice error shows above the keypad, and a half-entered order survives', async ({ page }) => {
  await page.goto('/practice')
  const err = page.locator('.porder__error').first(), review = page.getByRole('button', { name: 'Review' })
  await keys(page, '1500')
  await expect(err).toHaveText('You have $1,000.00 in practice money. Enter that much or less.')
  await expect(review).toBeDisabled()
  const eb = (await err.boundingBox())!, kb = (await page.getByRole('group', { name: 'Number keypad' }).boundingBox())!
  expect(eb.y).toBeLessThan(kb.y)
  expect(eb.x + eb.width).toBeLessThanOrEqual(320)
  // The sticky "Practice money" banner never covers the error.
  await expect.poll(async () => {
    const e = (await err.boundingBox())!, banner = (await page.locator('.practice__banner').boundingBox())!
    return e.y - (banner.y + banner.height)
  }).toBeGreaterThanOrEqual(0)
  // Interrupted: leave for Words and come back; the amount is still there.
  await page.locator('.fl-bottombar').getByRole('link', { name: 'Words' }).click()
  await page.locator('.fl-bottombar').getByRole('link', { name: 'Practice' }).click()
  await expect(err).toHaveText('You have $1,000.00 in practice money. Enter that much or less.')
})

test('phone body text has a line height of at least 1.6', async ({ page }) => {
  const low: string[] = []
  for (const path of ['/', '/alerts/deposit-returned', '/activity/rosa-starter-035', '/funds/AAPL', '/story', '/learn/sipc-protection']) {
    await page.goto(path)
    await page.locator('main').waitFor()
    low.push(
      ...(await page.evaluate((path) => {
        const out: string[] = []
        for (const p of document.querySelectorAll<HTMLElement>('main p')) {
          const cs = getComputedStyle(p)
          if (!p.offsetHeight || parseFloat(cs.fontSize) > 18) continue // headlines and big numbers are not body text
          const lh = cs.lineHeight === 'normal' ? 1.2 : parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)
          if (lh < 1.6 - 0.01) out.push(`${path}: "${p.textContent!.trim().slice(0, 30)}" ${lh.toFixed(2)}`)
        }
        return out
      }, path)),
    )
  }
  expect(low).toEqual([])
})

// Phase 5 (second review): no text on any phone page is under 14px, including the "Seen"
// pill and chapter 5's slider labels, anywhere on the page, not only on the first screen.
test('no phone text is under 14px on any page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const small: string[] = []
  const scan = async (where: string) => {
    small.push(
      ...(await page.evaluate((where) => {
        const out: string[] = []
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        for (let n = w.nextNode(); n; n = w.nextNode()) {
          const el = n.parentElement!
          if (!n.textContent!.trim() || el.closest('.fl-visually-hidden, [aria-hidden="true"]') || !el.getClientRects().length) continue
          const fs = parseFloat(getComputedStyle(el).fontSize)
          if (fs < 14) out.push(`${where}: "${n.textContent!.trim().slice(0, 24)}" ${fs}px`)
        }
        return out
      }, where)),
    )
  }
  for (const path of ['/', '/alerts', '/alerts/deposit-returned', '/activity', '/activity/rosa-starter-035', '/funds', '/funds/BTC', '/practice', '/learn', '/learn/crypto', '/?scenario=all-clear', '/?scenario=brand-new']) {
    await page.goto(path)
    await page.locator('main').waitFor()
    await scan(path)
  }
  // After an alert is seen, and with chapter 5 open.
  await page.goto('/')
  await page.locator('.phome__needs .phome__top').first().click()
  await page.locator('.fl-bottombar').getByRole('link', { name: 'Home' }).click()
  await expect(page.locator('.phome__seen')).toBeVisible()
  await scan('/ (seen)')
  await page.goto('/story#chapter-5')
  await page.getByRole('button', { name: 'Show the answer' }).click()
  await scan('/story (chapter 5 open)')
  expect([...new Set(small)]).toEqual([])
})

test('with "Seen", the needs-you row keeps its chevron on the right, on one row', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.locator('.phome__needs .phome__top').first().click()
  await page.locator('.fl-bottombar').getByRole('link', { name: 'Home' }).click()
  const row = page.locator('.phome__needs .phome__top').first()
  await expect(row.locator('.phome__seen')).toBeVisible()
  const [r, go] = [(await row.boundingBox())!, (await row.locator('.phome__go').boundingBox())!]
  expect(go.x + go.width).toBeGreaterThan(r.x + r.width - 40)
  expect(go.y).toBeLessThan(r.y + r.height / 2 + 12)
})
