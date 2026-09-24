<script setup lang="ts">
// Formats dollars (BRIEF.md §5, amended Sept. 24, 2026).
// As a change (change="true"):
//   in a sentence (the default):  "up $15.57" / "down $5.88"  (a word, no sign)
//   in a table or chart label:    "+$15.57" / "−$5.88"  (a sign; the word is in
//                                  the accessible label, so it's read as "up $15.57")
// Color is added in both places, never alone.
import { computed } from 'vue'
import { copy, fill } from '../copy'

const props = withDefaults(
  defineProps<{
    amount: number
    /** Show as a gain or loss. */
    change?: boolean
    /** Where the change appears: in a sentence (word) or a table/chart (sign). */
    context?: 'sentence' | 'table'
    /** Drop cents, rounding to whole dollars ("$150", "$242,251"). */
    whole?: boolean
    /** Start with a capital letter ("Up", "Down") at the start of a sentence. */
    capitalize?: boolean
  }>(),
  { change: false, context: 'sentence', whole: false, capitalize: false },
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

// "up $15.57" / "down $5.88" / "no change": shown in sentences, spoken everywhere.
const spoken = computed(() =>
  cap(direction.value === 'none' ? copy.change.none : fill(copy.change[direction.value], { amount: dollars.value })),
)
// "+$15.57" / "−$5.88" (a true minus sign) / "$0.00": shown in tables and charts.
const signed = computed(() =>
  direction.value === 'up'
    ? `+${dollars.value}`
    : direction.value === 'down'
      ? `−${dollars.value}`
      : dollars.value,
)
</script>

<template>
  <span v-if="!change" class="fl-money fl-tabular">{{
    rounded < 0 ? `−${dollars}` : dollars
  }}</span>
  <span
    v-else-if="context === 'sentence'"
    class="fl-money fl-money--change"
    :class="`fl-money--${direction}`"
    >{{ spoken }}</span
  >
  <span v-else class="fl-money fl-money--change fl-tabular" :class="`fl-money--${direction}`"
    ><span aria-hidden="true">{{ signed }}</span
    ><span class="fl-visually-hidden">{{ spoken }}</span></span
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
