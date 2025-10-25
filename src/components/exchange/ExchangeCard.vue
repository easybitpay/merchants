<script setup>
// Vue
import { computed, ref, onMounted } from 'vue'

// Store
import { useExchangeStore } from '@/stores/exchange'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Address Validator
import WAValidator from 'multicoin-address-validator/dist/wallet-address-validator.js'

// Component
import CoinDropdown from '../../components/globals/CoinDropdown.vue'
import BoxLoading from '../globals/BoxLoading.vue'

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
      
      // Auto-select first tokens to show UI elements
      if (res.sendTokens && res.sendTokens.length > 0) {
        selectedSendToken.value = res.sendTokens[0]
        form.value.sendTokenId = res.sendTokens[0].id
      }
      
      if (res.receiveTokens && res.receiveTokens.length > 0) {
        selectedReceiveToken.value = res.receiveTokens[0]
        form.value.receiveTokenId = res.receiveTokens[0].id
      }
      
      // Get initial exchange rate
      if (form.value.sendTokenId && form.value.receiveTokenId) {
        getExchangeRate()
      }
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
  <div class="premium-exchange-card">
    <div class="exchange-container">
      <!-- Swap Form -->
      <div class="exchange-form-section">
        <form @submit.prevent="exchange" class="exchange-form">
          <!-- From Section -->
          <div class="swap-section">
            <div class="section-label">
              <span>You Send</span>
              <span class="label-hint" v-if="selectedSendToken.symbol">Balance: 0.00</span>
            </div>
            
            <div class="swap-input-wrapper" :class="{ 'is-invalid': v$.sendAmount.$errors.length || v$.sendTokenId.$errors.length }">
              <div class="input-group">
                <input
                  type="number"
                  step="any"
                  class="swap-input"
                  placeholder="0.00"
                  v-model="form.sendAmount"
                />
                <div class="input-currency" v-if="selectedSendToken.symbol">{{ selectedSendToken.symbol }}</div>
              </div>
              
              <CoinDropdown
                class="token-selector"
                showImage
                showCoinNetwork
                check="id"
                :items="sendTokens"
                :selected="selectedSendToken"
                @change="toggleSendToken"
              />
            </div>

            <div class="error-message" v-if="v$.sendAmount.$errors.length || v$.sendTokenId.$errors.length">
              {{ sendTokenError }}
            </div>

            <div class="token-details" v-if="selectedSendToken?.network?.name">
              <div class="detail-badge network">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="6" cy="6" r="5"/>
                  <circle cx="6" cy="6" r="2"/>
                </svg>
                <span>Network: {{ selectedSendToken.network.name }}</span>
              </div>
            </div>
          </div>

          <!-- Swap Divider -->
          <div class="swap-divider">
            <button type="button" class="swap-icon-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 4v12m0 0l-4-4m4 4l4-4"/>
              </svg>
            </button>
            
            <div class="exchange-rate" v-if="exchangeRate && selectedSendToken.symbol && selectedReceiveToken.symbol">
              <span class="rate-text">1 {{ selectedSendToken.symbol }} ≈ {{ exchangeRate }} {{ selectedReceiveToken.symbol }}</span>
            </div>
          </div>

          <!-- To Section -->
          <div class="swap-section">
            <div class="section-label">
              <span>You Receive</span>
              <span class="label-hint estimate" v-if="receiveAmount">≈ Estimate</span>
            </div>
            
            <div class="swap-input-wrapper receive-wrapper" :class="{ 'is-invalid': v$.receiveTokenId.$errors.length }">
              <div class="input-group">
                <input
                  type="number"
                  class="swap-input"
                  placeholder="0.00"
                  :value="receiveAmount ? receiveAmount.toFixed(6) : ''"
                  readonly
                />
                <div class="input-currency" v-if="selectedReceiveToken.symbol">{{ selectedReceiveToken.symbol }}</div>
              </div>
              
              <CoinDropdown
                class="token-selector"
                showImage
                showCoinNetwork
                check="id"
                :items="receiveTokens"
                :selected="selectedReceiveToken"
                @change="toggleReceiveToken"
              />
            </div>

            <div class="error-message" v-if="v$.receiveTokenId.$errors.length">
              {{ v$.receiveTokenId.$errors[0].$message }}
            </div>

            <div class="token-details" v-if="selectedReceiveToken?.network?.name">
              <div class="detail-badge network">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="6" cy="6" r="5"/>
                  <circle cx="6" cy="6" r="2"/>
                </svg>
                <span>Network: {{ selectedReceiveToken.network.name }}</span>
              </div>
            </div>
          </div>

          <!-- Recipient Address -->
          <div class="recipient-section">
            <label class="recipient-label">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="5" width="10" height="8" rx="1"/>
                <path d="M7 5V3a2 2 0 114 0v2"/>
              </svg>
              <span>Recipient Address</span>
            </label>
            
            <input
              type="text"
              class="recipient-input"
              placeholder="Enter recipient's wallet address"
              v-model="form.receiveAddress"
              @change="validateAddress"
              :class="{ 'is-invalid': v$.receiveAddress.$errors.length || (addressValidFlag && !validAddress), 'is-valid': addressValidFlag && validAddress }"
            />

            <div class="error-message" v-if="v$.receiveAddress.$errors.length || (addressValidFlag && !validAddress)">
              {{ receiveAddressError }}
            </div>

            <div class="address-verified" v-if="addressValidFlag && validAddress">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 5L6 12 3 9"/>
              </svg>
              <span>Valid address</span>
            </div>
          </div>

          <!-- Transaction Summary -->
          <div class="transaction-summary" v-if="selectedSendToken.symbol && selectedReceiveToken.symbol && form.sendAmount && receiveAmount">
            <div class="summary-header">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 8h12M8 2v12"/>
                <circle cx="8" cy="8" r="6"/>
              </svg>
              <span>Transaction Details</span>
            </div>

            <div class="summary-main">
              <div class="summary-row send-row">
                <div class="row-label">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 3v8m0 0l3-3m-3 3L4 8"/>
                  </svg>
                  <span>You Send</span>
                </div>
                <div class="row-value">
                  <span class="amount">{{ form.sendAmount }}</span>
                  <span class="token">{{ selectedSendToken.symbol }}</span>
                  <span class="network-pill">{{ selectedSendToken.network.name }}</span>
                </div>
              </div>

              <div class="summary-divider">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 8h10m0 0l-3-3m3 3l-3 3"/>
                </svg>
              </div>

              <div class="summary-row receive-row">
                <div class="row-label">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 11V3m0 0L4 6m3-3l3 3"/>
                  </svg>
                  <span>You Receive</span>
                </div>
                <div class="row-value">
                  <span class="amount">{{ receiveAmount.toFixed(6) }}</span>
                  <span class="token">{{ selectedReceiveToken.symbol }}</span>
                  <span class="network-pill">{{ selectedReceiveToken.network.name }}</span>
                </div>
              </div>
            </div>

            <div class="summary-breakdown">
              <div class="breakdown-item">
                <span class="breakdown-label">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 1v10M1 6h10"/>
                  </svg>
                  Exchange Rate
                </span>
                <span class="breakdown-value">1 {{ selectedSendToken.symbol }} = {{ exchangeRate }} {{ selectedReceiveToken.symbol }}</span>
              </div>
              
              <div class="breakdown-item">
                <span class="breakdown-label">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 6h8M6 2v8"/>
                  </svg>
                  Network Fee (est.)
                </span>
                <span class="breakdown-value">{{ (form.sendAmount * 0.001).toFixed(4) }} {{ selectedSendToken.symbol }}</span>
              </div>
              
              <div class="breakdown-item">
                <span class="breakdown-label">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="6" cy="6" r="5"/>
                    <path d="M6 3v3l2 2"/>
                  </svg>
                  Processing Time
                </span>
                <span class="breakdown-value">~30 seconds</span>
              </div>

              <div class="breakdown-item total">
                <span class="breakdown-label">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 4L5 9 2 6"/>
                  </svg>
                  Total Cost
                </span>
                <span class="breakdown-value">{{ (parseFloat(form.sendAmount) + parseFloat(form.sendAmount) * 0.001).toFixed(6) }} {{ selectedSendToken.symbol }}</span>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loadings.submit"
            class="swap-submit-btn"
          >
            <span v-if="!loadings.submit">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 10l3 3 7-7"/>
              </svg>
              <span>Complete Swap</span>
            </span>
            <span v-else class="loading-content">
              <svg class="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="10" cy="10" r="8" opacity="0.25"/>
                <path d="M10 2a8 8 0 018 8"/>
              </svg>
              <span>Processing...</span>
            </span>
          </button>
        </form>
      </div>

      <!-- Info Section -->
      <div class="exchange-info-section">
        <div class="info-background"></div>
        
        <div class="info-content">
          <div class="info-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 15l10 10m0-10L15 25"/>
              <circle cx="20" cy="20" r="15"/>
            </svg>
          </div>

          <h3 class="info-title">Instant Crypto Swaps</h3>
          <p class="info-description">Exchange digital assets in seconds with competitive rates and low fees. Your swap is processed instantly on the blockchain.</p>

          <div class="info-features">
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 6L8 15l-5-5"/>
              </svg>
              <span>Real-time exchange rates</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 6L8 15l-5-5"/>
              </svg>
              <span>Secure blockchain transactions</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 6L8 15l-5-5"/>
              </svg>
              <span>Low network fees</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 6L8 15l-5-5"/>
              </svg>
              <span>No hidden charges</span>
            </div>
          </div>

          <div class="swap-preview" v-if="selectedSendToken.symbol && selectedReceiveToken.symbol && form.sendAmount">
            <div class="preview-header">Transaction Preview</div>
            <div class="preview-flow">
              <div class="preview-item">
                <div class="preview-amount">{{ form.sendAmount }} {{ selectedSendToken.symbol }}</div>
                <div class="preview-network">{{ selectedSendToken.network.name }}</div>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14m0 0l-7-7m7 7l-7 7"/>
              </svg>
              <div class="preview-item">
                <div class="preview-amount">{{ receiveAmount }} {{ selectedReceiveToken.symbol }}</div>
                <div class="preview-network">{{ selectedReceiveToken.network.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BoxLoading v-if="loadings.box" />
  </div>
</template>

<style scoped lang="scss">
.premium-exchange-card {
  position: relative;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

[data-bs-theme="dark"] .premium-exchange-card {
  background: #1a1d1e;
  border-color: #2d3233;
}

.exchange-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 600px;

  @media (max-width: 1199px) {
    grid-template-columns: 1fr;
  }
}

.exchange-form-section {
  padding: 2rem;
  border-right: 1.5px solid #e5e7eb;

  @media (max-width: 1199px) {
    border-right: none;
    border-bottom: 1.5px solid #e5e7eb;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

[data-bs-theme="dark"] .exchange-form-section {
  border-right-color: #2d3233;

  @media (max-width: 1199px) {
    border-bottom-color: #2d3233;
  }
}

.exchange-form {
  max-width: 500px;
  margin: 0 auto;
}

.swap-section {
  margin-bottom: 1rem;
}

.section-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;

  .label-hint {
    color: #9ca3af;
    font-size: 0.8125rem;
  }
}

[data-bs-theme="dark"] .section-label {
  color: #f3f4f6;

  .label-hint {
    color: #6b7280;

    &.estimate {
      color: #60a5fa;
    }
  }
}

.swap-input-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  transition: all 0.2s ease;

  &:focus-within {
    background: white;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &.is-invalid {
    border-color: #ef4444;
    background: #fef2f2;
  }

  &.receive-wrapper {
    background: #eff6ff;
    border-color: #bfdbfe;

    &:focus-within {
      background: #dbeafe;
      border-color: #3b82f6;
    }
  }
}

[data-bs-theme="dark"] .swap-input-wrapper {
  background: #0f1011;
  border-color: #2d3233;

  &:focus-within {
    background: #1a1d1e;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  &.is-invalid {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }

  &.receive-wrapper {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.3);

    &:focus-within {
      background: rgba(59, 130, 246, 0.15);
      border-color: #3b82f6;
    }
  }
}

.input-group {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  min-width: 0;
}

.swap-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1.75rem;
  font-weight: 600;
  color: #111827;
  outline: none;
  min-width: 0;

  &::placeholder {
    color: #d1d5db;
  }

  &:read-only {
    color: #3b82f6;
  }
}

[data-bs-theme="dark"] .swap-input {
  color: #f3f4f6;

  &::placeholder {
    color: #4b5563;
  }

  &:read-only {
    color: #60a5fa;
  }
}

.input-currency {
  font-size: 1.25rem;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
  flex-shrink: 0;
}

[data-bs-theme="dark"] .input-currency {
  color: #9ca3af;
}

.token-selector {
  flex-shrink: 0;
}

.token-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.detail-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;

  svg {
    flex-shrink: 0;
  }

  &.network {
    background: #eff6ff;
    color: #2563eb;
  }
}

[data-bs-theme="dark"] .detail-badge {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;

  &.network {
    background: rgba(37, 99, 235, 0.15);
    color: #60a5fa;
  }
}

.label-hint {
  &.estimate {
    color: #3b82f6;
    font-weight: 500;
  }
}

.error-message {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.swap-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e7eb;
    z-index: 0;
  }
}

