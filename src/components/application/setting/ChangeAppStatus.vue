<script setup>
// Vue
import { computed, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useActionShareAllowed from '@/composables/useActionShareAllowed.js'

// ----- START ----- //

// Generals
const store = useAppStore()
const { actionShareAllowed } = useActionShareAllowed()

// Refs
const loading = ref(false)

// Computeds
const selectedApp = computed(() => store.selectedApp)
const btnDisable = computed(() => {
  if (loading.value) return true

  if (selectedApp.value.status == 9) return true

  if (!actionShareAllowed(selectedApp.value.share_type, 'change_status')) return true

  return false
})

// Functions

/**
 * Change App Status
 */
const changeAppStatus = async () => {
  // Start Loading
  loading.value = true

  // Request
  await store.changeGatewayStatus(selectedApp.value.id)

  // Stop Loading
  loading.value = false
}
</script>
<template>
  <!-- begin::Change App Status -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">
      {{ selectedApp.status == 1 ? 'Deactivate' : 'Activate' }} App
    </h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Add Coin -->
    <button :disabled="btnDisable" @click="changeAppStatus" class="btn btn-primary px-5 w-160px">
      {{ loading ? 'Loading...' : selectedApp.status == 1 ? 'Deactive' : 'Active' }}
    </button>
    <!-- end::Add Coin -->
  </div>
  <!-- end::Change App Status -->
</template>
