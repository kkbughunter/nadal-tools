import {
  DEFAULT_BASIC_PERCENTAGE,
  DEFAULT_CTC,
  DEFAULT_HRA_PERCENTAGE,
} from '../constants'

export const createDefaultState = () => ({
  ctc: DEFAULT_CTC,
  basicPercentage: DEFAULT_BASIC_PERCENTAGE,
  hraPercentage: DEFAULT_HRA_PERCENTAGE,
  roundResults: true,
  includeEsic: true,
})
