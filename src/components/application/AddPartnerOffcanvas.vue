<script setup>
// Vue
import { computed, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useForm from '@/composables/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'

// Components
import SelectDropdown from '../globals/SelectDropdown.vue'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// ----- START ----- //

// Generals
const store = useAppStore()
const { showFeedBacks } = useForm()

// Refs
const loading = ref(false)
const shareType = ref({})

// Computeds
const selectedApp = computed(() => store.selectedApp)
const shareAppStatus = computed(() => store.shareAppStatus)

// Vuelidate
const form = ref({
  email: null,
  type: null
})

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage("Email isn't valid", email)
  },
  type: {
    required: helpers.withMessage('Type is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Reset Form
 */
const resetForm = () => {
  shareType.value = {}
  form.value = {
    email: null,
    type: null
  }
  v$.value.$reset()
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('addPartner_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Toggle Share Type
 */
const toggleShareType = (type) => {
  shareType.value = type
  form.value.type = type.type
}

/**
 * App Partner
 */
const addNewPartner = async () => {
  // Validation Form
  const result = await v$.value.$validate()
  if (result) {
    // Start Loading
    loading.value = true

    // Set Variables
    let params = new URLSearchParams()
    params.set('appId', selectedApp.value.id)
    params.set('merchantEmail', form.value.email)
    params.set('shareType', form.value.type)

    // Request
    await store.updateSharedApp(params).then((res) => {
      if (res) {
        store.refreshPartnersList()
        resetForm()
        closeOffcanvas()
      }
    })

    // Stop Loading
    loading.value = false
  } else {
    showFeedBacks()
  }
}
</script>

<template>
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="addPartner_offcanvas"
    aria-labelledby="offcanvasAddPartner"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <form @submit.prevent="addNewPartner">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4 min-h-354px">
          <div class="card-body pb-lg-22">
            <!-- begin::Header -->
            <div class="d-flex gap-4">
              <div>
                <inline-svg
                  :src="`media/icons/shapes/${$filters.shapeStatus('account')}.svg`"
                  width="41"
                  height="48"
                ></inline-svg>
              </div>

              <div class="mb-10">
                <h3 class="mb-0 text-dark">Add Person</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">
                  Some info may be visible to other people using Google services.
                </p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <!-- begin::Info -->
            <div class="border-bottom  pb-10 mb-10">
              <!-- begin::Email -->
              <div class="mb-4 position-relative d-flex align-items-center">
                <input
                  type="email"
                  class="form-control ps-9"
                  placeholder="Merchant Email"
                  v-model="form.email"
                />

                <div class="invalid-feedback form-control" v-if="v$.email.$errors.length">
                  <span> {{ v$.email.$errors[0].$message }}</span>
                </div>

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/mail.svg"
                  class="position-absolute start-8px svg-icon-primary"
                ></inline-svg>
                <!-- end::Icon -->

                <!-- begin::Icon -->
                <div
                  v-if="!v$.email.$invalid"
                  class="w-33px h-24px rounded-3 border border-primary position-absolute end-8px d-flex align-items-center justify-content-center"
                >
                  <inline-svg
                    src="media/icons/icons/valid-form.svg"
                    height="18"
                    width="18"
                  ></inline-svg>
                </div>
                <!-- end::Icon -->
              </div>
              <!-- end::Email -->

              <!-- begin::Type -->
              <div class="position-relative">
                <SelectDropdown
                  placeholder="Choose Position"
                  svgIcon="media/icons/icons/splite.svg"
                  svgIconColor="primary"
                  toggleClass="px-2"
                  show="type"
                  check="type"
                  :items="shareAppStatus"
                  :selected="shareType"
                  @change="toggleShareType"
                />
                <div class="invalid-feedback form-control" v-if="v$.type.$errors.length">
                  <span> {{ v$.type.$errors[0].$message }}</span>
                </div>
              </div>
              <!-- end::Type -->
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
        <div class="card border-0 mb-6">
          <div
            class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
          >
            <p class="offcanvas-action-text">
              Latest clicks/conversions. Are you sure?
            </p>

            <!-- begin::Actions -->
            <div class="d-flex gap-4 w-100 w-sm-initial">
              <button
                type="submit"
                :disabled="loading"
                class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base fw-normal"
              >
                {{ loading ? 'Loading...' : 'Add' }}
              </button>
            </div>
            <!-- end::Actions -->
          </div>
        </div>
        <!-- end::Action Card -->
      </form>
    </div>
  </div>
</template>
