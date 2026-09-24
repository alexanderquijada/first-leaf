import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getAccount,
  getActivity,
  getAttention,
  getScenario,
  scenarios,
  type ScenarioId,
} from '../data'

// Module scope on purpose: the chosen demo scenario survives navigation
// between pages, even when a link doesn't carry ?scenario=.
const DEFAULT: ScenarioId = 'normal'
const scenarioId = ref<ScenarioId>(DEFAULT)

const isScenarioId = (v: unknown): v is ScenarioId =>
  typeof v === 'string' && scenarios.some((s) => s.id === v)

const scenario = computed(() => getScenario(scenarioId.value) ?? scenarios[0]!)
const account = computed(() => getAccount(scenario.value.accountId))
const attention = computed(() => getAttention(scenario.value.accountId))
const activity = computed(() => getActivity(scenario.value.accountId))

/**
 * The current demo scenario and ITS account. Reads ?scenario=normal|all-clear|brand-new
 * from the URL. An unknown value falls back to the main demo ("normal").
 */
export function useScenario() {
  const route = useRoute()
  const router = useRouter()

  watch(
    () => route.query.scenario,
    (q) => {
      if (q === undefined) return // keep the current choice across navigation
      scenarioId.value = isScenarioId(q) ? q : DEFAULT
    },
    { immediate: true },
  )

  function setScenario(id: ScenarioId) {
    scenarioId.value = id
    router.replace({ query: { ...route.query, scenario: id } })
  }

  return { scenarios, scenarioId, scenario, account, attention, activity, setScenario }
}
