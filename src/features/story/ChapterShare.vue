<script setup lang="ts">
// Chapter 2: Most of it is still your money. The deposits share of her balance (rule R1).
import { computed, ref } from 'vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import TermTip from '@/shared/components/TermTip.vue'
import type { RosaStory } from '@/shared/data'
import { formatMoney } from '@/shared/format'

const props = defineProps<{ story: RosaStory }>()
const f = computed(() => props.story.facts)
const claim = computed(() => props.story.claims.find((c) => c.id === 'deposits-share')?.text ?? '')
const putInPct = computed(() => Math.round(f.value.depositsShare * 100))
const earnedPct = computed(() => 100 - putInPct.value)
const picked = ref<'in' | 'earned' | null>(null)
const readout = computed(() =>
  picked.value === 'in'
    ? `${formatMoney(f.value.moneyIn)} of your balance is money you put in. That is ${putInPct.value}%.`
    : picked.value === 'earned'
      ? `${formatMoney(f.value.earned)} is what it earned. That is ${earnedPct.value}%.`
      : 'Tap either part to read it.',
)
const columns = [
  { key: 'part', label: 'Part' },
  { key: 'amount', label: 'Amount', numeric: true },
  { key: 'share', label: 'Share', numeric: true },
]
const rows = computed(() => [
  { part: 'Money you put in', amount: formatMoney(f.value.moneyIn), share: `${putInPct.value}%` },
  { part: 'What it earned', amount: formatMoney(f.value.earned), share: `${earnedPct.value}%` },
])
</script>

<template>
  <section id="chapter-2" class="chapter" aria-labelledby="chapter-2-title">
    <p class="chapter__num">Chapter 2</p>
    <h2 id="chapter-2-title">Most of it is still your money</h2>
    <p class="chapter__claim">{{ claim }}</p>
    <ChartFrame title="Your balance, in two parts" :level="3" :summary="claim" :columns="columns" :rows="rows">
      <div v-if="f.earned >= 0" class="share" role="group" aria-label="Your balance, in two parts">
        <button
          type="button"
          class="share__part is-in"
          :style="{ flexBasis: `${putInPct}%` }"
          :aria-pressed="picked === 'in' ? 'true' : 'false'"
          @click="picked = 'in'"
        >
          <span class="share__label">Money you put in</span>
        </button>
        <button
          type="button"
          class="share__part is-earned"
          :style="{ flexBasis: `${earnedPct}%` }"
          :aria-pressed="picked === 'earned' ? 'true' : 'false'"
          aria-label="What it earned"
          @click="picked = 'earned'"
        />
      </div>
      <p class="share__readout" aria-live="polite">{{ readout }}</p>
      <p class="share__note">
        What it earned is its <TermTip id="return">return</TermTip>. It needs years to grow.
      </p>
    </ChartFrame>
  </section>
</template>

<style scoped>
.share {
  display: flex;
  gap: 3px;
  height: 56px;
  margin-top: 8px;
}

.share__part {
  min-width: 48px;
  border: 2px solid transparent;
  border-radius: 8px;
  font: inherit;
  cursor: pointer;
}

.share__part.is-in {
  background: var(--color-mint);
  border-color: var(--color-ink-muted);
  text-align: left;
  padding: 0 12px;
}

.share__part.is-earned {
  background: var(--color-leaf);
  border-color: var(--color-forest);
}

.share__part[aria-pressed='true'] {
  outline: 3px solid var(--color-ink);
  outline-offset: 2px;
}

.share__label {
  font-weight: 600;
  color: var(--color-ink);
}

.share__readout {
  margin: 12px 0 0;
  min-height: 1.5em;
}

.share__note {
  margin: 8px 0 0;
  color: var(--color-ink-muted);
}
</style>