[data-bs-theme="dark"] .swap-divider::before {
  background: #2d3233;
}

.swap-icon-btn {
  position: relative;
  z-index: 1;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    transform: rotate(180deg);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  }
}

.exchange-rate {
  position: relative;
  z-index: 1;
  padding: 0.5rem 1rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  color: #6b7280;
  white-space: nowrap;
}

[data-bs-theme="dark"] .exchange-rate {
  background: #1a1d1e;
  border-color: #2d3233;
  color: #9ca3af;
}

.recipient-section {
  margin-top: 1.5rem;
}

.recipient-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;

  svg {
    color: #6b7280;
  }
}

[data-bs-theme="dark"] .recipient-label {
  color: #f3f4f6;

  svg {
    color: #9ca3af;
  }
}

.recipient-input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-family: 'Roboto Mono', monospace;
  color: #111827;
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    background: white;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &.is-invalid {
    border-color: #ef4444;
    background: #fef2f2;
  }

  &.is-valid {
    border-color: #10b981;
    background: #f0fdf4;
  }
}

[data-bs-theme="dark"] .recipient-input {
  background: #0f1011;
  border-color: #2d3233;
  color: #f3f4f6;

  &::placeholder {
    color: #6b7280;
  }

  &:focus {
    background: #1a1d1e;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  &.is-invalid {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }

  &.is-valid {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.1);
  }
}

