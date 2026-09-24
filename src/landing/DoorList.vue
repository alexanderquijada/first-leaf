<script setup lang="ts">
import { doors } from './doors'
</script>

<template>
  <ul class="fl-doors">
    <li v-for="d in doors" :key="d.code">
      <RouterLink :to="d.to" class="fl-door">
        <span class="fl-door__title">{{ d.code }} · {{ d.name }}</span>
        <span class="fl-door__desc">{{ d.description }}</span>
        <span class="fl-door__go">Open {{ d.code }} <span class="mdi mdi-arrow-right" aria-hidden="true" /></span>
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
.fl-doors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.fl-doors li {
  display: flex;
}

.fl-door {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 24px;
  background: var(--color-paper);
  color: var(--color-ink);
  border: 1px solid var(--color-ink-muted);
  border-radius: 16px;
  text-decoration: none;
}

.fl-door:hover {
  border-color: var(--color-forest);
  background: var(--color-mint);
}

.fl-door__title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  line-height: 1.2;
}

.fl-door__desc {
  flex: 1;
  font-size: 1rem;
  line-height: 1.5;
}

.fl-door__go {
  font-weight: 600;
  color: var(--color-forest);
}
</style>
