import { useState } from 'react'
import { useCtcCalculator } from './hooks/useCtcCalculator'
import { formatMoney } from './utils/format'
import { exportCalculationToExcelCsv } from './utils/export'
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
    basicPercentage,
    hraPercentage,
    roundResults,
    includeEsic,
    pfCapOption,
    totalPercentage,
    esicEligible,
    pfCapped,
    monthlyTotal,
    setCtc,
    setInputMode,
    setMonthlyTotalInput,
    setBasicPercentage,
    setHraPercentage,
    setRoundResults,
    setIncludeEsic,
    setPfCapOption,
    resetCalculator,
  } = useCtcCalculator()

  const displayMoney = (value) =>
    formatMoney(roundResults ? Math.round(value) : value, { rounded: false })

  const handleReset = () => {
    resetCalculator()
    setCopyStatus('')
  }

  const handleExportExcel = async () => {
    try {
      const message = await exportCalculationToExcelCsv({ components })
      setCopyStatus(message)
    } catch (error) {
      setCopyStatus(error?.message ?? 'Failed to export Excel file.')
    }
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
          roundResults={roundResults}
          includeEsic={includeEsic}
          pfCapOption={pfCapOption}
          isDark={isDark}
          onModeChange={setInputMode}
          onCtcChange={setCtc}
          onMonthlyChange={setMonthlyTotalInput}
          onToggleRoundResults={() => setRoundResults((prev) => !prev)}
          onToggleIncludeEsic={() => setIncludeEsic((prev) => !prev)}
          onPfCapChange={setPfCapOption}
        />
        <ComponentsTable
          isDark={isDark}
          ctc={ctc}
          components={components}
          basicPercentage={basicPercentage}
          hraPercentage={hraPercentage}
          includeEsic={includeEsic}
          esicEligible={esicEligible}
          pfCapped={pfCapped}
          pfCapOption={pfCapOption}
          totalPercentage={totalPercentage}
          monthlyTotal={monthlyTotal}
          formatMoney={displayMoney}
          onBasicPercentageChange={setBasicPercentage}
          onHraPercentageChange={setHraPercentage}
        />
        <CalculatorActions
          isDark={isDark}
          onReset={handleReset}
          onExportExcel={handleExportExcel}
          copyStatus={copyStatus}
        />
      </section>
    </main>
  )
}
