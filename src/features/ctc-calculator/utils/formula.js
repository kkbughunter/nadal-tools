const PF_PERCENTAGE = 12
const ESIC_PERCENTAGE = 3.25
const PF_RATE = PF_PERCENTAGE / 100
const ESIC_RATE = ESIC_PERCENTAGE / 100
const PF_THRESHOLD = 15000
const ESIC_THRESHOLD = 21000

const toRate = (percentageValue) => {
  const safeValue = Number.isFinite(percentageValue) ? percentageValue : 0
  const clamped = Math.min(Math.max(safeValue, 0), 100)
  return clamped / 100
}

export const calculateCtcComponents = (
  ctcValue,
  basicPercentageValue,
  hraPercentageValue,
  includeEsic = true,
  pfCapOption = 'full',
) => {
  const ctc = Number.isFinite(ctcValue) ? Math.max(ctcValue, 0) : 0
  const basicRate = toRate(basicPercentageValue)
  const hraRate = toRate(hraPercentageValue)

  const basic = ctc * basicRate
  const hra = basic * hraRate

  let special, employerPf, employerEsic

  const basicPlusSpecialMonthly = (basic + 0) / 12
  
  if (basicPlusSpecialMonthly <= PF_THRESHOLD) {
    const pfRate = PF_RATE
    const esicRate = includeEsic ? ESIC_RATE : 0
    special = (ctc - (1 + pfRate + esicRate) * basic - (1 + esicRate) * hra) / (1 + pfRate + esicRate)
    
    const basicPlusSpecial = basic + special
    employerPf = basicPlusSpecial * pfRate
    
    const totalForEsic = basic + hra + special
    employerEsic = (totalForEsic / 12 <= ESIC_THRESHOLD && includeEsic) ? totalForEsic * esicRate : 0
  } else {
    const pfBase = pfCapOption === 'basic' ? basic : PF_THRESHOLD * 12
    const pfRate = PF_RATE
    const esicRate = 0
    
    special = ctc - basic - hra - pfBase * pfRate
    employerPf = pfBase * pfRate
    employerEsic = 0

  }

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
    esicEligible: (basic + hra + special) / 12 <= ESIC_THRESHOLD && includeEsic,
    pfCapped: (basic + special) / 12 > PF_THRESHOLD,
  }
}
