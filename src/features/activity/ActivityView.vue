<script setup lang="ts">
// Activity: every deposit, buy and dividend, newest first, with this session's
// pending deposits on top. Type and status filters combine.
import { describeActivity } from '@/shared/activityText'
import ToggleGroup from '@/shared/components/ToggleGroup.vue'
import { formatDate, formatMoney } from '@/shared/format'
import { STATUS_OPTIONS, TYPE_OPTIONS, useActivityRows } from './useActivityRows'

const { all, shown, type, status, reset } = useActivityRows()
</script>

<template>
  <div class="activity">
    <h1>Activity</h1>
    <p v-if="!all.length" class="activity__empty">Nothing yet. Your deposits, buys and dividends will show here.</p>
    <template v-else>
      <div class="activity__filters">
        <div class="activity__filter">
          <p class="activity__filter-label" aria-hidden="true">Type</p>
          <ToggleGroup v-model="type" label="Type" :options="TYPE_OPTIONS" />
        </div>
        <div class="activity__filter">
          <p class="activity__filter-label" aria-hidden="true">Status</p>
          <ToggleGroup v-model="status" label="Status" :options="STATUS_OPTIONS" />
        </div>
      </div>
      <p class="activity__count" role="status">Showing {{ shown.length }} of {{ all.length }}.</p>
      <div v-if="!shown.length" class="activity__none">
        <p>Nothing matches these filters.</p>
        <button type="button" class="activity__reset" @click="reset">Show everything</button>
      </div>
      <div v-else class="activity__wrap" role="region" aria-label="Activity" tabindex="0">
        <table class="activity__table">
          <caption class="fl-visually-hidden">Activity, newest first</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">What</th>
              <th scope="col" class="is-num">Amount</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in shown" :key="r.id" :class="`is-${describeActivity(r).status.toLowerCase()}`">
              <td>{{ formatDate(r.date) }}</td>
              <td><RouterLink :to="`/activity/${r.id}`">{{ describeActivity(r).what }}</RouterLink></td>
              <td class="is-num fl-tabular">{{ formatMoney(r.amount) }}</td>
              <td>{{ describeActivity(r).status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
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

.activity__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;
  margin-top: 16px;
}

.activity__filter-label {
  margin: 0 0 4px;
  font-weight: 700;
}

.activity__count {
  margin: 16px 0 0;
  color: var(--color-ink-muted);
}

.activity__none {
  margin-top: 16px;
  padding: 20px 24px;
  border: 1px dashed var(--color-ink-muted);
  border-radius: 12px;
}

.activity__none p {
  margin: 0 0 8px;
}

.activity__reset {
  min-height: 48px;
  padding: 0 18px;
  border: 1px solid var(--color-forest);
  border-radius: 4px;
  background: var(--color-paper);
  color: var(--color-forest);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.activity__wrap {
  margin-top: 8px;
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
  padding: 0 16px;
  height: 48px;
  border-bottom: 1px solid var(--color-mint);
  text-align: left;
  white-space: nowrap;
}

.activity__table td a {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
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
