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
  email: null
})

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage("Email isn't valid", email)
  }
}

const v$ = useVuelidate(rules, form)

const editPartner = async () => {
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
    id="editPartner_offcanvas"
    aria-labelledby="offcanvasEditPartner"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="/media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <form @submit.prevent="editPartner">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4 min-h-354px">
          <div class="card-body">
            <!-- begin::Header -->
            <div class="d-flex gap-3">
              <div>
                <div class="w-48px h-48px">
                  <img
                    src="/media/images/banner/theme.png"
                    alt="partner"
                    class="w-100 h-100 object-cover rounded-circle"
                  />
                </div>
              </div>

              <div class="mb-12">
                <h3 class="mb-0 text-primary">Golshifte Farahani</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">
                  Some info may be visible to other people using Google services.
                </p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <!-- begin::Info -->
            <div class="border-bottom border-gray-200 pb-8 mb-8">
              <p class="mb-6 ls-base">
                By signing up, you confirm that you’ve readand accepted our User Notice and Privacy
                Policy.
              </p>
              <div class="row gy-4">
                <!-- begin::Email -->
                <div class="col-sm-6">
                  <input
                    type="email"
                    class="form-control"
                    placeholder="Your Email"
                    value="Golshifte@Gmail.com"
                  />
                </div>
                <!-- end::Email -->

                <div class="col-sm-6">
                  <div class="dropdown">
                    <button
                      class="btn fs-7 bg-gray-100 ls-sm dropdown-toggle w-100 justify-content-between border border-gray-200"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Choose Position
                    </button>
                    <ul class="dropdown-menu w-100">
                      <li><a class="dropdown-item">English</a></li>
                      <li><a class="dropdown-item">English 2</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!-- end::Info -->

            <!-- begin::Features -->
            <div class="d-flex flex-column gap-4">
              <!-- begin::Item -->
              <div
                class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-start gap-3 form-check form-switch p-0"
              >
                <label class="form-check-label text-gray-800" for="partner-feature-1">
                  Has your Person Ability to Add People
                </label>
                <input
                  class="form-check-input m-0"
                  type="checkbox"
                  role="switch"
                  id="partner-feature-1"
                />
              </div>
              <!-- begin::Item -->

              <!-- begin::Item -->
              <div
                class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-start gap-3 form-check form-switch p-0"
              >
                <label class="form-check-label text-gray-800" for="partner-feature-2">
                  Has your Person Ability to see Other Partner's Team
                </label>
                <input
                  class="form-check-input m-0"
                  type="checkbox"
                  role="switch"
                  id="partner-feature-2"
                />
              </div>
              <!-- begin::Item -->

              <!-- begin::Item -->
              <div
                class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-start gap-3 form-check form-switch p-0"
              >
                <label class="form-check-label text-gray-800" for="partner-feature-3">
                  Access to Change Getway Theme
                </label>
                <input
                  class="form-check-input m-0"
                  type="checkbox"
                  role="switch"
                  id="partner-feature-3"
                />
              </div>
              <!-- begin::Item -->
            </div>
            <!-- end::Features -->
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
              <inline-svg src="/media/icons/shapes/bookmark.svg"></inline-svg>
            </div>
          </div>

          <div class="card border-0 mb-6 w-100">
            <div
              class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
            >
              <p class="fs-7 mb-0 ls-base text-gray-800 lh-32px">Golshifte Farahani as Reporter</p>

              <!-- begin::Actions -->
              <div class="d-flex gap-4 w-100 w-sm-initial">
                <button
                  type="button"
                  class="btn btn-sm bg-light text-primary w-100 w-sm-initial h-24px ls-base"
                >
                  Remove Person
                </button>

                <button
                  type="submit"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base"
                >
                  Add
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
