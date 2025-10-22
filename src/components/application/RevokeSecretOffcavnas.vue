<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

// Components
import VOtpInput from 'vue3-otp-input'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

// ----- START ----- //

// Generals
const appStore = useAppStore()
const authStore = useAuthStore()

// Refs
const step = ref(1)
const secret = ref('')
const loading = ref(false)
const otpInputValue = ref('')

// Computeds
const selectedApp = computed(() => appStore.selectedApp)
const currentUser = computed(() => authStore.currentUser)

// Functions

/**
 * Reset Form
 */
const resetForm = () => {
  step.value = 1
  secret.value = ''
  otpInputValue.value = ''
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('revokeSecret_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Get New Secret
 */

const checkCallNewSecret = () => {
  let content = {}
  const enable_2fa = currentUser.value.merchant.two_factor_enabled

  if (enable_2fa) {
    if (otpInputValue.value.length == 6) {
      content.code = otpInputValue.value
      getNewSecret(content)
    }
  } else {
    getNewSecret(content)
  }
}
const getNewSecret = async (content) => {
  // Start Loading
  loading.value = true

  // Set Variables
  let app_id = selectedApp.value.id

  // Request
  await appStore.revokeSecret({ app_id, content }).then((res) => {
    if (res) {
      secret.value = res
      step.value = 2
    }
  })

  // Stop Loading
  loading.value = false
}

const copyAndClose = () => {
  navigator.clipboard.writeText(secret.value)
  appendAlert('Copied to clipboard', {
    color: 'success',
    type: 'alert'
  })
  closeOffcanvas()
}

onMounted(() => {
  const myOffcanvas = document.getElementById('revokeSecret_offcanvas')

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
    id="revokeSecret_offcanvas"
    aria-labelledby="offcanvasRevokeSecret"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <form @submit.prevent="checkCallNewSecret">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4 min-h-354px">
          <div class="card-body pb-lg-22">
            <!-- begin::Header -->
            <div class="d-flex gap-4">
              <div>
                <div class="svg-holder">
                  <inline-svg
                    :src="`media/icons/shapes/${$filters.shapeStatus('save-2')}.svg`"
                    width="19"
                    height="33"
                  ></inline-svg>
                </div>
              </div>

              <div class="mb-10">
                <h3 class="mb-0 text-gray-900">Revoke Secret</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">
                  Updating your secret key will require you to update your payment gateway settings
                  as well.
                </p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <div>
              <p class="text-gray-900 ls-base mb-0 text-justify">
                Please note that changing your secret key will invalidate your previous one. To
                ensure uninterrupted transactions, you must also update your payment gateway
                configuration with the new secret key. Failing to do so may cause payment processing
                errors or failed transactions. Make sure to copy and apply the new key in your
                gateway settings immediately after updating it here.
              </p>

              <!-- begin::OTP -->

              <div
                class="mt-8 pt-8 border-top border-gray-200"
                v-if="step === 1 && currentUser?.merchant?.two_factor_enabled"
              >
                <!-- begin::OTP -->
                <div class="d-flex align-items-center justify-content-center">
                  <div class="otp-input otp-input-center otp-input-small-gap">
                    <VOtpInput
                      ref="otpInput"
                      input-classes="form-control p-0 w-40px h-40px w-sm-48px h-sm-48px text-center fs-4"
                      separator=""
                      :num-inputs="6"
                      :should-auto-focus="true"
                      input-type="numeric"
                      v-model:value="otpInputValue"
                      @on-complete="checkCallNewSecret"
                    />
                  </div>
                </div>
                <!-- end::OTP -->
              </div>
              <!-- end::OTP -->

              <!-- begin::Secret Key -->
              <div class="card rounded border-gray-200 mt-10" v-if="step === 2">
                <div class="card-body p-4 py-sm-2 ps-sm-4 pe-2">
                  <div
                    class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-4 gap-md-6"
                  >
                    <!-- begin::Title -->
                    <h3 class="m-0 text-cyan-500 lh-24px">Revoke</h3>
                    <!-- end::Title -->

                    <!-- begin::Secret & Copy -->
                    <div class="d-flex align-items-center w-100">
                      <input
                        type="text"
                        class="form-control px-0 border-0 bg-transparent text-gray-700"
                        :value="secret"
                        readonly
                      />

                      <!-- begin::Icon -->
                      <inline-svg
                        src="media/icons/icons/copy.svg"
                        height="40"
                        width="40"
                        class="cursor-pointer"
                        @click="copyAndClose"
                      ></inline-svg>
                      <!-- end::Icon -->
                    </div>
                    <!-- end::Secret & Copy -->
                  </div>
                </div>
              </div>
              <!-- end::Secret Key -->
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
              <inline-svg
                :src="`media/icons/shapes/${$filters.shapeStatus('documentation')}.svg`"
              ></inline-svg>
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
                  v-if="step === 1"
                  type="button"
                  class="btn btn-sm bg-gray-500 text-white w-100 w-sm-104px h-24px ls-base fw-normal"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  Cancel
                </button>

                <button
                  v-if="step === 1"
                  :disabled="loading"
                  type="submit"
                  class="btn btn-sm btn-primary w-100 w-sm-initial h-24px ls-base fw-normal"
                >
                  {{ loading ? 'Loading...' : 'Generate Revoke' }}
                </button>

                <button
                  v-else
                  @click="copyAndClose"
                  type="button"
                  class="btn btn-sm btn-primary w-100 w-sm-initial h-24px ls-base"
                >
                  Copy And Close
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
