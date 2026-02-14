import { useEffect, useState } from 'react'

export const CtcInput = ({
  ctc,
  monthlyTotal,
  inputMode,
  roundResults,
  includeEsic,
  isDark,
  onModeChange,
  onCtcChange,
  onMonthlyChange,
  onToggleRoundResults,
  onToggleIncludeEsic,
}) => {
  const committedValue = inputMode === 'monthly' ? monthlyTotal : ctc
  const [draftValue, setDraftValue] = useState(String(committedValue))

  useEffect(() => {
    setDraftValue(String(committedValue))
  }, [committedValue, inputMode])

  const handleChange = (value) => {
    setDraftValue(value)
    if (value === '') return
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return
    if (inputMode === 'monthly') onMonthlyChange(parsed)
    else onCtcChange(parsed)
  }

  const handleBlur = () => {
    if (draftValue !== '') return
    if (inputMode === 'monthly') onMonthlyChange(0)
    else onCtcChange(0)
    setDraftValue('0')
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onModeChange('ctc')}
          className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
            inputMode === 'ctc'
              ? 'border-cyan-400 bg-cyan-400 text-slate-950'
              : isDark
                ? 'border-slate-600 text-slate-100 hover:border-slate-400'
                : 'border-slate-300 text-slate-800 hover:border-slate-400'
          }`}
        >
          CTC Input
        </button>
        <button
          type="button"
          onClick={() => onModeChange('monthly')}
          className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
            inputMode === 'monthly'
              ? 'border-cyan-400 bg-cyan-400 text-slate-950'
              : isDark
                ? 'border-slate-600 text-slate-100 hover:border-slate-400'
                : 'border-slate-300 text-slate-800 hover:border-slate-400'
          }`}
        >
          Monthly Input
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="primary-input"
          className={`text-base font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
        >
          {inputMode === 'monthly' ? 'Monthly Total' : 'CTC (Yearly)'}
        </label>
        <input
          id="primary-input"
          type="number"
          min="0"
          value={draftValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={`w-full max-w-xs rounded-lg border px-4 py-2.5 text-base outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring-2 ${
            isDark
              ? 'border-slate-700 bg-slate-950'
              : 'border-slate-300 bg-white text-slate-900'
          }`}
        />
        <button
          type="button"
          onClick={onToggleRoundResults}
          className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
            roundResults
              ? 'border-cyan-400 bg-cyan-400 text-slate-950'
              : isDark
                ? 'border-slate-600 text-slate-100 hover:border-slate-400'
                : 'border-slate-300 text-slate-800 hover:border-slate-400'
          }`}
        >
          Round: {roundResults ? 'Enabled' : 'Disabled'}
        </button>
        <button
          type="button"
          onClick={onToggleIncludeEsic}
          className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
            includeEsic
              ? 'border-cyan-400 bg-cyan-400 text-slate-950'
              : isDark
                ? 'border-slate-600 text-slate-100 hover:border-slate-400'
                : 'border-slate-300 text-slate-800 hover:border-slate-400'
          }`}
        >
          ESIC: {includeEsic ? 'Included' : 'Excluded'}
        </button>
      </div>
    </div>
  )
}
