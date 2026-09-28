<script setup lang="ts">
// Home at 600px and up (P301's weekly review): alerts first, top left, then the
// balance panel, balance over time, your mix, your goal and this week.
import AlertList from '@/shared/components/AlertList.vue'
import { useScenario } from '@/shared/composables/useScenario'
import BalanceOverTime from './BalanceOverTime.vue'
import BalancePanel from './BalancePanel.vue'
import GoalCard from './GoalCard.vue'
import MixCard from './MixCard.vue'
import ThisWeekCard from './ThisWeekCard.vue'
import WelcomeCard from './WelcomeCard.vue'
import copy from './copy.json'

const { account } = useScenario()
</script>

<template>
  <div class="dhome">
    <h1 class="fl-visually-hidden">{{ copy.title }}</h1>
    <template v-if="account.history.length">
      <!-- The dark balance card first, then what needs her (Alex, Sept. 28): the same order on
           screen, for the keyboard and for screen readers. Both start at the same top edge. -->
      <BalancePanel class="dhome__balance" />
      <div class="dhome__card dhome__alerts"><AlertList /></div>
      <div class="dhome__card dhome__chart"><BalanceOverTime /></div>
      <div class="dhome__card dhome__mix"><MixCard /></div>
      <div class="dhome__card dhome__goal"><GoalCard /></div>
      <div class="dhome__card dhome__week"><ThisWeekCard /></div>
    </template>
    <template v-else>
      <div class="dhome__card dhome__welcome"><WelcomeCard /></div>
      <div class="dhome__card dhome__chart">
        <h2 class="dhome__empty-title">{{ copy.chart.emptyTitle }}</h2>
        <p class="dhome__empty">{{ copy.chart.empty }}</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Tablet: two columns. The balance card, then alerts; the chart and the mix full width. */
.dhome {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  max-width: 1280px;
}

.dhome__card {
  padding: 20px 24px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 16px;
  background: var(--color-paper);
}

/* A card ends where its content ends, so no card holds an empty band (CLAUDE.md §9): the
   alerts card beside the taller balance card, and the goal card beside This week. */
.dhome__alerts,
.dhome__goal,
.dhome__week {
  align-self: start;
}

/* The mix card is the tallest, so it takes a full row: no card beside it ends in a big gap. */
.dhome__chart,
.dhome__mix,
.dhome__welcome {
  grid-column: 1 / -1;
}

.dhome__empty-title {
  font-size: 1.375rem;
}

.dhome__empty {
  margin: 8px 0 0;
  min-height: 120px;
  color: var(--color-ink-muted);
}

/* Laptop: 12 columns. Balance 5, alerts 7, chart 12, mix 12, then goal and this week at 6 each. */
@media (min-width: 1024px) {
  .dhome {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 20px;
  }

  .dhome__balance {
    grid-column: span 5;
  }

  .dhome__alerts {
    grid-column: span 7;
  }

  .dhome__chart,
  .dhome__mix,
  .dhome__welcome {
    grid-column: 1 / -1;
  }

  .dhome__goal,
  .dhome__week {
    grid-column: span 6;
  }
}
</style>
