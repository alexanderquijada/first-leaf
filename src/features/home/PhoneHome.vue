<script setup lang="ts">
// Home under 600px (P303's 60-second check-in): balance and this week, a small
// balance chart, what needs you, why it moved (opens in place), the latest three
// transactions and the word of the day. Everything else is one tap away.
import { computed, ref } from 'vue'
import { describeActivity, type Row } from '@/shared/activityText'
import Money from '@/shared/components/Money.vue'
import SeverityBadge from '@/shared/components/SeverityBadge.vue'
import TermTip from '@/shared/components/TermTip.vue'
import WordChips from '@/shared/components/WordChips.vue'
import { useGlossary } from '@/shared/composables/useGlossary'
import { useHandled } from '@/shared/composables/useHandled'
import { useScenario } from '@/shared/composables/useScenario'
import { useSession } from '@/shared/composables/useSession'
import { meta } from '@/shared/data'
import { formatChange, formatDate, formatMoney, formatSigned } from '@/shared/format'
import CopyText from '@/shared/components/CopyText.vue'
import { fill } from '@/shared/copy'
import BalanceOverTime from './BalanceOverTime.vue'
import copy from './copy.json'
import WelcomeCard from './WelcomeCard.vue'
import Starburst from '@/shared/illustrations/Starburst.vue'

const { account, activity } = useScenario()
const { open } = useHandled()
const { pendingDeposits, isSeen } = useSession()
const { glossary } = useGlossary()
const P = copy.phone

const needsYou = computed(() => open.value.filter((a) => a.severity === 'needs-you'))
const headsUps = computed(() => open.value.filter((a) => a.severity === 'heads-up'))
const fyi = computed(() => open.value.filter((a) => a.severity === 'fyi'))
const top = computed(() => needsYou.value[0] ?? headsUps.value[0])
const restHeadsUps = computed(() => headsUps.value.filter((a) => a !== top.value).length)

// Why it moved
const w = computed(() => account.value.weeklyChange)
const whyOpen = ref(false)
const fundOpen = ref<string | null>(null)
// "Why it moved" in one line: each piece is its own sentence, and a $0.00 piece is left out (ruling 6).
const whyShort = computed(() => {
  const w = account.value.weeklyChange
  if (!w) return ''
  return [
    w.marketChange !== 0 ? fill(P.whyMarket, { market: formatChange(w.marketChange) }) : '',
    w.dividends !== 0 ? fill(P.whyDividends, { dividends: formatChange(w.dividends) }) : '',
    w.deposits !== 0 ? fill(P.whyDeposits, { deposits: formatChange(w.deposits) }) : '',
  ].filter(Boolean).join(' ')
})
const anyDown = computed(() => w.value?.byFund.some((f) => f.change < 0) ?? false)

// Latest three: this session's pending deposits first, then the newest activity.
const latest = computed<Row[]>(() => [...[...pendingDeposits.value].reverse(), ...[...activity.value].reverse()].slice(0, 3))

// Word of the day, then Next word in glossary order.
const wordIndex = ref(Math.max(0, glossary.findIndex((g) => g.id === meta.wordOfTheDay)))
const word = computed(() => glossary[wordIndex.value]!)
function nextWord() {
  wordIndex.value = (wordIndex.value + 1) % glossary.length
}
</script>

