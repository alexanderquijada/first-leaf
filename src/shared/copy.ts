// Every user-facing sentence lives in a copy file (this folder's copy.json, the
// layouts' and each feature's). Components read from them; fill() puts values into
// named placeholders. Rule L5 checks every sentence in every copy file.
import copy from './copy.json'

export { copy }

/** Fills {name} placeholders: fill('up {amount}', { amount: '$5.00' }) → 'up $5.00'. */
export function fill(template: string, values: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m))
}

/** Shown when a deposit request is confirmed (ruling, Sept. 24). */
export const DEPOSIT_CONFIRMATION = copy.deposit.confirmation
