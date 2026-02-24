const COMPONENT_LABELS = {
  EPF: 'EPF Employer Contribution',
  ESIC: 'ESIC Employer Contribution',
}

const toExportRows = (components) =>
  components
    .map((item) => ({
      component: COMPONENT_LABELS[item.component] ?? item.component,
      monthly: item.monthly,
      yearly: item.yearly,
    }))
    .filter((row) => row.yearly !== 0)

const createExportRows = (rows) => {
  const totalMonthly = rows.reduce((sum, row) => sum + row.monthly, 0)
  const totalYearly = rows.reduce((sum, row) => sum + row.yearly, 0)
  return [
    ['Component', 'Per Month', 'Per Annum'],
    ...rows.map((row) => [row.component, row.monthly, row.yearly]),
    ['Total CTC', totalMonthly, totalYearly],
  ]
}

const loadSheetJs = () =>
  new Promise((resolve, reject) => {
    if (window.XLSX) {
      resolve(window.XLSX)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
    script.async = true
    script.onload = () => {
      if (window.XLSX) {
        resolve(window.XLSX)
        return
      }
      reject(new Error('SheetJS failed to initialize.'))
    }
    script.onerror = () => reject(new Error('Failed to load SheetJS script.'))
    document.head.appendChild(script)
  })

export const exportCalculationToExcelCsv = async ({ components }) => {
  const XLSX = await loadSheetJs()
  const rows = toExportRows(components)
  const worksheet = XLSX.utils.aoa_to_sheet(createExportRows(rows))

  worksheet['!cols'] = [{ wch: 34 }, { wch: 16 }, { wch: 16 }]

  const lastRowNumber = rows.length + 2
  for (let rowNumber = 2; rowNumber <= lastRowNumber; rowNumber += 1) {
    for (const column of ['B', 'C']) {
      const cell = worksheet[`${column}${rowNumber}`]
      if (!cell) continue
      cell.z = '#,##0.00'
    }
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'CTC')
  XLSX.writeFile(workbook, 'ctc-calculation.xlsx')
  return 'Excel export downloaded.'
}