<template>
  <div class="phome">
    <h1 class="fl-visually-hidden">{{ copy.title }}</h1>

    <template v-if="account.history.length">
      <section class="phome__balance" :aria-label="copy.balance.label">
        <p class="phome__label"><TermTip id="balance">{{ copy.balance.label }}</TermTip></p>
        <p class="phome__big fl-tabular"><Money :amount="account.balance" /></p>
        <p v-if="w" class="phome__week"><CopyText :text="P.weekChange"><template #change><Money :amount="w.totalChange" change capitalize /></template></CopyText></p>
      </section>

      <section class="fl-panel phome__needs" aria-labelledby="phome-needs">
        <h2 id="phome-needs" class="phome__needs-title">
          <template v-if="needsYou.length">{{ needsYou.length === 1 ? P.needsOne : fill(P.needsMany, { count: needsYou.length }) }}</template>
          <template v-else-if="headsUps.length">{{ headsUps.length === 1 ? P.headsUpOne : fill(P.headsUpMany, { count: headsUps.length }) }}</template>
          <template v-else><Starburst :size="26" color="var(--color-lime)" class="phome__sun" />{{ P.nothing }}</template>
        </h2>
        <RouterLink v-if="top" :to="`/alerts/${top.id}`" class="phome__top">
          <SeverityBadge :severity="top.severity" />
          <span class="phome__top-text">{{ top.title }}</span>
          <span v-if="isSeen(top.id)" class="phome__seen">{{ P.seen }}</span>
          <span class="mdi mdi-chevron-right" aria-hidden="true" />
        </RouterLink>
        <RouterLink v-if="top && restHeadsUps" to="/alerts" class="phome__more">
          {{ restHeadsUps === 1 ? P.seeHeadsUpOne : fill(P.seeHeadsUpMany, { count: restHeadsUps }) }}
          <span class="mdi mdi-chevron-right" aria-hidden="true" />
        </RouterLink>
        <template v-if="!top && fyi.length">
          <h3 class="phome__fyi-title">{{ P.fyiTitle }}</h3>
          <RouterLink v-for="a in fyi" :key="a.id" :to="`/alerts/${a.id}`" class="phome__top">
            <SeverityBadge :severity="a.severity" />
            <span class="phome__top-text">{{ a.title }}</span>
            <span class="mdi mdi-chevron-right" aria-hidden="true" />
          </RouterLink>
        </template>
      </section>

      <section v-if="w" class="phome__card phome__why" aria-labelledby="phome-why">
        <h2 id="phome-why" class="phome__h">
          <button
            type="button"
            class="phome__why-btn"
            :aria-expanded="whyOpen ? 'true' : 'false'"
            aria-controls="phome-why-body"
            @click="whyOpen = !whyOpen"
          >
            <span>{{ P.whyTitle }}</span>
            <span class="mdi" :class="whyOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" aria-hidden="true" />
          </button>
        </h2>
        <p class="phome__why-short">
          {{ whyShort }}
        </p>
        <div v-if="whyOpen" id="phome-why-body">
          <table class="phome__table">
            <caption class="fl-visually-hidden">{{ copy.week.caption }}</caption>
            <tbody>
              <tr><th scope="row">{{ fill(copy.week.startBalance, { date: formatDate(w.from) }) }}</th><td class="fl-tabular">{{ formatMoney(w.startBalance) }}</td></tr>
              <!-- A piece that is $0.00 is left out (ruling 6, Sept. 25); what is shown still adds up. -->
              <tr v-if="w.marketChange !== 0">
                <th scope="row">{{ copy.week.market }}</th>
                <td class="fl-tabular"><span aria-hidden="true">{{ formatSigned(w.marketChange) }}</span><span class="fl-visually-hidden">{{ formatChange(w.marketChange) }}</span></td>
              </tr>
              <tr v-if="w.dividends !== 0">
                <th scope="row">{{ copy.week.dividends }}</th>
                <td class="fl-tabular"><span aria-hidden="true">{{ formatSigned(w.dividends) }}</span><span class="fl-visually-hidden">{{ formatChange(w.dividends) }}</span></td>
              </tr>
              <tr v-if="w.deposits !== 0">
                <th scope="row">{{ copy.week.deposits }}</th>
                <td class="fl-tabular"><span aria-hidden="true">{{ formatSigned(w.deposits) }}</span><span class="fl-visually-hidden">{{ formatChange(w.deposits) }}</span></td>
              </tr>
              <tr class="is-end"><th scope="row">{{ fill(copy.week.endBalance, { date: formatDate(w.to) }) }}</th><td class="fl-tabular">{{ formatMoney(w.endBalance) }}</td></tr>
            </tbody>
          </table>
          <h3 class="phome__h3">{{ P.byFundTitle }}</h3>
          <ul class="phome__funds">
            <li v-for="f in w.byFund" :key="f.ticker">
              <button
                type="button"
                class="phome__fund"
                :aria-expanded="fundOpen === f.ticker ? 'true' : 'false'"
                @click="fundOpen = fundOpen === f.ticker ? null : f.ticker"
              >
                <span class="phome__fund-name">{{ f.ticker }}</span>
                <span class="fl-tabular" :class="f.change < 0 ? 'is-down' : f.change > 0 ? 'is-up' : ''">
                  <span aria-hidden="true">{{ formatSigned(f.change) }}</span><span class="fl-visually-hidden">{{ formatChange(f.change) }}</span>
                </span>
              </button>
              <p v-if="fundOpen === f.ticker" class="phome__fund-more">
                {{ fill(w.marketChange >= 0 ? P.fundMoveUp : P.fundMoveDown, { ticker: f.ticker, change: formatChange(f.change), amount: formatMoney(Math.abs(w.marketChange)) }) }}
              </p>
            </li>
          </ul>
          <p v-if="anyDown" class="phome__note">{{ P.someDown }}</p>
          <RouterLink to="/funds" class="phome__link">{{ P.seeFunds }} <span class="mdi mdi-chevron-right" aria-hidden="true" /></RouterLink>
          <WordChips :ids="['the-market', 'dividend', 'deposit', 'ups-and-downs']" :heading-level="3" />
        </div>
      </section>

      <div class="phome__card phome__chart"><BalanceOverTime compact :title="copy.chart.phoneTitle" /></div>

      <section class="phome__card" aria-labelledby="phome-latest">
        <h2 id="phome-latest" class="phome__h">{{ P.latest }}</h2>
        <ul class="phome__latest">
          <li v-for="r in latest" :key="r.id">
            <span class="phome__latest-date">{{ formatDate(r.date) }}</span>
            <span class="phome__latest-what">{{ describeActivity(r).what }}<span v-if="describeActivity(r).status !== 'Completed'" class="phome__status">{{ fill(P.latestStatus, { status: describeActivity(r).label }) }}</span></span>
            <span class="fl-tabular">{{ formatMoney(r.amount) }}</span>
          </li>
        </ul>
        <RouterLink to="/activity" class="phome__link">{{ P.seeActivity }} <span class="mdi mdi-chevron-right" aria-hidden="true" /></RouterLink>
      </section>
    </template>
    <div v-else class="phome__card"><WelcomeCard /></div>

    <section class="phome__card phome__word" aria-labelledby="phome-word">
      <h2 id="phome-word" class="phome__h">{{ P.wordOfTheDay }}</h2>
      <p class="phome__word-term">{{ word.term }}</p>
      <p>{{ word.short }}</p>
      <div class="phome__word-actions">
        <TermTip :id="word.id" :key="word.id">{{ P.readMore }}<span class="fl-visually-hidden">{{ fill(P.readMoreAbout, { term: word.term }) }}</span></TermTip>
        <button type="button" class="phome__next" @click="nextWord">{{ P.nextWord }}</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.phome {
  display: grid;
  gap: 16px;
}

