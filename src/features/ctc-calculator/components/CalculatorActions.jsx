export const CalculatorActions = ({
  isDark,
  totalPercentage,
  onAddComponent,
  onReset,
  onCopyForWord,
  onExportExcel,
  onToggleTheme,
  copyStatus,
}) => (
  <>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onAddComponent}
          className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          + Add Component
        </button>
        <button
          type="button"
          onClick={onReset}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
            isDark
              ? 'border-slate-600 text-slate-100 hover:border-slate-400 hover:bg-slate-800'
              : 'border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-100'
          }`}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onCopyForWord}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
            isDark
              ? 'border-slate-600 text-slate-100 hover:border-slate-400 hover:bg-slate-800'
              : 'border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-100'
          }`}
        >
          Copy for Word
        </button>
        <button
          type="button"
          onClick={onExportExcel}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
            isDark
              ? 'border-slate-600 text-slate-100 hover:border-slate-400 hover:bg-slate-800'
              : 'border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-100'
          }`}
        >
          Export Excel
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
            isDark
              ? 'border-slate-600 text-slate-100 hover:border-slate-400 hover:bg-slate-800'
              : 'border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-100'
          }`}
        >
          {isDark ? 'Light Theme' : 'Dark Theme'}
        </button>
      </div>
      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        {Math.abs(totalPercentage - 100) < 0.001
          ? 'Total percentage is 100%.'
          : `Adjust percentages to 100% (current: ${totalPercentage.toFixed(2)}%).`}
      </p>
    </div>
    {copyStatus ? (
      <p className={`mt-3 text-sm ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
        {copyStatus}
      </p>
    ) : null}
  </>
)
