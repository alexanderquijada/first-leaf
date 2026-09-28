import { test, expect } from '../fixtures'
import { load, money, moneyShort, SCENARIOS } from '../data'

// F1: glance. At 390 × 844, without scrolling: the dark balance card first (Balance inside it,
// up or down on what she put in, this week), then the needs-you card right under it (Phase 6).
test.use({ viewport: { width: 390, height: 844 } })
const attention = load('attention')
const account = load('account')

const change = (n: number, cap = false) => `${n >= 0 ? (cap ? 'Up' : 'up') : cap ? 'Down' : 'down'} ${money(n)}`

test('the balance card and the needs-you card title are visible without scrolling', async ({ page }) => {
  await page.goto('/')
  const barTop = (await page.locator('.fl-bottombar').boundingBox())!.y
  for (const sel of ['.balance .balance__big', '.balance .balance__line', '.phome__needs-title', '.phome__needs .phome__top']) {
    const b = (await page.locator(sel).first().boundingBox())!
    expect(b.y + b.height, `${sel} fits above the tab bar`).toBeLessThanOrEqual(barTop)
  }
})

for (const size of [{ width: 390, height: 844 }, { width: 320, height: 640 }]) {
  test(`at ${size.width}×${size.height}, the dark balance card comes first and holds the balance`, async ({ page }) => {
    await page.setViewportSize(size)
    await page.goto('/')
    const card = page.locator('.balance')
    await expect(card).toHaveCount(1)
    // First on screen and first in reading order: above and before the needs-you card.
    const [b, n] = [(await card.boundingBox())!, (await page.locator('.phome__needs').boundingBox())!]
    expect(b.y + b.height).toBeLessThanOrEqual(n.y)
    const order = await page.evaluate(() => {
      const [bal, needs] = [document.querySelector('.balance')!, document.querySelector('.phome__needs')!]
      return bal.compareDocumentPosition(needs) & Node.DOCUMENT_POSITION_FOLLOWING
    })
    expect(order, 'the balance card comes before the needs-you card in the DOM').toBeTruthy()
    // Everything sits inside the dark card.
    await expect(card.getByRole('heading', { name: 'Balance', exact: true })).toBeVisible()
    await expect(card.locator('.balance__big')).toHaveText(money(account.balance))
    await expect(card).toContainText(`${change(account.gainLoss, true)} on the ${moneyShort(account.moneyIn)} you put in.`)
    await expect(card).toContainText(`This week: ${change(account.weeklyChange.totalChange)}.`)
    const rows = card.locator('.balance__parts > div')
    await expect(rows.locator('dt')).toHaveText(['Invested', 'Cash', 'You put in', 'Auto-invest'])
    await expect(rows.nth(0).locator('dt .fl-termtip__button')).toHaveText('Invested') // a finance term
    await expect(rows.nth(0).locator('dd')).toHaveText(money(account.investedValue))
    await expect(rows.nth(1).locator('dd')).toHaveText(money(account.cash))
    await expect(rows.nth(2).locator('dd')).toHaveText(money(account.moneyIn))
    await expect(rows.nth(3).locator('dd')).toHaveText('On')
    // The needs-you card underneath.
    await expect(page.locator('.phome__needs-title')).toHaveText('1 thing needs you')
    await expect(page.locator('.phome__needs .phome__top')).toContainText('Name a beneficiary for your account')
    // The old balance block outside the card is gone.
    await expect(page.locator('.phome__big, .phome__week')).toHaveCount(0)
  })
}

test('all clear: "Nothing needs you right now." with the SIPC note under "Good to know"', async ({ page }) => {
  await page.goto('/?scenario=all-clear')
  await expect(page.locator('.balance .balance__big')).toHaveText(money(load('account-all-clear').balance))
  const card = page.locator('.phome__needs')
  await expect(card.getByRole('heading', { level: 2 })).toHaveText('Nothing needs you right now.')
  await expect(card.getByRole('heading', { name: 'Good to know' })).toBeVisible()
  await expect(card).not.toContainText('beneficiary')
})

for (const s of SCENARIOS) {
  test(`the phone Home tells the truth for ?scenario=${s.id}`, async ({ page }) => {
    const a = load(s.file)
    await page.goto(`/?scenario=${s.id}`)
    if (!a.history.length) {
      await expect(page.getByRole('heading', { name: 'Welcome, Rosa.' })).toBeVisible()
      await expect(page.locator('canvas')).toHaveCount(0)
      await expect(page.locator('.balance')).toHaveCount(0)
      await expect(page.getByRole('heading', { name: 'Term of the Day' })).toBeVisible()
      return
    }
    await expect(page.locator('.balance .balance__big')).toHaveText(money(a.balance))
    await expect(page.locator('.balance')).toContainText(`This week: ${change(a.weeklyChange.totalChange)}.`)
    const flags = attention[a.id]
    const needs = flags.filter((f: { severity: string }) => f.severity === 'needs-you')
    const title = page.locator('.phome__needs-title')
    if (needs.length) await expect(title).toHaveText(needs.length === 1 ? '1 thing needs you' : `${needs.length} things need you`)
    else await expect(title).toHaveText('Nothing needs you right now.')
    // The latest three transactions are the newest three in the data.
    const acts = load('activity')[a.id].slice(-3).reverse()
    const rows = page.locator('.phome__latest li')
    await expect(rows).toHaveCount(3)
    for (let i = 0; i < 3; i++) await expect(rows.nth(i)).toContainText(money(acts[i].amount))
  })
}
