import { test, expect } from '../fixtures'

// Real-app ruling (Sept. 24) and ruling B (Phase 2.5): nothing on screen may read as a
// project, an exercise or a disclaimer. This crawls every page in every scenario, at phone
// and laptop widths, with the usual things opened, and searches the rendered text.
const BANNED = /made[- ]up|\bdemo\b|case stud(y|ies)|\bproject\b|reviewer|fictional|phase \d|\bsimulated\b|\bconcept\b|\bnot real\b|(investment|financial) advice/i
const PAGES = ['/', '/alerts', '/alerts/deposit-returned', '/alerts/cash-sitting', '/alerts/sipc-crypto', '/activity', '/activity/rosa-starter-035', '/activity/rosa-starter-002', '/funds', '/funds/AAPL', '/funds/BTC', '/funds/SOL', '/story', '/practice', '/learn', '/learn/ups-and-downs', '/learn/practice-mode', '/learn/sipc-protection', '/nope']
const SCENARIOS = ['normal', 'all-clear', 'brand-new']

for (const width of [390, 1280]) {
  test(`no project language on any page at ${width}px`, async ({ page }) => {
    test.setTimeout(180_000)
    await page.setViewportSize({ width, height: 900 })
    const hits: string[] = []
    for (const s of SCENARIOS) {
      for (const path of PAGES) {
        await page.goto(`${path}${path.includes('?') ? '&' : '?'}scenario=${s}`)
        await page.locator('main').waitFor()
        // Open what can be opened: tables, Why it moved, and one explanation.
        const show = page.getByRole('button', { name: 'Show as table' })
        while (await show.count()) await show.first().click()
        const why = page.getByRole('button', { name: 'Why it moved this week' })
        if (await why.count()) await why.click()
        const tip = page.locator('main .fl-termtip__button').first()
        if (await tip.count()) await tip.click()
        const text = await page.evaluate(() => document.body.innerText)
        const m = text.match(BANNED)
        if (m) hits.push(`${s} ${path}: "${m[0]}" in …${text.slice(Math.max(0, (m.index ?? 0) - 40), (m.index ?? 0) + 40).replace(/\s+/g, ' ')}…`)
      }
    }
    expect(hits).toEqual([])
  })
}

// The crawl must let the two allowed notes through, and must still catch the banned words.
const ALLOWED = [
  'Practice money. Nothing here touches your account.',
  'Daily stock prices are modeled between real closes on Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026.',
  'Powered by CoinGecko API',
]
test('the banned words are caught, and the Practice banner and data notes are not', () => {
  for (const t of ALLOWED) expect(t).not.toMatch(BANNED)
  for (const t of ['Prices here are simulated.', 'First Leaf is a concept app.', 'This money is not real.', 'Nothing here is investment advice.'])
    expect(t, t).toMatch(BANNED)
})

test('the notes that are allowed are on screen: the Practice banner and the stock data note', async ({ page }) => {
  await page.goto('/practice')
  await expect(page.getByText(ALLOWED[0]!)).toBeVisible()
  await page.goto('/funds/AAPL')
  await expect(page.getByText(ALLOWED[1]!)).toBeVisible()
  const text = await page.evaluate(() => document.body.innerText)
  expect(text).not.toMatch(BANNED)
  // And the crawl's check fails on screen when a banned word appears.
  await page.evaluate(() => document.querySelector('main')!.insertAdjacentText('beforeend', 'Prices shown are simulated.'))
  expect(await page.evaluate(() => document.body.innerText)).toMatch(BANNED)
})

test('no page has a footer or a disclaimer (ruling B)', async ({ page }) => {
  for (const path of ['/', '/story', '/practice', '/funds/AAPL', '/learn/ups-and-downs', '/nope']) {
    await page.goto(path)
    await page.locator('main').waitFor()
    await expect(page.locator('footer')).toHaveCount(0)
    await expect(page.getByText(/investment advice|involves risk/i)).toHaveCount(0)
  }
})
