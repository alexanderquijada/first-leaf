import { test, expect } from '../fixtures'
import { load } from '../data'

// Chapter 5: the guess (F4), the sliders (F5) and smooth vs. bumpy (F6).
// Expected values use the validator's own formula (rule T1), computed here independently.
const story = load('story-p302')
const nia = story.savers[0], theo = story.savers[1]
const whole = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
function proj(startAge: number, monthly: number) {
  const i = story.assumptions.annualRate / 12
  let v = 0
  for (let m = 0; m < (story.assumptions.endAge - startAge) * 12; m++) v = v * (1 + i) + monthly
  return v
}

test('the guess is optional, and the reply depends on it', async ({ page }) => {
  await page.goto('/story#chapter-5')
  const ch = page.locator('#chapter-5')
  await expect(ch).toContainText(`Here is how it turns out. At 65, Nia has ${whole(nia.final.value)}. Theo has ${whole(theo.final.value)}.`)
  await ch.getByRole('group', { name: 'Your guess' }).getByRole('button', { name: 'Theo' }).click()
  await expect(ch).toContainText('Theo puts in more each month, so he seems like the better guess.')
  await ch.getByRole('group', { name: 'Your guess' }).getByRole('button', { name: 'Nia' }).click()
  await expect(ch).toContainText('You got it.')
})

test('the start-age slider moves by keyboard and uses the formula', async ({ page }) => {
  await page.goto('/story#chapter-5')
  const slider = page.getByRole('slider', { name: /^Start age/ }).first()
  await slider.focus()
  for (let i = 0; i < 8; i++) await page.keyboard.press('ArrowRight')
  await expect(slider).toHaveAttribute('aria-valuetext', 'Start at 30')
  await expect(page.locator('#chapter-5')).toContainText(`Start at 30. At 65 you would have ${whole(proj(30, 100))}.`)
  await page.keyboard.press('End')
  await expect(page.locator('#chapter-5')).toContainText('Starting at 45 still helps. It just has fewer years to grow.')
})

test("Theo's slider lands exactly on $196, and $195 is not enough", async ({ page }) => {
  expect(proj(theo.startAge, 196)).toBeGreaterThanOrEqual(nia.final.value)
  expect(proj(theo.startAge, 195)).toBeLessThan(nia.final.value)
  await page.goto('/story#chapter-5')
  const slider = page.getByRole('slider', { name: /^Theo each month/ })
  const out = page.getByTestId('catch-up')
  await slider.focus()
  for (let i = 0; i < 45; i++) await page.keyboard.press('ArrowRight')
  await expect(slider).toHaveAttribute('aria-valuetext', '$195 a month')
  await expect(out).toContainText('Theo is still behind.')
  await page.keyboard.press('ArrowRight')
  await expect(slider).toHaveAttribute('aria-valuetext', '$196 a month')
  await expect(out).toContainText(`At $196 a month, Theo ends with ${whole(proj(32, 196))}. Nia ends with ${whole(nia.final.value)}.`)
  await expect(out).toContainText('Theo passes Nia.')
  await expect(page.locator('.slider__mark-label')).toHaveText('Passes Nia: $196')
})

test('smooth and bumpy show the same friends, with "overall growth" and never "average"', async ({ page }) => {
  await page.goto('/story#chapter-5')
  const ch = page.locator('#chapter-5')
  const series = async () => JSON.parse((await ch.locator('.fl-chart', { has: page.getByRole('heading', { name: /^(Smooth|Bumpy) years$/ }) }).locator('[data-series]').getAttribute('data-series'))!)
  await ch.getByRole('group', { name: 'Growth' }).getByRole('button', { name: 'Bumpy' }).click()
  const bumpy = await series()
  expect(bumpy[0].at(-1)).toBe(story.bumpy.nia.at(-1).value)
  expect(bumpy[1].at(-1)).toBe(story.bumpy.theo.at(-1).value)
  await expect(ch).toContainText('overall growth')
  await expect(ch).toContainText('Even when the years go up and down, Nia still ends ahead.')
  await expect(ch).not.toContainText(/\baverage\b/i)
  await ch.getByRole('group', { name: 'Growth' }).getByRole('button', { name: 'Smooth' }).click()
  expect((await series())[0].at(-1)).toBe(nia.final.value)
})

test("your turn starts at Rosa's numbers and says it is an example", async ({ page }) => {
  await page.goto('/story#chapter-5')
  await expect(page.getByTestId('your-turn')).toHaveText(`Start at 26 with $150 a month. At 65 you would have ${whole(proj(26, 150))}.`)
  await expect(page.locator('#chapter-5')).toContainText('This is an example, not a plan or advice.')
})

test('chapter 6 leads into Practice', async ({ page }) => {
  await page.goto('/story#chapter-6')
  await page.getByRole('link', { name: 'Go to Practice' }).click()
  await expect(page).toHaveURL(/\/practice/)
})
