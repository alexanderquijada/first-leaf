<script setup lang="ts">
// All five funds: what each is, its yearly fee, its ups and downs, and what Rosa
// has in it (or that she doesn't own it yet).
import { computed } from 'vue'
import Money from '@/shared/components/Money.vue'
import { useScenario } from '@/shared/composables/useScenario'
import { funds } from '@/shared/data'
import { formatMoney } from '@/shared/format'

const { account } = useScenario()
const KIND = { stocks: 'Stocks', bonds: 'Bonds', reserve: 'Reserve' } as const
const rows = computed(() =>
  funds.map((f) => {
    const h = account.value.holdings.find((x) => x.ticker === f.ticker)
    const fee = f.expenseRatioHistory.filter((e) => e.effective <= account.value.asOf).at(-1)!.value
    return { f, h, fee, kind: KIND[f.kind] }
  }),
)
</script>

<template>
  <div class="funds">
    <h1>Your funds</h1>
    <div class="funds__wrap" role="region" aria-label="Your funds" tabindex="0">
      <table class="funds__table">
        <caption class="fl-visually-hidden">All funds, with what you have in each</caption>
        <thead>
          <tr>
            <th scope="col">Fund</th>
            <th scope="col">Kind</th>
            <th scope="col" class="is-num">Yearly fee</th>
            <th scope="col" class="is-num">Ups and downs</th>
            <th scope="col" class="is-num">Your value</th>
            <th scope="col" class="is-num">Up or down</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.f.ticker">
            <td>
              <RouterLink :to="`/funds/${r.f.ticker}`" class="funds__link">{{ r.f.ticker }}</RouterLink>
              <span class="funds__name">{{ r.f.name }}</span>
            </td>
            <td>{{ r.kind }}</td>
            <td class="is-num fl-tabular">{{ r.fee.toFixed(2) }}%</td>
            <td class="is-num fl-tabular">{{ r.f.upsAndDowns }} of 5</td>
            <td class="is-num fl-tabular">{{ r.h ? formatMoney(r.h.value) : 'Not owned' }}</td>
            <td class="is-num fl-tabular"><Money v-if="r.h" :amount="r.h.gainLoss" change context="table" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.funds {
  max-width: 1000px;
}

.funds h1 {
  font-size: clamp(2.25rem, 5vw, 3rem);
}

.funds__wrap {
  margin-top: 16px;
  overflow-x: auto;
  border: 1px solid var(--color-ink-muted);
  border-radius: 12px;
  background: var(--color-paper);
}

.funds__table {
  width: 100%;
  border-collapse: collapse;
}

.funds__table th,
.funds__table td {
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-mint);
  text-align: left;
  white-space: nowrap;
}

.funds__table .is-num {
  text-align: right;
  padding-left: 24px;
}

.funds__link {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  margin-right: 8px;
  font-weight: 700;
}

.funds__name {
  color: var(--color-ink-muted);
}

</style>
