<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useForm from '@/hooks/useForm.js'
import useIconImage from '@/hooks/useIconImage'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Component
import SelectDropdown from '../../globals/SelectDropdown.vue'
import Dropzone from '../../globals/Dropzone.vue'

// Bootstrap
import { Offcanvas } from 'bootstrap'


// Props
const props = defineProps({
  selectedCoinInfo: {
    type: Object,
    required: true
  }
})

// Emit
const emit = defineEmits(['refresh', 'resetData'])

// ----- START ----- //

// Generals
const route = useRoute()
const store = useAppStore()
const { showFeedBacks } = useForm()
const { iconImage } = useIconImage()

// Refs
const step = ref(1)
const documents = ref([])
const network = ref({})
const loading = ref(false)
const contractInfo = ref({})

// Comouteds
const networks = computed(() => store.networks)
const appId = computed(() => route.params.id)

// Vuelidate
const form = ref({
  price: null,
  networkId: null,
  contractAddress: null
})

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

// Functions
const setFile = (files) => {
  documents.value = files
}

const removeFiles = (file) => {
  documents.value = documents.value.filter((item) => item !== file)
}

const toggleNetwork = (selected) => {
  console.log(selected)
  network.value = selected
  form.value.networkId = selected.id
}

const convertDecimal = (decimal) => {
  return '0.' + '0'.repeat(decimal)
}

/**
 * Show UplodedItem Preview
 * @param {file} file
 */
const showPreview = (file) => {
  return URL.createObjectURL(file)
}

/**
 * Reset Form
 */
