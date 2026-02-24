import { useState } from 'react'

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
  const [showSystemCalc, setShowSystemCalc] = useState(false)
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

  return (
    <>
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
          {components.filter(item => item.component !== 'ESIC' || esicEligible).map((item) => (
            <tr
              key={item.component}
              className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}
            >
              <td className="px-4 py-3">{item.component}</td>
              <td className="px-4 py-3">
                {item.component === 'Basic' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={basicPercentage}
                      onChange={(e) => handlePercentageChange(e.target.value, onBasicPercentageChange)}
                      className={`w-16 rounded-md border px-2 py-1.5 text-sm outline-none ring-cyan-400 focus:ring-2 ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-slate-100'
                          : 'border-slate-300 bg-white text-slate-900'
                      }`}
                    />
                    <span>%</span>
                  </div>
                ) : item.component === 'HRA' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={hraPercentage}
                      onChange={(e) => handlePercentageChange(e.target.value, onHraPercentageChange)}
                      className={`w-16 rounded-md border px-2 py-1.5 text-sm outline-none ring-cyan-400 focus:ring-2 ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-slate-100'
                          : 'border-slate-300 bg-white text-slate-900'
                      }`}
                    />
                    <span>%</span>
                  </div>
                ) : item.component === 'Special Allowance' ? (
                  <button
                    type="button"
                    onClick={() => setShowSystemCalc(!showSystemCalc)}
                    className={`text-sm font-medium underline transition ${
                      isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
                    }`}
                  >
                    {showSystemCalc ? 'Hide' : 'Preview'} 
                  </button>
                ) : item.component === 'EPF' ? (
                  pfCapped ? `${pfCapOption === 'basic' ? 'On Basic' : 'Restricted PF Wage'}` : 'Fixed'
                ) : item.component === 'ESIC' ? (
                  includeEsic ? (
                    esicEligible ? (
                      'Fixed'
                    ) : (
                      <span className="text-red-500">Not eligible</span>
                    )
                  ) : (
                    'Excluded'
                  )
                ) : (
                  'System calculated'
                )}
              </td>
              <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {showSystemCalc || item.component === 'Basic' || item.component === 'HRA'
                  ? formatMoney(item.monthly)
                  : '—'}
              </td>
              <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {showSystemCalc || item.component === 'Basic' || item.component === 'HRA'
                  ? formatMoney(item.yearly)
                  : '—'}
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
    </>
  )
}
