import { computed, ref } from 'vue'
import type { AccountId } from '../data'
import { useScenario } from './useScenario'

// Module scope: what Rosa did this session (settings she changed, alerts she opened). The
// data files never change; reloading the page starts a fresh session.

export interface SessionBeneficiary {
  name: string
  relationship: string
}

const beneficiaries = ref<Partial<Record<AccountId, SessionBeneficiary>>>({})
const seen = ref<string[]>([])

export function useSession() {
  const { account } = useScenario()
  const id = () => account.value.id

  /** The beneficiary she named this visit (Phase 6), if any. Kept for this visit only. */
  const sessionBeneficiary = computed(() => beneficiaries.value[id()] ?? null)
  function setBeneficiary(b: SessionBeneficiary) {
    beneficiaries.value = { ...beneficiaries.value, [id()]: b }
  }
  function clearBeneficiary() {
    const rest = { ...beneficiaries.value }
    delete rest[id()]
    beneficiaries.value = rest
  }

  /** Alerts she has opened this session (the phone shows them as "Seen"). */
  const isSeen = (alertId: string) => seen.value.includes(`${id()}:${alertId}`)
  function markSeen(alertId: string) {
    const k = `${id()}:${alertId}`
    if (!seen.value.includes(k)) seen.value = [...seen.value, k]
  }

  return { sessionBeneficiary, setBeneficiary, clearBeneficiary, isSeen, markSeen }
}
