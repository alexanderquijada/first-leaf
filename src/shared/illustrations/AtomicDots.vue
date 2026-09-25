<script setup lang="ts">
// Atomic-age dots and orbits, drawn in code. Decorative.
withDefaults(defineProps<{ color?: string; size?: number }>(), { color: 'var(--color-forest)', size: 56 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 100 100" aria-hidden="true" focusable="false" fill="none" :stroke="color" stroke-width="3">
    <ellipse cx="50" cy="50" rx="44" ry="16" />
    <ellipse cx="50" cy="50" rx="44" ry="16" transform="rotate(60 50 50)" />
    <ellipse cx="50" cy="50" rx="44" ry="16" transform="rotate(120 50 50)" />
    <circle cx="50" cy="50" r="7" :fill="color" stroke="none" />
  </svg>
</template>
