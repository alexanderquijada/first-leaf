<script setup lang="ts">
// This week: start → the market → dividends → deposits → end. Adds up to the cent (A10).
import { computed } from 'vue'
import TermTip from '@/shared/components/TermTip.vue'
import { useScenario } from '@/shared/composables/useScenario'
import { formatChange, formatDate, formatMoney, formatSigned } from '@/shared/format'

const { account } = useScenario()
const w = computed(() => account.value.weeklyChange)
</script>

<template>
  <section v-if="w" class="week" aria-labelledby="week-title">
    <h2 id="week-title" class="week__title">This week</h2>
    <p class="week__line">Your balance went {{ formatChange(w.totalChange) }} this week.</p>
    <table class="week__table">
      <caption class="fl-visually-hidden">How your balance moved this week</caption>
      <tbody>
        <tr>
          <th scope="row">{{ formatDate(w.from) }} balance</th>
          <td class="fl-tabular">{{ formatMoney(w.startBalance) }}</td>
        </tr>
        <tr>
          <th scope="row"><TermTip id="the-market">The market</TermTip></th>
          <td class="fl-tabular">
            <span aria-hidden="true">{{ formatSigned(w.marketChange) }}</span
            ><span class="fl-visually-hidden">{{ formatChange(w.marketChange) }}</span>
          </td>
        </tr>
        <tr>
          <th scope="row"><TermTip id="dividend">Dividends</TermTip></th>
          <td class="fl-tabular">
            <span aria-hidden="true">{{ formatSigned(w.dividends) }}</span
            ><span class="fl-visually-hidden">{{ formatChange(w.dividends) }}</span>
          </td>
        </tr>
        <tr>
          <th scope="row"><TermTip id="deposit">Deposits</TermTip></th>
          <td class="fl-tabular">
            <span aria-hidden="true">{{ formatSigned(w.deposits) }}</span
            ><span class="fl-visually-hidden">{{ formatChange(w.deposits) }}</span>
          </td>
        </tr>
        <tr class="week__end">
          <th scope="row">{{ formatDate(w.to) }} balance</th>
          <td class="fl-tabular">{{ formatMoney(w.endBalance) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.week__title {
  font-size: 1.375rem;
}

.week__line {
  margin: 8px 0 8px;
}

.week__table {
  width: 100%;
  border-collapse: collapse;
}

.week__table th,
.week__table td {
  padding: 8px 0;
  border-bottom: 1px solid var(--color-mint);
  font-weight: 400;
  text-align: left;
}

.week__table td {
  padding-left: 24px;
  text-align: right;
  white-space: nowrap;
}

.week__end th,
.week__end td {
  font-weight: 700;
  border-bottom: 0;
  border-top: 2px solid var(--color-ink-muted);
}
</style>
