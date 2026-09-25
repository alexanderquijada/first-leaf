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
import { getFund, type AttentionFlag } from '@/shared/data'
import CopyText from '@/shared/components/CopyText.vue'
import { copy as shared, fill } from '@/shared/copy'
import { formatChange, formatDate, formatMoney } from '@/shared/format'
import copy from './copy.json'

const F = copy.facts

const props = withDefaults(defineProps<{ alert: AttentionFlag; headingLevel?: 1 | 2 }>(), { headingLevel: 2 })

const { account, activity } = useScenario()
const { getTerm } = useGlossary()
const { isHandled, markHandled, undo } = useHandled()
const { markSeen, autoInvestOn, autoInvestChanged, pendingDeposits } = useSession()

// An action already taken this session isn't offered again (P301 brief, edge cases): after
// "Try the deposit again" the alert shows the new deposit as pending, and after auto-invest
// is turned on, the cash alert says it is on now.
const retry = computed(() => (props.alert.id === 'deposit-returned' ? pendingDeposits.value.find((p) => p.kind === 'retry') : undefined))
const oneTime = computed(() => (props.alert.id === 'goal-behind' ? pendingDeposits.value.find((p) => p.kind === 'one-time') : undefined))
const autoTurnedOn = computed(() => props.alert.id === 'cash-sitting' && autoInvestChanged.value && autoInvestOn.value)
// What the done action changed, shown in place of "What you can do" and its button.
const doneLine = computed(() =>
  retry.value || oneTime.value ? shared.deposit.confirmation : autoTurnedOn.value ? shared.moneyFlow.autoOnNow : '',
)
// Doing the action handles the alert (Undo stays available), so "needs you" stops counting it.
watch(doneLine, (line) => {
  if (line && !isHandled(props.alert.id)) markHandled(props.alert)
})

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
          { label: F.amount, value: formatMoney(d.amount) },
          { label: F.askedOn, value: formatDate(d.date) },
          { label: F.sentBackOn, value: d.returnedDate ? formatDate(d.returnedDate) : '' },
          { label: F.status, value: F.returned },
          ...(retry.value ? [{ label: F.triedAgain, value: fill(F.pendingSince, { date: formatDate(retry.value.date) }) }] : []),
        ]
      : []
  }
  if (a.id === 'goal-behind' && acc.goal)
    return [
      { label: F.planByNow, value: formatMoney(acc.goal.plannedMoneyInToDate) },
      { label: F.putInSoFar, value: formatMoney(acc.goal.actualMoneyInToDate) },
      { label: F.behindBy, value: formatMoney(acc.goal.behindBy) },
    ]
  if (a.id === 'cash-sitting')
    return [
      { label: F.cash, value: formatMoney(acc.cash) },
      { label: F.waitingSince, value: acc.cashSince ? formatDate(acc.cashSince) : '' },
      { label: F.autoInvest, value: autoInvestOn.value ? F.on : acc.autoInvest.pausedOn ? fill(F.pausedSince, { date: formatDate(acc.autoInvest.pausedOn) }) : F.off },
    ]
  if (a.id.startsWith('big-move-') && a.ticker && a.movePercent !== undefined && acc.weeklyChange) {
    const w = acc.weeklyChange, f = getFund(a.ticker), change = w.byFund.find((x) => x.ticker === a.ticker)?.change ?? 0
    const close = (d: string) => f?.history.daily.find((x) => x.date === d)?.close ?? 0
    return [
      { label: fill(F.priceOn, { date: formatDate(w.from) }), value: formatMoney(close(w.from)) },
      { label: fill(F.priceOn, { date: formatDate(w.to) }), value: formatMoney(close(w.to)) },
      { label: F.move, value: fill(F.moveValue, { direction: a.movePercent >= 0 ? F.up : F.down, pct: (Math.abs(a.movePercent) * 100).toFixed(1) }) },
      { label: F.yourChange, value: formatChange(change) },
    ]
  }
  if (a.id === 'dividend-paid')
    return [
      { label: F.amount, value: formatMoney(a.amount) },
      { label: F.fund, value: a.ticker ?? '' },
      { label: F.paidOn, value: formatDate(a.date) },
    ]
  return []
})

function handle() {
  markHandled(props.alert)
  status.value = copy.markedStatus
}
function unhandle() {
  undo(props.alert)
  status.value = copy.undoneStatus
}
</script>

<template>
  <article class="adetail" :aria-labelledby="`adetail-${alert.id}`">
    <p class="adetail__badges">
      <SeverityBadge :severity="alert.severity" />
      <span v-if="alert.newSinceLastReview" class="adetail__new">{{ copy.new }}</span>
    </p>
    <component :is="`h${headingLevel}`" :id="`adetail-${alert.id}`" class="adetail__title">{{ alert.title }}</component>

    <h3 class="adetail__h">{{ copy.whatHappened }}</h3>
    <!-- After auto-invest is turned on, "has been paused" would be false: tell the past as past. -->
    <p v-if="autoTurnedOn && account.autoInvest.pausedOn">{{ fill(copy.pausedUntilToday, { date: formatDate(account.autoInvest.pausedOn) }) }}</p>
    <p v-else>{{ alert.body }}</p>
    <dl v-if="facts.length" class="adetail__facts">
      <div v-for="f in facts" :key="f.label">
        <dt>{{ f.label }}</dt>
        <dd class="fl-tabular">{{ f.value }}</dd>
      </div>
    </dl>

    <h3 class="adetail__h">{{ copy.whatItMeans }}</h3>
    <ul class="adetail__terms">
      <li v-for="t in terms" :key="t.id"><CopyText :text="copy.termLine" :values="{ short: t.short }"><template #term><TermTip :id="t.id">{{ t.term }}</TermTip></template></CopyText></li>
    </ul>

    <h3 class="adetail__h">{{ copy.whatYouCanDo }}</h3>
    <p v-if="doneLine" class="adetail__now">{{ doneLine }}</p>
    <p v-else>{{ alert.nextStep }}</p>
    <div class="adetail__actions">
      <template v-if="alert.action && !doneLine">
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
      <button v-if="!isHandled(alert.id)" type="button" class="adetail__btn" @click="handle">{{ copy.markHandled }}</button>
      <template v-else>
        <span class="adetail__handled"><span class="mdi mdi-check" aria-hidden="true" /> {{ copy.handled }}</span>
        <button type="button" class="adetail__btn" @click="unhandle">{{ copy.undo }}</button>
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

.adetail__now {
  margin: 8px 0 0;
  font-weight: 600;
  color: var(--color-forest);
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
  flex-wrap: wrap; /* with large text a long value moves under its label */
  justify-content: space-between;
  gap: 24px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-mint);
}

.adetail__facts dt {
  color: var(--color-ink-muted);
}

.adetail__facts dd {
  margin: 0 0 0 auto;
  overflow-wrap: anywhere;
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
  border-radius: 999px;
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
