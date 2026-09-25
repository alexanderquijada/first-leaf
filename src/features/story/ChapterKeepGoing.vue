<script setup lang="ts">
import ChapterMark from './ChapterMark.vue'
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
import CopyText from '@/shared/components/CopyText.vue'
import { fill } from '@/shared/copy'
import copy from './copy.json'

const K = copy.keepGoing

const whole = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
const nia = story.savers.find((s) => s.id === 'nia')!
const theo = story.savers.find((s) => s.id === 'theo')!
const endAge = story.assumptions.endAge
const ages = Array.from({ length: endAge - nia.startAge + 1 }, (_, i) => nia.startAge + i)
const valueAt = (yearly: { age: number; value: number }[], age: number) => yearly.find((y) => y.age === age)?.value ?? null

// 5a–5c: the guess and the answer
const guess = ref<'nia' | 'theo' | null>(null)
const reply = computed(() =>
  guess.value === 'nia' ? K.gotIt : guess.value === 'theo' ? K.theoGuess : K.noGuess,
)
const friendsSeries = computed(() => [
  { label: K.nia, data: ages.map((a) => valueAt(nia.yearly, a)), color: colors.forest, width: 4 },
  { label: K.theo, data: ages.map((a) => valueAt(theo.yearly, a)), color: colors.mustard, width: 2.5, dash: [6, 4] },
])
const describeFriends = (i: number) => {
  const a = ages[i]!, n = valueAt(nia.yearly, a), t = valueAt(theo.yearly, a)
  return fill(K.day, { age: a, nia: whole(n ?? 0), theo: t === null ? K.theoNotYet : fill(K.theoHas, { amount: whole(t) }) })
}
const friendsRows = ages.map((a) => ({ age: String(a), nia: whole(valueAt(nia.yearly, a) ?? 0), theo: valueAt(theo.yearly, a) === null ? K.notStarted : whole(valueAt(theo.yearly, a)!) }))
const friendsCols = [{ key: 'age', label: K.colAge }, { key: 'nia', label: K.nia, numeric: true }, { key: 'theo', label: K.theo, numeric: true }]
const friendsTitle = fill(K.friendsTitle, { startAge: nia.startAge, endAge })

// 5a: the answer stays hidden until a guess, or until "Show the answer" (the guess is optional).
const revealed = ref(false)
const answerShown = computed(() => revealed.value || guess.value !== null)

// 5c: Nia's money splits into what she put in and what it grew into.
const niaPutIn = ages.map((a) => (a < nia.startAge ? null : Math.round((a - nia.startAge) * 12 * nia.monthly)))
const splitSeries = [
  { label: K.niaMoney, data: ages.map((a) => valueAt(nia.yearly, a)), color: colors.forest, width: 3, fill: '+1' as const, background: 'rgba(39, 107, 67, 0.26)', grain: true },
  { label: K.niaPutIn, data: niaPutIn, color: colors.inkMuted, width: 2, dash: [6, 4], fill: 'origin' as const, background: colors.mint },
]
const describeSplit = (i: number) => fill(K.daySplit, { age: ages[i]!, value: whole(valueAt(nia.yearly, ages[i]!) ?? 0), putIn: whole(niaPutIn[i] ?? 0) })
const splitCols = [{ key: 'age', label: K.colAge }, { key: 'value', label: K.colMoney, numeric: true }, { key: 'putIn', label: K.colPutIn, numeric: true }]
const splitRows = ages.map((a, i) => ({ age: String(a), value: whole(valueAt(nia.yearly, a) ?? 0), putIn: whole(niaPutIn[i] ?? 0) }))

// One line from a start age to 65, on a shared age axis (5d and 5g).
const allAges = Array.from({ length: endAge - story.startAgeSlider.min + 1 }, (_, i) => story.startAgeSlider.min + i)
function oneLine(start: number, monthly: number) {
  const yearly = project(start, monthly).yearly
  return allAges.map((a) => yearly.find((y) => y.age === a)?.value ?? null)
}
const oneCols = [{ key: 'age', label: K.colAge }, { key: 'value', label: K.colMoney, numeric: true }]
const oneRows = (data: (number | null)[]) => allAges.flatMap((a, i) => (data[i] === null ? [] : [{ age: String(a), value: whole(data[i]!) }]))
const describeOne = (data: (number | null)[]) => (i: number) => fill(K.dayOne, { age: allAges[i]!, value: data[i] === null ? K.notStarted : whole(data[i]!) })

