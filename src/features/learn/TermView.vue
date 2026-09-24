<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PagePlaceholder from '@/shared/components/PagePlaceholder.vue'
import { useGlossary } from '@/shared/composables/useGlossary'

const route = useRoute()
const { getTerm } = useGlossary()
const term = computed(() => getTerm(String(route.params.termId)))
</script>

<template>
  <PagePlaceholder :title="term ? term.term : 'Words to know'" />
</template>
