<script setup>
// Vue
import { ref } from 'vue'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Component
import BirthdateDropdown from '../globals/BirthdateDropdown.vue'

// ----- START ----- //
const { showFeedBacks } = useForm()

const date = ref('')
const changeDate = (info) => {
  date.value = info
}

const form = ref({
  name: null
})

const rules = {
  name: {
    required: helpers.withMessage('Name No is required', required)
  }
}

const v$ = useVuelidate(rules, form)

const updateContactInfo = async () => {
  const result = await v$.value.$validate()
  if (result) {
    console.log('scas')
  } else {
    showFeedBacks()
  }
}
</script>

<template>
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="contactInfo_offcanvas"
    aria-labelledby="offcanvasContactInfo"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer"
      ></inline-svg>

      <form @submit.prevent="updateContactInfo">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4 min-h-354px">
          <div class="card-body">
            <!-- begin::Header -->
            <div class="d-flex gap-4">
              <div>
                <inline-svg src="media/icons/shapes/person.svg"></inline-svg>
              </div>

              <div class="mb-10">
                <h3 class="mb-0 text-gray-900">Contact info</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">
                  Some info may be visible to other people using Google services.
                </p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <div>
              <!-- begin::name -->
              <div class="mb-4 position-relative d-flex align-items-center">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Your Name"
                  v-model="form.name"
                />

                <div class="invalid-feedback form-control" v-if="v$.name.$errors.length">
                  <span> {{ v$.name.$errors[0].$message }}</span>
                </div>
              </div>
              <!-- end::name -->

              <!-- begin::Birthdate -->
              <div class="mb-4">
                <BirthdateDropdown
                  placeholder="Enter Your Birthday (YY/MM/DD)"
                  :selected="date"
                  @change="changeDate"
                />
              </div>
              <!-- end::Birthdate -->

              <!-- begin::Gender -->
              <div>
                <div class="dropdown">
                  <button
                    class="btn bg-gray-100 dropdown-toggle w-100 justify-content-between border border-gray-200"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    data-bs-offset="0,0"
                  >
                    Dark mode
                  </button>
                  <ul class="dropdown-menu triangle w-100">
                    <li><a class="dropdown-item active">Dark mode</a></li>
                    <li><a class="dropdown-item">Light mode</a></li>
                  </ul>
                </div>
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
                class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base fw-normal"
              >
                Save
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
