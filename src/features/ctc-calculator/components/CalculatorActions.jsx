export const CalculatorActions = ({
  isDark,
  onReset,
  onExportExcel,
  copyStatus,
}) => (
  <>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
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
          onClick={onExportExcel}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
            isDark
              ? 'border-slate-600 text-slate-100 hover:border-slate-400 hover:bg-slate-800'
              : 'border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-100'
          }`}
        >
          Export Excel
        </button>
        {/* <button
          type="button"
          onClick={onToggleTheme}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
            isDark
              ? 'border-slate-600 text-slate-100 hover:border-slate-400 hover:bg-slate-800'
              : 'border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-100'
          }`}
        >
          {isDark ? 'Light Theme' : 'Dark Theme'}
        </button> */}
      </div>
    </div>
    {copyStatus ? (
      <p className={`mt-3 text-sm ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
        {copyStatus}
      </p>
    ) : null}
  </>
)
