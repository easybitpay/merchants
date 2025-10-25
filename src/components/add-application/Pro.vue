<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Components
import CryptoSelect from './CryptoSelect.vue'

// Props
const props = defineProps({
  appInfo: {
    type: Object,
    required: true
  },
  createdAppInfo: {
    type: Object,
    required: true
  }
})

// Emit
const emit = defineEmits(['goNext', 'changeLoadingStatus', 'setCreatedAppInfo'])

// ----- START ----- //

// Generals
const store = useAppStore()
const { showFeedBacks } = useForm()

// Refs
const base_token = ref({})
const available_tokens = ref([])

// Computeds
const tokens = computed(() => store.tokens)

// Vuelidate
const generalForm = ref({
  callback_url: '',
  redirect_url: '',
  baseCoin: null,
  availableCoins: null,
  need_name: false,
  need_email: false
})

const amountForm = ref({
  amount: ''
})

const generalRules = {
  callback_url: {
    required: helpers.withMessage('Callback url is required', required)
  },
  redirect_url: {
    required: helpers.withMessage('Redirect url is required', required)
  },
  baseCoin: {
    required: helpers.withMessage('Bse coin is required', required)
  },
  availableCoins: {
    required: helpers.withMessage('Availabe coins is required', required)
  }
}

const amountRules = {
  amount: {
    required: helpers.withMessage('Amount is required', required)
  }
}

const vGeneral$ = useVuelidate(generalRules, generalForm)
const vAmount$ = useVuelidate(amountRules, amountForm)

// Functions

/**
 * Toggle Base Coin
 * @param {token} token
 */
const toggleBaseToken = (token) => {
  base_token.value = token
  generalForm.value.baseCoin = token.id
}

/**
 * Toggle Available Coins
 * @param {tokens} tokens
 */
const toggleAvialableToken = (tokens) => {
  available_tokens.value = tokens
  if (tokens.length) {
    generalForm.value.availableCoins = `${tokens.length}`
  } else {
    generalForm.value.availableCoins = null
  }
}

/**
 * Submit Form
 * send data to parent for store
 */
const submitForm = async () => {
  // Validion Form
  const generalResult = await vGeneral$.value.$validate()
  let amountResult = true

  if (props?.appInfo?.type?.type == 2) {
    amountResult = await vAmount$.value.$validate()
  }

  if (generalResult && amountResult) {
    // Start Loading
    emit('changeLoadingStatus', true)

    // Set Variables
    let array = []
    for (let i = 0; i < available_tokens.value.length; i++) {
      const token = available_tokens.value[i]
      array.push(token.id)
    }

    let availableCoinsString = array.toString()

    const id = props.createdAppInfo.id

    let setting = {}
    setting.need_name = generalForm.value.need_name
    setting.need_email = generalForm.value.need_email
    if (props.appInfo.color) {
      setting.color = props.appInfo.color
    }
    

    if (props.appInfo.type.type == 2) setting.amount = amountForm.value.amount

    let fd = new FormData()
    fd.append('settings', JSON.stringify(setting))
    fd.append('type', props.appInfo.type.type)
    fd.append('name', props.appInfo.name)
    fd.append('site_url', props.appInfo.site_url)
    fd.append('customer_fee_percent', props.appInfo.customer_fee_percent)
    fd.append('callback_url', generalForm.value.callback_url)
    fd.append('redirect_url', generalForm.value.redirect_url)
    fd.append('base_token_id', base_token.value.id)
    fd.append('available_tokens', availableCoinsString)
    if (props.appInfo.logo) {
      fd.append('logo', props.appInfo.logo)
    }
    if (props.appInfo.banner) {
      fd.append('banner', props.appInfo.banner)
    }


    if (id) {
      const success = await store.updateApp({ id, fd })
      if (!success) {
        alert('Failed to update application. Please check your connection and try again.')
        emit('changeLoadingStatus', false)
        return
      }
    } else {
      const res = await store.createApp(fd)
      if (!res) {
        alert('Failed to create application. Please check your connection and try again.')
        emit('changeLoadingStatus', false)
        return
      }
      emit('setCreatedAppInfo', res)
    }

    // Change Page
    const content = {
      ...generalForm.value,
      ...amountForm.value,
      baseCoin: base_token.value,
      availableCoins: available_tokens.value
    }
    emit('goNext', content)

    // Stop Loading
    emit('changeLoadingStatus', false)
  } else {
    showFeedBacks()
  }
}

