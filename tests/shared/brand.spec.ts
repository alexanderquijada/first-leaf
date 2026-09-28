import { test, expect } from '../fixtures'

// Phase 6: the First Leaf logo (one fixed lockup: the seedling mark + the "First Leaf" wordmark),
// its favicons, and the renamed navigation ("Your Journey", "Finance Terms").
const nav = (page: import('@playwright/test').Page) => page.getByRole('navigation', { name: 'Main' })

async function expectLockup(link: import('@playwright/test').Locator) {
  await expect(link).toBeVisible()
  await expect(link).toHaveAccessibleName('First Leaf')
  await expect(link).toHaveAttribute('href', /\/$/)
  const mark = link.locator('svg.fl-logo__mark')
  await expect(mark).toHaveCount(1)
  await expect(mark).toHaveAttribute('aria-hidden', 'true')
  await expect(mark).toBeVisible()
  await expect(link.locator('.fl-logo__word')).toHaveText('First Leaf')
  // The mark sits beside the wordmark, on one line.
  const [m, w] = [(await mark.boundingBox())!, (await link.locator('.fl-logo__word').boundingBox())!]
  expect(m.x + m.width).toBeLessThanOrEqual(w.x)
  expect(Math.abs(m.y + m.height / 2 - (w.y + w.height / 2))).toBeLessThanOrEqual(6)
}

test.describe('laptop, 1280px', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('the rail shows the logo lockup, and it links to Home', async ({ page }) => {
    await page.goto('/activity')
    await expectLockup(page.locator('.fl-rail').getByRole('link', { name: 'First Leaf' }))
    await page.locator('.fl-rail').getByRole('link', { name: 'First Leaf' }).click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('the rail says "Your Journey" and "Finance Terms", and the page titles follow', async ({ page }) => {
    await page.goto('/')
    await nav(page).getByRole('link', { name: 'Your Journey' }).click()
    await expect(page).toHaveURL(/\/story$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your Journey')
    await expect(page).toHaveTitle('Your Journey · First Leaf')
    await nav(page).getByRole('link', { name: 'Finance Terms' }).click()
    await expect(page).toHaveURL(/\/learn$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Finance Terms')
    await expect(page).toHaveTitle('Finance Terms · First Leaf')
    await expect(page.getByText(/Your money story|Word of the day/)).toHaveCount(0)
    await expect(nav(page).getByRole('link', { name: /^(Words|Story)$/ })).toHaveCount(0)
  })
})

test.describe('tablet, 768px', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test('the top bar shows the logo lockup, and the tabs say "Your Journey" and "Finance Terms"', async ({ page }) => {
    await page.goto('/learn')
    await expectLockup(page.locator('.fl-topbar').getByRole('link', { name: 'First Leaf' }))
    await expect(page.locator('.fl-tabs')).toBeVisible()
    await expect(nav(page).getByRole('link', { name: 'Finance Terms' })).toHaveAttribute('aria-current', 'page')
    await expect(page).toHaveTitle('Finance Terms · First Leaf')
    await nav(page).getByRole('link', { name: 'Your Journey' }).click()
    await expect(page).toHaveTitle('Your Journey · First Leaf')
  })
})

test.describe('phone, 390px', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('the top bar shows the logo lockup; the tabs say Journey and Terms, the titles stay whole', async ({ page }) => {
    await page.goto('/')
    await expectLockup(page.locator('.fl-topbar').getByRole('link', { name: 'First Leaf' }))
    const bar = page.locator('.fl-bottombar')
    await bar.getByRole('link', { name: 'Terms', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Finance Terms')
    await expect(page).toHaveTitle('Finance Terms · First Leaf')
    await bar.getByRole('link', { name: 'Journey', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your Journey')
    await expect(page).toHaveTitle('Your Journey · First Leaf')
  })
})

test('the page head links the favicons and the apple-touch-icon, and each one loads', async ({ page, request }) => {
  await page.goto('/')
  const links = await page.locator('head link[rel="icon"], head link[rel="apple-touch-icon"]').evaluateAll((els) =>
    els.map((e) => ({ rel: e.getAttribute('rel'), href: e.getAttribute('href'), sizes: e.getAttribute('sizes'), type: e.getAttribute('type') })),
  )
  expect(links.map((l) => l.href).sort()).toEqual(['/apple-touch-icon.png', '/favicon-16.png', '/favicon-32.png', '/favicon.svg'])
  expect(links.find((l) => l.href === '/favicon.svg')!.type).toBe('image/svg+xml')
  expect(links.find((l) => l.href === '/favicon-32.png')!.sizes).toBe('32x32')
  expect(links.find((l) => l.href === '/favicon-16.png')!.sizes).toBe('16x16')
  expect(links.find((l) => l.href === '/apple-touch-icon.png')!.rel).toBe('apple-touch-icon')
  for (const { href } of links) {
    const res = await request.get(href!)
    expect(res.status(), href!).toBe(200)
    const type = res.headers()['content-type'] ?? ''
    expect(type, href!).toContain(href!.endsWith('.svg') ? 'image/svg+xml' : 'image/png')
    expect((await res.body()).length, href!).toBeGreaterThan(100)
  }
  // The PNGs are the sizes they say they are.
  for (const [href, size] of [['/favicon-16.png', 16], ['/favicon-32.png', 32], ['/apple-touch-icon.png', 180]] as const) {
    const dims = await page.evaluate(async (src) => {
      const img = new Image()
      img.src = src
      await img.decode()
      return [img.naturalWidth, img.naturalHeight]
    }, href)
    expect(dims, href).toEqual([size, size])
  }
})
