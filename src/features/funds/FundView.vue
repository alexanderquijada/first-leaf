<script setup lang="ts">
// One investment: what Rosa has in it (or that she doesn't own it yet), its price over
// time with where the prices come from, what it is, its ups and downs, its dividends, and
// on crypto pages, that SIPC protection doesn't cover it.
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ChartFrame from '@/shared/charts/ChartFrame.vue'
import SeriesChart from '@/shared/charts/SeriesChart.vue'
import CopyText from '@/shared/components/CopyText.vue'
import Money from '@/shared/components/Money.vue'
import PriceSourceNote from '@/shared/components/PriceSourceNote.vue'
import TermTip from '@/shared/components/TermTip.vue'
import TickerBadge from '@/shared/components/TickerBadge.vue'
import ToggleGroup from '@/shared/components/ToggleGroup.vue'
import WordChips from '@/shared/components/WordChips.vue'
import { useScenario } from '@/shared/composables/useScenario'
import { useViewport } from '@/shared/composables/useViewport'
import { getFund, meta } from '@/shared/data'
import { fill } from '@/shared/copy'
import { formatDate, formatMoney, formatQuantity } from '@/shared/format'
import { colors } from '@/shared/tokens/tokens'
import copy from './copy.json'

const C = copy.chart
const route = useRoute()
const { account, activity } = useScenario()
const { isPhone } = useViewport()
const fund = computed(() => getFund(String(route.params.ticker)))
const holding = computed(() => account.value.holdings.find((h) => h.ticker === fund.value?.ticker))
const firstBuy = computed(() => activity.value.find((a) => a.type === 'buy' && a.ticker === fund.value?.ticker)?.date)

type Range = 'since' | '6m' | '1y'
const rangeOptions = computed(() => [
  ...(firstBuy.value ? [{ id: 'since' as Range, label: C.since }] : []),
  { id: '6m' as Range, label: C['6m'] },
  { id: '1y' as Range, label: C['1y'] },
])
const range = ref<Range>('1y')
watch(firstBuy, (d) => (range.value = d ? 'since' : '1y'), { immediate: true })

const withYear = (iso: string) => `${formatDate(iso)}, ${iso.slice(0, 4)}`
const monthsBack = (iso: string, n: number) => {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCMonth(d.getUTCMonth() - n)
  return d.toISOString().slice(0, 10)
}
const points = computed(() => {
  const f = fund.value
  if (!f) return []
  if (range.value === 'since') return f.history.daily.filter((d) => d.date >= firstBuy.value!)
  if (range.value === '6m') return f.history.daily.filter((d) => d.date > monthsBack(meta.lastClose, 6))
  return f.history.weekly
})
const summary = computed(() => {
  const p = points.value, a = p[0], b = p.at(-1)
  return a && b ? fill(C.summary, { from: withYear(a.date), to: withYear(b.date), start: formatMoney(a.close), end: formatMoney(b.close) }) : ''
})
const labels = computed(() => points.value.map((p) => withYear(p.date)))
const series = computed(() => [{ label: C.series, data: points.value.map((p) => p.close), color: colors.forest }])
const describe = (i: number) => {
  const p = points.value[i]
  return p ? fill(C.day, { date: withYear(p.date), price: formatMoney(p.close) }) : ''
}
const rows = computed(() => points.value.map((p) => ({ date: withYear(p.date), price: formatMoney(p.close) })))

const KIND = copy.kind
const D = copy.dividends
const received = computed(() =>
  activity.value.filter((a) => a.type === 'dividend' && a.ticker === fund.value?.ticker).reduce((s, a) => s + a.amount, 0),
)
// Crypto is owned as an amount of coins, not shares, so its page doesn't list "Share".
const words = computed(() => [
  'ups-and-downs', ...(fund.value?.kind === 'crypto' ? [] : ['share']), 'price',
  ...(fund.value?.dividends.length ? ['dividend', 'ex-dividend-date'] : []),
  ...(fund.value?.kind === 'crypto' ? ['crypto', 'sipc-protection'] : ['stock']),
])
</script>

