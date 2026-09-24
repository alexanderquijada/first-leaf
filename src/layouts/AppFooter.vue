<script setup lang="ts">
import Disclaimer from '@/shared/components/Disclaimer.vue'
</script>

<template>
  <footer class="fl-footer">
    <Disclaimer />
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

</style>
