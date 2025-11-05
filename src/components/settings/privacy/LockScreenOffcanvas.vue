<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
import useForm from '@/composables/useForm.js'
import useCrypto from '@/composables/useCrypto.js'
import useConvertDate from '@/composables/useConvertDate.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Components
import VOtpInput from 'vue3-otp-input'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// Emit
const emit = defineEmits(['changeLockScreenStatus'])

// ----- START ----- //

// Generals
const store = useAuthStore()
const { showFeedBacks } = useForm()
const { encriptCrypto, decriptCrypto } = useCrypto()
const { createTimestamp } = useConvertDate()

// Refs
const step = ref(2)
const loading = ref(false)
const otpInputValue = ref('')

// Vuelidate
const form = ref({
  code: null
})

const rules = {
  password: {
    required: helpers.withMessage('Password is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Reset Form
 */
const resetForm = () => {
  step.value = 2
  otpInputValue.value = ''
  form.value = {
    password: null
  }
  v$.value.$reset()
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('lockScreen_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Get New Secret
 */
const checkUserPassword = async () => {
  const result = await v$.value.$validate()
  if (result) {
    // Start Loading
    loading.value = true

    // Set Variables
    step.value = 2

    // Request
    //   await appStore.revokeSecret({ app_id, content }).then((res) => {
    //     if (res) {
    //       secret.value = res
    //       step.value = 2
    //     }
    //   })

    // Stop Loading
    loading.value = false
  } else {
    showFeedBacks()
  }
}

const setLockScreenInfo = () => {
  if (otpInputValue.value.length == 4) {
    const lockScreenStatus = localStorage.getItem('lockScreenInfo')

    if (lockScreenStatus) {
      const parsedInfo = JSON.parse(lockScreenStatus)

      const decriptedPassword = decriptCrypto(parsedInfo.password, otpInputValue.value)

      if (decriptedPassword) {
        localStorage.removeItem('lockScreenInfo')

        resetForm()
        closeOffcanvas()
      }
    } else {
      // Set Variable
      const info = {
        timestamp: createTimestamp(),
        password: encriptCrypto(otpInputValue.value, otpInputValue.value)
      }

      localStorage.setItem('lockScreenInfo', JSON.stringify(info))
      resetForm()
      closeOffcanvas()
    }
  }
}

onMounted(() => {
  const myOffcanvas = document.getElementById('lockScreen_offcanvas')

  /**
   * Offcanvas Fire On Hide
   */
  myOffcanvas.addEventListener('hidden.bs.offcanvas', () => {
    resetForm()
    emit('changeLockScreenStatus')
  })
})
</script>

<template>
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="lockScreen_offcanvas"
    aria-labelledby="offcanvasLockScreen"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <form @submit.prevent="checkUserPassword">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4 min-h-354px">
          <div class="card-body pb-lg-22">
            <!-- begin::Header -->
            <div class="d-flex gap-4">
              <div>
                <div class="svg-holder">
                  <inline-svg :src="`/media/icons/shapes/${$filters.shapeStatus('lock')}.svg`" width="21" height="32"></inline-svg>
                </div>
              </div>

              <div class="mb-10">
                <h3 class="mb-0 text-dark">Lock Screen</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">Two-factor authentication</p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <div>
              <p class="text-dark ls-base mb-10">
                "Existential" redirects here. For the logical sense of the term, see Existential
                quantification. For other uses, see Existence (disambiguation).For the philosophical
                position commonly seen as the antonym of existentialism, see Essentialism.
              </p>

              <!-- begin::Password -->
              <div class="w-100 position-relative d-flex align-items-center mb-4" v-if="step === 1">
                <input
                  type="password"
                  class="form-control ps-9"
                  placeholder="input your Curent Password"
                  v-model="form.password"
                />

                <div class="invalid-feedback form-control" v-if="v$.password.$errors.length">
                  <span> {{ v$.password.$errors[0].$message }}</span>
                </div>

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/mail.svg"
                  class="position-absolute start-8px svg-icon-primary"
                ></inline-svg>
                <!-- end::Icon -->
              </div>
              <!-- end::Password -->

              <!-- begin::OTP -->
              <div class="d-flex align-items-center justify-content-center" v-else>
                <div class="otp-input otp-input-center">
                  <VOtpInput
                    ref="otpInput"
                    input-classes="form-control p-0 w-40px h-40px w-sm-48px h-sm-48px text-center fs-4"
                    separator=""
                    :num-inputs="4"
                    :should-auto-focus="true"
                    input-type="numeric"
                    v-model:value="otpInputValue"
                    @on-complete="setLockScreenInfo"
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
              class="w-56px h-56px d-flex align-items-center justify-content-center rounded-1 bg-white"
            >
              <inline-svg :src="`/media/icons/shapes/${$filters.shapeStatus('documentation')}.svg`"></inline-svg>
            </div>
          </div>
          <div class="card border-0 mb-6 w-100">
            <div
              class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
            >
              <p class="offcanvas-action-text">
                Latest clicks/conversions. Are you sure?
              </p>

              <!-- begin::Actions -->
              <div class="d-flex gap-4 w-100 w-sm-initial">
                <button
                  type="button"
                  class="btn btn-sm btn-light w-100 w-sm-104px h-24px ls-base fw-normal"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  Cancel
                </button>

                <button
                  v-if="step === 1"
                  :disabled="loading"
                  type="submit"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base fw-normal"
                >
                  {{ loading ? 'Loading...' : 'Next' }}
                </button>

                <button
                  v-else
                  @click="setLockScreenInfo"
                  type="button"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base"
                >
                  Next
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
