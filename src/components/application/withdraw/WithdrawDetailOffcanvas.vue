<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

// Hooks
import useForm from '@/composables/useForm.js'
import useConvertDate from '@/composables/useConvertDate.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// Components
import CountDown from '../../globals/CountDown.vue'

// Emit
const emit = defineEmits(['updateWithdrawList'])

// ----- START ----- //

// Generals
const appStore = useAppStore()
const authStore = useAuthStore()
const { showFeedBacks } = useForm()
const { convertDate } = useConvertDate()

// Refs
const loadings = ref({
  accept: false,
  cancel: false
})

// Computeds
const currentUser = computed(() => authStore.currentUser)

const selectedWithdrawItem = computed(() => appStore.selectedWithdrawItem)

const confimationCodes = computed(() => {
  return selectedWithdrawItem.value.confirmation_code
    ? Object.values(selectedWithdrawItem.value.confirmation_code)
    : []
})

const confirmedByMe = computed(() => {
  let codes = confimationCodes.value
  let myId = currentUser.value.merchant.id

  if (codes.length) {
    for (let i = 0; i < codes.length; i++) {
      const element = codes[i]

      if (element.id == myId) {
        return element.is_permitted
      }
    }
  } else {
    return false
  }
})

// Vuelidate
const form = ref({
  email_code: null,
  two_factor_code: null
})

