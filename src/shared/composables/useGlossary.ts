import { glossary, type GlossaryEntry } from '../data'

const byId = new Map(glossary.map((e) => [e.id, e]))

/** Plain-language explanations, looked up by id (e.g. "expense-ratio"). */
export function useGlossary() {
  function getTerm(id: string): GlossaryEntry | undefined {
    return byId.get(id)
  }
  return { glossary, getTerm }
}
