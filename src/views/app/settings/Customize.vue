<script setup>
// Component
import GatewayThemes from '../../../components/settings/GatewayThemes.vue'
</script>

<template>
  <!-- begin::Theme -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Theme</h4>

    <div class="d-flex align-items-center justify-content-between flex-wrap gap-6">
      <p class="text-gray-800 mb-0">
        Choose language - Changes will be applied after restarting the app
      </p>

      <div class="dropdown">
        <button
          class="btn btn-sm dropdown-toggle w-250px justify-content-between border border-gray-200"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Dark mode
        </button>
        <ul class="dropdown-menu w-100">
          <li><a class="dropdown-item">Dark mode</a></li>
          <li><a class="dropdown-item">Light mode</a></li>
        </ul>
      </div>
    </div>
    <!-- end::Title -->
  </div>
  <!-- end::Theme -->

  <!-- begin::Gateway Theme -->
  <div>
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Gateway Theme</h4>

    <p class="mb-6 text-gray-800">
      Choose language - Changes will be applied after restarting the app
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <GatewayThemes />
    <!-- end::Content -->
  </div>
  <!-- end::Gateway Theme -->
</template>
