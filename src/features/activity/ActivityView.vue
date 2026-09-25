<script setup lang="ts">
import SceneArt from '@/shared/illustrations/SceneArt.vue'
// Activity: every deposit, buy and dividend, newest first, with this session's
// pending deposits on top. Type and status filters combine.
import { describeActivity } from '@/shared/activityText'
import { computed, ref } from 'vue'
import BottomSheet from '@/shared/components/BottomSheet.vue'
import ToggleGroup from '@/shared/components/ToggleGroup.vue'
import { useViewport } from '@/shared/composables/useViewport'
import { formatDate, formatMoney } from '@/shared/format'
import { fill } from '@/shared/copy'
import copy from './copy.json'
import { STATUS_OPTIONS, TYPE_OPTIONS, useActivityRows } from './useActivityRows'

const { all, shown, type, status, reset } = useActivityRows()
const { isPhone } = useViewport()
const sheetOpen = ref(false)
const filterSummary = computed(
  () =>
    fill(copy.filterSummary, {
      type: TYPE_OPTIONS.find((o) => o.id === type.value)!.label,
      status: STATUS_OPTIONS.find((o) => o.id === status.value)!.label,
    }),
)
</script>

<template>
  <div class="activity">
    <h1>{{ copy.title }}</h1>
    <div v-if="!all.length" class="activity__empty"><SceneArt scene="empty" :size="140" /><p>{{ copy.empty }}</p></div>
    <template v-else>
      <template v-if="isPhone">
        <div class="activity__phonebar">
          <p class="activity__summary">{{ filterSummary }}</p>
          <button type="button" class="activity__filterbtn" @click="sheetOpen = true">
            <span class="mdi mdi-filter-variant" aria-hidden="true" /> {{ copy.filters }}
          </button>
        </div>
        <BottomSheet v-model="sheetOpen" :title="copy.filters">
          <p class="activity__filter-label" aria-hidden="true">{{ copy.type }}</p>
          <ToggleGroup v-model="type" :label="copy.type" :options="TYPE_OPTIONS" />
          <p class="activity__filter-label activity__filter-label--gap" aria-hidden="true">{{ copy.status }}</p>
          <ToggleGroup v-model="status" :label="copy.status" :options="STATUS_OPTIONS" />
          <button type="button" class="activity__show" @click="sheetOpen = false">
            {{ shown.length === 1 ? copy.showOne : fill(copy.showMany, { count: shown.length }) }}
          </button>
        </BottomSheet>
      </template>
      <div v-else class="activity__filters">
        <div class="activity__filter">
          <p class="activity__filter-label" aria-hidden="true">{{ copy.type }}</p>
          <ToggleGroup v-model="type" :label="copy.type" :options="TYPE_OPTIONS" />
        </div>
        <div class="activity__filter">
          <p class="activity__filter-label" aria-hidden="true">{{ copy.status }}</p>
          <ToggleGroup v-model="status" :label="copy.status" :options="STATUS_OPTIONS" />
        </div>
      </div>
      <p class="activity__count" role="status">{{ fill(copy.count, { shown: shown.length, total: all.length }) }}</p>
      <div v-if="!shown.length" class="activity__none">
        <p>{{ copy.none }}</p>
        <button type="button" class="activity__reset" @click="reset">{{ copy.showEverything }}</button>
      </div>
      <ul v-else-if="isPhone" class="activity__list">
        <li v-for="r in shown" :key="r.id">
          <RouterLink :to="`/activity/${r.id}`" class="activity__row" :class="`is-${describeActivity(r).status.toLowerCase()}`">
            <span class="activity__date">{{ formatDate(r.date) }}</span>
            <span class="activity__what">{{ describeActivity(r).what }}<span v-if="describeActivity(r).status !== 'Completed'" class="activity__status">{{ fill(copy.rowStatus, { status: describeActivity(r).label }) }}</span></span>
            <span class="fl-tabular">{{ formatMoney(r.amount) }}</span>
          </RouterLink>
        </li>
      </ul>
      <div v-else class="activity__wrap" role="region" :aria-label="copy.tableLabel" tabindex="0">
        <table class="activity__table">
          <caption class="fl-visually-hidden">{{ copy.caption }}</caption>
          <thead>
            <tr>
              <th scope="col">{{ copy.col.date }}</th>
              <th scope="col">{{ copy.col.what }}</th>
              <th scope="col" class="is-num">{{ copy.col.amount }}</th>
              <th scope="col">{{ copy.col.status }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in shown" :key="r.id" :class="`is-${describeActivity(r).status.toLowerCase()}`">
              <td>{{ formatDate(r.date) }}</td>
              <td><RouterLink :to="`/activity/${r.id}`">{{ describeActivity(r).what }}</RouterLink></td>
              <td class="is-num fl-tabular">{{ formatMoney(r.amount) }}</td>
              <td>{{ describeActivity(r).label }}</td>
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
  border-radius: 999px;
  background: var(--color-paper);
  color: var(--color-forest);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.activity__wrap {
  position: relative; /* keeps screen-reader-only text inside the scrolling box */
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

.activity__phonebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.activity__summary {
  margin: 0;
  color: var(--color-ink-muted);
}

.activity__filterbtn,
.activity__show {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 48px;
  padding: 0 16px;
  border: 1px solid var(--color-forest);
  border-radius: 999px;
  background: var(--color-paper);
  color: var(--color-forest);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.activity__show {
  width: 100%;
  justify-content: center;
  margin-top: 20px;
  border-radius: 4px;
  background: var(--color-forest);
  color: var(--color-paper);
}

.activity__filter-label--gap {
  margin-top: 16px;
}

.activity__list {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-mint);
}

.activity__row {
  /* A row grows taller, never wider: with large text the amount wraps under the words. */
  display: flex;
  flex-wrap: wrap;
  gap: 2px 12px;
  align-items: center;
  min-height: 56px;
  border-bottom: 1px solid var(--color-mint);
  color: var(--color-ink);
  text-decoration: none;
}

.activity__date {
  flex: 0 0 4.2em;
  color: var(--color-ink-muted);
}

.activity__what {
  flex: 1 1 8em;
  min-width: 0;
}

.activity__row > .fl-tabular {
  margin-left: auto;
}

.activity__status {
  font-weight: 700;
}

.is-pending td,
.is-returned td {
  font-weight: 600;
}
</style>
