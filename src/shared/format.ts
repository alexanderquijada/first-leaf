// Date formatting in First Leaf's house style (AP-style abbreviations).

const MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
const DAYS = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.']

/** "2026-09-18" → "Sept. 18" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y!, m! - 1, d!))
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`
}

/** "2026-09-18" → "Fri., Sept. 18" */
export function formatDayDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y!, m! - 1, d!))
  return `${DAYS[date.getUTCDay()]}, ${formatDate(iso)}`
}

/** 1313.72 → "$1,313.72" (always cents, for account amounts). */
export function formatMoney(n: number): string {
  const abs = Math.abs(Math.round(n * 100) / 100)
  const s = abs.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return n < 0 && abs > 0 ? `−${s}` : s
}

/** Whole dollars in sentences: 150 → "$150"; anything with cents keeps them. */
export function formatMoneyShort(n: number): string {
  const r = Math.round(n * 100) / 100
  return Number.isInteger(r) ? `$${Math.abs(r).toLocaleString('en-US')}` : formatMoney(Math.abs(r))
}

/** A change in a sentence: "up $15.57", "down $5.88", "no change" (BRIEF.md §5). */
export function formatChange(n: number): string {
  const r = Math.round(n * 100) / 100
  return r > 0 ? `up ${formatMoney(r)}` : r < 0 ? `down ${formatMoney(-r)}` : 'no change'
}

/** A change in a table or chart label: "+$15.57", "−$5.88", "$0.00". */
export function formatSigned(n: number): string {
  const r = Math.round(n * 100) / 100
  return r > 0 ? `+${formatMoney(r)}` : r < 0 ? formatMoney(r) : formatMoney(0)
}

/** 0.9515 → "95%" */
export function formatPercent(x: number, digits = 0): string {
  return `${(x * 100).toFixed(digits)}%`
}
