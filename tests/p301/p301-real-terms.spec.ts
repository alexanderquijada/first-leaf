import { test, expect } from '../fixtures'
import { load, SCENARIOS } from '../data'

// Phase 6: only real finance terms get a term button, and none of the removed stories
// (the returned deposit, cash waiting, the auto-invest pause, the goal behind) is left on any
// P301 page, in any scenario.
test.use({ viewport: { width: 1280, height: 800 } })

const attention = load('attention')
const activity = load('activity')
const funds = load('funds') as { ticker: string }[]
const glossary = load('glossary')
const terms = (glossary.terms ?? glossary) as { id: string; term: string }[]

/** Every P301 page for one scenario: Home, Alerts and each alert, Activity and one item, Investments and each investment. */
function pagesFor(s: (typeof SCENARIOS)[number]) {
  const a = load(s.file)
  const q = `?scenario=${s.id}`
  const acts = activity[a.id] as { id: string }[]
  return [
    `/${q}`,
    `/alerts${q}`,
    ...(attention[a.id] as { id: string }[]).map((f) => `/alerts/${f.id}${q}`),
    `/activity${q}`,
    ...(acts.length ? [`/activity/${acts[0]!.id}${q}`] : []),
    `/funds${q}`,
    ...funds.map((f) => `/funds/${f.ticker}${q}`),
  ]
}

// Plain words that used to be terms, and must never be term buttons now.
const NOT_TERMS = /^(balance|cash|your mix|(money )?(you )?put in|on pace|pace|auto-invest|ups and downs|the market|deposits?|(share )?price|practice)$/i
// A term button reads as a Finance Terms entry (or its plural), or "Crypto" for Cryptocurrency.
const TERM_WORDS = new Set([...terms.map((t) => t.term.toLowerCase()), 'crypto'])
const isTerm = (text: string) => {
  const t = text.trim().toLowerCase()
  return TERM_WORDS.has(t) || TERM_WORDS.has(t.replace(/s$/, ''))
}

for (const s of SCENARIOS.filter((x) => x.id !== 'brand-new')) {
  test(`only real finance terms are term buttons on P301 pages (?scenario=${s.id})`, async ({ page }) => {
    const seen = new Set<string>()
    for (const url of pagesFor(s)) {
      await page.goto(url)
      await expect(page.locator('main h1, main h2').first()).toBeVisible()
      const buttons = await page.locator('.fl-termtip__button').allInnerTexts()
      for (const b of buttons) {
        const text = b.trim()
        seen.add(text)
        expect(text, `${url}: "${text}" is a plain word, not a term`).not.toMatch(NOT_TERMS)
        expect(isTerm(text), `${url}: "${text}" is not a Finance Terms entry`).toBe(true)
        expect(text.toLowerCase(), url).not.toContain('put in')
        expect(text.toLowerCase(), url).not.toContain('pace')
      }
    }
    // The pages do use real terms: Invested on Home, Volatility and Stock on investment pages.
    for (const t of ['Invested', 'Volatility', 'Stock', 'SIPC protection']) expect([...seen], t).toContain(t)
  })
}

const REMOVED = ['waiting in cash', 'sent back', 'returned', 'try the deposit again', 'one-time deposit', 'behind your plan', 'paused']

for (const s of SCENARIOS) {
  test(`no removed-story wording on any P301 page (?scenario=${s.id})`, async ({ page }) => {
    for (const url of pagesFor(s)) {
      await page.goto(url)
      await expect(page.locator('main h1, main h2').first()).toBeVisible()
      const text = (await page.locator('body').innerText()).toLowerCase()
      for (const w of REMOVED) expect(text, `${url} says "${w}"`).not.toContain(w)
    }
  })
}
