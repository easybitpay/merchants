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
const isLoadingTokens = ref(false)

// Computeds
const tokens = computed(() => store.tokens)

// Vuelidate
const form = ref({
  baseCoin: null,
  availableCoins: null
})

const rules = {
  baseCoin: {
    required: helpers.withMessage('Base currency is required', required)
  },
  availableCoins: {
    required: helpers.withMessage('At least one accepted currency is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Toggle Base Coin
 * @param {token} token
 */
const toggleBaseToken = (token) => {
  base_token.value = token
  form.value.baseCoin = token.id
}

/**
 * Toggle Available Coins
 * @param {tokens} tokens
 */
const toggleAvailableToken = (tokens) => {
  available_tokens.value = tokens
  if (tokens.length) {
    form.value.availableCoins = `${tokens.length}`
  } else {
    form.value.availableCoins = null
  }
}

/**
 * Submit Form - Create the application with all data
 */
const submitForm = async () => {
  // Validate Form
  const result = await v$.value.$validate()
  
  if (result) {
    if (!base_token.value || !base_token.value.id) {
      alert('Please select a base currency')
      return
    }

    if (!available_tokens.value || available_tokens.value.length === 0) {
      alert('Please select at least one accepted currency')
      return
    }

    // Start Loading
    emit('changeLoadingStatus', true)

    // Prepare token IDs
    let array = []
    for (let i = 0; i < available_tokens.value.length; i++) {
      const token = available_tokens.value[i]
      array.push(token.id)
    }
    let availableCoinsString = array.toString()

    // Ensure available_tokens is never empty
    if (!availableCoinsString || availableCoinsString.trim() === '') {
      alert('Please select at least one accepted currency')
      emit('changeLoadingStatus', false)
      return
    }

    // Prepare settings
    let setting = {}
    setting.need_name = props.appInfo.need_name || false
    setting.need_email = props.appInfo.need_email || false
    if (props.appInfo.color) {
      setting.color = props.appInfo.color
    }
    if (props.appInfo.type.type == 2 && props.appInfo.amount) {
      setting.amount = props.appInfo.amount
    }

    // Create FormData with ALL information
    let fd = new FormData()
    fd.append('settings', JSON.stringify(setting))
    fd.append('type', props.appInfo.type.type)
    fd.append('name', props.appInfo.name)
    fd.append('site_url', props.appInfo.site_url)
    fd.append('customer_fee_percent', props.appInfo.customer_fee_percent || 0)
    fd.append('callback_url', props.appInfo.callback_url)
    fd.append('redirect_url', props.appInfo.redirect_url)
    fd.append('base_token_id', base_token.value.id)
    fd.append('available_tokens', availableCoinsString)
    
    if (props.appInfo.logo) {
      fd.append('logo', props.appInfo.logo)
    }
    if (props.appInfo.banner) {
      fd.append('banner', props.appInfo.banner)
    }

    // CREATE THE APPLICATION HERE
    const res = await store.createApp(fd)
    if (!res) {
      alert('Failed to create application. Please check your connection and try again.')
      emit('changeLoadingStatus', false)
      return
    }

    // Set created app info with API key
    emit('setCreatedAppInfo', res)

    // Pass data to next step
    const content = {
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
  // Load tokens
  isLoadingTokens.value = true
  if (!tokens.value || tokens.value.length === 0) {
    const success = await store.getTokens()
    if (!success) {
      alert('Failed to load cryptocurrencies. Please refresh the page and try again.')
    }
  }
  isLoadingTokens.value = false

  document.addEventListener('submitStep2', function () {
    submitForm()
  })
})
</script>

<template>
  <div class="modern-step">
    <h3 class="text-gray-900 mb-2 fw-semibold" style="font-size: 1.25rem;">Currency configuration</h3>
    <p class="text-gray-600 mb-6 fs-6">Choose which cryptocurrencies you want to accept</p>

    <form @submit.prevent="submitForm" class="d-flex flex-column gap-5">
      <button type="submit" hidden></button>
      
      <!-- Loading State -->
      <div v-if="isLoadingTokens" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading cryptocurrencies...</span>
        </div>
        <p class="text-gray-600 mt-3">Loading available cryptocurrencies...</p>
      </div>

      <!-- Crypto Selection -->
      <div v-else>
        <div class="d-flex flex-column gap-4">
          <div>
            <label class="form-label text-gray-700 fw-medium mb-2">
              Base currency
              <span class="text-danger">*</span>
            </label>
            <p class="question-helper">Primary currency for pricing your products</p>
            <CryptoSelect
              :items="tokens"
              :selected="base_token"
              placeholder="Select base currency (e.g., USDT)"
              @change="toggleBaseToken"
            />
            <div class="text-danger mt-2 fs-7" v-if="v$.baseCoin.$errors.length">
              {{ v$.baseCoin.$errors[0].$message }}
            </div>
          </div>

          <div>
            <label class="form-label text-gray-700 fw-medium mb-2">
              Accepted currencies
              <span class="text-danger">*</span>
            </label>
            <p class="question-helper">Customers can pay using any of these currencies</p>
            <CryptoSelect
              :items="tokens"
              :selected="available_tokens"
              placeholder="Select currencies to accept"
              :multiple="true"
              @change="toggleAvailableToken"
            />
            <small class="text-gray-500 mt-2 d-block">
              <i class="bi bi-info-circle me-1"></i>
              Select multiple currencies to give your customers more payment options
            </small>
            <div class="text-danger mt-2 fs-7" v-if="v$.availableCoins.$errors.length">
              {{ v$.availableCoins.$errors[0].$message }}
            </div>
          </div>
        </div>

        <!-- Info Box -->
        <div class="info-box mt-4">
          <div class="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <div>
            <p class="info-title">Creating your gateway</p>
            <p class="info-text">After clicking continue, we'll create your payment gateway and provide you with API credentials for integration.</p>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.question-helper {
  font-size: 0.875rem;
  color: #6b7280;
  margin: -0.25rem 0 0.75rem 0;
  line-height: 1.5;
}

.info-box {
  display: flex;
  gap: 0.875rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 1rem;

  .info-icon {
    width: 36px;
    height: 36px;
    background: #dbeafe;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      color: #3b82f6;
    }
  }

  .info-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1e40af;
    margin: 0 0 0.25rem 0;
  }

  .info-text {
    font-size: 0.8125rem;
    color: #1e3a8a;
    margin: 0;
    line-height: 1.5;
  }
}

[data-bs-theme="dark"] {
  .modern-step {
    h3 {
      color: #f3f4f6 !important;
    }

    p {
      color: #9ca3af !important;
    }

    .form-label {
      color: #e5e7eb !important;
    }

    small {
      color: #9ca3af !important;
    }
  }

  .question-helper {
    color: #9ca3af;
  }

  .info-box {
    background: #1e293b;
    border-color: #334155;

    .info-icon {
      background: #334155;

      svg {
        color: #60a5fa;
      }
    }

    .info-title {
      color: #93c5fd;
    }

    .info-text {
      color: #cbd5e1;
    }
  }
}
</style>
