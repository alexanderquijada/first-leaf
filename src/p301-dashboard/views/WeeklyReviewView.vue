<script setup lang="ts">
// P301 route shell. The weekly review itself is built in Phase 1.
import DemoMenu from '@/shared/components/DemoMenu.vue'
import Disclaimer from '@/shared/components/Disclaimer.vue'
import TermTip from '@/shared/components/TermTip.vue'
</script>

<template>
  <div class="p301">
    <header class="p301__bar">
      <RouterLink to="/" class="p301__home">First Leaf</RouterLink>
      <DemoMenu />
    </header>
    <main>
      <p class="p301__eyebrow">P301 · Operational dashboard</p>
      <h1>Rosa's weekly review</h1>
      <p class="p301__line">The full dashboard is coming in Phase 1.</p>
      <p class="p301__line">
        Every fund takes a small <TermTip id="expense-ratio">yearly fee</TermTip> out of its value.
      </p>
    </main>
    <footer class="p301__footer">
      <Disclaimer />
    </footer>
  </div>
</template>

<style scoped>
.p301 {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 32px 40px;
}

.p301__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.p301__home {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-ink);
  text-decoration: none;
}

.p301 h1 {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
}

.p301__eyebrow {
  margin: 0 0 8px;
  font-weight: 600;
  color: var(--color-ink-muted);
}

.p301__line {
  max-width: 60ch;
  margin: 16px 0 0;
  font-size: 1.125rem;
  line-height: 1.6;
}

.p301__footer {
  margin-top: 64px;
  padding-top: 16px;
  border-top: 1px solid var(--color-ink-muted);
}

@media (max-width: 599px) {
  .p301 {
    padding: 8px 16px 32px;
  }

  .p301__bar {
    margin-bottom: 32px;
  }
}
</style>
