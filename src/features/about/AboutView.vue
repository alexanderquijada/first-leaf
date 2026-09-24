<script setup lang="ts">
// About this demo: who Rosa is, the disclaimer, the demo scenarios, and a short
// map of where each case study lives. Copy is DRAFT until Alex approves it.
import Disclaimer from '@/shared/components/Disclaimer.vue'
import { useScenario } from '@/shared/composables/useScenario'
import { persona } from '@/shared/data'

const { scenarios, scenarioId } = useScenario()

const lenses = [
  {
    name: 'P301 · Operational dashboard',
    text: 'It is Home on a laptop, plus Alerts, Activity and Funds. Use a screen at least 1,024 pixels wide.',
    links: [
      { to: '/', label: 'Home' },
      { to: '/alerts', label: 'Alerts' },
      { to: '/activity', label: 'Activity' },
      { to: '/funds', label: 'Funds' },
    ],
  },
  {
    name: 'P302 · Interactive data story',
    text: 'It is Your money story, plus Practice and Words. Any screen size works.',
    links: [
      { to: '/story', label: 'Your money story' },
      { to: '/practice', label: 'Practice' },
      { to: '/learn', label: 'Words' },
    ],
  },
  {
    name: 'P303 · Mobile experience',
    text: 'It is the whole app on a phone. On a laptop, use Preview on a phone in the top bar.',
    links: [{ to: '/?view=phone', label: 'Open the phone preview' }],
  },
]
</script>

<template>
  <div class="about">
    <h1>About this demo</h1>
    <p class="about__lede">
      First Leaf is a made-up investing app. This page explains the demo: who Rosa is, how to
      switch her account, and where each case study lives.
    </p>

    <section aria-labelledby="about-rosa">
      <h2 id="about-rosa">Who Rosa is</h2>
      <p>
        {{ persona.firstName }} is {{ persona.age }}. She is a {{ persona.job.toLowerCase() }} in
        {{ persona.city }}. She is not a real person.
      </p>
      <p>{{ persona.story }}</p>
    </section>

    <section aria-labelledby="about-real">
      <h2 id="about-real">Nothing here is real</h2>
      <Disclaimer />
    </section>

    <section aria-labelledby="about-scenarios">
      <h2 id="about-scenarios">Demo scenarios</h2>
      <p>
        The Demo menu at the top of every page switches between three versions of Rosa’s account.
        Each one has its own numbers, so every sentence on every page stays true.
      </p>
      <ul class="about__list">
        <li v-for="s in scenarios" :key="s.id">
          <RouterLink :to="{ path: '/', query: { scenario: s.id } }" class="about__link">{{ s.label }}</RouterLink>
          <span v-if="s.id === scenarioId" class="about__now"> (Showing now)</span>
          <p>{{ s.description }}</p>
        </li>
      </ul>
    </section>

    <section aria-labelledby="about-reviewers">
      <h2 id="about-reviewers">For reviewers</h2>
      <p>
        First Leaf is one app. It is reviewed as three design case studies. Each one looks at the
        same app in a different way.
      </p>
      <ul class="about__list">
        <li v-for="l in lenses" :key="l.name">
          <h3>{{ l.name }}</h3>
          <p>{{ l.text }}</p>
          <ul class="about__links">
            <li v-for="k in l.links" :key="k.to">
              <RouterLink :to="k.to" class="about__link">{{ k.label }}</RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.about {
  max-width: 68ch;
}

.about h1 {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
}

.about h2 {
  margin-top: 40px;
  font-size: 1.75rem;
}

.about h3 {
  margin-top: 8px;
  font-size: 1.25rem;
}

.about p {
  margin: 12px 0 0;
  line-height: 1.6;
}

.about__lede {
  font-family: var(--font-text);
  font-size: 1.25rem;
}

.about__list {
  display: grid;
  gap: 16px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.about__list > li {
  padding-top: 16px;
  border-top: 1px solid var(--color-ink-muted);
}

.about__list > li > p {
  margin-top: 4px;
}

.about__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0 24px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
}

.about__link {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  font-weight: 600;
}

.about__now {
  color: var(--color-ink-muted);
}
</style>
