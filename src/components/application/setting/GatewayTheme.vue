<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useIconImage from '@/composables/useIconImage'
import useActionShareAllowed from '@/composables/useActionShareAllowed.js'

// Component
import GatewayThemeOffcanvas from './GatewayThemeOffcanvas.vue'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// ----- START ----- //

// Generals
const store = useAppStore()
const { storageImage } = useIconImage()
const { actionShareAllowed } = useActionShareAllowed()

// Refs
const themes = ref([])
const selectedTheme = ref({})
const previewTheme = ref({})
const loadings = ref({
  list: false,
  update: false
})

// Computeds
const selectedApp = computed(() => store.selectedApp)

// Functions

/**
 * Set Default Selected Theme
 */
const changeDefaultSelectedTheme = () => {
  selectedTheme.value = selectedApp.value.payment_theme
}

/**
 * Set Selected Theme
 */
const setSelectedTheme = async (theme) => {
  if (!loadings.value.update) {
    selectedTheme.value = theme

    // Start Loading
    loadings.value.update = true

    // Set Variable
    const id = selectedApp.value.id
    let fd = new FormData()
    fd.append('payment_theme_id', theme.id)

    // Request
    await store.updateApp({ id, fd }).then((res) => {
      if (res) {
        changeDefaultSelectedTheme()
      }
    })

    // Stop Loading
    loadings.value.update = false
  }
}

/**
 * Show Theme Detail
 */
const themePreview = (theme) => {
  previewTheme.value = theme

  // Open Offcavas
  const bsOffcanvas = new Offcanvas('#gatewayTheme_offcanvas')
  bsOffcanvas.show()
}

/**
 * Get Themes
 */
const getThemes = async () => {
  // Start Loading
  loadings.value.list = true

  // Request
  await store.getAppThemes(selectedApp.value.id).then((res) => {
    if (res) {
      themes.value = res
    }
  })

  // Stop Loading
  loadings.value.list = false
}

onMounted(() => {
  changeDefaultSelectedTheme()
  getThemes()
})
</script>

<template>
  <!-- begin::Gateway Theme -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900 d-flex align-items-center gap-3">
      Gateway Theme
      <span v-if="loadings.update" class="spinner-border spinner-border-sm" role="status"></span>
    </h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex align-items-center flex-wrap gap-6">
      <!-- begin::Item -->
      <div v-for="item in themes" :key="item.id" class="d-flex flex-column align-items-center">
        <!-- begin::Image Box -->
        <div
          class="w-192px h-216px border border-gray-300 border-hover-primary rounded-3 mb-6 cursor-pointer"
          @click="actionShareAllowed(selectedApp.share_type, 'edit_app') && themePreview(item)"
        >
          <img
            :src="storageImage(item.thumbnail)"
            :alt="item.name"
            class="w-100 h-100 rounded-3 object-cover"
          />
        </div>
        <!-- end::Image Box -->

        <!-- begin::Select Box -->
        <div
          :disabled="!actionShareAllowed(selectedApp.share_type, 'edit_app')"
          @click="actionShareAllowed(selectedApp.share_type, 'edit_app') && setSelectedTheme(item)"
          :class="[
            {
              'border border-2 rounded-1 w-33px h-33px d-flex align-items-center justify-content-center cursor-pointer': true
            },
            { 'border-gray-400': selectedTheme.id != item.id },
            { 'border-primary bg-primary': selectedTheme.id === item.id }
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
  <GatewayThemeOffcanvas
    :previewTheme="previewTheme"
    @changeDefaultSelectedTheme="changeDefaultSelectedTheme"
  />
</template>
