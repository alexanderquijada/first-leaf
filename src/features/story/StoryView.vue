<script setup lang="ts">
import ChapterMark from './ChapterMark.vue'
// Your money story (P302). Rosa's own facts and sentences come from the data
// (rosaStory), checked by rules R1-R4; a brand-new account gets a short version.
import { computed, nextTick, ref } from 'vue'
import BottomSheet from '@/shared/components/BottomSheet.vue'
import { useViewport } from '@/shared/composables/useViewport'
import { useScenario } from '@/shared/composables/useScenario'
import { story } from '@/shared/data'
import ChapterDip from './ChapterDip.vue'
import ChapterKeepGoing from './ChapterKeepGoing.vue'
import ChapterPractice from './ChapterPractice.vue'
import ChapterMix from './ChapterMix.vue'
import ChapterShare from './ChapterShare.vue'
import ChapterSinceMarch from './ChapterSinceMarch.vue'
import { fill } from '@/shared/copy'
import copy from './copy.json'

const T = copy.titles

const { account } = useScenario()
const { isPhone } = useViewport()
const menuOpen = ref(false)
// On a phone the chapter menu is a bottom sheet; choosing a chapter closes it,
// then scrolls to the chapter and moves focus to its heading.
async function goTo(n: number) {
  menuOpen.value = false
  await nextTick()
  const el = document.getElementById(`chapter-${n}`)
  el?.scrollIntoView()
  const h = el?.querySelector('h2') as HTMLElement | null
  if (h) {
    h.tabIndex = -1
    h.focus()
  }
  history.replaceState(history.state, '', `#chapter-${n}`)
}
const rosa = computed(() => story.rosaStory[account.value.id] ?? null)
const pointOfView = computed(() => rosa.value?.pointOfView ?? story.pointOfView)

const chapters = computed(() =>
  rosa.value
    ? [
        { n: 1, title: T['1'] },
        { n: 2, title: T['2'] },
        { n: 3, title: fill(T['3'], { month: rosa.value.facts.dip.month }) },
        { n: 4, title: T['4'] },
        { n: 5, title: T['5'] },
        { n: 6, title: T['6'] },
      ]
    : [
        { n: 1, title: T.new },
        { n: 5, title: T['5'] },
        { n: 6, title: T['6'] },
      ],
)
</script>

<template>
  <div class="story">
    <h1>{{ copy.title }}</h1>
    <p class="story__pov">{{ pointOfView }}</p>

    <template v-if="isPhone">
      <button type="button" class="story__chapters" @click="menuOpen = true">
        <span class="mdi mdi-format-list-numbered" aria-hidden="true" /> {{ copy.chapters }}
      </button>
      <BottomSheet v-model="menuOpen" :title="copy.chapters">
        <ol class="story__sheet-list">
          <li v-for="c in chapters" :key="c.n" :value="c.n">
            <a :href="`#chapter-${c.n}`" class="story__sheet-link" @click.prevent="goTo(c.n)">{{ c.title }}</a>
          </li>
        </ol>
      </BottomSheet>
    </template>
    <nav v-else class="story__menu" :aria-label="copy.chapters">
      <ol>
        <li v-for="c in chapters" :key="c.n" :value="c.n">
          <a :href="`#chapter-${c.n}`" class="story__menu-link">{{ c.title }}</a>
        </li>
      </ol>
    </nav>

    <template v-if="rosa">
      <ChapterSinceMarch :story="rosa" :account="account" />
      <ChapterShare :story="rosa" />
      <ChapterDip :story="rosa" :account="account" />
      <ChapterMix :account="account" />
    </template>
    <section v-else id="chapter-1" class="chapter" aria-labelledby="chapter-1-title">
      <ChapterMark :n="1" />
      <h2 id="chapter-1-title">{{ T.new }}</h2>
      <p class="chapter__claim">{{ copy.newClaim }}</p>
    </section>

    <ChapterKeepGoing />
    <ChapterPractice />
  </div>
</template>

<style scoped>
.story {
  max-width: 820px;
}

.story h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
}

.story__pov {
  margin: 16px 0 0;
  font-family: var(--font-text);
  font-size: 1.375rem;
  line-height: 1.5;
}

.story__menu {
  margin: 24px 0 8px;
  padding: 12px 16px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 12px;
  background: var(--color-paper);
}

.story__menu ol {
  margin: 0;
  padding-left: 1.4em;
}

.story__chapters {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 48px;
  margin-top: 16px;
  padding: 0 18px;
  border: 1px solid var(--color-forest);
  border-radius: 24px;
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

.story__menu-link {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
}

.story :deep(.chapter) {
  margin-top: 48px;
  scroll-margin-top: 140px;
}

.story :deep(.chapter__num) {
  margin: 0;
  font-weight: 600;
  color: var(--color-ink-muted);
}

.story :deep(.chapter h2) {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
}

.story :deep(.chapter__claim) {
  margin: 12px 0 0;
  font-family: var(--font-text);
  font-size: 1.1875rem;
  line-height: 1.6;
}

.story :deep(.chapter .fl-chart) {
  margin-top: 20px;
  padding: 20px 24px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 16px;
  background: var(--color-paper);
}

.story :deep(.chapter__toggle) {
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
  cursor: pointer;
}

.story :deep(.chapter__toggle .mdi) {
  font-size: 22px;
  color: var(--color-forest);
}
</style>
