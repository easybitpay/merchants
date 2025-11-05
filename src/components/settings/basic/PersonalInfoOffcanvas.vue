<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
import useForm from '@/composables/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// Component
import BirthdateDropdown from '../../globals/BirthdateDropdown.vue'
import SelectDropdown from '../../globals/SelectDropdown.vue'

const genders = [
  {
    title: 'Male',
    value: 'Male'
  },
  {
    title: 'Femail',
    value: 'Femail'
  },
  {
    title: 'Rather not say',
    value: 'Rather not say'
  }
]
// ----- START ----- //

// Generals
const store = useAuthStore()
const { showFeedBacks } = useForm()

// Refs
const loading = ref(false)

// Computeds
const currentUser = computed(() => store.currentUser)
const profile = computed(() => JSON.parse(currentUser.value?.merchant?.profile || '{}'))

// Select Dropdown
const birthdate = ref('')
const changeBirthdate = (date) => {
  birthdate.value = date
}

const gender = ref({})
const changeGender = (info) => {
  gender.value = info
}

// Vuelidate
const form = ref({
  first_name: null,
  last_name: null
})

const rules = {
  first_name: {
    required: helpers.withMessage('First name is required', required)
  },
  last_name: {
    required: helpers.withMessage('Last name is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Set Default Values
 */
const setDefaultValues = () => {
  form.value = {
    first_name: currentUser.value?.merchant?.first_name || null,
    last_name: currentUser.value?.merchant?.last_name || null
  }

  birthdate.value = profile.value.birth_date || ''

  if (profile.value.gender) {
    for (let i = 0; i < genders.length; i++) {
      const element = genders[i]
      if (element.value === profile.value.gender) {
        gender.value = element
        break
      }
    }
  }
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('personalInfo_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Update Profile
 */
const updateContactInfo = async () => {
  // Validion Form
  const result = await v$.value.$validate()
  if (result) {
    // Start Loading
    loading.value = true

    // Set Variables
    let profile = {
      gender: gender.value.value,
      birth_date: birthdate.value
    }

    let fd = new FormData()
    fd.append('_method', 'put')
    fd.append('first_name', form.value.first_name)
    fd.append('last_name', form.value.last_name)
    fd.append('profile', JSON.stringify(profile))

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
  const myOffcanvas = document.getElementById('personalInfo_offcanvas')

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
    id="personalInfo_offcanvas"
    aria-labelledby="offcanvasContactInfo"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <form @submit.prevent="updateContactInfo">
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
                <h3 class="mb-0 text-dark">Personal Information</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">Update your personal details</p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <div>
              <div class="row mb-4 gy-4">
                <!-- begin::First Name -->
                <div class="col-md-6">
                  <div class="position-relative d-flex align-items-center">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Your First Name"
                      v-model="form.first_name"
                    />

                    <div class="invalid-feedback form-control" v-if="v$.first_name.$errors.length">
                      <span> {{ v$.first_name.$errors[0].$message }}</span>
                    </div>
                  </div>
                </div>
                <!-- end::First Name -->

                <!-- begin::Last Name -->
                <div class="col-md-6">
                  <div class="position-relative d-flex align-items-center">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Your Last Name"
                      v-model="form.last_name"
                    />

                    <div class="invalid-feedback form-control" v-if="v$.last_name.$errors.length">
                      <span> {{ v$.last_name.$errors[0].$message }}</span>
                    </div>
                  </div>
                </div>
                <!-- end::Last Name -->
              </div>

              <!-- begin::Birthdate -->
              <div class="mb-4">
                <BirthdateDropdown
                  placeholder="Enter Your Birthday (YY/MM/DD)"
                  :selected="birthdate"
                  @change="changeBirthdate"
                />
              </div>
              <!-- end::Birthdate -->

              <!-- begin::Gender -->
              <div>
                <SelectDropdown
                  placeholder="Gender"
                  show="title"
                  check="value"
                  :items="genders"
                  :selected="gender"
                  @change="changeGender"
                />
              </div>
              <!-- end::Gender -->
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
