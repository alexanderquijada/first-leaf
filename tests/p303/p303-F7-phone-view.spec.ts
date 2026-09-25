import { test, expect } from '../fixtures'

// Phone view (P303 brief, Phase 4): at 600px and wider, /p303/… shows ONLY the phone:
// its own layout, no rail and no top bar, the frame centered and scaled so the page never
// scrolls, and "Back to full view" top left. Under 600px there is no frame.
const FRAME = 'iframe[title="First Leaf on a phone"]'

/** The page itself (not the phone's content) can't scroll either way. */
async function pageScroll(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const d = document.documentElement
    return { x: d.scrollWidth - d.clientWidth, y: d.scrollHeight - d.clientHeight }
  })
}

for (const [width, height] of [[1280, 800], [1440, 900], [1280, 720], [768, 1024]] as const) {
  test.describe(`at ${width}×${height}`, () => {
    test.use({ viewport: { width, height } })

    test('only the phone shows: no rail, no top bar, no page scroll, centered', async ({ page }) => {
      await page.goto('/p303')
      const phone = page.frameLocator(FRAME)
      await expect(phone.locator('.fl-bottombar')).toBeVisible()
      await expect(page.locator('.fl-rail')).toHaveCount(0)
      await expect(page.locator('.fl-topbar')).toHaveCount(0)
      await expect(page.locator('.fl-tabs')).toHaveCount(0)
      await expect(page.locator('main')).toHaveCount(0)
      expect(await pageScroll(page)).toEqual({ x: 0, y: 0 })
      // Centered both ways (to the pixel), inside the window, clear of the button.
      const box = (await page.locator('.fl-phoneview__stage').boundingBox())!
      expect(Math.abs(box.x + box.width / 2 - width / 2)).toBeLessThanOrEqual(1)
      expect(Math.abs(box.y + box.height / 2 - height / 2)).toBeLessThanOrEqual(1)
      expect(box.y).toBeGreaterThanOrEqual(0)
      expect(box.y + box.height).toBeLessThanOrEqual(height)
      const back = (await page.getByRole('button', { name: 'Back to full view' }).boundingBox())!
      expect(back.x + back.width <= box.x || back.y + back.height <= box.y).toBe(true)
      // The screen inside is the real 390 × 844 phone layout, whatever the scale.
      const inner = await page.locator(FRAME).evaluate((f: HTMLIFrameElement) => [f.contentWindow!.innerWidth, f.contentWindow!.innerHeight])
      expect(inner).toEqual([390, 844])
    })
  })
}

