import type { Page } from '@playwright/test'
import { test, expect, settle } from '../fixtures'
import { load, SCENARIOS } from '../data'

// Your Journey (Phase 6): four sections, one shown at a time, picked with WAI-ARIA tabs.
// Every sentence on screen is a checked claim from the data or approved copy.
const story = load('story-p302')
const rosa = story.rosaStory['rosa-starter']
const claim = (id: string) => rosa.claims.find((c: { id: string }) => c.id === id).text
const TABS = ['Section 1 Six months in', `Section 2 The dip in ${rosa.facts.dip.month}`, 'Section 3 Your head start', 'Section 4 Try it']
const NAMES = ['Six months in', `The dip in ${rosa.facts.dip.month}`, 'Your head start', 'Try it']
const NEW_CLAIM = 'Once your first deposit arrives, this page will show how your money has moved.'
const NEW_DIP_CLAIM = 'Prices sometimes fall for a while. Once your money is invested, this section will show how it moved through a dip.'

const tablist = (page: Page) => page.getByRole('tablist', { name: 'Sections' })
const tab = (page: Page, n: number) => tablist(page).getByRole('tab', { name: TABS[n - 1], exact: true })
const panel = (page: Page) => page.getByRole('tabpanel')

async function expectSelected(page: Page, n: number) {
  for (let i = 1; i <= 4; i++) await expect(tab(page, i)).toHaveAttribute('aria-selected', i === n ? 'true' : 'false')
  await expect(panel(page)).toHaveCount(1)
  await expect(panel(page)).toHaveAttribute('id', `section-${n}`)
  await expect(panel(page)).toHaveAttribute('aria-labelledby', `tab-${n}`)
  await expect(panel(page).getByRole('heading', { level: 2 }).first()).toHaveText(NAMES[n - 1]!)
}

test('the title is "Your Journey", with four section tabs; the selected one is lime with ink text', async ({ page }) => {
  await page.goto('/story')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your Journey')
  await expect(tablist(page).getByRole('tab')).toHaveText(TABS.map((t) => new RegExp(t.replace(/ /g, '\\s*'))))
  await expect(tablist(page).getByRole('tab')).toHaveCount(4)
  await expectSelected(page, 1)
  await settle(page)
  const style = (n: number) => tab(page, n).evaluate((e) => [getComputedStyle(e).backgroundColor, getComputedStyle(e).color])
  expect(await style(1)).toEqual(['rgb(198, 243, 107)', 'rgb(21, 19, 15)'])
  expect((await style(2))[0]).not.toBe('rgb(198, 243, 107)')
  await tab(page, 3).click()
  await page.mouse.move(0, 0)
  await expectSelected(page, 3)
  await settle(page) // let any color transition finish before measuring
  expect(await style(3)).toEqual(['rgb(198, 243, 107)', 'rgb(21, 19, 15)'])
  expect((await style(1))[0]).not.toBe('rgb(198, 243, 107)')
  await expect(page).toHaveURL(/#section-3$/)
})

test('arrow keys, Home and End move focus without selecting; Enter or Space selects; one tab stop', async ({ page }) => {
  await page.goto('/story')
  const tabindexes = () => tablist(page).getByRole('tab').evaluateAll((els) => els.map((e) => e.getAttribute('tabindex')))
  expect(await tabindexes()).toEqual(['0', '-1', '-1', '-1'])
  await tab(page, 1).focus()
  await page.keyboard.press('ArrowRight')
  await expect(tab(page, 2)).toBeFocused()
  await expectSelected(page, 1)
  expect(await tabindexes()).toEqual(['-1', '0', '-1', '-1'])
  await page.keyboard.press('End')
  await expect(tab(page, 4)).toBeFocused()
  await page.keyboard.press('Home')
  await expect(tab(page, 1)).toBeFocused()
  await page.keyboard.press('ArrowLeft') // wraps to the last tab
  await expect(tab(page, 4)).toBeFocused()
  await page.keyboard.press('ArrowRight') // and back round to the first
  await expect(tab(page, 1)).toBeFocused()
  await expectSelected(page, 1)
  await page.keyboard.press('End')
  await page.keyboard.press('Enter')
  await expectSelected(page, 4)
  await page.keyboard.press('ArrowLeft')
  await expect(tab(page, 3)).toBeFocused()
  await expectSelected(page, 4)
  await page.keyboard.press('Space')
  await expectSelected(page, 3)
  expect(await tabindexes()).toEqual(['-1', '-1', '0', '-1'])
  // Tab leaves the tab list for the panel's content, not the next tab.
  await page.keyboard.press('Tab')
  expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).not.toBe('tab')
})

