<script setup lang="ts">
import ChapterMark from './ChapterMark.vue'
// Chapter 4: Where it is now. Her money by investment and cash, filtered by stocks, crypto or cash.
import { computed, ref } from 'vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import GroupMixBar from '@/shared/charts/GroupMixBar.vue'
import TermTip from '@/shared/components/TermTip.vue'
import { getFund, type Account } from '@/shared/data'
import CopyText from '@/shared/components/CopyText.vue'
import { fill } from '@/shared/copy'
import { formatMoney } from '@/shared/format'
import copy from './copy.json'

const M = copy.mix

const props = defineProps<{ account: Account }>()
type Kind = 'all' | 'stocks' | 'crypto' | 'cash'
const FILTERS: { id: Kind; label: string; term?: string }[] = [
  { id: 'all', label: M.filters.all },
  { id: 'stocks', label: M.filters.stocks, term: 'stock' },
  { id: 'crypto', label: M.filters.crypto, term: 'crypto' },
  { id: 'cash', label: M.filters.cash, term: 'cash' },
]
const kind = ref<Kind>('all')

const parts = computed(() => {
  const a = props.account
  const funds = a.holdings.map((h) => ({ name: h.ticker, kind: (getFund(h.ticker)?.kind === 'crypto' ? 'crypto' : 'stocks') as Kind, value: h.value }))
  return [...funds, { name: M.cash, kind: 'cash' as Kind, value: a.cash }].filter((p) => p.value > 0)
})
const shown = computed(() => parts.value.filter((p) => kind.value === 'all' || p.kind === kind.value))
// A small non-zero share reads as a decimal ("0.2%"), never as "0%".
const pct = (v: number) => {
  const p = (v / props.account.balance) * 100
  return p > 0 && p < 1 ? Math.round(p * 10) / 10 : Math.round(p)
}
const total = computed(() => shown.value.reduce((s, p) => s + p.value, 0))

const summary = computed(() => {
  const a = props.account
  const n = a.holdings.length
  if (kind.value === 'all') {
    const t = a.cash > 0 ? (n === 1 ? M.summaryOneCash : M.summaryManyCash) : n === 1 ? M.summaryOne : M.summaryMany
    return fill(t, { balance: formatMoney(a.balance), count: n })
  }
  if (!shown.value.length) return kind.value === 'cash' ? M.noCash : kind.value === 'crypto' ? M.noCrypto : M.noStocks
  const t = kind.value === 'cash' ? M.cashShare : kind.value === 'crypto' ? M.cryptoShare : M.stocksShare
  return fill(t, { amount: formatMoney(total.value), pct: pct(total.value) })
})
const columns = [
  { key: 'name', label: M.colWhere },
  { key: 'value', label: M.colAmount, numeric: true },
  { key: 'share', label: M.colShare, numeric: true },
]
const rows = computed(() => shown.value.map((p) => ({ name: p.name, value: formatMoney(p.value), share: fill(M.percent, { pct: pct(p.value) }) })))
</script>

<template>
  <section id="chapter-4" class="chapter story-pin" aria-labelledby="chapter-4-title">
    <ChapterMark :n="4" />
    <h2 id="chapter-4-title">{{ copy.titles['4'] }}</h2>
    <p class="chapter__claim">{{ M.claim }}</p>
    <ChartFrame :title="M.chartTitle" :level="3" :summary="summary" :columns="columns" :rows="rows">
      <template #controls>
        <div class="filters" role="group" :aria-label="M.filterGroup">
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
      <!-- The three groups on the dark panel, with patterns (BRIEF.md §6); per-holding rows below. -->
      <GroupMixBar :parts="parts.map((p) => ({ group: p.kind === 'all' ? 'stocks' : p.kind, value: p.value }))" class="where__groups" />
      <p v-if="shown.length" class="where__key">{{ M.rowsKey }}</p>
      <ul v-if="shown.length" class="where">
        <li v-for="p in shown" :key="p.name" class="where__row">
          <span class="where__name">{{ p.name }}</span>
          <span class="where__nums fl-tabular">{{ fill(M.rowNums, { amount: formatMoney(p.value), pct: pct(p.value) }) }}</span>
          <span class="where__bar" aria-hidden="true"><span :style="{ width: `${pct(p.value)}%` }" /></span>
        </li>
      </ul>
      <p class="where__terms">
        <CopyText :text="M.words"
          ><template #stocks><TermTip id="stock">{{ M.stocksWord }}</TermTip></template
          ><template #crypto><TermTip id="crypto">{{ M.cryptoWord }}</TermTip></template
          ><template #cash><TermTip id="cash">{{ M.cashWord }}</TermTip></template></CopyText
        >
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
  white-space: nowrap; /* a ticker never breaks at its hyphen */
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

.where__groups {
  margin: 0 0 12px;
}

.where__key {
  margin: 0 0 4px;
  color: var(--color-ink-muted);
}

.where__terms {
  margin: 12px 0 0;
  color: var(--color-ink-muted);
}
</style>
