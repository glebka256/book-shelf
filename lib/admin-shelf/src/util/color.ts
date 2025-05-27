/** Utility function to generate a palette of colors */
export const generateColors = (count: number): string[] => {
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
    '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56'
  ]
  
  if (count <= colors.length) {
    return colors.slice(0, count)
  }
  
  // Generate additional colors using HSL
  const generatedColors = []
  for (let i = 0; i < count; i++) {
    const hue = (i * 360 / count) % 360
    generatedColors.push(`hsl(${hue}, 70%, 60%)`)
  }
  
  return generatedColors
}

/** Utility function to adjust color brightness by percentage */
export const adjustBrightness = (color: string, percent: number): string => {
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const num = parseInt(hex, 16)
    const r = Math.min(255, Math.max(0, (num >> 16) + percent))
    const g = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + percent))
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }
  return color
}