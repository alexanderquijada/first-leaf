<script setup lang="ts">
// "Add a beneficiary" (Phase 6): a short settings sheet, as a real brokerage would run it.
// Name and relationship only; kept for this visit only (the data files never change).
// Saving emits "saved", and the alert then moves to Handled.
import { computed, ref, watch } from 'vue'
import { useInertBackground } from '../composables/useInertBackground'
import { useSession } from '../composables/useSession'
import { copy, fill } from '../copy'

const B = copy.beneficiaryFlow
const open = defineModel<boolean>({ default: false })
const emit = defineEmits<{ saved: [] }>()

const { setBeneficiary } = useSession()
const step = ref<'edit' | 'done'>('edit')
const name = ref('')
const relationship = ref('')
const tried = ref(false)
const nameError = computed(() => (name.value.trim() ? '' : B.nameError))
const relationshipError = computed(() => (relationship.value.trim() ? '' : B.relationshipError))

// While the sheet is open, the page behind it is inert.
useInertBackground(open)

watch(open, (o) => {
  if (!o) return
  step.value = 'edit'
  name.value = ''
  relationship.value = ''
  tried.value = false
})

function save() {
  tried.value = true
  if (nameError.value || relationshipError.value) return
  setBeneficiary({ name: name.value.trim(), relationship: relationship.value.trim() })
  step.value = 'done'
  emit('saved')
}
</script>

<template>
  <v-dialog v-model="open" max-width="480" :aria-label="B.title">
    <v-card class="fl-flow" color="paper">
      <form class="fl-flow__body" novalidate @submit.prevent="save">
        <h2 class="fl-flow__title">{{ B.title }}</h2>
        <template v-if="step === 'edit'">
          <p>{{ B.intro }}</p>
          <div class="fl-flow__field">
            <label for="fl-ben-name">{{ B.nameLabel }}</label>
            <input
              id="fl-ben-name"
              v-model="name"
              class="fl-flow__text"
              autocomplete="off"
              :aria-invalid="tried && nameError ? 'true' : 'false'"
              aria-describedby="fl-ben-name-error"
            />
            <p id="fl-ben-name-error" class="fl-flow__error" role="alert">{{ tried ? nameError : '' }}</p>
          </div>
          <div class="fl-flow__field">
            <label for="fl-ben-rel">{{ B.relationshipLabel }}</label>
            <input
              id="fl-ben-rel"
              v-model="relationship"
              class="fl-flow__text"
              autocomplete="off"
              :aria-invalid="tried && relationshipError ? 'true' : 'false'"
              aria-describedby="fl-ben-rel-hint fl-ben-rel-error"
            />
            <p id="fl-ben-rel-hint" class="fl-flow__hint">{{ B.relationshipHint }}</p>
            <p id="fl-ben-rel-error" class="fl-flow__error" role="alert">{{ tried ? relationshipError : '' }}</p>
          </div>
          <div class="fl-flow__actions">
            <v-btn variant="text" color="ink" @click="open = false">{{ B.cancel }}</v-btn>
            <v-btn variant="flat" color="forest" type="submit">{{ B.save }}</v-btn>
          </div>
        </template>
        <template v-else>
          <p class="fl-flow__done" role="status">
            <span class="mdi mdi-check-circle" aria-hidden="true" />
            {{ fill(B.saved, { name: name.trim() }) }}
          </p>
          <div class="fl-flow__actions">
            <v-btn variant="flat" color="forest" @click="open = false">{{ B.done }}</v-btn>
          </div>
        </template>
      </form>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.fl-flow__body {
  padding: 24px;
}

.fl-flow__title {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.fl-flow p {
  margin: 8px 0 0;
  line-height: var(--fl-body-leading);
}

.fl-flow__field {
  display: grid;
  gap: 4px;
  margin-top: 16px;
}

.fl-flow__field label {
  font-weight: 600;
}

.fl-flow__text {
  min-height: 48px;
  padding: 0 12px;
  border: 1px solid var(--color-ink-muted);
  border-radius: 8px;
  background: var(--color-paper);
  color: var(--color-ink);
  font: inherit;
}

.fl-flow__hint {
  color: var(--color-ink-muted);
  font-size: var(--type-small);
}

.fl-flow__field p.fl-flow__hint,
.fl-flow__field p.fl-flow__error {
  margin: 0;
}

.fl-flow__error {
  color: var(--color-terracotta);
  font-weight: 600;
}

.fl-flow__error:empty {
  display: none;
}

.fl-flow__done {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  font-weight: 600;
}

.fl-flow__done .mdi {
  color: var(--color-forest);
  font-size: 1.375rem;
  line-height: 1.1;
}

.fl-flow__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.fl-flow__actions .v-btn {
  min-height: 48px;
}
</style>
