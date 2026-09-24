<script setup lang="ts">
// Practice: pretend money for trying things. It never touches Rosa's account.
// A banner stays on screen the whole time.
import { computed, ref } from 'vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import SeriesChart from '@/shared/charts/SeriesChart.vue'
import Money from '@/shared/components/Money.vue'
import TermTip from '@/shared/components/TermTip.vue'
import { useInertBackground } from '@/shared/composables/useInertBackground'
import { usePractice } from '@/shared/composables/usePractice'
import { useViewport } from '@/shared/composables/useViewport'
import { practiceRules } from '@/shared/data'
import { formatDate, formatMoney, formatMoneyShort } from '@/shared/format'
import { colors } from '@/shared/tokens/tokens'
import OrderForm from './OrderForm.vue'
import PhoneOrder from './PhoneOrder.vue'

const p = usePractice()
const { isPhone } = useViewport()
const withYear = (iso: string) => `${formatDate(iso)}, ${iso.slice(0, 4)}`

const tm = computed(() => p.timeMachine.value)
const tmSummary = computed(() => {
  const a = tm.value[0], b = tm.value.at(-1)
  return a && b ? `If you had held this mix since ${withYear(a.date)}, it would be worth ${formatMoney(b.value)} on ${withYear(b.date)}. On ${withYear(a.date)} it would have been worth ${formatMoney(a.value)}.` : ''
})

const confirmOpen = ref(false)
useInertBackground(confirmOpen)
function startOver() {
  p.startOver()
  confirmOpen.value = false
}
</script>

<template>
  <div class="practice">
    <p class="practice__banner" role="note">
      <span class="mdi mdi-flask-outline" aria-hidden="true" /> Practice money. It isn't real money.
    </p>
    <h1><TermTip id="practice-mode">Practice</TermTip></h1>
    <dl class="practice__sum">
      <div><dt>Practice money left</dt><dd class="fl-tabular">{{ formatMoney(p.cash.value) }}</dd></div>
      <div><dt>In practice funds</dt><dd class="fl-tabular">{{ formatMoney(p.invested.value) }}</dd></div>
      <div><dt>Total in Practice</dt><dd class="fl-tabular">{{ formatMoney(p.total.value) }}</dd></div>
    </dl>

    <div class="practice__grid">
      <div class="practice__card">
        <PhoneOrder v-if="isPhone" />
        <OrderForm v-else />
      </div>

      <div class="practice__card">
        <h2 class="practice__h">What you own in Practice</h2>
        <p v-if="!p.holdings.value.length">Nothing yet. Buy a fund to start.</p>
        <div v-else class="practice__wrap" role="region" aria-label="What you own in Practice" tabindex="0">
          <table class="practice__table">
            <caption class="fl-visually-hidden">What you own in Practice</caption>
            <thead>
              <tr><th scope="col">Fund</th><th scope="col" class="is-num">Shares</th><th scope="col" class="is-num">Value</th><th scope="col" class="is-num">Paid</th><th scope="col" class="is-num">Up or down</th></tr>
            </thead>
            <tbody>
              <tr v-for="h in p.holdings.value" :key="h.ticker">
                <td>{{ h.ticker }}</td>
                <td class="is-num fl-tabular">{{ h.shares.toFixed(4) }}</td>
                <td class="is-num fl-tabular">{{ formatMoney(h.value) }}</td>
                <td class="is-num fl-tabular">{{ formatMoney(h.paid) }}</td>
                <td class="is-num fl-tabular"><Money :amount="h.gainLoss" change context="table" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <template v-if="p.mix.value.length">
          <h3 class="practice__h3">Your practice mix</h3>
          <ul class="practice__mix">
            <li v-for="m in p.mix.value" :key="m.ticker">
              <span class="practice__mix-name">{{ m.ticker }}</span>
              <span class="fl-tabular">{{ Math.round(m.share * 100) }}%</span>
              <span class="practice__bar" aria-hidden="true"><span :style="{ width: `${Math.round(m.share * 100)}%` }" /></span>
            </li>
          </ul>
        </template>
      </div>
    </div>

    <div class="practice__card">
      <ChartFrame
        title="Time machine"
        :summary="tm.length ? tmSummary : 'Buy a fund to see how your mix would have moved.'"
        :columns="[{ key: 'date', label: 'Week of' }, { key: 'value', label: 'Value', numeric: true }]"
        :rows="tm.map((t) => ({ date: withYear(t.date), value: formatMoney(t.value) }))"
      >
        <SeriesChart
          v-if="tm.length"
          :labels="tm.map((t) => withYear(t.date))"
          :series="[{ label: 'Your practice mix', data: tm.map((t) => t.value), color: colors.forest }]"
          :describe="(i: number) => `${withYear(tm[i]!.date)}: your practice mix would be worth ${formatMoney(tm[i]!.value)}.`"
          label="Time machine"
          :height="isPhone ? 180 : 240"
        />
        <p class="practice__note">{{ practiceRules.timeMachine.note }}</p>
      </ChartFrame>
    </div>

    <button type="button" class="practice__over" @click="confirmOpen = true">Start over</button>
    <v-dialog v-model="confirmOpen" max-width="420" aria-label="Start over">
      <v-card color="paper" class="practice__dialog">
        <h2 class="practice__h">Start over?</h2>
        <p>This clears your practice funds and sets your practice money back to {{ formatMoneyShort(practiceRules.startingCash) }}.</p>
        <div class="practice__dialog-actions">
          <v-btn variant="text" color="ink" @click="confirmOpen = false">Cancel</v-btn>
          <v-btn variant="flat" color="forest" @click="startOver">Start over</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.practice {
  display: grid;
  gap: 16px;
  max-width: 1100px;
}

