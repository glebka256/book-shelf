export interface ChartFrequency {
  time: number
  count: number
}

/** Configuration interface for customizing the chart */
export interface ChartConfig {
  title?: string
  datasetLabel?: string
  yAxisLabel?: string
  xAxisLabel?: string
  color?: string
  backgroundColor?: string
}

export const defaultConfig: ChartConfig = {
  title: 'Frequency Timeline',
  datasetLabel: 'Count',
  yAxisLabel: 'Count',
  xAxisLabel: 'Time',
  color: 'rgb(99, 102, 241)',
  backgroundColor: 'rgba(99, 102, 241, 0.1)'
}