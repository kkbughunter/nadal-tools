import { getComponentPriority } from '../constants'

const buildCalculationRows = (components, ctc) =>
  [...components]
    .sort((a, b) => getComponentPriority(a.name) - getComponentPriority(b.name))
    .map((item) => {
    const yearly = (ctc * item.percentage) / 100
    const monthly = yearly / 12
    return {
      component: item.name,
      percentage: item.percentage,
      monthly,
      yearly,
    }
  })

const buildWordHtml = ({
  ctc,
  components,
  totalPercentage,
  monthlyTotal,
  formatMoney,
}) => {
  const rows = buildCalculationRows(components, ctc)
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
    p { margin: 0 0 12px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #777; padding: 8px; text-align: left; }
    th { background: #f2f2f2; }
    .total { font-weight: 700; }
  </style>
</head>
<body>
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

const buildPlainText = ({
  ctc,
  components,
  totalPercentage,
  monthlyTotal,
  formatMoney,
}) => {
  const rows = buildCalculationRows(components, ctc)
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

export const copyCalculationForWord = async (payload) => {
  try {
    const html = buildWordHtml(payload)
    const text = buildPlainText(payload)
    if (window.ClipboardItem && navigator.clipboard?.write) {
      const item = new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([text], { type: 'text/plain' }),
      })
      await navigator.clipboard.write([item])
    } else {
      await navigator.clipboard.writeText(text)
    }
    return 'Copied as formatted table. Paste into Word.'
  } catch {
    return 'Copy failed. Please try again.'
  }
}
