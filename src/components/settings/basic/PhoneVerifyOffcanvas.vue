<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Components
import VOtpInput from 'vue3-otp-input'
import Countdown from '../../globals/CountDown.vue'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// ----- START ----- //

// Generals
const store = useAuthStore()

// Refs
const loading = ref(false)
const otpInputValue = ref('')

// Computeds
const currentUser = computed(() => store.currentUser)

// Functions

/**
 * Reset Form
 */
const resetForm = () => {
  otpInputValue.value = ''
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('phoneVerify_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

const sendSMS = () => {
  store.resendEmailVerification()
}

/**
 * Verify Email
 */
const verifyPhone = async () => {
  if (otpInputValue.value.length == 6) {
    // Start Loading
    loading.value = true

    // Request
    await store.verifyPhone(otpInputValue.value).then(res => {
        if (res) {
            closeOffcanvas()
        }
    })
    
    // Stop Loading
    loading.value = false
  }
}

onMounted(() => {
  const myOffcanvas = document.getElementById('phoneVerify_offcanvas')

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
    id="phoneVerify_offcanvas"
    aria-labelledby="offcanvasPhoneVerify"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <form @submit.prevent="verifyPhone">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4 min-h-354px">
          <div class="card-body pb-lg-22">
            <!-- begin::Header -->
            <div class="d-flex gap-4">
              <div>
                <div class="svg-holder">
                  <inline-svg
                    :src="`/media/icons/shapes/${$filters.shapeStatus('lock')}.svg`"
                    width="21"
                    height="32"
                  ></inline-svg>
                </div>
              </div>

              <div class="mb-10">
                <h3 class="mb-0 text-gray-900">Phone Verify</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">Phone verify authentication</p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <div>
              <p class="text-gray-900 ls-base mb-10">
                A 6-digit confirmation code has been sent to {{ currentUser.phone }} via SMS.
                <span class="text-primary">
                  <Countdown :showText="false" :emidiate="false" @isRestarted="sendSMS" />
                </span>
              </p>

              <!-- begin::OTP -->
              <div class="d-flex align-items-center justify-content-center">
                <div class="otp-input otp-input-center">
                  <VOtpInput
                    ref="otpInput"
                    input-classes="form-control p-0 w-40px h-40px w-sm-48px h-sm-48px text-center fs-4"
                    separator=""
                    :num-inputs="6"
                    :should-auto-focus="true"
                    input-type="numeric"
                    v-model:value="otpInputValue"
                    @on-complete="verifyPhone"
                  />
                </div>
              </div>
              <!-- end::OTP -->
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
                :src="`/media/icons/shapes/${$filters.shapeStatus('documentation')}.svg`"
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
                  type="button"
                  class="btn btn-sm bg-gray-500 text-white w-100 w-sm-104px h-24px ls-base fw-normal"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  Cancel
                </button>

                <button
                  :disabled="loading"
                  type="submit"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base fw-normal"
                >
                  {{ loading ? 'Loading...' : 'Save' }}
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
