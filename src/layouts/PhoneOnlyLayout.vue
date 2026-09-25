<script setup lang="ts">
// Phone view (P303 brief, Phase 4): at 600px and wider, /p303/… shows ONLY the phone.
// Its own layout, not the laptop one with parts hidden: no rail, no top bar. A plain
// cream window, the phone frame centered and scaled to fit so the page never scrolls
// (only the app inside the phone does), and "Back to full view" top left.
//
// The screen is an iframe of the same app at 390 × 844, so the phone breakpoints, the
// bottom tab bar and the touch targets are the real ones. The frame is a plain box with
// no role, so screen readers meet only the button and the phone's own page. No notch
// and no brand shapes. Under 600px the router sends /p303/… to the page itself.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import copy from './copy.json'
import { FROM_KEY, WIDE, phoneViewPath, type PhoneRouteMessage } from './usePhonePreview'

const P = copy.phoneView
const route = useRoute()
const router = useRouter()

const SCREEN_W = 390
const SCREEN_H = 844
const BEZEL = 12
const DEVICE_W = SCREEN_W + BEZEL * 2
const DEVICE_H = SCREEN_H + BEZEL * 2
const GAP = 24 // room kept around the phone
const BACK_ROOM = 72 // the button's strip at the top, kept clear when the phone would reach it
const BACK_WIDTH = 240

const innerPath = (rest: unknown) => '/' + ([] as string[]).concat((rest as string[] | string | undefined) ?? []).filter(Boolean).join('/')

// Set once: the phone keeps its own place as it navigates, so the frame never reloads.
const frameQuery: LocationQueryRaw = { ...route.query, embed: 'phone' }
const frameSrc = router.resolve({ path: innerPath(route.params.rest), query: frameQuery, hash: route.hash }).href

const size = ref({ w: window.innerWidth, h: window.innerHeight })
const scale = computed(() => {
  const { w, h } = size.value
  let s = Math.min(1, (h - GAP * 2) / DEVICE_H, (w - GAP * 2) / DEVICE_W)
  // On a narrow window the phone's top edge could reach the button, so keep its strip clear.
  if ((w - DEVICE_W * s) / 2 < BACK_WIDTH) s = Math.min(s, (h - BACK_ROOM * 2) / DEVICE_H)
  return Math.max(0.4, s)
})

const frameEl = ref<HTMLIFrameElement | null>(null)

// "Back to full view": the laptop page the visitor came from, or Home if they arrived here.
function back() {
  const from = (window.history.state as Record<string, unknown> | null)?.[FROM_KEY]
  const scenario = route.query.scenario
  router.push(typeof from === 'string' ? from : { path: '/', query: scenario ? { scenario } : {} })
}

// The app inside reports each page it shows: the window title follows the phone's page
// title, and the address follows its page, so a reload or a shared link opens the same page.
function onMessage(e: MessageEvent) {
  if (e.origin !== window.location.origin || e.source !== frameEl.value?.contentWindow) return
  const m = e.data as PhoneRouteMessage
  if (m?.type !== 'fl-phone-route') return
  document.title = m.title
  const from = (window.history.state as Record<string, unknown> | null)?.[FROM_KEY]
  router.replace({ path: phoneViewPath(m.path), query: m.query, hash: m.hash, state: from ? { [FROM_KEY]: from as string } : {} })
}

// Narrowed below 600px: there is no frame on a phone, so show the page itself.
const wide = window.matchMedia(WIDE)
function onWidth(e: MediaQueryListEvent) {
  if (!e.matches) router.replace({ path: innerPath(route.params.rest), query: route.query, hash: route.hash })
}
function onResize() {
  size.value = { w: window.innerWidth, h: window.innerHeight }
}

// Focus starts inside the phone. (In the tab order the button comes first, then the phone.)
function onFrameLoad() {
  frameEl.value?.focus()
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  window.addEventListener('message', onMessage)
  wide.addEventListener('change', onWidth)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('message', onMessage)
  wide.removeEventListener('change', onWidth)
})
</script>

<template>
  <div class="fl-phoneview">
    <header class="fl-phoneview__bar">
      <button type="button" class="fl-phoneview__back" @click="back">
        <span class="mdi mdi-arrow-left" aria-hidden="true" /> {{ P.back }}
      </button>
    </header>
    <div class="fl-phoneview__stage" :style="{ width: `${DEVICE_W * scale}px`, height: `${DEVICE_H * scale}px` }">
      <div
        class="fl-phoneview__device"
        :style="{ width: `${DEVICE_W}px`, height: `${DEVICE_H}px`, transform: `scale(${scale})` }"
      >
        <iframe
          ref="frameEl"
          class="fl-phoneview__screen"
          :src="frameSrc"
          :title="P.frameTitle"
          :width="SCREEN_W"
          :height="SCREEN_H"
          @load="onFrameLoad"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fl-phoneview {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--color-cream);
}

.fl-phoneview__bar {
  position: absolute;
  top: 12px;
  left: 16px;
}

.fl-phoneview__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 48px;
  padding: 0 18px 0 14px;
  border: 0;
  border-radius: 999px;
  background: var(--color-forest);
  color: var(--color-paper);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.fl-phoneview__back .mdi {
  font-size: 20px;
  line-height: 1;
}

.fl-phoneview__stage {
  flex: none;
}

.fl-phoneview__device {
  transform-origin: top left;
  padding: 12px;
  border-radius: 52px;
  background: var(--color-ink);
  box-shadow: 0 16px 40px rgb(21 19 15 / 0.25);
}

.fl-phoneview__screen {
  display: block;
  border: 0;
  border-radius: 40px;
  background: var(--color-cream);
}
</style>
