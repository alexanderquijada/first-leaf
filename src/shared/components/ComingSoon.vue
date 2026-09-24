<script setup lang="ts">
// Placeholder for sub-pages that are built in Phase 1.
import Disclaimer from './Disclaimer.vue'

defineProps<{
  /** Page title, e.g. "Activity". */
  title: string
  /** Case study label, e.g. "P301 · Operational dashboard". */
  caseStudy: string
  /** Where "Back" goes, e.g. "/p301". */
  backTo: string
}>()
</script>

<template>
  <div class="fl-soon">
    <main>
      <p class="fl-soon__eyebrow">{{ caseStudy }}</p>
      <h1>{{ title }}</h1>
      <p class="fl-soon__line">Coming in Phase 1.</p>
      <RouterLink :to="backTo" class="fl-soon__back">
        <span class="mdi mdi-arrow-left" aria-hidden="true" /> Back to {{ caseStudy.split(' · ')[0] }}
      </RouterLink>
    </main>
    <footer class="fl-soon__footer">
      <Disclaimer />
    </footer>
  </div>
</template>

<style scoped>
.fl-soon {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 24px;
}

.fl-soon h1 {
  font-size: clamp(2rem, 5vw, 3rem);
}

.fl-soon__eyebrow {
  margin: 0 0 8px;
  font-weight: 600;
  color: var(--color-ink-muted);
}

.fl-soon__line {
  margin: 12px 0 24px;
  font-size: 1.125rem;
}

.fl-soon__back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 48px;
  font-weight: 600;
}

.fl-soon__footer {
  margin-top: 48px;
  padding-top: 16px;
  border-top: 1px solid var(--color-ink-muted);
}

@media (max-width: 599px) {
  .fl-soon {
    padding: 32px 16px;
  }
}
</style>
