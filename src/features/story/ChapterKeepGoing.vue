<script setup lang="ts">
// Chapter 5: What happens if you keep going. Nia and Theo (two friends), the guess,
// the start-age and catch-up sliders, smooth vs. bumpy, then Rosa's own slider.
// Every number comes from story-p302.json or the same formula rule T1 checks.
import { computed, ref } from 'vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import SeriesChart from '@/shared/charts/SeriesChart.vue'
import TermTip from '@/shared/components/TermTip.vue'
import ToggleGroup from '@/shared/components/ToggleGroup.vue'
import { story } from '@/shared/data'
import { project } from '@/shared/story'
import { colors } from '@/shared/tokens/tokens'
import StorySlider from './StorySlider.vue'

const whole = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
const nia = story.savers.find((s) => s.id === 'nia')!
const theo = story.savers.find((s) => s.id === 'theo')!
const endAge = story.assumptions.endAge
const ages = Array.from({ length: endAge - nia.startAge + 1 }, (_, i) => nia.startAge + i)
const valueAt = (yearly: { age: number; value: number }[], age: number) => yearly.find((y) => y.age === age)?.value ?? null

// 5a–5c: the guess and the answer
const guess = ref<'nia' | 'theo' | null>(null)
const reply = computed(() =>
  guess.value === 'nia' ? 'You got it.' : guess.value === 'theo' ? 'Theo puts in more each month, so he seems like the safe guess.' : 'Here is how it turns out.',
)
const friendsSeries = computed(() => [
  { label: 'Nia', data: ages.map((a) => valueAt(nia.yearly, a)), color: colors.forest, width: 4 },
  { label: 'Theo', data: ages.map((a) => valueAt(theo.yearly, a)), color: colors.mustard, width: 2.5 },
])
const describeFriends = (i: number) => {
  const a = ages[i]!, n = valueAt(nia.yearly, a), t = valueAt(theo.yearly, a)
  return `Age ${a}: Nia has ${whole(n ?? 0)}. ${t === null ? 'Theo has not started yet.' : `Theo has ${whole(t)}.`}`
}
const friendsRows = ages.map((a) => ({ age: String(a), nia: whole(valueAt(nia.yearly, a) ?? 0), theo: valueAt(theo.yearly, a) === null ? 'Not started' : whole(valueAt(theo.yearly, a)!) }))
const friendsCols = [{ key: 'age', label: 'Age' }, { key: 'nia', label: 'Nia', numeric: true }, { key: 'theo', label: 'Theo', numeric: true }]

// 5d: every year counts
const startAge = ref(nia.startAge)
const startResult = computed(() => project(startAge.value, story.startAgeSlider.monthly))

// 5e: can Theo catch up?
const theoMonthly = ref(story.catchUp.slider.min)
const theoResult = computed(() => project(theo.startAge, theoMonthly.value))
const passes = computed(() => theoResult.value.value >= nia.final.value)

// 5f: smooth or bumpy
const shape = ref<'smooth' | 'bumpy'>('smooth')
const shapeSeries = computed(() => {
  const n = shape.value === 'smooth' ? nia.yearly : story.bumpy.nia
  const t = shape.value === 'smooth' ? theo.yearly : story.bumpy.theo
  return [
    { label: 'Nia', data: ages.map((a) => valueAt(n, a)), color: colors.forest, width: 4 },
    { label: 'Theo', data: ages.map((a) => valueAt(t, a)), color: colors.mustard, width: 2.5 },
  ]
})
const describeShape = (i: number) => {
  const [n, t] = shapeSeries.value
  return `Age ${ages[i]}: Nia has ${whole(n!.data[i] ?? 0)}. ${t!.data[i] === null ? 'Theo has not started yet.' : `Theo has ${whole(t!.data[i]!)}.`}`
}
const shapeRows = computed(() => ages.map((a, i) => ({ age: String(a), nia: whole(shapeSeries.value[0]!.data[i] ?? 0), theo: shapeSeries.value[1]!.data[i] === null ? 'Not started' : whole(shapeSeries.value[1]!.data[i]!) })))
const shapeEnd = computed(() => ({ nia: shapeSeries.value[0]!.data.at(-1)!, theo: shapeSeries.value[1]!.data.at(-1)! }))

// 5g: your turn
const myAge = ref(story.yourTurn.startAge)
const myMonthly = ref(story.yourTurn.monthly)
const myResult = computed(() => project(myAge.value, myMonthly.value))
const claim = (id: string) => story.claims.find((c) => c.id === id)?.text ?? ''
</script>

