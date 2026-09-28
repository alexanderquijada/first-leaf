<script setup lang="ts">
// Your Journey (P302, rebuilt Sept. 28): four sections, one shown at a time. Visual tabs sit
// under the title (a 2×2 grid on a phone), with the WAI-ARIA tabs pattern: the arrow keys move
// between tabs, Enter or Space selects one, and the selection is announced. Each section has
// one chart or interaction, at most 60 words, and a "Next" button. Deep links: #section-1 to
// #section-4 (old #chapter-N links are sent to their section by the router).
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BottomSheet from '@/shared/components/BottomSheet.vue'
import { useViewport } from '@/shared/composables/useViewport'
import { useScenario } from '@/shared/composables/useScenario'
import { story } from '@/shared/data'
import { fill } from '@/shared/copy'
import SectionDip from './SectionDip.vue'
import SectionDrawing from './SectionDrawing.vue'
import SectionSixMonths from './SectionSixMonths.vue'
import SectionStartEarly from './SectionStartEarly.vue'
import SectionTryIt from './SectionTryIt.vue'
import copy from './copy.json'

const N = copy.names
const route = useRoute()
const { account } = useScenario()
const { isPhone } = useViewport()

const rosa = computed(() => story.rosaStory[account.value.id] ?? null)
const sections = computed(() => [
  { n: 1, name: rosa.value ? N['1'] : N['1new'] },
  { n: 2, name: rosa.value ? fill(N['2'], { month: rosa.value.facts.dip.month }) : N['2new'] },
  { n: 3, name: N['3'] },
  { n: 4, name: N['4'] },
])

const fromHash = (hash: string) => {
  const m = /^#section-([1-4])$/.exec(hash)
  return m ? Number(m[1]) : null
}
const selected = ref(fromHash(route.hash) ?? 1)
watch(
  () => route.hash,
  (h) => {
    const n = fromHash(h)
    if (n) selected.value = n
  },
)

const tabEls = ref<HTMLButtonElement[]>([])
const current = computed(() => sections.value[selected.value - 1]!)
const next = computed(() => sections.value[selected.value] ?? null)
const menuOpen = ref(false)

async function select(n: number, { focusTab = false, scroll = false } = {}) {
  selected.value = n
  history.replaceState(history.state, '', `#section-${n}`)
  await nextTick()
  if (focusTab) tabEls.value[n - 1]?.focus()
  if (scroll) window.scrollTo({ top: 0 })
}

// Arrow keys move focus between tabs; Enter or Space (a click) selects (WAI-ARIA tabs, manual activation).
function onKeydown(e: KeyboardEvent, i: number) {
  const last = sections.value.length - 1
  const to = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (i === last ? 0 : i + 1)
    : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i === 0 ? last : i - 1)
    : e.key === 'Home' ? 0 : e.key === 'End' ? last : null
  if (to === null) return
  e.preventDefault()
  tabEls.value[to]?.focus()
}
// The roving tab stop follows keyboard focus, so Tab leaves the tab list from where you are.
const focusIndex = ref(selected.value - 1)
watch(selected, (n) => (focusIndex.value = n - 1))

async function goNext() {
  if (next.value) await select(next.value.n, { focusTab: true, scroll: true })
}
async function pick(n: number) {
  menuOpen.value = false
  await select(n, { focusTab: true, scroll: true })
}
</script>

<template>
  <div class="story">
    <h1>{{ copy.title }}</h1>

    <div class="story__tabs" role="tablist" :aria-label="copy.sections">
      <button
        v-for="(s, i) in sections"
        :id="`tab-${s.n}`"
        :key="s.n"
        ref="tabEls"
        type="button"
        role="tab"
        class="story__tab"
        :aria-selected="selected === s.n ? 'true' : 'false'"
        :aria-controls="`section-${s.n}`"
        :tabindex="focusIndex === i ? 0 : -1"
        @click="select(s.n)"
        @focus="focusIndex = i"
        @keydown="onKeydown($event, i)"
      >
        <SectionDrawing :n="s.n" class="story__tab-art" />
        <span class="story__tab-text">
          <span class="story__tab-num">{{ fill(copy.sectionNum, { n: s.n }) }}</span>
          <span class="story__tab-name">{{ s.name }}</span>
        </span>
      </button>
    </div>

    <section :id="`section-${current.n}`" :key="current.n" class="section" role="tabpanel" :aria-labelledby="`tab-${current.n}`">
      <h2 class="section__title">{{ current.name }}</h2>
      <template v-if="current.n === 1">
        <SectionSixMonths v-if="rosa" :story="rosa" :account="account" />
        <p v-else class="section__claim">{{ story.pointOfView }} {{ copy.newClaim }}</p>
      </template>
      <template v-else-if="current.n === 2">
        <SectionDip v-if="rosa" :story="rosa" :account="account" />
        <p v-else class="section__claim">{{ copy.newDipClaim }}</p>
      </template>
      <SectionStartEarly v-else-if="current.n === 3" />
      <SectionTryIt v-else />

      <div class="section__nav">
        <button v-if="next" type="button" class="section__next" @click="goNext">
          {{ fill(copy.next, { name: next.name }) }} <span class="mdi mdi-arrow-right" aria-hidden="true" />
        </button>
        <button v-if="isPhone" type="button" class="section__menu" @click="menuOpen = true">
          <span class="mdi mdi-format-list-numbered" aria-hidden="true" /> {{ copy.sections }}
        </button>
      </div>
    </section>

    <BottomSheet v-if="isPhone" v-model="menuOpen" :title="copy.sections">
      <ol class="story__sheet-list">
        <li v-for="s in sections" :key="s.n" :value="s.n">
          <a :href="`#section-${s.n}`" class="story__sheet-link" :aria-current="selected === s.n ? 'true' : undefined" @click.prevent="pick(s.n)">{{ s.name }}</a>
        </li>
      </ol>
    </BottomSheet>
  </div>
