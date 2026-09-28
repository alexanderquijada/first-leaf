// Plain words for an activity row, used by Activity (laptop) and the phone Home.
import type { ActivityItem } from './data'
import { copy, fill } from './copy'

const A = copy.activity

export type Row = ActivityItem

type Status = 'Completed'
const LABEL: Record<Status, string> = { Completed: A.status.completed }

/** What an activity row was, and its status in words. Every row in the data went through (Phase 6). */
export function describeActivity(a: Row): { what: string; status: Status; label: string } {
  const out = (what: string, status: Status) => ({ what, status, label: LABEL[status] })
  if (a.type === 'deposit') return out(a.kind === 'first' ? A.firstDeposit : A.monthlyDeposit, 'Completed')
  if (a.type === 'buy') return out(fill(A.bought, { ticker: a.ticker }), 'Completed')
  return out(fill(A.dividend, { ticker: a.ticker }), 'Completed')
}
