<script setup lang="ts">
// The top-bar toggle for Phone preview. Hidden under 600px and inside the frame.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import copy from './copy.json'
import { isEmbedded, toggleEl, usePhonePreview } from './usePhonePreview'

const { open, setOpen } = usePhonePreview()
const el = ref<HTMLButtonElement | null>(null)
onMounted(() => (toggleEl.value = el.value))
onBeforeUnmount(() => {
  if (toggleEl.value === el.value) toggleEl.value = null
})
</script>

<template>
  <button
    v-if="!isEmbedded"
    ref="el"
    type="button"
    class="fl-pp-toggle"
    :aria-pressed="open ? 'true' : 'false'"
    @click="setOpen(!open)"
  >
    <span class="mdi mdi-cellphone" aria-hidden="true" />
    {{ copy.phoneView.toggle }}
  </button>
</template>

<style scoped>
.fl-pp-toggle {
  display: none;
  align-items: center;
  gap: 6px;
  min-height: 48px;
  padding: 0 14px 0 10px;
  border: 1px solid var(--color-ink);
  border-radius: 4px;
  background: var(--color-cream);
  color: var(--color-ink);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
}

.fl-pp-toggle .mdi {
  font-size: 20px;
  line-height: 1;
}

.fl-pp-toggle:hover {
  background: var(--color-mint);
}

.fl-pp-toggle[aria-pressed='true'] {
  background: var(--color-forest);
  border-color: var(--color-forest);
  color: var(--color-paper);
}

@media (min-width: 600px) {
  .fl-pp-toggle {
    display: inline-flex;
  }
}
</style>
