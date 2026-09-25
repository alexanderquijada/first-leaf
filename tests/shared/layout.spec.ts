import { test, expect } from '../fixtures'

// One app, three navigations (BRIEF.md §3).
const nav = (page: import('@playwright/test').Page) => page.getByRole('navigation', { name: 'Main' })

test.describe('desktop, 1280px', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('shows the left rail and the top bar, not the tabs or bottom bar', async ({ page }) => {
    await page.goto('/activity')
    await expect(nav(page)).toHaveCount(1)
    await expect(page.locator('.fl-rail')).toBeVisible()
    await expect(page.locator('.fl-tabs')).toBeHidden()
    await expect(page.locator('.fl-bottombar')).toBeHidden()
    const links = nav(page).getByRole('link')
    await expect(links).toHaveText(['Home', 'Activity', 'Investments', 'Your money story', 'Practice', 'Words'])
    await expect(nav(page).getByRole('link', { name: 'Activity' })).toHaveAttribute('aria-current', 'page')
    await expect(page.getByText('Good morning, Rosa.')).toBeVisible()
    await expect(page.getByText('Prices as of Fri., Sept. 18')).toBeVisible()
  })
})

test.describe('tablet, 768px', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test('shows the top tabs', async ({ page }) => {
    await page.goto('/story')
    await expect(page.locator('.fl-tabs')).toBeVisible()
    await expect(page.locator('.fl-rail')).toBeHidden()
    await expect(page.locator('.fl-bottombar')).toBeHidden()
    await expect(nav(page).getByRole('link', { name: 'Your money story' })).toHaveAttribute('aria-current', 'page')
  })
})

test.describe('phone, 390px', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('shows an opaque bottom tab bar with five 48px tabs', async ({ page }) => {
    await page.goto('/funds')
    const bar = page.locator('.fl-bottombar')
    await expect(bar).toBeVisible()
    await expect(page.locator('.fl-rail')).toBeHidden()
    await expect(page.locator('.fl-tabs')).toBeHidden()
    const tabs = bar.getByRole('link')
    await expect(tabs).toHaveText(['Home', 'Activity', 'Story', 'Practice', 'Words'])
    for (const box of await tabs.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
      expect(box.width).toBeGreaterThanOrEqual(48)
      expect(box.height).toBeGreaterThanOrEqual(48)
    }
    // Funds is reached from Home on a phone, so Home is current.
    await expect(bar.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    const bg = await bar.evaluate((e) => getComputedStyle(e).backgroundColor)
    expect(bg).toBe('rgb(255, 253, 248)')
  })

  test('the end of the page is not hidden behind the bottom tab bar', async ({ page }) => {
    await page.goto('/story')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your money story')
    const last = page.locator('main #chapter-6 .k6__go')
    const bar = page.locator('.fl-bottombar')
    await expect
      .poll(async () => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        const a = (await last.boundingBox())!
        const b = (await bar.boundingBox())!
        return b.y - (a.y + a.height)
      })
      .toBeGreaterThanOrEqual(0)
  })
})

test('old case-study addresses redirect and keep the scenario', async ({ page }) => {
  const cases = [
    ['/p301', '/'],
    ['/p302', '/story'],
    ['/p303', '/'],
    ['/p301/funds/AAPL', '/funds/AAPL'],
    ['/p303/learn/ups-and-downs', '/learn/ups-and-downs'],
    ['/p303/attention', '/alerts'],
    ['/about', '/'],
  ]
  for (const [from, to] of cases) {
    await page.goto(from!)
    await expect(page).toHaveURL(new RegExp(`${to!.replace(/\//g, '\\/')}$`))
  }
  await page.goto('/p302?scenario=brand-new')
  await expect(page).toHaveURL(/\/story\?scenario=brand-new$/)
})

test('an unknown address shows the friendly 404 inside the app', async ({ page }) => {
  await page.goto('/no/such/page')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("We couldn't find that page.")
  await expect(nav(page)).toBeVisible()
  await page.getByRole('link', { name: 'Go to Home' }).click()
  await expect(page).toHaveURL(/\/$/)
})

test('the About page and the Demo menu are gone', async ({ page }) => {
  await page.goto('/about')
  await expect(page).toHaveURL(/\/$/)
  for (const path of ['/', '/story', '/alerts']) {
    await page.goto(path)
    await expect(page.getByText('About this demo')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /^Demo/ })).toHaveCount(0)
    await expect(page.locator('.fl-demo__button')).toHaveCount(0)
  }
})

test('the skip link moves focus to the page content', async ({ page }) => {
  await page.goto('/activity')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Activity')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
})

test('the story states its point of view, and only the part that is true', async ({ page }) => {
  await page.goto('/story')
  await expect(page.getByText('Right now, almost all of your balance is money you put in.')).toBeVisible()
  await page.goto('/story?scenario=brand-new')
  await expect(page.getByText('Growth needs years. Starting early')).toBeVisible()
  await expect(page.getByText('Right now, almost all')).toHaveCount(0)
})

// Phase 3: nothing makes the page scroll sideways on a phone (tables scroll inside their own box).
test('no page is wider than a 390px phone, including Practice with a holding', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const wide: string[] = []
  for (const path of ['/', '/alerts', '/alerts/sipc-crypto', '/activity', '/funds', '/funds/AAPL', '/funds/BTC', '/story', '/learn', '/learn/sipc-protection', '/nope', '/?scenario=brand-new']) {
    await page.goto(path)
    await page.locator('main').waitFor()
    const w = await page.evaluate(() => document.documentElement.scrollWidth)
    if (w > 390) wide.push(`${path}: ${w}px`)
  }
  await page.goto('/practice')
  await page.getByRole('radio', { name: /AAPL/ }).check()
  for (const k of ['2', '0', '0']) await page.getByRole('button', { name: k, exact: true }).click()
  await page.getByRole('button', { name: 'Review' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Confirm' }).click()
  await expect(page.locator('.practice__table')).toBeVisible()
  const w = await page.evaluate(() => document.documentElement.scrollWidth)
  if (w > 390) wide.push(`/practice with a holding: ${w}px`)
  expect(wide).toEqual([])
})
