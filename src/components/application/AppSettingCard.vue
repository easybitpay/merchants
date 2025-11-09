<script setup>
// Vue
import { computed, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

// Composables
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
 * Gateway List Status Converter
 */
const convartAppType = (type) => {
  if (type == '1') return 'API'
  if (type == '2') return 'Custom'
  if (type == '3') return 'Donate'
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
    class="card background-image application-card"
    :style="`--background: url(${
      selectedApp.banner ? storageImage(selectedApp.banner) : '/media/images/banner/auth-bg.jpg'
    })`"
  >
    <div :class="`card-body border-app-${selectedApp.settings.color}`">
      <!-- begin::Name Action -->
      <div class="info-action-box">
        <!-- begin::Main Info -->
        <div class="main-info">
          <!-- begin::Logo -->
          <img
            :src="
              selectedApp.logo
                ? storageImage(selectedApp.logo, 48)
                : '/media/images/banner/default-app.png'
            "
            :alt="selectedApp.name"
            class="img-fluid rounded-1"
            width="48"
          />
          <!-- end::Logo -->

          <!-- begin::Info -->
          <div class="info">
            <h6 :class="`name text-app-${selectedApp.settings.color}`">{{ selectedApp.name }}</h6>

            <div class="other">
              <span class="text-primary">
                {{ convartAppType(selectedApp.type) }}
              </span>
              <span>•</span>
              <span>{{ $filters.capitalize(selectedApp.share_type) }}</span>
            </div>
          </div>
          <!-- end::Info -->
        </div>
        <!-- end::Main Info -->

        <!-- begin::Action -->
        <div class="d-none d-md-flex gap-4">
          <input type="file" ref="hiddenChangeIconInput" className="d-none" @change="addIconFile" />
          <button :disabled="loadings.icon" @click="iconInputClick" class="btn btn-light w-140px">
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
            class="btn btn-primary w-140px"
          >
            {{ loadings.banner ? 'Loading...' : 'Change Cover' }}
          </button>
        </div>
        <!-- end::Action -->
      </div>
      <!-- end::Name Action -->

      <!-- begin::Bottom Action -->
      <div class="bottom-action pt-12 d-flex gap-4 d-md-none">
        <input type="file" ref="hiddenChangeIconInput" className="d-none" @change="addIconFile" />
        <button
          :disabled="loadings.icon"
          @click="iconInputClick"
          class="btn btn-sm btn-light w-100"
        >
          {{ loadings.icon ? 'Loading...' : 'Change Icon' }}
        </button>

        <input type="file" ref="hiddenChangeCoverInput" className="d-none" @change="addCoverFile" />
        <button
          :disabled="loadings.banner"
          @click="coverInputClick"
          class="btn btn-sm btn-primary w-100"
        >
          {{ loadings.banner ? 'Loading...' : 'Change Cover' }}
        </button>
      </div>
      <!-- end::Bottom Action -->
    </div>
  </div>
</template>
