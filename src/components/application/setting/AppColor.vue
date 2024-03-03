<script setup>
// Vue
import { computed, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

let colors = ['orange', 'green', 'purple', 'red', 'lime', 'blue']

// ----- START -----

// Generals
const store = useAppStore()

// Computeds
const selectedApp = computed(() => store.selectedApp)

// Refs
const selected = ref(selectedApp.value.settings.color)
const loading = ref(false)

/**
 * Change App Color
 * @param {color name} appColor
 */
const changeAppColor = async (appColor) => {
  selected.value = appColor

  // Start Loading
  loading.value = true

  // Set Variables
  const id = selectedApp.value.id
  let fd = new FormData()

  let setting = {
    ...selectedApp.value.settings
  }
  setting.color = appColor

  fd.append('settings', JSON.stringify(setting))

  // Request
  await store.updateApp({ id, fd })

  // Stop Loading
  loading.value = false
}
</script>
<template>
  <!-- begin::App Color -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900 d-flex align-items-center gap-3">
      App color
      <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
    </h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex gap-4">
      <!-- begin::Item -->
      <div
        :class="`w-40px h-40px rounded-1 d-flex align-items-center justify-content-center bg-app-${item}`"
        v-for="item in colors"
        :key="item"
        @click="changeAppColor(item)"
      >
        <inline-svg v-if="selected === item" src="media/icons/icons/ok.svg"></inline-svg>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::App Color -->
</template>
