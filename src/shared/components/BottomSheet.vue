<script setup lang="ts">
// A phone bottom sheet (Vuetify's, with focus kept inside and Esc to close), with
// a heading and a 48px close button. The page behind it is inert while it's open.
import { useId } from 'vue'
import { useInertBackground } from '../composables/useInertBackground'
import { copy } from '../copy'

defineProps<{ title: string }>()
const open = defineModel<boolean>({ default: false })
useInertBackground(open)
const titleId = `fl-sheet-${useId()}`
</script>

<template>
  <v-bottom-sheet v-model="open" :aria-labelledby="titleId">
    <div class="fl-sheet">
      <div class="fl-sheet__head">
        <h2 :id="titleId" class="fl-sheet__title">{{ title }}</h2>
        <button type="button" class="fl-sheet__close" :aria-label="copy.sheet.close" @click="open = false">
          <span class="mdi mdi-close" aria-hidden="true" />
        </button>
      </div>
      <slot />
    </div>
  </v-bottom-sheet>
</template>

<style scoped>
.fl-sheet {
  max-height: 85vh;
  overflow-y: auto;
  padding: 12px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  border-radius: 16px 16px 0 0;
  background: var(--color-paper);
  color: var(--color-ink);
}

.fl-sheet__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.fl-sheet__title {
  font-size: 1.375rem;
}

.fl-sheet__close {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-right: -8px;
  border: 0;
  border-radius: 50%;
  background: none;
  color: var(--color-ink);
  font-size: 24px;
  cursor: pointer;
}
</style>