// 5d: every year counts
const startAge = ref(nia.startAge)
const startResult = computed(() => project(startAge.value, story.startAgeSlider.monthly))
const saverLine = computed(() => oneLine(startAge.value, story.startAgeSlider.monthly))
const saverTitle = computed(() => fill(K.oneTitle, { monthly: whole(story.startAgeSlider.monthly), age: startAge.value, endAge }))

// 5e: can Theo catch up?
const theoMonthly = ref(story.catchUp.slider.min)
const theoResult = computed(() => project(theo.startAge, theoMonthly.value))
const passes = computed(() => theoResult.value.value >= nia.final.value)
const catchSeries = computed(() => {
  const yearly = theoResult.value.yearly
  return [
    { label: K.nia, data: ages.map((a) => valueAt(nia.yearly, a)), color: colors.forest, width: 4 },
    { label: K.theo, data: ages.map((a) => yearly.find((y) => y.age === a)?.value ?? null), color: colors.mustard, width: 2.5, dash: [6, 4] },
  ]
})
const catchTitle = computed(() => fill(K.catchTitle, { monthly: whole(theoMonthly.value) }))
const describeCatch = (i: number) => {
  const [n, t] = catchSeries.value
  return fill(K.day, { age: ages[i]!, nia: whole(n!.data[i] ?? 0), theo: t!.data[i] === null ? K.theoNotYet : fill(K.theoHas, { amount: whole(t!.data[i]!) }) })
}
const catchRows = computed(() => ages.map((a, i) => ({ age: String(a), nia: whole(catchSeries.value[0]!.data[i] ?? 0), theo: catchSeries.value[1]!.data[i] === null ? K.notStarted : whole(catchSeries.value[1]!.data[i]!) })))

// 5f: smooth or bumpy
const shape = ref<'smooth' | 'bumpy'>('smooth')
const shapeSeries = computed(() => {
  const n = shape.value === 'smooth' ? nia.yearly : story.bumpy.nia
  const t = shape.value === 'smooth' ? theo.yearly : story.bumpy.theo
  return [
    { label: K.nia, data: ages.map((a) => valueAt(n, a)), color: colors.forest, width: 4 },
    { label: K.theo, data: ages.map((a) => valueAt(t, a)), color: colors.mustard, width: 2.5, dash: [6, 4] },
  ]
})
const describeShape = (i: number) => {
  const [n, t] = shapeSeries.value
  return fill(K.day, { age: ages[i]!, nia: whole(n!.data[i] ?? 0), theo: t!.data[i] === null ? K.theoNotYet : fill(K.theoHas, { amount: whole(t!.data[i]!) }) })
}
const shapeRows = computed(() => ages.map((a, i) => ({ age: String(a), nia: whole(shapeSeries.value[0]!.data[i] ?? 0), theo: shapeSeries.value[1]!.data[i] === null ? K.notStarted : whole(shapeSeries.value[1]!.data[i]!) })))
const shapeEnd = computed(() => ({ nia: shapeSeries.value[0]!.data.at(-1)!, theo: shapeSeries.value[1]!.data.at(-1)! }))

// 5g: your turn
const myAge = ref(story.yourTurn.startAge)
const myMonthly = ref(story.yourTurn.monthly)
const myResult = computed(() => project(myAge.value, myMonthly.value))
const myLine = computed(() => oneLine(myAge.value, myMonthly.value))
const myTitle = computed(() => fill(K.yourTitle, { age: myAge.value, endAge }))
// The bumpy note compares bumpy to smooth, so it is shown only for the bumpy years.
const shapeSummary = computed(() => fill(K.shapeSummary, { note: shape.value === 'bumpy' ? story.bumpy.note : '', nia: whole(shapeEnd.value.nia), theo: whole(shapeEnd.value.theo) }).trim())
const claim = (id: string) => story.claims.find((c) => c.id === id)?.text ?? ''
const perMonth = (v: number) => fill(K.perMonth, { dollars: v })
const startAt = (v: number) => fill(K.startAt, { age: v })
</script>

