<script setup lang="ts">
// This week: start → the market → dividends → deposits → end. Adds up to the cent (A10).
import { computed } from 'vue'
import { fill } from '@/shared/copy'
import TermTip from '@/shared/components/TermTip.vue'
import copy from './copy.json'
import { useScenario } from '@/shared/composables/useScenario'
import { formatChange, formatDate, formatMoney, formatSigned } from '@/shared/format'

const { account } = useScenario()
const w = computed(() => account.value.weeklyChange)
const W = copy.week
</script>

<template>
  <section v-if="w" class="week" aria-labelledby="week-title">
    <h2 id="week-title" class="week__title">{{ W.title }}</h2>
    <p class="week__line">{{ fill(W.line, { change: formatChange(w.totalChange) }) }}</p>
    <table class="week__table">
      <caption class="fl-visually-hidden">{{ W.caption }}</caption>
      <tbody>
        <tr>
          <th scope="row">{{ fill(W.startBalance, { date: formatDate(w.from) }) }}</th>
          <td class="fl-tabular">{{ formatMoney(w.startBalance) }}</td>
        </tr>
        <tr v-if="w.marketChange !== 0">
          <th scope="row"><TermTip id="the-market">{{ W.market }}</TermTip></th>
          <td class="fl-tabular">
            <span aria-hidden="true">{{ formatSigned(w.marketChange) }}</span
            ><span class="fl-visually-hidden">{{ formatChange(w.marketChange) }}</span>
          </td>
        </tr>
        <!-- A piece that is $0.00 is left out (ruling 6, Sept. 25); what is shown still adds up. -->
        <tr v-if="w.dividends !== 0">
          <th scope="row"><TermTip id="dividend">{{ W.dividends }}</TermTip></th>
          <td class="fl-tabular">
            <span aria-hidden="true">{{ formatSigned(w.dividends) }}</span
            ><span class="fl-visually-hidden">{{ formatChange(w.dividends) }}</span>
          </td>
        </tr>
        <tr v-if="w.deposits !== 0">
          <th scope="row"><TermTip id="deposit">{{ W.deposits }}</TermTip></th>
          <td class="fl-tabular">
            <span aria-hidden="true">{{ formatSigned(w.deposits) }}</span
            ><span class="fl-visually-hidden">{{ formatChange(w.deposits) }}</span>
          </td>
        </tr>
        <tr class="week__end">
          <th scope="row">{{ fill(W.endBalance, { date: formatDate(w.to) }) }}</th>
          <td class="fl-tabular">{{ formatMoney(w.endBalance) }}</td>
        </tr>
      </tbody>
    </table>
    <!-- A week where any holding fell says that ups and downs are normal (P301 brief, "Down, not up"). -->
    <p v-if="w.byFund.some((f) => f.change < 0)" class="week__note">{{ copy.phone.someDown }}</p>
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
.week__note {
  margin: 12px 0 0;
  color: var(--color-ink-muted);
  line-height: var(--fl-body-leading);
}
</style>