.practice h1 {
  font-size: clamp(2.25rem, 5vw, 3rem);
}

/* The banner stays under the top bar (and the tabs on a tablet) while scrolling. */
.practice__banner {
  position: sticky;
  top: 65px;
  z-index: 15;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 10px 16px;
  border-radius: 8px;
  background: var(--color-lime);
  color: var(--color-ink);
  font-weight: 700;
}

@media (min-width: 600px) and (max-width: 1023px) {
  .practice__banner {
    top: 114px;
  }
}

.practice__sum {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 32px;
  margin: 0;
}

.practice__sum dt {
  color: var(--color-ink-muted);
}

.practice__sum dd {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 600;
}

.practice__grid {
  display: grid;
  gap: 16px;
}

@media (min-width: 1024px) {
  .practice__grid {
    grid-template-columns: 1fr 1fr;
  }
}

.practice__card {
  padding: 16px 20px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 16px;
  background: var(--color-paper);
}

.practice__h {
  font-size: 1.375rem;
}

.practice__h3 {
  margin-top: 16px;
  font-family: var(--font-ui);
  font-size: 1rem;
  font-weight: 700;
}

.practice__card p {
  margin: 8px 0 0;
}

.practice__wrap {
  margin-top: 8px;
  overflow-x: auto;
}

.practice__table {
  width: 100%;
  border-collapse: collapse;
}

.practice__table th,
.practice__table td {
  padding: 8px 0;
  border-bottom: 1px solid var(--color-mint);
  text-align: left;
  white-space: nowrap;
}

.practice__table .is-num {
  text-align: right;
  padding-left: 24px;
}

.practice__mix {
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
}

.practice__mix li {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 24px;
  padding: 6px 0;
}

.practice__mix-name {
  font-weight: 600;
}

.practice__bar {
  grid-column: 1 / -1;
  height: 8px;
  border-radius: 4px;
  background: var(--color-mint);
}

.practice__bar span {
  display: block;
  height: 100%;
  border-radius: 4px;
  background: var(--color-forest);
}

.practice__note {
  color: var(--color-ink-muted);
}

.practice__over {
  justify-self: start;
  min-height: 48px;
  padding: 0 20px;
  border: 1px solid var(--color-terracotta);
  border-radius: 4px;
  background: var(--color-paper);
  color: var(--color-terracotta);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.practice__dialog {
  padding: 24px;
}

.practice__dialog p {
  margin: 8px 0 0;
  line-height: 1.5;
}

.practice__dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.practice__dialog-actions .v-btn {
  min-height: 48px;
}
</style>
