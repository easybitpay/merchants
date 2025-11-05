<script setup>
// Vue
import { computed, ref, onMounted } from 'vue'

// Store
import { useExchangeStore } from '@/stores/exchange'

// Hooks
import useForm from '@/composables/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Address Validator
import WAValidator from 'multicoin-address-validator/dist/wallet-address-validator.js'

// Component
import CoinDropdown from '../../components/globals/CoinDropdown.vue'

// Constants
const features = [
  'Real-time exchange rates',
  'Secure blockchain transactions',
  'Low network fees',
  'No hidden charges'
]

// ----- START ----- //

// Generals
const store = useExchangeStore()
const { showFeedBacks } = useForm()

// Refs
const sendTokens = ref([])
const receiveTokens = ref([])
const exchangeRate = ref(0)

const selectedSendToken = ref({})
const selectedReceiveToken = ref({})

const loadings = ref({
  box: false,
  submit: false
})

// Computeds
const receiveAmount = computed(() => {
  const amount = +form.value.sendAmount
  const rate = +exchangeRate.value

  return amount * rate
})

// Vuelidate
const form = ref({
  sendAmount: null,
  sendTokenId: null,
  receiveAddress: null,
  receiveTokenId: null
})

const rules = {
  sendAmount: {
    required: helpers.withMessage('Send amount is required', required)
  },
  sendTokenId: {
    required: helpers.withMessage('Send token is required', required)
  },
  receiveTokenId: {
    required: helpers.withMessage('Receive token is required', required)
  },
  receiveAddress: {
    required: helpers.withMessage('Receive address is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Toggle Send Token
 * @param {token} token
 */
const toggleSendToken = (token) => {
  selectedSendToken.value = token
  form.value.sendTokenId = token.id
  getExchangeRate()
}

/**
 * Toggle Receive Token
 * @param {token} token
 */
const toggleReceiveToken = (token) => {
  selectedReceiveToken.value = token
  form.value.receiveTokenId = token.id
  validateAddress()
  getExchangeRate()
}

/**
 * Validate Wallet Address
 */
const addressValidFlag = ref(false)
const validAddress = ref(false)
const validateAddress = async () => {
  addressValidFlag.value = true

  const valid = WAValidator.validate(
    `${form.value.receiveAddress}`,
    `${selectedReceiveToken.value.network.chain_type.toUpperCase()}`
  )

  if (valid) validAddress.value = true
  else validAddress.value = false
}

/**
 * Send Token Error Message
 */
const sendTokenError = computed(() => {
  if (v$.value.sendAmount.$errors.length && v$.value.sendTokenId.$errors.length) {
    return 'Send amount & token are required'
  } else if (v$.value.sendAmount.$errors.length) {
    return v$.value.sendAmount.$errors[0].$message
  } else if (v$.value.sendTokenId.$errors.length) {
    return v$.value.sendTokenId.$errors[0].$message
  } else {
    return ''
  }
})

/**
 * Receive Address Error Message
 */
const receiveAddressError = computed(() => {
  if (v$.value.receiveAddress.$errors.length) {
    return v$.value.receiveAddress.$errors[0].$message
  } else if (addressValidFlag.value && !validAddress.value) {
    return 'Receive address is not valid'
  } else {
    return ''
  }
})

/**
 * Get Send And Receive Tokens
 */
const getTokens = async () => {
  // Start Loading
  loadings.value.box = true

  // Request
  await store.getExchangeTokens().then((res) => {
    if (res) {
      sendTokens.value = res.sendTokens
      receiveTokens.value = res.receiveTokens

      toggleSendToken(res.sendTokens[0])
      toggleReceiveToken(res.receiveTokens[0])
    }
  })

  // Stop Loading
  loadings.value.box = false
}

/**
 * Get Exchange Rate
 */
const getExchangeRate = async () => {
  if (form.value.sendTokenId && form.value.receiveTokenId) {
    // start loading
    loadings.value.box = true

    // set variable
    let params = new URLSearchParams()
    params.set('sendTokenId', form.value.sendTokenId)
    params.set('receiveTokenId', form.value.receiveTokenId)

    // request
    await store.getExchangeRate(params).then((res) => {
      if (res) {
        exchangeRate.value = res
      }
    })

    // stop loading
    loadings.value.box = false
  }
}

/**
 * Exchange Function
 */
const exchange = async () => {
  // Validate Form
  const result = await v$.value.$validate()
  const valid_address = validAddress.value

  if (result && valid_address) {
    // Start loading
    loadings.value.submit = true

    // Request
    await store.getExchangeLink(form.value).then((res) => {
      if (res) {
        window.location = res
      }
    })

    // Stop loading
    loadings.value.submit = false
  } else {
    showFeedBacks()
  }
}

onMounted(() => {
  getTokens()
})
</script>
<template>
  <!-- begin::Content -->
  <div class="card">
    <div class="card-body p-0">
      <div class="row gy-5">
        <!-- begin::Form Box -->
        <div class="col-lg-5 order-1 order-xl-0">
          <div class="p-6 pe-lg-0">
            <!-- begin::Form -->
            <form @submit.prevent="exchange">
              <!-- begin::Send -->
              <div class="d-flex flex-column align-items-start gap-2">
                <!-- begin::Label -->
                <label for="send" class="fs-7 fw-medium label">You send</label>
                <!-- end::Label -->

                <!-- begin::Input Box -->
                <div class="w-100 position-relative d-flex align-items-center">
                  <input
                    id="send"
                    type="number"
                    class="form-control form-control-lg fs-1 fw-medium"
                    placeholder="0.00"
                    v-model="form.sendAmount"
                  />

                  <div
                    class="invalid-feedback form-control form-control-lg"
                    v-if="v$.sendAmount.$errors.length || v$.sendTokenId.$errors.length"
                  >
                    <span>
                      {{ sendTokenError }}
                    </span>
                  </div>

                  <div class="position-absolute end-18px d-flex align-items-center gap-3">
                    <h5 class="m-0 pb-1">
                      {{ selectedSendToken.symbol }}
                    </h5>

                    <CoinDropdown
                      showImage
                      showCoinNetwork
                      check="id"
                      :items="sendTokens"
                      :selected="selectedSendToken"
                      @change="toggleSendToken"
                    />
                  </div>
                </div>
                <!-- end::Input Box -->

                <!-- begin::Badge -->
                <span class="badge badge-primary">
                  Network: {{ selectedSendToken?.network?.name }}
                </span>
                <!-- end::Badge -->
              </div>
              <!-- end::Send -->

              <div
                class="divider d-flex align-items-center justify-content-center position-relative my-10"
              >
                <div
                  class="min-w-48px w-48px h-48px bg-primary shadow rounded-1 text-white d-flex align-items-center justify-content-center"
                >
                  <inline-svg
                    src="/public/media/icons/icons/arrow-down.svg"
                    class="svg-icon-white"
                  ></inline-svg>
                </div>
              </div>

              <!-- begin::Receive -->
              <div class="d-flex flex-column align-items-start gap-2">
                <!-- begin::Label -->
                <label for="receive" class="fs-7 fw-medium label"> You Recieve </label>
                <!-- end::Label -->

                <!-- begin::Input Box -->
                <div class="w-100 position-relative d-flex align-items-center">
                  <input
                    id="receive"
                    type="number"
                    class="form-control form-control-lg fs-1 fw-medium"
                    placeholder="0.00"
                    :value="receiveAmount"
                    readonly
                  />

                  <div
                    class="invalid-feedback form-control form-control-lg fs-1 fw-medium"
                    v-if="v$.receiveTokenId.$errors.length"
                  >
                    <span> {{ v$.receiveTokenId.$errors[0].$message }}</span>
                  </div>

                  <div class="position-absolute end-18px d-flex align-items-center gap-3">
                    <h5 class="m-0 pb-1">
                      {{ selectedReceiveToken.symbol }}
                    </h5>

                    <CoinDropdown
                      showImage
                      showCoinNetwork
                      check="id"
                      :items="receiveTokens"
                      :selected="selectedReceiveToken"
                      @change="toggleReceiveToken"
                    />
                  </div>
                </div>
                <!-- end::Input Box -->

                <!-- begin::Badge -->
                <span class="badge badge-primary">
                  Network: {{ selectedReceiveToken?.network?.name }}
                </span>
                <!-- end::Badge -->
              </div>
              <!-- end::Receive -->

              <!-- begin::Receive Address -->
              <div class="d-flex flex-column align-items-start gap-2 mt-6">
                <!-- begin::Label -->
                <label for="address" class="fs-7 fw-medium label"> Recipient Address </label>
                <!-- end::Label -->

                <!-- begin::Input Box -->
                <div class="w-100 position-relative d-flex align-items-center">
                  <input
                    id="address"
                    type="text"
                    class="form-control roboto-mono"
                    placeholder="Enter recipient's wallet address"
                    v-model="form.receiveAddress"
                    @change="validateAddress"
                  />

                  <div
                    class="invalid-feedback form-control"
                    v-if="v$.receiveAddress.$errors.length || (addressValidFlag && !validAddress)"
                  >
                    <span class="roboto-mono"> {{ receiveAddressError }}</span>
                  </div>
                </div>
                <!-- end::Input Box -->
              </div>
              <!-- end::Receive Address -->

              <!-- begin::Submit -->
              <button
                type="submit"
                :disabled="loadings.submit"
                class="btn btn-primary w-100 animation h-45px mt-10"
              >
                {{ loadings.submit ? 'Loading...' : 'Submit' }}
              </button>
              <!-- end::Submit -->
            </form>
            <!-- end::Form -->
          </div>
        </div>
        <!-- end::Form Box -->

        <div class="col-lg-7 min-h-500px">
          <div
            class="card-linear-background rounded-1 h-100 p-6 d-flex flex-column align-item-start text-white"
            style="--background: url(/media/images/banner/auth-bg.jpg)"
          >
            <div
              class="w-65px h-65px bg-white rounded-1 shadow d-flex align-items-center justify-content-center mb-6"
            >
              <inline-svg
                :src="`/media/icons/shapes/${$filters.shapeStatus('cards')}.svg`"
                height="40"
              ></inline-svg>
            </div>

            <h3 class="mb-1">Instant Crypto Swaps</h3>

            <p class="mb-10 fs-7">
              Exchange digital assets in seconds with competitive rates and low fees. Your swap is
              processed instantly on the blockchain.
            </p>

            <div class="d-flex flex-column gap-3">
              <p
                v-for="(item, index) in features"
                :key="index"
                class="fs-7 mb-0 d-flex align-items-center gap-4"
              >
                <inline-svg src="media/icons/icons/ok.svg"></inline-svg>
                {{ item }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BoxLoading v-if="loadings.box" />
  </div>
  <!-- end::Content -->
</template>
