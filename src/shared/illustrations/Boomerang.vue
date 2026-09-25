<script setup lang="ts">
// A mid-century boomerang, drawn in code. Decorative.
withDefaults(defineProps<{ color?: string; size?: number }>(), { color: 'var(--color-leaf)', size: 56 })
</script>

<template>
  <svg :width="size" :height="size * 0.6" viewBox="0 0 100 60" aria-hidden="true" focusable="false">
    <path d="M4 50 C 20 10, 45 4, 58 22 C 66 34, 80 30, 96 8 C 92 36, 72 56, 50 44 C 36 36, 22 44, 4 50 Z" :fill="color" />
  </svg>
</template>
