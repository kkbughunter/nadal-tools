import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'ctc-calculator-settings'

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

const defaultComponents = commonComponentNames.map((name) => ({
  id: crypto.randomUUID(),
  name,
  percentage: defaultPercentageMap[name] ?? 0,
}))

const getInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { ctc: 1000000, components: defaultComponents }
    }

    const parsed = JSON.parse(raw)
    const ctc =
      typeof parsed?.ctc === 'number' && parsed.ctc >= 0 ? parsed.ctc : 1000000

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
        : defaultComponents

    return { ctc, components }
  } catch {
    return { ctc: 1000000, components: defaultComponents }
  }
}

function App() {
  const [initialState] = useState(getInitialState)
  const [ctc, setCtc] = useState(initialState.ctc)
  const [components, setComponents] = useState(initialState.components)
  const [copyStatus, setCopyStatus] = useState('')

  useEffect(() => {
    const payload = JSON.stringify({ ctc, components })
    localStorage.setItem(STORAGE_KEY, payload)
  }, [ctc, components])

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
      setCopyStatus('Copy failed. Use Download Word instead.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-8">
      <section className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/60 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          CTC to Salary Calculator
        </h1>

        <div className="mt-6 grid gap-2 sm:max-w-sm">
          <label htmlFor="ctc" className="text-sm font-medium text-slate-300">
            CTC (Yearly)
          </label>
          <input
            id="ctc"
            type="number"
            min="0"
            value={ctc}
            onChange={(e) => setCtc(Number(e.target.value) || 0)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring-2"
          />
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-slate-800/60 text-xs uppercase tracking-wider text-slate-300">
              <tr>
                <th className="px-4 py-3">Component</th>
                <th className="px-4 py-3">Percentage (%)</th>
                <th className="px-4 py-3">Monthly</th>
                <th className="px-4 py-3">Yearly</th>
              </tr>
            </thead>
            <tbody>
              {components.map((item) => {
                const yearly = (ctc * item.percentage) / 100
                const monthly = yearly / 12

                return (
                  <tr key={item.id} className="border-t border-slate-800">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateComponent(item.id, 'name', e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm outline-none ring-cyan-400 focus:ring-2"
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
                        className="w-32 rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm outline-none ring-cyan-400 focus:ring-2"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-200">
                      {formatMoney(monthly)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-200">
                      {formatMoney(yearly)}
                    </td>
                  </tr>
                )
              })}
              <tr className="border-t border-slate-700 bg-slate-800/40 font-semibold">
                <td className="px-4 py-3">Total</td>
                <td
                  className={`px-4 py-3 ${
                    Math.abs(totalPercentage - 100) < 0.001
                      ? 'text-emerald-300'
                      : 'text-amber-300'
                  }`}
                >
                  {totalPercentage.toFixed(2)}%
                </td>
                <td className="px-4 py-3">{formatMoney(monthlyTotal)}</td>
                <td className="px-4 py-3">{formatMoney(ctc)}</td>
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
              onClick={copyForWord}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-400 hover:bg-slate-800"
            >
              Copy for Word
            </button>
          </div>
          <p className="text-sm text-slate-300">
            {Math.abs(totalPercentage - 100) < 0.001
              ? 'Total percentage is 100%.'
              : `Adjust percentages to 100% (current: ${totalPercentage.toFixed(2)}%).`}
          </p>
        </div>
        {copyStatus ? <p className="mt-3 text-sm text-cyan-300">{copyStatus}</p> : null}
      </section>
    </main>
  )
}

export default App
