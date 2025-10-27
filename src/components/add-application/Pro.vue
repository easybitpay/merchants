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

// Vuelidate
const generalForm = ref({
  callback_url: '',
  redirect_url: '',
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
  }
}

const amountRules = {
  amount: {
    required: helpers.withMessage('Amount is required', required)
  }
}

const vGeneral$ = useVuelidate(generalRules, generalForm)
const vAmount$ = useVuelidate(amountRules, amountForm)

/**
 * Submit Form
 * send data to parent for store
 */
const submitForm = async () => {
  // Validate Form
  const generalResult = await vGeneral$.value.$validate()
  let amountResult = true

  if (props?.appInfo?.type?.type == 2) {
    amountResult = await vAmount$.value.$validate()
  }

  if (generalResult && amountResult) {
    // Pass data to next step (Step 3 - Currency Selection)
    const content = {
      ...generalForm.value,
      ...amountForm.value
    }
    emit('goNext', content)
  } else {
    showFeedBacks()
  }
}

onMounted(async () => {
  document.addEventListener('submitStep1', function () {
    submitForm()
  })
})
</script>

<template>
  <div class="modern-step">
    <h3 class="text-gray-900 mb-2 fw-semibold" style="font-size: 1.25rem;">Integration setup</h3>
    <p class="text-gray-600 mb-6 fs-6">Configure webhooks and payment preferences</p>

    <form @submit.prevent="submitForm" class="d-flex flex-column gap-5">
      <button type="submit" hidden></button>
      
      <!-- URLs Section -->
      <div>
        <h6 class="text-gray-800 fw-semibold mb-3">Webhook endpoints</h6>
        <p class="text-gray-600 mb-4 fs-7">We'll send payment notifications to these URLs</p>
        <div class="d-flex flex-column gap-4">
          <div>
            <label for="callback-url" class="form-label text-gray-700 fw-medium mb-2">
              Callback URL
              <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              id="callback-url"
              class="form-control form-control-modern"
              placeholder="https://mystore.com/webhooks/callback"
              v-model="generalForm.callback_url"
            />
            <small class="text-gray-500 mt-1 d-block">Receive real-time payment status updates</small>
            <div class="text-danger mt-2 fs-7" v-if="vGeneral$.callback_url.$errors.length">
              {{ vGeneral$.callback_url.$errors[0].$message }}
            </div>
          </div>

          <div>
            <label for="redirect-url" class="form-label text-gray-700 fw-medium mb-2">
              Success redirect URL
              <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              id="redirect-url"
              class="form-control form-control-modern"
              placeholder="https://mystore.com/payment/success"
              v-model="generalForm.redirect_url"
            />
            <small class="text-gray-500 mt-1 d-block">Where customers return after successful payment</small>
            <div class="text-danger mt-2 fs-7" v-if="vGeneral$.redirect_url.$errors.length">
              {{ vGeneral$.redirect_url.$errors[0].$message }}
            </div>
          </div>

          <div v-if="appInfo?.type?.type == 2">
            <label for="amount" class="form-label text-gray-700 fw-medium mb-2">
              Fixed amount
              <span class="text-danger">*</span>
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

      <!-- Customer Information -->
      <div>
        <h6 class="text-gray-800 fw-semibold mb-3">Customer information</h6>
        <p class="text-gray-600 mb-4 fs-7">Choose what information to collect from customers</p>
        <div class="d-flex flex-column gap-3">
          <label class="custom-checkbox-container">
            <input type="checkbox" v-model="generalForm.need_name" />
            <span class="checkmark"></span>
            <span class="checkbox-label">
              <span class="checkbox-title">Request customer name</span>
              <span class="checkbox-desc">Collect full name during checkout</span>
            </span>
          </label>
          
          <label class="custom-checkbox-container">
            <input type="checkbox" v-model="generalForm.need_email" />
            <span class="checkmark"></span>
            <span class="checkbox-label">
              <span class="checkbox-title">Request email address</span>
              <span class="checkbox-desc">Send payment receipts and updates</span>
            </span>
          </label>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.custom-checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }

  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;

    &:checked ~ .checkmark {
      background-color: #6366f1;
      border-color: #6366f1;

      &:after {
        display: block;
      }
    }
  }

  .checkmark {
    width: 20px;
    height: 20px;
    background-color: white;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    flex-shrink: 0;
    position: relative;
    transition: all 0.2s;
    margin-top: 0.125rem;

    &:after {
      content: "";
      position: absolute;
      display: none;
      left: 5px;
      top: 1px;
      width: 6px;
      height: 11px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  .checkbox-label {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .checkbox-title {
      font-size: 0.9375rem;
      font-weight: 500;
      color: #111827;
    }

    .checkbox-desc {
      font-size: 0.8125rem;
      color: #6b7280;
      line-height: 1.4;
    }
  }
}

.question-helper {
  font-size: 0.875rem;
  color: #6b7280;
  margin: -0.25rem 0 0.75rem 0;
  line-height: 1.5;
}

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

  .custom-checkbox-container {
    border-color: #2d3233;
    background: #1a1d1e;

    &:hover {
      border-color: #374151;
      background: #0f1011;
    }

    .checkmark {
      background-color: #0f1011;
      border-color: #4b5563;
    }

    .checkbox-label {
      .checkbox-title {
        color: #f3f4f6;
      }

      .checkbox-desc {
        color: #9ca3af;
      }
    }
  }

  .question-helper {
    color: #9ca3af;
  }
}
</style>
