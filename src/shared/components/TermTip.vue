<script lang="ts">
// Module scope: only one explanation is open at a time, across the whole page.
import { ref } from 'vue'
const currentOpen = ref<string | null>(null)
</script>

<script setup lang="ts">
// A term explanation using the "toggletip" pattern (BRIEF.md §5).
// A real <button> opens it on click, tap, Enter or Space. Esc, a click outside
// or the close button closes it. Focus moves into the panel, then back to the
// button. The panel is a labelled dialog whose description is the explanation,
// so screen readers announce it when focus lands there. Nothing is hover-only.
// Under 600px wide the panel opens as a bottom sheet.
import { computed, nextTick, onBeforeUnmount, useId, watch } from 'vue'
import { useGlossary } from '../composables/useGlossary'

const props = defineProps<{
  /** Glossary id, e.g. "expense-ratio". */
  id: string
}>()

const { getTerm } = useGlossary()
const uid = useId()
const panelId = `fl-termtip-${uid}`

const buttonEl = ref<HTMLButtonElement | null>(null)
const panelEl = ref<HTMLDivElement | null>(null)

const entry = computed(() => getTerm(props.id))
if (import.meta.env.DEV && !entry.value) console.warn(`TermTip: no glossary entry "${props.id}"`)

// Which entry the panel shows. A related word swaps the panel's content.
const shownId = ref(props.id)
const shown = computed(() => getTerm(shownId.value))
// Each related word you follow is remembered, so "Back to …" can return to it.
const history = ref<{ from: string; via: string }[]>([])
const previous = computed(() => {
  const last = history.value[history.value.length - 1]
  return last ? getTerm(last.from) : undefined
})
const headingEl = ref<HTMLHeadingElement | null>(null)
const relatedEntries = computed(() =>
  (shown.value?.related ?? []).map((r) => getTerm(r)).filter((e) => e !== undefined),
)

const isOpen = computed(() => currentOpen.value === uid)
const isSheet = ref(false)
const pos = ref({ top: 0, left: 0, placeAbove: false })

const PANEL_WIDTH = 360
const GAP = 8
const EDGE = 16

const panelStyle = computed(() => {
  if (isSheet.value) return undefined
  const s: Record<string, string> = { left: `${pos.value.left}px`, width: `${PANEL_WIDTH}px` }
  if (pos.value.placeAbove) s.bottom = `${pos.value.top}px`
  else s.top = `${pos.value.top}px`
  return s
})

function place() {
  isSheet.value = window.matchMedia('(max-width: 599px)').matches
  const btn = buttonEl.value
  if (isSheet.value || !btn) return
  const r = btn.getBoundingClientRect()
  const vw = document.documentElement.clientWidth
  const vh = window.innerHeight
  const width = Math.min(PANEL_WIDTH, vw - EDGE * 2)
  const left = Math.max(EDGE, Math.min(r.left, vw - width - EDGE))
  const panelHeight = panelEl.value?.offsetHeight ?? 320
  const fitsBelow = r.bottom + GAP + panelHeight <= vh - EDGE
  const placeAbove = !fitsBelow && r.top - GAP - panelHeight >= EDGE
  pos.value = placeAbove
    ? { top: vh - r.top + GAP, left, placeAbove }
    : { top: r.bottom + GAP, left, placeAbove }
}

async function open() {
  shownId.value = props.id
  history.value = []
  currentOpen.value = uid
  place()
  await nextTick()
  place() // again, now that the panel's real height is known
  panelEl.value?.focus()
}

function close(returnFocus: boolean) {
  if (!isOpen.value) return
  currentOpen.value = null
  if (returnFocus) buttonEl.value?.focus()
}

function toggle() {
  if (isOpen.value) close(true)
  else open()
}

// Forward: focus the new word's heading. Back: focus the related-word link
// that was followed, so keyboard users land where they left off.
async function showRelated(id: string) {
  history.value.push({ from: shownId.value, via: id })
  shownId.value = id
  await nextTick()
  place()
  headingEl.value?.focus()
}

