import { computed, ref } from 'vue'
import { usePractice, type Side } from '@/shared/composables/usePractice'
import type { Ticker } from '@/shared/data'

// The order being built (module scope, so a half-entered order survives
// navigation and interruptions; reload clears it).
const side = ref<Side>('buy')
const ticker = ref<Ticker>('FL-BROAD')
const amount = ref('')
const touched = ref(false)
const step = ref<'enter' | 'review' | 'done'>('enter')
const last = ref<{ side: Side; ticker: Ticker; amount: number } | null>(null)

export function useOrder() {
  const p = usePractice()
  const error = computed(() => p.orderError(side.value, ticker.value, amount.value))
  const shownError = computed(() => (touched.value ? error.value : ''))
  const amountNumber = computed(() => Number(amount.value.replace(/^\$/, '').replace(/,/g, '')))
  const estShares = computed(() => (error.value ? 0 : amountNumber.value / p.priceOf(ticker.value)))

  function review() {
    touched.value = true
    if (!error.value) step.value = 'review'
  }
  function confirm() {
    if (error.value) return
    const done = p.place(side.value, ticker.value, amount.value)
    if (done) {
      last.value = { side: side.value, ticker: ticker.value, amount: done.amount }
      step.value = 'done'
    }
  }
  function next() {
    amount.value = ''
    touched.value = false
    step.value = 'enter'
  }
  return { side, ticker, amount, touched, step, last, error, shownError, estShares, review, confirm, next, practice: p }
}
