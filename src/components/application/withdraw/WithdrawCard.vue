<script setup>
// Vue
import { computed, ref, watch } from 'vue'

// Store
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

// Router
import { useRouter } from 'vue-router'

// Hooks
import useForm from '@/composables/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Address Validator
import WAValidator from 'multicoin-address-validator/dist/wallet-address-validator.js'

// Bootstrap
import { Offcanvas, Dropdown } from 'bootstrap'

// Component
import CoinDropdown from '../../../components/globals/CoinDropdown.vue'

// Props
const props = defineProps({
  balances: {
    type: Array,
    required: true
  },
  mainLoading: {
    type: Boolean,
    required: true
  },
  selectedBalance: {
    type: Object,
    required: true
  }
})

// ----- START ----- //

// Generals
const { showFeedBacks } = useForm()
const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

// Refs
const withdrawToken = ref({})
const minimumWithdrawAmount = ref(0)
const addressValidFlag = ref(false)
const validAddress = ref(false)
const loading = ref(false)

// Computeds
const currentUser = computed(() => authStore.currentUser)
const selectedApp = computed(() => appStore.selectedApp)

const btnText = computed(() => {
  if (!currentUser.value.merchant.two_factor_enabled) return 'Enable 2FA'
  if (+form.value.amount < +minimumWithdrawAmount.value)
    return `Balance is less than minimum (${minimumWithdrawAmount.value})`

  return 'Transfer'
})

const disableConfirm = computed(() => {
  if (!currentUser.value.merchant.two_factor_enabled) return false
  if (loading.value || +form.value.amount < +minimumWithdrawAmount.value) return true
  return false
})

// Vuelidate
const form = ref({
  amount: null,
  withdrawTokenId: null,
  receiveAddress: null
})

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

// Functions

/**
 * Open Coin Dropdown
 */
const openDropdown = () => {
  setTimeout(() => {
    const dropdownToggle = document.querySelector('.select-coin-dropdown .dropdown-toggle')

    if (!dropdownToggle) {
      console.warn('Dropdown not found')
      return
    }

    const bsDropdown = Dropdown.getOrCreateInstance(dropdownToggle)
    bsDropdown.toggle()
  }, 50) 
}

/**
 * Toggle Withdraw Token
 * @param {token} token
 */
const toggleWithdrawToken = (token) => {
  withdrawToken.value = token

  form.value.withdrawTokenId = token.id
  form.value.amount = token.balance

  getMinimumWithdrawAmount()

  validateAddress()
}

/**
 * Get Minimum Withdraw Amount
 */
const getMinimumWithdrawAmount = () => {
  appStore.getMinimumWithdrawAmount(form.value.withdrawTokenId).then((res) => {
    if (res) {
      minimumWithdrawAmount.value = res
    }
  })
}

/**
 * Validate Wallet Address
 */
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
 * Withdraw Function
 */
const withdraw = async () => {
  // Check 2FA
  const twoFA = currentUser.value.merchant.two_factor_enabled

  if (!twoFA) {
    router.push({ name: 'settings-privacy' })
    return
  }

  // Validion Form
  const result = await v$.value.$validate()
  const valid_address = validAddress.value

  if (result && valid_address) {
    // Start Loading
    loading.value = true

    // Set Variables
    const content = {
      wallet_address: form.value.receiveAddress
    }
    let params = new URLSearchParams()
    params.set('appId', selectedApp.value.id)
    params.set('tokenId', form.value.withdrawTokenId)

    // Request
    await appStore.requestWithdraw({ content, params }).then((res) => {
      if (res) {
        // Open Offcavas
        const bsOffcanvas = new Offcanvas('#withdrawDetail_offcanvas')
        bsOffcanvas.show()
      }
    })

    // Stop Loading
    loading.value = false
  } else {
    showFeedBacks()
  }
}

watch(
  () => props.selectedBalance,
  () => {
    if (props.selectedBalance.id) {
      toggleWithdrawToken(props.selectedBalance)
    }
  }
)
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
              <div class="svg-holder">
                <inline-svg
                  :src="`/media/icons/shapes/${$filters.shapeStatus('invoice')}.svg`"
                  height="34"
                ></inline-svg>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="mb-0 text-dark">Withdraw Wallet</h3>

              <p class="fs-7 mb-0 text-gray-800 dark-text-gray-600 ls-base">
                Some info may be visible to other people
              </p>
            </div>
          </div>
          <!-- end::Header -->

          <!-- begin::Form -->
          <form
            @submit.prevent="withdraw"
            class="d-flex flex-column justify-content-between flex-root"
          >
            <div>
              <!-- begin::Send -->
              <div
                class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center row-gap-2 column-gap-4 mb-8"
              >
                <!-- begin::Label -->
                <div>
                  <label for="amount" class="w-100 w-sm-104px text-dark"> Amount </label>
                </div>
                <!-- end::Label -->

                <!-- begin::Input Box -->
                <div class="w-100 position-relative d-flex align-items-center">
                  <input
                    id="amount"
                    type="number"
                    class="form-control px-9 cursor-pointer"
                    placeholder="Amount"
                    v-model="form.amount"
                    readonly
                    @click="openDropdown()"
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

                  <div class="position-absolute end-8px">
                    <Skeletor size="24px" circle v-if="mainLoading" />

                    <CoinDropdown
                      v-if="!mainLoading && balances.length"
                      showImage
                      showCoinNetwork
                      showBalance
                      check="id"
                      :items="balances"
                      :selected="withdrawToken"
                      @change="toggleWithdrawToken"
                    />
                  </div>
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
                  <label for="address" class="w-100 w-sm-104px text-dark"> Address </label>
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
            <button type="submit" class="btn btn-primary w-100" :disabled="disableConfirm">
              {{ loading ? 'Loading...' : btnText }}
            </button>
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
