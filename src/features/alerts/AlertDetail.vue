<script setup lang="ts">
// One alert: what happened, the facts behind it, what it means (its words), and
// what you can do (a realistic money flow, or a link), then Mark as handled.
import { computed, ref, watch } from 'vue'
import MoneyActionFlow from '@/shared/components/MoneyActionFlow.vue'
import SeverityBadge from '@/shared/components/SeverityBadge.vue'
import TermTip from '@/shared/components/TermTip.vue'
import { useGlossary } from '@/shared/composables/useGlossary'
import { useHandled } from '@/shared/composables/useHandled'
import { useScenario } from '@/shared/composables/useScenario'
import { useSession } from '@/shared/composables/useSession'
import type { AttentionFlag } from '@/shared/data'
import { formatDate, formatMoney } from '@/shared/format'

const props = withDefaults(defineProps<{ alert: AttentionFlag; headingLevel?: 1 | 2 }>(), { headingLevel: 2 })

const { account, activity } = useScenario()
const { getTerm } = useGlossary()
const { isHandled, markHandled, undo } = useHandled()
const { markSeen, autoInvestOn } = useSession()

watch(() => props.alert.id, (id) => markSeen(id), { immediate: true })

const terms = computed(() => props.alert.terms.map((t) => getTerm(t)).filter((t) => t !== undefined))
const flowOpen = ref(false)
const status = ref('')

// The facts behind each kind of alert, shown as label / value rows.
const facts = computed<{ label: string; value: string }[]>(() => {
  const a = props.alert, acc = account.value
  if (a.id === 'deposit-returned') {
    const d = activity.value.find((x) => x.id === a.activityId)
    return d && d.type === 'deposit'
      ? [
          { label: 'Amount', value: formatMoney(d.amount) },
          { label: 'Asked for on', value: formatDate(d.date) },
          { label: 'Sent back on', value: d.returnedDate ? formatDate(d.returnedDate) : '' },
          { label: 'Status', value: 'Returned' },
        ]
      : []
  }
  if (a.id === 'goal-behind' && acc.goal)
    return [
      { label: 'Your plan by now', value: formatMoney(acc.goal.plannedMoneyInToDate) },
      { label: 'Put in so far', value: formatMoney(acc.goal.actualMoneyInToDate) },
      { label: 'Behind by', value: formatMoney(acc.goal.behindBy) },
    ]
  if (a.id === 'cash-sitting')
    return [
      { label: 'Cash', value: formatMoney(acc.cash) },
      { label: 'Waiting since', value: acc.cashSince ? formatDate(acc.cashSince) : '' },
      { label: 'Auto-invest', value: autoInvestOn.value ? 'On' : acc.autoInvest.pausedOn ? `Paused since ${formatDate(acc.autoInvest.pausedOn)}` : 'Off' },
    ]
  if (a.id === 'fee-going-up' && a.feeFrom !== undefined && a.feeTo !== undefined)
    return [
      { label: 'Yearly fee now', value: `${a.feeFrom.toFixed(2)}%` },
      { label: `From ${formatDate(a.date)}`, value: `${a.feeTo.toFixed(2)}%` },
      { label: 'Change', value: `+${(a.feeTo - a.feeFrom).toFixed(2)} percentage points` },
      { label: 'About', value: `${formatMoney(a.amount)} more a year` },
    ]
  if (a.id === 'dividend-paid')
    return [
      { label: 'Amount', value: formatMoney(a.amount) },
      { label: 'Fund', value: a.ticker ?? '' },
      { label: 'Paid on', value: formatDate(a.date) },
    ]
  return []
})

function handle() {
  markHandled(props.alert)
  status.value = 'Marked as handled.'
}
function unhandle() {
  undo(props.alert)
  status.value = 'Moved back to your alerts.'
}
</script>

<template>
  <article class="adetail" :aria-labelledby="`adetail-${alert.id}`">
    <p class="adetail__badges">
      <SeverityBadge :severity="alert.severity" />
      <span v-if="alert.newSinceLastReview" class="adetail__new">New</span>
    </p>
    <component :is="`h${headingLevel}`" :id="`adetail-${alert.id}`" class="adetail__title">{{ alert.title }}</component>

    <h3 class="adetail__h">What happened</h3>
    <p>{{ alert.body }}</p>
    <dl v-if="facts.length" class="adetail__facts">
      <div v-for="f in facts" :key="f.label">
        <dt>{{ f.label }}</dt>
        <dd class="fl-tabular">{{ f.value }}</dd>
      </div>
    </dl>

    <h3 class="adetail__h">What it means</h3>
    <ul class="adetail__terms">
      <li v-for="t in terms" :key="t.id"><TermTip :id="t.id">{{ t.term }}</TermTip>: {{ t.short }}</li>
    </ul>

    <h3 class="adetail__h">What you can do</h3>
    <p>{{ alert.nextStep }}</p>
    <div class="adetail__actions">
      <template v-if="alert.action">
        <RouterLink
          v-if="alert.action.kind === 'open-fund' && alert.ticker"
          :to="`/funds/${alert.ticker}`"
          class="adetail__btn is-primary"
          >{{ alert.action.label }}</RouterLink
        >
        <button v-else type="button" class="adetail__btn is-primary" @click="flowOpen = true">
          {{ alert.action.label }}
        </button>
      </template>
      <button v-if="!isHandled(alert.id)" type="button" class="adetail__btn" @click="handle">Mark as handled</button>
      <template v-else>
        <span class="adetail__handled"><span class="mdi mdi-check" aria-hidden="true" /> Handled</span>
        <button type="button" class="adetail__btn" @click="unhandle">Undo</button>
      </template>
    </div>
    <p class="fl-visually-hidden" role="status">{{ status }}</p>
    <slot name="after" />
    <MoneyActionFlow v-if="alert.action && alert.action.kind !== 'open-fund'" v-model="flowOpen" :alert="alert" />
  </article>
</template>

<style scoped>
.adetail p {
  margin: 8px 0 0;
  line-height: 1.6;
}

.adetail__badges {
  display: flex;
  align-items: center;
  gap: 8px;
}

.adetail__new {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--color-ink);
  color: var(--color-paper);
  font-size: 0.8125rem;
  font-weight: 700;
}

.adetail__title {
  margin-top: 8px;
  font-size: clamp(1.5rem, 3vw, 2rem);
}

.adetail__h {
  margin-top: 24px;
  font-family: var(--font-ui);
  font-size: 1rem;
  font-weight: 700;
  text-transform: none;
}

.adetail__facts {
  margin: 12px 0 0;
  max-width: 480px;
  border-top: 1px solid var(--color-mint);
}

.adetail__facts > div {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-mint);
}

.adetail__facts dt {
  color: var(--color-ink-muted);
}

.adetail__facts dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
}

.adetail__terms {
  margin: 8px 0 0;
  padding-left: 1.2em;
  line-height: 1.6;
}

.adetail__terms li + li {
  margin-top: 6px;
}

.adetail__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.adetail__btn {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 18px;
  border: 1px solid var(--color-forest);
  border-radius: 4px;
  background: var(--color-paper);
  color: var(--color-forest);
  font: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.adetail__btn.is-primary {
  background: var(--color-forest);
  color: var(--color-paper);
}

.adetail__handled {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  color: var(--color-forest);
}
</style>
