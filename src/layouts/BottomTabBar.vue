<script setup lang="ts">
// Phone navigation (under 600px): an opaque bottom tab bar in the thumb zone.
// Five tabs, each at least 48 × 48px, with an icon and a word. Funds and Alerts
// are reached from Home (P303 brief).
import { useRoute } from 'vue-router'
import copy from './copy.json'
import { mainNav } from './nav'

const route = useRoute()
const tabs = mainNav.filter((i) => i.onPhone)
</script>

<template>
  <nav class="fl-bottombar" :aria-label="copy.navLabel">
    <ul>
      <li v-for="item in tabs" :key="item.to">
        <RouterLink v-slot="{ href, navigate }" :to="item.to" custom>
          <a
            :href="href"
            class="fl-bottombar__tab"
            :aria-current="item.matchesOnPhone(route.path) ? 'page' : undefined"
            @click="navigate"
          >
            <span class="mdi fl-bottombar__icon" :class="item.icon" aria-hidden="true" />
            <span class="fl-bottombar__label">{{ item.short }}</span>
          </a>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.fl-bottombar {
  display: none;
}

@media (max-width: 599px) {
  .fl-bottombar {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    background: var(--color-paper); /* opaque over scrolling content */
    border-top: 1px solid var(--color-ink-muted);
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
}

.fl-bottombar ul {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin: 0;
  padding: 0;
  list-style: none;
}

.fl-bottombar__tab {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-height: 56px;
  padding: 6px 2px;
  color: var(--color-ink);
  text-decoration: none;
}

.fl-bottombar__icon {
  font-size: 24px;
  line-height: 1;
}

.fl-bottombar__label {
  font-size: var(--type-small); /* never under 14px */
  font-weight: 500;
  line-height: 1.2;
}

.fl-bottombar__tab[aria-current='page'] {
  color: var(--color-forest);
}

.fl-bottombar__tab[aria-current='page'] .fl-bottombar__label {
  font-weight: 700;
}

/* A bar above the current tab, so "here" isn't shown by color alone. */
.fl-bottombar__tab[aria-current='page']::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 3px;
  border-radius: 0 0 3px 3px;
  background: var(--color-forest);
}
</style>
