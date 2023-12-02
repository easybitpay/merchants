<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Components
import AddCustomTokenOffcanvas from './AddCustomTokenOffcanvas.vue'
import CustomTokenItem from './CustomTokenItem.vue'
import CustomTokenItemLoading from '../../loadings/CustomTokenItemLoading.vue'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// ------ START ----- //

// Generals
const store = useAppStore()

// Refs
const list = ref([])
const loading = ref(false)
const selectedCoinInfo = ref({})

// Computeds
const selectedApp = computed(() => store.selectedApp)

// Functions

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
      console.log(res)

      list.value = res.list
    }
  })

  // stop loading
  loading.value = false
}

onMounted(() => {
  get_tokens_list()
})
</script>
<template>
  <!-- begin::Custom Coin -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Custom Coin</h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-4 mb-10" v-if="loading || list.length">
      <CustomTokenItemLoading v-if="loading" />

      <CustomTokenItem
        v-for="(item, index) in list"
        :key="item.id"
        :item="item"
        :index="index"
        @openEdit="openEdit"
      />
    </div>
    <!-- end::Content -->

    <!-- begin::Add Coin -->
    <button
      class="btn btn-primary px-5"
      data-bs-toggle="offcanvas"
      data-bs-target="#addCustomToken_offcanvas"
      aria-controls="addCustomToken_offcanvas"
    >
      Create Custom Coin
    </button>
    <!-- end::Add Coin -->
  </div>
  <!-- end::Custom Coin -->

  <AddCustomTokenOffcanvas @refresh="get_tokens_list" @resetData="resetData" :selectedCoinInfo="selectedCoinInfo" />
</template>
