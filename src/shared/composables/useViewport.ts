import { ref } from 'vue'

// Module scope: one listener for the whole app. The breakpoints match BRIEF.md §10.
const phoneQuery = typeof window !== 'undefined' ? window.matchMedia('(max-width: 599px)') : null
const desktopQuery = typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)') : null
const isPhone = ref(phoneQuery?.matches ?? false)
const isDesktop = ref(desktopQuery?.matches ?? true)
phoneQuery?.addEventListener('change', (e) => (isPhone.value = e.matches))
desktopQuery?.addEventListener('change', (e) => (isDesktop.value = e.matches))

/** Under 600px: the phone layout (P303). 1024px and up: the laptop layout (P301). */
export function useViewport() {
  return { isPhone, isDesktop }
}
