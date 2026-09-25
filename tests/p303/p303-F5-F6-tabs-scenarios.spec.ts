import { test, expect } from '../fixtures'
import { load, money } from '../data'

// F5: move around one-handed with the bottom tab bar. F6: check every scenario in phone view.
const TABS = [
  ['Home', '/', 'Good morning'],
  ['Activity', '/activity', 'Activity'],
  ['Story', '/story', 'Your money story'],
  ['Practice', '/practice', 'Practice'],
  ['Words', '/learn', 'Words'],
] as const

test.describe('F5 at 390px', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('every tab is 48px or more, shows where you are, and the bar stays put while the page scrolls', async ({ page }) => {
    await page.goto('/story')
    const bar = page.locator('.fl-bottombar')
    for (const [name, path] of TABS) {
      await bar.getByRole('link', { name, exact: true }).tap()
      await expect(page).toHaveURL(new RegExp(`${path === '/' ? '/$' : path + '$'}`))
      // Exactly one tab is current, and it is this one (a bar, bold and color, not color alone).
      await expect(bar.locator('[aria-current="page"]')).toHaveCount(1)
      await expect(bar.getByRole('link', { name, exact: true })).toHaveAttribute('aria-current', 'page')
      for (const b of await bar.getByRole('link').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
        expect(b.width).toBeGreaterThanOrEqual(48)
        expect(b.height).toBeGreaterThanOrEqual(48)
      }
    }
    // The bar keeps its place at the bottom, opaque, while the content scrolls under it.
    await bar.getByRole('link', { name: 'Story', exact: true }).tap()
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
      if (a.history.length) await expect(phone.locator('.phome__big')).toHaveText(money(a.balance))
      else await expect(phone.getByRole('heading', { name: 'Welcome, Rosa.' })).toBeVisible()
      // The scenario stays with the phone as it moves.
      await phone.locator('.fl-bottombar').getByRole('link', { name: 'Activity' }).click()
      await expect(page).toHaveURL(new RegExp(`/p303/activity\\?scenario=${scenario}$`))
    })
  }
})

test.describe('Why it moved on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('"Words on this screen" lists only the words the breakdown shows', async ({ page }) => {
    const w = load('account').weeklyChange
    await page.goto('/')
    await page.getByRole('button', { name: /Why it moved/ }).click()
    const why = page.locator('.phome__why')
    const chips = why.locator('.chips li .fl-termtip__button')
    const expected = [
      ...(w.marketChange !== 0 ? ['The market'] : []),
      ...(w.dividends !== 0 ? ['Dividend'] : []),
      ...(w.deposits !== 0 ? ['Deposit'] : []),
      ...(w.byFund.some((f: { change: number }) => f.change < 0) ? ['Ups and downs'] : []),
    ]
    await expect(chips).toHaveText(expected)
  })
})
