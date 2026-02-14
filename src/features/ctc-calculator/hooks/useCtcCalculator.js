import { useMemo, useState } from 'react'
import { DEFAULT_BASIC_PERCENTAGE, DEFAULT_CTC, DEFAULT_HRA_PERCENTAGE } from '../constants'
import { createDefaultState } from '../utils/defaults'
import { calculateCtcComponents } from '../utils/formula'

export const useCtcCalculator = () => {
  const [initialState] = useState(createDefaultState)
  const [ctc, setCtc] = useState(initialState.ctc)
  const [basicPercentage, setBasicPercentage] = useState(initialState.basicPercentage)
  const [hraPercentage, setHraPercentage] = useState(initialState.hraPercentage)
  const [roundResults, setRoundResults] = useState(initialState.roundResults)
  const [theme, setTheme] = useState('light')
  const [inputMode, setInputMode] = useState('ctc')

  const breakdown = useMemo(
    () => calculateCtcComponents(ctc, basicPercentage, hraPercentage),
    [ctc, basicPercentage, hraPercentage],
  )
  const components = breakdown.rows
  const totalPercentage = breakdown.totalPercentage

  const monthlyTotal = useMemo(() => ctc / 12, [ctc])
  const isDark = theme === 'dark'

  const resetCalculator = () => {
    setCtc(DEFAULT_CTC)
    setBasicPercentage(DEFAULT_BASIC_PERCENTAGE)
    setHraPercentage(DEFAULT_HRA_PERCENTAGE)
    setRoundResults(false)
    setInputMode('ctc')
  }

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  const setMonthlyTotalInput = (monthlyValue) => setCtc(monthlyValue * 12)

  return {
    ctc,
    components,
    theme,
    isDark,
    inputMode,
    basicPercentage,
    hraPercentage,
    roundResults,
    totalPercentage,
    monthlyTotal,
    setCtc,
    setInputMode,
    setMonthlyTotalInput,
    setBasicPercentage,
    setHraPercentage,
    setRoundResults,
    resetCalculator,
    toggleTheme,
  }
}
