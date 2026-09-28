<script setup lang="ts">
// Section 1, "Six months in": what she put in against what it's worth now (one chart, with the
// put-in / earned layers and a time range). Body text: the point of view, her deposits share,
// and the rate-of-return line (at most 60 words, Phase 6).
import { computed, ref } from 'vue'
import BalanceChart from '@/shared/charts/BalanceChart.vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import RangeButtons from '@/shared/charts/RangeButtons.vue'
import { inRange, type RangeId } from '@/shared/charts/ranges'
import CopyText from '@/shared/components/CopyText.vue'
import TermTip from '@/shared/components/TermTip.vue'
import type { Account, RosaStory } from '@/shared/data'
import { fill } from '@/shared/copy'
import { formatDate, formatMoney, formatSigned } from '@/shared/format'
import copy from './copy.json'

const S = copy.sinceMarch

const props = defineProps<{ story: RosaStory; account: Account }>()
const range = ref<RangeId>('all')
const layers = ref(true)
const points = computed(() => inRange(props.account.history, range.value))
const share = computed(() => props.story.claims.find((c) => c.id === 'deposits-share')?.text ?? '')
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
  <div class="section-body">
    <p class="section__claim">{{ story.pointOfView }}</p>
    <p class="section__claim">{{ share }}</p>
    <p class="section__claim">
      <CopyText :text="copy.one.rateLine"><template #rate><TermTip id="rate-of-return">{{ copy.one.rateWord }}</TermTip></template></CopyText>
    </p>
  </div>
  <ChartFrame :title="title" :level="3" :summary="summary" :columns="columns" :rows="rows">
    <template #controls><RangeButtons v-model="range" /></template>
    <button type="button" class="section__toggle" :aria-pressed="layers ? 'true' : 'false'" @click="layers = !layers">
      <span class="mdi" :class="layers ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'" aria-hidden="true" />
      {{ S.layers }}
    </button>
    <BalanceChart :points="points" :label="title" :layers="layers" />
  </ChartFrame>
</template>
