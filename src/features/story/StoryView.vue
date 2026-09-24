<script setup lang="ts">
// Your money story (P302). The point of view comes from the data: each account's
// own version (checked by rule R1), or the general one when there is no history yet.
import { computed } from 'vue'
import PagePlaceholder from '@/shared/components/PagePlaceholder.vue'
import TermTip from '@/shared/components/TermTip.vue'
import { useScenario } from '@/shared/composables/useScenario'
import { story } from '@/shared/data'

const { account } = useScenario()
const pointOfView = computed(() => story.rosaStory[account.value.id]?.pointOfView ?? story.pointOfView)
</script>

<template>
  <PagePlaceholder title="Your money story">
    <p class="story__pov">{{ pointOfView }}</p>
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
