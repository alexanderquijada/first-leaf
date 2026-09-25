<script setup lang="ts">
// Balance over time. Optional layers: "What you put in" (flat) under "What it earned"
// (between put-in and the balance). Values are read out in words on hover, tap, or
// with the arrow keys. The chart's numbers are the same series the table shows.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ActiveDataPoint, ChartDataset } from 'chart.js'
import { Chart, grainPattern } from './register'
import { colors } from '../tokens/tokens'
import { formatChange, formatDate, formatMoney } from '../format'
import { copy, fill } from '../copy'

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
  const day = fill(copy.chart.dayReadout, { date: formatDate(p.date), balance: formatMoney(p.balance), moneyIn: formatMoney(p.moneyIn), change: formatChange(diff) })
  return ev ? `${day} ${ev}` : day
}
const readout = computed(() =>
  active.value === null
    ? copy.chart.readHint
    : sentence(active.value),
)

function datasets(): ChartDataset<'line'>[] {
  const balance = props.points.map((p) => p.balance)
  const moneyIn = props.points.map((p) => p.moneyIn)
  const sets: ChartDataset<'line'>[] = []
  if (props.layers) {
    sets.push({
      label: copy.chart.putIn,
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
    label: copy.chart.balance,
    data: balance,
    borderColor: colors.forest,
    borderWidth: 3,
    backgroundColor: 'rgba(39, 107, 67, 0.28)',
    // "What it earned" is grain over the flat "what you put in"; below it (a loss) stays a flat tint.
    fill: props.layers ? { target: '-1', above: earnedFill(), below: 'rgba(168, 67, 30, 0.22)' } : false,
    // A lone point has no line to draw, so it shows as a dot.
    pointRadius: balance.length === 1 ? 5 : 0,
    pointHoverRadius: 5,
    // The one line to read first glows (BRIEF.md §6).
    glow: 'rgba(198, 243, 107, 0.95)',
  } as ChartDataset<'line'>)
  if (props.events.length) {
    sets.push({
      label: copy.chart.events,
      // Markers alternate above and below the line, so events on neighboring days (a low on a
      // Friday, a pause on the Monday) sit visibly apart even on a phone.
      data: eventData(),
      showLine: false,
      pointRadius: 7,
      pointHoverRadius: 8,
      pointStyle: 'rectRot',
      pointBackgroundColor: colors.mustard,
      pointBorderColor: colors.ink,
      borderColor: colors.ink,
      // Drawn last, on top of the filled areas, so a marker below the line is never hidden.
      order: -1,
    })
  }
  return sets
}

function earnedFill(): CanvasPattern | string {
  const ctx = canvasEl.value?.getContext('2d')
  return ctx ? grainPattern(ctx, 'rgba(39, 107, 67, 0.26)', 'rgba(31, 92, 59, 0.9)') : 'rgba(39, 107, 67, 0.28)'
}

function eventData(): (number | null)[] {
  const vals = props.points.map((p) => p.balance)
  const step = (Math.max(...vals) - Math.min(...vals)) * 0.07
  let n = 0
  return props.points.map((p) => (eventAt.value.has(p.date) ? p.balance + (n++ % 2 === 0 ? step : -step) : null))
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

function showTick(i: number) {
  const last = props.points.length - 1
  const step = Math.max(1, Math.ceil(last / 5))
  return i === last || (i % step === 0 && last - i >= step / 2)
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
          filter: (item) => item.dataset.label !== copy.chart.events,
          callbacks: { label: (item) => fill(copy.chart.tooltip, { series: item.dataset.label ?? '', value: formatMoney(Number(item.raw)) }) },
        },
      },
      scales: {
        // About 6 labels, always ending on the last date, so the axis ends where the data does.
        x: { display: !props.compact, grid: { display: false }, ticks: { autoSkip: false, maxRotation: 0, callback: (_v, i) => (showTick(i) ? formatDate(props.points[i]!.date) : '') } },
        y: {
          display: !props.compact,
          // Stacked areas ("put in" under "earned") start at zero, or the layers mislead;
          // a single balance line may start near its data.
          beginAtZero: props.layers,
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
  requestAnimationFrame(() => {
    if (canvasEl.value && chart) {
      canvasEl.value.dataset.yMin = String(chart.scales.y?.min ?? '')
      const last = [...(chart.scales.x?.ticks ?? [])].reverse().find((t) => t.label !== '')
      canvasEl.value.dataset.xLast = String(last?.label ?? '')
    }
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
      :aria-label="fill(copy.chart.keyboardDays, { label })"
      :data-series="JSON.stringify(points.map((p) => p.balance))"
      @keydown="onKeydown"
      @mouseleave="active = null"
    >
      <canvas ref="canvasEl" role="img" :aria-label="label" />
    </div>
    <p v-if="!compact" class="fl-balchart__readout" aria-live="polite">{{ readout }}</p>
    <ul v-if="layers && !compact" class="fl-balchart__key" :aria-label="copy.chart.key">
      <li><span class="fl-balchart__swatch is-in" aria-hidden="true" />{{ copy.chart.putIn }}</li>
      <li><span class="fl-balchart__swatch is-earned" aria-hidden="true" />{{ copy.chart.earned }}</li>
      <li v-if="events.length"><span class="fl-balchart__swatch is-event" aria-hidden="true" />{{ copy.chart.events }}</li>
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
  line-height: var(--fl-body-leading);
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
  background-color: rgba(39, 107, 67, 0.26);
  background-image: radial-gradient(rgba(31, 92, 59, 0.9) 0.8px, transparent 1px);
  background-size: 4px 4px;
  border: 2px solid var(--color-forest);
}

.fl-balchart__swatch.is-event {
  background: var(--color-mustard);
  transform: rotate(45deg) scale(0.8);
  border: 1px solid var(--color-ink);
}
</style>
