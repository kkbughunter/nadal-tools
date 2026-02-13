export const CtcInput = ({ ctc, isDark, onChange }) => (
  <div className="mt-6 flex flex-wrap items-center gap-3">
    <label
      htmlFor="ctc"
      className={`text-base font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
    >
      CTC (Yearly)
    </label>
    <input
      id="ctc"
      type="number"
      min="0"
      value={ctc}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className={`w-full max-w-xs rounded-lg border px-4 py-2.5 text-base outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring-2 ${
        isDark
          ? 'border-slate-700 bg-slate-950'
          : 'border-slate-300 bg-white text-slate-900'
      }`}
    />
  </div>
)
