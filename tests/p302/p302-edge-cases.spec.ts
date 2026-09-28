import { test, expect } from '../fixtures'
import { load } from '../data'

// The P302 brief's "Edge cases", one test per row (Your Journey, Phase 6).
const story = load('story-p302')
const nia = story.savers.find((s: { id: string }) => s.id === 'nia')
const whole = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
function proj(startAge: number, monthly: number) {
  const i = story.assumptions.annualRate / 12
  let v = 0
  for (let m = 0; m < (story.assumptions.endAge - startAge) * 12; m++) v = v * (1 + i) + monthly
  return v
}
const result = (age: number, monthly: number) =>
  `At 65, Theo has ${whole(proj(age, monthly))}. Nia has ${whole(nia.final.value)}. ${proj(age, monthly) >= nia.final.value ? 'Theo passes Nia.' : 'Theo is still behind.'}`

test("every slider at both ends keeps section 3's sentence true", async ({ page }) => {
  await page.goto('/story#section-3')
  const p = page.getByRole('tabpanel')
  const age = p.getByRole('slider', { name: /^Theo's start age/ })
  const monthly = p.getByRole('slider', { name: /^Theo each month/ })
  const out = p.getByTestId('start-early-result')
  const { min: aMin, max: aMax } = story.startAgeSlider
  const { min: mMin, max: mMax } = story.catchUp.slider
  for (const [ageKey, a] of [['Home', aMin], ['End', aMax]] as const) {
    await age.focus()
    await page.keyboard.press(ageKey)
    await expect(age).toHaveAttribute('aria-valuetext', `Start at ${a}`)
    for (const [mKey, m] of [['Home', mMin], ['End', mMax]] as const) {
      await monthly.focus()
      await page.keyboard.press(mKey)
      await expect(monthly).toHaveAttribute('aria-valuetext', `$${m} a month`)
      await expect(out, `start at ${a}, $${m} a month`).toHaveText(result(a, m))
    }
  }
})

test.describe('phone in landscape (844×390)', () => {
  test.use({ viewport: { width: 844, height: 390 } })

  test('charts sit inline, text never sits on a chart, and nothing scrolls sideways', async ({ page }) => {
    await page.goto('/story')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your Journey')
    for (let n = 1; n <= 4; n++) {
      await page.getByRole('tab', { name: new RegExp(`^Section ${n}`) }).click()
      await expect(page.getByRole('tabpanel')).toHaveAttribute('id', `section-${n}`)
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `section ${n}`).toBeLessThanOrEqual(844)
      const overlaps = await page.evaluate(() => {
        const hit: string[] = []
        const texts = [...document.querySelectorAll('main p, main h2, main h3')]
        for (const c of document.querySelectorAll('main canvas')) {
          const a = c.getBoundingClientRect()
          for (const t of texts) {
            if (c.parentElement?.contains(t)) continue
            const b = t.getBoundingClientRect()
            if (b.width && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) hit.push(t.textContent!.slice(0, 40))
          }
        }
        return hit
      })
      expect(overlaps, `section ${n}`).toEqual([])
    }
  })
})

test('at 1280, each section chart sits beside its text', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/story')
  for (let n = 1; n <= 3; n++) {
    await page.getByRole('tab', { name: new RegExp(`^Section ${n}`) }).click()
    const p = page.getByRole('tabpanel')
    const text = (await p.locator('.section__claim').first().boundingBox())!
    const chart = (await p.locator('> .fl-chart').boundingBox())!
    expect(chart.x, `section ${n}`).toBeGreaterThanOrEqual(text.x + text.width)
  }
})

test('at 1280, nothing in what you own in Practice is cut off, and every value is labeled', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/practice')
  for (const [t, amt] of [['BTC', '200'], ['AAPL', '150']] as const) {
    await page.getByRole('radio', { name: new RegExp(t) }).check()
    await page.getByLabel('Amount in dollars').fill(amt)
    await page.getByRole('button', { name: 'Review' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByRole('button', { name: 'New order' }).click()
  }
  const cut = await page.evaluate(() => {
    const out: string[] = []
    for (const el of document.querySelectorAll<HTMLElement>('.practice__own *')) {
      if (el.closest('.fl-visually-hidden') || !el.offsetParent) continue
      if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'visible') out.push(`${el.className} scrolls sideways`)
    }
    return out
  })
  expect(cut).toEqual([])
  const rows = page.locator('.practice__table tbody tr:visible, .practice__stack > li:visible')
  await expect(rows).toHaveCount(2)
  for (const label of ['Owned', 'Value', 'Paid', 'Up or down']) await expect(rows.first()).toContainText(label)
})

test('an amount typed with "$" or a comma reviews as money, never "$NaN"', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/practice')
  for (const [typed, shown] of [['$200', '$200.00'], ['1,000', '$1,000.00']] as const) {
    await page.getByLabel('Amount in dollars').fill(typed)
    await page.getByRole('button', { name: 'Review' }).click()
    await expect(page.getByText(`Buy ${shown} of AAPL`)).toBeVisible()
    await expect(page.locator('main')).not.toContainText('NaN')
    await page.getByRole('button', { name: /Change|Back|Edit/ }).first().click()
  }
})
