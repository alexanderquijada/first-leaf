<script setup lang="ts">
import Disclaimer from '@/shared/components/Disclaimer.vue'
import DoorList from './DoorList.vue'
</script>

<template>
  <div class="fl-notfound">
    <main>
      <p class="fl-notfound__eyebrow"><RouterLink to="/">First Leaf</RouterLink></p>
      <h1>We couldn't find that page.</h1>
      <p class="fl-notfound__line">The link may be old or mistyped. Here are the three case studies.</p>
      <DoorList />
    </main>
    <footer class="fl-notfound__footer">
      <Disclaimer />
    </footer>
  </div>
</template>

<style scoped>
.fl-notfound {
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 24px;
}

.fl-notfound h1 {
  font-size: clamp(2rem, 5vw, 3rem);
}

.fl-notfound__eyebrow {
  margin: 0 0 16px;
  font-weight: 600;
}

.fl-notfound__line {
  margin: 12px 0 32px;
  font-size: 1.125rem;
}

.fl-notfound__footer {
  margin-top: 48px;
  padding-top: 16px;
  border-top: 1px solid var(--color-ink-muted);
}

@media (max-width: 599px) {
  .fl-notfound {
    padding: 32px 16px;
  }
}
</style>
