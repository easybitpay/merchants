<script setup>
// Store
import { useAppStore } from '@/stores/app'

// ----- START ----- //

// Generals
const store = useAppStore()

// Functions

const exitSandbox = () => {
  store.setSandBoxStatus(false)
}
</script>

<template>
  <div id="sandbox-alert" class="d-flex gap-4">
    <div class="d-none d-md-flex">
      <div class="w-56px h-56px d-flex align-items-center justify-content-center rounded-1 bg-white border">
        <inline-svg :src="`/media/icons/shapes/${$filters.shapeStatus('documentation')}.svg`"></inline-svg>
      </div>
    </div>
    <div class="card border-warning bg-yellow-100 dark-bg-dark w-100">
      <div
        class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
      >
        <p class="offcanvas-action-text">
          You are in Sand Box, Do you Want Exit?
        </p>

        <!-- begin::Actions -->
        <div class="d-flex gap-4 w-100 w-sm-initial">
          <button
            type="button"
            @click="exitSandbox"
            class="btn btn-sm btn-primary w-100 h-24px ls-base"
          >
            Exit Sandbox
          </button>
        </div>
        <!-- end::Actions -->
      </div>
    </div>
  </div>
</template>
