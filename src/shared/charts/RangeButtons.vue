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
      :aria-label="r.name"
      @click="range = r.id"
    >
      {{ r.label }}
    </button>
  </div>
</template>

<style scoped>
.ranges {
  display: inline-flex;
  border: 1px solid var(--color-ink-muted);
  border-radius: 999px;
  overflow: hidden;
}

.ranges__btn {
  min-height: 48px;
  min-width: 56px;
  padding: 0 14px;
  border: 0;
  background: var(--color-paper);
  color: var(--color-ink);
  font: inherit;
  font-weight: 500;
  cursor: pointer;
}

.ranges__btn + .ranges__btn {
  border-left: 1px solid var(--color-ink-muted);
}

.ranges__btn[aria-pressed='true'] {
  background: var(--color-forest);
  color: var(--color-paper);
  font-weight: 700;
}
</style>
