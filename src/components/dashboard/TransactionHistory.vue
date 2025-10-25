<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Moment
import moment from 'moment'

// Hooks
import useConvertDate from '@/hooks/useConvertDate'

// Chart Js
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// ----- START ----- //

// Generals
const store = useAppStore()
const { convertDate } = useConvertDate()

// Refs
const loading = ref(false)
const chartKey = ref(0)

// Chart

/**
 * Get Or Create Tooltip
 */
const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('.tooltipElement')

  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.classList.add('tooltipElement')

    tooltipEl.style.opacity = 1

    const div = document.createElement('div')

    const triangle = document.createElement('div')
    triangle.classList.add('triangle')

    tooltipEl.appendChild(div)

    tooltipEl.appendChild(triangle)
    chart.canvas.parentNode.appendChild(tooltipEl)
  }

  return tooltipEl
}

/**
 * Tooltip Handler
 */
const externalTooltipHandler = (context) => {
  // Tooltip Element
  const { chart, tooltip } = context
  const tooltipEl = getOrCreateTooltip(chart)

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0
    return
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || []
    const bodyLines = tooltip.body.map((b) => b.lines)

    const chartHeader = document.createElement('p')

    bodyLines.forEach((body, i) => {
      const splitedText = body[0].split(':')[1].trim()

      const text = document.createTextNode(`$${splitedText}`)
      const colors = tooltip.labelColors[i]
      tooltipEl.style.background = colors.backgroundColor

      const triangleElement = tooltipEl.querySelector('.triangle')
      triangleElement.style.background = colors.backgroundColor

      chartHeader.appendChild(text)
    })

    const chartBody = document.createElement('small')

    titleLines.forEach((title) => {
      const text = document.createTextNode(title)

      chartBody.appendChild(text)
    })

    const tableRoot = tooltipEl.querySelector('div')

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove()
    }

    // Add new children
    tableRoot.appendChild(chartHeader)
    tableRoot.appendChild(chartBody)
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1
  tooltipEl.style.left = positionX + tooltip.caretX + 'px'
  tooltipEl.style.top = positionY + tooltip.caretY + 'px'
  tooltipEl.style.font = tooltip.options.bodyFont.string
  tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px'
}

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Transactions',
      data: [],
      borderColor: '#6366f1',
      backgroundColor: '#6366f1',
      tension: 0.4,
      pointStyle: 'circle',
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2.5
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      enabled: false,
      position: 'nearest',
      external: externalTooltipHandler
    },
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      border: {
        display: false
      },
      grid: {
        display: false, // Hide vertical grid lines for cleaner look
        tickColor: ''
      },
      ticks: {
        padding: 16,
        color: (context) => {
          const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark'
          return isDark ? '#6b7280' : '#9ca3af'
        },
        font: {
          size: 13,
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }
      }
    },
    y: {
      border: {
        display: false
      },
      grid: {
        color: (context) => {
          const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark'
          return isDark ? 'rgba(45, 50, 51, 0.3)' : 'rgba(243, 244, 246, 0.8)' // Much more subtle
        },
        lineWidth: 1,
        tickColor: ''
      },
      ticks: {
        maxTicksLimit: 6,
        padding: 16,
        color: (context) => {
          const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark'
          return isDark ? '#6b7280' : '#9ca3af'
        },
        font: {
          size: 13,
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }
      }
    }
  }
})

// Functions

/**
 * Get Transaction History
 */
const getTransactionHistory = async () => {
  // Start Loading
  loading.value = true

  // Set Variable
  const someDaysAgo = moment().subtract(15, 'day').toDate()
  const toDay = moment().toDate()

  let content = {
    from_date: convertDate(someDaysAgo, 'YYYY-MM-DD'),
    to_date: convertDate(toDay, 'YYYY-MM-DD')
  }

  // Request
  await store.getTransactiosnHistory(content).then((res) => {
    if (res) {
      chartData.value.labels = res.labels
      chartData.value.datasets[0].data = res.data

      chartKey.value++
    }
  })

  // Stop Loading
  loading.value = false
}

onMounted(() => {
  getTransactionHistory()
})
</script>

<template>
  <div class="premium-chart-card">
    <div class="chart-header">
      <h3 class="chart-title">Transaction History</h3>
      <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
    </div>

    <div class="chart-container">
      <Line :key="chartKey" id="my-chart-id" :options="chartOptions" :data="chartData" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-chart-card {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.chart-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.3;
}

.chart-container {
  height: 400px;
  position: relative;

  @media (max-width: 768px) {
    height: 300px;
  }
}

[data-bs-theme="dark"] .chart-container {
  // Add subtle gradient background for depth
  background: linear-gradient(180deg, rgba(26, 29, 30, 0) 0%, rgba(15, 16, 17, 0.3) 100%);
  border-radius: 0.5rem;
}

// ===== DARK MODE STYLES =====
[data-bs-theme="dark"] {
  .premium-chart-card {
    background: #1a1d1e;
    border-color: #2d3233;
  }

  .chart-title {
    color: #f3f4f6;
  }
}
</style>

<style lang="scss">
// Dark mode for chart grid lines
[data-bs-theme="dark"] {
  #my-chart-id {
    canvas {
      color: #f3f4f6;
    }
  }
}
</style>
