<script setup lang="ts">
// Desktop navigation (1024px and up): the wordmark and a left rail.
import { useRoute } from 'vue-router'
import copy from './copy.json'
import { mainNav } from './nav'

const route = useRoute()
</script>

<template>
  <div class="fl-rail">
    <RouterLink to="/" class="fl-rail__wordmark">{{ copy.wordmark }}</RouterLink>
    <nav :aria-label="copy.navLabel">
      <ul>
        <li v-for="item in mainNav" :key="item.to">
          <RouterLink v-slot="{ href, navigate }" :to="item.to" custom>
            <a
              :href="href"
              class="fl-rail__link"
              :aria-current="item.matches(route.path) ? 'page' : undefined"
              @click="navigate"
            >
              <span class="mdi fl-rail__icon" :class="item.icon" aria-hidden="true" />
              {{ item.label }}
            </a>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.fl-rail {
  display: none;
}

@media (min-width: 1024px) {
  .fl-rail {
    display: block;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    padding: 16px 12px;
    background: var(--color-paper);
    border-right: 1px solid var(--color-ink-muted);
  }
}

.fl-rail__wordmark {
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: 0 12px;
  margin-bottom: 16px;
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-ink);
  text-decoration: none;
}

.fl-rail ul {
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.fl-rail__link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 0 12px;
  border-radius: 12px;
  color: var(--color-ink);
  font-weight: 500;
  text-decoration: none;
}

.fl-rail__link:hover {
  background: var(--color-cream);
}

.fl-rail__icon {
  font-size: 22px;
  line-height: 1;
}

.fl-rail__link[aria-current='page'] {
  background: var(--color-mint);
  color: var(--color-forest);
  font-weight: 700;
}

/* A bar beside the current item, so "here" isn't shown by color alone. */
.fl-rail__link[aria-current='page']::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 10px;
  bottom: 10px;
  width: 4px;
  border-radius: 0 4px 4px 0;
  background: var(--color-forest);
}
</style>
