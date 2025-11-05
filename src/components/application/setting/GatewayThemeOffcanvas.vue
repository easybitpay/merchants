<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useIconImage from '@/composables/useIconImage'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

import 'swiper/css/navigation'
import 'swiper/css/pagination'

// import required modules
import { Navigation } from 'swiper/modules'
import { Pagination } from 'swiper/modules'

const modules = [Navigation, Pagination]

// Props
const props = defineProps({
  previewTheme: {
    type: Object,
    required: true
  }
})

// Emit
const emit = defineEmits(['changeDefaultSelectedTheme'])

// ----- START ----- //

// Generals
const store = useAppStore()
const { storageImage } = useIconImage()

// Refs
const loading = ref(false)

// Computeds
const selectedApp = computed(() => store.selectedApp)

const btnDisable = computed(() => {
  if (loading.value) return true
  if (selectedApp.value?.payment_theme?.id == props?.previewTheme?.id) return true

  return false
})

// Functions

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('gatewayTheme_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Update App Theme
 */
const updateTheme = async () => {
  // Start Loading
  loading.value = true

  // Set Variable
  const id = selectedApp.value.id
  let fd = new FormData()
  fd.append('payment_theme_id', props.previewTheme.id)

  // Request
  await store.updateApp({ id, fd }).then((res) => {
    if (res) {
      closeOffcanvas()
    }
  })

  // Stop Loading
  loading.value = false
}

onMounted(() => {
  const myOffcanvas = document.getElementById('gatewayTheme_offcanvas')

  /**
   * Offcanvas Fire On Hide
   */
  myOffcanvas.addEventListener('hidden.bs.offcanvas', () => {
    emit('changeDefaultSelectedTheme')
  })
})
</script>

<template>
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="gatewayTheme_offcanvas"
    aria-labelledby="offcanvasGatewayTheme"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <!-- begin::Content Card -->
      <div class="card border-0 mb-4">
        <div class="card-body">
          <!-- begin::Header -->
          <div class="d-flex gap-4">
            <div>
              <div class="svg-holder">
                <inline-svg
                  :src="`/media/icons/shapes/${$filters.shapeStatus('store')}.svg`"
                  width="34"
                  height="31"
                ></inline-svg>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="mb-0 text-dark">{{ previewTheme.name }}</h3>

              <p class="fs-7 mb-0 text-gray-800 ls-base">
                {{ previewTheme.description }}
              </p>
            </div>
          </div>
          <!-- end::Header -->

          <!-- begin::Content -->
          <div>
            <Swiper
              :key="previewTheme.id"
              :spaceBetween="16"
              :navigation="true"
              :pagination="{ clickable: true }"
              :modules="modules"
              class="mySwiper"
            >
              <SwiperSlide v-for="(item, index) in previewTheme.images" :key="index">
                <img
                  :src="storageImage(item)"
                  :alt="previewTheme.name"
                  class="img-fluid rounded-1"
                />
              </SwiperSlide>
            </Swiper>
          </div>
          <!-- end::Content -->
        </div>
      </div>
      <!-- end::Content Card -->

      <!-- begin::Action Card -->
      <div class="d-flex gap-4">
        <div class="d-none d-md-flex">
          <div
            class="w-56px h-56px d-flex align-items-center justify-content-center rounded-1 bg-white"
          >
            <inline-svg
              :src="`media/icons/shapes/${$filters.shapeStatus('documentation')}.svg`"
            ></inline-svg>
          </div>
        </div>
        <div class="card border-0 mb-6 w-100">
          <div
            class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
          >
            <p class="offcanvas-action-text">
              Latest clicks/conversions. Are you sure?
            </p>

            <!-- begin::Actions -->
            <div class="d-flex gap-4 w-100 w-sm-initial">
              <button
                type="button"
                class="btn btn-sm btn-light w-100 w-sm-104px h-24px ls-base fw-normal"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                Cancel
              </button>

              <button
                @click="updateTheme"
                type="button"
                :disabled="btnDisable"
                class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base fw-normal"
              >
                {{ loading ? 'Loading...' : 'Apply' }}
              </button>
            </div>
            <!-- end::Actions -->
          </div>
        </div>
      </div>
      <!-- end::Action Card -->
    </div>
  </div>
</template>