onMounted(async () => {
  // Load tokens if not already loaded
  if (!tokens.value || tokens.value.length === 0) {
    const success = await store.getTokens()
    if (!success) {
      alert('Failed to load cryptocurrencies. Please refresh the page and try again.')
    }
  }

  document.addEventListener('submitStep1', function () {
    submitForm()
  })
})
</script>

<template>
  <div class="modern-step">
    <h3 class="text-gray-900 mb-2 fw-semibold" style="font-size: 1.25rem;">Configure integration</h3>
    <p class="text-gray-600 mb-6 fs-6">Set up webhooks and select supported cryptocurrencies</p>

    <form @submit.prevent="submitForm" class="d-flex flex-column gap-5">
      <button type="submit" hidden></button>
      
      <!-- URLs Section -->
      <div>
        <h6 class="text-gray-800 fw-semibold mb-4">Webhook endpoints</h6>
        <div class="d-flex flex-column gap-4">
          <div>
            <label for="callback-url" class="form-label text-gray-700 fw-medium mb-2">
              Callback URL
            </label>
            <input
              type="text"
              id="callback-url"
              class="form-control form-control-modern"
              placeholder="https://mystore.com/webhooks/callback"
              v-model="generalForm.callback_url"
            />
            <small class="text-gray-500 mt-1 d-block">We'll send payment notifications to this URL</small>
            <div class="text-danger mt-2 fs-7" v-if="vGeneral$.callback_url.$errors.length">
              {{ vGeneral$.callback_url.$errors[0].$message }}
            </div>
          </div>

          <div>
            <label for="redirect-url" class="form-label text-gray-700 fw-medium mb-2">
              Redirect URL
            </label>
            <input
              type="text"
              id="redirect-url"
              class="form-control form-control-modern"
              placeholder="https://mystore.com/payment/success"
              v-model="generalForm.redirect_url"
            />
            <small class="text-gray-500 mt-1 d-block">Users return here after payment</small>
            <div class="text-danger mt-2 fs-7" v-if="vGeneral$.redirect_url.$errors.length">
              {{ vGeneral$.redirect_url.$errors[0].$message }}
            </div>
          </div>

          <div v-if="appInfo?.type?.type == 2">
            <label for="amount" class="form-label text-gray-700 fw-medium mb-2">
              Fixed amount
            </label>
            <input
              type="text"
              id="amount"
              class="form-control form-control-modern"
              placeholder="10.00"
              v-model="amountForm.amount"
            />
            <div class="text-danger mt-2 fs-7" v-if="vAmount$.amount.$errors.length">
              {{ vAmount$.amount.$errors[0].$message }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tokens Section -->
      <div>
        <h6 class="text-gray-800 fw-semibold mb-4">Cryptocurrency settings</h6>
        <div class="d-flex flex-column gap-4">
          <div>
            <label class="form-label text-gray-700 fw-medium mb-2">Base currency</label>
            <CryptoSelect
              :items="tokens"
              :selected="base_token"
              placeholder="Select base currency"
              @change="toggleBaseToken"
            />
            <small class="text-gray-500 mt-1 d-block">Primary currency for pricing</small>
            <div class="text-danger mt-2 fs-7" v-if="vGeneral$.baseCoin.$errors.length">
              {{ vGeneral$.baseCoin.$errors[0].$message }}
            </div>
          </div>

          <div>
            <label class="form-label text-gray-700 fw-medium mb-2">Accepted currencies</label>
            <CryptoSelect
              :items="tokens"
              :selected="available_tokens"
              placeholder="Select currencies to accept"
              :multiple="true"
              @change="toggleAvialableToken"
            />
            <small class="text-gray-500 mt-1 d-block">Customers can pay with these currencies</small>
            <div class="text-danger mt-2 fs-7" v-if="vGeneral$.availableCoins.$errors.length">
              {{ vGeneral$.availableCoins.$errors[0].$message }}
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
[data-bs-theme="dark"] {
  .modern-step {
    h3 {
      color: #f3f4f6 !important;
    }

    p {
      color: #9ca3af !important;
    }

    h6 {
      color: #e5e7eb !important;
    }

    .form-label {
      color: #e5e7eb !important;
    }

    .form-control-modern {
      background: #0f1011;
      border-color: #2d3233;
      color: #f3f4f6;

      &::placeholder {
        color: #6b7280;
      }

      &:focus {
        border-color: #4f46e5;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        background: #0f1011;
      }
    }

    small {
      color: #9ca3af !important;
    }
  }
}
</style>
