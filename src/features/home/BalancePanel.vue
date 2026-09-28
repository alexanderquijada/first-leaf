<script setup lang="ts">
// The balance, in the dark data panel (every size, Phase 6): the number, up or down on what
// she put in, this week, then Invested / Cash / You put in / Auto-invest. Only "Invested" is a
// finance term; the other labels are plain words.
import CopyText from '@/shared/components/CopyText.vue'
import copy from './copy.json'
import Money from '@/shared/components/Money.vue'
import TermTip from '@/shared/components/TermTip.vue'
import { useScenario } from '@/shared/composables/useScenario'
import { formatMoneyShort } from '@/shared/format'

const { account } = useScenario()
const B = copy.balance
</script>

<template>
  <section class="fl-panel balance" aria-labelledby="balance-title">
    <h2 id="balance-title" class="balance__label">{{ B.label }}</h2>
    <p class="balance__big fl-tabular"><Money :amount="account.balance" /></p>
    <p class="balance__line">
      <CopyText :text="B.vsPutIn" :values="{ moneyIn: formatMoneyShort(account.moneyIn) }"
        ><template #change><Money :amount="account.gainLoss" change capitalize /></template></CopyText
      >
    </p>
    <p v-if="account.weeklyChange" class="balance__line">
      <CopyText :text="B.thisWeek"><template #change><Money :amount="account.weeklyChange.totalChange" change /></template></CopyText>
    </p>
    <dl class="balance__parts">
      <div><dt><TermTip id="invested">{{ B.inFunds }}</TermTip></dt><dd class="fl-tabular"><Money :amount="account.investedValue" /></dd></div>
      <div><dt>{{ B.cash }}</dt><dd class="fl-tabular"><Money :amount="account.cash" /></dd></div>
      <div><dt>{{ B.youPutIn }}</dt><dd class="fl-tabular"><Money :amount="account.moneyIn" /></dd></div>
      <div><dt>{{ B.autoInvest }}</dt><dd>{{ B.on }}</dd></div>
    </dl>
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
  /* Grows with large text, but never wider than a phone (15vw is 58px at 390). */
  font-size: min(clamp(2.5rem, 4vw, 3.5rem), 15vw);
  line-height: 1.1;
}

.balance__line {
  margin: 8px 0 0;
  line-height: var(--fl-body-leading);
}

.balance__parts {
  margin: 16px 0 8px;
  border-top: 1px solid rgb(185 199 190 / 0.35);
}

.balance__parts > div {
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* at 200% text on a 320px phone, the amount drops under its label */
  justify-content: space-between;
  gap: 4px 24px;
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
