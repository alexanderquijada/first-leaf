import { computed, ref } from 'vue'
import type { AccountId } from '../data'
import { meta } from '../data'
import { useScenario } from './useScenario'

// Module scope: what Rosa did this session (money actions and settings). The data
// files never change; reloading the page starts a fresh session.

export interface PendingDeposit {
  id: string
  accountId: AccountId
  /** The day she asked for it (the app's "today"). */
  date: string
  amount: number
  kind: 'retry' | 'one-time'
  status: 'pending'
}

const pending = ref<PendingDeposit[]>([])
const autoInvest = ref<Partial<Record<AccountId, boolean>>>({})
const seen = ref<string[]>([])
let n = 0

export function useSession() {
  const { account } = useScenario()
  const id = () => account.value.id

  const pendingDeposits = computed(() => pending.value.filter((p) => p.accountId === id()))
  function requestDeposit(amount: number, kind: PendingDeposit['kind']) {
    pending.value = [
      ...pending.value,
      { id: `session-deposit-${++n}`, accountId: id(), date: meta.asOf, amount, kind, status: 'pending' },
    ]
  }

  /** Auto-invest as it stands now: her change this session, or the account's setting. */
  const autoInvestOn = computed(() => autoInvest.value[id()] ?? account.value.autoInvest.on)
  const autoInvestChanged = computed(() => autoInvest.value[id()] !== undefined)
  function setAutoInvest(on: boolean) {
    autoInvest.value = { ...autoInvest.value, [id()]: on }
  }

  /** Alerts she has opened this session (the phone shows them as "Seen"). */
  const isSeen = (alertId: string) => seen.value.includes(`${id()}:${alertId}`)
  function markSeen(alertId: string) {
    const k = `${id()}:${alertId}`
    if (!seen.value.includes(k)) seen.value = [...seen.value, k]
  }

  return { pendingDeposits, requestDeposit, autoInvestOn, autoInvestChanged, setAutoInvest, isSeen, markSeen }
}
