<script setup lang="ts">
// P303 route shell. The 60-second check-in is built in Phase 1.
import DemoMenu from '@/shared/components/DemoMenu.vue'
import Disclaimer from '@/shared/components/Disclaimer.vue'
import TermTip from '@/shared/components/TermTip.vue'
</script>

<template>
  <div class="p303">
    <header class="p303__bar">
      <RouterLink to="/" class="p303__home">First Leaf</RouterLink>
      <DemoMenu />
    </header>
    <main class="p303__main">
      <p class="p303__eyebrow">P303 · Mobile experience</p>
      <h1>Rosa's check-in</h1>
      <p class="p303__line">The 60-second check-in is coming in Phase&nbsp;1.</p>
      <p class="p303__line">
        If your bank sends a deposit back, it is called a
        <TermTip id="returned-deposit">returned deposit</TermTip>.
      </p>
    </main>
    <footer class="p303__footer">
      <Disclaimer />
    </footer>
  </div>
</template>

<style scoped>
/* Designed at 390px wide; on bigger screens it stays a centered phone-width column. */
.p303 {
  max-width: 480px;
  margin: 0 auto;
}

.p303__bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 16px;
  background: var(--color-cream); /* opaque over scrolling content */
  border-bottom: 1px solid var(--color-ink-muted);
}

.p303__home {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  font-family: var(--font-display);
  font-size: 1.375rem;
  color: var(--color-ink);
  text-decoration: none;
  white-space: nowrap;
}

.p303__main {
  padding: 32px 16px 0;
}

.p303 h1 {
  font-size: 2.5rem;
}

.p303__eyebrow {
  margin: 0 0 8px;
  font-weight: 600;
  color: var(--color-ink-muted);
}

.p303__line {
  margin: 16px 0 0;
  font-size: 1.125rem;
  line-height: 1.6;
}

.p303__footer {
  margin: 48px 16px 0;
  padding: 16px 0 32px;
  border-top: 1px solid var(--color-ink-muted);
}
</style>
