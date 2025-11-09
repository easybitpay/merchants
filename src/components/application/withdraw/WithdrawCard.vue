<script setup>
// Vue
import { computed, ref, watch } from 'vue'

// Store
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

// Router
import { useRouter } from 'vue-router'

// Composabless
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
  <div class="card mb-6">
    <div class="card-body p-0">
      <div class="row gy-5">
        <!-- begin::Form Box -->
        <div class="col-xl-5 order-1 order-xl-0 d-flex">
          <!-- begin::Form -->
          <form
            @submit.prevent="withdraw"
            class="d-flex flex-column justify-content-between flex-root p-6 pe-lg-0"
          >
            <div>
              <!-- begin::Send -->
              <div class="d-flex flex-column align-items-start gap-2">
                <!-- begin::Label -->
                <label for="amount" class="fs-7 fw-medium label"> Amount </label>
                <!-- end::Label -->

                <!-- begin::Input Box -->
                <div class="w-100 position-relative d-flex align-items-center">
                  <input
                    id="amount"
                    type="number"
                    class="form-control form-control-lg fs-1 fw-medium"
                    placeholder="0.00"
                    v-model="form.amount"
                    readonly
                    @click="openDropdown()"
                  />

                  <div
                    class="invalid-feedback form-control form-control-lg"
                    v-if="v$.amount.$errors.length || v$.withdrawTokenId.$errors.length"
                  >
                    <span>
                      {{ withdrawTokenError }}
                    </span>
                  </div>

                  <div class="position-absolute end-18px d-flex align-items-center gap-3">
                    <h5 class="m-0 pb-1">
                      {{ withdrawToken.symbol }}
                    </h5>

                    <div>
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
                </div>
                <!-- end::Input Box -->

                <!-- begin::Badge -->
                <span class="badge badge-primary" v-if="withdrawToken.symbol">
                  Network: {{ withdrawToken?.network?.name }}
                </span>
                <!-- end::Badge -->
              </div>
              <!-- end::Send -->

              <!-- begin::Receive Address -->
              <div class="d-flex flex-column align-items-start gap-2 mt-6">
                <!-- begin::Label -->
                <label for="address" class="fs-7 fw-medium label"> Address </label>
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
                    <span> {{ receiveAddressError }}</span>
                  </div>
                </div>
                <!-- end::Input Box -->
              </div>
              <!-- end::Receive Address -->
            </div>

            <!-- begin::Submit -->
            <button
              type="submit"
              class="btn btn-primary w-100 animation h-45px mt-10"
              :disabled="disableConfirm"
            >
              {{ loading ? 'Loading...' : btnText }}
            </button>
            <!-- end::Submit -->
          </form>
          <!-- end::Form -->
        </div>
        <!-- end::Form Box -->

        <div class="col-xl-7 min-h-300px min-h-lg-432px">
          <div
            class="card-linear-background rounded-1 h-100 p-6 d-flex flex-column align-item-start text-white"
            style="--background: url(/media/images/banner/auth-bg.jpg)"
          >
            <div
              class="w-65px h-65px bg-white rounded-1 shadow d-flex align-items-center justify-content-center mb-6"
            >
              <inline-svg
                :src="`/media/icons/shapes/${$filters.shapeStatus('invoice')}.svg`"
                height="34"
              ></inline-svg>
            </div>

            <h3 class="mb-10">Withdraw Wallet</h3>

            <p class="mb-2 fs-7">
              1, Do not withdraw directty to a crowdfund od ICO address, os your account will niot
              be credited with tokens from such sales.
            </p>
            <p class="mb-0 fs-7">
              2, when withdrawing to the éinance user's address. the handling fee will be returned
              to the Current Account by default,
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
