<script setup lang="ts">
// Section 2, "The dip in <month>": what happened, and that auto-invest kept buying through it.
// It describes only; it never suggests what anyone should do (G3). One chart, with the events.
import { computed, ref } from 'vue'
import BalanceChart, { type ChartEvent } from '@/shared/charts/BalanceChart.vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import CopyText from '@/shared/components/CopyText.vue'
import TermTip from '@/shared/components/TermTip.vue'
import type { Account, RosaStory } from '@/shared/data'
import { fill } from '@/shared/copy'
import { formatDate, formatMoney, formatSigned } from '@/shared/format'
import copy from './copy.json'

const D = copy.dip

const props = defineProps<{ story: RosaStory; account: Account }>()
const f = computed(() => props.story.facts)
// At most 60 words: the fall, and that auto-invest kept buying (both checked claims, R2 and R3).
const claims = computed(() => ['dip', 'kept-buying'].map((id) => props.story.claims.find((c) => c.id === id)).filter((c) => c !== undefined))
const showEvents = ref(true)
const from = computed(() => f.value.dip.window.from)
const points = computed(() => props.account.history.filter((r) => r.date >= from.value))

const events = computed<ChartEvent[]>(() => {
  const x = f.value
  const list: ChartEvent[] = [
    { date: x.dip.highDate, label: fill(D.high, { date: formatDate(x.dip.highDate) }) },
    { date: x.dip.lowDate, label: fill(D.low, { date: formatDate(x.dip.lowDate) }) },
    { date: x.after.backAboveDate, label: fill(D.backAbove, { date: formatDate(x.after.backAboveDate) }) },
  ]
  for (const d of x.after.deposits) list.push({ date: d.date, label: fill(D.depositInvested, { date: formatDate(d.date) }) })
  return list.sort((a, b) => a.date.localeCompare(b.date))
})

// The summary also says what the events toggle now shows.
const summary = computed(
  () => `${fill(D.summary, { from: formatDate(from.value), to: formatDate(f.value.lastClose) })} ${showEvents.value ? D.eventsOn : D.eventsOff}`,
)
const columns = [
  { key: 'date', label: D.colDate },
  { key: 'balance', label: D.colBalance, numeric: true },
  { key: 'moneyIn', label: D.colMoneyIn, numeric: true },
  { key: 'diff', label: D.colDiff, numeric: true },
]
const rows = computed(() =>
  points.value.map((p) => ({ date: formatDate(p.date), balance: formatMoney(p.balance), moneyIn: formatMoney(p.moneyIn), diff: formatSigned(p.balance - p.moneyIn) })),
)
</script>

<template>
  <div class="section-body">
    <p v-for="c in claims" :key="c.id" class="section__claim" :data-claim="c.id">{{ c.text }}</p>
    <p class="section__claim">
      <CopyText :text="D.dcaLine"><template #dca><TermTip id="dollar-cost-averaging">{{ D.dcaWord }}</TermTip></template></CopyText>
    </p>
  </div>
  <ChartFrame :title="D.chartTitle" :level="3" :summary="summary" :columns="columns" :rows="rows">
    <button type="button" class="section__toggle" :aria-pressed="showEvents ? 'true' : 'false'" @click="showEvents = !showEvents">
      <span class="mdi" :class="showEvents ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'" aria-hidden="true" />
      {{ D.showEvents }}
    </button>
    <BalanceChart :points="points" :label="D.chartTitle" :events="showEvents ? events : []" />
    <ul v-if="showEvents" class="events" :aria-label="D.eventsLabel">
      <li v-for="e in events" :key="e.label">{{ e.label }}</li>
    </ul>
  </ChartFrame>
</template>

<style scoped>
.events {
  margin: 8px 0 0;
  padding-left: 1.2em;
  line-height: 1.6;
}
</style>
