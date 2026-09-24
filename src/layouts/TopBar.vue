<script setup lang="ts">
// The top bar at every size. Phone: wordmark and Demo menu. Tablet: the same.
// Desktop: the greeting and "Prices as of …" (the wordmark sits in the rail).
import DemoMenu from '@/shared/components/DemoMenu.vue'
import { meta, persona } from '@/shared/data'
import { formatDayDate } from '@/shared/format'
</script>

<template>
  <header class="fl-topbar">
    <RouterLink to="/" class="fl-topbar__wordmark">First Leaf</RouterLink>
    <div class="fl-topbar__hello">
      <p class="fl-topbar__greeting">Good morning, {{ persona.firstName }}.</p>
      <p class="fl-topbar__asof">Prices as of {{ formatDayDate(meta.lastClose) }}</p>
    </div>
    <div class="fl-topbar__actions">
      <slot name="actions" />
      <DemoMenu />
    </div>
  </header>
</template>

<style scoped>
.fl-topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 64px;
  padding: 8px 16px;
  background: var(--color-cream); /* opaque over scrolling content */
  border-bottom: 1px solid var(--color-ink-muted);
}

.fl-topbar__wordmark {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  font-family: var(--font-display);
  font-size: 1.375rem;
  color: var(--color-ink);
  text-decoration: none;
  white-space: nowrap;
}

.fl-topbar__hello {
  display: none;
}

.fl-topbar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.fl-topbar__greeting {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.375rem;
  line-height: 1.2;
}

.fl-topbar__asof {
  margin: 2px 0 0;
  font-size: 0.875rem;
  color: var(--color-ink-muted);
}

@media (min-width: 600px) {
  .fl-topbar {
    padding: 8px 24px;
  }
}

@media (min-width: 1024px) {
  .fl-topbar {
    padding: 8px 32px;
  }

  .fl-topbar__wordmark {
    display: none;
  }

  .fl-topbar__hello {
    display: block;
  }
}
</style>
