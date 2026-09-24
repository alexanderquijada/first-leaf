import { test, expect } from '../fixtures'

// F2: show and hide the July events on the chart.
test('the dip events can be shown and hidden, and the chart keeps the same series', async ({ page }) => {
  await page.goto('/story')
  const ch3 = page.locator('#chapter-3')
  const toggle = ch3.getByRole('button', { name: 'Show events on the chart' })
  const events = ch3.getByRole('list', { name: 'Events on the chart' })
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await expect(events.getByRole('listitem')).toHaveText([
    'June 26: FL-BROAD hit its high before the dip.',
    'July 13: FL-BROAD hit its low.',
    'July 14: You paused auto-invest.',
    'July 20: Your balance was back above what you had put in.',
    'Aug. 3: Your deposit stayed as cash.',
  ])
  const before = await ch3.locator('[data-series]').getAttribute('data-series')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await expect(events).toHaveCount(0)
  expect(await ch3.locator('[data-series]').getAttribute('data-series')).toBe(before)
})

test('in the calm account, the events say auto-invest kept buying', async ({ page }) => {
  await page.goto('/story?scenario=all-clear')
  const list = page.locator('#chapter-3').getByRole('list', { name: 'Events on the chart' })
  await expect(list).toContainText('Aug. 3: Your deposit bought your mix.')
  await expect(list).not.toContainText('paused')
})

// Phase 2: nothing in the calm account's story may mention pausing, anywhere a
// person can read or hear it: text, tables, chart descriptions and labels.
// The same reader must find "paus" in the paused account, so the check can fail.
async function storyWords(page: import('@playwright/test').Page, scenario: string) {
  await page.goto(`/story?scenario=${scenario}`)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const show = page.getByRole('button', { name: 'Show as table' })
  while (await show.count()) await show.first().click() // each click renames that button "Hide table"
  return page.locator('.story').evaluate((el) => {
    const attrs = [...el.querySelectorAll('*')].flatMap((n) =>
      ['aria-label', 'aria-valuetext', 'aria-description', 'title', 'alt'].map((a) => n.getAttribute(a) ?? ''),
    )
    return [el.textContent ?? '', ...attrs].join('\n')
  })
}

test('the calm account story never mentions pausing; the paused account story does', async ({ page }) => {
  expect(await storyWords(page, 'all-clear')).not.toMatch(/paus/i)
  expect(await storyWords(page, 'normal')).toMatch(/paus/i)
})