.address-verified {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  color: #10b981;
  font-size: 0.8125rem;
  font-weight: 500;
}

.transaction-summary {
  margin-top: 1.5rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

[data-bs-theme="dark"] .transaction-summary {
  background: #1a1d1e;
  border-color: #2d3233;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #1e40af;
  font-size: 0.875rem;
  font-weight: 600;
  border-bottom: 1.5px solid #bfdbfe;

  svg {
    flex-shrink: 0;
  }
}

[data-bs-theme="dark"] .summary-header {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15));
  color: #60a5fa;
  border-bottom-color: rgba(59, 130, 246, 0.3);
}

.summary-main {
  padding: 1.25rem;
  background: #f9fafb;
}

[data-bs-theme="dark"] .summary-main {
  background: #0f1011;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem;
  background: white;
  border-radius: 0.5rem;
  border: 1.5px solid #e5e7eb;

  &.send-row {
    border-left: 3px solid #ef4444;
  }

  &.receive-row {
    border-left: 3px solid #10b981;
  }
}

[data-bs-theme="dark"] .summary-row {
  background: #1a1d1e;
  border-color: #2d3233;
}

.row-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;

  svg {
    flex-shrink: 0;
  }
}

[data-bs-theme="dark"] .row-label {
  color: #9ca3af;
}

