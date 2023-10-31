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
      label: 'mini game',
      data: [15, 12, 5, 6, 45, 45, 15],
      borderColor: '#0062FF',
      backgroundColor: '#0062FF',
      tension: 0.5,
      pointStyle: 'circle'
    },
    {
      label: 'kia',
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
  <div class="card border-gray-200 rounded">
    <div class="card-body p-0">
      <!-- begin::Header -->
      <div class="p-6 pb-8 d-flex align-items-center justify-content-between flex-wrap gap-4">
        <h4 class="neue-machina mb-0 text-gray-900 fw-normal">
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
</template>
