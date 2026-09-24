<script setup lang="ts">
// Balance over time. Optional layers: "What you put in" (flat) under "What it earned"
// (between put-in and the balance). Values are read out in words on hover, tap, or
// with the arrow keys. The chart's numbers are the same series the table shows.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ActiveDataPoint, ChartDataset } from 'chart.js'
import { Chart } from './register'
import { colors } from '../tokens/tokens'
import { formatChange, formatDate, formatMoney } from '../format'

export interface BalancePoint {
  date: string
  balance: number
  moneyIn: number
}
export interface ChartEvent {
  date: string
  label: string
}

const props = withDefaults(
  defineProps<{
    points: BalancePoint[]
    /** Plain name of the chart, for screen readers. */
    label: string
    layers?: boolean
    events?: ChartEvent[]
    compact?: boolean
    height?: number
  }>(),
  { layers: true, events: () => [], compact: false, height: 280 },
)

const canvasEl = ref<HTMLCanvasElement | null>(null)
const active = ref<number | null>(null)
let chart: Chart | null = null

const eventAt = computed(() => new Map(props.events.map((e) => [e.date, e.label])))

function sentence(i: number): string {
  const p = props.points[i]
  if (!p) return ''
  const diff = p.balance - p.moneyIn
  const ev = eventAt.value.get(p.date)
  return `${formatDate(p.date)}: balance ${formatMoney(p.balance)}. You had put in ${formatMoney(p.moneyIn)}, so you were ${formatChange(diff)}.${ev ? ` ${ev}` : ''}`
}
const readout = computed(() =>
  active.value === null
    ? 'Move across the chart, tap it, or use the arrow keys to read each day.'
    : sentence(active.value),
)

function datasets(): ChartDataset<'line'>[] {
  const balance = props.points.map((p) => p.balance)
  const moneyIn = props.points.map((p) => p.moneyIn)
  const sets: ChartDataset<'line'>[] = []
  if (props.layers) {
    sets.push({
      label: 'What you put in',
      data: moneyIn,
      stepped: true,
      borderColor: colors.inkMuted,
      borderWidth: 2,
      backgroundColor: colors.mint,
      fill: 'origin',
      pointRadius: 0,
    })
  }
  sets.push({
    label: 'Balance',
    data: balance,
    borderColor: colors.forest,
    borderWidth: 3,
    backgroundColor: 'rgba(39, 107, 67, 0.28)',
    fill: props.layers ? { target: '-1', above: 'rgba(39, 107, 67, 0.28)', below: 'rgba(168, 67, 30, 0.22)' } : false,
    pointRadius: 0,
    pointHoverRadius: 5,
  })
  if (props.events.length) {
    sets.push({
      label: 'Events',
      data: props.points.map((p) => (eventAt.value.has(p.date) ? p.balance : null)) as number[],
      showLine: false,
      pointRadius: 7,
      pointHoverRadius: 8,
      pointStyle: 'rectRot',
      pointBackgroundColor: colors.mustard,
      pointBorderColor: colors.ink,
      borderColor: colors.ink,
    })
  }
  return sets
}

function setActive(i: number | null) {
  active.value = i
  if (!chart) return
  const balanceIndex = props.layers ? 1 : 0
  const els: ActiveDataPoint[] = i === null ? [] : [{ datasetIndex: balanceIndex, index: i }]
  chart.setActiveElements(els)
  chart.tooltip?.setActiveElements(els, { x: 0, y: 0 })
  chart.update('none')
}

function build() {
  chart?.destroy()
  if (!canvasEl.value || !props.points.length) return
  chart = new Chart(canvasEl.value, {
    type: 'line',
    data: { labels: props.points.map((p) => formatDate(p.date)), datasets: datasets() },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: !props.compact,
          filter: (item) => item.dataset.label !== 'Events',
          callbacks: { label: (item) => `${item.dataset.label}: ${formatMoney(Number(item.raw))}` },
        },
      },
      scales: {
        x: { display: !props.compact, grid: { display: false }, ticks: { maxTicksLimit: 6, maxRotation: 0 } },
        y: {
          display: !props.compact,
          beginAtZero: false,
          grid: { color: 'rgba(79, 74, 64, 0.15)' },
          ticks: { callback: (v) => formatMoney(Number(v)).replace('.00', '') },
        },
      },
      onHover: (_e, els) => {
        if (els.length) active.value = els[0]!.index
      },
      onClick: (_e, els) => {
        if (els.length) setActive(els[0]!.index)
      },
    },
  })
}

function onKeydown(e: KeyboardEvent) {
  const last = props.points.length - 1
  const cur = active.value ?? last
  let next: number | null = null
  if (e.key === 'ArrowRight') next = Math.min(last, cur + 1)
  else if (e.key === 'ArrowLeft') next = Math.max(0, cur - 1)
  else if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = last
  if (next === null) return
  e.preventDefault()
  setActive(next)
}

onMounted(build)
watch(() => [props.points, props.layers, props.events], build, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <div class="fl-balchart" :class="{ 'is-compact': compact }">
    <div
      class="fl-balchart__canvas"
      :style="{ height: `${height}px` }"
      tabindex="0"
      role="group"
      :aria-label="`${label}. Use the left and right arrow keys to read each day.`"
      :data-series="JSON.stringify(points.map((p) => p.balance))"
      @keydown="onKeydown"
      @mouseleave="active = null"
    >
      <canvas ref="canvasEl" role="img" :aria-label="label" />
    </div>
    <p v-if="!compact" class="fl-balchart__readout" aria-live="polite">{{ readout }}</p>
    <ul v-if="layers && !compact" class="fl-balchart__key" aria-label="Chart key">
      <li><span class="fl-balchart__swatch is-in" aria-hidden="true" />What you put in</li>
      <li><span class="fl-balchart__swatch is-earned" aria-hidden="true" />What it earned</li>
      <li v-if="events.length"><span class="fl-balchart__swatch is-event" aria-hidden="true" />Events</li>
    </ul>
  </div>
</template>

<style scoped>
.fl-balchart__canvas {
  position: relative;
  border-radius: 8px;
}

.fl-balchart__readout {
  min-height: 3em;
  margin: 8px 0 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--color-ink);
}

.fl-balchart__key {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
  color: var(--color-ink-muted);
}

.fl-balchart__key li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.fl-balchart__swatch {
  width: 14px;
  height: 14px;
  border-radius: 3px;
}

.fl-balchart__swatch.is-in {
  background: var(--color-mint);
  border: 2px solid var(--color-ink-muted);
}

.fl-balchart__swatch.is-earned {
  background: rgba(39, 107, 67, 0.28);
  border: 2px solid var(--color-forest);
}

.fl-balchart__swatch.is-event {
  background: var(--color-mustard);
  transform: rotate(45deg) scale(0.8);
  border: 1px solid var(--color-ink);
}
</style>
