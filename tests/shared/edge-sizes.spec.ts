import type { Page } from '@playwright/test'
import { test, expect } from '../fixtures'

// Phase 4: every page at every screen size (BRIEF.md §10), at 200% zoom, and by keyboard.
// 200% zoom on a 1280 × 800 laptop is a 640 × 400 CSS window; on a 768 tablet it is 384 × 512.
const PAGES = ['/', '/alerts', '/alerts/deposit-returned', '/alerts/sipc-crypto', '/activity', '/activity/rosa-starter-035', '/funds', '/funds/AAPL', '/funds/BTC', '/story', '/practice', '/learn', '/learn/sipc-protection', '/nope']
const SCENARIO_PAGES = ['/', '/alerts', '/activity', '/funds', '/story', '/practice'].flatMap((p) => [`${p}?scenario=all-clear`, `${p}?scenario=brand-new`])
const ALL = [...PAGES, ...SCENARIO_PAGES]

const SIZES = [
  { name: 'a 320px phone', width: 320, height: 640 },
  { name: 'a 390px phone', width: 390, height: 844 },
  { name: 'a phone in landscape', width: 844, height: 390 },
  { name: 'a 768px tablet at 200% zoom', width: 384, height: 512 },
  { name: 'a 768px tablet', width: 768, height: 1024 },
  { name: 'a 1280px laptop at 200% zoom', width: 640, height: 400 },
  { name: 'a 1280px laptop', width: 1280, height: 800 },
]

/** Controls smaller than the minimum. Under 600px a standalone control needs 48 × 48 (P303);
 * elsewhere 24 × 24 (WCAG 2.5.8). A word explained inside running text uses 2.5.8's inline
 * exception (and every phone detail screen lists its words again as 48px chips). */
async function smallTargets(page: Page, width: number) {
  return page.evaluate((width) => {
    const min = width < 600 ? 48 : 24
    const out: string[] = []
    for (const el of document.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [role="button"], [role="tab"], [tabindex="0"]')) {
      if (el.closest('.fl-visually-hidden, [aria-hidden="true"]') || el.classList.contains('fl-skip')) continue
      // A radio or checkbox is hit through its label.
      const box = (el.matches('input[type=radio], input[type=checkbox]') && el.closest('label') ? el.closest('label')! : el).getBoundingClientRect()
      if (!box.width || !box.height || getComputedStyle(el).visibility === 'hidden') continue
      // Inside running text only: a term that is the whole label or heading is a standalone control.
      const block = el.closest('p, li, dd, dt, td, th, h1, h2, h3, h4')
      const alone = !!block && block.textContent!.trim() === el.textContent!.trim()
      const inText = !!block && !alone && getComputedStyle(el).display.startsWith('inline') && !el.closest('.fl-words, [class*="__words"], [class*="chips"]')
      if (inText && width < 600 && box.height >= 24) continue
      if (box.width < min || box.height < min) out.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(box.width)}×${Math.round(box.height)}`)
    }
    return [...new Set(out)]
  }, width)
}

for (const size of SIZES) {
  test.describe(`on ${size.name} (${size.width}×${size.height})`, () => {
    test.use({ viewport: { width: size.width, height: size.height } })

    test('no page scrolls sideways (tables scroll inside their own box)', async ({ page }) => {
      const wide: string[] = []
      for (const path of ALL) {
        await page.goto(path)
        await page.locator('main').waitFor()
        const w = await page.evaluate(() => document.documentElement.scrollWidth)
        if (w > size.width) wide.push(`${path}: ${w}px`)
      }
      expect(wide).toEqual([])
    })

    test(`every control is at least ${size.width < 600 ? 48 : 24}px`, async ({ page }) => {
      const small: string[] = []
      for (const path of ALL) {
        await page.goto(path)
        await page.locator('main').waitFor()
        for (const s of await smallTargets(page, size.width)) small.push(`${path}: ${s}`)
      }
      expect(small).toEqual([])
    })
  })
}

// Keyboard only: every stop on the way through a page shows a focus ring.
for (const size of [SIZES[1]!, SIZES[6]!]) {
  test.describe(`keyboard on ${size.name}`, () => {
    test.use({ viewport: { width: size.width, height: size.height } })

    test('every focus stop has a visible focus ring', async ({ page }) => {
      const missing: string[] = []
      for (const path of ['/', '/alerts', '/activity', '/funds/AAPL', '/story', '/practice', '/learn']) {
        await page.goto(path)
        await page.locator('main').waitFor()
        for (let i = 0; i < 40; i++) {
          await page.keyboard.press('Tab')
          const r = await page.evaluate(() => {
            const el = document.activeElement as HTMLElement | null
            if (!el || el === document.body) return null
            const cs = getComputedStyle(el)
            const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2) || cs.boxShadow !== 'none'
            return { ring, name: `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)}"` }
          })
          if (r && !r.ring) missing.push(`${path}: ${r.name}`)
        }
      }
      expect([...new Set(missing)]).toEqual([])
    })
  })
}

// Large text: the phone's text size set to 200% (the root font doubled), not only a zoomed
// window. Cards grow taller, never wider, and nothing is cut off (P303 edge cases).
for (const width of [390, 320]) {
  test.describe(`at 200% text size on a ${width}px phone`, () => {
    test.use({ viewport: { width, height: 844 } })

    test('no page scrolls sideways', async ({ page }) => {
      const wide: string[] = []
      for (const path of ALL) {
        await page.goto(path)
        await page.locator('main').waitFor()
        await page.evaluate(() => (document.documentElement.style.fontSize = '200%'))
        await page.waitForTimeout(1000) // let charts and fonts settle at the new size
        const w = await page.evaluate(() => document.documentElement.scrollWidth)
        if (w > width) wide.push(`${path}: ${w}px`)
      }
      expect(wide).toEqual([])
    })
  })
}
