<script setup lang="ts">
import Disclaimer from '@/shared/components/Disclaimer.vue'
</script>

<template>
  <footer class="fl-footer">
    <Disclaimer />
    <RouterLink to="/about" class="fl-footer__about">About this demo</RouterLink>
  </footer>
</template>

<style scoped>
.fl-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 32px;
  margin-top: 64px;
  padding: 16px 0 24px;
  border-top: 1px solid var(--color-ink-muted);
}

.fl-footer__about {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  font-weight: 600;
}
</style>
