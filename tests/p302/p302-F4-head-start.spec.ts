import { test, expect } from '../fixtures'
import { load } from '../data'

// Your Journey section 3, "Your head start" (Phase 6.1): Rosa's own money from 26 to 65, two ways.
// Expected values use the validator's own formula (rule T1), computed here independently.
const story = load('story-p302')
const hs = story.headStart
const account = load('account')
const whole = (n: number) => `$${Math.round(Math.round(n * 100) / 100).toLocaleString('en-US')}`
export function line(start: number, monthly: number, delayYears: number) {
  const i = story.assumptions.annualRate / 12
  let v = start
  for (let m = 0; m < (hs.endAge - hs.startAge) * 12; m++) v = v * (1 + i) + (m >= delayYears * 12 ? monthly : 0)
  return v
}
const keep = line(account.investedValue, hs.monthly, 0)
const result = (years: number, add: number) => `At 65: ${whole(keep)} if you keep going, ${whole(line(account.investedValue, add, years))} if you wait.`
const catchUp = (years: number) => hs.catchUp.find((c: { years: number }) => c.years === years).monthly as number | null

test('section 3 is about Rosa: her age, her $150, compounding, the rate note, and no one else', async ({ page }) => {
  await page.goto('/story#section-3')
  const p = page.getByRole('tabpanel')
  await expect(p.getByRole('heading', { level: 2 })).toHaveText('Your head start')
  await expect(p.locator('.section__claim').first()).toHaveText('You started at 26. If you keep adding $150 a month, here\'s where it could be at 65. Waiting means less time for compounding, so catching up costs more.')
  await p.getByRole('button', { name: 'compounding' }).click()
  await expect(page.getByRole('dialog', { name: 'Compounding' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(p.getByTestId('head-start-result')).toHaveText(result(5, 150))
  await expect(p.locator('.section__note')).toHaveText(story.assumptions.note)
  await expect(p).not.toContainText(/\bNia\b|\bTheo\b|you should|don't stop/i)
  // Both lines start from what she has invested today, and the keep-going line is the data's.
  const series = JSON.parse((await p.locator('[data-series]').getAttribute('data-series'))!) as number[][]
  expect(series[0]![0]).toBe(account.investedValue)
  expect(series[1]![0]).toBe(account.investedValue)
  expect(series[0]).toEqual(hs.accounts['rosa-starter'].keepGoing.map((y: { value: number }) => y.value))
  expect(series[1]).toEqual(hs.accounts['rosa-starter'].laterDefault.map((y: { value: number }) => y.value))
})

test('the catch-up amounts for 1, 5, 10 and 15 years are the smallest that meet the line at 65', ({}, info) => {
  const rows = [1, 5, 10, 15].map((y) => `${y} years: ${catchUp(y) === null ? 'none up to $300' : `$${catchUp(y)}`}`)
  info.annotations.push({ type: 'catch-up amounts', description: rows.join(' · ') })
  expect([catchUp(1), catchUp(5), catchUp(10), catchUp(15)]).toEqual([161, 211, 300, null])
  for (const y of [1, 5, 10]) {
    const m = catchUp(y)!
    expect(line(account.investedValue, m, y)).toBeGreaterThanOrEqual(keep)
    expect(line(account.investedValue, m - 1, y)).toBeLessThan(keep)
  }
  expect(line(account.investedValue, 300, 15)).toBeLessThan(keep)
})

test('"Start again in" and "Then add" move by keyboard; the marker and the sentence follow', async ({ page }) => {
  await page.goto('/story#section-3')
  const p = page.getByRole('tabpanel')
  const delay = p.getByRole('slider', { name: /^Start again in/ })
  const add = p.getByRole('slider', { name: /^Then add/ })
  const out = p.getByTestId('head-start-result')
  await expect(delay).toHaveAttribute('aria-valuetext', '5 years')
  await expect(p.locator('.slider__mark-label')).toHaveText('Catches up at $211 a month')
  await expect(add).toHaveAccessibleDescription('Catches up at $211 a month')
  // At $210 the later line is still short; at $211 it catches up.
  await add.focus()
  for (let k = 0; k < 60; k++) await page.keyboard.press('ArrowRight')
  await expect(add).toHaveAttribute('aria-valuetext', '$210 a month')
  await expect(out).toHaveText(result(5, 210))
  expect(line(account.investedValue, 210, 5)).toBeLessThan(keep)
  await page.keyboard.press('ArrowRight')
  await expect(out).toHaveText(result(5, 211))
  expect(line(account.investedValue, 211, 5)).toBeGreaterThanOrEqual(keep)
  // One year: the marker moves to $161.
  await delay.focus()
  await page.keyboard.press('Home')
  await expect(delay).toHaveAttribute('aria-valuetext', '1 year')
  await expect(p.locator('.slider__mark-label')).toHaveText('Catches up at $161 a month')
  // Fifteen years: nothing on the slider catches up, and the slider says so.
  await page.keyboard.press('End')
  await expect(delay).toHaveAttribute('aria-valuetext', '15 years')
  await expect(p.locator('.slider__mark-label')).toHaveCount(0)
  await expect(p.getByText('No amount up to $300 a month catches up.')).toBeVisible()
  await expect(add).toHaveAccessibleDescription('No amount up to $300 a month catches up.')
  await expect(out).toHaveText(result(15, 211))
})

test('the table and the dashed line match, and each line is named, not only colored', async ({ page }) => {
  await page.goto('/story#section-3')
  const p = page.getByRole('tabpanel')
  await expect(p.locator('.fl-series__key li')).toHaveText(['Keep going', 'Start again later'])
  const dashed = await p.locator('.fl-series__swatch').evaluateAll((els) => els.map((e) => getComputedStyle(e).borderTopStyle))
  expect(dashed).toEqual(['solid', 'dashed'])
  await p.getByRole('button', { name: 'Show as table' }).click()
  await expect(p.locator('thead th')).toHaveText(['Age', 'Keep going', 'Start again later'])
  const last = p.locator('tbody tr').last()
  await expect(last).toContainText('65')
  await expect(last).toContainText(whole(keep))
  await expect(last).toContainText(whole(line(account.investedValue, 150, 5)))
})

test('the brand-new account starts from $0, with "Start now" and "Start later"', async ({ page }) => {
  const hsNew = hs.accounts['rosa-new']
  await page.goto('/story?scenario=brand-new#section-3')
  const p = page.getByRole('tabpanel')
  await expect(p.locator('.section__claim').first()).toContainText("You're 26. If you add $150 a month from now")
  await expect(p.getByRole('slider', { name: /^Start in/ })).toBeVisible()
  await expect(p.locator('.fl-series__key li')).toHaveText(['Start now', 'Start later'])
  await expect(p.getByTestId('head-start-result')).toHaveText(`At 65: ${whole(hsNew.keepGoing.at(-1).value)} if you start now, ${whole(line(0, 150, 5))} if you wait.`)
})

// Phase 6 screenshot finding: a slider without a mark kept the mark's 32px band.
test('a slider without a mark has its end labels right under the track', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.goto('/story#section-3')
  const first = page.locator('.slider').first()
  const input = await first.locator('input[type=range]').boundingBox()
  const ends = await first.locator('.slider__ends').boundingBox()
  expect(ends!.y - (input!.y + input!.height), 'gap between the track and its end labels').toBeLessThanOrEqual(8)
})
