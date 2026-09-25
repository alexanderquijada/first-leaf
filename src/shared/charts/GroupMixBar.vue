<script setup lang="ts">
// Where the money is, in three groups (BRIEF.md §6): stocks, crypto and cash. Seven holding
// colors can't be told apart under color blindness, so charts show these three groups, each in
// its tested color AND its own pattern (stripes, dots, lines), on the dark panel where every
// color passes 3:1. Per-holding detail stays in the tables and lists beside it.
import { computed, useId } from 'vue'
import { copy, fill } from '../copy'
import { formatMoney } from '../format'
import { chartColors, colors } from '../tokens/tokens'

export type Group = 'stocks' | 'crypto' | 'cash'
const props = defineProps<{ parts: { group: Group; value: number }[] }>()
const G = copy.mixGroups
const id = `fl-gm-${useId()}`
const total = computed(() => props.parts.reduce((s, p) => s + p.value, 0))
const shown = computed(() =>
  (['stocks', 'crypto', 'cash'] as Group[])
    .map((g) => ({ group: g, value: props.parts.filter((p) => p.group === g).reduce((s, p) => s + p.value, 0) }))
    .filter((p) => p.value > 0)
    .map((p) => ({ ...p, pct: total.value ? Math.round((p.value / total.value) * 100) : 0 })),
)
// Bar segments in percent of the width, with a 1% gap between them.
const segs = computed(() => {
  let x = 0
  const gap = 1, room = 100 - gap * (shown.value.length - 1)
  return shown.value.map((p) => {
    const w = total.value ? (p.value / total.value) * room : 0
    const s = { ...p, x, w }
    x += w + gap
    return s
  })
})
const summary = computed(() => fill(G.summary, { list: shown.value.map((p) => fill(G.part, { name: G[p.group], pct: p.pct })).join(', ') }))
const fillOf = (g: Group) => `url(#${id}-${g})`
</script>

<template>
  <figure class="fl-gm fl-panel">
    <p class="fl-gm__summary">{{ summary }}</p>
    <svg class="fl-gm__bar" viewBox="0 0 100 10" preserveAspectRatio="none" role="img" :aria-label="summary">
      <defs>
        <pattern :id="`${id}-stocks`" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="2" height="2" :fill="chartColors.stocks" />
          <rect width="0.5" height="2" :fill="colors.panel" opacity="0.55" />
        </pattern>
        <pattern :id="`${id}-crypto`" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect width="2" height="2" :fill="chartColors.crypto" />
          <circle cx="1" cy="1" r="0.45" :fill="colors.panel" opacity="0.6" />
        </pattern>
        <pattern :id="`${id}-cash`" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect width="2" height="2" :fill="chartColors.cash" />
          <rect y="0.8" width="2" height="0.4" :fill="colors.panel" opacity="0.45" />
        </pattern>
      </defs>
      <rect v-for="s in segs" :key="s.group" :x="s.x" y="0" :width="s.w" height="10" rx="1" :fill="fillOf(s.group)" />
    </svg>
    <figcaption class="fl-gm__key">
      <span v-for="p in shown" :key="p.group" class="fl-gm__item">
        <svg class="fl-gm__swatch" viewBox="0 0 10 10" aria-hidden="true"><rect width="10" height="10" rx="2" :fill="fillOf(p.group)" /></svg>
        <span>{{ G[p.group] }}</span>
        <span class="fl-gm__num fl-tabular">{{ fill(G.part, { name: '', pct: p.pct }).trim() }} · {{ formatMoney(p.value) }}</span>
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.fl-gm {
  margin: 0;
  padding: 16px;
  border-radius: 12px;
  background: var(--color-panel);
  color: var(--color-on-panel);
}

.fl-gm__summary {
  margin: 0 0 10px;
  color: var(--color-paper);
  font-size: 0.9375rem;
  line-height: var(--fl-body-leading);
}

.fl-gm__bar {
  display: block;
  width: 100%;
  height: 28px;
}

.fl-gm__key {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-top: 12px;
  font-size: 0.875rem;
}

.fl-gm__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.fl-gm__swatch {
  width: 16px;
  height: 16px;
}

.fl-gm__num {
  color: var(--color-paper);
}
</style>
