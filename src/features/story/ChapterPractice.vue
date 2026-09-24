<script setup lang="ts">
// Chapter 6: try it with pretend money.
</script>

<template>
  <section id="chapter-6" class="chapter" aria-labelledby="chapter-6-title">
    <p class="chapter__num">Chapter 6</p>
    <h2 id="chapter-6-title">Try it with pretend money</h2>
    <p class="chapter__claim">
      Practice lets you try a mix with money that is not real. Nothing you do there touches your account.
    </p>
    <RouterLink to="/practice" class="k6__go">Go to Practice <span class="mdi mdi-arrow-right" aria-hidden="true" /></RouterLink>
  </section>
</template>

<style scoped>
.k6__go {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 48px;
  margin-top: 12px;
  padding: 0 20px;
  border-radius: 4px;
  background: var(--color-forest);
  color: var(--color-paper);
  font-weight: 600;
  text-decoration: none;
}
</style>
