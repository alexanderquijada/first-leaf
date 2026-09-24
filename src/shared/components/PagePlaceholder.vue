<script setup lang="ts">
// A page that is built in Phase 1. The layout's footer carries the disclaimer.
defineProps<{ title: string }>()
</script>

<template>
  <div class="fl-page">
    <h1 class="fl-page__title">{{ title }}</h1>
    <p class="fl-page__soon">Coming in Phase 1.</p>
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
  line-height: 1.6;
}
</style>
