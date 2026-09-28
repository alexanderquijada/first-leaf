import { test, expect } from '../fixtures'
import { apDate, load } from '../data'

// F2, Your Journey section 2 ("The dip in June"): what happened and that auto-invest kept
// buying, then the dip chart with its events shown or hidden. The events come from Rosa's
// own history (the data-driven dip), so the expected list is built from the data.
const story = load('story-p302')
const facts = story.rosaStory['rosa-starter'].facts
const claim = (acc: string, id: string) => story.rosaStory[acc].claims.find((c: { id: string }) => c.id === id).text

for (const [scenario, acc] of [['normal', 'rosa-starter'], ['all-clear', 'rosa-all-clear']] as const) {
  test(`section 2 says what the dip did and that auto-invest kept buying (?scenario=${scenario})`, async ({ page }) => {
    await page.goto(`/story?scenario=${scenario}#section-2`)
    const p = page.getByRole('tabpanel')
    await expect(p.getByRole('heading', { level: 2 })).toHaveText(`The dip in ${facts.dip.month}`)
    await expect(p.locator('.section__claim')).toHaveText([
      claim(acc, 'dip'),
      claim(acc, 'kept-buying'),
      'Buying the same amount every month is called dollar-cost averaging.',
    ])
    expect(claim(acc, 'kept-buying')).toBe(
      'Auto-invest kept buying through the dip. Your June 1, July 1, Aug. 3 and Sept. 1 deposits each bought your mix the day they arrived.',
    )
    await p.getByRole('button', { name: 'dollar-cost averaging', exact: true }).click()
    await expect(page.getByRole('dialog', { name: 'Dollar-cost averaging' })).toBeVisible()
    // It describes only; it never tells anyone what to do.
    await expect(p).not.toContainText(/\byou should\b|\bpaus/i)
  })
}

test('the dip events can be shown and hidden; the chart keeps the same series and says what it shows', async ({ page }) => {
  await page.goto('/story#section-2')
  const p = page.getByRole('tabpanel')
  const toggle = p.getByRole('button', { name: 'Show events on the chart' })
  const events = p.getByRole('list', { name: 'Events on the chart' })
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  const want = [
    [facts.dip.highDate, `${apDate(facts.dip.highDate)}: Your investments started to fall.`],
    [facts.dip.lowDate, `${apDate(facts.dip.lowDate)}: The fall hit its low.`],
    [facts.after.backAboveDate, `${apDate(facts.after.backAboveDate)}: Your balance was back above what you had put in.`],
    ...facts.after.deposits.map((d: { date: string }) => [d.date, `${apDate(d.date)}: Your deposit bought your mix.`]),
  ]
    .sort((x, y) => x[0]!.localeCompare(y[0]!))
    .map((x) => x[1])
  await expect(events.getByRole('listitem')).toHaveText(want)
  await expect(p.locator('.fl-chart__summary')).toContainText('A diamond marks each event')
  await expect(p.locator('canvas')).toHaveAttribute('data-x-last', 'Sept. 18')
  const before = await p.locator('[data-series]').getAttribute('data-series')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await expect(events).toHaveCount(0)
  await expect(p.locator('.fl-chart__summary')).toContainText('The chart shows your balance without the events.')
  expect(await p.locator('[data-series]').getAttribute('data-series')).toBe(before)
  await toggle.click()
  await expect(events.getByRole('listitem')).toHaveCount(want.length)
})
