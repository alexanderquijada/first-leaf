import { test, expect } from '../fixtures'

// F2: see what needs me. The alert opens as its own phone page with its words as
// 48px chips; going back shows it as Seen.
test.use({ viewport: { width: 390, height: 844 } })

test('the needs-you card opens the alert as a full page, and it then shows as Seen', async ({ page }) => {
  await page.goto('/')
  await page.locator('.phome__top').click()
  await expect(page).toHaveURL(/\/alerts\/deposit-returned$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your $150 deposit from Sept. 1 was sent back')
  for (const h of ['What happened', 'What it means', 'What you can do']) await expect(page.getByRole('heading', { name: h })).toBeVisible()
  const chips = page.getByRole('region', { name: 'Words on this screen' }).locator('.fl-termtip__button')
  await expect(chips).toHaveText(['Returned deposit', 'Recurring deposit'])
  for (const b of await chips.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
    expect(b.height).toBeGreaterThanOrEqual(48)
    expect(b.width).toBeGreaterThanOrEqual(48)
  }
  // Every standalone control on the page is at least 48px tall.
  for (const b of await page.locator('.adetail__btn').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
    expect(b.height).toBeGreaterThanOrEqual(48)
  }
  await page.goBack()
  await expect(page.locator('.phome__top')).toContainText('Seen')
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click()
  await page.locator('.phome__more').click()
  await expect(page.getByRole('link', { name: /deposit from Sept. 1/ })).toContainText('Seen')
})

test('the same realistic flow works on the phone', async ({ page }) => {
  await page.goto('/alerts/deposit-returned')
  await page.getByRole('button', { name: 'Try the deposit again' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Confirm deposit' }).click()
  await expect(page.getByRole('dialog')).toContainText('Deposit requested. It usually arrives in 1–3 business days.')
  await page.getByRole('dialog').getByRole('button', { name: 'Done' }).click()
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click()
  await expect(page.locator('.phome__latest li').first()).toContainText('Pending')
})

test('Mark as handled on the phone updates the needs-you card', async ({ page }) => {
  await page.goto('/alerts/deposit-returned')
  await page.getByRole('button', { name: 'Mark as handled' }).click()
  await page.getByRole('link', { name: 'All alerts' }).click()
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click()
  await expect(page.locator('.phome__needs-title')).toHaveText('3 heads-ups')
})

// Every standalone control on the phone is at least 48 × 48px (inline words in
// sentences use WCAG 2.5.8's inline exception and are listed as chips).
test('every standalone control on the phone pages is at least 48px tall', async ({ page }) => {
  const small: string[] = []
  for (const path of ['/', '/alerts', '/alerts/deposit-returned', '/story', '/activity']) {
    await page.goto(path)
    const show = page.getByRole('button', { name: 'Show as table' })
    if (await show.count()) await show.first().click()
    const found = await page.evaluate(() =>
      [...document.querySelectorAll('main button, main a[href], main input, nav a[href]')]
        .filter((e) => !e.classList.contains('fl-termtip__button') || e.closest('.chips, .phome__word-actions'))
        .filter((e) => (e as HTMLElement).offsetParent !== null)
        .map((e) => ({ name: (e.textContent || (e as HTMLInputElement).value || '').trim().slice(0, 30), h: e.getBoundingClientRect().height }))
        .filter((x) => x.h < 47.5),
    )
    small.push(...found.map((x) => `${path}: "${x.name}" is ${x.h.toFixed(1)}px`))
  }
  expect(small).toEqual([])
})