const rules = {
  email_code: {
    required: helpers.withMessage('Email code is required', required)
  },
  two_factor_code: {
    required: helpers.withMessage('2FA code is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Convert Status Code To Color
 */
const convertStatusToColor = (status) => {
  if (status === 'requested' || status === 'pending' || status === 'processing') return 'warning'
  if (status === 'accepted' || status === 'check' || status === 'done') return 'success'
  if (status === 'rejected') return 'danger'
}

/**
 * Reset Form
 */
const resetForm = () => {
  appStore.setSelectedWithdrawItem({})
  form.value = {
    email_code: null,
    two_factor_code: null
  }
  v$.value.$reset()
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('withdrawDetail_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Send Withdraw Confirmation Email Code
 */
const sendEmail = () => {
  const id = selectedWithdrawItem.value.id
  appStore.withdrawResendEmail(id)
}

/**
 * Confirm Withdraw
 */
const confirmWithdraw = async () => {
  // Validation Form
  const result = await v$.value.$validate()
  if (result) {
    // Start loading
    loadings.value.accept = true

    // Set Variables
    const id = selectedWithdrawItem.value.id
    const content = { ...form.value }

    // Request
    await appStore.confirmWithdraw({ id, content }).then((res) => {
      if (res) {
        resetForm()
        closeOffcanvas()
        emit('updateWithdrawList')
      }
    })

    // Stop Loading
    loadings.value.accept = false
  } else {
    showFeedBacks()
  }
}

onMounted(() => {
  const myOffcanvas = document.getElementById('withdrawDetail_offcanvas')

  /**
   * Offcanvas Fire On Hide
   */
  myOffcanvas.addEventListener('hidden.bs.offcanvas', () => {
    resetForm()
  })
})
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
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <form @submit.prevent="confirmWithdraw">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4">
          <div class="card-body pb-lg-22">
            <!-- begin::Header -->
            <div class="d-flex gap-4">
              <div>
                <div class="svg-holder">
                  <inline-svg
                    :src="`/media/icons/shapes/${$filters.shapeStatus('invoice')}.svg`"
                    height="34"
                  ></inline-svg>
                </div>
              </div>

              <div class="mb-10">
                <h3 class="mb-0 text-dark">Withdraw Wallet</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">Invoice Preview</p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <div>
              <!-- begin::Wallet Address -->
              <div class="fs-7 ls-sm">
                <p class="text-gray-600 mb-2">Wallet</p>
                <p class="text-gray-800 mb-0">{{ selectedWithdrawItem.wallet_address }}</p>
              </div>
              <!-- end::Wallet Address -->

              <!-- begin::Spacer -->
              <div class="border-bottom border-gray-400 w-100 my-4"></div>
              <!-- end::Spacer -->

              <!-- begin::Info -->
              <div class="auto-infos">
                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Amount</p>
                  <p class="value">
                    {{ selectedWithdrawItem.requested_amount }}
                    {{ selectedWithdrawItem?.token?.symbol }}
                  </p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Network</p>
                  <p class="value">{{ selectedWithdrawItem?.token?.network?.name || '-' }}</p>
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
                  <p class="value">{{ selectedWithdrawItem.id }}</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Date</p>
                  <p class="value">
                    {{ convertDate(selectedWithdrawItem.created_at, 'DD.MM.YYYY') }}
                  </p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Time</p>
                  <p class="value">
                    {{ convertDate(selectedWithdrawItem.created_at, 'hh:mm:ss') }}
                  </p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Status</p>
                  <p :class="`value text-${convertStatusToColor(selectedWithdrawItem.status)}`">
                    {{ $filters.capitalize(selectedWithdrawItem.status) }}
                  </p>
                </div>
                <!-- end::Item -->
              </div>
              <!-- end::Info -->

              <template v-if="confimationCodes && confimationCodes.length > 1">
                <!-- begin::Spacer -->
                <div class="border-bottom border-gray-400 w-100 my-4"></div>
                <!-- end::Spacer -->
                <!-- begin::Info -->
                <div class="auto-infos">
                  <!-- begin::Item -->
                  <div class="item" v-for="(item, index) in confimationCodes" :key="index">
                    <p class="title">
                      <inline-svg
                        :src="`media/icons/${
                          item.is_permitted ? 'icons/valid-form.svg' : 'shapes/timing_gray.svg'
                        }`"
                        :class="[{ 'svg-icon-primary': item.is_permitted }]"
                        height="24px"
                      ></inline-svg>
                    </p>
                    <p class="value">
                      {{ item.first_name }}
                      {{ item.last_name }}
                    </p>
                  </div>
                  <!-- end::Item -->
                </div>
                <!-- end::Info -->
              </template>

              <template v-if="!confirmedByMe">
                <!-- begin::Spacer -->
                <div class="border-bottom border-gray-400 w-100 my-4"></div>
                <!-- end::Spacer -->

                <!-- begin::Email Code -->
                <div class="w-100 position-relative d-flex align-items-center mb-4">
                  <input
                    type="text"
                    class="form-control ps-9 placeholder-gray-500"
                    placeholder="Inter confirmation code From Your Email"
                    v-model="form.email_code"
                  />

                  <div class="invalid-feedback form-control" v-if="v$.email_code.$errors.length">
                    <span> {{ v$.email_code.$errors[0].$message }}</span>
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
                    <CountDown
                      :key="selectedWithdrawItem.id"
                      :showText="false"
                      :emidiate="false"
                      @isRestarted="sendEmail"
                    />
                  </button>
                  <!-- end::Send Again -->
                </div>
                <!-- end::Email Code -->

                <!-- begin::2FA Code -->
                <div class="w-100 position-relative d-flex align-items-center mb-4">
                  <input
                    type="text"
                    class="form-control ps-9 placeholder-gray-500"
                    placeholder="Inter confirmation code From Your Authenticator"
                    v-model="form.two_factor_code"
                  />
  
                  <div class="invalid-feedback form-control" v-if="v$.two_factor_code.$errors.length">
                    <span> {{ v$.two_factor_code.$errors[0].$message }}</span>
                  </div>
  
                  <!-- begin::Icon -->
                  <inline-svg
                    src="media/icons/icons/lock.svg"
                    class="position-absolute start-8px svg-icon-primary"
                  ></inline-svg>
                  <!-- end::Icon -->
                </div>
                <!-- end::2FA Code -->
              </template>

            </div>
            <!-- end::Content -->
          </div>
        </div>
        <!-- end::Content Card -->

        <!-- begin::Action Card -->
        <div class="d-flex gap-4" v-if="!confirmedByMe">
          <div class="d-none d-md-flex">
            <div
              class="w-56px h-56px d-flex align-items-center justify-content-center rounded-1 bg-white"
            >
              <inline-svg
                :src="`/media/icons/shapes/${$filters.shapeStatus('documentation')}.svg`"
              ></inline-svg>
            </div>
          </div>
          <div class="card border-0 mb-6 w-100">
            <div
              class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
            >
              <p class="offcanvas-action-text">
                Latest clicks/conversions. Are you sure?
              </p>

              <!-- begin::Actions -->
              <div class="d-flex gap-4 w-100 w-sm-initial">
                <button
                  type="button"
                  class="btn btn-sm btn-light w-100 w-sm-104px h-24px ls-base fw-normal"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  :disabled="loadings.accept"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base fw-normal"
                >
                  {{ loadings.accept ? 'Loading...' : 'Transfer' }}
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
