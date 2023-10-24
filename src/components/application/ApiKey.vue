<script setup>
// Component
import RevokeSecretOffcavnas from './RevokeSecretOffcavnas.vue'
</script>
<template>
  <div class="card rounded-4 my-6 border-gray-200">
    <div class="card-body py-4 pe-4">
      <div
        class="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-6 gap-md-8"
      >
        <!-- begin::Title -->
        <h3 class="m-0 text-indigo-400 lh-24px">API</h3>
        <!-- end::Title -->

        <!-- begin::Api & Action -->
        <div class="w-100 d-flex flex-wrap align-items-center justify-content-between gap-4">
          <p class="m-0 ls-base">9d8eb567-9e2d-4752-94d2-77b7708e0872</p>

          <button
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