test('#section-1 to #section-4 open their section', async ({ page }) => {
  for (let n = 1; n <= 4; n++) {
    await page.goto(`/story#section-${n}`)
    await expectSelected(page, n)
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport()
  }
})

test('old #chapter links open the matching section, and the address says #section-N', async ({ page }) => {
  const map: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 1, 5: 3, 6: 4 }
  for (const [ch, sec] of Object.entries(map)) {
    await page.goto(`/story#chapter-${ch}`)
    await expect(page, `#chapter-${ch}`).toHaveURL(new RegExp(`/story#section-${sec}$`))
    await expectSelected(page, sec)
  }
})

test('#chapter-7 and #section-9 do not exist, so the page opens at section 1, at its top', async ({ page }) => {
  for (const hash of ['#chapter-7', '#section-9']) {
    await page.goto(`/story${hash}`)
    await expectSelected(page, 1)
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  }
})

test('each section has at most 60 words, one chart or interaction, and a Next button', async ({ page }) => {
  await page.goto('/story')
  const counts: number[] = []
  for (let n = 1; n <= 4; n++) {
    await expectSelected(page, n)
    const words = await panel(page)
      .locator('.section__claim, .section__note')
      .evaluateAll((ps) => ps.map((p) => (p.textContent ?? '').trim()).join(' ').split(/\s+/).filter(Boolean).length)
    counts.push(words)
    expect(words, `section ${n}`).toBeLessThanOrEqual(60)
    expect(words, `section ${n}`).toBeGreaterThan(10)
    // One chart (sections 1-3), or the way into Practice (section 4).
    await expect(panel(page).locator('.fl-chart'), `section ${n}`).toHaveCount(n < 4 ? 1 : 0)
    await expect(panel(page).locator('canvas'), `section ${n}`).toHaveCount(n < 4 ? 1 : 0)
    const next = panel(page).getByRole('button', { name: /^Next:/ })
    if (n < 4) {
      await expect(next).toHaveText(new RegExp(`^Next: ${NAMES[n]}`))
      await next.click()
      await expect(page).toHaveURL(new RegExp(`#section-${n + 1}$`))
      await expect(tab(page, n + 1)).toBeFocused()
    } else {
      await expect(next).toHaveCount(0)
      await expect(panel(page).getByRole('link', { name: 'Go to Practice' })).toBeVisible()
    }
  }
  test.info().annotations.push({ type: 'words per section', description: counts.map((c, i) => `${i + 1}: ${c}`).join(', ') })
})

test('section 1: the point of view, the deposits share and the rate-of-return term', async ({ page }) => {
  await page.goto('/story#section-1')
  const claims = panel(page).locator('.section__claim')
  await expect(claims).toHaveText([
    'Right now, almost all of your balance is money you put in. Growth needs years, so starting early and staying steady matter more than picking the perfect moment.',
    claim('deposits-share'),
    'Shown as a percent, what it earned is called your rate of return.',
  ])
  expect(claim('deposits-share')).toBe('About 91% of your balance is money you put in. The other $136.68 is what it earned.')
  const term = panel(page).getByRole('button', { name: 'rate of return', exact: true })
  await term.click()
  const tip = page.getByRole('dialog', { name: 'Rate of return' })
  await expect(tip).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(tip).toHaveCount(0)
})

