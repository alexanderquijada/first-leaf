import { test, expect } from '../fixtures'
import { load, SCENARIOS } from '../data'

// Your money story, chapters 1-4: every sentence on screen is a checked claim from the data.
const story = load('story-p302')

for (const s of SCENARIOS) {
  test(`every story sentence comes from the checked data (?scenario=${s.id})`, async ({ page }) => {
    const acc = load(s.file)
    const rosa = story.rosaStory[acc.id]
    await page.goto(`/story?scenario=${s.id}`)
    await expect(page.locator('.story__pov')).toHaveText(rosa ? rosa.pointOfView : story.pointOfView)
    if (!rosa) {
      await expect(page.getByRole('heading', { name: 'Your story starts with your first deposit' })).toBeVisible()
      await expect(page.locator('canvas')).toHaveCount(0)
      return
    }
    for (const c of rosa.claims) await expect(page.locator(`#chapter-${c.chapter}`)).toContainText(c.text)
    // Chapter 3 never tells a pause the account didn't have.
    const ch3 = page.locator('#chapter-3')
    if (acc.autoInvest.pausedOn) await expect(ch3).toContainText('You paused auto-invest')
    else await expect(ch3).not.toContainText('paused')
  })
}

test('the point of view is exactly the one in the P302 brief', async ({ page }) => {
  await page.goto('/story')
  await expect(page.locator('.story__pov')).toHaveText(
    "Right now, almost all of your balance is money you put in. Growth needs years, so starting early and staying steady matter more than picking the perfect moment.",
  )
})

test('chapter 1: the layers toggle and the time range change the chart; the table matches', async ({ page }) => {
  const acc = load('account')
  await page.goto('/story')
  const ch1 = page.locator('#chapter-1')
  const toggle = ch1.getByRole('button', { name: 'Show what you put in and what it earned' })
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await expect(ch1.locator('.fl-balchart__key')).toBeVisible()
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await expect(ch1.locator('.fl-balchart__key')).toHaveCount(0)

  const series = async () => JSON.parse((await ch1.locator('[data-series]').getAttribute('data-series'))!) as number[]
  expect(await series()).toEqual(acc.history.map((r: { balance: number }) => r.balance))
  await ch1.getByRole('button', { name: 'Last month' }).click()
  const month = await series()
  expect(month.length).toBeLessThan(acc.history.length)
  expect(month.at(-1)).toBe(acc.balance)
  await ch1.getByRole('button', { name: 'Show as table' }).click()
  expect(await ch1.locator('tbody tr').count()).toBe(month.length)
})

test('chapter 2: tapping a part reads it out', async ({ page }) => {
  await page.goto('/story')
  const ch2 = page.locator('#chapter-2')
  await ch2.getByRole('button', { name: 'What it earned' }).click()
  await expect(ch2.locator('.share__readout')).toHaveText('$63.72 is what it earned. That is 5%.')
  await ch2.getByRole('button', { name: 'Money you put in' }).click()
  await expect(ch2.locator('.share__readout')).toHaveText('$1,250.00 of your balance is money you put in. That is 95%.')
})

test('a chapter link lands on its chapter', async ({ page }) => {
  await page.goto('/story#chapter-3')
  await expect(page.getByRole('heading', { name: 'The dip in July' })).toBeInViewport()
  await page.getByRole('navigation', { name: 'Chapters' }).getByRole('link', { name: 'Where it is now' }).click()
  await expect(page.getByRole('heading', { name: 'Where it is now' })).toBeInViewport()
})
