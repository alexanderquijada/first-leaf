<script setup lang="ts">
// The goal counts deposits only: money put in against the plan, never the market.
import { computed } from 'vue'
import TermTip from '@/shared/components/TermTip.vue'
import { useScenario } from '@/shared/composables/useScenario'
import { formatDate, formatMoneyShort } from '@/shared/format'

const { account } = useScenario()
const goal = computed(() => account.value.goal)
const pct = computed(() => (goal.value ? Math.round(goal.value.progress * 100) : 0))
</script>

<template>
  <section v-if="goal" class="goal" aria-labelledby="goal-title">
    <h2 id="goal-title" class="goal__title">Goal: {{ goal.name }}</h2>
    <p class="goal__line">
      {{ formatMoneyShort(goal.actualMoneyInToDate) }} of {{ formatMoneyShort(goal.target) }} put in, with a target of
      {{ formatDate(goal.targetDate) }}, {{ goal.targetDate.slice(0, 4) }}.
    </p>
    <div
      class="goal__bar"
      role="progressbar"
      aria-label="Money put in toward your goal"
      aria-valuemin="0"
      :aria-valuemax="goal.target"
      :aria-valuenow="goal.actualMoneyInToDate"
      :aria-valuetext="`${formatMoneyShort(goal.actualMoneyInToDate)} of ${formatMoneyShort(goal.target)}`"
    >
      <span class="goal__fill" :style="{ width: `${pct}%` }" />
    </div>
    <p v-if="goal.behindBy > 0" class="goal__line">
      Your plan had {{ formatMoneyShort(goal.plannedMoneyInToDate) }} put in by now, so you are
      {{ formatMoneyShort(goal.behindBy) }} behind.
    </p>
    <p v-else class="goal__line">You are on <TermTip id="goal-pace">pace</TermTip> with your plan.</p>
    <p class="goal__note">This counts deposits only, not the market.</p>
  </section>
</template>

<style scoped>
.goal__title {
  font-size: 1.375rem;
}

.goal__line {
  margin: 8px 0 0;
  line-height: 1.5;
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
