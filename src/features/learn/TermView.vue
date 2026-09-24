<script setup lang="ts">
// One word, on its own page: the plain term, the industry's word for it, the
// explanation, an example, related words (each its own page) and the source.
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGlossary } from '@/shared/composables/useGlossary'

const route = useRoute()
const { getTerm } = useGlossary()
const term = computed(() => getTerm(String(route.params.termId)))
const related = computed(() => (term.value?.related ?? []).map((r) => getTerm(r)).filter((t) => t !== undefined))
</script>

<template>
  <div class="term">
    <RouterLink to="/learn" class="term__back"><span class="mdi mdi-arrow-left" aria-hidden="true" /> All words</RouterLink>
    <template v-if="term">
      <h1>{{ term.term }}</h1>
      <p v-if="term.alsoCalled.length" class="term__also">Also called <em>{{ term.alsoCalled.join(', ') }}</em></p>
      <p class="term__short">{{ term.short }}</p>
      <p>{{ term.detail }}</p>
      <p><strong>Example:</strong> {{ term.example }}</p>
      <template v-if="related.length">
        <h2 class="term__h">Related words</h2>
        <ul class="term__related">
          <li v-for="r in related" :key="r.id"><RouterLink :to="`/learn/${r.id}`" class="term__chip">{{ r.term }}</RouterLink></li>
        </ul>
      </template>
      <p v-if="term.source" class="term__source">
        Source: <a :href="term.source.url" target="_blank" rel="noopener noreferrer">{{ term.source.label }}<span class="fl-visually-hidden"> (opens in a new tab)</span></a>
      </p>
    </template>
    <template v-else>
      <h1>We could not find that word.</h1>
      <p>Try searching for it in Words to know.</p>
    </template>
  </div>
</template>

<style scoped>
.term {
  max-width: 680px;
}

.term h1 {
  font-size: clamp(2.25rem, 5vw, 3rem);
}

.term p {
  margin: 12px 0 0;
  font-family: var(--font-text);
  font-size: 1.125rem;
  line-height: 1.6;
}

.term__back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 48px;
  margin-bottom: 8px;
  font-weight: 600;
}

.term__also {
  color: var(--color-ink-muted);
}

p.term__also,
p.term__source {
  font-family: var(--font-ui);
  font-size: 0.9375rem;
}

.term__short {
  font-weight: 600;
}

.term__h {
  margin-top: 24px;
  font-family: var(--font-ui);
  font-size: 1rem;
  font-weight: 700;
}

.term__related {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.term__chip {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 16px;
  border: 1px solid var(--color-forest);
  border-radius: 24px;
  font-weight: 600;
  text-decoration: none;
}

.term__source {
  color: var(--color-ink-muted);
}

/* The source is a standalone link: 48px tall (P303 touch targets). */
.term__source a {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
}
</style>
