import { useState } from 'react'
import { useCtcCalculator } from './hooks/useCtcCalculator'
import { formatMoney } from './utils/format'
import { copyCalculationForWord } from './utils/export'
import { CalculatorHeader } from './components/CalculatorHeader'
import { CtcInput } from './components/CtcInput'
import { ComponentsTable } from './components/ComponentsTable'
import { CalculatorActions } from './components/CalculatorActions'

export const CtcCalculatorPage = () => {
  const [copyStatus, setCopyStatus] = useState('')
  const {
    ctc,
    components,
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
  } = useCtcCalculator()

  const handleCopyForWord = async () => {
    const message = await copyCalculationForWord({
      ctc,
      components,
      totalPercentage,
      monthlyTotal,
      formatMoney,
    })
    setCopyStatus(message)
  }

  const handleReset = () => {
    resetCalculator()
    setCopyStatus('')
  }

  return (
    <main
      className={`min-h-screen px-4 py-10 sm:px-8 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <section
        className={`mx-auto w-full max-w-5xl rounded-2xl border p-6 shadow-2xl sm:p-8 ${
          isDark
            ? 'border-slate-800 bg-slate-900/70 shadow-slate-950/60'
            : 'border-slate-200 bg-white shadow-slate-300/60'
        }`}
      >
        <CalculatorHeader />
        <CtcInput
          ctc={ctc}
          monthlyTotal={monthlyTotal}
          inputMode={inputMode}
          isDark={isDark}
          onModeChange={setInputMode}
          onCtcChange={setCtc}
          onMonthlyChange={setMonthlyTotalInput}
        />
        <ComponentsTable
          isDark={isDark}
          ctc={ctc}
          components={components}
          totalPercentage={totalPercentage}
          monthlyTotal={monthlyTotal}
          formatMoney={formatMoney}
          onUpdateComponent={updateComponent}
          onRemoveComponent={removeComponent}
        />
        <CalculatorActions
          isDark={isDark}
          totalPercentage={totalPercentage}
          onAddComponent={addComponent}
          onReset={handleReset}
          onCopyForWord={handleCopyForWord}
          onToggleTheme={toggleTheme}
          copyStatus={copyStatus}
        />
      </section>
    </main>
  )
}
