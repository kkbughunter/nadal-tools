import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'ctc-calculator-settings'
const THEME_KEY = 'ctc-calculator-theme'
const DEFAULT_CTC = 1000000

const commonComponentNames = [
  'Base',
  'HRA',
  'Special',
  'Conveyance',
  'Medical',
  'LTA',
  'PF',
  'Gratuity',
  'Bonus',
]

const defaultPercentageMap = {
  Base: 50,
  HRA: 25,
  Special: 25,
}

const createDefaultComponents = () =>
  commonComponentNames.map((name) => ({
    id: crypto.randomUUID(),
    name,
    percentage: defaultPercentageMap[name] ?? 0,
  }))

const getInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { ctc: DEFAULT_CTC, components: createDefaultComponents() }
    }

    const parsed = JSON.parse(raw)
    const ctc =
      typeof parsed?.ctc === 'number' && parsed.ctc >= 0 ? parsed.ctc : DEFAULT_CTC

    const components =
      Array.isArray(parsed?.components) && parsed.components.length > 0
        ? parsed.components.map((item, index) => ({
            id:
              typeof item?.id === 'string' && item.id.length > 0
                ? item.id
                : crypto.randomUUID(),
            name:
              typeof item?.name === 'string' && item.name.trim().length > 0
                ? item.name
                : `Component ${index + 1}`,
            percentage:
              typeof item?.percentage === 'number' && Number.isFinite(item.percentage)
                ? item.percentage
                : 0,
          }))
        : createDefaultComponents()

    return { ctc, components }
  } catch {
    return { ctc: DEFAULT_CTC, components: createDefaultComponents() }
  }
}

const getInitialTheme = () => {
  const saved = localStorage.getItem(THEME_KEY)
  return saved === 'dark' ? 'dark' : 'light'
}

function App() {
  const [initialState] = useState(getInitialState)
  const [ctc, setCtc] = useState(initialState.ctc)
  const [components, setComponents] = useState(initialState.components)
  const [theme, setTheme] = useState(getInitialTheme)
  const [copyStatus, setCopyStatus] = useState('')
  const isDark = theme === 'dark'

  useEffect(() => {
    const payload = JSON.stringify({ ctc, components })
    localStorage.setItem(STORAGE_KEY, payload)
  }, [ctc, components])

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const totalPercentage = useMemo(
    () =>
      components.reduce(
        (sum, item) => sum + (Number.isFinite(item.percentage) ? item.percentage : 0),
        0,
      ),
    [components],
  )

  const monthlyTotal = useMemo(() => ctc / 12, [ctc])

  const updateComponent = (id, key, value) => {
    setComponents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
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
      return prev.filter((item) => item.id !== id)
    })
  }

  const resetCalculator = () => {
    setCtc(DEFAULT_CTC)
    setComponents(createDefaultComponents())
    setCopyStatus('')
  }

  const formatMoney = (value) =>
    new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value)

  const buildCalculationRows = () =>
    components.map((item) => {
      const yearly = (ctc * item.percentage) / 100
      const monthly = yearly / 12
      return {
        component: item.name,
        percentage: item.percentage,
        monthly,
        yearly,
      }
    })

  const buildWordHtml = () => {
    const rows = buildCalculationRows()
    const tableRows = rows
      .map(
        (row) => `<tr>
  <td>${row.component}</td>
  <td>${row.percentage.toFixed(2)}%</td>
  <td>${formatMoney(row.monthly)}</td>
  <td>${formatMoney(row.yearly)}</td>
</tr>`,
      )
      .join('')

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>CTC Calculation</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; }
    h1 { font-size: 20px; margin-bottom: 8px; }
    p { margin: 0 0 12px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #777; padding: 8px; text-align: left; }
    th { background: #f2f2f2; }
    .total { font-weight: 700; }
  </style>
</head>
<body>
  <h1>CTC to Salary Calculation</h1>
  <p><strong>CTC (Yearly):</strong> ${formatMoney(ctc)}</p>
  <table>
    <thead>
      <tr>
        <th>Component</th>
        <th>Percentage (%)</th>
        <th>Monthly</th>
        <th>Yearly</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
      <tr class="total">
        <td>Total</td>
        <td>${totalPercentage.toFixed(2)}%</td>
        <td>${formatMoney(monthlyTotal)}</td>
        <td>${formatMoney(ctc)}</td>
      </tr>
    </tbody>
  </table>
</body>
</html>`
  }

  const buildPlainText = () => {
    const rows = buildCalculationRows()
    return [
      `CTC (Yearly)\t${formatMoney(ctc)}`,
      '',
      'Component\tPercentage (%)\tMonthly\tYearly',
      ...rows.map(
        (row) =>
          `${row.component}\t${row.percentage.toFixed(2)}\t${formatMoney(
            row.monthly,
          )}\t${formatMoney(row.yearly)}`,
      ),
      `Total\t${totalPercentage.toFixed(2)}%\t${formatMoney(
        monthlyTotal,
      )}\t${formatMoney(ctc)}`,
    ].join('\n')
  }

  const copyForWord = async () => {
    try {
      const html = buildWordHtml()
      const text = buildPlainText()
      if (window.ClipboardItem && navigator.clipboard?.write) {
        const item = new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' }),
        })
        await navigator.clipboard.write([item])
      } else {
        await navigator.clipboard.writeText(text)
      }
      setCopyStatus('Copied as formatted table. Paste into Word.')
    } catch {
      setCopyStatus('Copy failed. Please try again.')
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
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <img
            src="https://nadalbusiness.com/images/logo2.png"
            alt="Nadal logo"
            className="h-10 w-auto sm:h-12"
          />
          <h1 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Nadal CTC to Salary Calculator
          </h1>
          <div className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden="true" />
        </div>

        <div className="mt-6 grid gap-2 sm:max-w-sm">
          <label
            htmlFor="ctc"
            className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
          >
            CTC (Yearly)
          </label>
          <input
            id="ctc"
            type="number"
            min="0"
            value={ctc}
            onChange={(e) => setCtc(Number(e.target.value) || 0)}
            className={`rounded-lg border px-3 py-2 text-sm outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring-2 ${
              isDark
                ? 'border-slate-700 bg-slate-950'
                : 'border-slate-300 bg-white text-slate-900'
            }`}
          />
        </div>

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
              {components.map((item) => {
                const yearly = (ctc * item.percentage) / 100
                const monthly = yearly / 12

                return (
                  <tr
                    key={item.id}
                    className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateComponent(item.id, 'name', e.target.value)}
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
                        value={item.percentage}
                        onChange={(e) =>
                          updateComponent(
                            item.id,
                            'percentage',
                            Number(e.target.value) || 0,
                          )
                        }
                        className={`w-32 rounded-md border px-2 py-1.5 text-sm outline-none ring-cyan-400 focus:ring-2 ${
                          isDark
                            ? 'border-slate-700 bg-slate-950'
                            : 'border-slate-300 bg-white text-slate-900'
                        }`}
                      />
                    </td>
                    <td
                      className={`px-4 py-3 text-sm ${
                        isDark ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      {formatMoney(monthly)}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm ${
                        isDark ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      {formatMoney(yearly)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => removeComponent(item.id)}
                        disabled={components.length <= 1}
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

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={addComponent}
              className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              + Add Component
            </button>
            <button
              type="button"
              onClick={resetCalculator}
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
              onClick={copyForWord}
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
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
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
      </section>
    </main>
  )
}

export default App
