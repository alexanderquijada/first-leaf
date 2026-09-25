<script setup lang="ts">
// All ten investments: what each is, its ups and downs, and what Rosa has in it (or that
// she doesn't own it yet). Each is shown by its ticker badge; no logos.
import { computed } from 'vue'
import CopyText from '@/shared/components/CopyText.vue'
import Money from '@/shared/components/Money.vue'
import TickerBadge from '@/shared/components/TickerBadge.vue'
import { useScenario } from '@/shared/composables/useScenario'
import { useViewport } from '@/shared/composables/useViewport'
import { funds } from '@/shared/data'
import { fill } from '@/shared/copy'
import { formatMoney } from '@/shared/format'
import copy from './copy.json'

const { account } = useScenario()
const { isPhone } = useViewport()
const KIND = copy.kind
const rows = computed(() =>
  funds.map((f) => ({ f, h: account.value.holdings.find((x) => x.ticker === f.ticker), kind: KIND[f.kind] })),
)
</script>

<template>
  <div class="funds">
    <h1>{{ copy.title }}</h1>
    <ul v-if="isPhone" class="funds__cards">
      <li v-for="r in rows" :key="r.f.ticker">
        <RouterLink :to="`/funds/${r.f.ticker}`" class="funds__card">
          <span class="funds__head"><TickerBadge :ticker="r.f.ticker" :kind="r.f.kind" /> <span class="funds__ticker">{{ r.f.name }}</span></span>
          <span v-if="r.h" class="funds__value fl-tabular"><CopyText :text="copy.cardValue" :values="{ value: formatMoney(r.h.value) }"><template #change><Money :amount="r.h.gainLoss" change /></template></CopyText></span>
          <span v-else class="funds__value is-muted">{{ copy.notOwned }}</span>
        </RouterLink>
      </li>
    </ul>
    <!-- Ruling (Sept. 25): when the content area is under 600px (a laptop at 200% zoom), each
         holding is a stacked row with every value labeled by its column name. CSS picks the
         table or the stack by the width of this box, not the window. -->
    <ul v-if="!isPhone" class="funds__stack" :aria-label="copy.tableLabel">
      <li v-for="r in rows" :key="r.f.ticker">
        <p class="funds__stack-head">
          <RouterLink :to="`/funds/${r.f.ticker}`" class="funds__link"><TickerBadge :ticker="r.f.ticker" :kind="r.f.kind" /></RouterLink>
          <span class="funds__name">{{ r.f.name }}</span>
        </p>
        <dl class="funds__stack-facts">
          <div><dt>{{ copy.col.kind }}</dt><dd>{{ r.kind }}</dd></div>
          <div><dt>{{ copy.col.ups }}</dt><dd class="fl-tabular">{{ fill(copy.upsValue, { rating: r.f.upsAndDowns }) }}</dd></div>
          <div><dt>{{ copy.col.value }}</dt><dd class="fl-tabular">{{ r.h ? formatMoney(r.h.value) : copy.notOwned }}</dd></div>
          <div v-if="r.h"><dt>{{ copy.col.change }}</dt><dd class="fl-tabular"><Money :amount="r.h.gainLoss" change context="table" /></dd></div>
        </dl>
      </li>
    </ul>
    <div v-if="!isPhone" class="funds__wrap" role="region" :aria-label="copy.tableLabel" tabindex="0">
      <table class="funds__table">
        <caption class="fl-visually-hidden">{{ copy.caption }}</caption>
        <thead>
          <tr>
            <th scope="col">{{ copy.col.fund }}</th>
            <th scope="col">{{ copy.col.kind }}</th>
            <th scope="col" class="is-num">{{ copy.col.ups }}</th>
            <th scope="col" class="is-num">{{ copy.col.value }}</th>
            <th scope="col" class="is-num">{{ copy.col.change }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.f.ticker">
            <td>
              <RouterLink :to="`/funds/${r.f.ticker}`" class="funds__link"><TickerBadge :ticker="r.f.ticker" :kind="r.f.kind" /></RouterLink>
              <span class="funds__name">{{ r.f.name }}</span>
            </td>
            <td>{{ r.kind }}</td>
            <td class="is-num fl-tabular">{{ fill(copy.upsValue, { rating: r.f.upsAndDowns }) }}</td>
            <td class="is-num fl-tabular">{{ r.h ? formatMoney(r.h.value) : copy.notOwned }}</td>
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
  container-type: inline-size;
}

.funds__stack {
  display: none;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  border: 1px solid var(--color-ink-muted);
  border-radius: 12px;
  background: var(--color-paper);
}

.funds__stack > li {
  padding: 8px 16px 12px;
  border-bottom: 1px solid var(--color-mint);
}

.funds__stack > li:last-child {
  border-bottom: 0;
}

.funds__stack-head {
  display: flex;
  align-items: center;
  margin: 0;
}

.funds__stack-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 4px 32px;
  margin: 0;
}

.funds__stack-facts > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.funds__stack-facts dt {
  color: var(--color-ink-muted);
}

.funds__stack-facts dd {
  margin: 0;
  text-align: right;
}

@container (max-width: 599px) {
  .funds__stack {
    display: block;
  }

  .funds__wrap {
    display: none;
  }
}

.funds h1 {
  font-size: clamp(2.25rem, 5vw, 3rem);
}

.funds__wrap {
  position: relative; /* keeps screen-reader-only text inside the scrolling box */
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

.funds__cards {
  display: grid;
  gap: 12px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.funds__card {
  display: grid;
  gap: 2px;
  min-height: 48px;
  padding: 14px 16px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 12px;
  background: var(--color-paper);
  color: var(--color-ink);
  text-decoration: none;
}

.funds__head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.funds__ticker {
  font-weight: 700;
  font-size: 1.125rem;
}

.funds__value {
  margin-top: 4px;
  font-weight: 600;
}

.is-muted {
  color: var(--color-ink-muted);
  font-weight: 400;
}
</style>