.phome__label {
  margin: 0;
  color: var(--color-ink-muted);
  font-weight: 600;
}

.phome__big {
  margin: 0;
  font-family: var(--font-display);
  font-size: 2.75rem;
  line-height: 1.1;
}

.phome__week {
  margin: 4px 0 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.phome__needs {
  padding: 16px;
  border-radius: 16px;
  background: var(--color-panel);
  color: var(--color-cream);
  --fl-term-underline: var(--color-lime);
}

.phome__sun {
  margin-right: 8px;
  vertical-align: -4px;
}

.phome__needs-title {
  font-size: 1.375rem;
}

.phome__top,
.phome__more {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  margin-top: 8px;
  padding: 8px 0;
  color: var(--color-cream);
  text-decoration: none;
  border-top: 1px solid rgb(185 199 190 / 0.35);
}

.phome__more {
  justify-content: space-between;
  color: var(--color-lime);
  font-weight: 600;
}

.phome__top-text {
  flex: 1;
  line-height: 1.4;
}

.phome__seen {
  padding: 2px 8px;
  border: 1px solid var(--color-on-panel);
  border-radius: 999px;
  font-size: 0.8125rem;
  color: var(--color-on-panel);
}

.phome__fyi-title {
  margin-top: 8px;
  font-size: 1rem;
  color: var(--color-on-panel);
}

.phome__card {
  padding: 16px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 16px;
  background: var(--color-paper);
}

.phome__h {
  font-size: 1.25rem;
}

.phome__h3 {
  margin-top: 16px;
  font-family: var(--font-ui);
  font-size: 1rem;
  font-weight: 700;
}

.phome__why-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 48px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.phome__why-short {
  margin: 4px 0 0;
}

.phome__table {
  width: 100%;
  margin-top: 12px;
  border-collapse: collapse;
}

.phome__table th,
.phome__table td {
  padding: 10px 0;
  border-bottom: 1px solid var(--color-mint);
  font-weight: 400;
  text-align: left;
}

.phome__table td {
  padding-left: 24px;
  text-align: right;
  white-space: nowrap;
}

.phome__table .is-end th,
.phome__table .is-end td {
  font-weight: 700;
  border-bottom: 0;
  border-top: 2px solid var(--color-ink-muted);
}

.phome__funds {
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
}

.phome__fund {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  width: 100%;
  min-height: 48px;
  padding: 0;
  border: 0;
  border-bottom: 1px solid var(--color-mint);
  background: none;
  color: var(--color-ink);
  font: inherit;
  cursor: pointer;
}

.phome__fund-name {
  font-weight: 600;
}

.is-up {
  color: var(--color-forest);
}

.is-down {
  color: var(--color-terracotta);
}

.phome__fund-more {
  margin: 8px 0;
}

.phome__note {
  margin: 12px 0 0;
}

.phome__link {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  min-height: 48px;
  font-weight: 600;
}

.phome__latest {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.phome__latest li {
  display: grid;
  grid-template-columns: 4.5em 1fr auto;
  gap: 12px;
  align-items: center;
  min-height: 48px;
  border-bottom: 1px solid var(--color-mint);
}

.phome__latest-date {
  color: var(--color-ink-muted);
}

.phome__status {
  font-weight: 700;
}

.phome__word-term {
  margin: 8px 0 0;
  font-family: var(--font-display);
  font-size: 1.5rem;
}

.phome__word p {
  margin: 4px 0 0;
}

.phome__word-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.phome__word-actions :deep(.fl-termtip__button),
.phome__next {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  min-width: 48px;
  padding: 0 16px;
  border: 1px solid var(--color-forest);
  border-radius: 24px;
  background: var(--color-paper);
  color: var(--color-forest);
  font: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.phome__next {
  background: var(--color-forest);
  color: var(--color-paper);
}
</style>
