<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
import useForm from '@/hooks/useForm.js'
import useConvertDate from '@/hooks/useConvertDate.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required, sameAs } from '@vuelidate/validators'

// Password Mettwr
import { PasswordMeterComponent } from '@/assets/js/PasswordMeter'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// ----- START ----- //

// Generals
const store = useAuthStore()
const { showFeedBacks } = useForm()
const { createDate } = useConvertDate()

// Refs
const loading = ref(false)
const passwordMeter = ref(null)
const showPass1 = ref(false)
const showPass2 = ref(false)
const showPass3 = ref(false)

// Computeds
const passwordComputed = computed(() => form.value.password)

// Vuelidate
const form = ref({
  old_password: null,
  password: null,
  confirm_password: null
})

const rules = {
  old_password: {
    required: helpers.withMessage('Current password is required', required)
  },
  password: {
    required: helpers.withMessage('New password is required', required)
  },
  confirm_password: {
    required: helpers.withMessage('rePassword is required', required),
    sameAsPassword: helpers.withMessage('Password not matching ', sameAs(passwordComputed))
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Reset Form
 */
const resetForm = () => {
  form.value = {
    old_password: null,
    password: null,
    confirm_password: null
  }
  v$.value.$reset()
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('updatePassword_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Update Profile
 */
const updatePassword = async () => {
  // Validion Form
  const result = await v$.value.$validate()
  if (result) {
    // Start Loading
    loading.value = true

    // Set Variables
    const updateTime = createDate('YYYY-MM-DD hh:mm:ss')

    let fd = new FormData()
    fd.append('_method', 'put')
    fd.append('old_password', form.value.old_password)
    fd.append('password', form.value.password)
    fd.append('confirm_password', form.value.confirm_password)

    // Request
    await store.updatePassword({ fd, updateTime }).then((res) => {
      if (res) {
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

onMounted(() => {
  const myOffcanvas = document.getElementById('updatePassword_offcanvas')

  /**
   * Offcanvas Fire On Show
   */
  myOffcanvas.addEventListener('shown.bs.offcanvas', () => {
    passwordMeter.value = new PasswordMeterComponent({})
  })

  /**
   * Offcanvas Fire On Hide
   */
  myOffcanvas.addEventListener('hidden.bs.offcanvas', () => {
    resetForm()
    passwordMeter.value = null
  })
})
</script>

<template>
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="updatePassword_offcanvas"
    aria-labelledby="offcanvasUpdatePassword"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <form @submit.prevent="updatePassword">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4 min-h-354px">
          <div class="card-body">
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
                <h3 class="mb-0 text-gray-900">Update Password</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">
                  Some info may be visible to other people using Google services.
                </p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <div>
              <!-- begin::Old Password -->
              <div class="mb-4 position-relative d-flex align-items-center">
                <input
                  :type="showPass1 ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Current Password"
                  v-model="form.old_password"
                />
                <div class="invalid-feedback form-control" v-if="v$.old_password.$errors.length">
                  <span> {{ v$.old_password.$errors[0].$message }}</span>
                </div>

                <!-- begin::Icon -->
                <inline-svg
                  @click="showPass1 = !showPass1"
                  :src="`media/icons/icons/${showPass1 ? 'hide' : 'show'}.svg`"
                  class="position-absolute end-16px cursor-pointer svg-icon-gray-700"
                ></inline-svg>
                <!-- end::Icon -->
              </div>
              <!-- end::Old Password -->

              <div data-password-meter="true">
                <!-- begin::Password -->
                <div class="mb-3 position-relative d-flex align-items-center">
                  <input
                    :type="showPass2 ? 'text' : 'password'"
                    class="form-control"
                    placeholder="New Password"
                    v-model="form.password"
                  />
                  <div class="invalid-feedback form-control" v-if="v$.password.$errors.length">
                    <span> {{ v$.password.$errors[0].$message }}</span>
                  </div>

                  <!-- begin::Icon -->
                  <inline-svg
                    @click="showPass2 = !showPass2"
                    :src="`media/icons/icons/${showPass2 ? 'hide' : 'show'}.svg`"
                    class="position-absolute end-16px cursor-pointer svg-icon-gray-700"
                  ></inline-svg>
                  <!-- end::Icon -->
                </div>
                <!-- end::Password -->

                <!--begin::Meter-->
                <div
                  class="d-flex align-items-center gap-7 px-2 mb-6"
                  data-password-meter-control="highlight"
                >
                  <div class="flex-grow-1 bg-gray-200 bg-active-primary rounded h-6px"></div>
                  <div class="flex-grow-1 bg-gray-200 bg-active-primary rounded h-6px"></div>
                  <div class="flex-grow-1 bg-gray-200 bg-active-primary rounded h-6px"></div>
                  <div class="flex-grow-1 bg-gray-200 bg-active-primary rounded h-6px"></div>
                </div>
                <!--end::Meter-->

                <!-- begin::Confirm Password -->
                <div class="mb-0 position-relative d-flex align-items-center">
                  <input
                    :type="showPass3 ? 'text' : 'password'"
                    class="form-control"
                    placeholder="rePassword"
                    v-model="form.confirm_password"
                  />
                  <div
                    class="invalid-feedback form-control"
                    v-if="v$.confirm_password.$errors.length"
                  >
                    <span> {{ v$.confirm_password.$errors[0].$message }} </span>
                  </div>

                  <!-- begin::Icon -->
                  <inline-svg
                    @click="showPass3 = !showPass3"
                    :src="`media/icons/icons/${showPass3 ? 'hide' : 'show'}.svg`"
                    class="position-absolute end-16px cursor-pointer svg-icon-gray-700"
                  ></inline-svg>
                  <!-- end::Icon -->
                </div>
                <!-- end::Confirm Password -->
              </div>
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
