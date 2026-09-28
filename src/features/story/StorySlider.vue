<script setup lang="ts">
// A real range input: the arrow keys move it, and its value is announced in words.
// At least 48px tall, so it's easy to grab with a thumb. An optional mark shows a
// point on the track (for example the amount that catches up); screen readers hear it as the
// slider's description. A hint takes its place when there is no point to mark.
import { computed, useId } from 'vue'
import CopyText from '@/shared/components/CopyText.vue'
import copy from './copy.json'

const props = defineProps<{
  label: string
  min: number
  max: number
  step: number
  /** How the value reads aloud, e.g. "Start at 30" or "$196 a month". */
  valueText: (v: number) => string
  mark?: { value: number; label: string }
  /** A line under the slider when there is no mark to show (for example, no amount catches up). */
  hint?: string
}>()
const value = defineModel<number>({ required: true })
const id = `fl-slider-${useId()}`
const markPct = computed(() => (props.mark ? ((props.mark.value - props.min) / (props.max - props.min)) * 100 : 0))
</script>

<template>
  <div class="slider">
    <label :for="id" class="slider__label"><CopyText :text="copy.slider.label" :values="{ label }"><template #setting><strong>{{ valueText(value) }}</strong></template></CopyText></label>
    <div class="slider__track" :class="{ 'slider__track--marked': mark }">
      <input
        :id="id"
        v-model.number="value"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :aria-valuetext="valueText(value)"
        :aria-describedby="mark ? `${id}-mark` : hint ? `${id}-hint` : undefined"
      />
      <!-- The line sits exactly on the marked value. The label moves with it but is shifted by the
           same share of its own width, so it starts flush left at the low end and ends flush right
           at the high end: it never leaves the track (Phase 6.1 review). -->
      <template v-if="mark">
        <span class="slider__mark-line" :style="{ left: `${markPct}%` }" aria-hidden="true" />
        <span :id="`${id}-mark`" class="slider__mark-label" :style="{ left: `${markPct}%`, transform: `translateX(-${markPct}%)` }" aria-hidden="true">{{ mark.label }}</span>
      </template>
    </div>
    <p v-if="hint" :id="`${id}-hint`" class="slider__hint">{{ hint }}</p>
    <p class="slider__ends" aria-hidden="true"><span>{{ valueText(min) }}</span><span>{{ valueText(max) }}</span></p>
  </div>
</template>

<style scoped>
.slider {
  margin-top: 16px;
}

.slider__label {
  display: block;
  margin-bottom: 4px; /* room for the input's focus ring, so it never touches the label */
  font-weight: 600;
}

.slider__track {
  position: relative;
}

/* Room for the mark's label, only on a slider that has one (no empty band otherwise). */
.slider__track--marked {
  padding-bottom: 32px;
}

.slider input {
  width: 100%;
  height: 48px;
  margin: 0;
  accent-color: var(--color-forest);
  cursor: pointer;
}

.slider__mark-line,
.slider__mark-label {
  position: absolute;
  pointer-events: none;
}

.slider__mark-line {
  top: 54px; /* below the input and its focus ring, so the ring never strikes the label */
  width: 2px;
  height: 10px;
  margin-left: -1px;
  background: var(--color-mustard);
}

.slider__mark-label {
  top: 64px;
  /* One line, unless the text is larger than the track (200% text on a phone): then it wraps. */
  width: max-content;
  max-width: 100%;
  font-size: var(--type-small);
  font-weight: 600;
  color: var(--color-mustard);
}

.slider__hint {
  margin: 0 0 4px;
  font-size: var(--type-small);
  font-weight: 600;
  color: var(--color-ink);
}

.slider__ends {
  display: flex;
  justify-content: space-between;
  margin: 0;
  font-size: var(--type-small);
  color: var(--color-ink-muted);
}
</style>
