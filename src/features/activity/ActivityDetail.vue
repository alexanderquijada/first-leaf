<script setup lang="ts">
// One activity item: what it was, its dates and status, and its words.
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { describeActivity } from '@/shared/activityText'
import CopyText from '@/shared/components/CopyText.vue'
import TermTip from '@/shared/components/TermTip.vue'
import WordChips from '@/shared/components/WordChips.vue'
import { useGlossary } from '@/shared/composables/useGlossary'
import { useViewport } from '@/shared/composables/useViewport'
import { getFund } from '@/shared/data'
import { formatDate, formatMoney, formatQuantity } from '@/shared/format'
import { fill } from '@/shared/copy'
import copy from './copy.json'
import { useActivityRows } from './useActivityRows'

const F = copy.facts

const route = useRoute()
const { find } = useActivityRows()
const { getTerm } = useGlossary()
const { isPhone } = useViewport()
const item = computed(() => find(String(route.params.id)))
const d = computed(() => (item.value ? describeActivity(item.value) : null))

const facts = computed<{ label: string; value: string }[]>(() => {
  const r = item.value
  if (!r) return []
  const base = [
    { label: F.amount, value: formatMoney(r.amount) },
    { label: F.status, value: describeActivity(r).label },
  ]
  if (r.status === 'pending') return [...base, { label: F.requestedOn, value: formatDate(r.date) }]
  if (r.type === 'deposit')
    return [
      ...base,
      { label: F.askedOn, value: formatDate(r.date) },
      r.status === 'returned' && r.returnedDate
        ? { label: F.sentBackOn, value: formatDate(r.returnedDate) }
        : { label: F.arrivedOn, value: formatDate(r.settledDate) },
    ]
  if (r.type === 'buy') {
    // A buy's dollar figure is what you paid; a crypto's size is its "Amount" (ruling 5, Sept. 25).
    const crypto = getFund(r.ticker)?.kind === 'crypto'
    return [
      { label: F.paid, value: formatMoney(r.amount) },
      base[1]!,
      { label: F.fund, value: fill(F.fundValue, { ticker: r.ticker, name: getFund(r.ticker)?.name ?? '' }) },
      { label: F.boughtOn, value: formatDate(r.date) },
      { label: F.price, value: formatMoney(r.price) },
      { label: crypto ? F.amountCoin : F.shares, value: formatQuantity(r.shares, crypto ? 'crypto' : 'stock', r.ticker) },
      { label: F.settledOn, value: formatDate(r.settledDate) },
    ]
  }
  return [...base, { label: F.fund, value: fill(F.fundValue, { ticker: r.ticker, name: getFund(r.ticker)?.name ?? '' }) }, { label: F.paidOn, value: formatDate(r.date) }]
})

const termIds = computed(() => {
  const r = item.value
  if (!r) return []
  if (r.status === 'pending') return ['deposit']
  if (r.type === 'deposit') return r.status === 'returned' ? ['returned-deposit', 'deposit'] : ['deposit']
  if (r.type === 'buy') return ['share', 'fractional-share', 'settlement', 'auto-invest']
  return ['dividend', 'cash']
})
const terms = computed(() => termIds.value.map((t) => getTerm(t)).filter((t) => t !== undefined))
</script>

<template>
  <div class="adet">
    <RouterLink to="/activity" class="adet__back"><span class="mdi mdi-arrow-left" aria-hidden="true" /> {{ copy.allActivity }}</RouterLink>
    <template v-if="item && d">
      <h1>{{ d.what }}</h1>
      <dl class="adet__facts">
        <div v-for="f in facts" :key="f.label">
          <dt>{{ f.label }}</dt>
          <dd class="fl-tabular">{{ f.value }}</dd>
        </div>
      </dl>
      <p v-if="item.status === 'pending'">{{ copy.pendingNote }}</p>
      <p v-if="item.status !== 'pending' && item.type === 'deposit' && item.returnReason">{{ item.returnReason }}</p>
      <p v-if="item.status !== 'pending' && item.type === 'buy'">{{ copy.buyNote }}</p>
      <h2 class="adet__h">{{ copy.whatItMeans }}</h2>
      <ul class="adet__terms">
        <li v-for="t in terms" :key="t.id"><CopyText :text="copy.termLine" :values="{ short: t.short }"><template #term><TermTip :id="t.id">{{ t.term }}</TermTip></template></CopyText></li>
      </ul>
      <WordChips v-if="isPhone" :ids="termIds" />
    </template>
    <template v-else>
      <h1>{{ copy.notFound }}</h1>
      <p>{{ copy.notFoundWhy }}</p>
    </template>
  </div>
</template>

<style scoped>
.adet {
  max-width: 640px;
}

.adet h1 {
  font-size: clamp(2rem, 5vw, 2.75rem);
}

.adet p {
  margin: 12px 0 0;
  line-height: 1.6;
}

.adet__back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 48px;
  margin-bottom: 8px;
  font-weight: 600;
}

.adet__facts {
  margin: 16px 0 0;
  border-top: 1px solid var(--color-mint);
}

.adet__facts > div {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  min-height: 48px;
  align-items: center;
  border-bottom: 1px solid var(--color-mint);
}

.adet__facts dt {
  color: var(--color-ink-muted);
}

.adet__facts dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
}

.adet__h {
  margin-top: 24px;
  font-family: var(--font-ui);
  font-size: 1rem;
  font-weight: 700;
}

.adet__terms {
  margin: 8px 0 0;
  padding-left: 1.2em;
  line-height: 1.6;
}
</style>
