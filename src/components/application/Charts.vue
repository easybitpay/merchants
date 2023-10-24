<script setup>
import { ref } from 'vue'

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

const selectedLine = ref('')

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

const externalTooltipHandler = (context) => {
  // Tooltip Element
  const { chart, tooltip } = context
  const tooltipEl = getOrCreateTooltip(chart)

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    selectedLine.value = ''
    tooltipEl.style.opacity = 0
    return
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || []
    const bodyLines = tooltip.body.map((b) => b.lines)

    const chartHeader = document.createElement('p')

    bodyLines.forEach((body, i) => {
      selectedLine.value = body[0].split(':')[0].trim()
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

const getOrCreateLegendList = (chart, id) => {
  const legendContainer = document.getElementById(id)
  let listContainer = legendContainer.querySelector('ul')

  if (!listContainer) {
    listContainer = document.createElement('ul')

    legendContainer.appendChild(listContainer)
  }

  return listContainer
}

const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(chart, args, options) {
    const ul = getOrCreateLegendList(chart, options.containerID)

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove()
    }

    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart)

    items.forEach((item) => {
      const li = document.createElement('li')

      li.onclick = () => {
        const { type } = chart.config
        if (type === 'pie' || type === 'doughnut') {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          chart.toggleDataVisibility(item.index)
        } else {
          chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex))
        }
        chart.update()
      }

      // Color box
      const boxSpan = document.createElement('span')
      boxSpan.style.background = item.fillStyle

      // Text
      const textContainer = document.createElement('p')
      textContainer.style.textDecoration = item.hidden ? 'line-through' : ''

      const text = document.createTextNode(item.text)
      textContainer.appendChild(text)

      li.appendChild(boxSpan)
      li.appendChild(textContainer)
      ul.appendChild(li)
    })
  }
}

const chartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Tether USD',
      data: [15, 12, 5, 6, 45, 45, 15],
      borderColor: '#0062FF',
      backgroundColor: '#0062FF',
      tension: 0.5,
      pointStyle: 'circle'
    },
    {
      label: 'ECS Gold',
      data: [40, 39, 10, 2000, 39, 80, 40],
      borderColor: '#3DD598',
      backgroundColor: '#3DD598',
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
    htmlLegend: {
      // ID of the container to put the legend in
      containerID: 'legend-container'
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
const plugins = [htmlLegendPlugin]
</script>
<template>
  <div class="row gy-6 mb-6">
    <div class="col-lg-7 col-xl-8 col-xxl-9">
      <!-- begin::Transactions -->
      <div class="card border-gray-200 rounded-4">
        <div class="card-body p-0">
          <!-- begin::Header -->
          <div class="p-6 pb-8 d-flex align-items-center justify-content-between flex-wrap gap-4">
            <h4 class="neue-machina mb-0 text-gray-900 d-flex gap-3 fw-normal">
              <inline-svg src="media/icons/shapes/transaction.svg"></inline-svg>

              Transaction History
            </h4>
            <div id="legend-container"></div>
          </div>
          <!-- end::Header -->

          <!-- begin::Chart -->
          <div class="h-400px">
            <Line id="my-chart-id" :options="chartOptions" :data="chartData" :plugins="plugins" />
          </div>
          <!-- end::Chart -->
        </div>
      </div>
      <!-- end::Transactions -->
    </div>

    <!-- begin::Bank -->
    <div class="col-lg-5 col-xl-4 col-xxl-3">
      <div class="card border-gray-200 rounded-4 h-100 bank-card">
        <div class="card-body d-flex flex-column">
          <!-- begin::Header -->
          <h4 class="neue-machina mb-6 text-gray-900 d-flex gap-3 fw-normal">
            <inline-svg src="media/icons/shapes/graph.svg"></inline-svg>
            
            Bank
          </h4>
          <!-- end::Header -->

          <!-- begin::Amount Columns -->
          <div
            :class="[{ 'd-flex flex-root amount-columns': true }, { 'active-item': selectedLine }]"
          >
            <!-- begin::Item -->
            <div class="item" style="width: 53%; background-color: #ffb74d">
              <span class="d-none d-sm-block">53%</span>
            </div>
            <!-- end::Item -->
            <!-- begin::Item -->
            <div class="item active" style="width: 39%; background-color: #3dd598">
              <span class="d-none d-sm-block">39%</span>
            </div>
            <!-- end::Item -->
            <!-- begin::Item -->
            <div class="item" style="width: 8%; background-color: #9575cd">
              <span class="d-none d-sm-block"></span>
            </div>
            <!-- end::Item -->
          </div>
          <!-- end::Amount Columns -->

          <!-- begin::Main Balances -->
          <div class="infos my-6">
            <!-- begin::Item -->
            <div class="item">
              <p class="value" style="color: #ffb74d">135.00</p>
              <p class="title">USDT</p>
            </div>
            <!-- end::Item -->
            <!-- begin::Item -->
            <div :class="[{ item: true }, { active: selectedLine }]">
              <p class="value" style="color: #3dd598">0.0006</p>
              <p class="title">ETH</p>
            </div>
            <!-- end::Item -->
          </div>
          <!-- end::Main Balances -->

          <!-- begin::Action -->
          <RouterLink :to="{ name: 'dashboard' }" class="btn btn-primary w-100">
            Withdraw
            <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
          </RouterLink>
          <!-- end::Action -->
        </div>
      </div>
    </div>
    <!-- end::Bank -->
  </div>
</template>
