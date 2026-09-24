<script setup lang="ts">
// Balance over time, with "What you put in" and "What it earned" layers.
// 1M / 3M / Since March. The table shows the same series as the chart.
import { computed, ref } from 'vue'
import BalanceChart from '@/shared/charts/BalanceChart.vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import RangeButtons from '@/shared/charts/RangeButtons.vue'
import { inRange, type RangeId } from '@/shared/charts/ranges'
import { useScenario } from '@/shared/composables/useScenario'
import { fill } from '@/shared/copy'
import { formatDate, formatMoney, formatSigned } from '@/shared/format'
import copy from './copy.json'

const C = copy.chart

const props = withDefaults(defineProps<{ compact?: boolean; title?: string }>(), { compact: false, title: copy.chart.title })
const { account } = useScenario()

const range = ref<RangeId>(props.compact ? 'all' : '3m')
const points = computed(() => inRange(account.value.history, range.value))

const summary = computed(() => {
  const a = account.value, p = points.value
  const first = p[0], last = p.at(-1)
  if (!first || !last) return ''
  const earned = a.balance - a.moneyIn
  const now = fill(earned >= 0 ? C.nowUp : C.nowDown, { date: formatDate(last.date), balance: formatMoney(a.balance), moneyIn: formatMoney(a.moneyIn), earned: formatMoney(Math.abs(earned)) })
  const span = fill(C.range, { from: formatDate(first.date), to: formatDate(last.date), first: formatMoney(first.balance), last: formatMoney(last.balance) })
  return `${now} ${span}`
})

const columns = [
  { key: 'date', label: C.colDate },
  { key: 'balance', label: C.colBalance, numeric: true },
  { key: 'moneyIn', label: C.colPutIn, numeric: true },
  { key: 'earned', label: C.colEarned, numeric: true },
]
const rows = computed(() =>
  points.value.map((p) => ({
    date: formatDate(p.date),
    balance: formatMoney(p.balance),
    moneyIn: formatMoney(p.moneyIn),
    earned: formatSigned(p.balance - p.moneyIn),
  })),
)
</script>

<template>
  <ChartFrame :title="title" :summary="summary" :columns="columns" :rows="rows">
    <template #controls>
      <RangeButtons v-if="!compact" v-model="range" />
    </template>
    <BalanceChart :points="points" :label="title" :compact="compact" :height="compact ? 120 : 280" />
  </ChartFrame>
</template>
