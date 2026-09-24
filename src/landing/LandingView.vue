<script setup lang="ts">
import Disclaimer from '@/shared/components/Disclaimer.vue'
import DoorList from './DoorList.vue'
</script>

<template>
  <div class="fl-landing">
    <main>
      <h1 class="fl-landing__title">First Leaf</h1>
      <p class="fl-landing__line">
        A made-up investing app for people who have never invested. It is shown here as three
        design case studies.
      </p>
      <h2 class="fl-visually-hidden">Choose a case study</h2>
      <DoorList />
    </main>
    <footer class="fl-landing__footer">
      <Disclaimer />
    </footer>
  </div>
</template>

<style scoped>
.fl-landing {
  max-width: 1120px;
  margin: 0 auto;
  padding: 64px 24px 40px;
}

.fl-landing__title {
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 500;
  letter-spacing: -0.01em;
}

.fl-landing__line {
  max-width: 40ch;
  margin: 12px 0 40px;
  font-family: var(--font-text);
  font-size: 1.25rem;
  line-height: 1.5;
}

.fl-landing__footer {
  margin-top: 48px;
  padding-top: 16px;
  border-top: 1px solid var(--color-ink-muted);
}

@media (max-width: 599px) {
  .fl-landing {
    padding: 40px 16px 32px;
  }
}
</style>