const resetForm = () => {
  step.value = 1
  contractInfo.value = {}
  network.value = {}
  form.value = {
    price: null,
    networkId: null,
    contractAddress: null
  }
  v$.value.$reset()
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('addCustomToken_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Set Default Values
 */
const setDefaultValues = () => {
  if (props.selectedCoinInfo.id) {
    // Set Network
    for (let i = 0; i < networks.value.length; i++) {
      const element = networks.value[i]
      if (element.id == props.selectedCoinInfo.network.id) {
        network.value = element
        break
      }
    }
    // Set Form Data
    form.value = {
      price: props.selectedCoinInfo.price,
      networkId: network.value.id,
      contractAddress: props.selectedCoinInfo.address
    }
  }
}

/**
 * Get Contract Info
 */
const getContractInfo = async () => {
  const result = await v$.value.$validate()
  if (result) {
    // Start Loading
    loading.value = true

    // Set Variable
    const content = {
      network_id: form.value.networkId,
      contract_address: form.value.contractAddress
    }

    // Request
    await store.getContractInfo(content).then((res) => {
      if (res) {
        contractInfo.value = res
        step.value = 2

        if (res.exists) {
          appendAlert('Coin existed', 'danger')
        }
      }
    })

    // Stop Loading
    loading.value = false
  } else {
    showFeedBacks()
  }
}

/**
 * Add Custom Token
 */
const addCustomToken = async () => {
  // Start Loading
  loading.value = true

  let id = props.selectedCoinInfo.id
  const app_id = appId.value

  if (id) {
    // Set Variable
    let fd = new FormData()
    fd.append('_method', 'put')
    fd.append('appId', appId.value)
    fd.append('price', form.value.price)
    if (documents.value.length) {
      fd.append('logo', documents.value[0])
    }

    // Request
    await store.updateCustomToken({ app_id, id, fd }).then((res) => {
      if (res) {
        resetForm()
        closeOffcanvas()
        emit('resetData')
        emit('refresh')
      }
    })
  } else {
    // Set Variable
    let fd = new FormData()
    fd.append('price', form.value.price)
    fd.append('network_id', form.value.networkId)
    fd.append('contract_address', form.value.contractAddress)
    if (documents.value.length) {
      fd.append('logo', documents.value[0])
    }

    // Request
    await store.createCustomToken({app_id, fd}).then((res) => {
      if (res) {
        resetForm()
        closeOffcanvas()
        emit('resetData')
        emit('refresh')
      }
    })
  }

  // Stop Loading
  loading.value = false
}

onMounted(() => {
  const myOffcanvas = document.getElementById('addCustomToken_offcanvas')

  /**
   * Offcanvas Fire On Show
   */
  myOffcanvas.addEventListener('shown.bs.offcanvas', () => {
    setDefaultValues()
  })

  /**
   * Offcanvas Fire On Hide
   */
  myOffcanvas.addEventListener('hidden.bs.offcanvas', () => {
    resetForm()
    emit('resetData')
  })
})
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
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <!-- begin::Content Card -->
      <div class="card border-0 mb-4 min-h-354px">
        <div class="card-body pb-lg-22">
          <!-- begin::Header -->
          <div class="d-flex gap-4">
            <div>
              <div class="svg-holder">
                <inline-svg :src="`media/icons/shapes/${$filters.shapeStatus('custom-coin')}.svg`" width="26" height="39"></inline-svg>
              </div>
            </div>

            <div class="mb-10">
              <h3 class="mb-0 text-gray-900">
                {{
                  selectedCoinInfo.id ? `Edit ${selectedCoinInfo.symbol} Token` : 'Add New Token'
                }}
              </h3>

              <p class="fs-7 mb-0 text-gray-800 ls-base">
                Some info may be visible to other people using Google services.
              </p>
            </div>
          </div>
          <!-- end::Header -->

          <!-- begin::Content -->
          <div>
            <!-- begin::Step 1 - Get Token Info -->
            <form @submit.prevent="getContractInfo" v-if="step === 1">
              <button type="submit" class="d-none"></button>

              <!-- begin::Price -->
              <div class="w-100 position-relative d-flex align-items-center mb-4">
                <input
                  type="number"
                  step="0.000000000000000001"
                  min="0.000000000000000001"
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
              <div class="position-relative mb-4">
                <SelectDropdown
                  placeholder="Select Your Network"
                  show="name"
                  toggleClass="px-2"
                  showImage
                  svgIcon="media/icons/icons/wireless.svg"
                  :items="networks"
                  :selected="network"
                  @change="toggleNetwork"
                  :disabled="selectedCoinInfo.id"
                />

                <div class="invalid-feedback form-control" v-if="v$.networkId.$errors.length">
                  <span> {{ v$.networkId.$errors[0].$message }}</span>
                </div>
              </div>
              <!-- end::Select Network -->

              <!-- begin::Contract Address -->
              <div class="w-100 position-relative d-flex align-items-center mb-4">
                <input
                  type="text"
                  class="form-control ps-9 placeholder-gray-600"
                  placeholder="Contract Address"
                  v-model="form.contractAddress"
                  :readonly="selectedCoinInfo.id"
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
                :src="
                  documents.length ? showPreview(documents[0]) : iconImage(contractInfo.symbol, 128)
                "
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
                  {{ form.contractAddress }}
                </p>
              </div>
              <!-- end::Contract Address -->

              <!-- begin::Spacer -->
              <div class="border-bottom border-gray-400 w-100 my-4"></div>
              <!-- end::Spacer -->

              <!-- begin::Total Supply -->
              <div class="fs-7 ls-sm">
                <p class="text-gray-600 mb-2">Total Supply</p>
                <p class="text-gray-800 mb-0">{{ contractInfo.totalSupply }}</p>
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
                  <p class="value">{{ contractInfo.name }}</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Symbol</p>
                  <p class="value">{{ contractInfo.symbol }}</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Price</p>
                  <p class="value">{{ form.price }} USDT</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Network</p>
                  <p class="value">{{ network.name }}</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Decimal</p>
                  <p class="value">
                    {{ contractInfo.decimals }} - {{ convertDecimal(+contractInfo.decimals) }}
                  </p>
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
            class="w-56px h-56px d-flex align-items-center justify-content-center rounded-3 bg-white"
          >
            <inline-svg :src="`/media/icons/shapes/${$filters.shapeStatus('documentation')}.svg`"></inline-svg>
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
                  @click="getContractInfo"
                  :disabled="loading"
                  type="button"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base"
                >
                  {{ loading ? 'Loading...' : 'Next' }}
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
                  @click="addCustomToken"
                  type="button"
                  :disabled="loading"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base"
                >
                  {{ loading ? 'Loading...' : 'Save' }}
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
