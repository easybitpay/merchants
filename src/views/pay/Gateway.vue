<script setup>
// Vue
import { computed, ref, onMounted, onUnmounted } from 'vue'

// Router
import { useRoute, useRouter } from 'vue-router'

// Store
import { usePayStore } from '@/stores/pay'

// Hooks
import useIconImage from '@/hooks/useIconImage'
import useRedirectPayment from '@/hooks/useRedirectPayment'

// Components
import PayCountDown from '../../components/globals/PayCountDown.vue'

// Props
const props = defineProps({
  sandbox: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['changeBG'])

// ----- START ----- //

// Generals
const store = usePayStore()
const route = useRoute()
const router = useRouter()
const { iconImage, storageImage } = useIconImage()
const { cancelPayment, cancelLoading, redirectPaymentStatus, fakePayment, fakePayLoading } =
  useRedirectPayment(props.sandbox)

// Refs
const loading = ref(false)
const interval = ref(null)

// Computeds
const invoiceCode = computed(() => route.params.id)
const userInputs = computed(() => store.getUserInputs)
const selectedCoin = computed(() => store.getSelectedCoin)
const selectedNetwork = computed(() => store.getSelectedNetwork)
const paymentDetail = computed(() => store.getPaymentDetail)
const invoiceDetail = computed(() => store.getInvoiceDetail)
const paymentTransactions = computed(() => store.getPaymentTransactions)

const qrCode = computed(
  () =>
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${paymentDetail.value.walletAddress}`
)

const convertPricePerBase = computed(() => {
  const base_amount = +invoiceDetail.value.amount
  const must_pay_amount = +selectedCoin.value.amount

  return (base_amount / must_pay_amount).toFixed(2)
})

const paidAmount = computed(() => {
  const initialValue = 0

  if (!paymentTransactions.value.length) return initialValue

  const sum = paymentTransactions.value.reduce(function (accumulator, curValue) {
    return accumulator + +curValue.amount
  }, initialValue)

  return sum
})

const filledPercent = computed(() => {
  const paid = paidAmount.value
  const mustPaid = +selectedCoin.value.amount

  return ((paid * 100) / mustPaid).toFixed(0)
})

const convertFillToColor = computed(() => {
  if (filledPercent.value < 30) return 'danger'
  if (filledPercent.value < 70) return 'warning'
  return 'success'
})

// Functions

const back = () => {
  router.push({
    name: props.sandbox ? 'select-coin-sandbox' : 'select-coin',
    params: { id: invoiceCode.value }
  })
}

/**
 * Get Payment Detail
 */
const get_payment_detail = async () => {
  const invoice_code = invoiceCode.value

  // return to select token page , if user not select token and come from link
  if (!selectedNetwork.value.token_id || !invoiceDetail.value.app) {
    router.push({ name: 'select-coin', params: { id: invoice_code } })
    return
  }

  const token_id = selectedNetwork.value.token_id
  const appType = invoiceDetail.value.app.type
  const { name, email, amount } = userInputs.value

  // start loading
  loading.value = true

  // set variable
  let content = {
    name: '',
    email: '',
    amount: ''
  }
  const incoiceID = appType == 1 ? invoice_code : invoice_code.split('a')[1]
  let params = new URLSearchParams()
  params.set('token_id', token_id)
  if (appType == 1) {
    if (name) {
      params.set('name', name)
    }
    if (email) {
      params.set('email', email)
    }
    if (amount) {
      params.set('amount', amount)
    }
  } else {
    if (name) {
      content.name = name
    }
    if (email) {
      content.email = email
    }
    if (amount) {
      content.amount = amount
    }
  }

  await store[`${appType == 1 ? 'getPaymentDetails' : 'getAppPeymentDetail'}`]({
    incoiceID,
    params,
    content
  }).then((res) => {
    if (res) {
      payment_check_status()

      interval.value = setInterval(() => {
        payment_check_status()
      }, 30000)
    } else {
      router.push({
        name: props.sandbox ? 'select-coin-sandbox' : 'select-coin',
        params: { id: invoice_code }
      })
    }
  })

  // stop loading
  loading.value = false
}

/**
 * Payment Check Status
 */
const payment_check_status = async () => {
  await store.paymentCheckStatus(invoiceCode.value).then((res) => {
    if (res) {
      clearInterval(interval.value)

      redirectPaymentStatus(res)
    }
  })
}

onMounted(() => {
  get_payment_detail()
})

onUnmounted(() => {
  clearInterval(interval.value)
})
</script>

<template>
  <!-- begin::Info -->
  <div class="auto-infos">
    <!-- begin::Item -->
    <div class="item">
      <p class="title">Status</p>
      <p :class="`value text-${convertFillToColor}`">{{ filledPercent }}%</p>
    </div>
    <!-- end::Item -->

    <!-- begin::Item -->
    <div class="item">
      <p class="title">Coin</p>
      <p class="value">{{ selectedCoin.symbol || 'not Selected' }}</p>
    </div>
    <!-- end::Item -->

    <!-- begin::Item -->
    <div class="item">
      <p class="title">Netrwok</p>
      <p class="value">
        {{
          selectedNetwork.name
            ? `${selectedNetwork.name.toUpperCase()} (${selectedNetwork.chain_type.toUpperCase()})`
            : 'not Selected'
        }}
      </p>
    </div>
    <!-- end::Item -->

    <!-- begin::Item -->
    <div class="item">
      <p class="title">Expiration Time</p>
      <p class="value">
        <PayCountDown
          :remain_time="paymentDetail.remain_time"
          @expired="redirectPaymentStatus(1)"
        />
      </p>
    </div>
    <!-- end::Item -->
  </div>
  <!-- end::Info -->

  <!-- begin::Spacer -->
  <div class="border-bottom border-gray-400 w-100 mt-4 mb-10"></div>
  <!-- end::Spacer -->

  <!-- begin::Qr Code -->
  <div class="d-flex flex-column flex-md-row align-items-center gap-4">
    <img :src="qrCode" alt="qr-code" width="140" />

    <div class="w-100">
      <!-- begin::Coin & Price -->
      <div class="form-control d-flex align-items-center gap-2 ps-2 mb-4">
        <img
          :src="iconImage(selectedCoin.symbol)"
          :alt="selectedCoin.symbol"
          class="small-coin-icon"
        />
        {{ +selectedCoin.amount - paidAmount }} {{ selectedCoin.symbol }}
      </div>
      <!-- end::Coin & Price -->

      <!-- begin::Address -->
      <div class="w-100 position-relative d-flex align-items-center mb-4">
        <input
          type="text"
          class="form-control ps-9"
          :value="paymentDetail.walletAddress"
          readonly
        />

        <!-- begin::Icon -->
        <inline-svg
          src="media/icons/icons/wireless.svg"
          class="position-absolute start-8px svg-icon-primary"
        ></inline-svg>
        <!-- end::Icon -->
      </div>
      <!-- end::Address -->
    </div>
  </div>
  <!-- end::Qr Code -->

  <!-- begin::Action -->
  <div class="d-flex flex-wrap gap-4 mt-28">
    <button type="button" @click="back" class="btn border-0 bg-gray-200 p-0 w-40px h-40px">
      <inline-svg src="media/icons/icons/arrow-left.svg" class="svg-icon-primary"></inline-svg>
    </button>

    <button
      type="button"
      :disabled="cancelLoading"
      @click="cancelPayment"
      class="btn btn-danger flex-grow-1 text-white"
    >
      {{ cancelLoading ? 'Loading...' : 'Cancel' }}
    </button>
  </div>
  <!-- end::Action -->
</template>
