<script setup lang="ts">
// The goal counts deposits only: money put in against the plan, never the market.
import { computed } from 'vue'
import { fill } from '@/shared/copy'
import copy from './copy.json'
import { useScenario } from '@/shared/composables/useScenario'
import { formatDate, formatMoneyShort } from '@/shared/format'

const { account } = useScenario()
const goal = computed(() => account.value.goal)
const G = copy.goal
const targetDate = computed(() => (goal.value ? `${formatDate(goal.value.targetDate)}, ${goal.value.targetDate.slice(0, 4)}` : ''))
const pct = computed(() => (goal.value ? Math.round(goal.value.progress * 100) : 0))
</script>

<template>
  <section v-if="goal" class="goal" aria-labelledby="goal-title">
    <h2 id="goal-title" class="goal__title">{{ fill(G.title, { name: goal.name }) }}</h2>
    <p class="goal__line">
      {{ fill(G.progress, { actual: formatMoneyShort(goal.actualMoneyInToDate), target: formatMoneyShort(goal.target), date: targetDate }) }}
    </p>
    <div
      class="goal__bar"
      role="progressbar"
      :aria-label="G.barLabel"
      aria-valuemin="0"
      :aria-valuemax="goal.target"
      :aria-valuenow="goal.actualMoneyInToDate"
      :aria-valuetext="fill(G.barValue, { actual: formatMoneyShort(goal.actualMoneyInToDate), target: formatMoneyShort(goal.target) })"
    >
      <span class="goal__fill" :style="{ width: `${pct}%` }" />
    </div>
    <!-- Every deposit went through, so she is on pace (Phase 6). -->
    <p class="goal__line">{{ G.onPace }}</p>
    <p class="goal__note">{{ G.note }}</p>
  </section>
</template>

<style scoped>
.goal__title {
  font-size: 1.375rem;
}

.goal__line {
  margin: 8px 0 0;
  line-height: var(--fl-body-leading);
}

.goal__bar {
  height: 12px;
  margin-top: 12px;
  border-radius: 6px;
  background: var(--color-mint);
  border: 1px solid var(--color-ink-muted);
  overflow: hidden;
}

.goal__fill {
  display: block;
  height: 100%;
  background: var(--color-forest);
}

.goal__note {
  margin: 8px 0 0;
  color: var(--color-ink-muted);
  font-size: 0.9375rem;
}
</style>
