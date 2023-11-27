<script setup>
// Vue
import { ref } from 'vue'

// Components
import VOtpInput from 'vue3-otp-input'

// ----- START ----- //
const step = ref(1)

const otpInputValue = ref('')

const getNewSecret = async () => {
  console.log('12')
}

const copyAndClose = () => {
  console.log('1232')
}
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
        class="d-block mx-auto mb-4 cursor-pointer"
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
              <div class="mt-8 pt-8 border-top border-gray-200" v-if="step === 1">
                <h4 class="mb-0 text-gray-900">Two factor code</h4>
                <p class="fs-7 mb-6 text-gray-800 ls-base">
                  Some info may be visible to other people using Google services.
                </p>
                <div class="otp-input">
                  <VOtpInput
                    ref="otpInput"
                    v-model:value="otpInputValue"
                    input-classes="form-control p-0 w-40px h-40px w-sm-48px h-sm-48px text-center fs-4"
                    separator=""
                    :num-inputs="6"
                    :should-auto-focus="true"
                    input-type="numeric"
                  />
                </div>
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
                        type="email"
                        class="form-control px-0 border-0 bg-transparent text-gray-700"
                        placeholder="Your Email"
                        value="9d8eb567-9e2d-4752-94d2-77b7708e0872"
                      />

                      <!-- begin::Icon -->
                      <inline-svg src="media/icons/icons/copy.svg" height="40"></inline-svg>
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
                  type="submit"
                  class="btn btn-sm btn-primary w-100 w-sm-initial h-24px ls-base fw-normal"
                >
                  Generate Revoke
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
