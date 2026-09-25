<script setup lang="ts">
// The practice order on a phone: buy or sell, pick a fund, type the amount on a
// large keypad, review it in a bottom sheet, confirm. Errors show above the keypad
// and Review/Confirm stay disabled until the order is valid.
import { computed, nextTick, ref, watch } from 'vue'
import BottomSheet from '@/shared/components/BottomSheet.vue'
import ToggleGroup from '@/shared/components/ToggleGroup.vue'
import { funds, getFund } from '@/shared/data'
import { formatMoney, formatQuantity } from '@/shared/format'
import { fill } from '@/shared/copy'
import copy from './copy.json'
import { useOrder } from './useOrder'

const O = copy.order

const { side, ticker, amount, touched, step, last, error, shownError, estShares, review, confirm, next, practice } = useOrder()
// Crypto is reviewed in coins, not shares (ruling 5, Sept. 25).
const reviewText = computed(() => {
  const c = getFund(ticker.value)?.kind === 'crypto'
  return side.value === 'buy' ? (c ? O.reviewBuyCrypto : O.reviewBuy) : c ? O.reviewSellCrypto : O.reviewSell
})
const sheetOpen = ref(false)
// When an error appears, scroll just enough to show it below the sticky banner. Only then:
// scrolling on every key press would move the keys under a finger.
const errorEl = ref<HTMLElement | null>(null)
watch(shownError, async (now, before) => {
  if (!now || now === before) return
  await nextTick()
  errorEl.value?.scrollIntoView({ block: 'nearest' })
})
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'] as const

function press(k: (typeof KEYS)[number]) {
  touched.value = true
  if (k === 'del') amount.value = amount.value.slice(0, -1)
  else if (amount.value.length < 10) amount.value += k
}
function openReview() {
  review()
  if (step.value === 'review') sheetOpen.value = true
}
function doConfirm() {
  confirm()
  sheetOpen.value = false
}
function onSheet(open: boolean) {
  if (!open && step.value === 'review') step.value = 'enter'
}
</script>

<template>
  <section class="porder" aria-labelledby="porder-title">
    <h2 id="porder-title" class="porder__title">{{ O.title }}</h2>
    <template v-if="step !== 'done'">
      <ToggleGroup v-model="side" :label="O.side" :options="[{ id: 'buy', label: O.buy }, { id: 'sell', label: O.sell }]" />
      <fieldset class="porder__funds">
        <legend>{{ O.pickFund }}</legend>
        <label v-for="f in funds" :key="f.ticker" class="porder__fund">
          <input v-model="ticker" type="radio" name="phone-practice-fund" :value="f.ticker" />
          <span><strong>{{ f.ticker }}</strong></span>
          <span class="fl-tabular">{{ formatMoney(f.latestPrice) }}</span>
        </label>
      </fieldset>
      <p class="porder__label" id="porder-amount-label">{{ O.phoneAmountLabel }}</p>
      <p class="porder__amount fl-tabular" aria-labelledby="porder-amount-label" role="status">{{ fill(O.phoneAmount, { dollars: amount || '0' }) }}</p>
      <p ref="errorEl" class="porder__error" role="alert">{{ shownError }}</p>
      <div class="porder__keys" role="group" :aria-label="O.keypad">
        <button
          v-for="k in KEYS"
          :key="k"
          type="button"
          class="porder__key"
          :aria-label="k === 'del' ? O.delete : k === '.' ? O.decimal : k"
          @click="press(k)"
        >
          <span v-if="k === 'del'" class="mdi mdi-backspace-outline" aria-hidden="true" />
          <template v-else>{{ k }}</template>
        </button>
      </div>
      <button type="button" class="porder__review" :disabled="!!error" @click="openReview">{{ O.review }}</button>
    </template>
    <template v-else-if="last">
      <p class="porder__done" role="status">
        <span class="mdi mdi-check-circle" aria-hidden="true" />
        <template v-if="last.side === 'buy'">{{ fill(O.bought, { amount: formatMoney(last.amount), ticker: last.ticker }) }}</template>
        <template v-else>{{ fill(O.sold, { amount: formatMoney(last.amount), ticker: last.ticker }) }}</template>
      </p>
      <button type="button" class="porder__review" @click="next">{{ O.newOrder }}</button>
    </template>

    <BottomSheet v-model="sheetOpen" :title="O.checkOrder" @update:model-value="onSheet">
      <p class="porder__sheet-text">
        {{ fill(reviewText, { amount: formatMoney(Number(amount)), ticker, price: formatMoney(practice.priceOf(ticker)), quantity: getFund(ticker)?.kind === 'crypto' ? formatQuantity(estShares, 'crypto', ticker) : formatQuantity(estShares, 'stock', ticker) })
        }}<template v-if="side === 'buy'">{{ O.noFee }}</template>
      </p>
      <p class="porder__error" role="alert">{{ error }}</p>
      <button type="button" class="porder__review" :disabled="!!error" @click="doConfirm">{{ O.confirm }}</button>
    </BottomSheet>
  </section>
</template>

<style scoped>
.porder__title {
  font-size: 1.375rem;
  margin-bottom: 8px;
}

.porder__funds {
  margin: 12px 0 0;
  padding: 0;
  border: 0;
}

.porder__funds legend {
  font-weight: 700;
}

.porder__fund {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  min-height: 48px;
  border-bottom: 1px solid var(--color-mint);
}

.porder__fund input {
  width: 22px;
  height: 22px;
  accent-color: var(--color-forest);
}

.porder__label {
  margin: 16px 0 0;
  font-weight: 700;
}

.porder__amount {
  margin: 0;
  font-family: var(--font-display);
  font-size: 2.75rem;
  line-height: 1.2;
}

.porder__error {
  min-height: 1.5em;
  margin: 4px 0 8px;
  color: var(--color-terracotta);
  font-weight: 600;
  line-height: var(--fl-body-leading);
  /* Room for the sticky banner under the top bar (the page already keeps 128px). */
  scroll-margin-top: 64px;
}

.porder__keys {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.porder__key {
  min-height: 64px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 12px;
  background: var(--color-paper);
  color: var(--color-ink);
  font: inherit;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
}

.porder__review {
  width: 100%;
  min-height: 56px;
  margin-top: 12px;
  border: 0;
  border-radius: 999px;
  background: var(--color-forest);
  color: var(--color-paper);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.porder__review:disabled {
  background: var(--color-mint);
  color: var(--color-ink-muted);
  border: 1px solid var(--color-ink-muted);
  cursor: not-allowed;
}

.porder__done {
  display: flex;
  gap: 8px;
  font-weight: 600;
  line-height: var(--fl-body-leading);
}

.porder__done .mdi {
  color: var(--color-forest);
  font-size: 1.375rem;
}

.porder__sheet-text {
  margin: 8px 0 0;
  line-height: 1.6;
}
</style>
