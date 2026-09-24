<script setup lang="ts">
// A friendly 404, inside the app's layout, so all the navigation still works.
</script>

<template>
  <div class="nf">
    <h1>We couldn't find that page.</h1>
    <p>The link may be old or mistyped.</p>
    <RouterLink to="/" class="nf__home">Go to Home</RouterLink>
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
