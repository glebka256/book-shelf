<script setup lang="ts">
import { defineProps, PropType, ref, onMounted, watch, computed } from 'vue'
import { Chart, ChartConfiguration, registerables } from 'chart.js'
import { ChartDistribution, PieChartConfig, defaultPieConfig } from './pieChart.types';
import { generateColors, adjustBrightness } from '@/util/color';

Chart.register(...registerables)

const props = defineProps({
  title: {
    type: String,
    default: undefined
  },
  data: {
    type: Array as PropType<ChartDistribution[]>,
    required: true
  },
  config: {
    type: Object as PropType<PieChartConfig>,
    default: () => ({})
  },
  maxWidth: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: 400
  }
});

// Merge user config with defaults
const chartConfig = { ...defaultPieConfig, ...props.config }

/** Computed style for container */
const containerStyle = computed(() => ({
  maxWidth: typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}))

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const createChart = () => {
  if (!chartRef.value) return
  
  // Sort data by value in descending order for better visual hierarchy
  const sortedData = [...props.data].sort((a, b) => b.value - a.value)
  
  // Generate colors if not provided
  const colors = chartConfig.colors && chartConfig.colors.length >= sortedData.length 
    ? chartConfig.colors 
    : generateColors(sortedData.length)
  
  const config: ChartConfiguration = {
    type: 'pie',
    data: {
      labels: sortedData.map(item => item.label),
      datasets: [{
        data: sortedData.map(item => item.value),
        backgroundColor: colors,
        borderColor: chartConfig.borderColor,
        borderWidth: chartConfig.borderWidth,
        hoverBackgroundColor: colors.map(color => adjustBrightness(color, 20)),
        hoverBorderColor: chartConfig.hoverBorderColor,
        hoverBorderWidth: chartConfig.hoverBorderWidth
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: chartConfig.showLegend,
          position: chartConfig.legendPosition,
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            // Do not touch this tooltip formating
            label: (context) => {
              const total = context.dataset.data.reduce((a: number, b: any) => {
                const value = typeof b === 'number' ? b : 0
                return a + value
              }, 0)
              const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0'
              return `${context.label}: ${context.parsed} (${percentage}%)`
            }
          }
        }
      },
      interaction: {
        intersect: true
      }
    }
  }
  
  chartInstance = new Chart(chartRef.value, config)
}

const updateChart = () => {
  if (!chartInstance) return
  
  const sortedData = [...props.data].sort((a, b) => b.value - a.value)
  
  // Generate colors if not provided
  const colors = chartConfig.colors && chartConfig.colors.length >= sortedData.length 
    ? chartConfig.colors 
    : generateColors(sortedData.length)
  
  chartInstance.data.labels = sortedData.map(item => item.label)
  chartInstance.data.datasets[0].data = sortedData.map(item => item.value)
  chartInstance.data.datasets[0].backgroundColor = colors
  chartInstance.data.datasets[0].hoverBackgroundColor = colors.map(color => adjustBrightness(color, 20))
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

// Cleanup on unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<template>
  <div class="pie-chart">
    <h2 v-if="props.title">{{ props.title }}</h2>
    <div class="chart-container" :style="containerStyle">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<style scoped>
.pie-chart {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.pie-chart h2 {
  text-align: center;
  color: #374151;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
}

.chart-container {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  max-width: 100%;
  max-height: 100%;
}
</style>