<template>
  <section id="chapter-5" class="chapter" aria-labelledby="chapter-5-title">
    <p class="chapter__num">Chapter 5</p>
    <h2 id="chapter-5-title">What happens if you keep going</h2>
    <p class="chapter__claim">
      Meet two friends, Nia and Theo. Nia starts at {{ nia.startAge }} and puts in {{ whole(nia.monthly) }} a month.
      Theo waits until {{ theo.startAge }} and puts in {{ whole(theo.monthly) }} a month.
    </p>
    <p class="k5__note">{{ story.assumptions.note }}</p>

    <h3 class="k5__h">Make a guess: who has more at {{ endAge }}?</h3>
    <ToggleGroup
      v-model="guess as unknown as 'nia' | 'theo'"
      label="Your guess"
      :options="[{ id: 'nia', label: 'Nia' }, { id: 'theo', label: 'Theo' }]"
    />
    <p class="chapter__claim" aria-live="polite">
      {{ reply }} At {{ endAge }}, Nia has {{ whole(nia.final.value) }}. Theo has {{ whole(theo.final.value) }}.
    </p>
    <div class="k5__card">
      <ChartFrame title="Nia and Theo from 22 to 65" :level="3" :summary="`${claim('early-ends-ahead')} ${claim('early-puts-in-less')}`" :columns="friendsCols" :rows="friendsRows">
        <SeriesChart :labels="ages.map(String)" :series="friendsSeries" :describe="describeFriends" label="Nia and Theo from 22 to 65" />
      </ChartFrame>
    </div>

    <h3 class="k5__h">Why Nia ends ahead</h3>
    <p class="chapter__claim">
      Nia put in {{ whole(nia.final.putIn) }}. Theo put in {{ whole(theo.final.putIn) }}. {{ claim('early-earned-share') }}
      That is <TermTip id="compound-growth">growth on growth</TermTip>: your money earns money, and that money earns more.
    </p>

    <h3 class="k5__h">Every year counts</h3>
    <StorySlider
      v-model="startAge"
      label="Start age"
      :min="story.startAgeSlider.min"
      :max="story.startAgeSlider.max"
      :step="story.startAgeSlider.step"
      :value-text="(v) => `Start at ${v}`"
    />
    <p class="chapter__claim" aria-live="polite">
      Start at {{ startAge }}. At {{ endAge }} you would have {{ whole(startResult.value) }}. You would put in
      {{ whole(startResult.putIn) }}.<template v-if="startAge === story.startAgeSlider.max"> Starting at {{ startAge }} still helps. It just has fewer years to grow.</template>
    </p>

    <h3 class="k5__h">Can Theo catch up?</h3>
    <StorySlider
      v-model="theoMonthly"
      label="Theo each month"
      :min="story.catchUp.slider.min"
      :max="story.catchUp.slider.max"
      :step="story.catchUp.slider.step"
      :value-text="(v) => `$${v} a month`"
      :mark="{ value: story.catchUp.monthlyNeeded, label: `Passes Nia: $${story.catchUp.monthlyNeeded}` }"
    />
    <p class="chapter__claim" aria-live="polite" data-testid="catch-up">
      At {{ whole(theoMonthly) }} a month, Theo ends with {{ whole(theoResult.value) }}. Nia ends with {{ whole(nia.final.value) }}.
      <template v-if="passes"> At {{ whole(theoMonthly) }} a month, Theo passes Nia.</template>
      <template v-else> Theo is still behind.</template>
    </p>
    <p class="k5__note">{{ claim('catch-up-costs-more') }} That is almost twice what Nia puts in.</p>

    <h3 class="k5__h">Real life is bumpy</h3>
    <ToggleGroup v-model="shape" label="Growth" :options="[{ id: 'smooth', label: 'Smooth' }, { id: 'bumpy', label: 'Bumpy' }]" />
    <div class="k5__card">
      <ChartFrame
        :title="shape === 'smooth' ? 'Smooth years' : 'Bumpy years'"
        :level="3"
        :summary="`${story.bumpy.note} Nia ends with ${whole(shapeEnd.nia)}. Theo ends with ${whole(shapeEnd.theo)}.`"
        :columns="friendsCols"
        :rows="shapeRows"
      >
        <SeriesChart :labels="ages.map(String)" :series="shapeSeries" :describe="describeShape" :label="shape === 'smooth' ? 'Smooth years' : 'Bumpy years'" />
      </ChartFrame>
    </div>
    <p class="chapter__claim">{{ claim('early-ahead-when-bumpy') }}</p>

    <h3 class="k5__h">Your turn</h3>
    <StorySlider v-model="myAge" label="Start age" :min="story.startAgeSlider.min" :max="story.startAgeSlider.max" :step="1" :value-text="(v) => `Start at ${v}`" />
    <StorySlider v-model="myMonthly" label="Each month" :min="25" :max="500" :step="5" :value-text="(v) => `$${v} a month`" />
    <p class="chapter__claim" aria-live="polite" data-testid="your-turn">
      Start at {{ myAge }} with {{ whole(myMonthly) }} a month. At {{ endAge }} you would have {{ whole(myResult.value) }}.
    </p>
    <p class="k5__note">{{ story.yourTurn.note }}</p>
  </section>
</template>

<style scoped>
.k5__h {
  margin-top: 28px;
  font-size: 1.375rem;
}

.k5__note {
  margin: 8px 0 0;
  color: var(--color-ink-muted);
}

.k5__card {
  margin-top: 16px;
}

.k5__card :deep(.fl-chart) {
  margin-top: 0;
}

.chapter :deep(.fl-toggles) {
  margin-top: 8px;
}
</style>
