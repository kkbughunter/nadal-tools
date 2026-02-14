const PF_PERCENTAGE = 12
const ESIC_PERCENTAGE = 3.25
const PF_RATE = PF_PERCENTAGE / 100
const ESIC_RATE = ESIC_PERCENTAGE / 100

const toRate = (percentageValue) => {
  const safeValue = Number.isFinite(percentageValue) ? percentageValue : 0
  const clamped = Math.min(Math.max(safeValue, 0), 100)
  return clamped / 100
}

export const calculateCtcComponents = (ctcValue, basicPercentageValue, hraPercentageValue) => {
  const ctc = Number.isFinite(ctcValue) ? Math.max(ctcValue, 0) : 0
  const basicRate = toRate(basicPercentageValue)
  const hraRate = toRate(hraPercentageValue)

  const basic = ctc * basicRate
  const hra = basic * hraRate

  const special =
    (ctc - (1 + PF_RATE + ESIC_RATE) * basic - (1 + ESIC_RATE) * hra) /
    (1 + PF_RATE + ESIC_RATE)

  const employerPf = (basic + special) * PF_RATE
  const employerEsic = (basic + hra + special) * ESIC_RATE

  const rows = [
    { component: 'Basic', yearly: basic, isSystemCalculated: false },
    { component: 'HRA', yearly: hra, isSystemCalculated: false },
    { component: 'Special Allowance', yearly: special, isSystemCalculated: true },
    { component: 'EPF', yearly: employerPf, isSystemCalculated: true },
    { component: 'ESIC', yearly: employerEsic, isSystemCalculated: true },
  ].map((row) => ({
    ...row,
    monthly: row.yearly / 12,
    percentage: ctc === 0 ? 0 : (row.yearly / ctc) * 100,
  }))

  return {
    rows,
    totalYearly: rows.reduce((sum, row) => sum + row.yearly, 0),
    totalMonthly: rows.reduce((sum, row) => sum + row.monthly, 0),
    totalPercentage: rows.reduce((sum, row) => sum + row.percentage, 0),
  }
}
