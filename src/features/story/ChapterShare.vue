<script setup lang="ts">
// Chapter 2: Most of it is still your money. The deposits share of her balance (rule R1).
import { computed, ref } from 'vue'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import TermTip from '@/shared/components/TermTip.vue'
import type { RosaStory } from '@/shared/data'
import CopyText from '@/shared/components/CopyText.vue'
import { fill } from '@/shared/copy'
import { formatMoney } from '@/shared/format'
import copy from './copy.json'

const S = copy.share

const props = defineProps<{ story: RosaStory }>()
const f = computed(() => props.story.facts)
const claim = computed(() => props.story.claims.find((c) => c.id === 'deposits-share')?.text ?? '')
const putInPct = computed(() => Math.round(f.value.depositsShare * 100))
const earnedPct = computed(() => 100 - putInPct.value)
const picked = ref<'in' | 'earned' | null>(null)
const readout = computed(() =>
  picked.value === 'in'
    ? fill(S.readIn, { amount: formatMoney(f.value.moneyIn), pct: putInPct.value })
    : picked.value === 'earned'
      ? fill(S.readEarned, { amount: formatMoney(f.value.earned), pct: earnedPct.value })
      : S.readHint,
)
const columns = [
  { key: 'part', label: S.colPart },
  { key: 'amount', label: S.colAmount, numeric: true },
  { key: 'share', label: S.colShare, numeric: true },
]
const rows = computed(() => [
  { part: S.partIn, amount: formatMoney(f.value.moneyIn), share: fill(S.percent, { pct: putInPct.value }) },
  { part: S.partEarned, amount: formatMoney(f.value.earned), share: fill(S.percent, { pct: earnedPct.value }) },
])
</script>

<template>
  <section id="chapter-2" class="chapter" aria-labelledby="chapter-2-title">
    <p class="chapter__num">{{ fill(copy.chapterNum, { n: 2 }) }}</p>
    <h2 id="chapter-2-title">{{ copy.titles['2'] }}</h2>
    <p class="chapter__claim">{{ claim }}</p>
    <ChartFrame :title="S.chartTitle" :level="3" :summary="claim" :columns="columns" :rows="rows">
      <div v-if="f.earned >= 0" class="share" role="group" :aria-label="S.chartTitle">
        <button
          type="button"
          class="share__part is-in"
          :style="{ flexBasis: `${putInPct}%` }"
          :aria-pressed="picked === 'in' ? 'true' : 'false'"
          @click="picked = 'in'"
        >
          <span class="share__label">{{ S.partIn }}</span>
        </button>
        <button
          type="button"
          class="share__part is-earned"
          :style="{ flexBasis: `${earnedPct}%` }"
          :aria-pressed="picked === 'earned' ? 'true' : 'false'"
          :aria-label="S.partEarned"
          @click="picked = 'earned'"
        />
      </div>
      <p class="share__readout" aria-live="polite">{{ readout }}</p>
      <p class="share__note">
        <CopyText :text="S.note"><template #return><TermTip id="return">{{ S.returnWord }}</TermTip></template></CopyText>
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
