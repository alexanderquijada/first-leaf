<script setup lang="ts">
// The top-bar "Phone view" link: opens the current page in phone view (/p303/…).
// Hidden under 600px and inside the frame.
import { useRoute, useRouter } from 'vue-router'
import copy from './copy.json'
import { phoneViewAvailable, phoneViewLocation } from './usePhonePreview'

const route = useRoute()
const router = useRouter()
function open(e: MouseEvent) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
  e.preventDefault()
  router.push(phoneViewLocation(route))
}
</script>

<template>
  <a
    v-if="phoneViewAvailable"
    class="fl-pp-toggle"
    :href="router.resolve(phoneViewLocation(route)).href"
    @click="open"
  >
    <span class="mdi mdi-cellphone" aria-hidden="true" />
    {{ copy.phoneView.toggle }}
  </a>
</template>

<style scoped>
.fl-pp-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 48px;
  padding: 0 14px 0 10px;
  border: 1px solid var(--color-ink);
  border-radius: 999px;
  background: var(--color-cream);
  color: var(--color-ink);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
}

.fl-pp-toggle .mdi {
  font-size: 20px;
  line-height: 1;
}

.fl-pp-toggle:hover {
  background: var(--color-mint);
}
</style>
