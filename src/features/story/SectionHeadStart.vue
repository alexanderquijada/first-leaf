<script setup lang="ts">
// Section 3, "Your head start" (Phase 6.1): Rosa's own money from her age now to 65, two ways.
// "Keep going" adds her $150 every month (solid line); "Start again later" stops adding now and
// starts again after the delay (dashed line). Two sliders set the delay and the later amount; a
// marker shows the catch-up amount. It describes what could happen and never says what to do.
// Every number is story data (the keep-going line, the catch-up amounts) or the formula rule T1
// checks (the later line as the sliders move).
import { computed, ref } from 'vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import SeriesChart from '@/shared/charts/SeriesChart.vue'
import CopyText from '@/shared/components/CopyText.vue'
import TermTip from '@/shared/components/TermTip.vue'
import { story, type Account } from '@/shared/data'
import { headStartLine } from '@/shared/story'
import { colors } from '@/shared/tokens/tokens'
import { fill } from '@/shared/copy'
import StorySlider from './StorySlider.vue'
import copy from './copy.json'

const props = defineProps<{ account: Account }>()
const K = copy.headStart
const hs = story.headStart
const whole = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

// A brand-new account hasn't started yet, so its lines are "Start now" and "Start later".
const isNew = computed(() => !props.account.history.length)
const line = computed(() => hs.accounts[props.account.id])
const keepLabel = computed(() => (isNew.value ? K.keepLabelNew : K.keepLabel))
const laterLabel = computed(() => (isNew.value ? K.laterLabelNew : K.laterLabel))

const delay = ref(hs.delay.default)
const add = ref(hs.add.default)
const later = computed(() => headStartLine(line.value.start, add.value, delay.value))
const keep = computed(() => line.value.keepGoing)
const ages = computed(() => keep.value.map((p) => p.age))

const series = computed(() => [
  { label: keepLabel.value, data: keep.value.map((p) => p.value), color: colors.forest, width: 4 },
  { label: laterLabel.value, data: later.value.map((p) => p.value), color: colors.mustard, width: 2.5, dash: [6, 4] },
])
const title = fill(K.chartTitle, { startAge: hs.startAge, endAge: hs.endAge })
const result = computed(() =>
  fill(isNew.value ? K.resultNew : K.result, { endAge: hs.endAge, keep: whole(keep.value.at(-1)!.value), later: whole(later.value.at(-1)!.value) }),
)
const describe = (i: number) =>
  fill(isNew.value ? K.dayNew : K.day, { age: ages.value[i]!, keep: whole(keep.value[i]!.value), later: whole(later.value[i]!.value) })
const columns = computed(() => [{ key: 'age', label: K.colAge }, { key: 'keep', label: keepLabel.value, numeric: true }, { key: 'later', label: laterLabel.value, numeric: true }])
const rows = computed(() => ages.value.map((a, i) => ({ age: String(a), keep: whole(keep.value[i]!.value), later: whole(later.value[i]!.value) })))

const yearsText = (v: number) => (v === 1 ? K.yearsOne : fill(K.yearsMany, { years: v }))
const perMonth = (v: number) => fill(K.perMonth, { dollars: v })
// The catch-up amount for the chosen delay, from the data (rule T2); none on the slider, and it says so.
const catchUp = computed(() => hs.catchUp.find((c) => c.years === delay.value)?.monthly ?? null)
const mark = computed(() => (catchUp.value === null ? undefined : { value: catchUp.value, label: fill(K.catchesMark, { dollars: catchUp.value }) }))
const hint = computed(() => (catchUp.value === null ? fill(K.noCatch, { dollars: hs.add.max }) : undefined))
</script>

<template>
  <div class="section-body">
    <p class="section__claim">
      <CopyText :text="isNew ? K.introNew : K.intro" :values="{ startAge: hs.startAge, monthly: whole(hs.monthly), endAge: hs.endAge }"
        ><template #compounding><TermTip id="compounding">{{ K.compoundingWord }}</TermTip></template></CopyText
      >
    </p>
    <StorySlider v-model="delay" :label="isNew ? K.delayLabelNew : K.delayLabel" :min="hs.delay.min" :max="hs.delay.max" :step="hs.delay.step" :value-text="yearsText" />
    <StorySlider v-model="add" :label="K.addLabel" :min="hs.add.min" :max="hs.add.max" :step="hs.add.step" :value-text="perMonth" :mark="mark" :hint="hint" />
    <p class="section__claim" aria-live="polite" data-testid="head-start-result">{{ result }}</p>
    <p class="section__note">{{ story.assumptions.note }}</p>
  </div>
  <ChartFrame :title="title" :level="3" :summary="result" :columns="columns" :rows="rows">
    <SeriesChart :labels="ages.map(String)" :series="series" :describe="describe" :label="title" />
  </ChartFrame>
</template>
