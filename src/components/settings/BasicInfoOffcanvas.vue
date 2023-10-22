<script setup>
// Vue
import { ref } from 'vue'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'

// ----- START ----- //
const { showFeedBacks } = useForm()

const form = ref({
  phone: null,
  email: null
})

const rules = {
  phone: {
    required: helpers.withMessage('Phone No is required', required)
  },
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage("Email isn't valid", email)
  }
}

const v$ = useVuelidate(rules, form)

const updateBasicInfo = async () => {
  const result = await v$.value.$validate()
  if (result) {
    console.log('scas')
  } else {
    showFeedBacks()
  }
}
</script>

<template>
  <!-- <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button> -->
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="basicInfo_offcanvas"
    aria-labelledby="offcanvasBasicInfo"
  >
    <div class="offcanvas-body">
      <form @submit.prevent="updateBasicInfo">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4 min-h-354px">
          <div class="card-body">
            <!-- begin::Header -->
            <div class="d-flex gap-4">
              <div>
                <inline-svg src="media/icons/shapes/person.svg"></inline-svg>
              </div>

              <div class="mb-10">
                <h3 class="mb-0 text-gray-900">Basic info</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">
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

                <div class="invalid-feedback form-control" v-if="v$.phone.$errors.length">
                  <span> {{ v$.phone.$errors[0].$message }}</span>
                </div>

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/phone.svg"
                  class="position-absolute start-8px"
                ></inline-svg>
                <!-- end::Icon -->

                <!-- begin::Icon -->
                <button
                  type="button"
                  class="btn btn-primary btn-sm ls-sm h-24px position-absolute end-8px"
                >
                  Verify
                </button>
                <!-- end::Icon -->
              </div>
              <!-- end::Phone -->

              <!-- begin::Email -->
              <div class="mb-4 position-relative d-flex align-items-center">
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
                  class="position-absolute start-8px"
                ></inline-svg>
                <!-- end::Icon -->

                <!-- begin::Icon -->
                <div
                  class="w-33px h-24px rounded-3 border border-primary position-absolute end-8px d-flex align-items-center justify-content-center"
                >
                  <inline-svg
                    src="media/icons/icons/valid-form.svg"
                    height="18"
                    width="18"
                  ></inline-svg>
                </div>
                <!-- end::Icon -->
              </div>
              <!-- end::Email -->

              <div class="dropdown">
                <button
                  class="btn px-4 fs-7 bg-gray-100 ls-sm dropdown-toggle w-100 justify-content-between border border-gray-200"
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

              <button type="submit" class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base fw-normal">
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
