import { test, expect, type Page } from '../fixtures'
import { load, money } from '../data'

// F8: Practice. Buy, review, confirm, what you own, sell, every error inline with
// Review/Confirm disabled, the time machine, Start over. Never touches the account.
test.use({ viewport: { width: 1280, height: 900 } })
const funds = load('funds')
const price = (t: string) => funds.find((f: { ticker: string }) => f.ticker === t).latestPrice

async function order(page: Page, side: 'Buy' | 'Sell', ticker: string, amount: string) {
  await page.getByRole('group', { name: 'Buy or sell' }).getByRole('button', { name: side }).click()
  await page.getByRole('radio', { name: new RegExp(ticker) }).check()
  await page.getByLabel('Amount in dollars').fill(amount)
}

test('every order error shows inline and keeps Review disabled', async ({ page }) => {
  await page.goto('/practice')
  const err = page.locator('#practice-error'), review = page.getByRole('button', { name: 'Review' })
  const cases: [string, 'Buy' | 'Sell', string][] = [
    ['0', 'Buy', 'Enter an amount of $1 or more.'],
    ['abc', 'Buy', 'Enter a number, like 25 or 25.50.'],
    ['12.345', 'Buy', 'Use no more than 2 decimals, like 25.50.'],
    ['1000.01', 'Buy', 'You have $1,000.00 in practice money. Enter that much or less.'],
    ['10', 'Sell', 'You do not own any MSFT in Practice, so there is nothing to sell. Pick one you own.'],
  ]
  for (const [amount, side, message] of cases) {
    await order(page, side, 'MSFT', amount)
    await expect(err).toHaveText(message)
    await expect(review).toBeDisabled()
  }
  await page.getByLabel('Amount in dollars').fill('')
  await expect(err).toHaveText('Enter an amount of $1 or more.')
  await expect(review).toBeDisabled()
})

test('buy, see it, sell part, sell too much, time machine, start over', async ({ page }) => {
  await page.goto('/practice')
  await order(page, 'Buy', 'AAPL', '200')
  await page.getByRole('button', { name: 'Review' }).click()
  await expect(page.getByText(`Buy $200.00 of AAPL at ${money(price('AAPL'))} a share.`)).toBeVisible()
  // The estimate is worked out exactly as the order is, so it matches what she then owns.
  const est = (Math.floor((200 / price('AAPL')) * 10000 + 1e-9) / 10000).toFixed(4)
  await expect(page.getByText(`That is about ${est} shares.`)).toBeVisible()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'You bought' })).toHaveText(/You bought \$200.00 of AAPL with practice money./)
  await expect(page.locator('.practice__sum')).toContainText('$800.00')
  const row = page.locator('.practice__table tbody tr:visible, .practice__stack > li:visible')
  await expect(row).toHaveCount(1)
  const shares = Math.floor((200 / price('AAPL')) * 10000 + 1e-9) / 10000
  await expect(row).toContainText(shares.toFixed(4))

  // Sell more than she owns, then part of it.
  await page.getByRole('button', { name: 'New order' }).click()
  await order(page, 'Sell', 'AAPL', '500')
  await expect(page.locator('#practice-error')).toContainText('of AAPL in Practice. Enter that much or less.')
  await expect(page.getByRole('button', { name: 'Review' })).toBeDisabled()
  await page.getByLabel('Amount in dollars').fill('50')
  await page.getByRole('button', { name: 'Review' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByText('You sold $50.00 of AAPL.')).toBeVisible()
  await expect(page.locator('.practice__sum')).toContainText('$850.00')

  // Time machine: chart and table show the same series.
  const frame = page.locator('.fl-chart').filter({ has: page.getByRole('heading', { name: 'Time machine' }) })
  const series = JSON.parse((await frame.locator('[data-series]').getAttribute('data-series'))!)[0] as number[]
  const tmFrom = load('practice').timeMachine.from
  expect(series.length).toBe(funds[0].history.weekly.filter((w: { date: string }) => w.date >= tmFrom).length)
  // Its prices' sources are credited: a stock in the mix, so the stock data note.
  await expect(page.getByText(/Prices on the days between are modeled\./)).toBeVisible()
  await frame.getByRole('button', { name: 'Show as table' }).click()
  expect(await frame.locator('tbody td:nth-child(2)').allInnerTexts()).toEqual(series.map(money))
  await expect(frame).toContainText('The past does not tell you what will happen next.')

  // Start over, with a confirmation.
  await page.getByRole('button', { name: 'Start over' }).click()
  const dlg = page.getByRole('dialog')
  await expect(dlg).toContainText('sets your practice money back to $1,000.')
  await dlg.getByRole('button', { name: 'Start over' }).click()
  await expect(page.getByText('Nothing yet. Buy a stock or crypto to start.')).toBeVisible()
  await expect(page.locator('.practice__sum')).toContainText('$1,000.00')
})

test('crypto in Practice is reviewed and owned as an amount of coins, not shares', async ({ page }) => {
  await page.goto('/practice')
  await order(page, 'Buy', 'BTC', '100')
  await page.getByRole('button', { name: 'Review' }).click()
  const coins = (Math.floor((100 / price('BTC')) * 1e8 + 1e-9) / 1e8).toFixed(8)
  await expect(page.getByText(`Buy $100.00 of BTC at ${money(price('BTC'))} for one BTC. That is about ${coins} BTC.`)).toBeVisible()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.locator('.practice__table tbody tr:visible, .practice__stack > li:visible')).toContainText(`${coins} BTC`)
  await expect(page.locator('.practice__table tbody tr:visible, .practice__stack > li:visible')).not.toContainText('shares')
})

test('the banner stays on screen while scrolling', async ({ page }) => {
  await page.goto('/practice')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  const box = (await page.getByRole('note').filter({ hasText: 'Practice money. Nothing here touches your account.' }).boundingBox())!
  expect(box.y).toBeGreaterThanOrEqual(0)
  expect(box.y + box.height).toBeLessThanOrEqual(900)
})

// Practice must never change Rosa's account: snapshot everything the account shows,
// run a full practice session, and compare. (The data is also frozen, so a write
// would throw and fail the guard.)
async function go(page: Page, link: string, h1: string) {
  await page.locator('.fl-rail').getByRole('link', { name: link }).click()
  await expect(page.locator('main h1').first()).toHaveText(h1)
}
async function readAccount(page: Page) {
  await go(page, 'Home', 'Home')
  const home = await page.locator('main').innerText()
  await go(page, 'Activity', 'Activity')
  const activity = await page.locator('main').innerText()
  await go(page, 'Investments', 'Your investments')
  const fundsText = await page.locator('main').innerText()
  return { home, activity, fundsText }
}
for (const scenario of ['normal', 'all-clear', 'brand-new']) {
  test(`a full practice session never changes the account (${scenario})`, async ({ page }) => {
    await page.goto(`/?scenario=${scenario}`)
    const before = await readAccount(page)
    await go(page, 'Practice', 'Practice')
    await order(page, 'Buy', 'TSLA', '400')
    await page.getByRole('button', { name: 'Review' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByRole('button', { name: 'New order' }).click()
    await order(page, 'Buy', 'BTC', '300')
    await page.getByRole('button', { name: 'Review' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByRole('button', { name: 'New order' }).click()
    await order(page, 'Sell', 'TSLA', '100')
    await page.getByRole('button', { name: 'Review' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    // Read it again, navigating within the app (a reload would reset the session and prove nothing).
    const after = await readAccount(page)
    expect(after).toEqual(before)
    expect(before.home.length).toBeGreaterThan(50)
  })
}
