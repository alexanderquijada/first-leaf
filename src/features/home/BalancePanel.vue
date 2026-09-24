<script setup lang="ts">
// The balance, in the dark data panel: how much, up or down on what she put in,
// this week, and auto-invest (as it stands this session).
import { computed } from 'vue'
import Money from '@/shared/components/Money.vue'
import TermTip from '@/shared/components/TermTip.vue'
import { useScenario } from '@/shared/composables/useScenario'
import { useSession } from '@/shared/composables/useSession'
import { formatDate, formatMoneyShort } from '@/shared/format'

const { account } = useScenario()
const { autoInvestOn, autoInvestChanged } = useSession()
const pausedOn = computed(() => account.value.autoInvest.pausedOn)
</script>

<template>
  <section class="fl-panel balance" aria-labelledby="balance-title">
    <h2 id="balance-title" class="balance__label"><TermTip id="balance">Balance</TermTip></h2>
    <p class="balance__big fl-tabular"><Money :amount="account.balance" /></p>
    <p class="balance__line">
      <Money :amount="account.gainLoss" change capitalize /> on the
      {{ formatMoneyShort(account.moneyIn) }} you
      <TermTip id="money-in">put in</TermTip>.
    </p>
    <p v-if="account.weeklyChange" class="balance__line">
      This week: <Money :amount="account.weeklyChange.totalChange" change />.
    </p>
    <dl class="balance__parts">
      <div><dt>In funds</dt><dd class="fl-tabular"><Money :amount="account.investedValue" /></dd></div>
      <div><dt><TermTip id="cash">Cash</TermTip></dt><dd class="fl-tabular"><Money :amount="account.cash" /></dd></div>
      <div><dt>You put in</dt><dd class="fl-tabular"><Money :amount="account.moneyIn" /></dd></div>
    </dl>
    <p class="balance__line">
      <TermTip id="auto-invest">Auto-invest</TermTip>:
      <template v-if="autoInvestOn">On.</template>
      <template v-else-if="pausedOn && !autoInvestChanged">Paused since {{ formatDate(pausedOn) }}.</template>
      <template v-else>Paused.</template>
    </p>
  </section>
</template>

<style scoped>
.balance {
  padding: 24px;
  border-radius: 16px;
  background: var(--color-panel);
  color: var(--color-cream);
  --fl-gain: var(--color-lime);
  --fl-loss: var(--color-coral);
  --fl-term-underline: var(--color-lime);
}

.balance__label {
  font-family: var(--font-ui);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-on-panel);
}

.balance__big {
  margin: 4px 0 8px;
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  line-height: 1.1;
}

.balance__line {
  margin: 8px 0 0;
  line-height: 1.5;
}

.balance__parts {
  margin: 16px 0 8px;
  border-top: 1px solid rgb(185 199 190 / 0.35);
}

.balance__parts > div {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 8px 0;
  border-bottom: 1px solid rgb(185 199 190 / 0.35);
}

.balance__parts dt {
  color: var(--color-on-panel);
}

.balance__parts dd {
  margin: 0;
}
</style>
