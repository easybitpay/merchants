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
  <div class="card mb-6 pb-6">
    <!-- begin::Header -->
    <div class="card-header">
      <div>
        <h6 class="title">
          {{ selectedApp.status == 1 ? 'Deactivate' : 'Activate' }} App
        </h6>

        <p class="desc">
          Some info may be visible to other people using Google services.
        </p>
      </div>

      <button :disabled="btnDisable" @click="changeAppStatus" class="btn btn-sm btn-light w-150px">
        {{ loading ? 'Loading...' : selectedApp.status == 1 ? 'Deactive' : 'Active' }}
      </button>
    </div>
    <!-- end::Header -->
  </div>
  <!-- end::Change App Status -->
</template>
