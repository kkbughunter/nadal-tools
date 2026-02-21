const PF_PERCENTAGE = 12
const ESIC_PERCENTAGE = 3.25
const PF_RATE = PF_PERCENTAGE / 100
const ESIC_RATE = ESIC_PERCENTAGE / 100
const PF_THRESHOLD = 15000
const ESIC_THRESHOLD = 22804
const MONTHS_IN_YEAR = 12
const EPSILON = 0.000001

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

  const pfThresholdYearly = PF_THRESHOLD * MONTHS_IN_YEAR
  const monthlyTotal = ctc / MONTHS_IN_YEAR
  const cappedPfBaseYearly = pfCapOption === 'basic' ? basic : pfThresholdYearly

  const solveSpecial = (useUncappedPf, useEsic) => {
    if (useUncappedPf && useEsic) {
      const denominator = 1 + PF_RATE + ESIC_RATE
      return (
        (ctc - basic * (1 + PF_RATE + ESIC_RATE) - hra * (1 + ESIC_RATE)) /
        denominator
      )
    }

    if (useUncappedPf && !useEsic) {
      const denominator = 1 + PF_RATE
      return (ctc - basic * (1 + PF_RATE) - hra) / denominator
    }

    if (!useUncappedPf && useEsic) {
      const fixedPf = cappedPfBaseYearly * PF_RATE
      const denominator = 1 + ESIC_RATE
      return (ctc - basic - hra - fixedPf - (basic + hra) * ESIC_RATE) / denominator
    }

    const fixedPf = cappedPfBaseYearly * PF_RATE
    return ctc - basic - hra - fixedPf
  }

  const buildCandidate = (useUncappedPf, useEsic) => {
    const special = solveSpecial(useUncappedPf, useEsic)
    if (!Number.isFinite(special)) return null

    const pfBaseYearly = useUncappedPf ? basic + special : cappedPfBaseYearly
    const employerPf = pfBaseYearly * PF_RATE

    const esicBaseYearly = basic + hra + special
    const employerEsic = useEsic ? esicBaseYearly * ESIC_RATE : 0

    const uncappedPfAllowed = basic + special <= pfThresholdYearly + EPSILON
    const cappedPfRequired = basic + special > pfThresholdYearly - EPSILON
    const esicWithinLimit = monthlyTotal < ESIC_THRESHOLD - EPSILON

    if (useUncappedPf && !uncappedPfAllowed) return null
    if (!useUncappedPf && !cappedPfRequired) return null
    if (useEsic && (!includeEsic || !esicWithinLimit)) return null
    if (!useEsic && includeEsic && esicWithinLimit) return null

    const total = basic + hra + special + employerPf + employerEsic

    return {
      special,
      employerPf,
      employerEsic,
      esicEligible: includeEsic && esicWithinLimit,
      pfCapped: basic + special > pfThresholdYearly + EPSILON,
      residual: Math.abs(ctc - total),
    }
  }

  const candidates = [
    buildCandidate(true, includeEsic),
    buildCandidate(true, false),
    buildCandidate(false, includeEsic),
    buildCandidate(false, false),
  ].filter(Boolean)

  const bestMatch =
    candidates.sort((a, b) => a.residual - b.residual)[0] ?? {
      special: ctc - basic - hra,
      employerPf: 0,
      employerEsic: 0,
      esicEligible: false,
      pfCapped: false,
    }

  const { special, employerPf, employerEsic, esicEligible, pfCapped } = bestMatch

  const rows = [
    { component: 'Basic', yearly: basic, isSystemCalculated: false },
    { component: 'HRA', yearly: hra, isSystemCalculated: false },
    { component: 'Special Allowance', yearly: special, isSystemCalculated: true },
    { component: 'EPF', yearly: employerPf, isSystemCalculated: true },
    { component: 'ESIC', yearly: employerEsic, isSystemCalculated: true },
  ].map((row) => ({
    ...row,
    monthly: row.yearly / MONTHS_IN_YEAR,
    percentage: ctc === 0 ? 0 : (row.yearly / ctc) * 100,
  }))

  return {
    rows,
    totalYearly: rows.reduce((sum, row) => sum + row.yearly, 0),
    totalMonthly: rows.reduce((sum, row) => sum + row.monthly, 0),
    totalPercentage: rows.reduce((sum, row) => sum + row.percentage, 0),
    esicEligible,
    pfCapped,
  }
}