async function goBack() {
  const step = history.value.pop()
  if (!step) return
  shownId.value = step.from
  await nextTick()
  place()
  const link = panelEl.value?.querySelector<HTMLElement>(`[data-term-id="${step.via}"]`)
  ;(link ?? headingEl.value)?.focus()
}

// Keep Tab inside the open panel; Esc closes it.
function onPanelKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.stopPropagation()
    close(true)
    return
  }
  if (e.key !== 'Tab' || !panelEl.value) return
  const focusables = Array.from(
    panelEl.value.querySelectorAll<HTMLElement>('button, a[href]'),
  )
  if (!focusables.length) return
  const first = focusables[0]!
  const last = focusables[focusables.length - 1]!
  const active = document.activeElement
  if (e.shiftKey && (active === first || !focusables.includes(active as HTMLElement))) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}

function onDocPointerDown(e: PointerEvent) {
  const t = e.target as Node
  if (panelEl.value?.contains(t) || buttonEl.value?.contains(t)) return
  // Clicking elsewhere closes the panel. Focus goes back to the button only if
  // the click didn't put it somewhere else.
  close(false)
  requestAnimationFrame(() => {
    const a = document.activeElement
    if (!a || a === document.body) buttonEl.value?.focus()
  })
}

function onDocKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close(true)
}

function onViewportChange() {
  place()
}

watch(isOpen, (openNow) => {
  const fn = openNow ? 'addEventListener' : 'removeEventListener'
  document[fn]('pointerdown', onDocPointerDown as EventListener, true)
  document[fn]('keydown', onDocKeydown as EventListener)
  window[fn]('resize', onViewportChange)
  window[fn]('scroll', onViewportChange, true)
})

onBeforeUnmount(() => close(false))
</script>

<template>
  <span class="fl-termtip">
    <button
      ref="buttonEl"
      type="button"
      class="fl-termtip__button"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="isOpen ? panelId : undefined"
      @click="toggle"
    ><slot>{{ entry?.term ?? id }}</slot></button>
    <Teleport to="body">
      <div
        v-if="isOpen && shown"
        :id="panelId"
        ref="panelEl"
        class="fl-termtip__panel"
        :class="{ 'fl-termtip__panel--sheet': isSheet }"
        :style="panelStyle"
        role="dialog"
        :aria-labelledby="`${panelId}-term`"
        :aria-describedby="`${panelId}-short ${panelId}-detail`"
        tabindex="-1"
        @keydown="onPanelKeydown"
      >
        <button
          v-if="previous"
          type="button"
          class="fl-termtip__back"
          @click="goBack"
        >
          <span class="mdi mdi-arrow-left" aria-hidden="true" /> Back to {{ previous.term }}
        </button>
        <div class="fl-termtip__head">
          <h2 :id="`${panelId}-term`" ref="headingEl" class="fl-termtip__term" tabindex="-1">
            {{ shown.term }}
          </h2>
          <button
            type="button"
            class="fl-termtip__close"
            aria-label="Close explanation"
            @click="close(true)"
          >
            <span class="mdi mdi-close" aria-hidden="true" />
          </button>
        </div>
        <p v-if="shown.alsoCalled.length" class="fl-termtip__also">
          Also called <em>{{ shown.alsoCalled.join(', ') }}</em>
        </p>
        <p :id="`${panelId}-short`" class="fl-termtip__short">{{ shown.short }}</p>
        <p :id="`${panelId}-detail`" class="fl-termtip__detail">{{ shown.detail }}</p>
        <p class="fl-termtip__example"><strong>Example:</strong> {{ shown.example }}</p>
        <div v-if="relatedEntries.length" class="fl-termtip__related">
          <span class="fl-termtip__label">Related words:</span>
          <ul>
            <li v-for="r in relatedEntries" :key="r.id">
              <button
                type="button"
                class="fl-termtip__link"
                :data-term-id="r.id"
                @click="showRelated(r.id)"
              >
                {{ r.term }}
              </button>
            </li>
          </ul>
        </div>
        <p v-if="shown.source" class="fl-termtip__source">
          Source:
          <a :href="shown.source.url" target="_blank" rel="noopener noreferrer">{{ shown.source.label }}<span class="fl-visually-hidden"> (opens in a new tab)</span></a>
        </p>
      </div>
    </Teleport>
  </span>
