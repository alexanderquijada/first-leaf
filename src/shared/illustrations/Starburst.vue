<script setup lang="ts">
// A mid-century starburst, drawn in code (original artwork, no license needed). Decorative.
import { computed } from 'vue'
const props = withDefaults(defineProps<{ points?: number; color?: string; size?: number }>(), { points: 12, color: 'var(--color-mustard)', size: 48 })
const d = computed(() => {
  const out: string[] = []
  for (let i = 0; i < props.points * 2; i++) {
    const r = i % 2 === 0 ? 50 : 18, a = (Math.PI * i) / props.points - Math.PI / 2
    out.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${out.join('L')}Z`
})
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><path :d="d" :fill="color" /></svg>
</template>
