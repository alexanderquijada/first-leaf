// Test helper: read the real data files, so tests assert what the screen shows
// against the data, not against numbers copied into the test.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'shared', 'data')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = (name: string): any => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'))

export const money = (n: number) =>
  `$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
export const moneyShort = (n: number) => (Number.isInteger(n) ? `$${n.toLocaleString('en-US')}` : money(n))

export const SCENARIOS = [
  { id: 'normal', file: 'account' },
  { id: 'all-clear', file: 'account-all-clear' },
  { id: 'brand-new', file: 'account-new' },
] as const

const AP_MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
/** "2026-05-27" → "May 27", the app's date style. */
export const apDate = (iso: string) => `${AP_MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}`
