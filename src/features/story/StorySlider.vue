<script setup lang="ts">
// A real range input: the arrow keys move it, and its value is announced in words.
// At least 48px tall, so it's easy to grab with a thumb. An optional mark shows a
// point on the track (for example where Theo passes Nia).
import { computed, useId } from 'vue'

const props = defineProps<{
  label: string
  min: number
  max: number
  step: number
  /** How the value reads aloud, e.g. "Start at 30" or "$196 a month". */
  valueText: (v: number) => string
  mark?: { value: number; label: string }
}>()
const value = defineModel<number>({ required: true })
const id = `fl-slider-${useId()}`
const markPct = computed(() => (props.mark ? ((props.mark.value - props.min) / (props.max - props.min)) * 100 : 0))
</script>

<template>
  <div class="slider">
    <label :for="id" class="slider__label">{{ label }}: <strong>{{ valueText(value) }}</strong></label>
    <div class="slider__track">
      <input
        :id="id"
        v-model.number="value"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :aria-valuetext="valueText(value)"
      />
      <span v-if="mark" class="slider__mark" :style="{ left: `${markPct}%` }" aria-hidden="true">
        <span class="slider__mark-line" />
        <span class="slider__mark-label">{{ mark.label }}</span>
      </span>
    </div>
    <p class="slider__ends" aria-hidden="true"><span>{{ valueText(min) }}</span><span>{{ valueText(max) }}</span></p>
  </div>
</template>

<style scoped>
.slider {
  margin-top: 16px;
}

.slider__label {
  display: block;
  font-weight: 600;
}

.slider__track {
  position: relative;
  padding-bottom: 20px;
}

.slider input {
  width: 100%;
  height: 48px;
  margin: 0;
  accent-color: var(--color-forest);
  cursor: pointer;
}

.slider__mark {
  position: absolute;
  top: 30px;
  transform: translateX(-50%);
  display: grid;
  justify-items: center;
  pointer-events: none;
}

.slider__mark-line {
  width: 2px;
  height: 10px;
  background: var(--color-mustard);
}

.slider__mark-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-mustard);
  white-space: nowrap;
}

.slider__ends {
  display: flex;
  justify-content: space-between;
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-ink-muted);
}
</style>
