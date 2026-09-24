<script setup lang="ts">
// Renders one sentence from a copy file. Named placeholders ({balance}) are filled
// from `values`, or from a slot of the same name when the placeholder is a
// component (a term explanation, a money amount). Sentences are never built by
// joining fragments in a template. Plain text and filled values next to each other
// become one text node, exactly as a hand-written template would render them.
import { computed, useSlots } from 'vue'

const props = defineProps<{ text: string; values?: Record<string, string | number> }>()
const slots = useSlots()
const parts = computed(() => {
  const out: ({ text: string } | { slot: string })[] = []
  for (const p of props.text.split(/(\{\w+\})/)) {
    if (p === '') continue
    const name = p.match(/^\{(\w+)\}$/)?.[1]
    if (name && slots[name]) out.push({ slot: name })
    else {
      const t = name ? String(props.values?.[name] ?? '') : p
      const last = out.at(-1)
      if (last && 'text' in last) last.text += t
      else out.push({ text: t })
    }
  }
  return out
})
</script>

<template>
  <template v-for="(p, i) in parts" :key="i"
    ><template v-if="'text' in p">{{ p.text }}</template><slot v-else :name="p.slot"
  /></template>
</template>
