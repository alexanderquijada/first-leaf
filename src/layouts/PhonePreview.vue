<script setup lang="ts">
// The real app inside a generic phone frame (390 × 844 CSS px screen). Not a
// mock-up: the frame is an iframe of the same app, so the phone breakpoints,
// the bottom tab bar and the touch targets are the real ones. No notch and no
// brand shapes. The frame scales down (a CSS transform) to fit the window height;
// the 390px layout inside never changes.
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePhonePreview } from './usePhonePreview'

const { frameSrc, setOpen } = usePhonePreview()
const route = useRoute()
// The only note beside the frame: Practice in the frame is a separate session.
const onPractice = computed(() => route.path.startsWith('/practice'))

const SCREEN_W = 390
const SCREEN_H = 844
const BEZEL = 12
const DEVICE_W = SCREEN_W + BEZEL * 2
const DEVICE_H = SCREEN_H + BEZEL * 2

const stageEl = ref<HTMLDivElement | null>(null)
const frameEl = ref<HTMLIFrameElement | null>(null)
const scale = ref(1)

function fit() {
  const top = stageEl.value?.getBoundingClientRect().top ?? 0
  const room = window.innerHeight - Math.max(top, 0) - 24
  scale.value = Math.max(0.5, Math.min(1, room / DEVICE_H))
}

function close() {
  setOpen(false)
}

// Esc closes the preview, from the page or from inside the frame. Inside the
// frame, Esc first closes whatever is open there (a menu or an explanation).
function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || e.defaultPrevented) return
  if (!document.querySelector('.v-overlay--active, .fl-termtip__panel')) close()
}
function onFrameLoad() {
  const win = frameEl.value?.contentWindow
  win?.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || e.defaultPrevented) return
    const busy = win.document.querySelector('.v-overlay--active, .fl-termtip__panel')
    if (!busy) close()
  })
}

onMounted(async () => {
  fit()
  window.addEventListener('resize', fit)
  document.addEventListener('keydown', onKeydown)
  await nextTick()
  frameEl.value?.focus()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', fit)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <section class="fl-pp" aria-labelledby="fl-pp-title">
    <h1 id="fl-pp-title" class="fl-visually-hidden">Phone preview</h1>
    <div
      ref="stageEl"
      class="fl-pp__stage"
      :style="{ width: `${DEVICE_W * scale}px`, height: `${DEVICE_H * scale}px` }"
    >
      <div
        class="fl-pp__device"
        :style="{ width: `${DEVICE_W}px`, height: `${DEVICE_H}px`, transform: `scale(${scale})` }"
      >
        <iframe
          ref="frameEl"
          class="fl-pp__screen"
          :src="frameSrc"
          title="First Leaf on a phone"
          :width="SCREEN_W"
          :height="SCREEN_H"
          @load="onFrameLoad"
        />
      </div>
    </div>
    <div class="fl-pp__side">
      <button type="button" class="fl-pp__back" @click="close">
        <span class="mdi mdi-arrow-left" aria-hidden="true" /> Back to full view
      </button>
      <p v-if="onPractice">Practice here is kept apart from the full view.</p>
    </div>
  </section>
</template>

<style scoped>
.fl-pp {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 24px 32px;
  animation: fl-pp-in 200ms ease-out;
}

@keyframes fl-pp-in {
  from {
    opacity: 0;
  }
}

.fl-pp__stage {
  flex: none;
}

.fl-pp__device {
  transform-origin: top left;
  padding: 12px;
  border-radius: 52px;
  background: var(--color-ink);
  box-shadow: 0 16px 40px rgb(21 19 15 / 0.25);
}

.fl-pp__screen {
  display: block;
  border: 0;
  border-radius: 40px;
  background: var(--color-cream);
}

.fl-pp__side {
  max-width: 260px;
}

.fl-pp__side p {
  margin: 12px 0 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--color-ink-muted);
}

.fl-pp__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 48px;
  padding: 0 16px 0 12px;
  border: 0;
  border-radius: 4px;
  background: var(--color-forest);
  color: var(--color-paper);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
</style>
