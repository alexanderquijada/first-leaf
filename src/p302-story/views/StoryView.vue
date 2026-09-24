<script setup lang="ts">
// P302 route shell. The eight-chapter story is built in Phase 1.
import Disclaimer from '@/shared/components/Disclaimer.vue'
import TermTip from '@/shared/components/TermTip.vue'
import { story } from '@/shared/data'
</script>

<template>
  <div class="p302">
    <header class="p302__bar">
      <RouterLink to="/" class="p302__home">First Leaf</RouterLink>
    </header>
    <main>
      <p class="p302__eyebrow">P302 · Interactive data story</p>
      <h1>{{ story.title }}</h1>
      <p class="p302__lede">{{ story.pointOfView }}</p>
      <p class="p302__line">
        The story ends by naming the idea behind it:
        <TermTip id="compound-growth">growth on growth</TermTip>.
      </p>
      <p class="p302__line">The full story is coming in Phase 1.</p>
    </main>
    <footer class="p302__footer">
      <Disclaimer />
    </footer>
  </div>
</template>

<style scoped>
.p302 {
  max-width: 760px;
  margin: 0 auto;
  padding: 16px 24px 40px;
}

.p302__bar {
  display: flex;
  align-items: center;
  margin-bottom: 48px;
}

.p302__home {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-ink);
  text-decoration: none;
}

.p302 h1 {
  font-size: clamp(2.5rem, 7vw, 4.5rem);
}

.p302__eyebrow {
  margin: 0 0 8px;
  font-weight: 600;
  color: var(--color-ink-muted);
}

.p302__lede {
  margin: 24px 0 0;
  font-family: var(--font-text);
  font-size: 1.375rem;
  line-height: 1.5;
}

.p302__line {
  margin: 16px 0 0;
  font-family: var(--font-text);
  font-size: 1.125rem;
  line-height: 1.6;
}

.p302__footer {
  margin-top: 64px;
  padding-top: 16px;
  border-top: 1px solid var(--color-ink-muted);
}

@media (max-width: 599px) {
  .p302 {
    padding: 8px 16px 32px;
  }

  .p302__bar {
    margin-bottom: 32px;
  }
}
</style>
