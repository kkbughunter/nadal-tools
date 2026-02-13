export const DEFAULT_CTC = 180000

export const commonComponentNames = [
  'Base',
  'HRA',
  'Special',
  'Conveyance',
  'Medical',
  'LTA',
  'PF',
  'ESI',
  'Gratuity',
  'Bonus',
]

export const defaultPercentageMap = {
  Base: 50,
  PF: 12,
  ESI: 3.25,
}

export const NON_DELETABLE_COMPONENTS = ['base', 'pf', 'esi']
export const TOP_COMPONENT_ORDER = ['base', 'pf', 'esi']

export const FIXED_PERCENTAGE_BY_NAME = {
  pf: 12,
  esi: 3.25,
}

export const normalizeComponentName = (name) => name.trim().toLowerCase()

export const isNonDeletableComponent = (name) =>
  NON_DELETABLE_COMPONENTS.includes(normalizeComponentName(name))

export const getFixedPercentage = (name) => {
  const key = normalizeComponentName(name)
  return Object.prototype.hasOwnProperty.call(FIXED_PERCENTAGE_BY_NAME, key)
    ? FIXED_PERCENTAGE_BY_NAME[key]
    : null
}

export const getComponentPriority = (name) => {
  const idx = TOP_COMPONENT_ORDER.indexOf(normalizeComponentName(name))
  return idx === -1 ? Number.POSITIVE_INFINITY : idx
}
