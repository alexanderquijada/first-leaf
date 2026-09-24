<script setup lang="ts">
// Lets a reviewer switch between the three demo scenarios. Labels and
// descriptions come from scenarios.json; the choice is written to the URL.
import { ref } from 'vue'
import { useScenario } from '../composables/useScenario'
import type { ScenarioId } from '../data'

const { scenarios, scenario, scenarioId, setScenario } = useScenario()

const open = ref(false)
// A ref inside Vuetify's activator slot isn't set, so find the button through a wrapper.
const wrapEl = ref<HTMLElement | null>(null)

// After a choice, focus goes back to the Demo button instead of getting lost.
// It moves once the menu has finished closing.
let refocus = false
function choose(id: ScenarioId) {
  setScenario(id)
  refocus = true
  open.value = false
}
function onClosed() {
  if (refocus) wrapEl.value?.querySelector<HTMLElement>('.fl-demo__button')?.focus()
  refocus = false
}
</script>

<template>
  <span ref="wrapEl" class="fl-demo">
    <v-menu v-model="open" location="bottom end" @after-leave="onClosed">
      <template #activator="{ props: activator }">
        <!-- Vuetify adds aria-owns, which pulls the whole list into the button's
             accessible name. aria-controls already links the two. -->
        <v-btn
          v-bind="{ ...activator, 'aria-owns': undefined }"
          variant="outlined"
          color="ink"
          append-icon="mdi-chevron-down"
          class="fl-demo__button"
        >
          Demo: {{ scenario.label }}
        </v-btn>
      </template>
      <v-list class="fl-demo__list" bg-color="paper" max-width="360" role="menu" aria-label="Demo scenarios">
        <v-list-item
          v-for="s in scenarios"
          :key="s.id"
          role="menuitemradio"
          :aria-checked="s.id === scenarioId ? 'true' : 'false'"
          :aria-labelledby="`fl-demo-${s.id}-label`"
          :aria-describedby="`fl-demo-${s.id}-desc`"
          :active="false"
          lines="three"
          @click="choose(s.id)"
        >
          <template #prepend>
            <v-icon
              :icon="s.id === scenarioId ? 'mdi-check' : undefined"
              color="forest"
              aria-hidden="true"
            />
          </template>
          <v-list-item-title :id="`fl-demo-${s.id}-label`" class="fl-demo__label">{{ s.label }}</v-list-item-title>
          <v-list-item-subtitle :id="`fl-demo-${s.id}-desc`" class="fl-demo__desc">{{ s.description }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-menu>
  </span>
</template>

<style scoped>
.fl-demo__button {
  min-height: 48px;
}

.fl-demo__label {
  font-weight: 600;
  color: var(--color-ink);
}

.v-list-item-subtitle.fl-demo__desc {
  color: var(--color-ink-muted);
  opacity: 1;
  -webkit-line-clamp: unset;
  line-clamp: unset;
  white-space: normal;
}
</style>
