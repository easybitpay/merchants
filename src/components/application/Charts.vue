<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hook
import useIconImage from '@/hooks/useIconImage'

// Color Thief
import ColorThief from 'colorthief'

// Components
import BankLoading from '../loadings/BankLoading.vue'

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
const { iconImage } = useIconImage()

// Refs
const chartKey = ref(0)
const selectedLine = ref('')
const balances = ref([])
const chartImage = ref([])
const lastPage = ref(1)
const currentPage = ref(1)
const loadings = ref({
  chart: false,
  balance: false
})

// Computeds
const selectedApp = computed(() => store.selectedApp)

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

/**
 * Get Or Create Legend
 */
const getOrCreateLegendList = (chart, id) => {
  const legendContainer = document.getElementById(id)
  let listContainer = legendContainer.querySelector('ul')

  if (!listContainer) {
    listContainer = document.createElement('ul')

    legendContainer.appendChild(listContainer)
  }

  return listContainer
}

/**
 * Legend Plugin
 */
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
  labels: [],
  datasets: []
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

// Functions

const componentToHex = (c) => {
  var hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

const rgbToHex = (r, g, b) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

/**
 * Get Balances
 */
const getAppTokenBalance = async () => {
  // Start Loading
  loadings.value.balance = true

  // Request
  await store.getAppTokenBalance(selectedApp.value.id).then((res) => {
    if (res) {
      // convert & set data
      let array = []
      for (let i = 0; i < res.length; i++) {
        const element = res[i]
        if (+element.balance_usd_value) {
          array.push({
            ...element.token,
            balance: +element.balance,
            balance_usd_value: +element.balance_usd_value,
          })
        }
      }
      let sorted = array.sort((a, b) => {
        if (a.balance_usd_value > b.balance_usd_value) {
          return -1
        } else {
          return 1
        }
      })
      balances.value = sorted

      detectImageColor()
    }
  })

  // Stop Loading
  loadings.value.balance = false
}

/**
 * Get Balance Chart
 */
const getAppBalanceChart = async (page) => {
  if (page && page <= lastPage.value && !loadings.value.chart) {
    // Start Loading
    loadings.value.chart = true

    // Set Variables
    const id = selectedApp.value.id
    let params = new URLSearchParams()
    params.set('page', `${page}`)
    params.set('perPage', '15')

    // Request
    await store.getAppBalanceChart({ id, params }).then(async (res) => {
      if (res) {
        currentPage.value = page
        lastPage.value = res.totalPages
        let list = res.list
        chartData.value.labels = list.labels.reverse()
        let datas = []
        let symbols = []

        for (let i = 0; i < list.tokens.length; i++) {
          const element = list.tokens[i]
          symbols.push(element.token.symbol)

          datas.push({
            label: `${element.token.symbol} (${element.token.network.name})`,
            data: element.data.reverse(),
            borderColor: '',
            backgroundColor: '',
            tension: 0.5,
            pointStyle: 'circle'
          })
        }

        chartImage.value = symbols

        await new Promise((resolve, reject) => {
          setTimeout(() => {
            const colorThief = new ColorThief()
            for (let i = 0; i < chartImage.value.length; i++) {
              const element = chartImage.value[i]

              const img = document.querySelector(`#chart_${element}`)

              const colors = colorThief.getColor(img)
              datas[i].borderColor = rgbToHex(colors[0], colors[1], colors[2])
              datas[i].backgroundColor = rgbToHex(colors[0], colors[1], colors[2])
            }

            resolve()
          }, 1000)
        })

        chartData.value.datasets = datas

        chartKey.value++
      }
    })

    // Stop Loading
    loadings.value.chart = false
  }
}

/**
 * Balance To Percent
 */
const convertAmountToPercent = (balance) => {
  const total = balances.value.reduce((acc, obj) => acc + +obj.balance_usd_value, 0)
  return ((+balance * 100) / total).toFixed(1)
}

const detectImageColor = async () => {
  setTimeout(() => {
    const colorThief = new ColorThief()
    for (let i = 0; i < balances.value.length; i++) {
      const element = balances.value[i]

      const img = document.querySelector(`#image_${element.symbol}`)

      const colors = colorThief.getColor(img)
      element.color = rgbToHex(colors[0], colors[1], colors[2])
    }
  }, 1000)
}

onMounted(() => {
  setTimeout(() => {
    getAppBalanceChart(1)
    getAppTokenBalance()
  }, 1000)
})
</script>
<template>
  <div class="row gy-6">
    <div
      :class="`col-lg-${loadings.balance || balances.length ? '7' : '12'} 
      col-xl-${loadings.balance || balances.length ? '8' : '12'}
      col-xxl-${loadings.balance || balances.length ? '9' : '12'}`"
    >
      <!-- begin::Balance History -->
      <div class="card border-gray-200 rounded-4">
        <div class="card-body p-0">
          <img
            v-for="(item, index) in chartImage"
            :key="index"
            :src="iconImage(item)"
            alt="item"
            :id="`chart_${item}`"
            hidden
          />

          <!-- begin::Header -->
          <div class="p-6 pb-8 d-flex align-items-center justify-content-between flex-wrap gap-4">
            <h4 class="neue-machina mb-0 text-gray-900 d-flex align-items-center gap-3 fw-normal">
              <inline-svg
                :src="`media/icons/shapes/${$filters.shapeStatus('transaction')}.svg`"
              ></inline-svg>

              Balance History

              <span
                v-if="loadings.chart"
                class="spinner-border spinner-border-sm"
                role="status"
              ></span>
            </h4>
            <div id="legend-container"></div>
          </div>
          <!-- end::Header -->

          <!-- begin::Chart -->
          <div class="w-100 d-flex flex-column flex-sm-row gap-4">
            <div class="h-400px chart-box">
              <Line
                :key="chartKey"
                id="my-chart-id"
                :options="chartOptions"
                :data="chartData"
                :plugins="plugins"
              />
            </div>

            <div class="px-6 pb-6 ps-sm-0 d-flex justify-content-end align-items-end">
              <inline-svg
                @click="getAppBalanceChart(currentPage + 1)"
                src="media/icons/icons/chevron-left.svg"
                :class="[{ 'svg-icon-indigo-500 cursor-pointer': currentPage < lastPage }]"
              ></inline-svg>
              <inline-svg
                @click="getAppBalanceChart(currentPage - 1)"
                src="media/icons/icons/chevron-right.svg"
                :class="[{ 'svg-icon-indigo-500 cursor-pointer': currentPage > 1 }]"
              ></inline-svg>
            </div>
          </div>
          <!-- end::Chart -->
        </div>
      </div>
      <!-- end::Balance History -->
    </div>

    <!-- begin::Bank -->
    <div class="col-lg-5 col-xl-4 col-xxl-3" v-if="loadings.balance || balances.length">
      <BankLoading v-if="loadings.balance" />
      <div
        class="card border-gray-200 rounded-4 h-100 bank-card"
        v-if="!loadings.balance && balances.length"
      >
        <div class="card-body d-flex flex-column">
          <!-- begin::Header -->
          <h4 class="neue-machina mb-6 text-gray-900 d-flex gap-3 fw-normal">
            <inline-svg
              :src="`media/icons/shapes/${$filters.shapeStatus('graph')}.svg`"
              height="24px"
              width="25px"
            ></inline-svg>

            Bank
          </h4>
          <!-- end::Header -->

          <!-- begin::Amount Columns -->
          <div
            :class="[{ 'd-flex flex-root amount-columns': true }, { 'active-item': selectedLine }]"
          >
            <!-- begin::Item -->
            <div
              :class="[
                { item: true },
                { active: selectedLine === `${item.symbol} (${item?.network?.name})` },
                { 'p-0': convertAmountToPercent(item.balance_usd_value) < 40 }
              ]"
              v-for="(item, index) in balances"
              :key="index"
              :style="`width: ${convertAmountToPercent(item.balance_usd_value)}%; background-color: ${
                item.color ? item.color : ''
              }`"
            >
              <img :src="iconImage(item.symbol)" alt="item" :id="`image_${item.symbol}`" hidden />
              <span class="d-none d-sm-block">
                {{
                  convertAmountToPercent(item.balance_usd_value) > 40
                    ? `${convertAmountToPercent(item.balance_usd_value)}%`
                    : ''
                }}
              </span>
            </div>
            <!-- end::Item -->
          </div>
          <!-- end::Amount Columns -->

          <!-- begin::Main Balances -->
          <div class="value-infos my-6">
            <!-- begin::Item -->
            <div
              :class="[
                { item: true },
                { active: selectedLine === `${balances[0].symbol} (${balances[0]?.network?.name})` }
              ]"
            >
              <p class="value" :style="`color: ${balances[0].color ? balances[0].color : ''}`">
                ${{ balances[0].balance.toFixed(2) }}
              </p>
              <p class="title">{{ balances[0].symbol }}</p>
            </div>
            <!-- end::Item -->
            <!-- begin::Item -->
            <div
              v-if="balances[1]"
              :class="[
                { item: true },
                { active: selectedLine === `${balances[1].symbol} (${balances[1]?.network?.name})` }
              ]"
            >
              <p class="value" :style="`color: ${balances[1].color ? balances[1].color : ''}`">
                ${{ balances[1].balance_usd_value.toFixed(2) }}
              </p>
              <p class="title">{{ balances[1].symbol }}</p>
            </div>
            <!-- end::Item -->
          </div>
          <!-- end::Main Balances -->

          <!-- begin::Action -->
          <RouterLink
            :to="{ name: 'application-withdraw', params: { id: selectedApp.id } }"
            class="btn btn-primary w-100"
          >
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
