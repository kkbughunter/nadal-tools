import { useMemo, useState } from 'react'
import { DEFAULT_CTC, getFixedPercentage, isNonDeletableComponent } from '../constants'
import { createDefaultComponents, createDefaultState } from '../utils/defaults'

export const useCtcCalculator = () => {
  const [initialState] = useState(createDefaultState)
  const [ctc, setCtc] = useState(initialState.ctc)
  const [components, setComponents] = useState(initialState.components)
  const [theme, setTheme] = useState('light')
  const [inputMode, setInputMode] = useState('ctc')

  const totalPercentage = useMemo(
    () =>
      components.reduce(
        (sum, item) => sum + (Number.isFinite(item.percentage) ? item.percentage : 0),
        0,
      ),
    [components],
  )

  const monthlyTotal = useMemo(() => ctc / 12, [ctc])
  const isDark = theme === 'dark'

  const updateComponent = (id, key, value) => {
    setComponents((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item

        if (key === 'name') {
          if (isNonDeletableComponent(item.name)) return item
          const nextName = typeof value === 'string' ? value : item.name
          const fixedNext = getFixedPercentage(nextName)
          return {
            ...item,
            name: nextName,
            percentage: fixedNext ?? item.percentage,
          }
        }

        if (key === 'percentage') {
          const fixed = getFixedPercentage(item.name)
          return { ...item, percentage: fixed ?? value }
        }

        return { ...item, [key]: value }
      }),
    )
  }

  const addComponent = () => {
    const nextIndex = components.length + 1
    setComponents((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: `Component ${nextIndex}`, percentage: 0 },
    ])
  }

  const removeComponent = (id) => {
    setComponents((prev) => {
      if (prev.length <= 1) return prev
      const target = prev.find((item) => item.id === id)
      if (target && isNonDeletableComponent(target.name)) return prev
      return prev.filter((item) => item.id !== id)
    })
  }

  const resetCalculator = () => {
    setCtc(DEFAULT_CTC)
    setComponents(createDefaultComponents())
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
    totalPercentage,
    monthlyTotal,
    setCtc,
    setInputMode,
    setMonthlyTotalInput,
    updateComponent,
    addComponent,
    removeComponent,
    resetCalculator,
    toggleTheme,
  }
}
