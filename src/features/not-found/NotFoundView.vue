<script setup lang="ts">
import SceneArt from '@/shared/illustrations/SceneArt.vue'
// A friendly 404, inside the app's layout, so all the navigation still works.
import copy from './copy.json'
</script>

<template>
  <div class="nf">
    <SceneArt scene="lost" :size="160" />
    <h1>{{ copy.title }}</h1>
    <p>{{ copy.why }}</p>
    <RouterLink to="/" class="nf__home">{{ copy.home }}</RouterLink>
  </div>
</template>

<style scoped>
.nf h1 {
  font-size: clamp(2rem, 5vw, 3rem);
}

.nf p {
  margin: 12px 0 0;
  font-size: 1.125rem;
}

.nf__home {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  margin-top: 8px;
  font-weight: 600;
}
</style>
