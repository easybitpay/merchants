<script setup>
// Vue
import { computed, ref } from 'vue'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Component
import SelectDropdown from '../../globals/SelectDropdown.vue'
import Dropzone from '../../globals/Dropzone.vue'

// ----- START ----- //
import { useAppStore } from '@/stores/app'

const store = useAppStore()

const networks = computed(() => store.networks)

const { showFeedBacks } = useForm()

const step = ref(1)

const documents = ref([])

const setFile = (files) => {
  documents.value = files
}

const removeFiles = (file) => {
  documents.value = documents.value.filter((item) => item !== file)
}

const form = ref({
  price: null,
  networkId: null,
  contractAddress: null
})

const network = ref({})
const toggleNetwork = (selected) => {
  network.value = selected
  form.value.networkId = selected.id
}

const rules = {
  price: {
    required: helpers.withMessage('Price is required', required)
  },
  networkId: {
    required: helpers.withMessage('Network is required', required)
  },
  contractAddress: {
    required: helpers.withMessage('Contract address is required', required)
  }
}

const v$ = useVuelidate(rules, form)

const addNewToken = async () => {
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
    id="addCustomToken_offcanvas"
    aria-labelledby="offcanvasAddCustomToken"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer"
      ></inline-svg>

      <!-- begin::Content Card -->
      <div class="card border-0 mb-4 min-h-354px">
        <div class="card-body pb-lg-22">
          <!-- begin::Header -->
          <div class="d-flex gap-4">
            <div>
              <inline-svg src="media/icons/shapes/custom-coin.svg"></inline-svg>
            </div>

            <div class="mb-10">
              <h3 class="mb-0 text-gray-900">Add New Token</h3>

              <p class="fs-7 mb-0 text-gray-800 ls-base">
                Some info may be visible to other people using Google services.
              </p>
            </div>
          </div>
          <!-- end::Header -->

          <!-- begin::Content -->
          <div>
            <!-- begin::Step 1 - Get Token Info -->
            <form @submit.prevent="addNewToken" v-if="step === 1">
              <button type="submit" class="d-none"></button>

              <!-- begin::Price -->
              <div class="w-100 position-relative d-flex align-items-center mb-4">
                <input
                  type="number"
                  class="form-control ps-9 placeholder-gray-600"
                  placeholder="Input Your Coin Price"
                  v-model="form.price"
                />

                <div class="invalid-feedback form-control" v-if="v$.price.$errors.length">
                  <span> {{ v$.price.$errors[0].$message }}</span>
                </div>

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/mail.svg"
                  class="position-absolute start-8px svg-icon-gray-500"
                ></inline-svg>
                <!-- end::Icon -->
              </div>
              <!-- end::Price -->

              <!-- begin::Select Network -->
              <SelectDropdown
                class="mb-4"
                placeholder="Select Your Network"
                show="name"
                toggleClass="px-2"
                showImage
                svgIcon="media/icons/icons/wireless.svg"
                :items="networks"
                :selected="network"
                @change="toggleNetwork"
              />
              <!-- end::Select Network -->

              <!-- begin::Contract Address -->
              <div class="w-100 position-relative d-flex align-items-center mb-4">
                <input
                  type="text"
                  class="form-control ps-9 placeholder-gray-600"
                  placeholder="Contract Address"
                  v-model="form.contractAddress"
                />

                <div class="invalid-feedback form-control" v-if="v$.contractAddress.$errors.length">
                  <span> {{ v$.contractAddress.$errors[0].$message }}</span>
                </div>

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/compass.svg"
                  class="position-absolute start-8px svg-icon-gray-500"
                ></inline-svg>
                <!-- end::Icon -->
              </div>
              <!-- end::Contract Address -->

              <!-- begin::Dropzone -->
              <div>
                <Dropzone :files="documents" @set-files="setFile" />

                <div class="mt-4" v-if="documents.length">
                  <div
                    v-for="(file, index) in documents"
                    :key="index"
                    :style="`--background: url(${file.preview})`"
                    class="gradient-image-box hover-shadow h-40px border border-gray-300 rounded ps-4 pe-2 d-flex align-items-center justify-content-between text-gray-800 text-hover-primary hover-show-parent"
                  >
                    <p class="mb-0 ellipsis" style="--ellipsis-width: 50%">{{ file.name }}</p>

                    <inline-svg
                      @click="removeFiles(file)"
                      src="media/icons/icons/trash.svg"
                      height="24"
                      class="svg-icon-danger hover-show-target bg-white"
                      style="border-radius: 3px"
                    ></inline-svg>
                  </div>
                </div>
              </div>
              <!-- end::Dropzone -->
            </form>
            <!-- end::Step 1 - Get Token Info -->

            <!-- begin::Step 2 - Show Token Info -->
            <div v-else>
              <!-- begin::Token Image -->
              <img
                src="/media/images/banner/auth-bg.jpg"
                alt="image"
                height="48"
                class="d-block m-auto"
              />
              <!-- end::Token Image -->

              <!-- begin::Spacer -->
              <div class="border-bottom border-gray-400 w-100 my-4"></div>
              <!-- end::Spacer -->

              <!-- begin::Contract Address -->
              <div class="fs-7 ls-sm">
                <p class="text-gray-600 mb-2">Contract Address</p>
                <p class="text-gray-800 mb-0">
                  TFGH12F41NHCVBCFG4RTUYFV616DGF71X312XCX3C1VXV1X3SEF
                </p>
              </div>
              <!-- end::Contract Address -->

              <!-- begin::Spacer -->
              <div class="border-bottom border-gray-400 w-100 my-4"></div>
              <!-- end::Spacer -->

              <!-- begin::Total Supply -->
              <div class="fs-7 ls-sm">
                <p class="text-gray-600 mb-2">Total Supply</p>
                <p class="text-gray-800 mb-0">2.000.000.0000</p>
              </div>
              <!-- end::Total Supply -->

              <!-- begin::Spacer -->
              <div class="border-bottom border-gray-400 w-100 my-4"></div>
              <!-- end::Spacer -->

              <!-- begin::Info -->
              <div class="auto-infos">
                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Name</p>
                  <p class="value">ECS Gold</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Symbol</p>
                  <p class="value">ECG</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Price</p>
                  <p class="value">1 USDT</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Network</p>
                  <p class="value">Tron</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Decimal</p>
                  <p class="value">6 - 0.000000</p>
                </div>
                <!-- end::Item -->
              </div>
              <!-- end::Info -->
            </div>
            <!-- end::Step 2 - Show Token Info -->
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
              <template v-if="step === 1">
                <button
                  type="button"
                  class="btn btn-sm bg-gray-500 text-white w-100 w-sm-104px h-24px ls-base fw-normal"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  Cancel
                </button>

                <button
                  @click="step = 2"
                  type="button"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base"
                >
                  Next
                </button>
              </template>

              <template v-else>
                <button
                  @click="step = 1"
                  type="button"
                  class="btn btn-sm bg-gray-500 text-white w-100 w-sm-104px h-24px ls-base fw-normal"
                >
                  Back
                </button>

                <button
                  type="button"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base"
                >
                  Save
                </button>
              </template>
            </div>
            <!-- end::Actions -->
          </div>
        </div>
      </div>
      <!-- end::Action Card -->
    </div>
  </div>
</template>
