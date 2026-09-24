<script setup lang="ts">
// Balance over time, with "What you put in" and "What it earned" layers.
// 1M / 3M / Since March. The table shows the same series as the chart.
import { computed, ref } from 'vue'
import BalanceChart from '@/shared/charts/BalanceChart.vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import { useScenario } from '@/shared/composables/useScenario'
import { meta } from '@/shared/data'
import { formatDate, formatMoney, formatSigned } from '@/shared/format'

const props = withDefaults(defineProps<{ compact?: boolean; title?: string }>(), { compact: false, title: 'Balance over time' })
const { account } = useScenario()

type Range = '1m' | '3m' | 'all'
const RANGES: { id: Range; label: string; name: string }[] = [
  { id: '1m', label: '1M', name: 'Last month' },
  { id: '3m', label: '3M', name: 'Last 3 months' },
  { id: 'all', label: 'Since March', name: 'Since March' },
]
const range = ref<Range>(props.compact ? 'all' : '3m')

function monthsBack(iso: string, n: number) {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCMonth(d.getUTCMonth() - n)
  return d.toISOString().slice(0, 10)
}
const points = computed(() => {
  const h = account.value.history
  if (range.value === 'all') return h
  const from = monthsBack(meta.lastClose, range.value === '1m' ? 1 : 3)
  return h.filter((r) => r.date >= from)
})

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
      <div v-if="!compact" class="ranges" role="group" aria-label="Time range">
        <button
          v-for="r in RANGES"
          :key="r.id"
          type="button"
          class="ranges__btn"
          :aria-pressed="range === r.id ? 'true' : 'false'"
          :aria-label="r.name"
          @click="range = r.id"
        >
          {{ r.label }}
        </button>
      </div>
    </template>
    <BalanceChart :points="points" :label="title" :compact="compact" :height="compact ? 120 : 280" />
  </ChartFrame>
</template>

<style scoped>
.ranges {
  display: inline-flex;
  border: 1px solid var(--color-ink-muted);
  border-radius: 999px;
  overflow: hidden;
}

.ranges__btn {
  min-height: 44px;
  min-width: 56px;
  padding: 0 14px;
  border: 0;
  background: var(--color-paper);
  color: var(--color-ink);
  font: inherit;
  font-weight: 500;
  cursor: pointer;
}

.ranges__btn + .ranges__btn {
  border-left: 1px solid var(--color-ink-muted);
}

.ranges__btn[aria-pressed='true'] {
  background: var(--color-forest);
  color: var(--color-paper);
  font-weight: 700;
}
</style>
