import { test, expect } from '../fixtures'
import { load } from '../data'

// Your Journey section 3, "Start early": Nia and Theo, Theo's two sliders, one chart of both.
// Expected values use the validator's own formula (rule T1), computed here independently.
const story = load('story-p302')
const nia = story.savers.find((s: { id: string }) => s.id === 'nia')
const theo = story.savers.find((s: { id: string }) => s.id === 'theo')
const whole = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
function proj(startAge: number, monthly: number) {
  const i = story.assumptions.annualRate / 12
  let v = 0
  for (let m = 0; m < (story.assumptions.endAge - startAge) * 12; m++) v = v * (1 + i) + monthly
  return v
}
const result = (age: number, monthly: number) =>
  `At 65, Theo has ${whole(proj(age, monthly))}. Nia has ${whole(nia.final.value)}. ${proj(age, monthly) >= nia.final.value ? 'Theo passes Nia.' : 'Theo is still behind.'}`

test('section 3 meets Nia and Theo, names compounding and gives the rate note', async ({ page }) => {
  await page.goto('/story#section-3')
  const p = page.getByRole('tabpanel')
  await expect(p.getByRole('heading', { level: 2 })).toHaveText('Start early')
  await expect(p).toContainText('Nia starts at 22 with $100 a month. Theo starts at 32 with $150.')
  await expect(p).toContainText('Nia puts in less, but her money has 10 more years of compounding.')
  await p.getByRole('button', { name: 'compounding', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Compounding' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(p.locator('.section__note')).toHaveText(story.assumptions.note)
  expect(story.assumptions.note).toBe('An example rate of 6% a year. Real markets go up and down, and nobody can promise a rate.')
  await expect(p.getByTestId('start-early-result')).toHaveText(result(theo.startAge, theo.monthly))
  await expect(p.getByRole('heading', { level: 3 })).toHaveText('Nia and Theo from 18 to 65')
  await expect(p.locator('canvas')).toHaveAttribute('data-x-last', '65')
})

test("Theo's monthly slider moves by keyboard: $195 is not enough, $196 passes Nia", async ({ page }) => {
  expect(proj(theo.startAge, 196)).toBeGreaterThanOrEqual(nia.final.value)
  expect(proj(theo.startAge, 195)).toBeLessThan(nia.final.value)
  await page.goto('/story#section-3')
  const p = page.getByRole('tabpanel')
  const slider = p.getByRole('slider', { name: /^Theo each month/ })
  const out = p.getByTestId('start-early-result')
  await expect(p.locator('.slider__mark-label')).toHaveText('Passes Nia: $196')
  const theoLast = async () => JSON.parse((await p.locator('[data-series]').getAttribute('data-series'))!)[1].at(-1) as number
  const before = await theoLast()
  await slider.focus()
  for (let i = 0; i < 195 - theo.monthly; i++) await page.keyboard.press('ArrowRight')
  await expect(slider).toHaveAttribute('aria-valuetext', '$195 a month')
  await expect(out).toHaveText(result(theo.startAge, 195))
  await expect(out).toContainText('Theo is still behind.')
  await page.keyboard.press('ArrowRight')
  await expect(slider).toHaveAttribute('aria-valuetext', '$196 a month')
  await expect(out).toHaveText(result(theo.startAge, 196))
  await expect(out).toContainText('Theo passes Nia.')
  // The chart's Theo line rises with his amount.
  expect(await theoLast()).toBeGreaterThan(before)
})

test("Theo's start-age slider moves by keyboard and uses the formula", async ({ page }) => {
  await page.goto('/story#section-3')
  const p = page.getByRole('tabpanel')
  const age = p.getByRole('slider', { name: /^Theo's start age/ })
  await expect(age).toHaveAttribute('aria-valuetext', `Start at ${theo.startAge}`)
  await age.focus()
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await expect(age).toHaveAttribute('aria-valuetext', `Start at ${theo.startAge - 2}`)
  await expect(p.getByTestId('start-early-result')).toHaveText(result(theo.startAge - 2, theo.monthly))
  // The "passes Nia at $196" mark is true only when Theo starts at 32, so it goes away.
  await expect(p.locator('.slider__mark-label')).toHaveCount(0)
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await expect(p.locator('.slider__mark-label')).toHaveText('Passes Nia: $196')
})
