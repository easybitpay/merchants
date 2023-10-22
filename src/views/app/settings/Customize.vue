<script setup>
import { ref } from 'vue'

import GatewayThemeOffcanvas from '../../../components/settings/GatewayThemeOffcanvas.vue'

const items = [1, 2, 3]
const selected = ref(1)
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
    <div class="d-flex align-items-center flex-wrap gap-6">
      <!-- begin::Item -->
      <div v-for="item in items" :key="item" class="d-flex flex-column align-items-center">
        <!-- begin::Image Box -->
        <div
          class="w-192px h-216px border border-gray-300 rounded-3 mb-6"
          data-bs-toggle="offcanvas"
          data-bs-target="#gatewayTheme_offcanvas"
          aria-controls="gatewayTheme_offcanvas"
        >
          <img
            src="media/images/banner/auth-bg.jpg"
            alt="banner"
            class="w-100 h-100 rounded-3 object-cover"
          />
        </div>
        <!-- end::Image Box -->

        <!-- begin::Select Box -->
        <div
          @click="selected = item"
          :class="[
            {
              'border border-2 rounded-1 w-33px h-33px d-flex align-items-center justify-content-center cursor-pointer': true
            },
            { 'border-gray-400': selected != item },
            { 'border-primary bg-primary': selected === item }
          ]"
        >
          <span class="w-9px h-9px bg-gray-100 rounded-circle"></span>
        </div>
        <!-- end::Select Box -->
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Gateway Theme -->

  <GatewayThemeOffcanvas />
</template>
