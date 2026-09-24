<script setup lang="ts">
// A brand-new account: no money yet, so no charts, just what happens next.
import { persona } from '@/shared/data'
import TermTip from '@/shared/components/TermTip.vue'
</script>

<template>
  <section class="welcome" aria-labelledby="welcome-title">
    <h2 id="welcome-title" class="welcome__title">Welcome, {{ persona.firstName }}.</h2>
    <p>Your account is open. Here is what happens next.</p>
    <ol class="welcome__steps">
      <li>Add money from your bank. It takes 1 to 3 days to arrive.</li>
      <li>When it arrives, it waits as <TermTip id="cash">cash</TermTip> in your account.</li>
      <li>Then you choose what to do with it, such as turning on <TermTip id="auto-invest">auto-invest</TermTip>.</li>
    </ol>
  </section>
</template>

<style scoped>
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
