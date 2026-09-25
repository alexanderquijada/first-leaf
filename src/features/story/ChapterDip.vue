<script setup lang="ts">
// Chapter 3: The dip, titled with the month of its low. Every sentence here is a checked claim (rules R2-R4);
// the events can be shown or hidden on the chart.
import { computed, ref } from 'vue'
import BalanceChart, { type ChartEvent } from '@/shared/charts/BalanceChart.vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import type { Account, RosaStory } from '@/shared/data'
import { fill } from '@/shared/copy'
import { formatDate, formatMoney, formatSigned } from '@/shared/format'
import copy from './copy.json'

const D = copy.dip

const props = defineProps<{ story: RosaStory; account: Account }>()
const f = computed(() => props.story.facts)
const claims = computed(() => props.story.claims.filter((c) => c.chapter === 3))
const showEvents = ref(true)
const from = computed(() => f.value.dip.window.from)
const points = computed(() => props.account.history.filter((r) => r.date >= from.value))

const events = computed<ChartEvent[]>(() => {
  const x = f.value
  const list: ChartEvent[] = [
    { date: x.dip.highDate, label: fill(D.high, { date: formatDate(x.dip.highDate) }) },
    { date: x.dip.lowDate, label: fill(D.low, { date: formatDate(x.dip.lowDate) }) },
  ]
  if (x.pause) list.push({ date: x.pause.date, label: fill(D.paused, { date: formatDate(x.pause.date) }) })
  list.push({ date: x.after.backAboveDate, label: fill(D.backAbove, { date: formatDate(x.after.backAboveDate) }) })
  for (const d of x.after.deposits)
    list.push({ date: d.date, label: fill(x.after.depositsInvested ? D.depositInvested : D.depositCash, { date: formatDate(d.date) }) })
  return list.sort((a, b) => a.date.localeCompare(b.date))
})

const summary = computed(
  () => fill(D.summary, { from: formatDate(from.value), to: formatDate(f.value.lastClose) }),
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
  <section id="chapter-3" class="chapter" aria-labelledby="chapter-3-title">
    <p class="chapter__num">{{ fill(copy.chapterNum, { n: 3 }) }}</p>
    <h2 id="chapter-3-title">{{ fill(copy.titles['3'], { month: f.dip.month }) }}</h2>
    <p v-for="c in claims" :key="c.id" class="chapter__claim" :data-claim="c.id">{{ c.text }}</p>
    <ChartFrame :title="D.chartTitle" :level="3" :summary="summary" :columns="columns" :rows="rows">
      <button
        type="button"
        class="chapter__toggle"
        :aria-pressed="showEvents ? 'true' : 'false'"
        @click="showEvents = !showEvents"
      >
        <span class="mdi" :class="showEvents ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'" aria-hidden="true" />
        {{ D.showEvents }}
      </button>
      <BalanceChart :points="points" :label="D.chartTitle" :events="showEvents ? events : []" />
      <ul v-if="showEvents" class="events" :aria-label="D.eventsLabel">
        <li v-for="e in events" :key="e.label">{{ e.label }}</li>
      </ul>
    </ChartFrame>
  </section>
</template>

<style scoped>
.events {
  margin: 8px 0 0;
  padding-left: 1.2em;
  line-height: 1.6;
}
</style>
