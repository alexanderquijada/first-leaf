<script setup lang="ts">
// Chapter 3: The dip in July. Every sentence here is a checked claim (rules R2-R4);
// the events can be shown or hidden on the chart.
import { computed, ref } from 'vue'
import BalanceChart, { type ChartEvent } from '@/shared/charts/BalanceChart.vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import type { Account, RosaStory } from '@/shared/data'
import { formatDate, formatMoney, formatSigned } from '@/shared/format'

const props = defineProps<{ story: RosaStory; account: Account }>()
const f = computed(() => props.story.facts)
const claims = computed(() => props.story.claims.filter((c) => c.chapter === 3))
const showEvents = ref(true)
const from = computed(() => f.value.dip.window.from)
const points = computed(() => props.account.history.filter((r) => r.date >= from.value))

const events = computed<ChartEvent[]>(() => {
  const x = f.value
  const list: ChartEvent[] = [
    { date: x.dip.highDate, label: `${formatDate(x.dip.highDate)}: ${x.dip.ticker} hit its high before the dip.` },
    { date: x.dip.lowDate, label: `${formatDate(x.dip.lowDate)}: ${x.dip.ticker} hit its low.` },
  ]
  if (x.pause) list.push({ date: x.pause.date, label: `${formatDate(x.pause.date)}: You paused auto-invest.` })
  list.push({ date: x.after.backAboveDate, label: `${formatDate(x.after.backAboveDate)}: Your balance was back above what you had put in.` })
  for (const d of x.after.deposits)
    list.push({ date: d.date, label: `${formatDate(d.date)}: Your deposit ${x.after.depositsInvested ? 'bought your mix' : 'stayed as cash'}.` })
  return list.sort((a, b) => a.date.localeCompare(b.date))
})

const summary = computed(
  () => `Your balance from ${formatDate(from.value)} to ${formatDate(f.value.lastClose)}, with the dip and what came after.`,
)
const columns = [
  { key: 'date', label: 'Date' },
  { key: 'balance', label: 'Balance', numeric: true },
  { key: 'moneyIn', label: 'You put in', numeric: true },
  { key: 'diff', label: 'Up or down', numeric: true },
]
const rows = computed(() =>
  points.value.map((p) => ({ date: formatDate(p.date), balance: formatMoney(p.balance), moneyIn: formatMoney(p.moneyIn), diff: formatSigned(p.balance - p.moneyIn) })),
)
</script>

<template>
  <section id="chapter-3" class="chapter" aria-labelledby="chapter-3-title">
    <p class="chapter__num">Chapter 3</p>
    <h2 id="chapter-3-title">The dip in July</h2>
    <p v-for="c in claims" :key="c.id" class="chapter__claim" :data-claim="c.id">{{ c.text }}</p>
    <ChartFrame title="The dip and what came after" :level="3" :summary="summary" :columns="columns" :rows="rows">
      <button
        type="button"
        class="chapter__toggle"
        :aria-pressed="showEvents ? 'true' : 'false'"
        @click="showEvents = !showEvents"
      >
        <span class="mdi" :class="showEvents ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'" aria-hidden="true" />
        Show events on the chart
      </button>
      <BalanceChart :points="points" label="The dip and what came after" :events="showEvents ? events : []" />
      <ul v-if="showEvents" class="events" aria-label="Events on the chart">
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
