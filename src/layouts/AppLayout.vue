<script setup lang="ts">
// The one app shell. Navigation changes with the screen size (BRIEF.md §3):
// a left rail from 1024px, top tabs at 600–1023px, a bottom tab bar under 600px.
// The router puts each feature's page inside <router-view>.
import AppFooter from './AppFooter.vue'
import BottomTabBar from './BottomTabBar.vue'
import DesktopRail from './DesktopRail.vue'
import PhonePreview from './PhonePreview.vue'
import PhonePreviewToggle from './PhonePreviewToggle.vue'
import TopBar from './TopBar.vue'
import TopTabs from './TopTabs.vue'
import { usePhonePreview } from './usePhonePreview'

const { open: previewOpen } = usePhonePreview()

// "Skip to content" moves focus to the page, past the navigation.
function skipToContent(e: Event) {
  e.preventDefault()
  const main = document.getElementById('main')
  main?.focus()
  main?.scrollIntoView()
}
</script>

<template>
  <div class="fl-app">
    <a class="fl-skip" href="#main" @click="skipToContent">Skip to content</a>
    <DesktopRail />
    <div class="fl-app__column">
      <TopBar>
        <template #actions>
          <PhonePreviewToggle />
        </template>
      </TopBar>
      <TopTabs />
      <main id="main" class="fl-app__main" tabindex="-1">
        <PhonePreview v-if="previewOpen" />
        <div v-show="!previewOpen">
          <router-view />
        </div>
      </main>
      <div class="fl-app__footer">
        <AppFooter />
      </div>
    </div>
    <BottomTabBar />
  </div>
</template>

<style scoped>
.fl-app {
  min-height: 100vh;
}

.fl-skip {
  position: absolute;
  left: 8px;
  top: -100px;
  z-index: 100;
  padding: 12px 16px;
  background: var(--color-paper);
  color: var(--color-forest);
  font-weight: 700;
}

.fl-skip:focus {
  top: 8px;
}

.fl-app__main {
  padding: 32px 16px 0;
}

.fl-app__main:focus {
  outline: none;
}

.fl-app__footer {
  padding: 0 16px;
}

/* Phone: room for the fixed bottom tab bar, and roomier lines (P303 brief). */
@media (max-width: 599px) {
  .fl-app {
    padding-bottom: calc(57px + env(safe-area-inset-bottom, 0px));
  }

  .fl-app__main {
    padding-top: 24px;
    line-height: 1.6;
  }
}

@media (min-width: 600px) {
  .fl-app__main,
  .fl-app__footer {
    padding-left: 24px;
    padding-right: 24px;
  }
}

@media (min-width: 1024px) {
  .fl-app {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .fl-app__main,
  .fl-app__footer {
    padding-left: 32px;
    padding-right: 32px;
  }
}
</style>
