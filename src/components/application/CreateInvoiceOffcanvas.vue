<script setup>
// Vue
import { computed, onMounted, reactive, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useForm from '@/hooks/useForm.js'
import useIconImage from '@/hooks/useIconImage'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'

// Component
import SelectDropdown from '../globals/SelectDropdown.vue'
import MultiSelectDropdown from '../globals/MultiSelectDropdown.vue'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// Emit
const emit = defineEmits(['refresh', 'resetData'])

// ----- START ----- //

// Generals
const store = useAppStore()
const { showFeedBacks } = useForm()
const { iconImage, storageImage } = useIconImage()

// Refs
const step = ref(1)
const totalStep = ref(3)
const loadings = ref({
  submit: false,
  token: false
})
const tokens = ref([])
const base_token = ref({})
const available_tokens = ref([])
const invoiceLink = ref('')

// Comouteds
const selectedApp = computed(() => store.selectedApp)
const totalAmount = computed(() => {
  const total = state.amountDetails.reduce((acc, obj) => acc + +obj.price, 0)

  if (total) return total
  return '00.00'
})

// Vuelidate
const form = ref({
  client_order_identifier: null,
  send_email: false,
  need_detail: false,
  name: null,
  email: null,
  description: null,
  amount: null,
  baseCoin: null,
  availableCoins: null
})

const state = reactive({
  amountDetails: [
    {
      name: null,
      price: null
    }
  ]
})

const customerRules = {
  email: {
    email: helpers.withMessage("Email isn't valid", email)
  }
}

const coinRules = {
  baseCoin: {
    required: helpers.withMessage('Main coin is required', required)
  },
  availableCoins: {
    required: helpers.withMessage('Can pay coins is required', required)
  }
}

const amountRules = {
  amount: {
    required: helpers.withMessage('Amount is required', required)
  }
}

const amountDetailRules = {
  amountDetails: {
    $each: helpers.forEach({
      name: {
        required: helpers.withMessage('Name is required', required)
      },
      price: {
        required: helpers.withMessage('Price is required', required)
      }
    })
  }
}

const vCustomer$ = useVuelidate(customerRules, form)
const vAmount$ = useVuelidate(amountRules, form)
const vCoin$ = useVuelidate(coinRules, form)
const vAmountDetail$ = useVuelidate(amountDetailRules, state)

// Functions

/**
 * Change Total Step Count Based On Amount Need Detail
 */
const changeTotalStep = () => {
  let needDetail = form.value.need_detail

  if (needDetail) {
    totalStep.value = 4
  } else {
    totalStep.value = 3
  }
}

/**
 * Add New Amount Detail Row
 */
const addNewAmountDetail = () => {
  state.amountDetails.push({
    name: null,
    price: null
  })
}

/**
 * Change Send Email Status Base On Email Input
 */
const changeSendEmailStatus = () => {
  if (!form.value.email) {
    form.value.send_email = false
  }
}

/**
 * Get App Tokens
 */
const getAppTokens = async () => {
  // Start Loading
  loadings.value.token = true

  // Request
  await store.getAppTokens(selectedApp.value.id).then((res) => {
    if (res) {
      tokens.value = res
    }
  })

  // Stop Loading
  loadings.value.token = false
}

/**
 * Toggle Base Coin
 * @param {token} token
 */
const toggleBaseToken = (token) => {
  base_token.value = token
  form.value.baseCoin = token
}

/**
 * Toggle Available Coins
 * @param {tokens} tokens
 */
const toggleAvialableToken = (tokens) => {
  available_tokens.value = tokens
  if (tokens.length) {
    form.value.availableCoins = tokens
  } else {
    form.value.availableCoins = null
  }
}

/**
 * Reset Form
 */
const resetForm = () => {
  step.value = 1
  totalStep.value = 3
  form.value = {
    client_order_identifier: null,
    send_email: false,
    need_detail: false,
    name: null,
    email: null,
    description: null,
    amount: null,
    baseCoin: null,
    availableCoins: null
  }
  state.amountDetails = [
    {
      name: null,
      price: null
    }
  ]

  vCustomer$.value.$reset()
  vAmount$.value.$reset()
  vCoin$.value.$reset()
  vAmountDetail$.value.$reset()
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('createInvoice_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Set Default Values
 */
const setDefaultValues = () => {
  base_token.value = selectedApp.value.baseToken
  available_tokens.value = selectedApp.value.availableTokens

  form.value = {
    client_order_identifier: null,
    send_email: false,
    need_detail: false,
    name: null,
    email: null,
    description: null,
    amount: null,
    baseCoin: selectedApp.value.baseToken,
    availableCoins: selectedApp.value.availableTokens
  }

  state.amountDetails = [
    {
      name: null,
      price: null
    }
  ]
}

/**
 * Get Customer Info
 */
const getCustomerInfo = async () => {
  const result = await vCustomer$.value.$validate()
  if (result) {
    step.value++
  } else {
    showFeedBacks()
  }
}

/**
 * Get Coin Info
 */
const getCoinInfo = async () => {
  const coinResult = await vCoin$.value.$validate()
  let amountResult = true

  if (!form.value.need_detail) {
    amountResult = await vAmount$.value.$validate()
  }

  if (coinResult && amountResult) {
    if (form.value.need_detail) {
      step.value++
    } else {
      createInvoice()
    }
  } else {
    showFeedBacks()
  }
}

/**
 * Get Amount Detail Info
 */
const getAmountInfo = async () => {
  const result = await vAmountDetail$.value.$validate()
  if (result) {
    createInvoice()
  } else {
    showFeedBacks()
  }
}

/**
 * Create Invoice
 */
const createInvoice = async () => {
  // Start Loading
  loadings.value.submit = true

  // Set Variables
  let content = {
    app_id: selectedApp.value.id,
    send_email: form.value.send_email,
    base_token_id: base_token.value.id,
  }
  const customer_info =  {
    name: form.value.name,
    email: form.value.email
  }

  content.customer_info = JSON.stringify(customer_info)

  let array = []
  for (let i = 0; i < available_tokens.value.length; i++) {
    const token = available_tokens.value[i]
    array.push(token.id)
  }

  let string = array.toString()
  content.available_tokens = string

  if (form.value.client_order_identifier) {
    content.client_order_identifier = form.value.client_order_identifier
  }

  if (form.value.description) {
    content.description = form.value.description
  }

  let items = {}
  if (form.value.need_detail) {
    for (let i = 0; i < state.amountDetails.length; i++) {
      const element = state.amountDetails[i]
      items[element.name] = element.price
    }

    content.invoice_items = JSON.stringify(items)
    content.amount = `${totalAmount.value}`
  } else {
    content.amount = `${form.value.amount}`
  }
  

  // Request
  await store.createCustomInvoice(content).then((res) => {
    if (res) {
      invoiceLink.value = res.payment_url
      step.value++
    }
  })

  // Stop Loading
  loadings.value.submit = false
}

const copy = () => {
  navigator.clipboard.writeText(invoiceLink.value)
}

const copyAndClose = () => {
  navigator.clipboard.writeText(invoiceLink.value)
  closeOffcanvas()
}

onMounted(() => {
  setTimeout(() => {
    getAppTokens()
  }, 1000)

  const myOffcanvas = document.getElementById('createInvoice_offcanvas')

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
    id="createInvoice_offcanvas"
    aria-labelledby="offcanvasCreateInvoice"
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
          <div class="d-flex align-items-start justify-content-between gap-4">
            <!-- begin::Icon & Text -->
            <div class="d-flex gap-4">
              <div>
                <div class="svg-holder">
                  <inline-svg
                    :src="`media/icons/shapes/${$filters.shapeStatus('invoice')}.svg`"
                    width="40"
                    height="34"
                  ></inline-svg>
                </div>
              </div>

              <div class="mb-10">
                <h3 class="mb-0 text-gray-900">Create Invoice</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">Customer Info</p>
              </div>
            </div>
            <!-- end::Icon & Text -->

            <!-- begin::Step Count -->
            <h3 class="text-gray-500 mb-0">
              <span class="text-primary">{{ step }}</span>
              | {{ totalStep }}
            </h3>
            <!-- end::Step Count -->
          </div>
          <!-- end::Header -->

          <!-- begin::Content -->
          <div>
            <!-- begin::Step 1 - Get Token Info -->
            <form @submit.prevent="getCustomerInfo" v-if="step === 1">
              <button type="submit" class="d-none"></button>

              <p class="mb-6 text-gray-800 ls-base">
                KYC process includes ID card verification, face verification, document verification
                such as utility bills as proof of address, and biometric verification. Banks must
                comply with KYC regulations and anti-money laundering regulations to limit fraud.
              </p>

              <!-- begin::Client Order Identifier -->
              <div class="w-100 position-relative d-flex align-items-center mb-4">
                <input
                  type="text"
                  class="form-control ps-9 placeholder-gray-600"
                  placeholder="Invoice Number"
                  v-model="form.client_order_identifier"
                />

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/mail.svg"
                  class="position-absolute start-8px svg-icon-primary"
                ></inline-svg>
                <!-- end::Icon -->
              </div>
              <!-- end::Client Order Identifier -->

              <!-- begin::Name -->
              <div class="w-100 position-relative d-flex align-items-center mb-4">
                <input
                  type="text"
                  class="form-control ps-9 placeholder-gray-600"
                  placeholder="Customer Name"
                  v-model="form.name"
                />

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/mail.svg"
                  class="position-absolute start-8px svg-icon-primary"
                ></inline-svg>
                <!-- end::Icon -->
              </div>
              <!-- end::Name -->

              <!-- begin::Email -->
              <div class="w-100 position-relative d-flex align-items-center mb-4">
                <input
                  type="text"
                  class="form-control ps-9 placeholder-gray-600"
                  placeholder="Customer Email"
                  v-model="form.email"
                  @change="changeSendEmailStatus()"
                />

                <div class="invalid-feedback form-control" v-if="vCustomer$.email.$errors.length">
                  <span> {{ vCustomer$.email.$errors[0].$message }}</span>
                </div>

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/contact.svg"
                  class="position-absolute start-8px svg-icon-primary"
                ></inline-svg>
                <!-- end::Icon -->
              </div>
              <!-- end::Email -->

              <!-- begin::Description -->
              <div class="w-100 position-relative d-flex align-items-center mb-10">
                <input
                  type="text"
                  class="form-control ps-9 placeholder-gray-600"
                  placeholder="Note “Thanks for your Purchase ”"
                  v-model="form.description"
                />

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/contact.svg"
                  class="position-absolute start-8px svg-icon-primary"
                ></inline-svg>
                <!-- end::Icon -->
              </div>
              <!-- end::Description -->

              <!-- begin::Switch -->
              <div
                class="d-flex justify-content-between flex-wrap gap-3 form-check form-switch p-0"
              >
                <label class="form-check-label text-gray-800" for="notify-user-email">
                  Notify User by Email
                </label>
                <input
                  class="form-check-input m-0"
                  type="checkbox"
                  role="switch"
                  id="notify-user-email"
                  :disabled="!form.email"
                  v-model="form.send_email"
                />
              </div>
              <!-- begin::Switch -->
            </form>
            <!-- end::Step 1 - Get Token Info -->

            <!-- begin::Step 2 - Get Token Amount -->
            <form @submit.prevent="getCoinInfo" v-if="step === 2">
              <button type="submit" class="d-none"></button>

              <p class="mb-6 text-gray-800 ls-base">
                KYC process includes ID card verification, face verification, document verification
                such as utility bills as proof of address, and biometric verification.
              </p>

              <!-- begin::Amount -->
              <div class="w-100 position-relative d-flex align-items-center mb-4">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  class="form-control ps-9 placeholder-gray-600"
                  placeholder="Invoice Total amount"
                  v-model="form.amount"
                />

                <div class="invalid-feedback form-control" v-if="vAmount$.amount.$errors.length">
                  <span> {{ vAmount$.amount.$errors[0].$message }}</span>
                </div>

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/mail.svg"
                  class="position-absolute start-8px svg-icon-primary"
                ></inline-svg>
                <!-- end::Icon -->
              </div>
              <!-- end::Amount -->

              <!-- begin::Base Coin -->
              <div class="w-100 position-relative d-flex align-items-center mb-4">
                <SelectDropdown
                  placeholder="Select Your Main Coin"
                  show="name"
                  showImage
                  showCoinNetwork
                  toggleClass="px-2"
                  svgIcon="media/icons/icons/crypto.svg"
                  svgIconColor="primary"
                  :disabled="loadings.token"
                  :items="tokens"
                  :selected="base_token"
                  @change="toggleBaseToken"
                />

                <div class="invalid-feedback form-control" v-if="vCoin$.baseCoin.$errors.length">
                  <span> {{ vCoin$.baseCoin.$errors[0].$message }}</span>
                </div>
              </div>
              <!-- end::Base Coin -->

              <!-- begin::Available Coins -->
              <div class="w-100 position-relative d-flex align-items-center mb-10">
                <MultiSelectDropdown
                  placeholder="Select Your Can Pay Coin"
                  show="name"
                  showImage
                  showCoinNetwork
                  toggleClass="px-2"
                  svgIcon="media/icons/icons/crypto.svg"
                  svgIconColor="primary"
                  :disabled="loadings.token"
                  :items="tokens"
                  :selected="available_tokens"
                  @change="toggleAvialableToken"
                />

                <div
                  class="invalid-feedback form-control"
                  v-if="vCoin$.availableCoins.$errors.length"
                >
                  <span> {{ vCoin$.availableCoins.$errors[0].$message }}</span>
                </div>
              </div>
              <!-- end::Available Coins -->

              <!-- begin::Switch -->
              <div
                class="d-flex justify-content-between flex-wrap gap-3 form-check form-switch p-0"
              >
                <label class="form-check-label text-gray-800" for="need-detail">
                  Add invoice detail
                </label>
                <input
                  class="form-check-input m-0"
                  type="checkbox"
                  role="switch"
                  id="need-detail"
                  @change="changeTotalStep()"
                  v-model="form.need_detail"
                />
              </div>
              <!-- begin::Switch -->
            </form>
            <!-- end::Step 2 - Get Token Amount -->

            <!-- begin::Step 3 - Get Amount Detail -->
            <form @submit.prevent="getAmountInfo" v-if="step === 3 && form.need_detail">
              <button type="submit" class="d-none"></button>

              <p class="mb-6 text-gray-800 ls-base">
                KYC process includes ID card verification, face verification, document verification
                such as utility bills as proof of address, and biometric verification.
              </p>

              <div
                :class="[
                  { 'mh-156px custom-scroll overflow-auto': true },
                  { 'pe-4': state.amountDetails.length > 3 }
                ]"
              >
                <div class="table-responsive">
                  <table class="table amount-table">
                    <thead>
                      <tr>
                        <th class="min-w-30px w-30px"></th>
                        <th class="min-w-250px w-250px"></th>
                        <th class="min-w-250px w-250px"></th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="(input, index) in state.amountDetails" :key="index">
                        <td class="text-gray-800 fs-6">
                          {{ index + 1 < 10 ? `0${index + 1}` : index + 1 }}
                        </td>
                        <td>
                          <!-- begin::Name -->
                          <div class="w-100 position-relative d-flex align-items-center">
                            <input
                              type="text"
                              class="form-control placeholder-gray-600"
                              placeholder="Enter Your Item Name"
                              v-model="input.name"
                            />

                            <div
                              class="invalid-feedback form-control"
                              v-if="
                                vAmountDetail$.amountDetails.$each.$response.$errors[index].name
                                  .length
                              "
                            >
                              <span>
                                {{
                                  vAmountDetail$.amountDetails.$each.$response.$errors[index]
                                    .name[0].$message
                                }}
                              </span>
                            </div>
                          </div>
                          <!-- end::Name -->
                        </td>
                        <td>
                          <!-- begin::Price -->
                          <div class="w-100 position-relative d-flex align-items-center">
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              class="form-control placeholder-gray-600"
                              placeholder="Enter Your Item Price"
                              v-model="input.price"
                            />

                            <div
                              class="invalid-feedback form-control"
                              v-if="
                                vAmountDetail$.amountDetails.$each.$response.$errors[index].price
                                  .length
                              "
                            >
                              <span>
                                {{
                                  vAmountDetail$.amountDetails.$each.$response.$errors[index]
                                    .price[0].$message
                                }}
                              </span>
                            </div>
                          </div>
                          <!-- end::Price -->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- begin::Add Row -->
              <div type="button" class="btn btn-primary w-100 my-6" @click="addNewAmountDetail()">
                Add Row
              </div>
              <!-- end::Add Row -->

              <!-- begin::Spacer -->
              <div class="border-bottom border-gray-400 w-100 mb-4"></div>
              <!-- end::Spacer -->

              <!-- begin::Info -->
              <div class="auto-infos">
                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Invoice Number</p>
                  <p class="value">{{ form.client_order_identifier || '-' }}</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Total Item</p>
                  <p class="value">{{ state.amountDetails.length }}</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Total Price</p>
                  <p class="value">{{ totalAmount }} {{ base_token.symbol }}</p>
                </div>
                <!-- end::Item -->
              </div>
              <!-- end::Info -->
            </form>
            <!-- end::Step 3 - Get Amount Detail -->

            <!-- begin::Last Step - Show Created Invoice Info -->
            <div v-if="step === totalStep">
              <!-- begin::Info -->
              <div class="auto-infos">
                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Name</p>
                  <p class="value">{{ form.name || '-' }}</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Email</p>
                  <p class="value">{{ form.email || '-' }}</p>
                </div>
                <!-- end::Item -->
              </div>
              <!-- end::Info -->

              <!-- begin::Spacer -->
              <div class="border-bottom border-gray-400 w-100 my-4"></div>
              <!-- end::Spacer -->

              <template v-if="form.description">
                <p>{{ form.description }}</p>

                <!-- begin::Spacer -->
                <div class="border-bottom border-gray-400 w-100 my-4"></div>
                <!-- end::Spacer -->
              </template>

              <!-- begin::Info -->
              <div class="auto-infos" v-if="!form.need_detail">
                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Total Price</p>
                  <p class="value">{{ form.amount }}</p>
                </div>
                <!-- end::Item -->
              </div>
              <!-- end::Info -->

              <!-- begin::Amount Detail Info -->
              <template v-else>
                <div class="table-responsive">
                  <table class="table amount-table">
                    <thead>
                      <tr>
                        <th class="min-w-20px w-20px"></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="(item, index) in state.amountDetails" :key="index" class="fs-7">
                        <td>
                          {{ index + 1 < 10 ? `0${index + 1}` : index + 1 }}
                        </td>
                        <td>
                          <div class="max-content">
                            {{ item.name }}
                          </div>
                        </td>
                        <td class="text-end">
                          <div class="max-content">{{ item.price }} {{ base_token.symbol }}</div>
                        </td>
                      </tr>

                      <tr class="fs-7">
                        <td class="pb-0 pt-3"></td>
                        <td class="pb-0 pt-3">
                          <div class="max-content text-primary fw-medium">Total</div>
                        </td>
                        <td class="text-end pb-0 pt-3">
                          <div class="max-content text-primary fw-medium">
                            {{ totalAmount }} {{ base_token.symbol }}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
              <!-- end::Amount Detail Info -->

              <!-- begin::Spacer -->
              <div class="border-bottom border-gray-400 w-100 my-4"></div>
              <!-- end::Spacer -->

              <!-- begin::Info -->
              <div class="auto-infos">
                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Base Token</p>
                  <div class="value" v-if="form.baseCoin">
                    <div class="d-flex gap-2">
                      <img
                        :src="
                          form?.baseCoin?.logo
                            ? storageImage(form?.baseCoin?.logo, 32)
                            : iconImage(form?.baseCoin?.symbol)
                        "
                        :alt="form?.baseCoin?.name"
                        class="small-coin-icon"
                      />
                    </div>
                  </div>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div class="item">
                  <p class="title">Available Tokens</p>
                  <div class="value" v-if="form.availableCoins">
                    <div class="d-flex gap-2">
                      <img
                        v-for="(item, index) in form.availableCoins"
                        :key="index"
                        :src="item.logo ? storageImage(item.logo, 32) : iconImage(item.symbol)"
                        :alt="item?.name"
                        class="small-coin-icon"
                      />
                    </div>
                  </div>
                </div>
                <!-- end::Item -->
              </div>
              <!-- end::Info -->

              <!-- begin::Spacer -->
              <div class="border-bottom border-gray-400 w-100 my-4"></div>
              <!-- end::Spacer -->

              <!-- begin::Link -->
              <div class="w-100 position-relative d-flex align-items-center mb-4">
                <input type="text" class="form-control px-9" :value="invoiceLink" readonly />

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/lock.svg"
                  class="position-absolute start-8px svg-icon-primary"
                ></inline-svg>
                <!-- end::Icon -->

                <!-- begin::Icon -->
                <inline-svg
                  @click="copy"
                  src="media/icons/icons/copy.svg"
                  class="position-absolute end-8px svg-icon-gray-500"
                ></inline-svg>
                <!-- end::Icon -->
              </div>
              <!-- end::Link -->
            </div>
            <!-- end::Last Step - Show Created Invoice Info -->
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
            <inline-svg
              :src="`/media/icons/shapes/${$filters.shapeStatus('documentation')}.svg`"
            ></inline-svg>
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
                  @click="getCustomerInfo"
                  type="button"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base"
                >
                  next
                </button>
              </template>

              <template v-if="step === 2">
                <button
                  @click="step--"
                  type="button"
                  class="btn btn-sm bg-gray-500 text-white w-100 w-sm-104px h-24px ls-base fw-normal"
                >
                  Back
                </button>

                <button
                  @click="getCoinInfo"
                  type="button"
                  :disabled="loadings.submit"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base"
                >
                  {{ loadings.submit ? 'Loading...' : 'Next' }}
                </button>
              </template>

              <template v-if="step === 3 && form.need_detail">
                <button
                  @click="step--"
                  type="button"
                  class="btn btn-sm bg-gray-500 text-white w-100 w-sm-104px h-24px ls-base fw-normal"
                >
                  Back
                </button>

                <button
                  @click="getAmountInfo"
                  type="button"
                  :disabled="loadings.submit"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base"
                >
                  {{ loadings.submit ? 'Loading...' : 'Next' }}
                </button>
              </template>

              <template v-if="step === totalStep">
                <button
                  @click="copyAndClose"
                  type="button"
                  class="btn btn-sm btn-primary w-100 w-sm-initial h-24px ls-base"
                >
                  Copy And Close
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
