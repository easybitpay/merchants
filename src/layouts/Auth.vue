<script setup>
// Vue
import { ref } from 'vue'

// Store
import { useThemeStore } from '@/stores/theme'

// ----- START ----- //

// Generals
const themeStore = useThemeStore()

// Refs
const errorStatus = ref(false)
const timeout = ref(null)

// Funstions
const changeBG = () => {
  clearTimeout(timeout)

  errorStatus.value = true

  timeout.value = setTimeout(() => {
    errorStatus.value = false
  }, 5000)
}
</script>

<template>
  <!-- begin::Main Box -->
  <div class="d-flex flex-column flex-root z-2">
    <div class="d-flex flex-column flex-root justify-content-center">
      <!-- begin::Container -->
      <div class="container d-flex flex-column align-items-center pb-8 pt-8">
        <!-- begin::Logo -->
        <inline-svg
          :src="`media/images/logo/${themeStore.theme}-main-logo.svg`"
          class="mb-6"
        ></inline-svg>
        <!-- end::Logo -->

        <!-- begin::Card -->
        <RouterView @changeBG="changeBG" />
        <!-- end::Card -->
      </div>
      <!-- end::Container -->
    </div>

    <!-- begin::Copyright -->
    <div>
      <small class="text-white text-center fw-light d-block mb-4"> 2023 © easybitpay </small>
    </div>
    <!-- end::Copyright -->
  </div>
  <!-- end::Main Box -->

  <!-- begin::Backgroun Image -->
  <div
    :class="[{ 'position-fixed bottom-0 w-100 h-53vh auth-bg': true }, { error: errorStatus }]"
    style="background-image: url('media/images/banner/auth-bg.jpg')"
  ></div>
  <!-- end::Backgroun Image -->
</template>
