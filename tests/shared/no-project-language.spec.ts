import { test, expect } from '../fixtures'
// The data rules' own list (rule G6), so the crawl and the validator ban the same words.
import { PROJECT_LANGUAGE } from '../../scripts/validate-data.mjs'

// Real-app ruling (Sept. 24) and ruling B (Phase 2.5): nothing on screen may read as a
// project, an exercise or a disclaimer. This crawls every page in every scenario, at phone
// and laptop widths, with the usual things opened, and searches the rendered text.
// Phase 6 adds the removed stories ("waiting in cash", "sent back", "returned deposit") and the
// word "chapter" (Your Journey has sections).
const OWN = /made[- ]up|\bdemo\b|case stud(y|ies)|\bproject\b|reviewer|fictional|phase \d|\bsimulated\b|\bconcept\b|\bnot real\b|(investment|financial) advice|\bnot\b[^.]{0,30}\badvice\b|member sipc|sipc member|protected by sipc|sipc[- ]protected|\bfdic\b|waiting in cash|\bsent back\b|\breturned deposits?\b|\bchapters?\b/i
const LISTS = [OWN, ...(PROJECT_LANGUAGE as RegExp[])]
const BANNED = { test: (t: string) => LISTS.some((re) => re.test(t)) }
const match = (t: string) => LISTS.map((re) => t.match(re)).find((m) => m) ?? null
const PAGES = ['/', '/alerts', '/alerts/beneficiary-missing', '/alerts/sipc-crypto', '/activity', '/activity/rosa-starter-035', '/activity/rosa-starter-002', '/activity/rosa-starter-064', '/funds', '/funds/AAPL', '/funds/BTC', '/funds/SOL', '/story', '/story#section-1', '/story#section-2', '/story#section-3', '/story#section-4', '/practice', '/learn', '/learn/volatility', '/learn/beneficiary', '/learn/sipc-protection', '/nope']
const SCENARIOS = ['normal', 'all-clear', 'brand-new']

for (const width of [390, 1280]) {
  test(`no project language on any page at ${width}px`, async ({ page }) => {
    test.setTimeout(180_000)
    await page.setViewportSize({ width, height: 900 })
    const hits: string[] = []
    for (const s of SCENARIOS) {
      for (const path of PAGES) {
        const [base, hash = ''] = path.split('#')
        await page.goto(`${base}?scenario=${s}${hash ? '#' + hash : ''}`)
        await page.locator('main').waitFor()
        if (hash) await expect(page.getByRole('tab', { selected: true })).toContainText(`Section ${hash.slice(-1)}`)
        // Open what can be opened: tables, Why it moved, and one explanation; then read the page
        // again with Journey's layer and event toggles flipped (both start on).
        const show = page.getByRole('button', { name: 'Show as table' })
        while (await show.count()) await show.first().click()
        const why = page.getByRole('button', { name: 'Why it moved this week' })
        if (await why.count()) await why.click()
        const tip = page.locator('main .fl-termtip__button').first()
        if (await tip.count()) await tip.click()
        let text = await page.evaluate(() => document.body.innerText)
        const toggles = await page.locator('main .section__toggle').all()
        if (toggles.length) {
          await page.keyboard.press('Escape')
          for (const t of toggles) await t.click()
          text += '\n' + (await page.evaluate(() => document.body.innerText))
        }
        const m = match(text)
        if (m) hits.push(`${s} ${path}: "${m[0]}" in …${text.slice(Math.max(0, (m.index ?? 0) - 40), (m.index ?? 0) + 40).replace(/\s+/g, ' ')}…`)
      }
    }
    expect(hits).toEqual([])
  })
}

// The crawl must let the two allowed notes through, and must still catch the banned words.
const ALLOWED = [
  'Practice money. Nothing here touches your account.',
  'Stock prices on Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026 are real. Prices on the days between are modeled.',
  'Powered by CoinGecko API',
]
test('the banned words are caught, and the Practice banner and data notes are not', () => {
  for (const t of ALLOWED) expect(BANNED.test(t), t).toBe(false)
  for (const t of ['Prices here are simulated.', 'First Leaf is a concept app.', 'This money is not real.', 'Nothing here is investment advice.', 'This is not financial advice.', 'This is an example, not a plan or advice.', 'Member SIPC', 'First Leaf is a SIPC member.', 'Your stocks are protected by SIPC.', 'SIPC-protected account', 'FDIC insured',
    '$150 is waiting in cash.', 'Your deposit was sent back.', 'Returned deposit', 'Chapter 5: Keep going', 'Pick a chapter.'])
    expect(BANNED.test(t), t).toBe(true)
  // Every word the validator bans (rule G6) is banned here too, and the new ones are on its list.
  for (const t of ['waiting in cash', 'sent back', 'returned deposit', 'chapter']) expect((PROJECT_LANGUAGE as RegExp[]).some((re) => re.test(t)), t).toBe(true)
  // Words that only look close stay allowed.
  for (const t of ['Your balance went back above what you put in.', 'Sections', 'Rate of return']) expect(BANNED.test(t), t).toBe(false)
})

test('the notes that are allowed are on screen: the Practice banner and the stock data note', async ({ page }) => {
  await page.goto('/practice')
  await expect(page.getByText(ALLOWED[0]!)).toBeVisible()
  await page.goto('/funds/AAPL')
  await expect(page.getByText(ALLOWED[1]!)).toBeVisible()
  const text = await page.evaluate(() => document.body.innerText)
  expect(BANNED.test(text)).toBe(false)
  // And the crawl's check fails on screen when a banned word appears.
  await page.evaluate(() => document.querySelector('main')!.insertAdjacentText('beforeend', 'Prices shown are simulated.'))
  expect(BANNED.test(await page.evaluate(() => document.body.innerText))).toBe(true)
  await page.goto('/story')
  expect(BANNED.test(await page.evaluate(() => document.body.innerText))).toBe(false)
  await page.evaluate(() => document.querySelector('main h1')!.insertAdjacentText('beforeend', ' (chapter 1)'))
  expect(BANNED.test(await page.evaluate(() => document.body.innerText))).toBe(true)
})

test('no page has a footer or a disclaimer (ruling B)', async ({ page }) => {
  for (const path of ['/', '/story', '/practice', '/funds/AAPL', '/learn/volatility', '/nope']) {
    await page.goto(path)
    await page.locator('main').waitFor()
    await expect(page.locator('footer')).toHaveCount(0)
    await expect(page.getByText(/investment advice|involves risk/i)).toHaveCount(0)
  }
})
