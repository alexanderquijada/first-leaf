<script setup lang="ts">
// "Words on this screen": every term on a phone screen as a 48px chip, so no one
// has to hit a small word inside a sentence (P303 brief, touch-target ruling).
import { computed } from 'vue'
import { useGlossary } from '../composables/useGlossary'
import { copy } from '../copy'
import TermTip from './TermTip.vue'

const props = withDefaults(defineProps<{ ids: string[]; headingLevel?: 2 | 3 }>(), { headingLevel: 2 })
const { getTerm } = useGlossary()
const terms = computed(() => [...new Set(props.ids)].map((id) => getTerm(id)).filter((t) => t !== undefined))
</script>

<template>
  <section v-if="terms.length" class="chips" :aria-label="copy.wordChips.title">
    <component :is="`h${headingLevel}`" class="chips__title">{{ copy.wordChips.title }}</component>
    <ul>
      <li v-for="t in terms" :key="t.id"><TermTip :id="t.id">{{ t.term }}</TermTip></li>
    </ul>
  </section>
</template>

<style scoped>
.chips {
  margin-top: 20px;
}

.chips__title {
  font-family: var(--font-ui);
  font-size: 1rem;
  font-weight: 700;
}

.chips ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.chips :deep(.fl-termtip__button) {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  min-width: 48px;
  padding: 0 16px;
  border: 1px solid var(--color-forest);
  border-radius: 24px;
  background: var(--color-paper);
  color: var(--color-forest);
  font-weight: 600;
  text-decoration: none;
}
</style>
