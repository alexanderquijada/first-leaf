// The growth formula for Your money story, chapter 5. It is the same one the
// validator (rule T1) checks: an example rate, compounded monthly, with money put
// in at the end of each month, until endAge.
import { story } from './data'

export interface Projection {
  putIn: number
  value: number
  yearly: { age: number; putIn: number; value: number }[]
}

export function project(startAge: number, monthly: number, rate = story.assumptions.annualRate, endAge = story.assumptions.endAge): Projection {
  const i = rate / 12
  let v = 0
  let putIn = 0
  const yearly = [{ age: startAge, putIn: 0, value: 0 }]
  for (let age = startAge; age < endAge; age++) {
    for (let m = 0; m < 12; m++) {
      v = v * (1 + i) + monthly
      putIn += monthly
    }
    yearly.push({ age: age + 1, putIn: Math.round(putIn * 100) / 100, value: Math.round(v * 100) / 100 })
  }
  return { putIn: Math.round(putIn * 100) / 100, value: Math.round(v * 100) / 100, yearly }
}
