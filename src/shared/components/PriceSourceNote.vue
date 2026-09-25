<script setup lang="ts">
// Where a price comes from, shown the way real finance apps credit their data providers
// (ruling B, Phase 2.5): the stock data note next to stock prices, and CoinGecko's
// attribution next to crypto prices (their guide: "Powered by CoinGecko API", linked).
import { copy } from '@/shared/copy'
import CopyText from './CopyText.vue'

defineProps<{ kinds: ('stock' | 'crypto')[] }>()
const N = copy.dataNotes
</script>

<template>
  <div class="fl-source">
    <p v-if="kinds.includes('stock')" class="fl-source__line">{{ N.stock }}</p>
    <p v-if="kinds.includes('crypto')" class="fl-source__line">
      <CopyText :text="N.crypto"
        ><template #link
          ><a :href="N.cryptoUrl" target="_blank" rel="noopener">{{ N.cryptoLink }}<span class="fl-visually-hidden">{{ N.newTab }}</span></a></template
        ></CopyText
      >
    </p>
  </div>
</template>

<style scoped>
.fl-source {
  display: grid;
  gap: 2px;
  margin: 8px 0 0;
}

.fl-source__line {
  margin: 0;
  color: var(--color-ink-muted);
  font-family: var(--font-ui);
  font-size: 0.875rem;
  line-height: var(--fl-body-leading);
}

.fl-source__line a {
  display: inline-block;
  min-height: 24px;
  color: var(--color-forest);
}

/* P303: the credit's link stands alone on its line, so it gets a 48px target. */
@media (max-width: 599px) {
  .fl-source__line a {
    display: inline-flex;
    align-items: center;
    min-height: 48px;
  }
}
</style>
