import { useMemo, useState } from 'react'
import {
  getComponentPriority,
  getFixedPercentage,
  isNonDeletableComponent,
} from '../constants'

export const ComponentsTable = ({
  isDark,
  ctc,
  components,
  totalPercentage,
  monthlyTotal,
  formatMoney,
  onUpdateComponent,
  onRemoveComponent,
}) => {
  const [percentageDrafts, setPercentageDrafts] = useState({})

  const sortedComponents = useMemo(
    () =>
      [...components].sort(
        (a, b) => getComponentPriority(a.name) - getComponentPriority(b.name),
      ),
    [components],
  )

  const updateDraft = (id, value) => {
    setPercentageDrafts((prev) => ({ ...prev, [id]: value }))
  }

  const clearDraft = (id) => {
    setPercentageDrafts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
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
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedComponents.map((item) => {
            const fixedPercentage = getFixedPercentage(item.name)
            const effectivePercentage = fixedPercentage ?? item.percentage
            const isLocked = isNonDeletableComponent(item.name)
            const yearly = (ctc * effectivePercentage) / 100
            const monthly = yearly / 12
            const displayPercentage =
              percentageDrafts[item.id] ?? String(effectivePercentage)

            return (
              <tr
                key={item.id}
                className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={item.name}
                    disabled={isLocked}
                    onChange={(e) => onUpdateComponent(item.id, 'name', e.target.value)}
                    className={`w-full rounded-md border px-2 py-1.5 text-sm outline-none ring-cyan-400 focus:ring-2 ${
                      isDark
                        ? 'border-slate-700 bg-slate-950'
                        : 'border-slate-300 bg-white text-slate-900'
                    }`}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={displayPercentage}
                    disabled={fixedPercentage !== null}
                    onChange={(e) => {
                      const value = e.target.value
                      updateDraft(item.id, value)
                      if (value === '') return
                      const parsed = Number(value)
                      if (!Number.isFinite(parsed)) return
                      onUpdateComponent(item.id, 'percentage', parsed)
                    }}
                    onBlur={() => {
                      const value = percentageDrafts[item.id]
                      if (value === '') onUpdateComponent(item.id, 'percentage', 0)
                      clearDraft(item.id)
                    }}
                    className={`w-32 rounded-md border px-2 py-1.5 text-sm outline-none ring-cyan-400 focus:ring-2 ${
                      isDark
                        ? 'border-slate-700 bg-slate-950'
                        : 'border-slate-300 bg-white text-slate-900'
                    }`}
                  />
                </td>
                <td
                  className={`px-4 py-3 text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
                >
                  {formatMoney(monthly)}
                </td>
                <td
                  className={`px-4 py-3 text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
                >
                  {formatMoney(yearly)}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onRemoveComponent(item.id)}
                    disabled={components.length <= 1 || isLocked}
                    aria-label={`Remove ${item.name}`}
                    className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                      isDark
                        ? 'border-rose-500/50 text-rose-300 hover:bg-rose-950/40'
                        : 'border-rose-300 text-rose-700 hover:bg-rose-50'
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M9 3.75A2.25 2.25 0 0 1 11.25 1.5h1.5A2.25 2.25 0 0 1 15 3.75V4.5h3.75a.75.75 0 0 1 0 1.5h-.69l-.8 13.24A2.25 2.25 0 0 1 15.01 21H8.99a2.25 2.25 0 0 1-2.25-1.76L5.94 6H5.25a.75.75 0 0 1 0-1.5H9v-.75Zm1.5.75h3v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v.75ZM9.75 9a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0V9Zm4.5 0a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0V9Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            )
          })}
          <tr
            className={`border-t font-semibold ${
              isDark ? 'border-slate-700 bg-slate-800/40' : 'border-slate-300 bg-slate-100'
            }`}
          >
            <td className="px-4 py-3">Total</td>
            <td
              className={`px-4 py-3 ${
                Math.abs(totalPercentage - 100) < 0.001
                  ? isDark
                    ? 'text-emerald-300'
                    : 'text-emerald-700'
                  : isDark
                    ? 'text-amber-300'
                    : 'text-amber-700'
              }`}
            >
              <span
                className={`rounded-md px-2 py-1 ${
                  Math.abs(totalPercentage - 100) < 0.001
                    ? isDark
                      ? 'bg-emerald-500/20'
                      : 'bg-emerald-100'
                    : isDark
                      ? 'bg-amber-500/20'
                      : 'bg-amber-100'
                }`}
              >
                {totalPercentage.toFixed(2)}%
              </span>
            </td>
            <td className="px-4 py-3">{formatMoney(monthlyTotal)}</td>
            <td className="px-4 py-3">{formatMoney(ctc)}</td>
            <td className="px-4 py-3">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
