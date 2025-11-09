<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Componets
import ContentColumn from '../../globals/ContentColumn.vue'
import LockScreenOffcanvas from './LockScreenOffcanvas.vue'
import TwoFaOffcanvas from './TwoFaOffcanvas.vue'
import UpdatePasswordOffcanvas from './UpdatePasswordOffcanvas.vue'

// ----- START ----- //

// Generals
const store = useAuthStore()

// Refs
const lockScreenStatus = ref(false)
const twoFaStatus = ref(false)

// Computeds
const currentUser = computed(() => store.currentUser)

// Functions

/**
 * Change 2FA Status
 */
const changeLockScreenStatus = () => {
  const status = localStorage.getItem('lockScreenInfo')

  lockScreenStatus.value = status
}

/**
 * Change 2FA Status
 */
const change2FaToggleStatus = () => {
  const enable_2fa = currentUser.value.merchant.two_factor_enabled

  twoFaStatus.value = enable_2fa
}

onMounted(() => {
  changeLockScreenStatus()
  change2FaToggleStatus()
})
</script>

<template>
  <!-- begin::Authentication -->
  <div class="card mb-6">
    <!-- begin::Header -->
    <div class="card-header">
      <div>
        <h6 class="title">Authentication</h6>
        <p class="desc">Secure your account with additional protection</p>
      </div>
    </div>
    <!-- end::Header -->

    <!-- begin::Content -->
    <div class="card-body d-flex flex-column gap-4">
      <!-- begin::Item -->
      <ContentColumn
        svgIcon="lock"
        title="Two-Factor Authentication"
        value="Add an extra layer of security"
      >
        <div class="form-check form-switch form-switch-lg p-0">
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
      </ContentColumn>
      <!-- end::Item -->

      <!-- begin::Item -->
      <ContentColumn svgIcon="lock" title="Password" value="Add an extra layer of security">
        <button
          class="btn btn-sm btn-light"
          data-bs-toggle="offcanvas"
          data-bs-target="#updatePassword_offcanvas"
          aria-controls="updatePassword_offcanvas"
        >
          Change
        </button>
      </ContentColumn>
      <!-- end::Item -->

      <!-- begin::Item -->
      <ContentColumn svgIcon="lock" title="Lock Screen" value="Protect your account when idle">
        <div class="form-check form-switch form-switch-lg p-0">
          <input
            class="form-check-input m-0"
            type="checkbox"
            role="switch"
            id="lockScreenSwitch"
            data-bs-toggle="offcanvas"
            data-bs-target="#lockScreen_offcanvas"
            aria-controls="lockScreen_offcanvas"
            v-model="lockScreenStatus"
          />
        </div>
      </ContentColumn>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Authentication -->

  <LockScreenOffcanvas @changeLockScreenStatus="changeLockScreenStatus" />
  <TwoFaOffcanvas @change2FaToggleStatus="change2FaToggleStatus" />
  <UpdatePasswordOffcanvas />
</template>
