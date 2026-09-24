// Time ranges for balance charts: 1M, 3M and Since March (the whole history).
import { meta } from '../data'

export type RangeId = '1m' | '3m' | 'all'
export const RANGES: { id: RangeId; label: string; name: string }[] = [
  { id: '1m', label: '1M', name: 'Last month' },
  { id: '3m', label: '3M', name: 'Last 3 months' },
  { id: 'all', label: 'Since March', name: 'Since March' },
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
