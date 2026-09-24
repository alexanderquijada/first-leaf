import { computed, ref } from 'vue'
import { describeActivity, type Row } from '@/shared/activityText'
import { useScenario } from '@/shared/composables/useScenario'
import { useSession } from '@/shared/composables/useSession'
import copy from './copy.json'

export type TypeFilter = 'all' | 'deposit' | 'buy' | 'dividend'
export type StatusFilter = 'all' | 'completed' | 'pending' | 'returned'

export const TYPE_OPTIONS: { id: TypeFilter; label: string }[] = [
  { id: 'all', label: copy.types.all },
  { id: 'deposit', label: copy.types.deposit },
  { id: 'buy', label: copy.types.buy },
  { id: 'dividend', label: copy.types.dividend },
]
export const STATUS_OPTIONS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: copy.statuses.all },
  { id: 'completed', label: copy.statuses.completed },
  { id: 'pending', label: copy.statuses.pending },
  { id: 'returned', label: copy.statuses.returned },
]

// Filters live at module scope, so they survive opening an item and coming back.
const type = ref<TypeFilter>('all')
const status = ref<StatusFilter>('all')

/** Every activity row, newest first, with this session's pending deposits on top. */
export function useActivityRows() {
  const { activity } = useScenario()
  const { pendingDeposits } = useSession()
  const all = computed<Row[]>(() => [...[...pendingDeposits.value].reverse(), ...[...activity.value].reverse()])
  const typeOf = (r: Row) => (r.status === 'pending' ? 'deposit' : r.type)
  const shown = computed(() =>
    all.value.filter(
      (r) =>
        (type.value === 'all' || typeOf(r) === type.value) &&
        (status.value === 'all' || describeActivity(r).status.toLowerCase() === status.value),
    ),
  )
  function reset() {
    type.value = 'all'
    status.value = 'all'
  }
  const find = (id: string) => all.value.find((r) => r.id === id)
  return { all, shown, type, status, reset, find }
}
