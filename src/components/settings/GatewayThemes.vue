<script setup>
// Vue
import { ref } from 'vue'

// Component
import GatewayThemeOffcanvas from './GatewayThemeOffcanvas.vue'

// ----- START ----- //
const items = [1, 2, 3]
const selected = ref(1)
</script>

<template>
  <div class="d-flex align-items-center flex-wrap gap-6">
    <!-- begin::Item -->
    <div v-for="item in items" :key="item" class="d-flex flex-column align-items-center">
      <!-- begin::Image Box -->
      <div
        class="w-192px h-216px border border-gray-300 rounded-3 mb-6 cursor-pointer"
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

  <GatewayThemeOffcanvas />
</template>


