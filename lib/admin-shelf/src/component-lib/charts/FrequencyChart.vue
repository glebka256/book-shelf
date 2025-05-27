<script setup lang="ts">
import { defineProps, PropType, ref, onMounted, watch, computed } from 'vue'
import { Chart, ChartConfiguration, registerables } from 'chart.js'

Chart.register(...registerables)

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

const props = defineProps({
  title: {
    type: String,
    default: undefined
  },
  data: {
    type: Array as PropType<ChartFrequency[]>,
    required: true
  },
  config: {
    type: Object as PropType<ChartConfig>,
    default: () => ({})
  },
  maxWidth: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: 500
  }
});

// Default configuration
const defaultConfig: ChartConfig = {
  title: 'Frequency Timeline',
  datasetLabel: 'Count',
  yAxisLabel: 'Count',
  xAxisLabel: 'Time',
  color: 'rgb(99, 102, 241)',
  backgroundColor: 'rgba(99, 102, 241, 0.1)'
}

// Merge user config with defaults
const chartConfig = { ...defaultConfig, ...props.config }

/** Computed style for container */
const containerStyle = computed(() => ({
  maxWidth: typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}))

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const createChart = () => {
  if (!chartRef.value) return
  
  const sortedData = [...props.data].sort((a, b) => a.time - b.time)
 
  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels: sortedData.map(item => item.time.toString()),
      datasets: [{
        label: chartConfig.datasetLabel,
        data: sortedData.map(item => item.count),
        borderColor: chartConfig.color,
        backgroundColor: chartConfig.backgroundColor,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartConfig.color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: chartConfig.xAxisLabel
          },
          grid: {
            display: false
          }
        },
        y: {
          title: {
            display: true,
            text: chartConfig.yAxisLabel
          },
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: (context) => `${context[0].label}`,
            label: (context) => `${context.parsed.y} ${chartConfig.datasetLabel?.toLowerCase() || 'items'}`
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  }
  
  chartInstance = new Chart(chartRef.value, config)
}

const updateChart = () => {
  if (!chartInstance) return
  
  const sortedData = [...props.data].sort((a, b) => a.time - b.time)
 
  chartInstance.data.labels = sortedData.map(item => item.time.toString())
  chartInstance.data.datasets[0].data = sortedData.map(item => item.count)
  chartInstance.update()
}

onMounted(() => {
  createChart()
})

watch(() => props.data, () => {
  updateChart()
}, { deep: true })

watch(() => props.config, () => {
  // Recreate chart when config changes
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
  createChart()
}, { deep: true })
</script>

<template>
  <div class="frequency-chart">
    <h2 v-if="props.title">{{ props.title }}</h2>
    <div class="chart-container" :style="containerStyle">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<style scoped>
.frequency-chart {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.frequency-chart h2 {
  text-align: center;
  color: #374151;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
}

.chart-container {
  position: relative;
  height: 100%;
}

canvas {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
}
</style>