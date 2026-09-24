<script setup lang="ts">
// Every chart sits in a frame: a heading, a plain-sentence summary above it, the
// chart, and "Show as table". The table rows come from the same series as the chart.
import { ref, useId } from 'vue'
import { copy, fill } from '../copy'

export interface TableColumn {
  key: string
  label: string
  numeric?: boolean
}

withDefaults(
  defineProps<{
    title: string
    level?: 2 | 3
    summary: string
    columns: TableColumn[]
    rows: Record<string, string>[]
  }>(),
  { level: 2 },
)

const uid = useId()
const titleId = `fl-chart-${uid}-title`
const tableId = `fl-chart-${uid}-table`
const showTable = ref(false)
</script>

<template>
  <section class="fl-chart" :aria-labelledby="titleId">
    <div class="fl-chart__head">
      <component :is="`h${level}`" :id="titleId" class="fl-chart__title">{{ title }}</component>
      <slot name="controls" />
    </div>
    <p class="fl-chart__summary">{{ summary }}</p>
    <slot />
    <button
      type="button"
      class="fl-chart__toggle"
      :aria-expanded="showTable ? 'true' : 'false'"
      :aria-controls="tableId"
      @click="showTable = !showTable"
    >
      {{ showTable ? copy.chart.hideTable : copy.chart.showTable }}
    </button>
    <div
      v-if="showTable"
      :id="tableId"
      class="fl-chart__table-wrap"
      role="region"
      :aria-label="fill(copy.chart.asTable, { title })"
      tabindex="0"
    >
      <table class="fl-chart__table">
        <caption class="fl-visually-hidden">{{ title }}</caption>
        <thead>
          <tr>
            <th v-for="c in columns" :key="c.key" scope="col" :class="{ 'is-num': c.numeric }">{{ c.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="i">
            <td v-for="c in columns" :key="c.key" :class="{ 'is-num': c.numeric }">{{ r[c.key] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.fl-chart__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
}

.fl-chart__title {
  font-size: 1.375rem;
}

.fl-chart__summary {
  margin: 8px 0 12px;
  max-width: 70ch;
  line-height: 1.5;
}

.fl-chart__toggle {
  min-height: 48px;
  margin-top: 8px;
  padding: 0 4px;
  border: 0;
  background: none;
  color: var(--color-forest);
  font: inherit;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.fl-chart__table-wrap {
  max-height: 320px;
  overflow: auto;
  margin-top: 8px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 8px;
}

.fl-chart__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
}

.fl-chart__table th,
.fl-chart__table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid var(--color-mint);
  white-space: nowrap;
}

.fl-chart__table th {
  position: sticky;
  top: 0;
  background: var(--color-paper);
  font-weight: 600;
}

/* Numbers line up, with at least a 24px gutter between number columns. */
.fl-chart__table .is-num {
  text-align: right;
  padding-left: 24px;
}
</style>
