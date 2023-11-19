<script setup>
// Vue
import { computed, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Address Validator
import WAValidator from 'multicoin-address-validator/dist/wallet-address-validator.js'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// Component
import CoinDropdown from '../../../components/globals/CoinDropdown.vue'

// ----- Start -----
const { showFeedBacks } = useForm()

const store = useAppStore()

const tokens = computed(() => store.tokens)

const form = ref({
  amount: '10',
  withdrawTokenId: null,
  receiveAddress: 'TKNieFAvov3wCg8YGtyGrbhkzG6vmfGmca'
})

const withdrawToken = ref({})
const toggleWithdrawToken = (token) => {
  withdrawToken.value = token
  form.value.withdrawTokenId = token.id
  validateAddress()
}

/**
 * Validation Rules
 */
const rules = {
  amount: {
    required: helpers.withMessage('Amount is required', required)
  },
  withdrawTokenId: {
    required: helpers.withMessage('Token is required', required)
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
    `${withdrawToken.value.network.chain_type.toUpperCase()}`
  )

  if (valid) validAddress.value = true
  else validAddress.value = false
}

/**
 * Send Token Error Message
 */
const withdrawTokenError = computed(() => {
  if (v$.value.amount.$errors.length && v$.value.withdrawTokenId.$errors.length) {
    return 'Amount & token are required'
  } else if (v$.value.amount.$errors.length) {
    return v$.value.amount.$errors[0].$message
  } else if (v$.value.withdrawTokenId.$errors.length) {
    return v$.value.withdrawTokenId.$errors[0].$message
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
    const bsOffcanvas = new Offcanvas('#withdrawDetail_offcanvas')
    bsOffcanvas.show()
  } else {
    showFeedBacks()
  }
}
</script>

<template>
  <div class="card border-cyan-500 mb-6">
    <div class="card-body">
      <div class="row gy-5">
        <!-- begin::Form Box -->
        <div class="col-xl-5 d-flex flex-column">
          <!-- begin::Header -->
          <div class="d-flex gap-2">
            <div>
              <inline-svg src="media/icons/shapes/invoice.svg"></inline-svg>
            </div>

            <div class="mb-6">
              <h3 class="mb-0 text-gray-900">Withdraw Wallet</h3>

              <p class="fs-7 mb-0 text-gray-800 ls-base">
                Some info may be visible to other people
              </p>
            </div>
          </div>
          <!-- end::Header -->

          <!-- begin::Form -->
          <form
            @submit.prevent="exchange"
            class="d-flex flex-column justify-content-between flex-root"
          >
            <div>
              <!-- begin::Send -->
              <div
                class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center row-gap-2 column-gap-4 mb-8"
              >
                <!-- begin::Label -->
                <div>
                  <label for="amount" class="w-100 w-sm-104px text-gray-900"> Amount </label>
                </div>
                <!-- end::Label -->

                <!-- begin::Input Box -->
                <div class="w-100 position-relative d-flex align-items-center">
                  <input
                    id="amount"
                    type="number"
                    class="form-control px-9"
                    placeholder="Amount"
                    v-model="form.amount"
                  />

                  <div
                    class="invalid-feedback form-control"
                    v-if="v$.amount.$errors.length || v$.withdrawTokenId.$errors.length"
                  >
                    <span>
                      {{ withdrawTokenError }}
                    </span>
                  </div>

                  <!-- begin::Icon -->
                  <inline-svg
                    src="media/icons/icons/wireless.svg"
                    class="position-absolute start-8px"
                  ></inline-svg>
                  <!-- end::Icon -->

                  <CoinDropdown
                    class="position-absolute end-8px"
                    showImage
                    showCoinNetwork
                    check="id"
                    :items="tokens"
                    :selected="withdrawToken"
                    @change="toggleWithdrawToken"
                  />
                </div>
                <!-- end::Input Box -->
              </div>
              <!-- end::Send -->

              <!-- begin::Receive Address -->
              <div
                class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center row-gap-2 column-gap-4 mb-8"
              >
                <!-- begin::Label -->
                <div>
                  <label for="address" class="w-100 w-sm-104px text-gray-900"> Address </label>
                </div>
                <!-- end::Label -->

                <!-- begin::Input Box -->
                <div class="w-100 position-relative d-flex align-items-center">
                  <input
                    id="address"
                    type="text"
                    class="form-control ps-9"
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

                  <!-- begin::Icon -->
                  <inline-svg
                    src="media/icons/icons/splite.svg"
                    class="position-absolute start-8px"
                  ></inline-svg>
                  <!-- end::Icon -->
                </div>
                <!-- end::Input Box -->
              </div>
              <!-- end::Receive Address -->
            </div>

            <!-- begin::Submit -->
            <button type="submit" class="btn btn-primary w-100">Transfer</button>
            <!-- end::Submit -->
          </form>
          <!-- end::Form -->
        </div>
        <!-- end::Form Box -->

        <div class="col-xl-7 min-h-300px min-h-lg-432px">
          <div
            class="card-linear-background rounded h-100 p-4 d-flex flex-column align-item-start justify-content-end text-white fs-7 lh-24px ls-base"
            style="--background: url(/media/images/banner/auth-bg.jpg)"
          >
            <p class="mb-0">
              1, Do not withdraw directty to a crowdfund od ICO address, os your account will niot
              be credited with tokens from such sales.
            </p>
            <p class="mb-0">
              2, when withdrawing to the éinance user's address. the handling fee will be returned
              to the Current Account by default,
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