<template>
  <section id="chapter-5" class="chapter" aria-labelledby="chapter-5-title">
    <ChapterMark :n="5" />
    <h2 id="chapter-5-title">{{ copy.titles['5'] }}</h2>
    <p class="chapter__claim">
      {{ fill(K.meet, { niaAge: nia.startAge, niaMonthly: whole(nia.monthly), theoAge: theo.startAge, theoMonthly: whole(theo.monthly) }) }}
    </p>
    <p class="k5__note">{{ story.assumptions.note }}</p>

    <!-- Each step sits beside its own chart from 1024px (StoryView's .story-pin). -->
    <div class="k5__step" :class="{ 'story-pin': answerShown }">
      <h3 class="k5__h">{{ fill(K.guessHeading, { age: endAge }) }}</h3>
      <ToggleGroup
        v-model="guess as unknown as 'nia' | 'theo'"
        :label="K.guessLabel"
        :options="[{ id: 'nia', label: K.nia }, { id: 'theo', label: K.theo }]"
      />
      <button v-if="!answerShown" type="button" class="k5__reveal" @click="revealed = true">{{ K.showAnswer }}</button>
      <p v-if="answerShown" class="chapter__claim" aria-live="polite">
        {{ fill(K.result, { reply, age: endAge, nia: whole(nia.final.value), theo: whole(theo.final.value) }) }}
      </p>
      <div v-if="answerShown" class="k5__card">
        <ChartFrame :title="friendsTitle" :level="4" :summary="`${claim('early-ends-ahead')} ${claim('early-puts-in-less')}`" :columns="friendsCols" :rows="friendsRows">
          <SeriesChart :labels="ages.map(String)" :series="friendsSeries" :describe="describeFriends" :label="friendsTitle" />
        </ChartFrame>
      </div>
    </div>

    <!-- Everything after the guess would give the answer away, so it waits for a guess or "Show the answer" (5a). -->
    <template v-if="answerShown">
    <div class="k5__step story-pin">
      <h3 class="k5__h">{{ K.whyHeading }}</h3>
      <p class="chapter__claim">
        <CopyText :text="K.why" :values="{ nia: whole(nia.final.putIn), theo: whole(theo.final.putIn), claim: claim('early-earned-share') }"
          ><template #growth><TermTip id="compound-growth">{{ K.growthWord }}</TermTip></template></CopyText
        >
      </p>
      <div class="k5__card">
        <ChartFrame :title="K.splitTitle" :level="4" :summary="claim('early-earned-share')" :columns="splitCols" :rows="splitRows">
          <SeriesChart :labels="ages.map(String)" :series="splitSeries" :describe="describeSplit" :label="K.splitTitle" />
        </ChartFrame>
      </div>
    </div>

    <div class="k5__step story-pin">
      <h3 class="k5__h">{{ K.everyYear }}</h3>
      <StorySlider
        v-model="startAge"
        :label="K.startAge"
        :min="story.startAgeSlider.min"
        :max="story.startAgeSlider.max"
        :step="story.startAgeSlider.step"
        :value-text="startAt"
      />
      <p class="chapter__claim" aria-live="polite">
        {{ fill(K.startResult, { age: startAge, endAge, value: whole(startResult.value), putIn: whole(startResult.putIn) })
        }}<template v-if="startAge === story.startAgeSlider.max">{{ fill(K.startLate, { age: startAge }) }}</template>
      </p>
      <div class="k5__card">
        <ChartFrame :title="saverTitle" :level="4" :summary="fill(K.startResult, { age: startAge, endAge, value: whole(startResult.value), putIn: whole(startResult.putIn) })" :columns="oneCols" :rows="oneRows(saverLine)">
          <SeriesChart :labels="allAges.map(String)" :series="[{ label: K.saver, data: saverLine, color: colors.forest, width: 3 }]" :describe="describeOne(saverLine)" :label="saverTitle" />
        </ChartFrame>
      </div>
    </div>

    <div class="k5__step story-pin">
      <h3 class="k5__h">{{ K.catchUpHeading }}</h3>
      <StorySlider
        v-model="theoMonthly"
        :label="K.theoMonthly"
        :min="story.catchUp.slider.min"
        :max="story.catchUp.slider.max"
        :step="story.catchUp.slider.step"
        :value-text="perMonth"
        :mark="{ value: story.catchUp.monthlyNeeded, label: fill(K.passesMark, { dollars: story.catchUp.monthlyNeeded }) }"
      />
      <p class="chapter__claim" aria-live="polite" data-testid="catch-up">
        {{ fill(K.catchUp, { monthly: whole(theoMonthly), theo: whole(theoResult.value), nia: whole(nia.final.value) }) }}
        <template v-if="passes">{{ fill(K.passes, { monthly: whole(theoMonthly) }) }}</template>
        <template v-else>{{ K.behind }}</template>
      </p>
      <p class="k5__note">{{ fill(K.catchUpNote, { claim: claim('catch-up-costs-more') }) }}</p>
      <div class="k5__card">
        <ChartFrame :title="catchTitle" :level="4" :summary="fill(K.catchUp, { monthly: whole(theoMonthly), theo: whole(theoResult.value), nia: whole(nia.final.value) })" :columns="friendsCols" :rows="catchRows">
          <SeriesChart :labels="ages.map(String)" :series="catchSeries" :describe="describeCatch" :label="catchTitle" />
        </ChartFrame>
      </div>
    </div>

    <div class="k5__step story-pin">
      <h3 class="k5__h">{{ K.bumpyHeading }}</h3>
      <ToggleGroup v-model="shape" :label="K.growth" :options="[{ id: 'smooth', label: K.smooth }, { id: 'bumpy', label: K.bumpy }]" />
      <p class="chapter__claim">{{ claim('early-ahead-when-bumpy') }}</p>
      <div class="k5__card">
        <ChartFrame
          :title="shape === 'smooth' ? K.smoothTitle : K.bumpyTitle"
          :level="4"
          :summary="shapeSummary"
          :columns="friendsCols"
          :rows="shapeRows"
        >
          <SeriesChart :labels="ages.map(String)" :series="shapeSeries" :describe="describeShape" :label="shape === 'smooth' ? K.smoothTitle : K.bumpyTitle" />
        </ChartFrame>
      </div>
    </div>

    <div class="k5__step story-pin">
      <h3 class="k5__h">{{ K.yourTurn }}</h3>
      <StorySlider v-model="myAge" :label="K.startAge" :min="story.startAgeSlider.min" :max="story.startAgeSlider.max" :step="1" :value-text="startAt" />
      <StorySlider v-model="myMonthly" :label="K.eachMonth" :min="25" :max="500" :step="5" :value-text="perMonth" />
      <p class="chapter__claim" aria-live="polite" data-testid="your-turn">
        {{ fill(K.yourResult, { age: myAge, monthly: whole(myMonthly), endAge, value: whole(myResult.value) }) }}
      </p>
      <div class="k5__card">
        <ChartFrame :title="myTitle" :level="4" :summary="fill(K.yourResult, { age: myAge, monthly: whole(myMonthly), endAge, value: whole(myResult.value) })" :columns="oneCols" :rows="oneRows(myLine)">
          <SeriesChart :labels="allAges.map(String)" :series="[{ label: K.you, data: myLine, color: colors.forest, width: 3 }]" :describe="describeOne(myLine)" :label="myTitle" />
        </ChartFrame>
      </div>
    </div>
    </template>
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

.k5__reveal {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  margin-top: 12px;
  padding: 0 18px;
  border: 1px solid var(--color-forest);
  border-radius: 999px;
  background: var(--color-paper);
  color: var(--color-forest);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.k5__card :deep(.fl-chart) {
  margin-top: 0;
}

.chapter :deep(.fl-toggles) {
  margin-top: 8px;
}
</style>
