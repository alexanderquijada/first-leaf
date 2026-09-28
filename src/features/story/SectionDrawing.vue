<script setup lang="ts">
// The small drawing on each section tab (decorative; the tab's words name it). Mid-century
// shapes drawn in code, in forest or ink, which read on paper and on the lime of the current tab.
import AtomicDots from '@/shared/illustrations/AtomicDots.vue'
import Boomerang from '@/shared/illustrations/Boomerang.vue'
import Starburst from '@/shared/illustrations/Starburst.vue'

defineProps<{ n: number }>()
</script>

<template>
  <span class="drawing" aria-hidden="true">
    <!-- 1 Six months in: a young sprout on a line of ground -->
    <svg v-if="n === 1" viewBox="0 0 40 40" width="36" height="36">
      <path d="M6 33h28" stroke="var(--color-ink)" stroke-width="2.5" stroke-linecap="round" />
      <path d="M20 33V17" stroke="var(--color-forest)" stroke-width="3" stroke-linecap="round" />
      <path d="M20 22c-7 0-11-4-11-10 6 0 11 3 11 10z" fill="var(--color-forest)" />
      <path d="M20 18c0-6 4-10 11-10 0 6-4 10-11 10z" fill="var(--color-forest)" />
    </svg>
    <Boomerang v-else-if="n === 2" :size="36" color="var(--color-forest)" />
    <Starburst v-else-if="n === 3" :size="34" color="var(--color-ink)" />
    <AtomicDots v-else :size="34" color="var(--color-forest)" />
  </span>
</template>

<style scoped>
.drawing {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}
</style>
