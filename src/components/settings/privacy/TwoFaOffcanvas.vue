<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// Emit
const emit = defineEmits(['change2FaToggleStatus'])

// ----- START ----- //

// Generals
const store = useAuthStore()
const { showFeedBacks } = useForm()

// Refs
const loadings = ref({
  main: false,
  submit: false
})

const authInfo = ref({})

// Computeds
const currentUser = computed(() => store.currentUser)

// Vuelidate
const form = ref({
  code: null
})

const rules = {
  code: {
    required: helpers.withMessage('Code is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Reset Form
 */
const resetForm = () => {
  authInfo.value = {}
  form.value.code = null
  v$.value.$reset()
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('twoFactor_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Get 2FA Info
 */
const get2FAInfo = async () => {
  const enable_2fa = currentUser.value.merchant.two_factor_enabled

  if (!enable_2fa) {
    // Start Loading
    loadings.value.main = true

    // Request
    await store.get2FAInfo().then((res) => {
      if (res) {
        authInfo.value = res
      }
    })

    // Stop Loading
    loadings.value.main = false
  }
}

/**
 * Change 2FA Status
 */
const changeTwoFaStatus = async () => {
  // Validate Form
  const result = await v$.value.$validate()
  if (result) {
    // Start loading
    loadings.value.submit = true

    // Set Variable
    const enable_2fa = currentUser.value.merchant.two_factor_enabled
    let fd = new FormData()
    fd.append('code', form.value.code)

    // Request
    if (enable_2fa) {
      await store.disable2FA(fd).then((res) => {
        if (res) {
          resetForm()
          closeOffcanvas()
        }
      })
    } else {
      await store.enable2FA(fd).then((res) => {
        if (res) {
          resetForm()
          closeOffcanvas()
        }
      })
    }

    // Stop Loading
    loadings.value.submit = false
  } else {
    showFeedBacks()
  }
}

// const copy = (text) => {
//   navigator.clipboard.writeText(text)
// }

onMounted(() => {
  const myOffcanvas = document.getElementById('twoFactor_offcanvas')

  /**
   * Offcanvas Fire On Show
   */
  myOffcanvas.addEventListener('shown.bs.offcanvas', () => {
    get2FAInfo()
  })

  /**
   * Offcanvas Fire On Hide
   */
  myOffcanvas.addEventListener('hidden.bs.offcanvas', () => {
    resetForm()
    emit('change2FaToggleStatus')
  })
})
</script>

<template>
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="twoFactor_offcanvas"
    aria-labelledby="offcanvasTwoFactor"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <form @submit.prevent="changeTwoFaStatus">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4 min-h-354px">
          <div class="card-body pb-lg-22">
            <!-- begin::Header -->
            <div class="d-flex gap-4">
              <div>
                <div class="svg-holder">
                  <inline-svg :src="`/media/icons/shapes/${$filters.shapeStatus('2F')}.svg`" width="39" height="38"></inline-svg>
                </div>
              </div>

              <div class="mb-10">
                <h3 class="mb-0 text-gray-900">2F Activation</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">Two-factor authentication</p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <div>
              <!-- begin::Steps Table -->
              <table class="w-100 text-gray-800 ls-base mb-10">
                <tbody>
                  <!-- begin::Row -->
                  <tr>
                    <td class="pe-2">
                      <div class="max-content">Step 1</div>
                    </td>
                    <td>Open the authenticator mobile app</td>
                  </tr>
                  <!-- end::Row -->

                  <!-- begin::Row -->
                  <tr v-if="!currentUser.merchant.two_factor_enabled">
                    <td class="pe-2">
                      <div class="max-content">Step 2</div>
                    </td>
                    <td>
                      Scan the QR code or enter
                      <span class="text-primary fw-semibold">
                        <Skeletor width="192px" class="rounded-0" v-if="loadings.main" />
                        {{ authInfo.secret }}
                      </span>
                    </td>
                  </tr>
                  <!-- end::Row -->

                  <!-- begin::Row -->
                  <tr>
                    <td class="pe-2">
                      <div class="max-content">
                        Step {{ currentUser.merchant.two_factor_enabled ? '2' : '3' }}
                      </div>
                    </td>
                    <td>Enter the generated code below</td>
                  </tr>
                  <!-- end::Row -->
                </tbody>
              </table>
              <!-- end::Steps Table -->

              <!-- begin::Qr Code -->
              <div
                class="d-flex justify-content-center mb-10"
                v-if="!currentUser.merchant.two_factor_enabled"
              >
                <Skeletor size="140px" class="rounded-0" v-if="loadings.main" />
                <img
                  v-if="authInfo.qr_code"
                  :src="authInfo.qr_code"
                  alt="qr-code"
                  class="mw-140px"
                />
              </div>
              <!-- end::Qr Code -->

              <!-- begin::Authentication Code -->
              <div class="w-100 position-relative d-flex align-items-center mb-4">
                <input
                  type="text"
                  class="form-control ps-9 placeholder-gray-600"
                  placeholder="Authentication code"
                  v-model="form.code"
                />

                <div class="invalid-feedback form-control" v-if="v$.code.$errors.length">
                  <span> {{ v$.code.$errors[0].$message }}</span>
                </div>

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/mail.svg"
                  class="position-absolute start-8px svg-icon-primary"
                ></inline-svg>
                <!-- end::Icon -->
              </div>
              <!-- end::Authentication Code -->
            </div>

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
              <inline-svg :src="`/media/icons/shapes/${$filters.shapeStatus('documentation')}.svg`"></inline-svg>
            </div>
          </div>
          <div class="card border-0 mb-6 w-100">
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
                  :disabled="loadings.submit"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base"
                >
                  {{ loadings.submit ? 'Loading...' : 'Continue' }}
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
