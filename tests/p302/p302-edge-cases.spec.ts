import { test, expect } from '../fixtures'
import { load } from '../data'

// Phase 4: the P302 brief's "Edge cases" table, one test per row.
const story = load('story-p302')
const nia = story.savers[0], theo = story.savers[1]
const whole = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
function proj(startAge: number, monthly: number) {
  const i = story.assumptions.annualRate / 12
  let v = 0
  for (let m = 0; m < (story.assumptions.endAge - startAge) * 12; m++) v = v * (1 + i) + monthly
  return v
}

test('every slider at both ends keeps its sentences true', async ({ page }) => {
  await page.goto('/story#chapter-5')
  await page.getByRole('button', { name: 'Show the answer' }).click() // later steps wait for a guess or this (5a)
  const ch = page.locator('#chapter-5')
  const age = page.getByRole('slider', { name: /^Start age/ }).first()
  await age.focus()
  await page.keyboard.press('Home')
  await expect(age).toHaveAttribute('aria-valuetext', `Start at ${story.startAgeSlider.min}`)
  await expect(ch).toContainText(`Start at ${story.startAgeSlider.min}. At 65 you would have ${whole(proj(story.startAgeSlider.min, 100))}.`)
  await expect(ch).not.toContainText('fewer years to grow')
  await page.keyboard.press('End')
  await expect(age).toHaveAttribute('aria-valuetext', `Start at ${story.startAgeSlider.max}`)
  await expect(ch).toContainText(`Start at ${story.startAgeSlider.max}. At 65 you would have ${whole(proj(story.startAgeSlider.max, 100))}.`)
  await expect(ch).toContainText('Starting at 45 still helps. It just has fewer years to grow.')

  // Theo at his lowest and at $300 a month.
  const theoSlider = page.getByRole('slider', { name: /^Theo each month/ })
  const out = page.getByTestId('catch-up')
  await theoSlider.focus()
  await page.keyboard.press('Home')
  await expect(theoSlider).toHaveAttribute('aria-valuetext', `$${story.catchUp.slider.min} a month`)
  await expect(out).toContainText('Theo is still behind.')
  await page.keyboard.press('End')
  await expect(theoSlider).toHaveAttribute('aria-valuetext', '$300 a month')
  await expect(out).toContainText(`At $300 a month, Theo ends with ${whole(proj(theo.startAge, 300))}. Nia ends with ${whole(nia.final.value)}.`)
  await expect(out).toContainText('Theo passes Nia.')
})

test('with no guess made, the reply is neutral', async ({ page }) => {
  await page.goto('/story#chapter-5')
  const ch = page.locator('#chapter-5')
  await expect(ch.getByRole('group', { name: 'Your guess' }).getByRole('button', { pressed: true })).toHaveCount(0)
  // The answer stays hidden until a guess or "Show the answer" (5a).
  await expect(ch).not.toContainText(`At 65, Nia has ${whole(nia.final.value)}.`)
  await expect(ch.getByRole('heading', { name: 'Nia and Theo from 22 to 65' })).toHaveCount(0)
  await ch.getByRole('button', { name: 'Show the answer' }).click()
  await expect(ch.getByRole('button', { name: 'Show the answer' })).toHaveCount(0)
  await expect(ch).toContainText(`Here is how it turns out. At 65, Nia has ${whole(nia.final.value)}.`)
  await expect(ch).not.toContainText('You got it.')
  await expect(ch).not.toContainText('better guess')
})

for (const width of [390, 1280]) {
  test.describe(`deep links at ${width}px`, () => {
    test.use({ viewport: { width, height: width < 600 ? 844 : 800 } })

    test('#chapter-1 to #chapter-6 each land on their chapter, below the top bar', async ({ page }) => {
      for (let n = 1; n <= 6; n++) {
        await page.goto(`/story#chapter-${n}`)
        const h = page.locator(`#chapter-${n}-title`)
        await expect(h).toBeInViewport()
        const top = (await h.boundingBox())!.y
        const bar = (await page.locator('.fl-topbar').boundingBox())!
        expect(top, `chapter ${n}`).toBeGreaterThanOrEqual(bar.y + bar.height)
      }
    })

    test('#chapter-7 and #chapter-8 do not exist, so the story opens at its top', async ({ page }) => {
      for (const n of [7, 8]) {
        await page.goto(`/story#chapter-${n}`)
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your money story')
        await expect(page.getByRole('heading', { level: 1 })).toBeInViewport()
        expect(await page.evaluate(() => window.scrollY)).toBe(0)
      }
    })
  })
}

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('nothing moves: no chart animation, no smooth scrolling, and nothing is lost', async ({ page }) => {
    await page.goto('/story#chapter-3')
    await expect(page.locator('#chapter-3-title')).toBeInViewport()
    // Charts draw at once, and the page jumps instead of gliding.
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto')
    expect(await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length)).toBe(0)
    // The events can still be shown and read without any motion.
    const ch3 = page.locator('#chapter-3')
    await expect(ch3.getByRole('list', { name: 'Events on the chart' })).toBeVisible()
    await ch3.getByRole('button', { name: 'Show as table' }).first().click()
    await expect(ch3.getByRole('table').first()).toBeVisible()
    expect(await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length)).toBe(0)
  })
})

test.describe('phone in landscape (844×390)', () => {
  test.use({ viewport: { width: 844, height: 390 } })

  test('charts sit inline, text never sits on a chart, and nothing scrolls sideways', async ({ page }) => {
    await page.goto('/story')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your money story')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(844)
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
    expect(overlaps).toEqual([])
  })
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
