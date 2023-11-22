<script setup>
// Vue
import { computed } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Component
import RevokeSecretOffcavnas from './RevokeSecretOffcavnas.vue'

// ----- Start -----
const store = useAppStore()
const selectedApp = computed(() => store.selectedApp)
</script>

<template>
  <div class="card rounded-4 my-6 border-gray-200">
    <div class="card-body py-4 pe-4">
      <div
        class="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-6 gap-md-8"
      >
        <!-- begin::Title -->
        <h3 class="m-0 text-indigo-400 lh-24px">{{ selectedApp.type == 1 ? 'API' : 'LINK' }}</h3>
        <!-- end::Title -->

        <!-- begin::Api & Action -->
        <div class="w-100 min-h-40px d-flex flex-wrap align-items-center justify-content-between gap-4">
          <p class="m-0 ls-base">
            {{ selectedApp.type == 1 ? selectedApp.api_key : selectedApp.pay_url }}
          </p>

          <button
            v-if="selectedApp.type == 1"
            class="btn btn-primary w-175px"
            data-bs-toggle="offcanvas"
            data-bs-target="#revokeSecret_offcanvas"
            aria-controls="revokeSecret_offcanvas"
          >
            Revoke Secret
          </button>
        </div>
        <!-- end::Api & Action -->
      </div>
    </div>
  </div>

  <RevokeSecretOffcavnas />
</template>
