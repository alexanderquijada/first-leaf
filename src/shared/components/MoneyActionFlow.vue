<script setup lang="ts">
// The action on an alert, as a real app would run it: review → confirm → confirmation.
// Deposits add a Pending deposit to this session's Activity; auto-invest changes the
// session's setting. The data files never change, and reloading starts fresh.
import { computed, ref, watch } from 'vue'
import type { AttentionFlag } from '../data'
import { useInertBackground } from '../composables/useInertBackground'
import { useScenario } from '../composables/useScenario'
import { useSession } from '../composables/useSession'
import { DEPOSIT_CONFIRMATION, copy, fill } from '../copy'

const M = copy.moneyFlow
import { formatDate, formatMoney, formatMoneyShort } from '../format'

const props = defineProps<{ alert: AttentionFlag }>()
const open = defineModel<boolean>({ default: false })

const { account } = useScenario()
const { requestDeposit, autoInvestOn, setAutoInvest } = useSession()

type Step = 'review' | 'confirm' | 'done'
const step = ref<Step>('review')
const kind = computed(() => props.alert.action?.kind)
const isDeposit = computed(() => kind.value === 'retry-deposit' || kind.value === 'one-time-deposit')

// Deposit amount: fixed for a retry, filled in (and editable) for a one-time deposit.
const amountText = ref('')
const amountError = computed(() => {
  if (kind.value !== 'one-time-deposit') return ''
  const t = amountText.value.trim()
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return M.amountError
  const n = Number(t)
  return n >= 1 && n <= 10000 ? '' : M.amountError
})
const amount = computed(() => (kind.value === 'one-time-deposit' ? Number(amountText.value) : props.alert.amount))

// Auto-invest: the switch shows the new choice; confirming applies it.
const wantOn = ref(false)

// While the dialog is open, the page behind it is inert.
useInertBackground(open)

watch(open, (o) => {
  if (!o) return
  step.value = 'review'
  amountText.value = String(props.alert.action?.amount ?? props.alert.amount)
  wantOn.value = autoInvestOn.value
})

const title = computed(() =>
  kind.value === 'retry-deposit' ? M.titleRetry : kind.value === 'one-time-deposit' ? M.titleOneTime : M.titleAutoInvest,
)

const pausedSince = computed(() => account.value.autoInvest.pausedOn)

function next() {
  if (step.value === 'review') {
    if (isDeposit.value && amountError.value) return
    if (!isDeposit.value && wantOn.value === autoInvestOn.value) return
    step.value = 'confirm'
  } else if (step.value === 'confirm') {
    if (isDeposit.value) requestDeposit(amount.value, kind.value === 'retry-deposit' ? 'retry' : 'one-time')
    else setAutoInvest(wantOn.value)
    step.value = 'done'
  }
}
</script>

