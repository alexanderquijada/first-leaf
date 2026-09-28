import { test, expect, settle } from '../fixtures'

// F2: see what needs me. The beneficiary alert (Phase 6) opens as its own phone page with its
// finance terms as 48px chips; going back shows it as Seen.
test.use({ viewport: { width: 390, height: 844 } })

const home = (page: import('@playwright/test').Page) =>
  page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click()

test('the needs-you card opens the beneficiary alert as a full page, and it then shows as Seen', async ({ page }) => {
  await page.goto('/')
  await page.locator('.phome__needs .phome__top').click()
  await expect(page).toHaveURL(/\/alerts\/beneficiary-missing$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Name a beneficiary for your account')
  for (const h of ['What happened', 'What it means', 'What you can do']) await expect(page.getByRole('heading', { name: h })).toBeVisible()
  await expect(page.locator('main')).toContainText('A beneficiary is the person who gets the money in your account if you die.')
  await expect(page.locator('main')).toContainText('You can add one now, or be reminded later. It takes about a minute.')
  const chips = page.getByRole('region', { name: 'Finance terms on this screen' }).locator('.fl-termtip__button')
  await expect(chips).toHaveText(['Beneficiary', 'Brokerage account'])
  for (const b of await chips.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
    expect(b.height).toBeGreaterThanOrEqual(48)
    expect(b.width).toBeGreaterThanOrEqual(48)
  }
  await expect(page.getByText('Words on this screen')).toHaveCount(0)
  // Every standalone control on the page is at least 48px tall.
  const btns = page.locator('.adetail__btn')
  await expect(btns).toHaveText(['Add a beneficiary', 'Remind me later'])
  for (const b of await btns.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
    expect(b.height).toBeGreaterThanOrEqual(48)
  }
  await page.goBack()
  await expect(page.locator('.phome__needs .phome__top')).toContainText('Seen')
  await page.locator('.phome__needs .phome__top').click()
  await page.getByRole('link', { name: 'All alerts' }).click()
  await expect(page.getByRole('link', { name: /Name a beneficiary/ })).toContainText('Seen')
})

test('Add a beneficiary: a short sheet, then the alert moves to Handled and Home says nothing needs you', async ({ page }) => {
  await page.goto('/')
  await page.locator('.phome__needs .phome__top').click()
  await page.getByRole('button', { name: 'Add a beneficiary' }).click()
  const sheet = page.getByRole('dialog', { name: 'Add a beneficiary' })
  await expect(sheet).toBeVisible()
  // Saving with nothing typed says what is missing.
  await sheet.getByRole('button', { name: 'Save' }).click()
  await expect(sheet).toContainText('Enter their name.')
  await expect(sheet).toContainText('Enter how you know them.')
  await settle(page) // a dialog caught mid-open measures smaller than it is
  for (const b of await sheet.locator('input, button').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(b).toBeGreaterThanOrEqual(48)
  await sheet.getByLabel('Name').fill('Ana Ruiz')
  await sheet.getByLabel('Relationship').fill('sister')
  await sheet.getByRole('button', { name: 'Save' }).click()
  await expect(sheet).toContainText('Saved. Ana Ruiz is now the beneficiary of your account.')
  await sheet.getByRole('button', { name: 'Done' }).click()
  await expect(sheet).toBeHidden()
  await expect(page.locator('main')).toContainText('Ana Ruiz, sister')
  await expect(page.locator('.adetail__handled')).toContainText('Handled')
  await expect(page.getByRole('button', { name: 'Undo' })).toBeVisible()
  await home(page)
  await expect(page.locator('.phome__needs-title')).toHaveText('Nothing needs you right now.')
})

test('Remind me later on the phone moves it to Handled, and Undo brings it back', async ({ page }) => {
  await page.goto('/')
  await page.locator('.phome__needs .phome__top').click()
  await page.getByRole('button', { name: 'Remind me later' }).click()
  await expect(page.locator('.adetail__handled')).toContainText('Handled')
  await home(page)
  await expect(page.locator('.phome__needs-title')).toHaveText('Nothing needs you right now.')
  await page.goBack()
  await page.getByRole('button', { name: 'Undo' }).click()
  await home(page)
  await expect(page.locator('.phome__needs-title')).toHaveText('1 thing needs you')
})

// Every standalone control on the phone is at least 48 × 48px (inline terms in
// sentences use WCAG 2.5.8's inline exception and are listed as chips).
test('every standalone control on the phone pages is at least 48px tall', async ({ page }) => {
  const small: string[] = []
  for (const path of ['/', '/alerts', '/alerts/beneficiary-missing', '/story', '/story#section-2', '/story#section-3', '/story#section-4', '/activity', '/activity/rosa-starter-035', '/funds', '/funds/AAPL', '/funds/BTC', '/practice', '/learn', '/learn/volatility']) {
    await page.goto(path)
    const show = page.getByRole('button', { name: 'Show as table' })
    if (await show.count()) await show.first().click()
    const found = await page.evaluate(() =>
      [...document.querySelectorAll('main button, main a[href], main input, nav a[href]')]
        .filter((e) => !e.classList.contains('fl-termtip__button') || e.closest('.chips, .phome__word-actions'))
        .filter((e) => (e as HTMLElement).offsetParent !== null)
        // A radio or checkbox inside its label is tapped through the label: measure that.
        .map((e) => (e.matches('input[type=radio], input[type=checkbox]') && e.closest('label') ? e.closest('label')! : e))
        .map((e) => ({ name: (e.textContent || (e as HTMLInputElement).value || '').trim().slice(0, 30), h: e.getBoundingClientRect().height }))
        .filter((x) => x.h < 47.5),
    )
    small.push(...found.map((x) => `${path}: "${x.name}" is ${x.h.toFixed(1)}px`))
  }
  expect(small).toEqual([])
})
