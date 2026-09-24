<script setup lang="ts">
// Your money story (P302). Rosa's own facts and sentences come from the data
// (rosaStory), checked by rules R1-R4; a brand-new account gets a short version.
import { computed } from 'vue'
import { useScenario } from '@/shared/composables/useScenario'
import { story } from '@/shared/data'
import ChapterDip from './ChapterDip.vue'
import ChapterMix from './ChapterMix.vue'
import ChapterShare from './ChapterShare.vue'
import ChapterSinceMarch from './ChapterSinceMarch.vue'

const { account } = useScenario()
const rosa = computed(() => story.rosaStory[account.value.id] ?? null)
const pointOfView = computed(() => rosa.value?.pointOfView ?? story.pointOfView)

const chapters = computed(() =>
  rosa.value
    ? [
        { n: 1, title: 'Seven months in' },
        { n: 2, title: 'Most of it is still your money' },
        { n: 3, title: 'The dip in July' },
        { n: 4, title: 'Where it is now' },
        { n: 5, title: 'What happens if you keep going' },
        { n: 6, title: 'Try it with pretend money' },
      ]
    : [
        { n: 1, title: 'Your story starts with your first deposit' },
        { n: 5, title: 'What happens if you keep going' },
        { n: 6, title: 'Try it with pretend money' },
      ],
)
</script>

<template>
  <div class="story">
    <h1>Your money story</h1>
    <p class="story__pov">{{ pointOfView }}</p>

    <nav class="story__menu" aria-label="Chapters">
      <ol>
        <li v-for="c in chapters" :key="c.n">
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
      <p class="chapter__num">Chapter 1</p>
      <h2 id="chapter-1-title">Your story starts with your first deposit</h2>
      <p class="chapter__claim">Once your first deposit arrives, this story will show how your money has moved.</p>
    </section>

    <section id="chapter-5" class="chapter" aria-labelledby="chapter-5-title">
      <p class="chapter__num">Chapter 5</p>
      <h2 id="chapter-5-title">What happens if you keep going</h2>
      <p class="chapter__claim">Coming soon.</p>
    </section>
    <section id="chapter-6" class="chapter" aria-labelledby="chapter-6-title">
      <p class="chapter__num">Chapter 6</p>
      <h2 id="chapter-6-title">Try it with pretend money</h2>
      <p class="chapter__claim">Coming soon.</p>
    </section>
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

.story__menu-link {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
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
