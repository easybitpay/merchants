<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Hook
import useIconImage from '@/hooks/useIconImage'

// Store
import { useAppStore } from '@/stores/app'

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
const emit = defineEmits(['goNext', 'changeLoadingStatus'])

// ----- START ----- //

// Generals
const store = useAppStore()
const { iconImage, storageImage } = useIconImage()

// Refs
const copySuccess = ref(false)
const copySecretSuccess = ref(false)

// Functions

/**
 * Copy to Clipboard
 */
const copyToClipboard = async (text, type = 'api') => {
  try {
    await navigator.clipboard.writeText(text)
    if (type === 'api') {
      copySuccess.value = true
      setTimeout(() => copySuccess.value = false, 2000)
    } else {
      copySecretSuccess.value = true
      setTimeout(() => copySecretSuccess.value = false, 2000)
    }
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

/**
 * Download Verification File
 */
const downloadVerificationFile = () => {
  const apiKey = props.createdAppInfo.api_key
  if (!apiKey) {
    alert('API key not found. Please go back and complete the previous steps.')
    return
  }

  const content = apiKey
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'verification.txt'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Show UplodedItem Preview
 * @param {file} file
 */
const showPreview = (file) => {
  return URL.createObjectURL(file)
}

/**
 * Submit Form
 * Just proceed to next step (domain verification)
 */
const submitForm = async () => {
  // Simply proceed to domain verification step
  emit('goNext', {})
}

onMounted(() => {
  document.addEventListener('submitStep4', function () {
    submitForm()
  })
})
</script>

<template>
  <div class="modern-step">
    <h3 class="text-gray-900 mb-2 fw-semibold" style="font-size: 1.25rem;">Review your configuration</h3>
    <p class="text-gray-600 mb-6 fs-6">Check all details before proceeding to domain verification</p>

    <div class="d-flex flex-column gap-4">
      <!-- Gateway Preview -->
      <div
        class="position-relative overflow-hidden rounded"
        style="border: 1px solid #e5e7eb; background-size: cover; background-position: center; height: 140px;"
        :style="`background-image: url(${
          appInfo.banner ? showPreview(appInfo.banner) : '/media/images/banner/auth-bg.jpg'
        })`"
      >
        <div style="background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%); height: 100%; display: flex; align-items: flex-end; padding: 1.5rem;">
          <div class="d-flex align-items-center gap-3">
            <img
              :src="appInfo.logo ? showPreview(appInfo.logo) : '/media/images/banner/default-app.png'"
              class="rounded"
              width="48"
              style="background: white; padding: 4px;"
            />
            <div>
              <div class="text-white-50 fs-7 mb-1">{{ appInfo?.type?.title }}</div>
              <div class="text-white fw-semibold fs-5">{{ appInfo.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuration Summary -->
      <div class="d-flex flex-column gap-3">
        <!-- General Settings -->
        <div class="p-4 rounded" style="background: #f9fafb; border: 1px solid #e5e7eb;">
          <h6 class="text-gray-800 fw-semibold mb-3 fs-6">General</h6>
          <div class="d-flex flex-column gap-2">
            <div class="d-flex justify-content-between">
              <span class="text-gray-600 fs-7">Website</span>
              <span class="text-gray-900 fs-7 fw-medium text-end" style="max-width: 60%; word-break: break-all;">{{ appInfo.site_url }}</span>
            </div>
          </div>
        </div>

        <!-- Integration Settings -->
        <div class="p-4 rounded" style="background: #f9fafb; border: 1px solid #e5e7eb;">
          <h6 class="text-gray-800 fw-semibold mb-3 fs-6">Integration</h6>
          <div class="d-flex flex-column gap-2">
            <div class="d-flex justify-content-between">
              <span class="text-gray-600 fs-7">Callback URL</span>
              <span class="text-gray-900 fs-7 fw-medium text-end" style="max-width: 60%; word-break: break-all;">{{ appInfo.callback_url }}</span>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-gray-600 fs-7">Redirect URL</span>
              <span class="text-gray-900 fs-7 fw-medium text-end" style="max-width: 60%; word-break: break-all;">{{ appInfo.redirect_url }}</span>
            </div>
          </div>
        </div>

        <!-- Credentials (if created) -->
        <div v-if="createdAppInfo.api_key || createdAppInfo.pay_url" class="p-4 rounded" style="background: #f0fdf4; border: 1px solid #bbf7d0;">
          <h6 class="text-green-800 fw-semibold mb-3 fs-6">
            <inline-svg src="media/icons/icons/check-circle.svg" width="16" height="16" class="me-2"></inline-svg>
            Credentials ready
          </h6>
          <div class="d-flex flex-column gap-3">
            <div class="d-flex flex-column gap-1">
              <span class="text-gray-600 fs-7">{{ appInfo?.type?.type == 1 ? 'API Key' : 'Payment Link' }}</span>
              <div class="d-flex gap-2">
                <code class="bg-white p-2 rounded fs-7 text-gray-900 flex-grow-1" style="border: 1px solid #e5e7eb; word-break: break-all;">
                  {{ appInfo?.type?.type == 1 ? createdAppInfo.api_key : createdAppInfo.pay_url }}
                </code>
                <button
                  type="button"
                  class="btn btn-sm btn-light-primary"
                  @click="copyToClipboard(appInfo?.type?.type == 1 ? createdAppInfo.api_key : createdAppInfo.pay_url, 'api')"
                  style="white-space: nowrap;"
                >
                  <inline-svg v-if="!copySuccess" src="media/icons/icons/copy.svg" width="14" height="14"></inline-svg>
                  <inline-svg v-else src="media/icons/icons/check.svg" width="14" height="14"></inline-svg>
                  {{ copySuccess ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>
            <div v-if="appInfo?.type?.type == 1 && createdAppInfo.private_key" class="d-flex flex-column gap-1">
              <span class="text-gray-600 fs-7">Secret Key</span>
              <div class="d-flex gap-2">
                <code class="bg-white p-2 rounded fs-7 text-gray-900 flex-grow-1" style="border: 1px solid #e5e7eb; word-break: break-all;">
                  {{ createdAppInfo.private_key }}
                </code>
                <button
                  type="button"
                  class="btn btn-sm btn-light-primary"
                  @click="copyToClipboard(createdAppInfo.private_key, 'secret')"
                  style="white-space: nowrap;"
                >
                  <inline-svg v-if="!copySecretSuccess" src="media/icons/icons/copy.svg" width="14" height="14"></inline-svg>
                  <inline-svg v-else src="media/icons/icons/check.svg" width="14" height="14"></inline-svg>
                  {{ copySecretSuccess ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>
          </div>
          <small class="text-gray-600 d-block mt-3 fs-7">
            <inline-svg src="media/icons/icons/info-circle.svg" width="14" height="14" class="me-1"></inline-svg>
            Save these credentials securely. You'll need them for domain verification in the next step.
          </small>
        </div>

        <!-- Cryptocurrency Settings -->
        <div class="p-4 rounded" style="background: #f9fafb; border: 1px solid #e5e7eb;">
          <h6 class="text-gray-800 fw-semibold mb-3 fs-6">Cryptocurrencies</h6>
          <div class="d-flex flex-column gap-3">
            <div v-if="appInfo.baseCoin">
              <span class="text-gray-600 fs-7 d-block mb-2">Base currency</span>
              <div class="d-flex align-items-center gap-2">
                <img
                  :src="
                    appInfo?.baseCoin?.logo
                      ? storageImage(appInfo?.baseCoin?.logo, 32)
                      : iconImage(appInfo?.baseCoin?.symbol)
                  "
                  :alt="appInfo?.baseCoin?.name"
                  width="24"
                  height="24"
                  class="rounded-circle"
                />
                <span class="text-gray-900 fw-medium fs-7">{{ appInfo?.baseCoin?.name }}</span>
              </div>
            </div>
            <div v-if="appInfo.availableCoins">
              <span class="text-gray-600 fs-7 d-block mb-2">Accepted currencies</span>
              <div class="d-flex gap-2 flex-wrap">
                <div 
                  v-for="(item, index) in appInfo.availableCoins"
                  :key="index"
                  class="d-flex align-items-center gap-2 px-2 py-1 rounded"
                  style="background: white; border: 1px solid #e5e7eb;"
                >
                  <img
                    :src="item.logo ? storageImage(item.logo, 32) : iconImage(item.symbol)"
                    :alt="item?.name"
                    width="20"
                    height="20"
                    class="rounded-circle"
                  />
                  <span class="text-gray-900 fs-7">{{ item?.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

    h6 {
      color: #e5e7eb !important;
    }

    .text-gray-800 {
      color: #e5e7eb !important;
    }

    .text-gray-700 {
      color: #d1d5db !important;
    }

    .text-gray-500 {
      color: #9ca3af !important;
    }

    .text-green-800 {
      color: #86efac !important;
    }

    .text-blue-800 {
      color: #93c5fd !important;
    }

    .text-white-50 {
      color: rgba(255, 255, 255, 0.7) !important;
    }

    // Override all inline backgrounds
    .p-4.rounded,
    .rounded,
    div[class*="rounded"],
    div[class*="p-"] {
      &[style*="background"] {
        background: #1a1d1e !important;
        border-color: #2d3233 !important;
      }
    }

    div[style*="background: #f0fdf4"] {
      background: #064e3b !important;
      border-color: #065f46 !important;
    }

    div[style*="border: 1px solid #e5e7eb"] {
      border-color: #2d3233 !important;
    }

    div[style*="background: #f9fafb"] {
      background: #1a1d1e !important;
      border-color: #2d3233 !important;
    }

    div[style*="background: #eff6ff"] {
      background: #1e3a8a !important;
      border-color: #1e40af !important;
    }

    code {
      background: #0f1011 !important;
      border-color: #2d3233 !important;
      color: #f3f4f6 !important;
    }

    div[style*="background: white; border: 1px solid #e5e7eb"],
    div[style*="background: white"] {
      background: #0f1011 !important;
      border-color: #2d3233 !important;
    }

    .alert-info {
      background: #1e3a8a !important;
      border-color: #1e40af !important;
      color: #bfdbfe !important;
    }

    .rounded-circle.bg-primary {
      background: #3b82f6 !important;
    }

    img[style*="background: white"] {
      background: #2d3233 !important;
    }
  }
}
</style>
