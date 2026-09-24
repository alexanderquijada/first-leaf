<script setup lang="ts">
// Home. From 600px it's P301's weekly review; under 600px it's P303's check-in.
import { useViewport } from '@/shared/composables/useViewport'
import DesktopHome from './DesktopHome.vue'
import PhoneHome from './PhoneHome.vue'

const { isPhone } = useViewport()
</script>

<template>
  <PhoneHome v-if="isPhone" />
  <DesktopHome v-else />
</template>
