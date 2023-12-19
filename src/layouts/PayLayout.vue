<script setup>
// Vue
import { ref } from 'vue'

// ----- START ----- //
const errorStatus = ref(false)
const timeout = ref(null)

const changeBG = () => {
  clearTimeout(timeout)

  errorStatus.value = true

  timeout.value = setTimeout(() => {
    errorStatus.value = false
  }, 5000)
}
</script>

<template>
  <div class="pay-layout type-1">
    <!-- begin::Main Box -->
    <div class="d-flex flex-column flex-root z-2">
      <div class="d-flex flex-column flex-root justify-content-center">
        <!-- begin::Container -->
        <div class="container d-flex flex-column align-items-center pb-8 pt-8">
          <!-- begin::Card -->
          <div class="card mw-624px w-100">
            <div class="card-body">
              <!-- begin::Gateway Info -->
              <div
                class="card gradient-image-box border-gray-200 h-156px rounded mb-11"
                style="--background: url('/media/images/banner/auth-bg.jpg')"
              >
                <div class="card-body d-flex flex-column justify-content-between p-4 h-100">
                  <!-- begin::Gateway Logo -->
                  <inline-svg
                    src="/media/images/logo/Logo.svg"
                    height="27"
                    width="137"
                  ></inline-svg>
                  <!-- end::Gateway Logo -->

                  <!-- begin::Bottom Box -->
                  <div class="d-flex align-items-end justify-content-between gap-4 flex-wrap">
                    <!-- begin::Left Side -->
                    <div class="d-flex align-items-end gap-4">
                      <!-- begin::Logo -->
                      <div>
                        <img
                          src="/media/images/banner/default-app.png"
                          class="img-fluid"
                          width="40"
                        />
                      </div>
                      <!-- end::Logo -->

                      <div>
                        <p class="fs-7 mb-2 text-gray-600 ls-base lh-1">Plusstudio</p>

                        <h2 class="mb-0 text-gray-800 neue-machina lh-1 fw-medium">120 USD</h2>
                      </div>
                    </div>
                    <!-- end::Left Side -->

                    <!-- begin::Invoice ID -->
                    <p class="invoice-code">#z65fdsfgr26tyh45j</p>
                    <!-- end::Invoice ID -->
                  </div>
                  <!-- end::Bottom Box -->
                </div>
              </div>
              <!-- end::Gateway Info -->

              <RouterView @changeBG="changeBG" />
            </div>
          </div>
          <!-- end::Card -->
        </div>
        <!-- end::Container -->
      </div>

      <!-- begin::Copyright -->
      <div class="container d-flex justify-content-center">
        <div class="mw-624px w-100">
          <small class="text-white neue-machina fw-light d-block mb-4">
            Do not withdraw directty to a crowdfund od ICO address, os your account will niot be
            credited with tokens from such sales.
          </small>
        </div>
      </div>
      <!-- end::Copyright -->
    </div>
    <!-- end::Main Box -->

    <!-- begin::Backgroun Image -->
    <div
      :class="[{ 'auth-bg': true }, { error: errorStatus }]"
      style="background-image: url('media/images/banner/auth-bg.jpg')"
    ></div>
    <!-- end::Backgroun Image -->
  </div>
</template>
