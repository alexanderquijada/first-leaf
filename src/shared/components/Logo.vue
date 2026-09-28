<script setup lang="ts">
// The First Leaf logo (Sept. 28, option A "Sprout tile", docs/brand/logo-options.html): a forest
// tile holding a lime seedling with its first two leaves, a cream ground line and a small
// starburst, beside the "First Leaf" wordmark in Newsreader. One fixed lockup everywhere.
// The mark is decorative; the wordmark carries the name for screen readers.
import { copy } from '../copy'

withDefaults(defineProps<{ size?: number }>(), { size: 32 })
</script>

<template>
  <span class="fl-logo">
    <svg class="fl-logo__mark" viewBox="0 0 64 64" :width="size" :height="size" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="60" height="60" rx="16" fill="#1F5C3B" />
      <path d="M13 50 Q32 43 51 50" stroke="#F5F0E6" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M32 46 V30" stroke="#C6F36B" stroke-width="4.5" stroke-linecap="round" />
      <path d="M32 34 C23 34 16 29 15 20 C24 19 31 25 32 34 Z" fill="#C6F36B" />
      <path d="M32 30 C33 21 40 15 49 15 C48 24 41 30 32 30 Z" fill="#C6F36B" />
      <path d="M18 7 L19.7 11.3 L24 13 L19.7 14.7 L18 19 L16.3 14.7 L12 13 L16.3 11.3 Z" fill="#F5F0E6" />
    </svg>
    <span class="fl-logo__word">{{ copy.brand.name }}</span>
  </span>
</template>

<style scoped>
.fl-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-ink);
}

.fl-logo__mark {
  flex: none;
}

.fl-logo__word {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1;
  white-space: nowrap;
}
</style>