test.describe('at 1280px', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('Phone view in the top bar opens this page; Back to full view returns to it', async ({ page }) => {
    await page.goto('/funds/AAPL?scenario=all-clear')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('AAPL')
    await page.locator('.fl-topbar').getByRole('link', { name: 'Phone view' }).click()
    await expect(page).toHaveURL(/\/p303\/funds\/AAPL\?scenario=all-clear$/)
    const phone = page.frameLocator(FRAME)
    await expect(phone.getByRole('heading', { level: 1 })).toContainText('AAPL')
    expect(await page.locator(FRAME).getAttribute('src')).toContain('scenario=all-clear')
    // Moving around inside the phone doesn't change where Back goes.
    await phone.locator('.fl-bottombar').getByRole('link', { name: 'Story' }).click()
    await expect(page).toHaveURL(/\/p303\/story\?scenario=all-clear$/)
    await page.getByRole('button', { name: 'Back to full view' }).click()
    await expect(page).toHaveURL(/\/funds\/AAPL\?scenario=all-clear$/)
    await expect(page.locator('.fl-rail')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('AAPL')
  })

  test('arriving at /p303 directly, Back to full view goes to laptop Home', async ({ page }) => {
    await page.goto('/p303/story?scenario=brand-new')
    await expect(page.frameLocator(FRAME).getByText('Growth needs years. Starting early')).toBeVisible()
    await page.getByRole('button', { name: 'Back to full view' }).click()
    await expect(page).toHaveURL(/\/\?scenario=brand-new$/)
    await expect(page.locator('.fl-rail')).toBeVisible()
  })

  test('focus starts inside the phone; the keyboard reaches the button, then the phone', async ({ page }) => {
    await page.goto('/p303')
    const frame = page.locator(FRAME)
    await expect(page.frameLocator(FRAME).locator('.fl-bottombar')).toBeVisible()
    await expect(frame).toBeFocused()
    // From the top of the page: the button first, then into the phone (its skip link).
    await page.getByRole('button', { name: 'Back to full view' }).focus()
    await page.keyboard.press('Tab')
    await expect(frame).toBeFocused()
    await expect(page.frameLocator(FRAME).getByRole('link', { name: 'Skip to content' })).toBeFocused()
  })

  test('the frame is decorative: the page shows only the button and the phone', async ({ page }) => {
    await page.goto('/p303/activity')
    const phone = page.frameLocator(FRAME)
    await expect(phone.getByRole('heading', { level: 1 })).toHaveText('Activity')
    // The window title follows the page inside the phone.
    await expect(page).toHaveTitle('Activity · First Leaf')
    const tree = await page.locator('body').ariaSnapshot()
    expect(tree).toContain('button "Back to full view"')
    expect(tree).not.toMatch(/heading|img|text:/)
    // The phone keeps its own landmarks and headings.
    await expect(phone.getByRole('main')).toHaveCount(1)
    await expect(phone.getByRole('navigation', { name: 'Main' })).toHaveCount(1)
  })

  test('the frame edge stands out from the background (at least 3:1)', async ({ page }) => {
    await page.goto('/p303')
    await expect(page.locator('.fl-phoneview__device')).toBeVisible()
    const [edge, bg] = await page.evaluate(() => [
      getComputedStyle(document.querySelector('.fl-phoneview__device')!).backgroundColor,
      getComputedStyle(document.querySelector('.fl-phoneview')!).backgroundColor,
    ])
    const lum = (c: string) => {
      const [r, g, b] = c.match(/\d+/g)!.slice(0, 3).map((v) => {
        const s = Number(v) / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
    }
    const [hi, lo] = [lum(edge!), lum(bg!)].sort((a, b) => b - a)
    expect((hi! + 0.05) / (lo! + 0.05)).toBeGreaterThanOrEqual(3)
  })

  test('old ?view=phone links and Phase 0 phone addresses open phone view', async ({ page }) => {
    await page.goto('/story?view=phone&scenario=all-clear')
    await expect(page).toHaveURL(/\/p303\/story\?scenario=all-clear$/)
    await page.goto('/p303/attention')
    await expect(page).toHaveURL(/\/p303\/alerts$/)
    await expect(page.frameLocator(FRAME).getByRole('heading', { level: 1 })).toHaveText('Alerts')
  })

  test('the app inside the frame never shows Phone view or a nested frame', async ({ page }) => {
    await page.goto('/p303')
    const phone = page.frameLocator(FRAME)
    await expect(phone.locator('.fl-bottombar')).toBeVisible()
    await expect(phone.locator('.fl-pp-toggle')).toHaveCount(0)
    await expect(phone.locator('iframe')).toHaveCount(0)
    // Even an embedded page opened at full width doesn't offer or nest one.
    await page.goto('/p303?embed=phone')
    await expect(page.locator('.fl-pp-toggle')).toHaveCount(0)
    await expect(page.locator('iframe')).toHaveCount(0)
  })
})

test.describe('at 390px', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('there is no frame: /p303/… opens the page itself, and Phone view is hidden', async ({ page }) => {
    await page.goto('/p303/story?scenario=brand-new')
    await expect(page).toHaveURL(/\/story\?scenario=brand-new$/)
    await expect(page.locator('iframe')).toHaveCount(0)
    await expect(page.locator('.fl-bottombar')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Phone view' })).toHaveCount(0)
    await page.goto('/?view=phone')
    await expect(page.locator('iframe')).toHaveCount(0)
    await expect(page.locator('.fl-bottombar')).toBeVisible()
  })
})