<template>
  <v-dialog v-model="open" max-width="480" :aria-label="title">
    <v-card class="fl-flow" color="paper">
      <div class="fl-flow__body">
        <h2 class="fl-flow__title">{{ title }}</h2>

        <!-- Deposits -->
        <template v-if="isDeposit">
          <template v-if="step === 'review'">
            <p>{{ M.checkAmount }}</p>
            <dl class="fl-flow__facts">
              <div>
                <dt>{{ M.amount }}</dt>
                <dd v-if="kind === 'retry-deposit'" class="fl-tabular">{{ formatMoney(amount) }}</dd>
                <dd v-else>
                  <label class="fl-visually-hidden" for="fl-flow-amount">{{ M.amountLabel }}</label>
                  <span class="fl-flow__dollar" aria-hidden="true">$</span>
                  <input
                    id="fl-flow-amount"
                    v-model="amountText"
                    class="fl-flow__input fl-tabular"
                    inputmode="decimal"
                    autocomplete="off"
                    :aria-invalid="amountError ? 'true' : 'false'"
                    aria-describedby="fl-flow-amount-error"
                  />
                </dd>
              </div>
              <div><dt>{{ M.from }}</dt><dd>{{ M.fromValue }}</dd></div>
              <div><dt>{{ M.to }}</dt><dd>{{ M.toValue }}</dd></div>
            </dl>
            <p id="fl-flow-amount-error" class="fl-flow__error" role="alert">{{ amountError }}</p>
            <p>{{ M.timing }}</p>
          </template>
          <template v-else-if="step === 'confirm'">
            <p>{{ fill(M.confirmDeposit, { amount: formatMoneyShort(amount) }) }}</p>
          </template>
          <template v-else>
            <p class="fl-flow__done" role="status">
              <span class="mdi mdi-check-circle" aria-hidden="true" />
              {{ DEPOSIT_CONFIRMATION }}
            </p>
            <p>{{ M.seeInActivity }}</p>
          </template>
        </template>

        <!-- Auto-invest -->
        <template v-else>
          <template v-if="step === 'review'">
            <p v-if="autoInvestOn">{{ M.autoOnNow }}</p>
            <p v-else-if="pausedSince">{{ fill(M.autoPausedSince, { date: formatDate(pausedSince) }) }}</p>
            <p v-else>{{ M.autoOff }}</p>
            <div class="fl-flow__switch">
              <span id="fl-flow-switch-label" class="fl-flow__switch-label">{{ M.switchLabel }}</span>
              <button
                type="button"
                role="switch"
                class="fl-switch"
                :aria-checked="wantOn ? 'true' : 'false'"
                aria-labelledby="fl-flow-switch-label"
                @click="wantOn = !wantOn"
              >
                <span class="fl-switch__track" aria-hidden="true"><span class="fl-switch__thumb" /></span>
                <span class="fl-switch__text">{{ wantOn ? M.on : M.off }}</span>
              </button>
            </div>
          </template>
          <template v-else-if="step === 'confirm'">
            <p v-if="wantOn">{{ fill(M.confirmOn, { cash: formatMoney(account.cash) }) }}</p>
            <p v-else>{{ M.confirmOff }}</p>
          </template>
          <template v-else>
            <p class="fl-flow__done" role="status">
              <span class="mdi mdi-check-circle" aria-hidden="true" />
              {{ autoInvestOn ? M.doneOn : M.donePaused }}
            </p>
          </template>
        </template>
      </div>

      <div class="fl-flow__actions">
        <template v-if="step === 'review'">
          <v-btn variant="text" color="ink" @click="open = false">{{ M.cancel }}</v-btn>
          <v-btn
            variant="flat"
            color="forest"
            :disabled="isDeposit ? !!amountError : wantOn === autoInvestOn"
            @click="next"
            >{{ M.continue }}</v-btn
          >
        </template>
        <template v-else-if="step === 'confirm'">
          <v-btn variant="text" color="ink" @click="step = 'review'">{{ M.back }}</v-btn>
          <v-btn variant="flat" color="forest" @click="next">{{
            isDeposit ? M.confirmDepositButton : wantOn ? M.turnOn : M.pause
          }}</v-btn>
        </template>
        <v-btn v-else variant="flat" color="forest" @click="open = false">{{ M.done }}</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.fl-flow__body {
  padding: 24px 24px 8px;
}

.fl-flow__title {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.fl-flow p {
  margin: 8px 0 0;
  line-height: var(--fl-body-leading);
}

.fl-flow__facts {
  margin: 16px 0 0;
  border-top: 1px solid var(--color-mint);
}

.fl-flow__facts > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  min-height: 48px;
  border-bottom: 1px solid var(--color-mint);
}

.fl-flow__facts dt {
  color: var(--color-ink-muted);
}

.fl-flow__facts dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
}

.fl-flow__dollar {
  margin-right: 2px;
}

.fl-flow__input {
  width: 8em;
  min-height: 48px;
  padding: 0 8px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 4px;
  background: var(--color-paper);
  font: inherit;
  text-align: right;
}

.fl-flow__error {
  min-height: 0;
  color: var(--color-terracotta);
  font-weight: 600;
}

.fl-flow__error:empty {
  display: none;
}

.fl-flow__done {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  font-weight: 600;
}

.fl-flow__done .mdi {
  color: var(--color-forest);
  font-size: 1.375rem;
  line-height: 1.1;
}

.fl-flow__switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 12px;
  min-height: 48px;
  border-top: 1px solid var(--color-mint);
  border-bottom: 1px solid var(--color-mint);
}

.fl-flow__switch-label {
  font-weight: 600;
}

.fl-switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 4px;
  border: 0;
  background: none;
  color: var(--color-ink);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.fl-switch__track {
  position: relative;
  width: 48px;
  height: 28px;
  border-radius: 14px;
  border: 2px solid var(--color-ink-muted);
  background: var(--color-paper);
}

.fl-switch__thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-ink-muted);
  transition: left 150ms ease;
}

.fl-switch[aria-checked='true'] .fl-switch__track {
  border-color: var(--color-forest);
  background: var(--color-forest);
}

.fl-switch[aria-checked='true'] .fl-switch__thumb {
  left: 23px;
  background: var(--color-paper);
}

.fl-switch__text {
  min-width: 2em;
}

.fl-flow__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px 24px;
}

.fl-flow__actions .v-btn {
  min-height: 48px;
}
</style>
