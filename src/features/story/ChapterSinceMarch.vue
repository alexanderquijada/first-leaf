<script setup lang="ts">
import ChapterMark from './ChapterMark.vue'
// Chapter 1: Six months in. Her balance since March, drawn in (shown whole
// under reduced motion), with a toggle for "What you put in / What it earned".
import { computed, ref } from 'vue'
import BalanceChart from '@/shared/charts/BalanceChart.vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import RangeButtons from '@/shared/charts/RangeButtons.vue'
import { inRange, type RangeId } from '@/shared/charts/ranges'
import type { Account, RosaStory } from '@/shared/data'
import { fill } from '@/shared/copy'
import { formatDate, formatMoney, formatSigned } from '@/shared/format'
import copy from './copy.json'

const S = copy.sinceMarch

const props = defineProps<{ story: RosaStory; account: Account }>()
const range = ref<RangeId>('all')
const layers = ref(true)
const points = computed(() => inRange(props.account.history, range.value))
const claim = computed(() => props.story.claims.find((c) => c.id === 'since-march')?.text ?? '')
// The title follows the time range, and the summary says what the toggle now shows.
const title = computed(() => (range.value === '1m' ? S.chartTitle1m : range.value === '3m' ? S.chartTitle3m : S.chartTitle))
const summary = computed(() => {
  const p = points.value, first = p[0], last = p.at(-1)
  const moved = first && last ? fill(S.summary, { from: formatDate(first.date), to: formatDate(last.date), start: formatMoney(first.balance), end: formatMoney(last.balance) }) : ''
  return `${moved} ${layers.value ? S.layersOn : S.layersOff}`.trim()
})
const columns = [
  { key: 'date', label: S.colDate },
  { key: 'balance', label: S.colBalance, numeric: true },
  { key: 'moneyIn', label: S.colMoneyIn, numeric: true },
  { key: 'earned', label: S.colEarned, numeric: true },
]
const rows = computed(() =>
  points.value.map((p) => ({ date: formatDate(p.date), balance: formatMoney(p.balance), moneyIn: formatMoney(p.moneyIn), earned: formatSigned(p.balance - p.moneyIn) })),
)
</script>

<template>
  <section id="chapter-1" class="chapter story-pin" aria-labelledby="chapter-1-title">
    <ChapterMark :n="1" />
    <h2 id="chapter-1-title">{{ copy.titles['1'] }}</h2>
    <p class="chapter__claim">{{ claim }}</p>
    <ChartFrame :title="title" :level="3" :summary="summary" :columns="columns" :rows="rows">
      <template #controls><RangeButtons v-model="range" /></template>
      <button
        type="button"
        class="chapter__toggle"
        :aria-pressed="layers ? 'true' : 'false'"
        @click="layers = !layers"
      >
        <span class="mdi" :class="layers ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'" aria-hidden="true" />
        {{ S.layers }}
      </button>
      <BalanceChart :points="points" :label="title" :layers="layers" />
    </ChartFrame>
  </section>
</template>
