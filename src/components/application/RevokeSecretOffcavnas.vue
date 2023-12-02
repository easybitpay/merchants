<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// ----- START ----- //

// Generals
const appStore = useAppStore()
const authStore = useAuthStore()
const { showFeedBacks } = useForm()

// Refs
const step = ref(1)
const secret = ref('')
const loading = ref(false)

// Computeds
const selectedApp = computed(() => appStore.selectedApp)
const currentUser = computed(() => authStore.currentUser)

// Vuelidate
const form = ref({
  code: null
})

const rules = {
  code: {
    required: helpers.withMessage('2FA code is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Reset Form
 */
const resetForm = () => {
  step.value = 1
  secret.value = ''
  form.value = {
    code: null
  }
  v$.value.$reset()
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
const getNewSecret = async () => {
  // Start Loading
  loading.value = true

  // Set Variables
  let content = {}
  const enable_2fa = currentUser.value.merchant.two_factor_enabled
  let app_id = selectedApp.value.id

  // Validation Form
  if (enable_2fa) {
    const result = await v$.value.$validate()
    if (result) {
      content.code = form.value.code
    }
  }

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

      <form @submit.prevent="getNewSecret">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4 min-h-354px">
          <div class="card-body pb-lg-22">
            <!-- begin::Header -->
            <div class="d-flex gap-4">
              <div>
                <inline-svg src="media/icons/shapes/usb.svg" height="46"></inline-svg>
              </div>

              <div class="mb-10">
                <h3 class="mb-0 text-gray-900">Revoke Secret</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">
                  Some info may be visible to other people using Google services.
                </p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <div>
              <p class="text-gray-900 ls-base mb-0">
                "Existential" redirects here. For the logical sense of the term, see Existential
                quantification. For other uses, see Existence (disambiguation).For the philosophical
                position commonly seen as the antonym of existentialism, see Essentialism. Clockwise
                from top left: Søren Kierkegaard, Simone de Beauvoir, Jean-Paul Sartre, Friedrich
                NietzscheExistentialism is a form of philosophical inquiry that explores the issue
                of human existence. Existentialist philosophers explore questions related to the
                meaning, purpose, and value of human existence.
              </p>

              <!-- begin::OTP -->
              <div
                class="mt-8 pt-8 border-top border-gray-200"
                v-if="step === 1 && currentUser?.merchant?.two_factor_enabled"
              >
                <!-- begin::2FA Code -->
                <div class="w-100 position-relative d-flex align-items-center mb-4">
                  <input
                    type="text"
                    class="form-control ps-9 placeholder-gray-500"
                    placeholder="Inter confirmation code From Your Authenticator"
                    v-model="form.code"
                  />

                  <div class="invalid-feedback form-control" v-if="v$.code.$errors.length">
                    <span> {{ v$.code.$errors[0].$message }}</span>
                  </div>

                  <!-- begin::Icon -->
                  <inline-svg
                    src="media/icons/icons/lock.svg"
                    class="position-absolute start-8px svg-icon-primary"
                  ></inline-svg>
                  <!-- end::Icon -->
                </div>
                <!-- end::2FA Code -->
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
              class="w-56px h-56px d-flex align-items-center justify-content-center rounded bg-white"
            >
              <inline-svg src="media/icons/shapes/bookmark.svg"></inline-svg>
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
