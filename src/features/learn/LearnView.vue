<script setup lang="ts">
// Words: every explanation in the app, searchable. Each opens its own page.
import { computed, ref } from 'vue'
import { useGlossary } from '@/shared/composables/useGlossary'

const { glossary } = useGlossary()
const q = ref('')
const results = computed(() => {
  const t = q.value.trim().toLowerCase()
  if (!t) return glossary
  return glossary.filter((g) => [g.term, ...g.alsoCalled, g.short].some((s) => s.toLowerCase().includes(t)))
})
</script>

<template>
  <div class="learn">
    <h1>Words to know</h1>
    <label for="learn-search" class="learn__label">Search words</label>
    <input id="learn-search" v-model="q" type="search" class="learn__search" autocomplete="off" aria-describedby="learn-count" />
    <p id="learn-count" class="learn__count" role="status">
      {{ results.length === 1 ? '1 word' : `${results.length} words` }}
    </p>
    <p v-if="!results.length" class="learn__none">No words match “{{ q.trim() }}”. Try “fee” or “fund”.</p>
    <ul v-else class="learn__list">
      <li v-for="g in results" :key="g.id">
        <RouterLink :to="`/learn/${g.id}`" class="learn__row">
          <span class="learn__term">{{ g.term }}</span>
          <span class="learn__short">{{ g.short }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.learn {
  max-width: 760px;
}

.learn h1 {
  font-size: clamp(2.25rem, 5vw, 3rem);
}

.learn__label {
  display: block;
  margin-top: 16px;
  font-weight: 700;
}

.learn__search {
  width: 100%;
  max-width: 420px;
  min-height: 48px;
  margin-top: 4px;
  padding: 0 12px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 4px;
  background: var(--color-paper);
  font: inherit;
}

.learn__count {
  margin: 8px 0 0;
  color: var(--color-ink-muted);
}

.learn__none {
  margin: 16px 0 0;
  padding: 16px 20px;
  border: 1px dashed var(--color-ink-muted);
  border-radius: 12px;
}

.learn__list {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-mint);
}

.learn__row {
  display: grid;
  gap: 2px;
  min-height: 48px;
  padding: 10px 4px;
  border-bottom: 1px solid var(--color-mint);
  color: var(--color-ink);
  text-decoration: none;
}

.learn__row:hover {
  background: var(--color-paper);
}

.learn__term {
  font-weight: 700;
  color: var(--color-forest);
}

.learn__short {
  color: var(--color-ink);
}
</style>
