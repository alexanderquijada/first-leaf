import { test, expect } from '../fixtures'
import { load, money } from '../data'

// F5: move around one-handed with the bottom tab bar. F6: check every scenario in phone view.
const TABS = [
  ['Home', '/', 'Good morning'],
  ['Activity', '/activity', 'Activity'],
  ['Journey', '/story', 'Your Journey'],
  ['Practice', '/practice', 'Practice'],
  ['Terms', '/learn', 'Finance Terms'],
] as const

test.describe('F5 at 390px', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('every tab is 48px or more, shows where you are, and the bar stays put while the page scrolls', async ({ page }) => {
    await page.goto('/story')
    const bar = page.locator('.fl-bottombar')
    await expect(bar.getByRole('link')).toHaveText(TABS.map(([name]) => name))
    for (const [name, path, title] of TABS) {
      await bar.getByRole('link', { name, exact: true }).tap()
      await expect(page).toHaveURL(new RegExp(`${path === '/' ? '/$' : path + '$'}`))
      if (path !== '/') await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
      // Exactly one tab is current, and it is this one (a bar, bold and color, not color alone).
      await expect(bar.locator('[aria-current="page"]')).toHaveCount(1)
      await expect(bar.getByRole('link', { name, exact: true })).toHaveAttribute('aria-current', 'page')
      for (const b of await bar.getByRole('link').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
        expect(b.width).toBeGreaterThanOrEqual(48)
        expect(b.height).toBeGreaterThanOrEqual(48)
      }
    }
    // The bar keeps its place at the bottom, opaque, while the content scrolls under it.
    await bar.getByRole('link', { name: 'Journey', exact: true }).tap()
    const before = (await bar.boundingBox())!
    await page.evaluate(() => window.scrollTo(0, 1500))
    const after = (await bar.boundingBox())!
    expect(after.y).toBe(before.y)
    expect(before.y + before.height).toBeCloseTo(844, 0)
    expect(await bar.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe('rgb(255, 253, 248)')
  })
})

test.describe('F6 in phone view at 1280px', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  for (const [scenario, file] of [['normal', 'account'], ['all-clear', 'account-all-clear'], ['brand-new', 'account-new']] as const) {
    test(`/p303?scenario=${scenario} shows that account on the phone`, async ({ page }) => {
      const a = load(file)
      await page.goto(`/p303?scenario=${scenario}`)
      const phone = page.frameLocator('iframe[title="First Leaf on a phone"]')
      await expect(phone.locator('.fl-bottombar')).toBeVisible()
      if (a.history.length) await expect(phone.locator('.balance .balance__big')).toHaveText(money(a.balance))
      else await expect(phone.getByRole('heading', { name: 'Welcome, Rosa.' })).toBeVisible()
      // The scenario stays with the phone as it moves.
      await phone.locator('.fl-bottombar').getByRole('link', { name: 'Activity' }).click()
      await expect(page).toHaveURL(new RegExp(`/p303/activity\\?scenario=${scenario}$`))
    })
  }
})

test.describe('Why it moved on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('"Finance terms on this screen" lists only the finance terms the breakdown shows', async ({ page }) => {
    const w = load('account').weeklyChange
    await page.goto('/')
    await page.getByRole('button', { name: /Why it moved/ }).click()
    const why = page.locator('.phome__why')
    const chips = why.locator('.chips li .fl-termtip__button')
    // Only terms the breakdown names: Dividend when a dividend piece shows (Phase 6 review: not Volatility).
    const expected = w.dividends !== 0 ? ['Dividend'] : []
    await expect(chips).toHaveText(expected)
    await expect(why.getByRole('heading', { name: 'Finance terms on this screen' })).toHaveCount(expected.length ? 1 : 0)
  })
})

// Phase 6: the tabs say Home, Activity, Journey, Practice, Terms. Each label fits on one line in
// a 64px tab at 320px. "Finance Terms" would not, which is why the tab says "Terms" (the page
// title and the rail still say "Finance Terms").
test.describe('tab labels at 320px', () => {
  test.use({ viewport: { width: 320, height: 640 } })

  const lines = (page: import('@playwright/test').Page) =>
    page.locator('.fl-bottombar__label').evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect(), tab = e.closest('a')!.getBoundingClientRect()
        const lh = parseFloat(getComputedStyle(e).lineHeight)
        return { text: e.textContent!.trim(), lines: Math.round(r.height / lh), width: r.width, tabWidth: tab.width, tabHeight: tab.height }
      }),
    )

  test('every tab label fits on one line, and "Finance Terms" would not', async ({ page }, info) => {
    await page.goto('/')
    const measured = await lines(page)
    expect(measured.map((m) => m.text)).toEqual(TABS.map(([name]) => name))
    for (const m of measured) {
      info.annotations.push({ type: 'measured', description: `"${m.text}": ${m.lines} line(s), ${m.width.toFixed(1)}px wide in a ${m.tabWidth.toFixed(1)}×${m.tabHeight.toFixed(1)}px tab` })
      expect(m.lines, `"${m.text}" is on one line`).toBe(1)
      expect(m.width, `"${m.text}" fits inside its tab`).toBeLessThanOrEqual(m.tabWidth)
      expect(m.tabWidth).toBeGreaterThanOrEqual(48)
      expect(m.tabHeight).toBeGreaterThanOrEqual(48)
    }
    // Render "Finance Terms" in the Terms tab and measure it.
    await page.locator('.fl-bottombar__label').last().evaluate((e) => (e.textContent = 'Finance Terms'))
    const long = (await lines(page)).at(-1)!
    info.annotations.push({ type: 'measured', description: `"Finance Terms" in the same tab: ${long.lines} lines, ${long.width.toFixed(1)}px wide in a ${long.tabWidth.toFixed(1)}px tab` })
    expect(long.lines, '"Finance Terms" wraps in a 320px tab').toBeGreaterThan(1)
  })
})
