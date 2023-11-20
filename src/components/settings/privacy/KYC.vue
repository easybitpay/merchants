<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
import useIconImage from '@/hooks/useIconImage'

// Components
import NewKycOffcanvas from './NewKycOffcanvas.vue'
import LongImageCard from '../../globals/LongImageCard.vue'
import LongImageCardLoading from '../../loadings/LongImageCardLoading.vue'

// ----- Start -----

// Generals
const store = useAuthStore()
const { storageImage } = useIconImage()

// Refs
const list = ref([])
const loading = ref(false)

// Functions

/**
 * Get KYC List
 */
const getKYCList = async () => {
  // Start Loading
  loading.value = true

  // Request
  await store.KYCList().then((res) => {
    if (res) {
      list.value = res
    }
  })

  // Stop Loading
  loading.value = false
}

/**
 * Delete KYC Document
 * @param {item id} id
 */
const deleteDocument = async (id) => {
  // Request
  await store.deleteKYC(id).then((res) => {
    if (res) {
      // Remove From List
      list.value = list.value.filter((item) => item.id != id)
    }
  })
}

/**
 * Convert Status To Color
 * @param {status} status
 */
const convertStatusToColor = (status) => {
  if (status == 0) return 'cyan'
  if (status == 9) return 'red'
  if (status == 10) return 'blue'
}

/**
 * Convert Status To Icon
 * @param {status} status
 */
const convertStatusToIcon = (status) => {
  if (status == 0) return 're'
  if (status == 9) return 'error'
  if (status == 10) return 'read'
}

/**
 * Convert Status To Text
 * @param {status} status
 */
const convertStatusToText = (status) => {
  if (status == 0) return 'Checking'
  if (status == 9) return 'Error'
  if (status == 10) return 'Verified'
}

onMounted(() => {
  getKYCList()
})
</script>
<template>
  <!-- begin::KYC -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">KYC</h4>

    <p class="mb-6 text-gray-800">
      KYC process includes ID card verification, face verification, document verification such as
      utility bills as proof of address, and biometric verification. Banks must comply with KYC
      regulations and anti-money laundering regulations to limit fraud.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-6">
      <!-- begin::Item -->
      <div class="row align-items-center gy-3" v-if="loading">
        <div class="col-12 col-sm-6 col-md-8 col-lg-6 col-xl-4">
          <LongImageCardLoading />
        </div>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <template v-else>
        <div class="row align-items-center gy-3" v-for="item in list" :key="item.id">
          <div class="col-12 col-sm-6 col-md-8 col-lg-6 col-xl-4">
            <LongImageCard
              :text="`${$filters.capitalize(item.type)}`"
              :background="storageImage(item.file)"
              :error="item.status == 9"
              deleteAction
              @onDelete="deleteDocument(item.id)"
            />
          </div>

          <div class="col-12 col-sm d-flex">
            <div
              :class="`h-33px d-flex align-items-center ps-2 pe-4 rounded-2 border gap-2 
              border-${convertStatusToColor(item.status)}-500 fs-7 ls-base 
              bg-${convertStatusToColor(item.status)}-100
              text-${convertStatusToColor(item.status)}-500`"
            >
              <div>
                <inline-svg
                  :src="`media/icons/icons/${convertStatusToIcon(item.status)}.svg`"
                  height="24"
                  :class="`svg-icon-${convertStatusToColor(item.status)}-500`"
                ></inline-svg>
              </div>

              {{ convertStatusToText(item.status) }}
            </div>
          </div>
        </div>
      </template>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->

    <!-- begin::Attach -->
    <button
      class="btn btn-primary w-144px mt-6"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#newKyc_offcanvas"
      aria-controls="newKyc_offcanvas"
    >
      Attach
    </button>
    <!-- end::Attach -->
  </div>
  <!-- end::KYC -->

  <NewKycOffcanvas @refresh="getKYCList" />
</template>
