<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hook
import useIconImage from '@/composables/useIconImage'

// Components
import SelectDropdown from '../globals/SelectDropdown.vue'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// Props
const props = defineProps({
  selectedPartner: {
    type: Object,
    required: true
  }
})

// Emit
const emit = defineEmits(['refreshData', 'removeItem'])

// ----- START ----- //

// Generals
const store = useAppStore()
const { storageImage } = useIconImage()

// Refs
const shareType = ref({})
const loadings = ref({
  submit: false,
  delete: false
})
const form = ref({
  email: null,
  type: null
})

// Computeds
const selectedApp = computed(() => store.selectedApp)
const shareAppStatus = computed(() => store.shareAppStatus)

// Functions

/**
 * Toggle Share Type
 */
const toggleShareType = (type) => {
  shareType.value = type
  form.value.type = type.type
}

/**
 * Reset Form
 */
const resetForm = () => {
  shareType.value = {}
  form.value = {
    email: null,
    type: null
  }
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('editPartner_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Set Default Values
 */
const setDefaultValues = () => {
  if (props.selectedPartner.id) {
    // Set Network
    for (let i = 0; i < shareAppStatus.value.length; i++) {
      const element = shareAppStatus.value[i]
      if (element.type == props.selectedPartner.type) {
        shareType.value = element
        break
      }
    }
    // Set Form Data
    form.value = {
      email: props.selectedPartner.email,
      type: shareType.value.type
    }
  }
}

/**
 * Edit Partner Access
 */
const editPartner = async () => {
  // Start Loading
  loadings.value.submit = true

  // Set Variable
  let params = new URLSearchParams()
  params.set('appId', selectedApp.value.id)
  params.set('merchantEmail', form.value.email)
  params.set('shareType', form.value.type)

  // request
  await store.updateSharedApp(params).then((res) => {
    if (res) {
      emit('refreshData', res)
      resetForm()
      closeOffcanvas()
    }
  })

  // Stop Loading
  loadings.value.submit = false
}

/**
 * Delete Partner
 */
const deletePartner = async () => {
  // Start Loading
  loadings.value.delete = true

  // Set Variable
  let params = new URLSearchParams()
  params.set('appId', selectedApp.value.id)
  params.set('merchantEmail', form.value.email)

  // Request
  await store.deleteAppShareHolder(params).then((res) => {
    if (res) {
      emit('removeItem', props.selectedPartner.id)
      resetForm()
      closeOffcanvas()
    }
  })

  // Stop Loading
  loadings.value.delete = false
}

onMounted(() => {
  const myOffcanvas = document.getElementById('editPartner_offcanvas')

  /**
   * Offcanvas Fire On Show
   */
  myOffcanvas.addEventListener('shown.bs.offcanvas', () => {
    setDefaultValues()
  })

  /**
   * Offcanvas Fire On Hide
   */
  myOffcanvas.addEventListener('hidden.bs.offcanvas', () => {
    resetForm()
  })
})
</script>

<template>
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="editPartner_offcanvas"
    aria-labelledby="offcanvasEditPartner"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="/media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <form @submit.prevent="editPartner">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4 min-h-354px">
          <div class="card-body">
            <!-- begin::Header -->
            <div class="d-flex gap-3">
              <div>
                <div class="w-48px h-48px">
                  <img
                    :src="
                      selectedPartner.avatar
                        ? storageImage(selectedPartner.avatar, 40)
                        : `/media/images/banner/auth-bg.jpg`
                    "
                    :alt="selectedPartner.first_name"
                    class="w-100 h-100 object-cover rounded-circle"
                  />
                </div>
              </div>

              <div class="mb-12">
                <h3 class="mb-0 text-primary">
                  {{ selectedPartner.first_name }} {{ selectedPartner.last_name }}
                </h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">
                  Some info may be visible to other people using Google services.
                </p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <!-- begin::Info -->
            <div class="border-bottom border-gray-200 pb-8 mb-8">
              <p class="mb-6 ls-base">
                By signing up, you confirm that you’ve readand accepted our User Notice and
                <span class="text-primary">Privacy Policy.</span>
              </p>
              <div class="row gy-4">
                <!-- begin::Email -->
                <div class="col-sm-6">
                  <input
                    type="email"
                    class="form-control"
                    placeholder="Merchat Email"
                    v-model="form.email"
                    readonly
                  />
                </div>
                <!-- end::Email -->

                <div class="col-sm-6">
                  <SelectDropdown
                    placeholder="Choose Position"
                    show="type"
                    check="type"
                    :items="shareAppStatus"
                    :selected="shareType"
                    @change="toggleShareType"
                  />
                </div>
              </div>
            </div>
            <!-- end::Info -->

            <!-- begin::Features -->
            <div class="d-flex flex-column gap-4">
              <!-- begin::Item -->
              <div
                class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-start gap-3 form-check form-switch p-0"
              >
                <label class="form-check-label text-gray-800" for="partner-feature-1">
                  Has your Person Ability to Add People
                </label>
                <input
                  class="form-check-input m-0"
                  type="checkbox"
                  role="switch"
                  id="partner-feature-1"
                />
              </div>
              <!-- begin::Item -->

              <!-- begin::Item -->
              <div
                class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-start gap-3 form-check form-switch p-0"
              >
                <label class="form-check-label text-gray-800" for="partner-feature-2">
                  Has your Person Ability to see Other Partner's Team
                </label>
                <input
                  class="form-check-input m-0"
                  type="checkbox"
                  role="switch"
                  id="partner-feature-2"
                />
              </div>
              <!-- begin::Item -->

              <!-- begin::Item -->
              <div
                class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-start gap-3 form-check form-switch p-0"
              >
                <label class="form-check-label text-gray-800" for="partner-feature-3">
                  Access to Change Getway Theme
                </label>
                <input
                  class="form-check-input m-0"
                  type="checkbox"
                  role="switch"
                  id="partner-feature-3"
                />
              </div>
              <!-- begin::Item -->
            </div>
            <!-- end::Features -->
            <!-- end::Content -->
          </div>
        </div>
        <!-- end::Content Card -->

        <!-- begin::Action Card -->
        <div class="d-flex gap-4">
          <div class="d-none d-md-flex">
            <div
              class="w-56px h-56px d-flex align-items-center justify-content-center rounded-3 bg-white"
            >
              <inline-svg :src="`media/icons/shapes/${$filters.shapeStatus('documentation')}.svg`"></inline-svg>
            </div>
          </div>

          <div class="card border-0 mb-6 w-100">
            <div
              class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
            >
              <p class="fs-7 mb-0 ls-base text-gray-800 lh-32px">
                {{ form.email }} as {{ $filters.capitalize(form.type) }}
              </p>

              <!-- begin::Actions -->
              <div class="d-flex gap-4 w-100 w-sm-initial">
                <button
                  type="button"
                  @click="deletePartner"
                  :disabled="loadings.delete"
                  class="btn btn-sm bg-light text-primary w-100 w-sm-initial h-24px ls-base"
                >
                  {{ loadings.delete ? 'Loading...' : 'Remove Person' }}
                </button>

                <button
                  type="submit"
                  :disabled="loadings.submit"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base"
                >
                  {{ loadings.submit ? 'Loading...' : 'Save' }}
                </button>
              </div>
              <!-- end::Actions -->
            </div>
          </div>
        </div>
        <!-- end::Action Card -->
      </form>
    </div>
  </div>
</template>
