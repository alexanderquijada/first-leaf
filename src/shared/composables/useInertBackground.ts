import { onBeforeUnmount, watch, type Ref } from 'vue'

// While a modal (dialog or bottom sheet) is open, the page behind it is inert: no
// one can tab, tap or read their way into it. Modals are teleported outside the
// app shell, so they stay usable.
let openCount = 0
function apply() {
  document.querySelector('.fl-app')?.toggleAttribute('inert', openCount > 0)
}

export function useInertBackground(open: Ref<boolean>) {
  let mine = false
  watch(
    open,
    (o) => {
      if (o && !mine) (openCount++, (mine = true))
      else if (!o && mine) (openCount--, (mine = false))
      apply()
    },
    { immediate: true },
  )
  onBeforeUnmount(() => {
    if (mine) openCount--
    apply()
  })
}
