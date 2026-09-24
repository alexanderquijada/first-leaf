<script setup lang="ts">
// Tablet navigation (600–1023px): the rail's six items as top tabs.
import { useRoute } from 'vue-router'
import copy from './copy.json'
import { mainNav } from './nav'

const route = useRoute()
</script>

<template>
  <nav class="fl-tabs" :aria-label="copy.navLabel">
    <ul>
      <li v-for="item in mainNav" :key="item.to">
        <RouterLink v-slot="{ href, navigate }" :to="item.to" custom>
          <a
            :href="href"
            class="fl-tabs__link"
            :aria-current="item.matches(route.path) ? 'page' : undefined"
            @click="navigate"
            >{{ item.label }}</a
          >
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.fl-tabs {
  display: none;
  position: sticky;
  top: 64px;
  z-index: 19;
  background: var(--color-cream);
  border-bottom: 1px solid var(--color-ink-muted);
  overflow-x: auto;
}

.fl-tabs ul {
  display: flex;
  gap: 4px;
  margin: 0;
  padding: 0 16px;
  list-style: none;
}

.fl-tabs__link {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 12px;
  border-bottom: 3px solid transparent;
  color: var(--color-ink);
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
}

.fl-tabs__link:hover {
  background: var(--color-mint);
}

.fl-tabs__link[aria-current='page'] {
  border-bottom-color: var(--color-forest);
  color: var(--color-forest);
  font-weight: 700;
}

@media (min-width: 600px) and (max-width: 1023px) {
  .fl-tabs {
    display: block;
  }
}
</style>
