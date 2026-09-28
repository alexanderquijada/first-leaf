<script setup lang="ts">
// Section 3, "Start early": Nia and Theo (P302's argument: starting early beats starting big).
// Two sliders move Theo's start age and his monthly amount; one chart shows both friends.
// Every number comes from story-p302.json or the growth formula rule T1 checks.
import { computed, ref } from 'vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import SeriesChart from '@/shared/charts/SeriesChart.vue'
import CopyText from '@/shared/components/CopyText.vue'
import TermTip from '@/shared/components/TermTip.vue'
import { story } from '@/shared/data'
import { project } from '@/shared/story'
import { colors } from '@/shared/tokens/tokens'
import { fill } from '@/shared/copy'
import StorySlider from './StorySlider.vue'
import copy from './copy.json'

const K = copy.startEarly
const whole = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
const nia = story.savers.find((s) => s.id === 'nia')!
const theo = story.savers.find((s) => s.id === 'theo')!
const endAge = story.assumptions.endAge
const firstAge = story.startAgeSlider.min
const ages = Array.from({ length: endAge - firstAge + 1 }, (_, i) => firstAge + i)

const theoAge = ref(theo.startAge)
const theoMonthly = ref(theo.monthly)
const theoResult = computed(() => project(theoAge.value, theoMonthly.value))
const passes = computed(() => theoResult.value.value >= nia.final.value)

const at = (yearly: { age: number; value: number }[], age: number) => yearly.find((y) => y.age === age)?.value ?? null
const series = computed(() => [
  { label: K.nia, data: ages.map((a) => at(nia.yearly, a)), color: colors.forest, width: 4 },
  { label: K.theo, data: ages.map((a) => at(theoResult.value.yearly, a)), color: colors.mustard, width: 2.5, dash: [6, 4] },
])
const title = fill(K.chartTitle, { startAge: firstAge, endAge })
const describe = (i: number) => {
  const [n, t] = series.value
  return fill(K.day, { age: ages[i]!, nia: n!.data[i] === null ? K.notStarted : whole(n!.data[i]!), theo: t!.data[i] === null ? K.theoNotYet : fill(K.theoHas, { amount: whole(t!.data[i]!) }) })
}
const columns = [{ key: 'age', label: K.colAge }, { key: 'nia', label: K.nia, numeric: true }, { key: 'theo', label: K.theo, numeric: true }]
const rows = computed(() =>
  ages.map((a, i) => ({
    age: String(a),
    nia: series.value[0]!.data[i] === null ? K.notStarted : whole(series.value[0]!.data[i]!),
    theo: series.value[1]!.data[i] === null ? K.notStarted : whole(series.value[1]!.data[i]!),
  })),
)
const result = computed(() => `${fill(K.result, { age: endAge, theo: whole(theoResult.value.value), nia: whole(nia.final.value) })}${passes.value ? K.passes : K.behind}`)
const perMonth = (v: number) => fill(K.perMonth, { dollars: v })
const startAt = (v: number) => fill(K.startAt, { age: v })
// "Passes Nia at $196" is true when Theo starts at 32, as in the story's claim.
const mark = computed(() =>
  theoAge.value === theo.startAge ? { value: story.catchUp.monthlyNeeded, label: fill(K.passesMark, { dollars: story.catchUp.monthlyNeeded }) } : undefined,
)
</script>

<template>
  <div class="section-body">
    <p class="section__claim">
      {{ fill(K.meet, { nia: K.nia, niaAge: nia.startAge, niaMonthly: whole(nia.monthly), theo: K.theo, theoAge: theo.startAge, theoMonthly: whole(theo.monthly) }) }}
    </p>
    <p class="section__claim">
      <CopyText :text="K.why" :values="{ nia: K.nia, count: theo.startAge - nia.startAge }"
        ><template #compounding><TermTip id="compounding">{{ K.compoundingWord }}</TermTip></template></CopyText
      >
    </p>
    <StorySlider v-model="theoAge" :label="K.theoAge" :min="story.startAgeSlider.min" :max="story.startAgeSlider.max" :step="1" :value-text="startAt" />
    <StorySlider
      v-model="theoMonthly"
      :label="K.theoMonthly"
      :min="story.catchUp.slider.min"
      :max="story.catchUp.slider.max"
      :step="story.catchUp.slider.step"
      :value-text="perMonth"
      :mark="mark"
    />
    <p class="section__claim" aria-live="polite" data-testid="start-early-result">{{ result }}</p>
    <p class="section__note">{{ story.assumptions.note }}</p>
  </div>
  <ChartFrame :title="title" :level="3" :summary="result" :columns="columns" :rows="rows">
    <SeriesChart :labels="ages.map(String)" :series="series" :describe="describe" :label="title" />
  </ChartFrame>
</template>
