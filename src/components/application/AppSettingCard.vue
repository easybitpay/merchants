<script setup>
// Vue
import { computed, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

// Hook
import useIconImage from '@/composables/useIconImage'

// ----- START ----- //

// Generals
const store = useAppStore()
const { storageImage } = useIconImage()

// Refs
const loadings = ref({
  icon: false,
  banner: false
})

// Computeds
const selectedApp = computed(() => store.selectedApp)

// Update Icon
const hiddenChangeIconInput = ref(null)
const iconInputClick = () => {
  hiddenChangeIconInput.value.click()
}

// Update Banner
const hiddenChangeCoverInput = ref(null)
const coverInputClick = () => {
  hiddenChangeCoverInput.value.click()
}

/**
 * Change App Icon
 * @param {event} e
 */
const addIconFile = async (e) => {
  // Set Variable
  const maximumSize = 200 * 1024
  let logo = e.target.files[0]

  if (logo.size > maximumSize) {
    appendAlert('File size must be less than 200KB', {
      color: 'danger',
      type: 'alert'
    })
    return
  }

  // Start Loading
  loadings.value.icon = true

  // Set Variable
  const id = selectedApp.value.id

  let fd = new FormData()
  fd.append('logo', logo)

  // Request
  await store.updateApp({ id, fd })

  // Stop Loading
  loadings.value.icon = false
}

/**
 * Change App Banner
 * @param {event} e
 */
const addCoverFile = async (e) => {
  // Set Variable
  const maximumSize = 200 * 1024
  let banner = e.target.files[0]

  if (banner.size > maximumSize) {
    appendAlert('File size must be less than 200KB', {
      color: 'danger',
      type: 'alert'
    })
    return
  }

  // Start Loading
  loadings.value.banner = true

  // Set Variable
  const id = selectedApp.value.id

  let fd = new FormData()
  fd.append('banner', banner)

  // Request
  await store.updateApp({ id, fd })

  // Stop Loading
  loadings.value.banner = false
}
</script>

<template>
  <div
    :class="`card gradient-image-box border-app-${selectedApp.settings.color}`"
    :style="`--background: url(${
      selectedApp.banner ? storageImage(selectedApp.banner) : '/media/images/banner/auth-bg.jpg'
    })`"
  >
    <div class="card-body d-flex flex-column">
      <!-- begin::Logo -->
      <img
        :src="
          selectedApp.logo
            ? storageImage(selectedApp.logo, 48)
            : '/media/images/banner/default-app.png'
        "
        :alt="selectedApp.name"
        class="img-fluid mb-10 mb-lg-16 rounded-1"
        width="48"
      />
      <!-- end::Logo -->

      <div class="d-flex flex-wrap gap-4 align-items-end justify-content-between">
        <!-- begin::Type & Name -->
        <div>
          <p class="mb-2">as {{ $filters.capitalize(selectedApp.share_type) }}</p>
          <h2 :class="`mb-0 text-app-${selectedApp.settings.color} lh-1`">
            {{ selectedApp.name }}
          </h2>
        </div>
        <!-- end::Type & Name -->

        <!-- begin::Status Action -->
        <div class="d-flex flex-wrap gap-4">
          <input type="file" ref="hiddenChangeIconInput" className="d-none" @change="addIconFile" />
          <button
            :disabled="loadings.icon"
            @click="iconInputClick"
            class="btn btn-light w-sm-192px"
          >
            {{ loadings.icon ? 'Loading...' : 'Change Icon' }}
          </button>

          <input
            type="file"
            ref="hiddenChangeCoverInput"
            className="d-none"
            @change="addCoverFile"
          />
          <button
            :disabled="loadings.banner"
            @click="coverInputClick"
            class="btn btn-primary w-sm-192px"
          >
            {{ loadings.banner ? 'Loading...' : 'Change Cover' }}
          </button>
        </div>
        <!-- end::Status Action -->
      </div>
    </div>
  </div>
</template>
