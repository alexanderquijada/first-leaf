// Plain words for an activity row, used by Activity (laptop) and the phone Home.
import type { ActivityItem } from './data'
import type { PendingDeposit } from './composables/useSession'
import { copy, fill } from './copy'

const A = copy.activity

export type Row = ActivityItem | PendingDeposit

type Status = 'Completed' | 'Returned' | 'Pending'
const LABEL: Record<Status, string> = { Completed: A.status.completed, Returned: A.status.returned, Pending: A.status.pending }

/** What an activity row was, its status (a key used by the filters) and that status in words. */
export function describeActivity(a: Row): { what: string; status: Status; label: string } {
  const out = (what: string, status: Status) => ({ what, status, label: LABEL[status] })
  if (a.status === 'pending') return out(a.kind === 'one-time' ? A.oneTimeDeposit : A.retriedDeposit, 'Pending')
  const status: Status = a.status === 'returned' ? 'Returned' : 'Completed'
  if (a.type === 'deposit') return out(a.kind === 'first' ? A.firstDeposit : A.monthlyDeposit, status)
  if (a.type === 'buy') return out(fill(A.bought, { ticker: a.ticker }), status)
  return out(fill(A.dividend, { ticker: a.ticker }), status)
}
