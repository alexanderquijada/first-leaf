<script setup lang="ts">
import SceneArt from '@/shared/illustrations/SceneArt.vue'
// A brand-new account: no money yet, so no charts, just what happens next.
import { persona } from '@/shared/data'
import { fill } from '@/shared/copy'
import copy from './copy.json'

const W = copy.welcome
</script>

<template>
  <section class="welcome" aria-labelledby="welcome-title">
    <SceneArt scene="welcome" :size="120" class="welcome__art" />
    <h2 id="welcome-title" class="welcome__title">{{ fill(W.title, { name: persona.firstName }) }}</h2>
    <p>{{ W.lede }}</p>
    <ol class="welcome__steps">
      <li>{{ W.step1 }}</li>
      <li>{{ W.step2 }}</li>
      <li>{{ W.step3 }}</li>
    </ol>
  </section>
</template>

<style scoped>
.welcome__art {
  float: right;
  margin: 0 0 8px 16px;
}

.welcome__title {
  font-size: 2rem;
}

.welcome p {
  margin: 8px 0 0;
  font-size: 1.125rem;
}

.welcome__steps {
  margin: 12px 0 0;
  padding-left: 1.4em;
  line-height: 1.7;
  font-size: 1.0625rem;
}
</style>