</template>

<style scoped>
.story {
  max-width: 1180px;
}

/* The section tabs: one row of four under the title from 600px (P302 DoD 5), each as wide as its
   longest name needs, left-aligned; a 2×2 grid on a phone. */
.story__tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, max-content));
  gap: 12px;
  margin: 20px 0 8px;
}

.story__tab {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  padding: 8px 18px 8px 10px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 16px;
  background: var(--color-paper);
  color: var(--color-ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.story__tab:hover {
  background: var(--color-mint);
}

/* The current section: filled lime with ink text. */
.story__tab[aria-selected='true'] {
  border-color: var(--color-ink);
  background: var(--color-lime);
}

.story__tab-art {
  flex: none;
}

.story__tab-text {
  display: grid;
  line-height: 1.25;
}

.story__tab-num {
  font-size: var(--type-small);
  font-weight: 600;
}

.story__tab-name {
  font-family: var(--font-display);
  font-size: 1.1875rem;
}

/* From 600 to 899px the row is narrow, so each drawing sits above its words. */
@media (min-width: 600px) and (max-width: 899px) {
  .story__tabs {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .story__tab {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 10px 12px;
  }

  /* "Section 1" never breaks in the narrow row (only here: at 200% text on a phone it must wrap). */
  .story__tab-num {
    white-space: nowrap;
  }
}

@media (max-width: 599px) {
  .story__tabs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .story__tab {
    min-height: 64px;
    padding: 8px 10px 8px 8px;
    gap: 8px;
  }

  .story__tab-name {
    font-size: 1.0625rem;
    overflow-wrap: anywhere;
  }
}

.section {
  margin-top: 24px;
}

.section__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
}

.story :deep(.section-body) {
  max-width: 44rem;
}

.story :deep(.section__claim) {
  margin: 12px 0 0;
  font-family: var(--font-text);
  font-size: 1.1875rem;
  line-height: 1.6;
}

.story :deep(.section__note) {
  margin: 12px 0 0;
  color: var(--color-ink-muted);
  line-height: var(--fl-body-leading);
}

.story :deep(.section .fl-chart) {
  margin-top: 20px;
  padding: 20px 24px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 16px;
  background: var(--color-paper);
}

.story :deep(.section__toggle) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  margin-bottom: 8px;
  padding: 0 8px 0 0;
  border: 0;
  background: none;
  color: var(--color-ink);
  font: inherit;
  font-weight: 600;
  text-align: left; /* a wrapped label stays beside its checkbox, not centered */
  cursor: pointer;
}

.story :deep(.section__toggle .mdi) {
  font-size: 22px;
  color: var(--color-forest);
}

.story :deep(.section__go),
.section__next {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  margin-top: 20px;
  padding: 0 22px;
  border: 0;
  border-radius: 999px;
  background: var(--color-forest);
  color: var(--color-paper);
  font: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.section__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.section__menu {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 48px;
  margin-top: 20px;
  padding: 0 18px;
  border: 1px solid var(--color-forest);
  border-radius: 999px;
  background: var(--color-paper);
  color: var(--color-forest);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.story__sheet-list {
  margin: 8px 0 0;
  padding-left: 1.4em;
}

.story__sheet-link {
  display: flex;
  align-items: center;
  min-height: 48px;
  font-weight: 600;
}

.story__sheet-link[aria-current='true'] {
  text-decoration: none;
}

/* From 1024px, a section's chart sits beside its text. */
@media (min-width: 1024px) {
  .section {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    column-gap: 40px;
    align-items: start;
  }

  .section > * {
    grid-column: 1;
  }

  .story :deep(.section > .fl-chart) {
    grid-column: 2;
    grid-row: 1 / span 6;
    margin-top: 0;
  }
}
</style>
