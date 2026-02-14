export const formatMoney = (value, { rounded = false } = {}) =>
  new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: rounded ? 0 : 2,
    minimumFractionDigits: rounded ? 0 : 2,
  }).format(value)