test('section 1: the time range sets the title, the layers toggle sets the summary, and the table matches', async ({ page }) => {
  const acc = load('account')
  await page.goto('/story#section-1')
  const p = panel(page)
  await expect(p.getByRole('group', { name: /range/i }).getByRole('button')).toHaveText(['1 month', '3 months', 'Since March'])
  await expect(p.getByRole('heading', { level: 3 })).toHaveText('Your balance since March')
  const series = async () => JSON.parse((await p.locator('[data-series]').getAttribute('data-series'))!) as number[]
  expect(await series()).toEqual(acc.history.map((r: { balance: number }) => r.balance))
  await expect(p.locator('canvas')).toHaveAttribute('data-x-last', 'Sept. 18')
  await expect(p.locator('canvas')).toHaveAttribute('data-y-min', '0')

  await p.getByRole('button', { name: '3 months' }).click()
  await expect(p.getByRole('heading', { level: 3 })).toHaveText('Your balance in the last 3 months')
  await p.getByRole('button', { name: '1 month' }).click()
  await expect(p.getByRole('heading', { level: 3 })).toHaveText('Your balance in the last month')
  const month = await series()
  expect(month.length).toBeLessThan(acc.history.length)
  expect(month.at(-1)).toBe(acc.balance)

  const toggle = p.getByRole('button', { name: 'Show what you put in and what it earned' })
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await expect(p.locator('.fl-chart__summary')).toContainText('The flat layer is what you put in')
  await expect(p.locator('.fl-balchart__key')).toBeVisible()
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await expect(p.locator('.fl-chart__summary')).toContainText('The chart shows your balance as one line.')
  await expect(p.locator('.fl-balchart__key')).toHaveCount(0)
  // A single line may start its axis near the data.
  await expect(p.locator('canvas')).not.toHaveAttribute('data-y-min', '0')

  await p.getByRole('button', { name: 'Since March' }).click()
  await expect(p.getByRole('heading', { level: 3 })).toHaveText('Your balance since March')
  await p.getByRole('button', { name: 'Show as table' }).click()
  expect(await p.locator('tbody tr').count()).toBe(acc.history.length)
})

test('section 4 leads into Practice', async ({ page }) => {
  await page.goto('/story#section-4')
  await expect(panel(page)).toContainText('Practice lets you try a mix with practice money.')
  await panel(page).getByRole('link', { name: 'Go to Practice' }).click()
  await expect(page).toHaveURL(/\/practice/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Practice')
})

// Everything a person can read or hear on /story, across all four sections, with tables open.
async function journeyWords(page: Page, scenario: string) {
  await page.goto(`/story?scenario=${scenario}`)
  const out: string[] = [await page.title()]
  for (let n = 1; n <= 4; n++) {
    await tablist(page).getByRole('tab').nth(n - 1).click()
    await expect(panel(page)).toHaveAttribute('id', `section-${n}`)
    const show = panel(page).getByRole('button', { name: 'Show as table' })
    while (await show.count()) await show.first().click() // each click renames that button "Hide table"
    out.push(
      await page.locator('body').evaluate((el) => {
        const attrs = [...el.querySelectorAll('*')].flatMap((node) =>
          ['aria-label', 'aria-valuetext', 'aria-description', 'title', 'alt', 'aria-roledescription'].map((a) => node.getAttribute(a) ?? ''),
        )
        return [(el as HTMLElement).innerText, ...attrs].join('\n')
      }),
    )
  }
  return out.join('\n')
}

for (const s of SCENARIOS) {
  test(`the word "chapter" and any pause appear nowhere on /story (?scenario=${s.id})`, async ({ page }) => {
    const words = await journeyWords(page, s.id)
    // The reader can fail: it does find the page's own words.
    expect(words).toMatch(/Your Journey/)
    expect(words).toMatch(/Your head start/)
    expect(words).not.toMatch(/\bNia\b|\bTheo\b/)
    expect(words).not.toMatch(/chapter/i)
    expect(words).not.toMatch(/paus/i)
  })
}

// Phase 6 review: a brand-new account has not had six months or a dip, so the names say so.
test('the brand-new account shows the short text in sections 1 and 2, with no charts', async ({ page }) => {
  await page.goto('/story?scenario=brand-new')
  await expect(tablist(page).getByRole('tab')).toHaveText([/Section 1\s*Your start/, /Section 2\s*When prices dip$/, /Section 3\s*Your head start/, /Section 4\s*Try it/])
  await expect(panel(page).locator('.section__claim')).toHaveText(`${story.pointOfView} ${NEW_CLAIM}`)
  await expect(panel(page).locator('canvas')).toHaveCount(0)
  await panel(page).getByRole('button', { name: 'Next: When prices dip' }).click()
  await expect(panel(page).getByRole('heading', { level: 2 })).toHaveText('When prices dip')
  // Its own sentence, not section 1's again.
  await expect(panel(page).locator('.section__claim')).toHaveText(NEW_DIP_CLAIM)
  await expect(panel(page).locator('canvas')).toHaveCount(0)
  // Section 3 is her own head start: it works from $0 for a brand-new account.
  await panel(page).getByRole('button', { name: 'Next: Your head start' }).click()
  await expect(panel(page).locator('canvas')).toHaveCount(1)
})
