<script setup>
// Vue
import { onBeforeUnmount, ref } from 'vue'

// Store
import { usePayStore } from '@/stores/pay'

// Components
import GatewayInfo from '../components/pay/GatewayInfo.vue'

// Props
const props = defineProps({
  sandbox: {
    type: Boolean,
    default: false
  },
})

const sandbox = JSON.parse(localStorage.getItem('sandbox') || 'false')
if (sandbox) {
  document.body.classList.add('sandbox')
}

// ----- START ----- //

// Generals
const payStore = usePayStore()

// Refs
const errorStatus = ref(false)
const timeout = ref(null)

// Functions
const changeBG = () => {
  clearTimeout(timeout)

  errorStatus.value = true

  timeout.value = setTimeout(() => {
    errorStatus.value = false
  }, 5000)
}

onBeforeUnmount(() => {
  payStore.refreshPayStore()
})
</script>

<template>
  <div class="pay-layout type-1">
    <!-- begin::Main Box -->
    <div class="d-flex flex-column flex-root z-2">
      <div class="d-flex flex-column flex-root justify-content-center">
        <!-- begin::Container -->
        <div class="container d-flex flex-column align-items-center pb-8 pt-8">
          <!-- begin::Card -->
          <div class="card mw-624px w-100">
            <div class="card-body">
              <GatewayInfo />

              <RouterView @changeBG="changeBG" />
            </div>
          </div>
          <!-- end::Card -->
        </div>
        <!-- end::Container -->
      </div>

      <!-- begin::Copyright -->
      <div class="container d-flex justify-content-center">
        <div class="mw-624px w-100">
          <small class="text-white neue-machina fw-light d-block mb-4">
            Do not withdraw directty to a crowdfund od ICO address, os your account will niot be
            credited with tokens from such sales.
          </small>
        </div>
      </div>
      <!-- end::Copyright -->
    </div>
    <!-- end::Main Box -->

    <!-- begin::Backgroun Image -->
    <div
      :class="[{ 'auth-bg': true }, { error: errorStatus }]"
      style="background-image: url('media/images/banner/auth-bg.jpg')"
    ></div>
    <!-- end::Backgroun Image -->
  </div>
</template>
