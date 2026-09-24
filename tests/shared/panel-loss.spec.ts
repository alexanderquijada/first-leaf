import { test, expect } from '../fixtures'

// Rosa is up in every scenario, so no loss shows on the dark balance panel yet.
// This renders one (the same Money styles with the loss class) and measures it.
test.use({ viewport: { width: 1280, height: 800 } })

function contrast(fg: number[], bg: number[]) {
  const lum = (c: number[]) => {
    const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
    return 0.2126 * f(c[0]!) + 0.7152 * f(c[1]!) + 0.0722 * f(c[2]!)
  }
  const [a, b] = [lum(fg), lum(bg)]
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

test('a loss on the dark panel is readable (at least 4.5:1)', async ({ page }) => {
  await page.goto('/')
  // One element handle: a locator would re-find the next ".fl-money--up" after the change.
  const gain = (await page.locator('.balance .fl-money--up').first().elementHandle())!
  await gain.evaluate((el) => {
    el.classList.replace('fl-money--up', 'fl-money--down')
    el.textContent = 'Down $6.37'
  })
  const [fg, bg] = await gain.evaluate((el) => {
    const nums = (s: string) => s.match(/[\d.]+/g)!.slice(0, 3).map(Number)
    return [nums(getComputedStyle(el).color), nums(getComputedStyle(el.closest('.balance')!).backgroundColor)]
  })
  const ratio = contrast(fg!, bg!)
  test.info().annotations.push({ type: 'contrast', description: `loss ${fg} on panel ${bg}: ${ratio.toFixed(2)}:1` })
  console.log(`loss on panel: rgb(${fg}) on rgb(${bg}) = ${ratio.toFixed(2)}:1`)
  expect(ratio).toBeGreaterThanOrEqual(4.5)
})
