<script setup>
// Vue
import { computed, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hook
import useIconImage from '@/hooks/useIconImage'

// ----- START ----- //

// Generals
const store = useAppStore()
const { storageImage } = useIconImage()

// Computeds
const selectedApp = computed(() => store.selectedApp)
</script>

<template>
  <div
    class="card gradient-image-box application-card mb-10"
    :style="`--background: url(${
      selectedApp.banner ? storageImage(selectedApp.banner) : '/media/images/banner/auth-bg.jpg'
    })`"
  >
    <div class="card-body d-flex flex-column align-items-start w-100 overflow-auto">
      <p class="fs-7 text-gray-600 ls-base mb-0">Available in</p>

      <!-- begin::Name -->
      <h2 class="name text-success neue-machina">{{ selectedApp.name }}</h2>
      <!-- end::Name -->

      <!-- begin::Info -->
      <div class="infos mt-6">
        <!-- begin::Item -->
        <div class="item">
          <p class="value">$135.00</p>
          <p class="title">Available</p>
        </div>
        <!-- end::Item -->

        <!-- begin::Item -->
        <div class="item">
          <p class="value">0.0107</p>
          <p class="title">BTC</p>
        </div>
        <!-- end::Item -->

        <!-- begin::Item -->
        <div class="item">
          <p class="value">128.50</p>
          <p class="title">USDT</p>
        </div>
        <!-- end::Item -->

        <!-- begin::Item -->
        <div class="item">
          <p class="value">1.728</p>
          <p class="title">ETH</p>
        </div>
        <!-- end::Item -->
      </div>
      <!-- end::Info -->
    </div>
  </div>
</template>
