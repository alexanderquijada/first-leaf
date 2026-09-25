<script setup lang="ts">
import ChapterMark from './ChapterMark.vue'
// Chapter 6: try it with practice money.
import { fill } from '@/shared/copy'
import copy from './copy.json'
</script>

<template>
  <section id="chapter-6" class="chapter" aria-labelledby="chapter-6-title">
    <ChapterMark :n="6" />
    <h2 id="chapter-6-title">{{ copy.titles['6'] }}</h2>
    <p class="chapter__claim">{{ copy.practice.claim }}</p>
    <RouterLink to="/practice" class="k6__go">{{ copy.practice.go }} <span class="mdi mdi-arrow-right" aria-hidden="true" /></RouterLink>
  </section>
</template>

<style scoped>
.k6__go {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 48px;
  margin-top: 12px;
  padding: 0 20px;
  border-radius: 999px;
  background: var(--color-forest);
  color: var(--color-paper);
  font-weight: 600;
  text-decoration: none;
}
</style>
