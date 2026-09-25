<script setup lang="ts">
import { computed } from 'vue'
// The practice order on a laptop or tablet: buy or sell, pick a fund, amount,
// review, confirm. Errors show inline; Review and Confirm stay disabled until the
// order is valid.
import ToggleGroup from '@/shared/components/ToggleGroup.vue'
import { funds, getFund } from '@/shared/data'
import { formatMoney, formatQuantity } from '@/shared/format'
import { fill } from '@/shared/copy'
import copy from './copy.json'
import { useOrder } from './useOrder'

const O = copy.order

const { side, ticker, amount, amountNumber, touched, step, last, error, shownError, estShares, review, confirm, next, practice } = useOrder()
// Crypto is reviewed in coins, not shares (ruling 5, Sept. 25).
const reviewText = computed(() => {
  const c = getFund(ticker.value)?.kind === 'crypto'
  return side.value === 'buy' ? (c ? O.reviewBuyCrypto : O.reviewBuy) : c ? O.reviewSellCrypto : O.reviewSell
})
</script>

<template>
  <section class="order" aria-labelledby="order-title">
    <h2 id="order-title" class="order__title">{{ O.title }}</h2>
    <template v-if="step === 'enter'">
      <ToggleGroup v-model="side" :label="O.side" :options="[{ id: 'buy', label: O.buy }, { id: 'sell', label: O.sell }]" />
      <fieldset class="order__funds">
        <legend>{{ O.pickFund }}</legend>
        <label v-for="f in funds" :key="f.ticker" class="order__fund">
          <input v-model="ticker" type="radio" name="practice-fund" :value="f.ticker" />
          <span class="order__fund-name"><strong>{{ f.ticker }}</strong> {{ f.name }}</span>
          <span class="fl-tabular">{{ formatMoney(f.latestPrice) }}</span>
        </label>
      </fieldset>
      <label class="order__amount-label" for="practice-amount">{{ O.amountLabel }}</label>
      <div class="order__amount">
        <span aria-hidden="true">{{ O.dollar }}</span>
        <input
          id="practice-amount"
          v-model="amount"
          inputmode="decimal"
          autocomplete="off"
          class="fl-tabular"
          :aria-invalid="shownError ? 'true' : 'false'"
          aria-describedby="practice-error"
          @input="touched = true"
        />
      </div>
      <p id="practice-error" class="order__error" role="alert">{{ shownError }}</p>
      <button type="button" class="order__btn is-primary" :disabled="!!error" @click="review">{{ O.review }}</button>
    </template>

    <template v-else-if="step === 'review'">
      <h3 class="order__h">{{ O.checkOrder }}</h3>
      <p>
        {{ fill(reviewText, { amount: formatMoney(amountNumber), ticker, price: formatMoney(practice.priceOf(ticker)), quantity: getFund(ticker)?.kind === 'crypto' ? formatQuantity(estShares, 'crypto', ticker) : formatQuantity(estShares, 'stock', ticker) })
        }}<template v-if="side === 'buy'">{{ O.noFee }}</template>
      </p>
      <p class="order__error" role="alert">{{ error }}</p>
      <div class="order__row">
        <button type="button" class="order__btn" @click="step = 'enter'">{{ O.back }}</button>
        <button type="button" class="order__btn is-primary" :disabled="!!error" @click="confirm">{{ O.confirm }}</button>
      </div>
    </template>

    <template v-else-if="last">
      <p class="order__done" role="status">
        <span class="mdi mdi-check-circle" aria-hidden="true" />
        <template v-if="last.side === 'buy'">{{ fill(O.bought, { amount: formatMoney(last.amount), ticker: last.ticker }) }}</template>
        <template v-else>{{ fill(O.sold, { amount: formatMoney(last.amount), ticker: last.ticker }) }}</template>
      </p>
      <button type="button" class="order__btn is-primary" @click="next">{{ O.newOrder }}</button>
    </template>
  </section>
</template>

<style scoped>
.order__title {
  font-size: 1.375rem;
  margin-bottom: 8px;
}

.order__h {
  font-size: 1.125rem;
}

.order p {
  margin: 8px 0 0;
  line-height: 1.6;
}

.order__funds {
  margin: 16px 0 0;
  padding: 0;
  border: 0;
}

.order__funds legend {
  font-weight: 700;
  margin-bottom: 4px;
}

.order__fund {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  min-height: 48px;
  padding: 0 8px;
  border-bottom: 1px solid var(--color-mint);
  cursor: pointer;
}

.order__fund input {
  width: 20px;
  height: 20px;
  accent-color: var(--color-forest);
}

.order__fund-name strong {
  margin-right: 6px;
}

.order__amount-label {
  display: block;
  margin-top: 16px;
  font-weight: 700;
}

.order__amount {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 1.25rem;
}

.order__amount input {
  width: 10em;
  min-height: 48px;
  padding: 0 10px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 4px;
  background: var(--color-paper);
  font: inherit;
}

.order__error {
  color: var(--color-terracotta);
  font-weight: 600;
}

.order__error:empty {
  display: none;
}

.order__row {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.order__btn {
  min-height: 48px;
  margin-top: 12px;
  padding: 0 20px;
  border: 1px solid var(--color-forest);
  border-radius: 999px;
  background: var(--color-paper);
  color: var(--color-forest);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.order__row .order__btn {
  margin-top: 0;
}

.order__btn.is-primary {
  background: var(--color-forest);
  color: var(--color-paper);
}

.order__btn:disabled {
  border-color: var(--color-ink-muted);
  background: var(--color-mint);
  color: var(--color-ink-muted);
  cursor: not-allowed;
}

.order__done {
  display: flex;
  gap: 8px;
  font-weight: 600;
}

.order__done .mdi {
  color: var(--color-forest);
  font-size: 1.375rem;
  line-height: 1.1;
}
</style>
