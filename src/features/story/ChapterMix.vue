<script setup lang="ts">
// Chapter 4: Where it is now. Her money by fund and cash, filtered by kind.
import { computed, ref } from 'vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import TermTip from '@/shared/components/TermTip.vue'
import { getFund, type Account } from '@/shared/data'
import { formatMoney } from '@/shared/format'

const props = defineProps<{ account: Account }>()
type Kind = 'all' | 'stocks' | 'bonds' | 'reserve' | 'cash'
const FILTERS: { id: Kind; label: string; term?: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'stocks', label: 'Stocks', term: 'stocks' },
  { id: 'bonds', label: 'Bonds', term: 'bonds' },
  { id: 'reserve', label: 'Reserve' },
  { id: 'cash', label: 'Cash', term: 'cash' },
]
const kind = ref<Kind>('all')

const parts = computed(() => {
  const a = props.account
  const funds = a.holdings.map((h) => ({ name: h.ticker, kind: (getFund(h.ticker)?.kind ?? 'stocks') as Kind, value: h.value }))
  return [...funds, { name: 'Cash', kind: 'cash' as Kind, value: a.cash }].filter((p) => p.value > 0)
})
const shown = computed(() => parts.value.filter((p) => kind.value === 'all' || p.kind === kind.value))
const pct = (v: number) => Math.round((v / props.account.balance) * 100)
const total = computed(() => shown.value.reduce((s, p) => s + p.value, 0))

const summary = computed(() => {
  const a = props.account
  const n = a.holdings.length
  if (kind.value === 'all') return `Your ${formatMoney(a.balance)} is split across ${n} ${n === 1 ? 'fund' : 'funds'}${a.cash > 0 ? ' and cash' : ''}.`
  const label = FILTERS.find((x) => x.id === kind.value)!.label
  if (!shown.value.length) return kind.value === 'cash' ? 'You have no cash waiting right now.' : `You do not own any ${label.toLowerCase()} funds right now.`
  return `${label} ${kind.value === 'cash' ? 'is' : 'are'} ${formatMoney(total.value)} of your balance, or ${pct(total.value)}%.`
})
const columns = [
  { key: 'name', label: 'Where' },
  { key: 'value', label: 'Amount', numeric: true },
  { key: 'share', label: 'Share of balance', numeric: true },
]
const rows = computed(() => shown.value.map((p) => ({ name: p.name, value: formatMoney(p.value), share: `${pct(p.value)}%` })))
</script>

<template>
  <section id="chapter-4" class="chapter" aria-labelledby="chapter-4-title">
    <p class="chapter__num">Chapter 4</p>
    <h2 id="chapter-4-title">Where it is now</h2>
    <p class="chapter__claim">Here is how your money is split today, as of the last prices.</p>
    <ChartFrame title="Where your money is" :level="3" :summary="summary" :columns="columns" :rows="rows">
      <template #controls>
        <div class="filters" role="group" aria-label="Show">
          <button
            v-for="x in FILTERS"
            :key="x.id"
            type="button"
            class="filters__btn"
            :aria-pressed="kind === x.id ? 'true' : 'false'"
            @click="kind = x.id"
          >
            {{ x.label }}
          </button>
        </div>
      </template>
      <ul v-if="shown.length" class="where">
        <li v-for="p in shown" :key="p.name" class="where__row">
          <span class="where__name">{{ p.name }}</span>
          <span class="where__nums fl-tabular">{{ formatMoney(p.value) }} · {{ pct(p.value) }}%</span>
          <span class="where__bar" aria-hidden="true"><span :style="{ width: `${pct(p.value)}%` }" /></span>
        </li>
      </ul>
      <p class="where__terms">
        Words: <TermTip id="stocks">stocks</TermTip>, <TermTip id="bonds">bonds</TermTip>,
        <TermTip id="cash">cash</TermTip>.
      </p>
    </ChartFrame>
  </section>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.filters__btn {
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 999px;
  background: var(--color-paper);
  color: var(--color-ink);
  font: inherit;
  cursor: pointer;
}

.filters__btn[aria-pressed='true'] {
  background: var(--color-forest);
  border-color: var(--color-forest);
  color: var(--color-paper);
  font-weight: 700;
}

.where {
  margin: 0;
  padding: 0;
  list-style: none;
}

.where__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 24px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-mint);
}

.where__name {
  font-weight: 600;
}

.where__bar {
  grid-column: 1 / -1;
  height: 8px;
  border-radius: 4px;
  background: var(--color-mint);
}

.where__bar span {
  display: block;
  height: 100%;
  border-radius: 4px;
  background: var(--color-forest);
}

.where__terms {
  margin: 12px 0 0;
  color: var(--color-ink-muted);
}
</style>
