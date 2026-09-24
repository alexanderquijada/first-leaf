<script setup lang="ts">
// One fund: what Rosa has in it (or that she doesn't own it yet), its price over
// time, its yearly fee and any change to it, its ups and downs, what's inside.
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import SeriesChart from '@/shared/charts/SeriesChart.vue'
import CopyText from '@/shared/components/CopyText.vue'
import Money from '@/shared/components/Money.vue'
import TermTip from '@/shared/components/TermTip.vue'
import ToggleGroup from '@/shared/components/ToggleGroup.vue'
import WordChips from '@/shared/components/WordChips.vue'
import { useScenario } from '@/shared/composables/useScenario'
import { useViewport } from '@/shared/composables/useViewport'
import { getFund, meta } from '@/shared/data'
import { fill } from '@/shared/copy'
import { formatDate, formatMoney } from '@/shared/format'
import { colors } from '@/shared/tokens/tokens'
import copy from './copy.json'

const C = copy.chart

const route = useRoute()
const { account, activity } = useScenario()
const { isPhone } = useViewport()
const fund = computed(() => getFund(String(route.params.ticker)))
const holding = computed(() => account.value.holdings.find((h) => h.ticker === fund.value?.ticker))
const firstBuy = computed(() => activity.value.find((a) => a.type === 'buy' && a.ticker === fund.value?.ticker)?.date)

type Range = 'since' | '1y' | '5y'
const rangeOptions = computed(() => [
  ...(firstBuy.value ? [{ id: 'since' as Range, label: C.since }] : []),
  { id: '1y' as Range, label: C['1y'] },
  { id: '5y' as Range, label: C['5y'] },
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
  return a && b ? fill(C.summary, { from: withYear(a.date), to: withYear(b.date), start: formatMoney(a.close), end: formatMoney(b.close) }) : ''
})
const labels = computed(() => points.value.map((p) => (range.value === 'since' ? formatDate(p.date) : withYear(p.date))))
const series = computed(() => [{ label: C.series, data: points.value.map((p) => p.close), color: colors.forest }])
const describe = (i: number) => {
  const p = points.value[i]
  return p ? fill(C.day, { date: withYear(p.date), price: formatMoney(p.close) }) : ''
}
const rows = computed(() => points.value.map((p) => ({ date: withYear(p.date), price: formatMoney(p.close) })))

const feeNow = computed(() => fund.value?.expenseRatioHistory.filter((e) => e.effective <= meta.asOf).at(-1))
const feeNext = computed(() => fund.value?.expenseRatioHistory.find((e) => e.effective > meta.asOf))
const KIND = copy.kind
</script>

<template>
  <div class="fund">
    <RouterLink to="/funds" class="fund__back"><span class="mdi mdi-arrow-left" aria-hidden="true" /> {{ copy.allFunds }}</RouterLink>
    <template v-if="fund">
      <h1>{{ fund.ticker }}</h1>
      <p class="fund__name">{{ fill(copy.nameLine, { name: fund.name, kind: KIND[fund.kind], region: fund.region }) }}</p>

      <section class="fund__card" :aria-label="copy.whatYouHave">
        <template v-if="holding">
          <p class="fund__value fl-tabular"><Money :amount="holding.value" /></p>
          <p class="fund__line"><CopyText :text="copy.vsPaid" :values="{ paid: formatMoney(holding.costBasis) }"><template #change><Money :amount="holding.gainLoss" change capitalize /></template></CopyText></p>
          <dl class="fund__facts">
            <div><dt>{{ copy.facts.value }}</dt><dd class="fl-tabular">{{ formatMoney(holding.value) }}</dd></div>
            <div><dt>{{ copy.facts.paid }}</dt><dd class="fl-tabular">{{ formatMoney(holding.costBasis) }}</dd></div>
            <div><dt><TermTip id="share">{{ copy.facts.shares }}</TermTip></dt><dd class="fl-tabular">{{ holding.shares.toFixed(4) }}</dd></div>
            <div><dt><TermTip id="price">{{ copy.facts.price }}</TermTip></dt><dd class="fl-tabular">{{ formatMoney(holding.price) }}</dd></div>
          </dl>
        </template>
        <template v-else>
          <p class="fund__line">{{ copy.notOwnedYet }}</p>
          <p class="fund__line">{{ fill(copy.priceNow, { price: formatMoney(fund.latestPrice) }) }}</p>
        </template>
      </section>

      <div class="fund__card">
        <ChartFrame :title="C.title" :summary="summary" :columns="[{ key: 'date', label: C.colDate }, { key: 'price', label: C.colPrice, numeric: true }]" :rows="rows">
          <template #controls><ToggleGroup v-model="range" :label="C.range" :options="rangeOptions" /></template>
          <SeriesChart :labels="labels" :series="series" :describe="describe" :label="C.title" :height="isPhone ? 180 : 260" />
        </ChartFrame>
      </div>

      <section class="fund__card" aria-labelledby="fund-fee">
        <h2 id="fund-fee" class="fund__h"><CopyText :text="copy.fee.heading" :values="{ fee: feeNow?.value.toFixed(2) ?? '' }"><template #term><TermTip id="expense-ratio">{{ copy.fee.termWord }}</TermTip></template></CopyText></h2>
        <p v-if="feeNow && feeNext" class="fund__line">
          {{ fill(copy.fee.change, { oldFee: feeNow.value.toFixed(2), newFee: feeNext.value.toFixed(2), date: formatDate(feeNext.effective), points: (feeNext.value - feeNow.value).toFixed(2) }) }}<template v-if="feeNext.announcedOn">{{ fill(copy.fee.told, { date: formatDate(feeNext.announcedOn) }) }}</template>
        </p>
        <p v-else-if="feeNow" class="fund__line">{{ fill(copy.fee.steady, { fee: feeNow.value.toFixed(2), date: withYear(feeNow.effective) }) }}</p>
      </section>

      <section class="fund__card" aria-labelledby="fund-ups">
        <h2 id="fund-ups" class="fund__h"><CopyText :text="copy.ups.heading" :values="{ rating: fund.upsAndDowns }"><template #term><TermTip id="ups-and-downs">{{ copy.ups.termWord }}</TermTip></template></CopyText></h2>
        <p class="fund__line">{{ copy.ups.scale }}</p>
      </section>

      <section class="fund__card" aria-labelledby="fund-inside">
        <h2 id="fund-inside" class="fund__h">{{ copy.inside.heading }}</h2>
        <p class="fund__line">{{ fund.inside }}</p>
        <p class="fund__line">
          <CopyText v-if="fund.dividend" :text="fund.dividend.frequency === 'monthly' ? copy.inside.dividendMonthly : copy.inside.dividendQuarterly"><template #dividend><TermTip id="dividend">{{ copy.inside.dividendWord }}</TermTip></template></CopyText>
          <template v-else>{{ copy.inside.noDividend }}</template>
        </p>
      </section>
      <!-- On a phone, the page's words are also 48px chips (P303 brief). -->
      <WordChips v-if="isPhone" :ids="['expense-ratio', 'ups-and-downs', 'share', 'price', ...(fund.dividend ? ['dividend'] : [])]" />
    </template>
    <template v-else>
      <h1>{{ copy.notFound }}</h1>
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
