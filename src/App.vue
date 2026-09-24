<template>
  <v-app>
    <!-- Each page renders its own <main>, so v-main is a plain div (one main landmark per page). -->
    <v-main tag="div">
      <router-view />
    </v-main>
  </v-app>
</template>
