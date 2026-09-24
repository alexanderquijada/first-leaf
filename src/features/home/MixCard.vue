<script setup lang="ts">
// Your mix: what each fund is now (share of the money in funds) next to the mix
// she set. Cash is shown separately; it isn't part of the mix.
import { computed } from 'vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import TermTip from '@/shared/components/TermTip.vue'
import { useScenario } from '@/shared/composables/useScenario'
import { getFund } from '@/shared/data'
import { formatMoney } from '@/shared/format'

const { account } = useScenario()
const rowsRaw = computed(() => {
  const a = account.value
  return a.holdings.map((h) => ({
    ticker: h.ticker,
    name: getFund(h.ticker)?.name ?? h.ticker,
    now: Math.round((h.value / a.investedValue) * 100),
    set: Math.round((a.targetMix?.[h.ticker] ?? 0) * 100),
  }))
})
const summary = computed(() => {
  const gap = [...rowsRaw.value].sort((x, y) => Math.abs(y.now - y.set) - Math.abs(x.now - x.set))[0]
  if (!gap) return ''
  if (gap.now === gap.set) return 'Each fund is at the share you set.'
  return `The biggest difference is ${gap.ticker}: ${gap.now}% now and ${gap.set}% in the mix you set.`
})
const columns = [
  { key: 'fund', label: 'Fund' },
  { key: 'now', label: 'Now', numeric: true },
  { key: 'set', label: 'You set', numeric: true },
]
const rows = computed(() => rowsRaw.value.map((r) => ({ fund: r.ticker, now: `${r.now}%`, set: `${r.set}%` })))
</script>

<template>
  <ChartFrame title="Your mix" :summary="summary" :columns="columns" :rows="rows">
    <p class="mix__lede">Your <TermTip id="your-mix">mix</TermTip> now, next to the mix you set.</p>
    <ul class="mix" aria-label="Your mix now and the mix you set">
      <li v-for="r in rowsRaw" :key="r.ticker" class="mix__row">
        <span class="mix__name">{{ r.ticker }}</span>
        <span class="mix__bars" aria-hidden="true">
          <span class="mix__bar is-now" :style="{ width: `${r.now}%` }" />
          <span class="mix__bar is-set" :style="{ width: `${r.set}%` }" />
        </span>
        <span class="mix__nums fl-tabular">{{ r.now }}% now<span class="mix__set"> · {{ r.set }}% set</span></span>
      </li>
    </ul>
    <p v-if="account.cash > 0" class="mix__cash">{{ formatMoney(account.cash) }} in cash is not part of your mix.</p>
  </ChartFrame>
</template>

<style scoped>
.mix__lede {
  margin: 0 0 8px;
}

.mix {
  margin: 0;
  padding: 0;
  list-style: none;
}

.mix__row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 4px 24px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-mint);
}

.mix__name {
  font-weight: 600;
}

.mix__bars {
  grid-column: 1 / -1;
  grid-row: 2;
  display: grid;
  gap: 3px;
}

.mix__bar {
  display: block;
  height: 8px;
  border-radius: 4px;
}

.mix__bar.is-now {
  background: var(--color-forest);
}

.mix__bar.is-set {
  background: var(--color-mustard);
}

.mix__nums {
  font-size: 0.9375rem;
  white-space: nowrap;
}

.mix__set {
  color: var(--color-ink-muted);
}

.mix__cash {
  margin: 8px 0 0;
  color: var(--color-ink-muted);
}
</style>
