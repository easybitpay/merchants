<script setup>
// Vue
import { computed, ref, onMounted } from 'vue'

// Hooks
import useForm from '@/hooks/useForm.js'

// Components
import SelectColorDropdown from '../globals/SelectColorDropdown.vue'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Emit
const emit = defineEmits(['goNext'])

// ----- START ----- //
const { showFeedBacks } = useForm()

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
  color: {
    required: helpers.withMessage('App color is required', required)
  }
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
    // Set Variable
    const content = { ...form.value, logo: logo.value, banner: banner.value }

    // Emit
    emit('goNext', content)
  } else {
    showFeedBacks()
  }
}

onMounted(() => {
  document.addEventListener('submitStep2', function () {
    submitForm()
  })
})
</script>

<template>
  <div class="modern-step">
    <h3 class="text-gray-900 mb-2 fw-semibold" style="font-size: 1.25rem;">Customize appearance</h3>
    <p class="text-gray-600 mb-6 fs-6">Personalize your payment gateway with your brand</p>

    <form @submit.prevent="submitForm" class="d-flex flex-column gap-5">
      <button type="submit" hidden></button>
      
      <!-- Brand Color -->
      <div>
        <label class="form-label text-gray-700 fw-medium mb-2">Primary color</label>
        <SelectColorDropdown :selected="form.color" @change="toggleColor" />
        <small class="text-gray-500 mt-1 d-block">Used for buttons and accents in your gateway</small>
        <div class="text-danger mt-2 fs-7" v-if="v$.color.$errors.length">
          {{ v$.color.$errors[0].$message }}
        </div>
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
        <small class="text-gray-500 mt-2 d-block">Adjust how transaction fees are split</small>
      </div>
    </form>
  </div>
</template>
