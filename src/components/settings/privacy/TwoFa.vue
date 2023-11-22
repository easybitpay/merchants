<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Componets
import TwoFaOffcanvas from './TwoFaOffcanvas.vue'

// ----- START ----- //

// Generals
const store = useAuthStore()

// Refs
const twoFaStatus = ref(false)

// Computeds
const currentUser = computed(() => store.currentUser)

// Functions

/**
 * Change 2FA Status
 */
const change2FaToggleStatus = () => {
  const enable_2fa = currentUser.value.merchant.two_factor_enabled

  if (enable_2fa) {
    twoFaStatus.value = true
  } else {
    twoFaStatus.value = false
  }
}

onMounted(() => {
  change2FaToggleStatus()
})
</script>

<template>
  <!-- begin::Sign -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">How you Signin</h4>

    <p class="mb-6 text-gray-800">
      Make sure that you can always access your Google Account by keeping this information up to
      date
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-4">
      <!-- begin::Item -->
      <div class="row ls-base form-check form-switch d-flex align-items-center p-0">
        <div class="col-9 col-md-4 col-lg-3 col-xl-2 text-gray-800 lh-24px">
          <label class="form-check-label" for="twoFaSwitch"> 2-Step Verification </label>
        </div>
        <div
          class="col-3 col-md-6 col-lg-5 col-xl-4 d-flex justify-content-end justify-content-sm-start"
        >
          <input
            class="form-check-input m-0"
            type="checkbox"
            role="switch"
            id="twoFaSwitch"
            data-bs-toggle="offcanvas"
            data-bs-target="#twoFactor_offcanvas"
            aria-controls="twoFactor_offcanvas"
            v-model="twoFaStatus"
          />
        </div>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Sign -->

  <TwoFaOffcanvas @change2FaToggleStatus="change2FaToggleStatus" />
</template>
