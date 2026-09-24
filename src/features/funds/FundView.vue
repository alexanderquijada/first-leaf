<script setup lang="ts">
// One fund: what Rosa has in it (or that she doesn't own it yet), its price over
// time, its yearly fee and any change to it, its ups and downs, what's inside.
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import SeriesChart from '@/shared/charts/SeriesChart.vue'
import Money from '@/shared/components/Money.vue'
import TermTip from '@/shared/components/TermTip.vue'
import ToggleGroup from '@/shared/components/ToggleGroup.vue'
import WordChips from '@/shared/components/WordChips.vue'
import { useScenario } from '@/shared/composables/useScenario'
import { useViewport } from '@/shared/composables/useViewport'
import { getFund, meta } from '@/shared/data'
import { formatDate, formatMoney } from '@/shared/format'
import { colors } from '@/shared/tokens/tokens'

const route = useRoute()
const { account, activity } = useScenario()
const { isPhone } = useViewport()
const fund = computed(() => getFund(String(route.params.ticker)))
const holding = computed(() => account.value.holdings.find((h) => h.ticker === fund.value?.ticker))
const firstBuy = computed(() => activity.value.find((a) => a.type === 'buy' && a.ticker === fund.value?.ticker)?.date)

type Range = 'since' | '1y' | '5y'
const rangeOptions = computed(() => [
  ...(firstBuy.value ? [{ id: 'since' as Range, label: 'Since you bought' }] : []),
  { id: '1y' as Range, label: '1 year' },
  { id: '5y' as Range, label: '5 years' },
])
const range = ref<Range>('1y')
watch(firstBuy, (d) => (range.value = d ? 'since' : '1y'), { immediate: true })

const withYear = (iso: string) => `${formatDate(iso)}, ${iso.slice(0, 4)}`
const points = computed(() => {
  const f = fund.value
  if (!f) return []
  if (range.value === 'since') return f.history.daily.filter((d) => d.date >= firstBuy.value!)
  if (range.value === '1y') {
    const from = `${Number(meta.lastClose.slice(0, 4)) - 1}${meta.lastClose.slice(4)}`
    return f.history.weekly.filter((w) => w.date > from)
  }
  return f.history.weekly
})
const summary = computed(() => {
  const p = points.value, a = p[0], b = p.at(-1)
  return a && b ? `From ${withYear(a.date)} to ${withYear(b.date)}, the price went from ${formatMoney(a.close)} to ${formatMoney(b.close)}.` : ''
})
const labels = computed(() => points.value.map((p) => (range.value === 'since' ? formatDate(p.date) : withYear(p.date))))
const series = computed(() => [{ label: 'Price', data: points.value.map((p) => p.close), color: colors.forest }])
const describe = (i: number) => {
  const p = points.value[i]
  return p ? `${withYear(p.date)}: ${formatMoney(p.close)} a share.` : ''
}
const rows = computed(() => points.value.map((p) => ({ date: withYear(p.date), price: formatMoney(p.close) })))

const feeNow = computed(() => fund.value?.expenseRatioHistory.filter((e) => e.effective <= meta.asOf).at(-1))
const feeNext = computed(() => fund.value?.expenseRatioHistory.find((e) => e.effective > meta.asOf))
const KIND = { stocks: 'Stocks', bonds: 'Bonds', reserve: 'Reserve' } as const
</script>

