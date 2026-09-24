import { computed, nextTick, ref } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw, type Router } from 'vue-router'
import { useScenario } from '@/shared/composables/useScenario'

// Phone preview (P303 brief): at 600px and wider, the real app can be shown
// inside a 390 × 844 phone frame (an iframe of the same app). ?view=phone opens it.

// Captured once, at startup: the app inside the frame keeps knowing it is
// embedded even after it navigates and the query is gone. It never nests a preview.
export const isEmbedded =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embed') === 'phone'

const WIDE = '(min-width: 600px)'
const wideEnough = ref(typeof window !== 'undefined' && window.matchMedia(WIDE).matches)
if (typeof window !== 'undefined') {
  window.matchMedia(WIDE).addEventListener('change', (e) => (wideEnough.value = e.matches))
}

// The toggle registers itself so focus can return to it when the preview closes.
export const toggleEl = ref<HTMLButtonElement | null>(null)

// While the preview is open, moving around the full view keeps it open, so
// the phone follows along. Closing it on purpose lets the next navigation drop it.
let guardInstalled = false
let closing = false
function installGuard(router: Router) {
  if (guardInstalled) return
  guardInstalled = true
  router.beforeEach((to, from) => {
    if (closing) {
      closing = false
      return true
    }
    if (!isEmbedded && from.query.view === 'phone' && to.query.view === undefined) {
      return { path: to.path, query: { ...to.query, view: 'phone' }, hash: to.hash }
    }
    return true
  })
}

export function usePhonePreview() {
  const route = useRoute()
  const router = useRouter()
  const { scenarioId } = useScenario()
  installGuard(router)

  const available = computed(() => !isEmbedded && wideEnough.value)
  const open = computed(() => available.value && route.query.view === 'phone')

  // The frame shows the current page and scenario, embedded.
  const frameSrc = computed(() => {
    const query: LocationQueryRaw = { ...route.query, embed: 'phone', scenario: scenarioId.value }
    delete query.view
    return router.resolve({ path: route.path, query, hash: route.hash }).href
  })

  async function setOpen(on: boolean) {
    const query = { ...route.query }
    if (on) query.view = 'phone'
    else {
      delete query.view
      closing = true
    }
    await router.replace({ query })
    if (!on) {
      await nextTick()
      toggleEl.value?.focus()
    }
  }

  return { available, open, frameSrc, setOpen }
}
