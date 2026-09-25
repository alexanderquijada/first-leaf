<script setup lang="ts">
// A small scene for empty and calm states: an Open Peeps person (CC0, by Pablo Stanley,
// openpeeps.com; see docs/CREDITS.md) with a mid-century shape drawn in code. Decorative.
import sittingCalm from './open-peeps/peep-sitting-4.svg?url'
import standingWave from './open-peeps/peep-standing-5.svg?url'
import sittingRead from './open-peeps/peep-sitting-7.svg?url'
import standingLost from './open-peeps/peep-standing-12.svg?url'
import Starburst from './Starburst.vue'
import Boomerang from './Boomerang.vue'
import AtomicDots from './AtomicDots.vue'

const props = withDefaults(defineProps<{ scene: 'calm' | 'welcome' | 'empty' | 'lost'; size?: number }>(), { size: 120 })
const PEEP = { calm: sittingCalm, welcome: standingWave, empty: sittingRead, lost: standingLost }
</script>

<template>
  <div class="fl-scene" :style="{ height: `${props.size}px` }" aria-hidden="true">
    <Starburst v-if="scene === 'calm'" class="fl-scene__shape" :size="size * 0.55" color="var(--color-lime)" />
    <Boomerang v-else-if="scene === 'welcome'" class="fl-scene__shape" :size="size * 0.7" color="var(--color-mint)" />
    <AtomicDots v-else class="fl-scene__shape" :size="size * 0.6" color="var(--color-mint)" />
    <img class="fl-scene__peep" :src="PEEP[scene]" alt="" :height="size" />
  </div>
</template>

<style scoped>
.fl-scene {
  position: relative;
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
}

.fl-scene__shape {
  position: absolute;
  top: 0;
  right: -12%;
}

.fl-scene__peep {
  position: relative;
  height: 100%;
  width: auto;
}
</style>
