<script setup lang="ts">
// A general line chart: one or more series over the same labels (prices, the
// friends' savings, the time machine). Read out in words on hover, tap or with the
// arrow keys; the parent's table shows the same series.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ActiveDataPoint, ChartDataset } from 'chart.js'
import { Chart } from './register'
import { formatMoney } from '../format'

export interface Series {
  label: string
  data: (number | null)[]
  color: string
  width?: number
  dash?: number[]
}

const props = withDefaults(
  defineProps<{
    labels: string[]
    series: Series[]
    /** Plain name of the chart, for screen readers. */
    label: string
    /** One sentence for point i, e.g. "Age 40: Nia $62,000. Theo $31,000." */
    describe: (i: number) => string
    height?: number
    /** Label indexes to mark with a point (for example where Theo passes Nia). */
    marks?: { index: number; series: number; label: string }[]
  }>(),
  { height: 260, marks: () => [] },
)

const canvasEl = ref<HTMLCanvasElement | null>(null)
const active = ref<number | null>(null)
let chart: Chart | null = null

const readout = computed(() =>
  active.value === null ? 'Move across the chart, tap it, or use the arrow keys to read it.' : props.describe(active.value),
)

function datasets(): ChartDataset<'line'>[] {
  const sets: ChartDataset<'line'>[] = props.series.map((s) => ({
    label: s.label,
    data: s.data as number[],
    borderColor: s.color,
    borderWidth: s.width ?? 2.5,
    borderDash: s.dash,
    pointRadius: 0,
    pointHoverRadius: 5,
    fill: false,
    spanGaps: true,
  }))
  if (props.marks.length) {
    sets.push({
      label: 'Marks',
      data: props.labels.map((_, i) => {
        const m = props.marks.find((x) => x.index === i)
        return m ? (props.series[m.series]?.data[i] ?? null) : null
      }) as number[],
      showLine: false,
      pointRadius: 7,
      pointStyle: 'rectRot',
      pointBackgroundColor: '#7A5C00',
      pointBorderColor: '#15130F',
    })
  }
  return sets
}

function setActive(i: number | null) {
  active.value = i
  if (!chart) return
  const els: ActiveDataPoint[] = i === null ? [] : props.series.map((_, k) => ({ datasetIndex: k, index: i }))
  chart.setActiveElements(els)
  chart.tooltip?.setActiveElements(els, { x: 0, y: 0 })
  chart.update('none')
}

function build() {
  chart?.destroy()
  if (!canvasEl.value || !props.labels.length) return
  chart = new Chart(canvasEl.value, {
    type: 'line',
    data: { labels: props.labels, datasets: datasets() },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          filter: (item) => item.dataset.label !== 'Marks',
          callbacks: { label: (item) => `${item.dataset.label}: ${formatMoney(Number(item.raw))}` },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 7, maxRotation: 0 } },
        y: { grid: { color: 'rgba(79, 74, 64, 0.15)' }, ticks: { callback: (v) => formatMoney(Number(v)).replace('.00', '') } },
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
  const last = props.labels.length - 1
  const cur = active.value ?? last
  const next = e.key === 'ArrowRight' ? Math.min(last, cur + 1) : e.key === 'ArrowLeft' ? Math.max(0, cur - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : null
  if (next === null) return
  e.preventDefault()
  setActive(next)
}

onMounted(build)
watch(() => [props.labels, props.series, props.marks], build, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <div class="fl-series">
    <div
      class="fl-series__canvas"
      :style="{ height: `${height}px` }"
      tabindex="0"
      role="group"
      :aria-label="`${label}. Use the left and right arrow keys to read it.`"
      :data-series="JSON.stringify(series.map((s) => s.data))"
      @keydown="onKeydown"
      @mouseleave="active = null"
    >
      <canvas ref="canvasEl" role="img" :aria-label="label" />
    </div>
    <p class="fl-series__readout" aria-live="polite">{{ readout }}</p>
    <ul class="fl-series__key" aria-label="Chart key">
      <li v-for="s in series" :key="s.label">
        <span class="fl-series__swatch" :style="{ borderTopColor: s.color, borderTopStyle: s.dash ? 'dashed' : 'solid' }" aria-hidden="true" />{{ s.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.fl-series__canvas {
  position: relative;
}

.fl-series__readout {
  min-height: 3em;
  margin: 8px 0 0;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.fl-series__key {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
  color: var(--color-ink-muted);
}

.fl-series__key li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.fl-series__swatch {
  width: 22px;
  border-top-width: 3px;
}
</style>
