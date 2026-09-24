<script setup lang="ts">
// Balance over time, with "What you put in" and "What it earned" layers.
// 1M / 3M / Since March. The table shows the same series as the chart.
import { computed, ref } from 'vue'
import BalanceChart from '@/shared/charts/BalanceChart.vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import RangeButtons from '@/shared/charts/RangeButtons.vue'
import { inRange, type RangeId } from '@/shared/charts/ranges'
import { useScenario } from '@/shared/composables/useScenario'
import { formatDate, formatMoney, formatSigned } from '@/shared/format'

const props = withDefaults(defineProps<{ compact?: boolean; title?: string }>(), { compact: false, title: 'Balance over time' })
const { account } = useScenario()

const range = ref<RangeId>(props.compact ? 'all' : '3m')
const points = computed(() => inRange(account.value.history, range.value))

const summary = computed(() => {
  const a = account.value, p = points.value
  const first = p[0], last = p.at(-1)
  if (!first || !last) return ''
  const earned = a.balance - a.moneyIn
  const now = `On ${formatDate(last.date)}, your balance was ${formatMoney(a.balance)}. That is ${formatMoney(a.moneyIn)} you put in and ${earned >= 0 ? `${formatMoney(earned)} it earned` : `${formatMoney(-earned)} less than that`}.`
  return `${now} From ${formatDate(first.date)} to ${formatDate(last.date)}, it went from ${formatMoney(first.balance)} to ${formatMoney(last.balance)}.`
})

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'balance', label: 'Balance', numeric: true },
  { key: 'moneyIn', label: 'You put in', numeric: true },
  { key: 'earned', label: 'It earned', numeric: true },
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
