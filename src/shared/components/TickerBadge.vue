<script setup lang="ts">
// A ticker in a badge. Company logos are trademarked artwork, so every investment is shown
// by its ticker instead (ruling B, Phase 2.5). Stocks and crypto differ by shape and color.
import type { AssetKind } from '@/shared/data'

defineProps<{ ticker: string; kind: AssetKind }>()
</script>

<template>
  <span class="fl-badge" :class="`is-${kind}`">{{ ticker }}</span>
</template>

<style scoped>
.fl-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.25em;
  padding: 2px 8px;
  border: 1px solid var(--color-forest);
  border-radius: 6px;
  background: var(--color-mint);
  color: var(--color-forest);
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.4;
}

.fl-badge.is-crypto {
  border-radius: 999px;
  border-color: var(--color-ink);
  background: var(--color-paper);
  color: var(--color-ink);
}
</style>
