<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Bootstrap
import { Offcanvas } from 'bootstrap'
// ----- START ----- //

// Generals
const store = useAppStore()
const { showFeedBacks } = useForm()

// Refs
const loading = ref(false)

// Computeds
const selectedApp = computed(() => store.selectedApp)

// Vuelidate
const generalForm = ref({
  name: '',
  site_url: '',
  callback_url: '',
  redirect_url: '',
  need_name: false,
  need_email: false
})

const amountForm = ref({
  amount: ''
})

const generalRules = {
  name: {
    required: helpers.withMessage('Name is required', required)
  },
  site_url: {
    required: helpers.withMessage('Site url is required', required)
  },
  callback_url: {
    required: helpers.withMessage('Callback url is required', required)
  },
  redirect_url: {
    required: helpers.withMessage('Redirect url is required', required)
  }
}

const amountRules = {
  amount: {
    required: helpers.withMessage('Amount is required', required)
  }
}

const vGeneral$ = useVuelidate(generalRules, generalForm)
const vAmount$ = useVuelidate(amountRules, amountForm)

// Functions

/**
 * Set Default Values
 */
const setDefaultValues = () => {
  const settings = selectedApp.value.settings

  generalForm.value = {
    name: selectedApp.value.name,
    site_url: selectedApp.value.site_url,
    callback_url: selectedApp.value.callback_url,
    redirect_url: selectedApp.value.redirect_url,
    need_name: settings ? settings.need_name : false,
    need_email: settings ? settings.need_email : false
  }

  amountForm.value = {
    amount: settings ? settings.amount : ''
  }
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('appInfo_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Update App Info
 */
const updateAppInfo = async () => {
  // Validion Form
  const generalResult = await vGeneral$.value.$validate()
  let amountResult = true

  if (selectedApp.value.type == 2) {
    amountResult = await vAmount$.value.$validate()
  }

  if (generalResult && amountResult) {
    // Start Loading
    loading.value = true

    // Set Variables
    const id = selectedApp.value.id
    let fd = new FormData()
    let setting = {}

    for (const [key, value] of Object.entries(generalForm.value)) {
      if (key === 'need_name' || key === 'need_email') {
        setting[key] = value
      } else {
        fd.append(key, value)
      }
    }

    if (selectedApp.value.type == 2) setting.amount = amountForm.value.amount

    if (!setting.need_email) setting.need_email = false

    if (!setting.need_name) setting.need_name = false

    if (!setting.amount) setting.amount = ""

    fd.append("settings", JSON.stringify(setting));
    
    // Request
    await store.updateApp({ id, fd }).then((res) => {
      if (res) {
        closeOffcanvas()
      }
    })

    // Stop Loading
    loading.value = false
  } else {
    showFeedBacks()
  }
}

onMounted(() => {
  const myOffcanvas = document.getElementById('appInfo_offcanvas')

  /**
   * Offcanvas Fire On Show
   */
  myOffcanvas.addEventListener('shown.bs.offcanvas', () => {
    setDefaultValues()
  })
})
</script>

<template>
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="appInfo_offcanvas"
    aria-labelledby="offcanvasAppInfo"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <form @submit.prevent="updateAppInfo">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4 min-h-354px">
          <div class="card-body pb-lg-22">
            <!-- begin::Header -->
            <div class="d-flex gap-4">
              <div>
                <inline-svg src="media/icons/shapes/person.svg"></inline-svg>
              </div>

              <div class="mb-10">
                <h3 class="mb-0 text-gray-900">App info</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">
                  Some info may be visible to other people using Google services.
                </p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <div>
              <!-- begin::Name -->
              <div class="position-relative d-flex align-items-center mb-4">
                <input
                  type="text"
                  class="form-control"
                  placeholder="App name"
                  v-model="generalForm.name"
                />

                <div class="invalid-feedback form-control" v-if="vGeneral$.name.$errors.length">
                  <span> {{ vGeneral$.name.$errors[0].$message }}</span>
                </div>
              </div>
              <!-- end::Name -->

              <!-- begin::Site URL -->
              <div class="position-relative d-flex align-items-center mb-4">
                <input
                  type="text"
                  class="form-control"
                  placeholder="App site url"
                  v-model="generalForm.site_url"
                />

                <div class="invalid-feedback form-control" v-if="vGeneral$.site_url.$errors.length">
                  <span> {{ vGeneral$.site_url.$errors[0].$message }}</span>
                </div>
              </div>
              <!-- end::Site URL -->

              <!-- begin::Callback URL -->
              <div class="position-relative d-flex align-items-center mb-4">
                <input
                  type="text"
                  class="form-control"
                  placeholder="App callback url"
                  v-model="generalForm.callback_url"
                />

                <div
                  class="invalid-feedback form-control"
                  v-if="vGeneral$.callback_url.$errors.length"
                >
                  <span> {{ vGeneral$.callback_url.$errors[0].$message }}</span>
                </div>
              </div>
              <!-- end::Callback URL -->

              <!-- begin::Redirect URL -->
              <div class="position-relative d-flex align-items-center">
                <input
                  type="text"
                  class="form-control"
                  placeholder="App redirect url"
                  v-model="generalForm.redirect_url"
                />

                <div
                  class="invalid-feedback form-control"
                  v-if="vGeneral$.redirect_url.$errors.length"
                >
                  <span> {{ vGeneral$.redirect_url.$errors[0].$message }}</span>
                </div>
              </div>
              <!-- end::Redirect URL -->

              <!-- begin::amount -->
              <div
                class="position-relative d-flex align-items-center mt-4"
                v-if="selectedApp.type == 2"
              >
                <input
                  type="text"
                  class="form-control"
                  placeholder="Amount"
                  v-model="amountForm.amount"
                />

                <div class="invalid-feedback form-control" v-if="vAmount$.amount.$errors.length">
                  <span> {{ vAmount$.amount.$errors[0].$message }}</span>
                </div>
              </div>
              <!-- end::amount -->

              <!-- begin::Features -->
              <div
                class="d-flex flex-column gap-4 mt-4 border-top border-gray-200 pt-10 mt-10"
                v-if="selectedApp.type == 3"
              >
                <!-- begin::Item -->
                <div
                  class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-start gap-3 form-check form-switch p-0"
                >
                  <label class="form-check-label text-gray-800" for="app-feature-1">
                    Get user's name in pay page
                  </label>
                  <input
                    class="form-check-input m-0"
                    type="checkbox"
                    role="switch"
                    id="app-feature-1"
                    v-model="generalForm.need_name"
                  />
                </div>
                <!-- begin::Item -->

                <!-- begin::Item -->
                <div
                  class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-start gap-3 form-check form-switch p-0"
                >
                  <label class="form-check-label text-gray-800" for="app-feature-2">
                    Get user's email in pay page
                  </label>
                  <input
                    class="form-check-input m-0"
                    type="checkbox"
                    role="switch"
                    id="app-feature-2"
                    v-model="generalForm.need_email"
                  />
                </div>
                <!-- begin::Item -->
              </div>
              <!-- end::Features -->
            </div>
            <!-- end::Content -->
          </div>
        </div>
        <!-- end::Content Card -->

        <!-- begin::Action Card -->
        <div class="card border-0 mb-6">
          <div
            class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
          >
            <p class="fs-7 mb-0 ls-base text-gray-800 lh-32px">
              Latest clicks/conversions. Are you sure?
            </p>

            <!-- begin::Actions -->
            <div class="d-flex gap-4 w-100 w-sm-initial">
              <button
                type="button"
                class="btn btn-sm bg-gray-500 text-white w-100 w-sm-104px h-24px ls-base fw-normal"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                Cancel
              </button>

              <button
                type="submit"
                :disabled="loading"
                class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base fw-normal"
              >
                {{ loading ? 'Loading...' : 'Save' }}
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
