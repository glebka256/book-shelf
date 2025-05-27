/** Format percentage from value with fixed point */
export const calculatePercentage = (value: number, total: number, digits: number): string => {
  return total > 0 ? ((value / total) * 100).toFixed(digits) : '0'
}