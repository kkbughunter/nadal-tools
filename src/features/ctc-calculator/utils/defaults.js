import {
  commonComponentNames,
  defaultPercentageMap,
  DEFAULT_CTC,
} from '../constants'

export const createDefaultComponents = () =>
  commonComponentNames.map((name) => ({
    id: crypto.randomUUID(),
    name,
    percentage: defaultPercentageMap[name] ?? 0,
  }))

export const createDefaultState = () => ({
  ctc: DEFAULT_CTC,
  components: createDefaultComponents(),
})
