// Time ranges for balance charts: 1M, 3M and Since March (the whole history).
import { copy } from '../copy'
import { meta } from '../data'

export type RangeId = '1m' | '3m' | 'all'
// Each button is named by its visible label (WCAG 2.5.3: a voice command can say "1 month").
export const RANGES: { id: RangeId; label: string }[] = [
  { id: '1m', ...copy.ranges['1m'] },
  { id: '3m', ...copy.ranges['3m'] },
  { id: 'all', ...copy.ranges.all },
]

function monthsBack(iso: string, n: number) {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCMonth(d.getUTCMonth() - n)
  return d.toISOString().slice(0, 10)
}

export function inRange<T extends { date: string }>(rows: T[], range: RangeId): T[] {
  if (range === 'all') return rows
  const from = monthsBack(meta.lastClose, range === '1m' ? 1 : 3)
  return rows.filter((r) => r.date >= from)
}