</template>


<style scoped>
.fl-termtip__button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  text-decoration: underline dotted;
  /* Panels on a dark background set --fl-term-underline (for example to lime). */
  text-decoration-color: var(--fl-term-underline, var(--color-forest));
  text-decoration-thickness: 2px;
  text-underline-offset: 0.2em;
}

.fl-termtip__button[aria-expanded='true'] {
  text-decoration-style: solid;
}

.fl-termtip__panel {
  position: fixed;
  z-index: 2000;
  max-width: calc(100vw - 32px);
  max-height: min(70vh, 520px);
  overflow-y: auto;
  padding: 16px 20px 20px;
  background: var(--color-paper);
  color: var(--color-ink);
  border: 1px solid var(--color-ink-muted);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgb(21 19 15 / 0.18);
  font-family: var(--font-text);
  font-size: 1rem;
  line-height: 1.5;
}

.fl-termtip__panel--sheet {
  left: 0;
  right: 0;
  bottom: 0;
  max-width: none;
  max-height: 75vh;
  border-radius: 16px 16px 0 0;
  border-width: 1px 0 0;
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
}

.fl-termtip__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.fl-termtip__term {
  font-family: var(--font-display);
  font-size: 1.375rem;
  padding-top: 10px;
}

.fl-termtip__back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 48px;
  margin: -8px 0 0 -8px;
  padding: 0 12px 0 8px;
  border: 0;
  border-radius: 24px;
  background: none;
  color: var(--color-forest);
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
}

.fl-termtip__back:hover {
  background: var(--color-mint);
}

.fl-termtip__term:focus {
  outline: none;
}

.fl-termtip__term:focus-visible {
  outline: 3px solid var(--color-forest);
  outline-offset: 2px;
}

.fl-termtip__close {
  flex: none;
  width: 48px;
  height: 48px;
  margin: 0 -12px 0 0;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: none;
  color: var(--color-ink);
  font-size: 24px;
  cursor: pointer;
}

.fl-termtip__close:hover {
  background: var(--color-mint);
}

.fl-termtip__panel p {
  margin: 0 0 10px;
}

.fl-termtip__also {
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--color-ink-muted);
}

.fl-termtip__short {
  font-weight: 600;
}

.fl-termtip__related {
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  margin-bottom: 10px;
}

.fl-termtip__related ul {
  display: inline;
  padding: 0;
  margin: 0;
  list-style: none;
}

.fl-termtip__related li {
  display: inline;
}

.fl-termtip__related li + li::before {
  content: '·';
  margin: 0 4px;
  color: var(--color-ink-muted);
}

.fl-termtip__label {
  margin-right: 4px;
}

.fl-termtip__link {
  font: inherit;
  min-height: 24px;
  padding: 2px 0;
  border: 0;
  background: none;
  color: var(--color-forest);
  text-decoration: underline;
  cursor: pointer;
}

/* On a phone the related words are standalone controls: 48 × 48px each (P303 ruling). */
.fl-termtip__panel--sheet .fl-termtip__related ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}

.fl-termtip__panel--sheet .fl-termtip__related li + li::before {
  content: none;
}

.fl-termtip__panel--sheet .fl-termtip__link {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  min-width: 48px;
  padding: 0 14px;
  border: 1px solid var(--color-forest);
  border-radius: 24px;
  text-decoration: none;
  font-weight: 600;
}

.fl-termtip__panel--sheet .fl-termtip__back {
  min-height: 48px;
}

.fl-termtip__source {
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--color-ink-muted);
}
</style>
