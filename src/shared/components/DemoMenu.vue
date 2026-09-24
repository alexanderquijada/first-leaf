<script setup lang="ts">
// Lets a reviewer switch between the three demo scenarios. Labels and
// descriptions come from scenarios.json; the choice is written to the URL.
import { useScenario } from '../composables/useScenario'

const { scenarios, scenario, scenarioId, setScenario } = useScenario()
</script>

<template>
  <v-menu location="bottom end">
    <template #activator="{ props: activator }">
      <v-btn
        v-bind="activator"
        variant="outlined"
        color="ink"
        append-icon="mdi-chevron-down"
        class="fl-demo__button"
      >
        Demo: {{ scenario.label }}
      </v-btn>
    </template>
    <v-list class="fl-demo__list" bg-color="paper" max-width="360">
      <v-list-item
        v-for="s in scenarios"
        :key="s.id"
        :aria-current="s.id === scenarioId ? 'true' : undefined"
        :active="false"
        lines="three"
        @click="setScenario(s.id)"
      >
        <template #prepend>
          <v-icon
            :icon="s.id === scenarioId ? 'mdi-check' : undefined"
            color="forest"
            aria-hidden="true"
          />
        </template>
        <v-list-item-title class="fl-demo__label">{{ s.label }}</v-list-item-title>
        <v-list-item-subtitle class="fl-demo__desc">{{ s.description }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-menu>
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