<template>
  <div class="fund">
    <RouterLink to="/funds" class="fund__back"><span class="mdi mdi-arrow-left" aria-hidden="true" /> {{ copy.allFunds }}</RouterLink>
    <template v-if="fund">
      <h1 class="fund__title"><TickerBadge :ticker="fund.ticker" :kind="fund.kind" class="fund__badge" /> {{ fund.name }}</h1>
      <p class="fund__name">{{ fill(copy.nameLine, { kind: KIND[fund.kind] }) }}</p>

      <section class="fund__card" :aria-label="copy.whatYouHave">
        <template v-if="holding">
          <p class="fund__value fl-tabular"><Money :amount="holding.value" /></p>
          <p class="fund__line"><CopyText :text="copy.vsPaid" :values="{ paid: formatMoney(holding.costBasis) }"><template #change><Money :amount="holding.gainLoss" change capitalize /></template></CopyText></p>
          <p v-if="holding.gainLoss < 0" class="fund__line fund__loss-note">{{ copy.lossNote }}</p>
          <dl class="fund__facts">
            <div><dt>{{ copy.facts.value }}</dt><dd class="fl-tabular">{{ formatMoney(holding.value) }}</dd></div>
            <div><dt>{{ copy.facts.paid }}</dt><dd class="fl-tabular">{{ formatMoney(holding.costBasis) }}</dd></div>
            <div v-if="holding.kind === 'crypto'"><dt>{{ copy.facts.amount }}</dt><dd class="fl-tabular">{{ formatQuantity(holding.shares, 'crypto', holding.ticker) }}</dd></div>
            <div v-else><dt><TermTip id="share">{{ copy.facts.shares }}</TermTip></dt><dd class="fl-tabular">{{ formatQuantity(holding.shares, 'stock', holding.ticker) }}</dd></div>
            <div><dt><TermTip id="price">{{ copy.facts.price }}</TermTip></dt><dd class="fl-tabular">{{ formatMoney(holding.price) }}</dd></div>
          </dl>
        </template>
        <template v-else>
          <p class="fund__line">{{ copy.notOwnedYet }}</p>
          <p class="fund__line">{{ fill(fund.kind === 'crypto' ? copy.priceNowCrypto : copy.priceNow, { price: formatMoney(fund.latestPrice), ticker: fund.ticker }) }}</p>
        </template>
      </section>

      <div class="fund__card">
        <ChartFrame :title="C.title" :summary="summary" :columns="[{ key: 'date', label: C.colDate }, { key: 'price', label: C.colPrice, numeric: true }]" :rows="rows">
          <template #controls><ToggleGroup v-model="range" :label="C.range" :options="rangeOptions" /></template>
          <SeriesChart :labels="labels" :series="series" :describe="describe" :label="C.title" :height="isPhone ? 180 : 260" />
        </ChartFrame>
        <PriceSourceNote :kinds="[fund.kind]" />
      </div>

      <section class="fund__card" aria-labelledby="fund-about">
        <h2 id="fund-about" class="fund__h">{{ copy.about.heading }}</h2>
        <p class="fund__line">{{ fund.about }}</p>
      </section>

      <section class="fund__card" aria-labelledby="fund-ups">
        <h2 id="fund-ups" class="fund__h"><CopyText :text="copy.ups.heading" :values="{ rating: fund.upsAndDowns }"><template #term><TermTip id="ups-and-downs">{{ copy.ups.termWord }}</TermTip></template></CopyText></h2>
        <p class="fund__line">{{ copy.ups.scale }}</p>
      </section>

      <section v-if="fund.kind === 'stock'" class="fund__card" aria-labelledby="fund-div">
        <h2 id="fund-div" class="fund__h">{{ D.heading }}</h2>
        <template v-if="fund.dividends.length">
          <p class="fund__line"><CopyText :text="D.intro" :values="{ name: fund.name }"><template #dividend><TermTip id="dividend">{{ D.dividendWord }}</TermTip></template><template #exDate><TermTip id="ex-dividend-date">{{ D.exDateWord }}</TermTip></template></CopyText></p>
          <ul class="fund__divs">
            <li v-for="d in fund.dividends" :key="d.exDate" class="fl-tabular">
              {{ fill(d.payDate <= meta.lastClose ? D.paid : D.upcoming, { amount: formatMoney(d.perShare), date: withYear(d.payDate) }) }}
            </li>
          </ul>
          <p v-if="received > 0" class="fund__line">{{ fill(D.yours, { amount: formatMoney(received) }) }}</p>
        </template>
        <p v-else class="fund__line">{{ D.none }}</p>
      </section>

      <section v-if="fund.kind === 'crypto'" class="fund__card" aria-labelledby="fund-sipc">
        <h2 id="fund-sipc" class="fund__h"><CopyText :text="copy.sipc.heading"><template #term><TermTip id="sipc-protection">{{ copy.sipc.termWord }}</TermTip></template></CopyText></h2>
        <p class="fund__line">{{ copy.sipc.body }}</p>
      </section>
      <!-- On a phone, the page's words are also 48px chips (P303 brief). -->
      <WordChips v-if="isPhone" :ids="words" />
    </template>
    <template v-else>
      <h1>{{ copy.notFound }}</h1>
    </template>
  </div>
</template>

<style scoped>
.fund {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
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

.fund__title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.fund__badge {
  font-size: 1rem;
}

.fund__divs {
  margin: 8px 0 0;
  padding-left: 20px;
  line-height: 1.8;
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
  flex-wrap: wrap; /* with large text a long amount moves under its label */
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
  margin: 0 0 0 auto;
  overflow-wrap: anywhere;
  font-weight: 600;
}
</style>
