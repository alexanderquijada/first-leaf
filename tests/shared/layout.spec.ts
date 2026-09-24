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
    await expect(links).toHaveText(['Home', 'Activity', 'Funds', 'Your money story', 'Practice', 'Words'])
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

  test('the footer is not hidden behind the bottom tab bar', async ({ page }) => {
    await page.goto('/about')
    // Wait for the (lazily loaded) page, or the scroll lands before it has height.
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('About this demo')
    const about = page.locator('footer').getByRole('link', { name: 'About this demo' })
    const bar = page.locator('.fl-bottombar')
    await expect
      .poll(async () => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        const a = (await about.boundingBox())!
        const b = (await bar.boundingBox())!
        return b.y - (a.y + a.height)
      })
      .toBeGreaterThanOrEqual(0)
  })
})

test('every page has the disclaimer and a link to About this demo', async ({ page }) => {
  for (const path of ['/', '/story', '/practice', '/learn/expense-ratio', '/nope']) {
    await page.goto(path)
    await expect(page.locator('footer .fl-disclaimer')).toContainText('Nothing here is investment advice.')
    await expect(page.locator('footer').getByRole('link', { name: 'About this demo' })).toBeVisible()
  }
})

test('old case-study addresses redirect and keep the scenario', async ({ page }) => {
  const cases = [
    ['/p301', '/'],
    ['/p302', '/story'],
    ['/p303', '/'],
    ['/p301/funds/FL-GREEN', '/funds/FL-GREEN'],
    ['/p303/learn/expense-ratio', '/learn/expense-ratio'],
    ['/p303/attention', '/alerts'],
  ]
  for (const [from, to] of cases) {
    await page.goto(from!)
    await expect(page).toHaveURL(new RegExp(`${to!.replace(/\//g, '\\/')}$`))
  }
  await page.goto('/p301?scenario=all-clear')
  await expect(page).toHaveURL(/\/\?scenario=all-clear$/)
  await expect(page.locator('.fl-demo__button')).toContainText('Nothing needs you')
})

test('an unknown address shows the friendly 404 inside the app', async ({ page }) => {
  await page.goto('/no/such/page')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("We couldn't find that page.")
  await expect(nav(page)).toBeVisible()
  await page.getByRole('link', { name: 'Go to Home' }).click()
  await expect(page).toHaveURL(/\/$/)
})

test('About this demo explains Rosa, the scenarios and where each case study lives', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About this demo')
  await expect(page.getByText('Rosa is 26. She is a dental hygienist in Tucson, Arizona.')).toBeVisible()
  for (const h of ['P301 · Operational dashboard', 'P302 · Interactive data story', 'P303 · Mobile experience']) {
    await expect(page.getByRole('heading', { name: h })).toBeVisible()
  }
  await page.getByRole('link', { name: 'Nothing needs you' }).click()
  await expect(page).toHaveURL(/\/\?scenario=all-clear$/)
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
  await expect(page.getByText('Right now, almost all of Rosa\'s balance is money she put in.')).toBeVisible()
  await page.goto('/story?scenario=brand-new')
  await expect(page.getByText('Growth needs years, so starting early')).toBeVisible()
  await expect(page.getByText('Right now, almost all')).toHaveCount(0)
})
