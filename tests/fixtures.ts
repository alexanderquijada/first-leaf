import { test as base, expect, type Page } from '@playwright/test'

// Every spec imports { test, expect } from here, not from '@playwright/test'.
// An automatic guard fails any test that:
//   - logs a console error or throws an uncaught page error, or
//   - leaves NaN, undefined, null or [object Object] in the visible text
//     (as whole words), which means a value didn't render.
const BAD_TEXT = /\b(NaN|undefined|null)\b|\[object Object\]/

export const test = base.extend<{ guard: void }>({
  guard: [
    async ({ page }, use) => {
      const problems: string[] = []
      page.on('console', (m) => {
        if (m.type() === 'error') problems.push(`console error: ${m.text()}`)
      })
      page.on('pageerror', (e) => problems.push(`uncaught page error: ${e.message}`))

      await use()

      if (!page.isClosed()) {
        const text = await page.evaluate(() => document.body?.innerText ?? '').catch(() => '')
        const hit = text.match(BAD_TEXT)
        if (hit) {
          const i = hit.index ?? 0
          problems.push(`visible text contains "${hit[0]}": …${text.slice(Math.max(0, i - 40), i + 40).replace(/\s+/g, ' ')}…`)
        }
      }
      expect(problems, 'console errors, page errors or broken values on screen').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }

/** Waits until every animation that ends has ended, so sizes and colors are measured settled.
 * (An infinite one, such as a spinner, never finishes. Two frames first, so a transition
 * that starts on the next frame is counted.) */
export async function settle(page: Page) {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => undefined)),
    ),
  )
}
