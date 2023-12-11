<script setup>
// Vue
import { computed, onMounted, ref, watch } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useActionShareAllowed from '@/hooks/useActionShareAllowed.js'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// Components
import EditPartnerOffcanvas from './EditPartnerOffcanvas.vue'
import PartnerItem from './PartnerItem.vue'
import PartnerItemLoading from '../loadings/PartnerItemLoading.vue'

// ----- START ----- //

// Generals
const store = useAppStore()
const { actionShareAllowed } = useActionShareAllowed()

// Refs
const loading = ref(false)
const holders = ref([])
const selectedPartner = ref({})

// Computeds
const selectedApp = computed(() => store.selectedApp)
const partnerListKey = computed(() => store.partnerListKey)

// Functions

/**
 * Get Share App Holders
 */
const getAppShareHolders = async () => {
  if (actionShareAllowed(selectedApp.value.share_type, 'get_share')) {
    // Start Loading
    loading.value = true

    // Request
    await store.getAppShareHolders(selectedApp.value.id).then((res) => {
      if (res) {
        holders.value = res
      }
    })

    // Stop Loading
    loading.value = false
  }
}

/**
 * Show Edit Partners
 */
const openEditPartner = (partner) => {
  selectedPartner.value = partner
  const bsOffcanvas = new Offcanvas('#editPartner_offcanvas')
  bsOffcanvas.show()
}

/**
 * Refresh List
 */
const refreshData = (list) => {
  selectedPartner.value = {}
  holders.value = list
}

/**
 * Remove Item Form List
 */
const removeItem = (id) => {
  selectedPartner.value = {}
  holders.value = holders.value.filter((item) => item.id != id)
}

onMounted(() => {
  setTimeout(() => {
    getAppShareHolders()
  }, 1000)
})

watch(partnerListKey, () => {
  getAppShareHolders()
})
</script>

<template>
  <div class="card border-gray-200 rounded-4 mt-6">
    <div class="card-body pb-4">
      <!-- begin::Header -->
      <div class="pb-12 d-flex align-items-center justify-content-between flex-wrap gap-4">
        <h4 class="roboto-mono mb-0 text-gray-900 d-flex gap-5 fw-normal">
          <inline-svg :src="`/media/icons/shapes/${$filters.shapeStatus('chess-2')}.svg`" height="24" width="15"></inline-svg>

          {{ selectedApp.name }} Team
        </h4>
        <p
          class="mb-0 fw-medium text-primary cursor-pointer"
          data-bs-toggle="offcanvas"
          data-bs-target="#addPartner_offcanvas"
          aria-controls="addPartner_offcanvas"
        >
          Add New Person
        </p>
      </div>
      <!-- end::Header -->

      <!-- begin::Partners -->
      <div class="d-flex flex-column gap-6">
        <template v-if="loading">
          <PartnerItemLoading v-for="item in 2" :key="item" />
        </template>

        <!-- begin::Item -->
        <PartnerItem
          v-for="item in holders"
          :key="item.id"
          :item="item"
          @openEditPartner="openEditPartner"
        />
        <!-- end::Item -->
      </div>
      <!-- end::Partners -->
    </div>
  </div>
  <EditPartnerOffcanvas
    :selectedPartner="selectedPartner"
    @refreshData="refreshData"
    @removeItem="removeItem"
  />
</template>
