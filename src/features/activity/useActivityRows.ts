import { computed, ref } from 'vue'
import type { Row } from '@/shared/activityText'
import { useScenario } from '@/shared/composables/useScenario'
import copy from './copy.json'

export type TypeFilter = 'all' | 'deposit' | 'buy' | 'dividend'

export const TYPE_OPTIONS: { id: TypeFilter; label: string }[] = [
  { id: 'all', label: copy.types.all },
  { id: 'deposit', label: copy.types.deposit },
  { id: 'buy', label: copy.types.buy },
  { id: 'dividend', label: copy.types.dividend },
]

// The filter lives at module scope, so it survives opening an item and coming back.
const type = ref<TypeFilter>('all')

/** Every activity row, newest first. Every row went through, so it filters by type only (Phase 6). */
export function useActivityRows() {
  const { activity } = useScenario()
  const all = computed<Row[]>(() => [...activity.value].reverse())
  const shown = computed(() => all.value.filter((r) => type.value === 'all' || r.type === type.value))
  function reset() {
    type.value = 'all'
  }
  const find = (id: string) => all.value.find((r) => r.id === id)
  return { all, shown, type, reset, find }
}
