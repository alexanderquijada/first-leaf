<script setup lang="ts">
// Formats dollars. As a change (change="true"), a gain or loss always shows a
// sign AND the word "up" or "down", so color is never the only signal.
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    amount: number
    /** Show as a gain or loss: "up +$63.72" / "down −$6.37". */
    change?: boolean
    /** Drop cents, rounding to whole dollars ("$150", "$242,251"). */
    whole?: boolean
    /** Start with a capital letter ("Up", "Down") at the start of a sentence. */
    capitalize?: boolean
  }>(),
  { change: false, whole: false, capitalize: false },
)

const fmt = computed(
  () =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: props.whole ? 0 : 2,
      maximumFractionDigits: props.whole ? 0 : 2,
    }),
)

const rounded = computed(() =>
  props.whole ? Math.round(props.amount) : Math.round(props.amount * 100) / 100,
)
const direction = computed(() => (rounded.value > 0 ? 'up' : rounded.value < 0 ? 'down' : 'none'))
const dollars = computed(() => fmt.value.format(Math.abs(rounded.value)))

const cap = (s: string) => (props.capitalize ? s[0]!.toUpperCase() + s.slice(1) : s)

const word = computed(() =>
  direction.value === 'up' ? cap('up') : direction.value === 'down' ? cap('down') : cap('no change'),
)
const sign = computed(() => (direction.value === 'up' ? '+' : '−'))
// What is shown, e.g. "up +$63.72". A zero change is just "no change".
const shown = computed(() =>
  direction.value === 'none' ? word.value : `${word.value} ${sign.value}${dollars.value}`,
)
// Screen readers get "up $63.72" rather than "plus".
const spoken = computed(() =>
  direction.value === 'none' ? word.value : `${word.value} ${dollars.value}`,
)
</script>

<template>
  <span v-if="!change" class="fl-money fl-tabular">{{
    rounded < 0 ? `−${dollars}` : dollars
  }}</span>
  <span
    v-else
    class="fl-money fl-money--change fl-tabular"
    :class="`fl-money--${direction}`"
    ><span aria-hidden="true">{{ shown }}</span><span class="fl-visually-hidden">{{
      spoken
    }}</span></span
  >
</template>

<style scoped>
.fl-money {
  white-space: nowrap;
}

/* Panels can override these two variables for their dark background. */
.fl-money--up {
  color: var(--fl-gain, var(--color-forest));
}

.fl-money--down {
  color: var(--fl-loss, var(--color-terracotta));
}
</style>
