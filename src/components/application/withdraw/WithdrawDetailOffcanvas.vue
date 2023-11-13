<script setup>
// Vue
import { ref } from 'vue'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// ----- START ----- //
const { showFeedBacks } = useForm()

const form = ref({
  emailCode: null
})

const rules = {
  emailCode: {
    required: helpers.withMessage('Email code is required', required)
  }
}

const v$ = useVuelidate(rules, form)

const confirmWithdraw = async () => {
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
    id="withdrawDetail_offcanvas"
    aria-labelledby="offcanvasWithdarwDetail"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer"
      ></inline-svg>
      
      <form @submit.prevent="confirmWithdraw">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4">
          <div class="card-body pb-lg-22">
            <!-- begin::Header -->
            <div class="d-flex gap-4">
              <div>
                <inline-svg src="media/icons/shapes/invoice.svg"></inline-svg>
              </div>

              <div class="mb-10">
                <h3 class="mb-0 text-gray-900">Withdraw Wallet</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">Invoice Preview</p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <div>
              <!-- begin::Wallet -->
              <p class="text-gray-800 ls-base mb-0">Wallet: TKNieFAvov3wCg8YGtyGrbhkzG6vmfGmca</p>
              <!-- end::Wallet -->

              <!-- begin::Spacer -->
              <div class="border-bottom border-gray-400 w-100 my-4"></div>
              <!-- end::Spacer -->

              <!-- begin::Info -->
              <div class="auto-infos">
                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Amount</p>
                  <p class="value">0.000145 BTC</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Network</p>
                  <p class="value">Troooon</p>
                </div>
                <!-- end::Item -->
              </div>
              <!-- end::Info -->

              <!-- begin::Spacer -->
              <div class="border-bottom border-gray-400 w-100 my-4"></div>
              <!-- end::Spacer -->

              <!-- begin::Info -->
              <div class="auto-infos">
                <!-- begin::Item -->
                <div class="item">
                  <p class="title">ID</p>
                  <p class="value">0019</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Date</p>
                  <p class="value">20.10.2024</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Time</p>
                  <p class="value">07:28:30</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Status</p>
                  <p class="value text-cyan-500">Pending 00:57</p>
                </div>
                <!-- end::Item -->
              </div>
              <!-- end::Info -->

              <!-- begin::Spacer -->
              <div class="border-bottom border-gray-400 w-100 my-4"></div>
              <!-- end::Spacer -->

              <!-- begin::Email Code -->
              <div class="w-100 position-relative d-flex align-items-center">
                <input
                  type="text"
                  class="form-control ps-9 placeholder-gray-500"
                  placeholder="Inter confirmation code From Your Email"
                  v-model="form.emailCode"
                />

                <div class="invalid-feedback form-control" v-if="v$.emailCode.$errors.length">
                  <span> {{ v$.emailCode.$errors[0].$message }}</span>
                </div>

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/lock.svg"
                  class="position-absolute start-8px svg-icon-primary"
                ></inline-svg>
                <!-- end::Icon -->

                <!-- begin::Send Again -->
                <button
                  type="button"
                  class="btn btn-sm btn-primary h-24px ls-base position-absolute end-8px"
                >
                  Send Again
                </button>
                <!-- end::Send Again -->
              </div>
              <!-- end::Email Code -->
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
                  Transfer
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
