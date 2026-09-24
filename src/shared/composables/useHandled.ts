import { computed, ref } from 'vue'
import type { AttentionFlag } from '../data'
import { useScenario } from './useScenario'

// Module scope: handled alerts survive navigation and reset on reload.
// Keyed by account, so each scenario keeps its own list.
const handled = ref<string[]>([])
const key = (accountId: string, alertId: string) => `${accountId}:${alertId}`

/** "Mark as handled" with Undo, for the current account's alerts. */
export function useHandled() {
  const { account, attention } = useScenario()

  const isHandled = (id: string) => handled.value.includes(key(account.value.id, id))
  const open = computed(() => attention.value.filter((a) => !isHandled(a.id)))
  const done = computed(() => attention.value.filter((a) => isHandled(a.id)))

  function markHandled(alert: AttentionFlag) {
    const k = key(account.value.id, alert.id)
    if (!handled.value.includes(k)) handled.value = [...handled.value, k]
  }
  function undo(alert: AttentionFlag) {
    const k = key(account.value.id, alert.id)
    handled.value = handled.value.filter((x) => x !== k)
  }

  return { isHandled, open, done, markHandled, undo }
}
