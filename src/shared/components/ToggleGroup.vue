<script setup lang="ts" generic="T extends string">
// A row of pressed/not-pressed buttons for one choice (filters, ranges, sides).
// Each is at least 48px tall; the chosen one is marked by fill, weight and aria-pressed.
defineProps<{ label: string; options: { id: T; label: string }[] }>()
const value = defineModel<T>({ required: true })
</script>

<template>
  <div class="fl-toggles" role="group" :aria-label="label">
    <button
      v-for="o in options"
      :key="o.id"
      type="button"
      class="fl-toggles__btn"
      :aria-pressed="value === o.id ? 'true' : 'false'"
      @click="value = o.id"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<style scoped>
.fl-toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.fl-toggles__btn {
  min-height: 48px;
  min-width: 48px;
  padding: 0 14px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 999px;
  background: var(--color-paper);
  color: var(--color-ink);
  font: inherit;
  cursor: pointer;
}

.fl-toggles__btn[aria-pressed='true'] {
  background: var(--color-forest);
  border-color: var(--color-forest);
  color: var(--color-paper);
  font-weight: 700;
}
</style>
