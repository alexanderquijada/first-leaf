<script setup lang="ts">
// The disclaimer, from meta.json. Never retype this text anywhere.
import { meta } from '../data'
</script>

<template>
  <p class="fl-disclaimer" role="note">{{ meta.disclaimer }}</p>
</template>

<style scoped>
.fl-disclaimer {
  margin: 0;
  max-width: 68ch;
  font-family: var(--font-ui);
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-ink-muted);
}
</style>
