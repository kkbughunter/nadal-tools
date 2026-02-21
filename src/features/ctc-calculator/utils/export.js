const buildCalculationRows = (components) =>
  components.map((item) => ({
    component: item.component,
    monthly: item.monthly,
    yearly: item.yearly,
  }))

const csvEscape = (value) => {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replaceAll('"', '""')}"`
  }
  return str
}

export const exportCalculationToExcelCsv = ({ components }) => {
  const rows = buildCalculationRows(components).filter((row) => row.yearly !== 0)
  const header = 'Component Name,Monthly,Yearly'
  const lines = rows.map((row) =>
    [
      csvEscape(row.component),
      row.monthly.toFixed(2),
      row.yearly.toFixed(2),
    ].join(','),
  )
  const csvContent = [header, ...lines].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'ctc-calculation.csv'
  link.click()
  URL.revokeObjectURL(url)
  return 'Excel export downloaded.'
}
