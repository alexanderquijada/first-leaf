<script setup lang="ts">
// A page that is not built yet. The layout's footer carries the disclosure.
import { copy } from '../copy'

defineProps<{ title: string }>()
</script>

<template>
  <div class="fl-page">
    <h1 class="fl-page__title">{{ title }}</h1>
    <p class="fl-page__soon">{{ copy.placeholder.soon }}</p>
    <slot />
  </div>
</template>

<style scoped>
.fl-page {
  max-width: 68ch;
}

.fl-page__title {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
}

.fl-page__soon {
  margin: 16px 0 0;
  font-size: 1.125rem;
  line-height: 1.6;
}

.fl-page :deep(p) {
  margin: 12px 0 0;
  line-height: 1.6;
}
</style>
