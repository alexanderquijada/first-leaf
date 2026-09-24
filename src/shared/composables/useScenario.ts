import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
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
 * The current scenario and ITS account. Scenarios are reached by URL only
 * (?scenario=normal|all-clear|brand-new); there is no menu on screen. An unknown
 * value falls back to "normal". The router keeps ?scenario on every link.
 */
export function useScenario() {
  const route = useRoute()

  watch(
    () => route.query.scenario,
    (q) => {
      if (q === undefined) return // keep the current choice across navigation
      scenarioId.value = isScenarioId(q) ? q : DEFAULT
    },
    { immediate: true },
  )

  return { scenarioId, scenario, account, attention, activity }
}
