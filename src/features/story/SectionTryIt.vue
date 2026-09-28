<script setup lang="ts">
// Section 4, "Try it": practice money and the time machine. Its one interaction is the way
// into Practice.
import copy from './copy.json'
</script>

<template>
  <div class="section-body">
    <p class="section__claim">{{ copy.tryIt.claim }}</p>
    <p class="section__claim">{{ copy.tryIt.timeMachine }}</p>
    <RouterLink to="/practice" class="section__go">{{ copy.tryIt.go }} <span class="mdi mdi-arrow-right" aria-hidden="true" /></RouterLink>
  </div>
</template>
