// Plain words for an activity row, used by Activity (laptop) and the phone Home.
import type { ActivityItem } from './data'
import type { PendingDeposit } from './composables/useSession'

export type Row = ActivityItem | PendingDeposit

export function describeActivity(a: Row): { what: string; status: 'Completed' | 'Returned' | 'Pending' } {
  if (a.status === 'pending') return { what: a.kind === 'one-time' ? 'One-time deposit' : 'Deposit, tried again', status: 'Pending' }
  const status = a.status === 'returned' ? 'Returned' : 'Completed'
  if (a.type === 'deposit') return { what: a.kind === 'first' ? 'First deposit' : 'Monthly deposit', status }
  if (a.type === 'buy') return { what: `Bought ${a.ticker}`, status }
  return { what: `${a.ticker} paid you`, status }
}
