<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Moment
import moment from 'moment'

// Hooks
import useConvertDate from '@/composables/useConvertDate'

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
      borderColor: '#0062FF',
      backgroundColor: '#0062FF',
      tension: 0.5,
      pointStyle: 'circle'
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
        color: '#F1F1F5',
        tickColor: ''
      },
      ticks: {
        padding: 24,
        color: '#ABB6BA',
        font: {
          size: '14px'
        }
      }
    },
    y: {
      border: {
        display: false
      },
      grid: {
        display: false,
        drawOnChartArea: false,
        drawTicks: false
      },
      ticks: {
        maxTicksLimit: 6,
        padding: 24,
        color: '#92929D',
        font: {
          size: '14px'
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
  <div class="card">
    <!-- begin::Header -->
    <div class="card-header pb-6">
      <h6 class="title mb-0 d-flex align-items-center gap-3">
        Transaction History
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
      </h6>
    </div>
    <!-- end::Header -->

    <div class="card-body p-0">
      <!-- begin::Chart -->
      <div class="h-400px">
        <Line :key="chartKey" id="my-chart-id" :options="chartOptions" :data="chartData" />
      </div>
      <!-- end::Chart -->
    </div>
  </div>
</template>