.row-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;

  .amount {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
  }

  .token {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #3b82f6;
  }

  .network-pill {
    padding: 0.25rem 0.625rem;
    background: #eff6ff;
    color: #2563eb;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
  }
}

[data-bs-theme="dark"] .row-value {
  .amount {
    color: #f3f4f6;
  }

  .token {
    color: #60a5fa;
  }

  .network-pill {
    background: rgba(37, 99, 235, 0.15);
    color: #60a5fa;
  }
}

.summary-divider {
  display: flex;
  justify-content: center;
  padding: 0.75rem 0;
  color: #3b82f6;
}

.summary-breakdown {
  padding: 1rem;
  border-top: 1.5px solid #e5e7eb;
}

[data-bs-theme="dark"] .summary-breakdown {
  border-top-color: #2d3233;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0;
  font-size: 0.875rem;

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }

  &.total {
    margin-top: 0.5rem;
    padding-top: 0.875rem;
    border-top: 1.5px solid #e5e7eb;
    font-weight: 600;
    
    .breakdown-label {
      color: #111827;
      font-weight: 600;
    }

    .breakdown-value {
      color: #3b82f6;
      font-weight: 700;
      font-size: 1rem;
    }
  }
}

[data-bs-theme="dark"] .breakdown-item {
  &:not(:last-child) {
    border-bottom-color: #2d3233;
  }

  &.total {
    border-top-color: #2d3233;
    
    .breakdown-label {
      color: #f3f4f6;
    }

    .breakdown-value {
      color: #60a5fa;
    }
  }
}

.breakdown-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;

  svg {
    flex-shrink: 0;
  }
}

[data-bs-theme="dark"] .breakdown-label {
  color: #9ca3af;
}

.breakdown-value {
  color: #111827;
  font-weight: 500;
  text-align: right;
}

[data-bs-theme="dark"] .breakdown-value {
  color: #f3f4f6;
}

.swap-submit-btn {
  width: 100%;
  margin-top: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.loading-content {
  .spinner {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.exchange-info-section {
  position: relative;
  overflow: hidden;
}

.info-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(/media/images/banner/auth-bg.jpg);
    background-size: cover;
    background-position: center;
    opacity: 0.1;
    mix-blend-mode: overlay;
  }
}

.info-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.info-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  margin-bottom: 1.5rem;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

.info-description {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
}

.info-features {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.95);

  svg {
    flex-shrink: 0;
    stroke-width: 2.5px;
  }
}

.swap-preview {
  margin-top: auto;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

[data-bs-theme="dark"] .swap-preview {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.preview-header {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.preview-flow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.preview-item {
  flex: 1;
  text-align: center;
}

.preview-amount {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.preview-network {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}
</style>
