import { computed, ref } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

// Phone view (P303 brief): at 600px and wider, /p303/… shows only the real app inside a
// 390 × 844 phone frame (an iframe of the same app), with its own layout.

// Captured once, at startup: the app inside the frame keeps knowing it is
// embedded even after it navigates and the query is gone. It never nests a phone view.
export const isEmbedded =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embed') === 'phone'

export const WIDE = '(min-width: 600px)'
export const isWide = () => typeof window !== 'undefined' && window.matchMedia(WIDE).matches
const wideEnough = ref(isWide())
if (typeof window !== 'undefined') {
  window.matchMedia(WIDE).addEventListener('change', (e) => (wideEnough.value = e.matches))
}
export const phoneViewAvailable = computed(() => !isEmbedded && wideEnough.value)

/** The page a visitor was on before phone view, kept in the browser's history entry. */
export const FROM_KEY = 'flPhoneViewFrom'

/** Where phone view shows the page at `path` ("/" → "/p303", "/story" → "/p303/story"). */
export function phoneViewPath(path: string) {
  return '/p303' + (path === '/' ? '' : path)
}

/** The phone view address for the current full-view page, keeping its query and hash. */
export function phoneViewLocation(route: RouteLocationNormalizedLoaded) {
  return {
    path: phoneViewPath(route.path),
    query: route.query,
    hash: route.hash,
    state: { [FROM_KEY]: route.fullPath },
  }
}

/** Message the app inside the frame sends its parent after every navigation. */
export interface PhoneRouteMessage {
  type: 'fl-phone-route'
  path: string
  query: Record<string, string>
  hash: string
  title: string
}
