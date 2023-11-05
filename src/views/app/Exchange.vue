<script setup>
// Vue
import { computed, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Address Validator
import WAValidator from 'multicoin-address-validator/dist/wallet-address-validator.js'

// Component
import CoinDropdownVue from '../../components/globals/CoinDropdown.vue'

// ----- Start -----
const { showFeedBacks } = useForm()

const store = useAuthStore()

const tokens = computed(() => store.tokens)

const form = ref({
  sendAmount: null,
  sendTokenId: null,
  receiveAddress: null,
  receiveTokenId: null
})

const sendToken = ref({})
const toggleSendToken = (token) => {
  sendToken.value = token
  form.value.sendTokenId = token.id
}

const receiveToken = ref({})
const toggleReceiveToken = (token) => {
  receiveToken.value = token
  form.value.receiveTokenId = token.id
  validateAddress()
}

/**
 * Validation Rules
 */
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

/**
 * Validate Wallet Address
 */
const addressValidFlag = ref(false)
const validAddress = ref(false)
const validateAddress = async () => {
  addressValidFlag.value = true

  const valid = WAValidator.validate(
    `${form.value.receiveAddress}`,
    `${receiveToken.value.network.chain_type.toUpperCase()}`
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
 * Exchange Function
 */
const exchange = async () => {
  const result = await v$.value.$validate()
  const valid_address = validAddress.value

  if (result && valid_address) {
    console.log('scas')
  } else {
    showFeedBacks()
  }
}
</script>

<template>
  <!-- begin::Header -->
  <h2 class="text-primary fw-normal mb-12 neue-machina">Exchange</h2>
  <!-- end::Header -->

  <!-- begin::Content -->
  <div class="card border-cyan-500">
    <div class="card-body">
      <div class="row gy-5">
        <!-- begin::Form Box -->
        <div class="col-md-6 col-lg-12 col-xl-5">
          <!-- begin::Icon -->
          <inline-svg src="media/icons/shapes/exchange.svg"></inline-svg>
          <!-- end::Icon -->

          <!-- begin::Title -->
          <h4 class="mt-6 mb-2 fw-normal lh-1 text-gray-900">Instance Exchange</h4>
          <!-- end::Title -->

          <!-- begin::Subject -->
          <p class="mb-0">Some info may be visible to other people</p>
          <!-- end::Subject -->

          <!-- begin::Form -->
          <form @submit.prevent="exchange" class="mt-11">
            <!-- begin::Send -->
            <div
              class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center row-gap-2 column-gap-4 mb-8"
            >
              <!-- begin::Label -->
              <div>
                <label for="send" class="w-100 w-sm-104px text-gray-900"> You send </label>
              </div>
              <!-- end::Label -->

              <!-- begin::Input Box -->
              <div class="w-100 position-relative d-flex align-items-center">
                <input
                  id="send"
                  type="number"
                  class="form-control px-9"
                  placeholder="Amount"
                  v-model="form.sendAmount"
                />

                <div
                  class="invalid-feedback form-control"
                  v-if="v$.sendAmount.$errors.length || v$.sendTokenId.$errors.length"
                >
                  <span>
                    {{ sendTokenError }}
                  </span>
                </div>

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/arrow-forward.svg"
                  class="position-absolute start-8px"
                ></inline-svg>
                <!-- end::Icon -->

                <CoinDropdownVue
                  class="position-absolute end-8px"
                  showImage
                  check="id"
                  :items="tokens"
                  :selected="sendToken"
                  @toggleSelect="toggleSendToken"
                />
              </div>
              <!-- end::Input Box -->
            </div>
            <!-- end::Send -->

            <!-- begin::Receive -->
            <div
              class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center row-gap-2 column-gap-4 mb-8"
            >
              <!-- begin::Label -->
              <div>
                <label for="send" class="w-100 w-sm-104px text-gray-900"> You Recieve </label>
              </div>
              <!-- end::Label -->

              <!-- begin::Input Box -->
              <div class="w-100 position-relative d-flex align-items-center">
                <input
                  id="send"
                  type="number"
                  class="form-control px-9"
                  placeholder="Amount"
                  readonly
                />

                <div class="invalid-feedback form-control" v-if="v$.receiveTokenId.$errors.length">
                  <span> {{ v$.receiveTokenId.$errors[0].$message }}</span>
                </div>

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/arrow-backward.svg"
                  class="position-absolute start-8px"
                ></inline-svg>
                <!-- end::Icon -->

                <CoinDropdownVue
                  class="position-absolute end-8px"
                  showImage
                  check="id"
                  :items="tokens"
                  :selected="receiveToken"
                  @toggleSelect="toggleReceiveToken"
                />
              </div>
              <!-- end::Input Box -->
            </div>
            <!-- end::Receive -->

            <!-- begin::Receive Address -->
            <div class="w-100 position-relative d-flex align-items-center">
              <input
                id="send"
                type="text"
                class="form-control"
                placeholder="Recipient’s address"
                v-model="form.receiveAddress"
                @change="validateAddress"
              />

              <div
                class="invalid-feedback form-control"
                v-if="v$.receiveAddress.$errors.length || (addressValidFlag && !validAddress)"
              >
                <span> {{ receiveAddressError }}</span>
              </div>
            </div>
            <!-- end::Receive Address -->

            <!-- begin::Submit -->
            <button type="submit" class="btn btn-primary w-100 neue-machina fs-4 fw-normal mt-10">
              Submit
            </button>
            <!-- end::Submit -->
          </form>
          <!-- end::Form -->
        </div>
        <!-- end::Form Box -->

        <div class="col-md-6 col-lg-12 col-xl-7 min-h-300px">
          <div
            class="card-linear-background rounded h-100 p-6 d-flex flex-column align-item-start justify-content-end text-white fs-7 ls-base"
            style="--background: url(/media/images/banner/auth-bg.jpg)"
          >
            <p class="mb-0">You will send 1 of USDT in Tron network</p>
            <p class="mb-0">and will get 20 of ALN in Polygon network</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end::Content -->
</template>
