<script setup lang="ts">
// Your money story (P302). The six chapters are built in Phase 1.
// The point of view is stated on screen. Its "right now" half is only shown when
// it is true for the current demo account (rule R1 checks it in Phase 1).
import { computed } from 'vue'
import PagePlaceholder from '@/shared/components/PagePlaceholder.vue'
import TermTip from '@/shared/components/TermTip.vue'
import { useScenario } from '@/shared/composables/useScenario'

const { account } = useScenario()

const mostlyDeposits = computed(
  () => account.value.balance > 0 && account.value.moneyIn / account.value.balance >= 0.9,
)
</script>

<template>
  <PagePlaceholder title="Your money story">
    <p class="story__pov">
      <template v-if="mostlyDeposits">Right now, almost all of Rosa's balance is money she put in. </template>Growth needs years, so starting early and staying steady matter more than picking the perfect moment.
    </p>
    <p>
      The story ends by naming the idea behind it:
      <TermTip id="compound-growth">growth on growth</TermTip>.
    </p>
  </PagePlaceholder>
</template>

<style scoped>
.story__pov {
  margin: 24px 0 0;
  font-family: var(--font-text);
  font-size: 1.375rem;
  line-height: 1.5;
}
</style>
