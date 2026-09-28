<script setup lang="ts">
import { copy } from '../copy'
import { RANGES, type RangeId } from './ranges'

const range = defineModel<RangeId>({ required: true })
</script>

<template>
  <div class="ranges" role="group" :aria-label="copy.ranges.group">
    <button
      v-for="r in RANGES"
      :key="r.id"
      type="button"
      class="ranges__btn"
      :aria-pressed="range === r.id ? 'true' : 'false'"
      @click="range = r.id"
    >
      {{ r.label }}
    </button>
  </div>
</template>

<style scoped>
.ranges {
  display: inline-flex;
  max-width: 100%; /* at 200% text a button's words wrap instead of widening the page */
  border: 1px solid var(--color-ink-muted);
  border-radius: 999px;
  overflow: hidden;
}

.ranges__btn {
  flex: 0 1 auto;
  min-height: 48px;
  min-width: 56px;
  padding: 0 14px;
  border: 0;
  background: var(--color-paper);
  color: var(--color-ink);
  font: inherit;
  /* One weight for every state, so choosing a range never changes a button's width (Phase 6.2). */
  font-weight: 600;
  cursor: pointer;
}

.ranges__btn + .ranges__btn {
  border-left: 1px solid var(--color-ink-muted);
}

.ranges__btn[aria-pressed='true'] {
  background: var(--color-forest);
  color: var(--color-paper);
}

/* One clean edge: the divider beside the selected button takes its color, so the forest pill
   never shows a second, grey line on its left (Phase 6.2). */
.ranges__btn[aria-pressed='true'],
.ranges__btn[aria-pressed='true'] + .ranges__btn {
  border-left-color: var(--color-forest);
}
</style>
