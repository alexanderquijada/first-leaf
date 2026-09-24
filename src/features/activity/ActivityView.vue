<script setup lang="ts">
// Activity: every deposit, buy and dividend, newest first, with this session's
// pending deposits on top. (Filters come with the full Activity page.)
import { computed } from 'vue'
import { describeActivity, type Row } from '@/shared/activityText'
import { useScenario } from '@/shared/composables/useScenario'
import { useSession } from '@/shared/composables/useSession'
import { formatDate, formatMoney } from '@/shared/format'

const { activity } = useScenario()
const { pendingDeposits } = useSession()
const rows = computed<Row[]>(() => [...[...pendingDeposits.value].reverse(), ...[...activity.value].reverse()])
</script>

<template>
  <div class="activity">
    <h1>Activity</h1>
    <p v-if="!rows.length" class="activity__empty">Nothing yet. Your deposits, buys and dividends will show here.</p>
    <div v-else class="activity__wrap" role="region" aria-label="All activity" tabindex="0">
      <table class="activity__table">
        <caption class="fl-visually-hidden">All activity, newest first</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">What</th>
            <th scope="col" class="is-num">Amount</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id" :class="`is-${describeActivity(r).status.toLowerCase()}`">
            <td>{{ formatDate(r.date) }}</td>
            <td>{{ describeActivity(r).what }}</td>
            <td class="is-num fl-tabular">{{ formatMoney(r.amount) }}</td>
            <td>{{ describeActivity(r).status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.activity {
  max-width: 900px;
}

.activity h1 {
  font-size: clamp(2.25rem, 5vw, 3rem);
}

.activity__empty {
  margin: 12px 0 0;
}

.activity__wrap {
  margin-top: 16px;
  overflow-x: auto;
  border: 1px solid var(--color-ink-muted);
  border-radius: 12px;
  background: var(--color-paper);
}

.activity__table {
  width: 100%;
  border-collapse: collapse;
}

.activity__table th,
.activity__table td {
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-mint);
  text-align: left;
  white-space: nowrap;
}

.activity__table .is-num {
  text-align: right;
  padding-left: 24px;
}

.is-pending td,
.is-returned td {
  font-weight: 600;
}
</style>
