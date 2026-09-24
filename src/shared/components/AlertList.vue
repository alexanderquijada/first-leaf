<script setup lang="ts">
// The current account's alerts, most urgent first: what needs a look, then
// "Just so you know" (FYI), then a collapsed "Handled" group with Undo.
// Used by Home (laptop) and the Alerts page.
import { computed, ref } from 'vue'
import type { AttentionFlag } from '../data'
import { useHandled } from '../composables/useHandled'
import { useScenario } from '../composables/useScenario'
import { useSession } from '../composables/useSession'
import SeverityBadge from './SeverityBadge.vue'
import { copy, fill } from '../copy'
const L = copy.alerts

const props = withDefaults(defineProps<{ selectedId?: string; headingLevel?: 2 | 3; showSeen?: boolean }>(), {
  selectedId: undefined,
  headingLevel: 2,
  showSeen: false,
})

const { attention } = useScenario()
const { open, done, undo } = useHandled()
const { isSeen } = useSession()

const needs = computed(() => open.value.filter((a) => a.severity !== 'fyi'))
const fyi = computed(() => open.value.filter((a) => a.severity === 'fyi'))
const everHadNeeds = computed(() => attention.value.some((a) => a.severity !== 'fyi'))
const showHandled = ref(false)
const lastUndone = ref('')

function undoOne(a: AttentionFlag) {
  undo(a)
  lastUndone.value = fill(L.undone, { title: a.title })
}
const h = computed(() => `h${props.headingLevel}`)
const h2 = computed(() => `h${props.headingLevel + 1}`)
</script>

<template>
  <div class="fl-alerts">
    <component :is="h" class="fl-alerts__title">{{ L.title }}</component>
    <p v-if="needs.length" class="fl-alerts__count">
      {{ needs.length === 1 ? L.countOne : fill(L.countMany, { count: needs.length }) }}
    </p>
    <p v-else-if="everHadNeeds" class="fl-alerts__calm">{{ L.allHandled }}</p>
    <p v-else class="fl-alerts__calm">{{ L.nothing }}</p>

    <ul v-if="needs.length" class="fl-alerts__list">
      <li v-for="a in needs" :key="a.id">
        <RouterLink
          :to="`/alerts/${a.id}`"
          class="fl-alerts__row"
          :aria-current="a.id === selectedId ? 'page' : undefined"
        >
          <SeverityBadge :severity="a.severity" />
          <span class="fl-alerts__text">{{ a.title }}</span>
          <span v-if="a.newSinceLastReview" class="fl-alerts__new">{{ L.new }}</span>
          <span v-if="showSeen && isSeen(a.id)" class="fl-alerts__seen">{{ L.seen }}</span>
          <span class="mdi mdi-chevron-right fl-alerts__go" aria-hidden="true" />
        </RouterLink>
      </li>
    </ul>

    <template v-if="fyi.length">
      <component :is="h2" class="fl-alerts__sub">{{ L.fyiTitle }}</component>
      <ul class="fl-alerts__list">
        <li v-for="a in fyi" :key="a.id">
          <RouterLink
            :to="`/alerts/${a.id}`"
            class="fl-alerts__row"
            :aria-current="a.id === selectedId ? 'page' : undefined"
          >
            <SeverityBadge :severity="a.severity" />
            <span class="fl-alerts__text">{{ a.title }}</span>
            <span v-if="a.newSinceLastReview" class="fl-alerts__new">{{ L.new }}</span>
            <span v-if="showSeen && isSeen(a.id)" class="fl-alerts__seen">{{ L.seen }}</span>
            <span class="mdi mdi-chevron-right fl-alerts__go" aria-hidden="true" />
          </RouterLink>
        </li>
      </ul>
    </template>

    <div v-if="done.length" class="fl-alerts__handled">
      <button
        type="button"
        class="fl-alerts__toggle"
        :aria-expanded="showHandled ? 'true' : 'false'"
        @click="showHandled = !showHandled"
      >
        <span class="mdi" :class="showHandled ? 'mdi-chevron-down' : 'mdi-chevron-right'" aria-hidden="true" />
        {{ fill(L.handled, { count: done.length }) }}
      </button>
      <ul v-if="showHandled" class="fl-alerts__list">
        <li v-for="a in done" :key="a.id" class="fl-alerts__done">
          <span class="fl-alerts__text">{{ a.title }}</span>
          <button type="button" class="fl-alerts__undo" @click="undoOne(a)">
            {{ L.undo }}<span class="fl-visually-hidden">{{ fill(L.undoWhich, { title: a.title }) }}</span>
          </button>
        </li>
      </ul>
    </div>
    <p class="fl-visually-hidden" role="status">{{ lastUndone }}</p>
  </div>
</template>

<style scoped>
.fl-alerts__title {
  font-size: 1.5rem;
}

.fl-alerts__count,
.fl-alerts__calm {
  margin: 4px 0 12px;
  color: var(--color-ink-muted);
}

.fl-alerts__calm {
  color: var(--color-ink);
  font-family: var(--font-text);
  font-size: 1.125rem;
}

.fl-alerts__sub {
  margin: 16px 0 4px;
  font-size: 1.125rem;
}

.fl-alerts__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.fl-alerts__row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 8px 8px;
  border-bottom: 1px solid var(--color-mint);
  color: var(--color-ink);
  text-decoration: none;
}

.fl-alerts__row:hover {
  background: var(--color-cream);
}

.fl-alerts__row[aria-current='page'] {
  background: var(--color-mint);
  box-shadow: inset 4px 0 0 var(--color-forest);
}

.fl-alerts__text {
  flex: 1;
  line-height: 1.4;
  text-wrap: pretty;
}

.fl-alerts__new,
.fl-alerts__seen {
  flex: none;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 700;
}

.fl-alerts__new {
  background: var(--color-ink);
  color: var(--color-paper);
}

.fl-alerts__seen {
  border: 1px solid var(--color-ink-muted);
  color: var(--color-ink-muted);
}

.fl-alerts__go {
  flex: none;
  font-size: 22px;
  color: var(--color-ink-muted);
}

.fl-alerts__handled {
  margin-top: 12px;
}

.fl-alerts__toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 48px;
  padding: 0 8px 0 0;
  border: 0;
  background: none;
  color: var(--color-ink);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.fl-alerts__done {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  border-bottom: 1px solid var(--color-mint);
  color: var(--color-ink-muted);
}

.fl-alerts__undo {
  min-height: 48px;
  min-width: 48px;
  padding: 0 12px;
  border: 1px solid var(--color-forest);
  border-radius: 4px;
  background: var(--color-paper);
  color: var(--color-forest);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
</style>
