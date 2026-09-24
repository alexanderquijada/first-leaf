<script setup lang="ts">
// Alerts (/alerts and /alerts/:id). On a laptop: two panes, the list beside the
// open alert. Narrower: the list, or one alert as its own page.
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AlertList from '@/shared/components/AlertList.vue'
import WordChips from '@/shared/components/WordChips.vue'
import { useScenario } from '@/shared/composables/useScenario'
import { useViewport } from '@/shared/composables/useViewport'
import AlertDetail from './AlertDetail.vue'
import copy from './copy.json'

const route = useRoute()
const { attention } = useScenario()
const { isDesktop, isPhone } = useViewport()

const id = computed(() => (route.params.id ? String(route.params.id) : undefined))
const alert = computed(() => attention.value.find((a) => a.id === id.value))
</script>

<template>
  <div class="alerts" :class="{ 'is-two': isDesktop }">
    <template v-if="isDesktop">
      <h1 class="fl-visually-hidden">{{ copy.title }}</h1>
      <div class="alerts__list"><AlertList :selected-id="id" /></div>
      <div class="alerts__detail">
        <AlertDetail v-if="alert" :key="alert.id" :alert="alert" />
        <div v-else-if="id" class="alerts__missing">
          <h2>{{ copy.notFound }}</h2>
          <p>{{ copy.notFoundWhy }}</p>
        </div>
        <p v-else class="alerts__choose">{{ copy.choose }}</p>
      </div>
    </template>
    <template v-else>
      <template v-if="id">
        <RouterLink to="/alerts" class="alerts__back"><span class="mdi mdi-arrow-left" aria-hidden="true" /> {{ copy.allAlerts }}</RouterLink>
        <AlertDetail v-if="alert" :key="alert.id" :alert="alert" :heading-level="1">
          <!-- On a phone, every word on the page is also a 48px chip (P303 brief). -->
          <template v-if="isPhone" #after><WordChips :ids="alert.terms" /></template>
        </AlertDetail>
        <div v-else class="alerts__missing">
          <h1>{{ copy.notFound }}</h1>
          <p>{{ copy.notFoundWhy }}</p>
        </div>
      </template>
      <template v-else>
        <h1 class="fl-visually-hidden">{{ copy.title }}</h1>
        <AlertList show-seen />
      </template>
    </template>
  </div>
</template>

<style scoped>
.alerts.is-two {
  display: grid;
  grid-template-columns: minmax(320px, 5fr) 7fr;
  gap: 24px;
  align-items: start;
  max-width: 1280px;
}

.alerts__list,
.alerts__detail {
  padding: 20px 24px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 16px;
  background: var(--color-paper);
}

.alerts__detail {
  position: sticky;
  top: 80px;
}

.alerts__choose,
.alerts__missing p {
  margin: 8px 0 0;
  color: var(--color-ink-muted);
}

.alerts__missing h1,
.alerts__missing h2 {
  font-size: 1.75rem;
}

.alerts__back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 48px;
  margin-bottom: 8px;
  font-weight: 600;
}
</style>
