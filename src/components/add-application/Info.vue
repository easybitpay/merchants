<script setup>
// Vue
import { computed, ref, onMounted } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useForm from '@/hooks/useForm.js'

// Components
import SelectColorDropdown from '../globals/SelectColorDropdown.vue'

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
    required: false,
    default: () => ({})
  }
})

// Emit
const emit = defineEmits(['goNext', 'changeLoadingStatus'])

// ----- START ----- //
const { showFeedBacks } = useForm()
const store = useAppStore()

// Refs
const logo = ref(null)
const banner = ref(null)

// Update Icon
const hiddenChangeLogoInput = ref(null)
const logoInputClick = () => {
  hiddenChangeLogoInput.value.click()
}

// Update Banner
const hiddenChangeBannerInput = ref(null)
const bannerInputClick = () => {
  hiddenChangeBannerInput.value.click()
}

// Vuelidate
const form = ref({
  customer_fee_percent: 0,
  color: null
})

const rules = {
  // No validation rules - all fields are optional for this step
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Show UplodedItem Preview
 * @param {file} file
 */
const showPreview = (file) => {
  return URL.createObjectURL(file)
}

/**
 * Toggle Color
 * @param {color} color
 */
 const toggleColor = (color) => {
  form.value.color = color
}

/**
 * Add App Icon
 * @param {event} e
 */
const addLogoFile = async (e) => {
  logo.value = e.target.files[0]
}

/**
 * Add App Cover
 * @param {event} e
 */
const addBannerFile = async (e) => {
  banner.value = e.target.files[0]
}

/**
 * Submit Form
 * send data to parent for store
 */
const submitForm = async () => {
  // Validate Form
  const result = await v$.value.$validate()
  if (result) {
    // Check if any customization was provided
    const hasCustomization = form.value.color || logo.value || banner.value || form.value.customer_fee_percent > 0
    
    if (hasCustomization && props.createdAppInfo?.id) {
      // Start Loading
      emit('changeLoadingStatus', true)

      // Update the app with customization data
      const id = props.createdAppInfo.id
      let setting = {}
      if (form.value.color) {
        setting.color = form.value.color
      }
      setting.need_name = props.appInfo.need_name || false
      setting.need_email = props.appInfo.need_email || false
      if (props.appInfo.type?.type == 2 && props.appInfo.amount) {
        setting.amount = props.appInfo.amount
      }

      let fd = new FormData()
      fd.append('settings', JSON.stringify(setting))
      if (form.value.customer_fee_percent > 0) {
        fd.append('customer_fee_percent', form.value.customer_fee_percent)
      }
      
      if (logo.value) {
        fd.append('logo', logo.value)
      }
      if (banner.value) {
        fd.append('banner', banner.value)
      }

      const success = await store.updateApp({ id, fd })
      if (!success) {
        alert('Failed to update application customization. Please check your connection and try again.')
        emit('changeLoadingStatus', false)
        return
      }

      // Stop Loading
      emit('changeLoadingStatus', false)
    }

    // Set Variable
    const content = { ...form.value, logo: logo.value, banner: banner.value }

    // Emit - proceed to next step regardless of whether customization was applied
    emit('goNext', content)
  } else {
    showFeedBacks()
  }
}

onMounted(() => {
  document.addEventListener('submitStep3', function () {
    submitForm()
  })
})
</script>

<template>
  <div class="modern-step">
    <div class="d-flex align-items-center gap-2 mb-2">
      <h3 class="text-gray-900 mb-0 fw-semibold" style="font-size: 1.25rem;">Customize appearance</h3>
      <span class="badge bg-light text-gray-600 px-2 py-1" style="font-size: 0.75rem; font-weight: 500;">Optional</span>
    </div>
    <p class="text-gray-600 mb-6 fs-6">Personalize your payment gateway with your brand colors and logos. You can skip this and customize later from settings.</p>

    <form @submit.prevent="submitForm" class="d-flex flex-column gap-5">
      <button type="submit" hidden></button>
      
      <!-- Brand Color -->
      <div v-if="false">
        <label class="form-label text-gray-700 fw-medium mb-2">Primary color</label>
        <SelectColorDropdown :selected="form.color" @change="toggleColor" />
        <small class="text-gray-500 mt-1 d-block">Used for buttons and accents in your gateway</small>
      </div>

      <!-- Gateway Preview Card -->
      <div>
        <label class="form-label text-gray-700 fw-medium mb-2">Brand assets</label>
        <div
          class="position-relative overflow-hidden rounded"
          style="border: 1px solid #e5e7eb; background-size: cover; background-position: center;"
          :style="`background-image: url(${
            banner ? showPreview(banner) : '/media/images/banner/auth-bg.jpg'
          })`"
        >
          <!-- Overlay -->
          <div style="background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%); padding: 2rem;">
            <!-- Logo -->
            <img
              :src="logo ? showPreview(logo) : '/media/images/banner/default-app.png'"
              class="rounded-1 mb-4"
              width="48"
              style="background: white; padding: 4px;"
            />
            
            <!-- Action Buttons -->
            <div class="d-flex gap-2 mt-5">
              <input
                type="file"
                ref="hiddenChangeLogoInput"
                class="d-none"
                @change="addLogoFile"
                accept="image/*"
              />
              <button 
                type="button" 
                @click="logoInputClick" 
                class="btn btn-sm"
                style="background: rgba(255,255,255,0.95); border: none; font-weight: 500; padding: 0.5rem 1rem;"
              >
                <inline-svg src="media/icons/icons/image.svg" class="me-2" width="14" height="14"></inline-svg>
                {{ logo ? 'Change logo' : 'Upload logo' }}
              </button>

              <input
                type="file"
                ref="hiddenChangeBannerInput"
                class="d-none"
                @change="addBannerFile"
                accept="image/*"
              />
              <button 
                type="button" 
                @click="bannerInputClick" 
                class="btn btn-sm"
                style="background: rgba(255,255,255,0.95); border: none; font-weight: 500; padding: 0.5rem 1rem;"
              >
                <inline-svg src="media/icons/icons/image.svg" class="me-2" width="14" height="14"></inline-svg>
                {{ banner ? 'Change banner' : 'Upload banner' }}
              </button>
            </div>
          </div>
        </div>
        <small class="text-gray-500 mt-2 d-block">Logo: PNG or SVG, max 2MB • Banner: JPG or PNG, 1200x400px recommended</small>
      </div>

      <!-- Fee Sharing -->
      <div>
        <label class="form-label text-gray-700 fw-medium mb-2">Fee distribution</label>
        <div class="p-4 rounded" style="background: #f9fafb; border: 1px solid #e5e7eb;">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <div class="text-gray-800 fw-semibold">Merchant</div>
              <div class="text-gray-600 fs-7">{{ form.customer_fee_percent }}%</div>
            </div>
            <div class="text-end">
              <div class="text-gray-800 fw-semibold">Customer</div>
              <div class="text-gray-600 fs-7">{{ 100 - form.customer_fee_percent }}%</div>
            </div>
          </div>
          
          <input
            type="range"
            class="form-range"
            min="0"
            max="100"
            step="5"
            v-model="form.customer_fee_percent"
            style="cursor: pointer;"
          />
          
          <div class="d-flex justify-content-between mt-2">
            <small class="text-gray-500">You pay all fees</small>
            <small class="text-gray-500">Customer pays all fees</small>
          </div>
        </div>
        <small class="text-gray-500 mt-2 d-block">
          Choose who pays transaction fees. Example: If set to 50%, a $100 payment with 2% fee ($2) splits the fee—you pay $1, customer pays $101.
        </small>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
[data-bs-theme="dark"] {
  .modern-step {
    h3, .text-gray-900 {
      color: #f3f4f6 !important;
    }

    p, .text-gray-600 {
      color: #9ca3af !important;
    }

    .text-gray-700 {
      color: #d1d5db !important;
    }

    .text-gray-800 {
      color: #e5e7eb !important;
    }

    .text-gray-500 {
      color: #9ca3af !important;
    }

    .badge {
      &.bg-light {
        background-color: #2d3233 !important;
        color: #9ca3af !important;
      }
    }

    .form-label {
      color: #e5e7eb !important;
    }

    small {
      color: #9ca3af !important;
    }

    // Override all inline white/light backgrounds
    .p-4.rounded,
    .rounded,
    div[class*="rounded"] {
      &[style*="background"] {
        background: #1a1d1e !important;
        border-color: #2d3233 !important;
      }
    }

    div[style*="border: 1px solid #e5e7eb"] {
      border-color: #2d3233 !important;
    }

    div[style*="background: #f9fafb"] {
      background: #1a1d1e !important;
      border-color: #2d3233 !important;
    }

    button[style*="background: rgba(255,255,255,0.95)"] {
      background: rgba(26, 29, 30, 0.95) !important;
      color: #f3f4f6 !important;
    }

    .form-range {
      &::-webkit-slider-track {
        background: #2d3233;
      }

      &::-webkit-slider-thumb {
        background: #6366f1;
      }

      &::-moz-range-track {
        background: #2d3233;
      }

      &::-moz-range-thumb {
        background: #6366f1;
      }
    }

    img[style*="background: white"] {
      background: #2d3233 !important;
    }
  }
}
</style>
