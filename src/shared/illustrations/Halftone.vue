<script setup lang="ts">
// A halftone texture: dots that grow from one corner, drawn in code. Decorative.
import { computed } from 'vue'
const props = withDefaults(defineProps<{ color?: string; width?: number; height?: number }>(), { color: 'var(--color-lime)', width: 120, height: 60 })
const dots = computed(() => {
  const out: { x: number; y: number; r: number }[] = []
  for (let x = 4; x < props.width; x += 8) for (let y = 4; y < props.height; y += 8) out.push({ x, y, r: 0.4 + 3 * ((x / props.width + (1 - y / props.height)) / 2) })
  return out
})
</script>

<template>
  <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" aria-hidden="true" focusable="false">
    <circle v-for="(d, i) in dots" :key="i" :cx="d.x" :cy="d.y" :r="d.r" :fill="color" />
  </svg>
</template>
