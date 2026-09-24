<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PagePlaceholder from '@/shared/components/PagePlaceholder.vue'
import { getFund } from '@/shared/data'

const route = useRoute()
const fund = computed(() => getFund(String(route.params.ticker)))
</script>

<template>
  <PagePlaceholder :title="fund ? fund.ticker : 'Your funds'" />
</template>
