// The growth formula for Your Journey, section 3 ("Your head start", Phase 6.1). It is the same
// one the validator (rule T1) checks: an example rate, compounded monthly, with money put in at
// the end of each month, from her age now until endAge. "Start again later" adds nothing for the
// delay, then adds the chosen amount every month.
import { story, type HeadStartPoint } from './data'

export function headStartLine(start: number, monthly: number, delayYears: number): HeadStartPoint[] {
  const { startAge, endAge } = story.headStart
  const i = story.assumptions.annualRate / 12
  let v = start
  const yearly = [{ age: startAge, value: Math.round(v * 100) / 100 }]
  for (let age = startAge; age < endAge; age++) {
    for (let m = 0; m < 12; m++) v = v * (1 + i) + ((age - startAge) * 12 + m >= delayYears * 12 ? monthly : 0)
    yearly.push({ age: age + 1, value: Math.round(v * 100) / 100 })
  }
  return yearly
}
