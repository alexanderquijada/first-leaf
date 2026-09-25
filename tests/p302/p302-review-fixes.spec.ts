import { test, expect } from '../fixtures'
import { load } from '../data'

// Phase 5: what the P302 reviewer found missing, each now a test.
const story = load('story-p302')
const claim = (id: string) => story.claims.find((c: { id: string }) => c.id === id).text

test.describe('at 1280px', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('each chapter chart sits beside its text and stays pinned while the chapter scrolls', async ({ page }) => {
    await page.goto('/story')
    for (const n of [1, 2, 3, 4]) {
      const ch = page.locator(`#chapter-${n}`)
      const text = (await ch.locator('h2').boundingBox())!
      const chart = (await ch.locator('> .fl-chart').boundingBox())!
      expect(chart.x, `chapter ${n}`).toBeGreaterThan(text.x + text.width / 2)
      expect(await ch.locator('> .fl-chart').evaluate((e) => getComputedStyle(e).position)).toBe('sticky')
    }
    // Chapter 5 pairs each step with its own chart, beside it (after the guess).
    await page.locator('#chapter-5').getByRole('button', { name: 'Show the answer' }).click()
    const steps = page.locator('#chapter-5 .k5__step')
    await expect(steps).toHaveCount(6)
  })

  test('the time range sets the chart title, and each toggle says what the chart now shows', async ({ page }) => {
    await page.goto('/story')
    const ch1 = page.locator('#chapter-1')
    await expect(ch1.getByRole('heading', { level: 3 })).toHaveText('Your balance since March')
    await ch1.getByRole('button', { name: '1 month' }).click()
    await expect(ch1.getByRole('heading', { level: 3 })).toHaveText('Your balance in the last month')
    await expect(ch1.locator('.fl-chart__summary')).toContainText('The flat layer is what you put in')
    await ch1.getByRole('button', { name: 'Show what you put in and what it earned' }).click()
    await expect(ch1.locator('.fl-chart__summary')).toContainText('The chart shows your balance as one line.')
    const ch3 = page.locator('#chapter-3')
    await expect(ch3.locator('.fl-chart__summary')).toContainText('A diamond marks each event')
    await ch3.getByRole('button', { name: 'Show events on the chart' }).click()
    await expect(ch3.locator('.fl-chart__summary')).toContainText('The chart shows your balance without the events.')
  })
})

test('chapter 5 has a chart for every step, and the sliders move their lines', async ({ page }) => {
  await page.goto('/story#chapter-5')
  const ch = page.locator('#chapter-5')
  await ch.getByRole('group', { name: 'Your guess' }).getByRole('button', { name: 'Nia' }).click()
  for (const t of ['Nia and Theo from 22 to 65', 'What Nia put in, and what it grew into', 'One saver at $100 a month, from 22 to 65', 'Smooth years', 'Your money from 26 to 65'])
    await expect(ch.getByRole('heading', { name: t })).toBeVisible()
  // 5d: the one saver's line starts at the slider's age.
  const age = ch.getByRole('slider', { name: /^Start age/ }).first()
  await age.focus()
  await page.keyboard.press('End')
  await expect(ch.getByRole('heading', { name: 'One saver at $100 a month, from 45 to 65' })).toBeVisible()
  // 5e: Theo's line on the catch-up chart rises with his amount.
  const catchChart = ch.locator('.k5__step', { has: page.getByRole('slider', { name: /^Theo each month/ }) }).locator('[data-series]')
  const before = JSON.parse((await catchChart.getAttribute('data-series'))!)[1].at(-1)
  await ch.getByRole('slider', { name: /^Theo each month/ }).focus()
  await page.keyboard.press('End')
  await expect.poll(async () => JSON.parse((await catchChart.getAttribute('data-series'))!)[1].at(-1)).toBeGreaterThan(before)
})

test('the story closes with a takeaway, its words as chips, and the sources', async ({ page }) => {
  await page.goto('/story')
  const end = page.locator('.story__closing')
  await expect(end.getByRole('heading', { level: 2 })).toHaveText('What to take away')
  for (const line of [story.pointOfView, claim('early-ends-ahead'), claim('early-ahead-when-bumpy')]) await expect(end).toContainText(line)
  await expect(end.getByRole('region', { name: 'Words on this screen' }).locator('.fl-termtip__button')).toHaveText(['Growth on growth', 'Return', 'The market'])
  await expect(end).toContainText(story.assumptions.note)
  await expect(end).toContainText('Powered by CoinGecko API')
})

test('before a guess, nothing in chapter 5 gives the answer away', async ({ page }) => {
  await page.goto('/story#chapter-5')
  const ch = page.locator('#chapter-5')
  await expect(ch.getByRole('button', { name: 'Show the answer' })).toBeVisible()
  for (const hidden of ['Why Nia ends ahead', 'Every year counts', 'Can Theo catch up?', 'Real life is bumpy', 'Your turn'])
    await expect(ch.getByRole('heading', { name: hidden })).toHaveCount(0)
  await expect(ch).not.toContainText('Nia ends')
  await ch.getByRole('group', { name: 'Your guess' }).getByRole('button', { name: 'Theo' }).click()
  await expect(ch.getByRole('heading', { name: 'Why Nia ends ahead' })).toBeVisible()
  await expect(ch.getByRole('heading', { name: 'Your turn' })).toBeVisible()
})

test('chart axes end on their last label (65), and the stacked areas start at zero', async ({ page }) => {
  await page.goto('/story#chapter-5')
  await page.getByRole('button', { name: 'Show the answer' }).click()
  const first = page.locator('#chapter-5 .k5__step').first().locator('canvas')
  await expect(first).toHaveAttribute('data-x-last', '65')
  await page.goto('/story#chapter-1')
  await expect(page.locator('#chapter-1 canvas')).toHaveAttribute('data-y-min', '0')
  // With the layers off it is a single line, so the axis may start near the data.
  await page.locator('#chapter-1').getByRole('button', { name: 'Show what you put in and what it earned' }).click()
  await expect(page.locator('#chapter-1 canvas')).not.toHaveAttribute('data-y-min', '0')
})

test('a small cash share is never shown as 0%', async ({ page }) => {
  await page.goto('/story?scenario=all-clear#chapter-4')
  const ch4 = page.locator('#chapter-4')
  await ch4.getByRole('group', { name: 'Show' }).getByRole('button', { name: 'Cash' }).click()
  await expect(ch4).toContainText('Cash is $2.48 of your balance, or 0.2%.')
  await expect(ch4.locator('.fl-gm')).not.toContainText(/(^|[^.\d])0% ·/)
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

test('balance charts end their axis on the last date', async ({ page }) => {
  await page.goto('/story#chapter-1')
  await expect(page.locator('#chapter-1 canvas')).toHaveAttribute('data-x-last', 'Sept. 18')
  await expect(page.locator('#chapter-3 canvas')).toHaveAttribute('data-x-last', 'Sept. 18')
})