<template>
  <div class="fund">
    <RouterLink to="/funds" class="fund__back"><span class="mdi mdi-arrow-left" aria-hidden="true" /> All funds</RouterLink>
    <template v-if="fund">
      <h1>{{ fund.ticker }}</h1>
      <p class="fund__name">{{ fund.name }} · {{ KIND[fund.kind] }} · {{ fund.region }}</p>

      <section class="fund__card" aria-label="What you have">
        <template v-if="holding">
          <p class="fund__value fl-tabular"><Money :amount="holding.value" /></p>
          <p class="fund__line"><Money :amount="holding.gainLoss" change capitalize /> on the {{ formatMoney(holding.costBasis) }} you paid.</p>
          <dl class="fund__facts">
            <div><dt>Your value</dt><dd class="fl-tabular">{{ formatMoney(holding.value) }}</dd></div>
            <div><dt>What you paid</dt><dd class="fl-tabular">{{ formatMoney(holding.costBasis) }}</dd></div>
            <div><dt><TermTip id="share">Shares</TermTip></dt><dd class="fl-tabular">{{ holding.shares.toFixed(4) }}</dd></div>
            <div><dt><TermTip id="price">Price</TermTip></dt><dd class="fl-tabular">{{ formatMoney(holding.price) }}</dd></div>
          </dl>
        </template>
        <template v-else>
          <p class="fund__line">You don't own this fund yet.</p>
          <p class="fund__line">Price: {{ formatMoney(fund.latestPrice) }} a share.</p>
        </template>
      </section>

      <div class="fund__card">
        <ChartFrame title="Price over time" :summary="summary" :columns="[{ key: 'date', label: 'Date' }, { key: 'price', label: 'Price', numeric: true }]" :rows="rows">
          <template #controls><ToggleGroup v-model="range" label="Time range" :options="rangeOptions" /></template>
          <SeriesChart :labels="labels" :series="series" :describe="describe" label="Price over time" :height="isPhone ? 180 : 260" />
        </ChartFrame>
      </div>

      <section class="fund__card" aria-labelledby="fund-fee">
        <h2 id="fund-fee" class="fund__h"><TermTip id="expense-ratio">Yearly fee</TermTip>: {{ feeNow?.value.toFixed(2) }}%</h2>
        <p v-if="feeNow && feeNext" class="fund__line">
          {{ feeNow.value.toFixed(2) }}% to {{ feeNext.value.toFixed(2) }}% on {{ formatDate(feeNext.effective) }}, up
          {{ (feeNext.value - feeNow.value).toFixed(2) }} percentage points.<template v-if="feeNext.announcedOn"> The fund told owners on {{ formatDate(feeNext.announcedOn) }}.</template>
        </p>
        <p v-else-if="feeNow" class="fund__line">It has been {{ feeNow.value.toFixed(2) }}% since {{ withYear(feeNow.effective) }}.</p>
      </section>

      <section class="fund__card" aria-labelledby="fund-ups">
        <h2 id="fund-ups" class="fund__h"><TermTip id="ups-and-downs">Ups and downs</TermTip>: {{ fund.upsAndDowns }} of 5</h2>
        <p class="fund__line">1 means its price barely moves. 5 means it moves the most.</p>
      </section>

      <section class="fund__card" aria-labelledby="fund-inside">
        <h2 id="fund-inside" class="fund__h">What is inside</h2>
        <p class="fund__line">{{ fund.inside }}</p>
        <p class="fund__line">
          <template v-if="fund.dividend">It pays a <TermTip id="dividend">dividend</TermTip> each {{ fund.dividend.frequency === 'monthly' ? 'month' : 'quarter' }}.</template>
          <template v-else>It does not pay dividends.</template>
        </p>
      </section>
      <!-- On a phone, the page's words are also 48px chips (P303 brief). -->
      <WordChips v-if="isPhone" :ids="['expense-ratio', 'ups-and-downs', 'share', 'price', ...(fund.dividend ? ['dividend'] : [])]" />
    </template>
    <template v-else>
      <h1>We could not find that fund.</h1>
    </template>
  </div>
</template>

<style scoped>
.fund {
  display: grid;
  gap: 16px;
  max-width: 900px;
}

.fund h1 {
  font-size: clamp(2.25rem, 5vw, 3rem);
}

.fund__back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 48px;
  justify-self: start;
  font-weight: 600;
}

.fund__name {
  margin: -8px 0 0;
  color: var(--color-ink-muted);
}

.fund__card {
  padding: 16px 20px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 16px;
  background: var(--color-paper);
}

.fund__value {
  margin: 0;
  font-family: var(--font-display);
  font-size: 2.25rem;
}

.fund__line {
  margin: 6px 0 0;
  line-height: 1.6;
}

.fund__h {
  font-family: var(--font-ui);
  font-size: 1.125rem;
  font-weight: 700;
}

.fund__facts {
  margin: 12px 0 0;
  border-top: 1px solid var(--color-mint);
}

.fund__facts > div {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  min-height: 44px;
  align-items: center;
  border-bottom: 1px solid var(--color-mint);
}

.fund__facts dt {
  color: var(--color-ink-muted);
}

.fund__facts dd {
  margin: 0;
  font-weight: 600;
}
</style>
