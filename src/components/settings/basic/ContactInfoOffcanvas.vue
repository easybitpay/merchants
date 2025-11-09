<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
import useForm from '@/composables/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// ----- START ----- //
const store = useAuthStore()
const { showFeedBacks } = useForm()

// Refs
const loading = ref(false)

// Computeds
const currentUser = computed(() => store.currentUser)

// Vuelidate
const form = ref({
  phone: null,
  email: null
})

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage("Email isn't valid", email)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Set Default Values
 */
const setDefaultValues = () => {
  form.value = {
    phone: currentUser.value?.merchant?.phone || null,
    email: currentUser.value?.merchant?.email || null
  }
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('contactInfo_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Update Profile
 */
const updateBasicInfo = async () => {
  const result = await v$.value.$validate()
  if (result) {
    // Start Loading
    loading.value = true

    // Set Variables
    let fd = new FormData()
    fd.append('_method', 'put')
    fd.append('first_name', currentUser.value?.merchant?.first_name || '')
    fd.append('last_name', currentUser.value?.merchant?.last_name || '')
    fd.append('email', form.value.email)
    fd.append('phone', form.value.phone)

    // Request
    await store.updateProfile(fd).then((res) => {
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
  const myOffcanvas = document.getElementById('contactInfo_offcanvas')

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
    id="contactInfo_offcanvas"
    aria-labelledby="offcanvasBasicInfo"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <form @submit.prevent="updateBasicInfo">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4 min-h-354px">
          <div class="card-body">
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
                <h3 class="mb-0 text-dark">Basic info</h3>

                <p class="fs-7 mb-0 text-gray-800 dark-text-gray-600 ls-base">
                  Some info may be visible to other people using Google services.
                </p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <div>
              <!-- begin::Phone -->
              <div class="mb-4 position-relative d-flex align-items-center">
                <input
                  type="text"
                  class="form-control ps-10 pe-19"
                  placeholder="Your Phone No."
                  v-model="form.phone"
                />

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/phone.svg"
                  class="position-absolute start-8px svg-icon-primary"
                ></inline-svg>
                <!-- end::Icon -->

                <!-- begin::Icon -->
                <template v-if="currentUser?.merchant?.phone">
                  <div
                    v-if="currentUser?.merchant?.phone_verified_at"
                    class="w-33px h-24px rounded-3 border border-primary position-absolute end-8px d-flex align-items-center justify-content-center"
                  >
                    <inline-svg
                      src="media/icons/icons/valid-form.svg"
                      class="svg-icon-primary"
                      height="18"
                      width="18"
                    ></inline-svg>
                  </div>
                </template>
                <!-- end::Icon -->
              </div>
              <!-- end::Phone -->

              <!-- begin::Email -->
              <div class="mb-0 position-relative d-flex align-items-center">
                <input
                  type="email"
                  class="form-control ps-10 pe-19"
                  placeholder="Your Email"
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
                  v-if="currentUser?.merchant?.email_verified_at"
                  class="w-33px h-24px rounded-3 border border-primary position-absolute end-8px d-flex align-items-center justify-content-center"
                >
                  <inline-svg
                    src="media/icons/icons/valid-form.svg"
                    class="svg-icon-primary"
                    height="18"
                    width="18"
                  ></inline-svg>
                </div>
                <!-- end::Icon -->
              </div>
              <!-- end::Email -->

              <!-- <div class="dropdown">
                <button
                  class="btn px-4 fs-7 bg-gray-100 ls-sm dropdown-toggle w-100 justify-content-between border "
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  UNITED STATE
                </button>
                <ul class="dropdown-menu w-100">
                  <li><a class="dropdown-item">English</a></li>
                  <li><a class="dropdown-item">English 2</a></li>
                </ul>
              </div> -->
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
