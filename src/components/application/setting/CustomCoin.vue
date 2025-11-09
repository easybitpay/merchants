<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Composables
import useIconImage from '@/composables/useIconImage'

// Components
import AddCustomTokenOffcanvas from './AddCustomTokenOffcanvas.vue'

// Bootstrap
import { Offcanvas } from 'bootstrap'
import ContentColumn from '../../globals/ContentColumn.vue'

// Emit
const emit = defineEmits(['refreshAvailableCoins'])

// Constants
var special = [
  'zeroth',
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
  'eleventh',
  'twelfth',
  'thirteenth',
  'fourteenth',
  'fifteenth',
  'sixteenth',
  'seventeenth',
  'eighteenth',
  'nineteenth'
]
var deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet']

// ------ START ----- //

// Generals
const store = useAppStore()
const { storageImage } = useIconImage()

// Refs
const list = ref([])
const loading = ref(false)
const selectedCoinInfo = ref({})

// Computeds
const selectedApp = computed(() => store.selectedApp)

// Functions

/**
 * Open Edit Offcanvas
 */
const openEdit = (coin) => {
  selectedCoinInfo.value = coin

  const bsOffcanvas = new Offcanvas('#addCustomToken_offcanvas')
  bsOffcanvas.show()
}

/**
 * Refresh Data & Get List
 */
const resetData = () => {
  selectedCoinInfo.value = {}
}

/**
 * Refresh List
 */
const refreshList = () => {
  get_tokens_list()
  emit('refreshAvailableCoins')
}

/**
 * Get Tokens List
 */
const get_tokens_list = async () => {
  // start loading
  loading.value = true

  // set variables
  let params = new URLSearchParams()
  params.set('appId', selectedApp.value.id)
  params.set('page', '1')
  params.set('pageSize', '10000')

  // request
  await store.getCustomTokensList(params).then((res) => {
    if (res) {
      list.value = res.list
    }
  })

  // stop loading
  loading.value = false
}

/**
 * Convert Number To Text
 * @param {index} n
 */
function stringifyNumber(n) {
  if (n < 20) return special[n]
  if (n % 10 === 0) return deca[Math.floor(n / 10) - 2] + 'ieth'
  return deca[Math.floor(n / 10) - 2] + 'y-' + special[n % 10]
}

onMounted(() => {
  get_tokens_list()
})
</script>
<template>
  <!-- begin::Custom Coin -->
  <div class="card mb-6">
    <!-- begin::Header -->
    <div :class="[{ 'card-header': true }, { 'pb-6': !loading && !list.length }]">
      <div>
        <h6 class="title">Custom Coin</h6>

        <p class="desc">Some info may be visible to other people using Google services.</p>
      </div>

      <!-- begin::Add Coin -->
      <button
        class="btn btn-sm btn-light w-150px"
        data-bs-toggle="offcanvas"
        data-bs-target="#addCustomToken_offcanvas"
        aria-controls="addCustomToken_offcanvas"
      >
        Create
      </button>
      <!-- end::Add Coin -->
    </div>
    <!-- end::Header -->

    <!-- begin::Content -->
    <div class="card-body d-flex flex-column gap-4" v-if="loading || list.length">
      <template v-if="loading">
        <ContentColumn v-for="item in 2" :key="item" textLoading iconLoading />
      </template>

      <!-- begin::Item -->
      <ContentColumn
        v-for="(item, index) in list"
        :key="item.id"
        :title="`${$filters.capitalize(stringifyNumber(index + 1))} Coin`"
        :value="item.name"
        :imageIcon="storageImage(item.logo, 40)"
      >
        <button class="btn btn-sm btn-light" @click="openEdit(item)">Edit</button>
      </ContentColumn>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Custom Coin -->

  <AddCustomTokenOffcanvas
    @refresh="refreshList"
    @resetData="resetData"
    :selectedCoinInfo="selectedCoinInfo"
  />
</template>
