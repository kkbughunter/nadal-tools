export const ComponentsTable = ({
  isDark,
  ctc,
  components,
  basicPercentage,
  hraPercentage,
  includeEsic,
  esicEligible,
  pfCapped,
  pfCapOption,
  totalPercentage,
  monthlyTotal,
  formatMoney,
  onBasicPercentageChange,
  onHraPercentageChange,
}) => {
  const basicRow = components.find((row) => row.component === 'Basic')
  const handlePercentageChange = (value, onChange) => {
    if (value === '') {
      onChange(0)
      return
    }
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return
    onChange(Math.max(0, Math.min(parsed, 100)))
  }

  const getFormulaTooltip = (component) => {
    if (component === 'Basic') return 'Basic = CTC x Basic%'
    if (component === 'HRA') return 'HRA = Basic x HRA%'
    if (component === 'Special Allowance')
      return includeEsic
        ? 'Special = CTC - (Basic + HRA + EPF + ESIC)'
        : 'Special = CTC - (Basic + HRA + EPF)'
    if (component === 'EPF')
      return 'EPF = (Basic + Special) x 12% when <= 15000 monthly, else capped/base option x 12%'
    if (component === 'ESIC')
      return includeEsic
        ? 'ESIC = (Basic + HRA + Special) x 3.25% only when monthly total < 22804'
        : 'ESIC is excluded'
    return 'System calculated'
  }

  return (
    <div
      className={`mt-6 overflow-x-auto rounded-xl border ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}
    >
      <table className="w-full min-w-[640px] text-left">
        <thead
          className={`text-xs uppercase tracking-wider ${
            isDark ? 'bg-slate-800/60 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <tr>
            <th className="px-4 py-3">Component</th>
            <th className="px-4 py-3">Percentage (%)</th>
            <th className="px-4 py-3">Monthly</th>
            <th className="px-4 py-3">Yearly</th>
          </tr>
        </thead>
        <tbody>
          {components.map((item) => (
            <tr
              key={item.component}
              className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}
            >
              <td className="px-4 py-3">{item.component}</td>
              <td className="px-4 py-3" title={getFormulaTooltip(item.component)}>
                {item.component === 'Basic' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={basicPercentage}
                      onChange={(e) => handlePercentageChange(e.target.value, onBasicPercentageChange)}
                      className={`w-24 rounded-md border px-2 py-1.5 text-sm outline-none ring-cyan-400 focus:ring-2 ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-slate-100'
                          : 'border-slate-300 bg-white text-slate-900'
                      }`}
                    />
                    <span>%</span>
                  </div>
                ) : item.component === 'HRA' ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span>Basic {formatMoney(basicRow?.yearly ?? 0)} x</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={hraPercentage}
                      onChange={(e) => handlePercentageChange(e.target.value, onHraPercentageChange)}
                      className={`w-24 rounded-md border px-2 py-1.5 text-sm outline-none ring-cyan-400 focus:ring-2 ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-slate-100'
                          : 'border-slate-300 bg-white text-slate-900'
                      }`}
                    />
                    <span>%</span>
                  </div>
                ) : item.component === 'EPF' ? (
                  pfCapped ? `12% (${pfCapOption === 'basic' ? 'on Basic' : 'Restricted PF Wage'})` : '12% (fixed)'
                ) : item.component === 'ESIC' ? (
                  includeEsic ? (
                    esicEligible ? (
                      '3.25% (fixed)'
                    ) : (
                      <span className="text-red-500">3.25% (not eligible)</span>
                    )
                  ) : (
                    'Excluded'
                  )
                ) : (
                  'System calculated'
                )}
              </td>
              <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {formatMoney(item.monthly)}
              </td>
              <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {formatMoney(item.yearly)}
              </td>
            </tr>
          ))}
          <tr
            className={`border-t font-semibold ${
              isDark ? 'border-slate-700 bg-slate-800/40' : 'border-slate-300 bg-slate-100'
            }`}
          >
            <td className="px-4 py-3">Total</td>
            <td className="px-4 py-3">{totalPercentage.toFixed(2)}%</td>
            <td className="px-4 py-3">{formatMoney(monthlyTotal)}</td>
            <td className="px-4 py-3">{formatMoney(ctc)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
