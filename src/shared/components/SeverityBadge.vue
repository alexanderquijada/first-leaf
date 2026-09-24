<script setup lang="ts">
// Severity is an icon, a word and a color, in that order. Color never works alone.
import { computed } from 'vue'
import { copy } from '../copy'
import type { Severity } from '../data'

const props = defineProps<{ severity: Severity }>()

const LOOK: Record<Severity, { word: string; icon: string; color: string }> = {
  'needs-you': { word: copy.severity['needs-you'], icon: 'mdi-alert-circle', color: 'var(--color-terracotta)' },
  'heads-up': { word: copy.severity['heads-up'], icon: 'mdi-clock-outline', color: 'var(--color-mustard)' },
  fyi: { word: copy.severity.fyi, icon: 'mdi-information-outline', color: 'var(--color-forest)' },
}

const look = computed(() => LOOK[props.severity])
</script>

<template>
  <span class="fl-severity" :style="{ '--sev': look.color }">
    <span class="mdi fl-severity__icon" :class="look.icon" aria-hidden="true" />
    {{ look.word }}
  </span>
</template>

<style scoped>
.fl-severity {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px 2px 6px;
  border: 1px solid var(--sev);
  border-radius: 999px;
  background: var(--color-paper);
  color: var(--sev);
  font-family: var(--font-ui);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
}

.fl-severity__icon {
  font-size: 1.125rem;
  line-height: 1;
}
</style>
