<script setup lang="ts">
// A chapter header: a mid-century shape (drawn in code, decorative) beside "Chapter N".
import AtomicDots from '@/shared/illustrations/AtomicDots.vue'
import Boomerang from '@/shared/illustrations/Boomerang.vue'
import Starburst from '@/shared/illustrations/Starburst.vue'
import { fill } from '@/shared/copy'
import copy from './copy.json'

defineProps<{ n: number }>()
</script>

<template>
  <p class="chapter__num chapter-mark">
    <Starburst v-if="n % 3 === 1" :size="28" color="var(--color-mustard)" />
    <Boomerang v-else-if="n % 3 === 2" :size="32" color="var(--color-leaf)" />
    <AtomicDots v-else :size="28" color="var(--color-forest)" />
    <span>{{ fill(copy.chapterNum, { n }) }}</span>
  </p>
</template>

<style scoped>
.chapter-mark {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
