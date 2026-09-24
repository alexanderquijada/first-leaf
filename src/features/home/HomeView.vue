<script setup lang="ts">
// Home. From 600px it's P301's weekly review; under 600px it's P303's check-in.
import PagePlaceholder from '@/shared/components/PagePlaceholder.vue'
import { useViewport } from '@/shared/composables/useViewport'
import DesktopHome from './DesktopHome.vue'

const { isPhone } = useViewport()
</script>

<template>
  <PagePlaceholder v-if="isPhone" title="Home" />
  <DesktopHome v-else />
</template>
