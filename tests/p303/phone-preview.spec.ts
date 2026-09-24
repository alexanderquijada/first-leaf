import { test, expect } from '../fixtures'

// Phone preview (P303 brief): the real app in a 390 × 844 frame, for reviewers on a laptop.
const FRAME = 'iframe[title="First Leaf on a phone"]'

test.describe('at 1280px', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('the toggle opens and closes the preview, moving focus in and back', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Phone view' })
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await expect(page).toHaveURL(/view=phone/)
    const frame = page.locator(FRAME)
    await expect(frame).toBeVisible()
    await expect(frame).toBeFocused()
    await page.getByRole('button', { name: 'Back to full view' }).click()
    await expect(frame).toHaveCount(0)
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await expect(toggle).toBeFocused()
    await expect(page).not.toHaveURL(/view=phone/)
  })

  test('Esc inside the frame closes the preview', async ({ page }) => {
    await page.goto('/?view=phone')
    const frame = page.locator(FRAME)
    await expect(page.frameLocator(FRAME).locator('.fl-bottombar')).toBeVisible()
    await frame.focus()
    await page.frameLocator(FRAME).locator('body').press('Escape')
    await expect(frame).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Phone view' })).toBeFocused()
  })

  test('?view=phone opens it on the phone Home with the bottom tab bar', async ({ page }) => {
    await page.goto('/?view=phone')
    const phone = page.frameLocator(FRAME)
    await expect(phone.getByRole('heading', { level: 1 })).toHaveText('Home')
    const bar = phone.locator('.fl-bottombar')
    await expect(bar).toBeVisible()
    await expect(bar.getByRole('link')).toHaveText(['Home', 'Activity', 'Story', 'Practice', 'Words'])
    await expect(phone.locator('.fl-rail')).toBeHidden()
    // The frame's screen is 390 × 844 CSS px, whatever it is scaled to.
    const size = await page.locator(FRAME).evaluate((f: HTMLIFrameElement) => [f.width, f.height, f.contentWindow!.innerWidth])
    expect(size).toEqual(['390', '844', 390])
  })

  test('it opens on the current page and scenario, and follows the full view', async ({ page }) => {
    await page.goto('/story?scenario=brand-new&view=phone')
    const phone = page.frameLocator(FRAME)
    await expect(phone.getByRole('heading', { level: 1 })).toHaveText('Your money story')
    // The brand-new account has no history, so the story states only the general point of view.
    await expect(phone.getByText('Growth needs years. Starting early')).toBeVisible()
    await expect(phone.getByText('Right now, almost all')).toHaveCount(0)
    expect(await page.locator(FRAME).getAttribute('src')).toContain('scenario=brand-new')
    // Moving in the full view keeps the preview open and moves the phone too.
    await page.locator('.fl-rail').getByRole('link', { name: 'Activity' }).click()
    await expect(page).toHaveURL(/\/activity\?.*view=phone/)
    await expect(phone.getByRole('heading', { level: 1 })).toHaveText('Activity')
  })

  test('the app inside the frame never shows a toggle or a nested preview', async ({ page }) => {
    await page.goto('/?view=phone')
    const phone = page.frameLocator(FRAME)
    await expect(phone.locator('.fl-bottombar')).toBeVisible()
    await expect(phone.locator('.fl-pp-toggle')).toHaveCount(0)
    await expect(phone.locator('iframe')).toHaveCount(0)
    // Even an embedded page asked for a preview, at full width, doesn't nest one.
    await page.goto('/?embed=phone&view=phone')
    await expect(page.locator('.fl-pp-toggle')).toHaveCount(0)
    await expect(page.locator('iframe')).toHaveCount(0)
  })
})

test.describe('at 768px', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test('the frame scales down to fit the window height, with the 390px layout inside', async ({ page }) => {
    await page.goto('/?view=phone')
    await expect(page.frameLocator(FRAME).locator('.fl-bottombar')).toBeVisible()
    const box = (await page.locator('.fl-pp__stage').boundingBox())!
    expect(box.y + box.height).toBeLessThanOrEqual(1024)
    const inner = await page.locator(FRAME).evaluate((f: HTMLIFrameElement) => f.contentWindow!.innerWidth)
    expect(inner).toBe(390)
  })
})

test.describe('at 390px', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('the toggle is hidden, and ?view=phone just shows the app', async ({ page }) => {
    await page.goto('/?view=phone')
    await expect(page.getByRole('button', { name: 'Phone view' })).toBeHidden()
    await expect(page.locator('iframe')).toHaveCount(0)
    await expect(page.locator('.fl-bottombar')).toBeVisible()
  })
})
