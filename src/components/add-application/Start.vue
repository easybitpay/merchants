<script setup>
import { onMounted, ref, computed } from 'vue'

// Emit
const emit = defineEmits(['goNext'])

// ----- START ----- //
const types = [
  {
    type: 1,
    title: 'Standard Gateway',
    subject: 'Best for online shops & e-commerce',
    description: 'Accept cryptocurrency payments with full API integration'
  },
  {
    type: 2,
    title: 'Donate',
    subject: 'Best for donations & fundraising',
    description: 'Fixed amount donations with simple links'
  },
  {
    type: 3,
    title: 'Fix Prices',
    subject: 'Best for fixed price products',
    description: 'Set specific prices for products or services'
  }
]

const term = ref(false)
const selectedType = ref({})
const showTermsModal = ref(false)
const showErrors = ref(false)

// Form
const form = ref({
  name: '',
  site_url: ''
})

// Validation
const errors = computed(() => {
  return {
    type: showErrors.value && !selectedType.value.type,
    name: showErrors.value && !form.value.name,
    site_url: showErrors.value && !form.value.site_url,
    term: showErrors.value && !term.value
  }
})

// Functions

/**
 * Accept Terms
 */
const acceptTerms = () => {
  term.value = true
  showTermsModal.value = false
}

/**
 * Convert Type To Icon
 */
const convertTypeToIcon = (type) => {
  if (type == 1) return 'screen'
  if (type == 2) return 'weather'
  if (type == 3) return 'camera-2'
}

/**
 * Submit Form
 * send data to parent for store
 */
const submitForm = async () => {
  showErrors.value = true
  
  // Validate
  if (!selectedType.value.type) {
    return
  }
  if (!form.value.name) {
    return
  }
  if (!form.value.site_url) {
    return
  }
  if (!term.value) {
    return
  }
  
  const content = {
    agree: term.value,
    type: selectedType.value,
    name: form.value.name,
    site_url: form.value.site_url
  }
  emit('goNext', content)
}

onMounted(() => {
  document.addEventListener('submitStep0', function () {
    submitForm()
  })
})
</script>

<template>
  <div class="premium-step">
    <div class="question-header">
      <h2 class="question-title">Let's create your payment gateway</h2>
      <p class="question-subtitle">Answer a few quick questions and we'll have you set up in minutes.</p>
    </div>

    <!-- Gateway Type Selection -->
    <div class="question-block">
      <label class="question-label">What type of gateway do you need?</label>
      <div class="premium-options">
        <label 
          v-for="(item, index) in types"
          :key="index"
          class="premium-option"
          :class="{ 'selected': selectedType.type === item.type }"
        >
          <input
            type="radio"
            name="gatewayType"
            :value="item"
            v-model="selectedType"
            class="d-none"
          />
          <div class="option-check">
            <svg v-if="selectedType.type === item.type" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="option-icon-circle">
            <i class="bi" :class="`bi-${convertTypeToIcon(item.type)}`"></i>
          </div>
          <div class="option-text">
            <div class="option-title">{{ item.title }}</div>
            <div class="option-desc">{{ item.description }}</div>
          </div>
        </label>
      </div>
      <div v-if="errors.type" class="input-error">
        <i class="bi bi-exclamation-circle me-1"></i>
        Please select a gateway type
      </div>
    </div>

    <!-- Application Name -->
    <div class="question-block">
      <label for="appName" class="question-label">What's the name of your application?</label>
      <input
        type="text"
        class="premium-input"
        :class="{ 'error': errors.name }"
        id="appName"
        v-model="form.name"
        placeholder="e.g., My Online Store"
      />
      <div v-if="errors.name" class="input-error">
        <i class="bi bi-exclamation-circle me-1"></i>
        App name is required
      </div>
    </div>

    <!-- Website URL -->
    <div class="question-block">
      <label for="siteUrl" class="question-label">Where is your website hosted?</label>
      <div class="input-with-icon">
        <i class="bi bi-globe input-icon"></i>
        <input
          type="url"
          class="premium-input with-icon"
          :class="{ 'error': errors.site_url }"
          id="siteUrl"
          v-model="form.site_url"
          placeholder="https://example.com"
        />
      </div>
      <div v-if="errors.site_url" class="input-error">
        <i class="bi bi-exclamation-circle me-1"></i>
        Site URL is required
      </div>
    </div>

    <!-- Terms Checkbox -->
    <div class="question-block">
      <label class="premium-checkbox">
        <input
          type="checkbox"
          v-model="term"
        />
        <span class="checkbox-mark"></span>
        <span class="checkbox-label">
          I agree to the
          <a href="#" @click.prevent="showTermsModal = true" class="text-link">Terms & Conditions</a>
        </span>
      </label>
      <div v-if="errors.term" class="input-error">
        <i class="bi bi-exclamation-circle me-1"></i>
        You must agree to the terms
      </div>
    </div>

    <!-- Terms Modal -->
    <Teleport to="body">
      <div v-if="showTermsModal" class="premium-modal-overlay" @click="showTermsModal = false">
        <div class="premium-modal" @click.stop>
          <div class="modal-header-premium">
            <h3>Terms & Conditions</h3>
            <button class="modal-close" @click="showTermsModal = false">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body-premium">
            <p>Welcome to Easybitpay! We provide a cryptocurrency payment gateway service that allows merchants to accept various cryptocurrencies, including Bitcoin, Ethereum, Tether, and Tron.</p>
            
            <h6>Acceptance of Terms</h6>
            <p>By accessing and using our payment gateway, you acknowledge and agree to these Terms of Service and our Privacy Policy.</p>
            
            <h6>Account Registration</h6>
            <p>To use our payment gateway, you must register for an account. Ensure that all information you provide is accurate and up to date.</p>
            
            <h6>Fees and Payments</h6>
            <p>Our fee structure is based on KYC verification level and selected payment network. Default fees are 1% + $1 per transaction.</p>
          </div>
          <div class="modal-footer-premium">
            <button class="btn-secondary-premium" @click="showTermsModal = false">Close</button>
            <button class="btn-primary-premium" @click="acceptTerms">Accept & Continue</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
