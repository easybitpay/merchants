<script setup>
// Vue
import { onMounted, ref } from 'vue'

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

// Refs
const copySuccess = ref(false)

// Functions

/**
 * Copy to Clipboard
 */
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    copySuccess.value = true
    setTimeout(() => copySuccess.value = false, 2000)
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
  link.download = 'easybitpay-domain-verification.txt'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Submit Form - Verify Domain
 */
const submitForm = async () => {
  let id = props.createdAppInfo.id
  if (!id) {
    alert('Error: Application ID not found. Please go back and complete the previous steps.')
    return
  }

  // Start Loading
  emit('changeLoadingStatus', true)

  // Request
  const success = await store.verifyAppDomain(id)
  if (success) {
    emit('goNext', {})
  } else {
    alert('Domain verification failed. Please ensure the verification file is accessible at your domain root and try again.')
  }

  // Stop Loading
  emit('changeLoadingStatus', false)
}

onMounted(() => {
  document.addEventListener('submitStep5', function () {
    submitForm()
  })
})
</script>

<template>
  <div class="modern-step">
    <h3 class="text-gray-900 mb-2 fw-semibold" style="font-size: 1.25rem;">Verify your domain</h3>
    <p class="text-gray-600 mb-6 fs-6">Complete domain verification to activate your payment gateway</p>

    <div class="d-flex flex-column gap-4">
      <!-- Domain Verification Instructions -->
      <div class="p-4 rounded" style="background: #eff6ff; border: 1px solid #bfdbfe;">
        <h6 class="text-blue-800 fw-semibold mb-3 fs-6">
          <inline-svg src="media/icons/icons/shield-check.svg" width="16" height="16" class="me-2"></inline-svg>
          Verification steps
        </h6>
        <p class="text-gray-600 fs-7 mb-4">Follow these steps to verify domain ownership:</p>
        
        <div class="d-flex flex-column gap-4">
          <!-- Step 1 -->
          <div class="d-flex align-items-start gap-3">
            <div class="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-semibold" style="width: 32px; height: 32px; font-size: 0.875rem;">1</div>
            <div class="flex-grow-1">
              <div class="text-gray-900 fw-semibold fs-6 mb-2">Download verification file</div>
              <p class="text-gray-600 fs-7 mb-2">Click the button below to download the verification file containing your API key.</p>
              <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="downloadVerificationFile"
              >
                <inline-svg src="media/icons/icons/download.svg" width="14" height="14" class="me-1"></inline-svg>
                Download easybitpay-domain-verification.txt
              </button>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="d-flex align-items-start gap-3">
            <div class="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-semibold" style="width: 32px; height: 32px; font-size: 0.875rem;">2</div>
            <div class="flex-grow-1">
              <div class="text-gray-900 fw-semibold fs-6 mb-2">Upload to .well-known directory</div>
              <p class="text-gray-600 fs-7 mb-2">Place the downloaded file in the .well-known directory of your website. The file must be accessible at:</p>
              <div class="d-flex gap-2 align-items-center">
                <code class="flex-grow-1 bg-white p-3 rounded fs-7 text-gray-900" style="border: 1px solid #e5e7eb; word-break: break-all;">
                  {{ appInfo.site_url }}/.well-known/easybitpay-domain-verification.txt
                </code>
                <button
                  type="button"
                  class="btn btn-sm btn-light-primary"
                  @click="copyToClipboard(`${appInfo.site_url}/.well-known/easybitpay-domain-verification.txt`)"
                  style="white-space: nowrap;"
                >
                  <inline-svg v-if="!copySuccess" src="media/icons/icons/copy.svg" width="14" height="14"></inline-svg>
                  <inline-svg v-else src="media/icons/icons/check.svg" width="14" height="14"></inline-svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="d-flex align-items-start gap-3">
            <div class="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-semibold" style="width: 32px; height: 32px; font-size: 0.875rem;">3</div>
            <div class="flex-grow-1">
              <div class="text-gray-900 fw-semibold fs-6 mb-2">Verify accessibility</div>
              <p class="text-gray-600 fs-7 mb-2">Test that the file is publicly accessible by visiting the URL in your browser. It should display your API key.</p>
              <a 
                :href="`${appInfo.site_url}/.well-known/easybitpay-domain-verification.txt`" 
                target="_blank"
                class="btn btn-light btn-sm"
              >
                <inline-svg src="media/icons/icons/external-link.svg" width="14" height="14" class="me-1"></inline-svg>
                Test verification URL
              </a>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="d-flex align-items-start gap-3">
            <div class="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-semibold" style="width: 32px; height: 32px; font-size: 0.875rem;">4</div>
            <div class="flex-grow-1">
              <div class="text-gray-900 fw-semibold fs-6 mb-2">Complete verification</div>
              <p class="text-gray-600 fs-7">Once the file is accessible, click "Verify & Launch" below to complete the setup.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Help Information -->
      <div class="alert alert-info d-flex align-items-start gap-2 mb-0" style="font-size: 0.813rem; padding: 0.75rem;">
        <inline-svg src="media/icons/icons/info-circle.svg" width="16" height="16" class="flex-shrink-0 mt-1"></inline-svg>
        <div>
          <strong>Troubleshooting:</strong> Make sure your web server is configured to serve .txt files from the .well-known directory. If you're using a static site host, you may need to add the file to your deployment. For WordPress sites, place it in the public_html/.well-known directory.
        </div>
      </div>

      <!-- Current Domain Info -->
      <div class="p-4 rounded" style="background: #f9fafb; border: 1px solid #e5e7eb;">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="text-gray-600 fs-7 mb-1">Domain to verify</div>
            <div class="text-gray-900 fw-semibold">{{ appInfo.site_url }}</div>
          </div>
          <div class="badge bg-light text-gray-700 px-3 py-2">
            <inline-svg src="media/icons/icons/clock.svg" width="14" height="14" class="me-1"></inline-svg>
            Pending verification
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

    .text-blue-800 {
      color: #93c5fd !important;
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

    div[style*="background: #eff6ff"] {
      background: #1e3a8a !important;
      border-color: #1e40af !important;
    }

    div[style*="border: 1px solid #e5e7eb"] {
      border-color: #2d3233 !important;
    }

    div[style*="background: #f9fafb"] {
      background: #1a1d1e !important;
      border-color: #2d3233 !important;
    }

    code {
      background: #0f1011 !important;
      border-color: #2d3233 !important;
      color: #f3f4f6 !important;
    }

    .alert-info {
      background: #1e3a8a !important;
      border-color: #1e40af !important;
      color: #bfdbfe !important;
      
      strong {
        color: #e0e7ff !important;
      }
    }

    .rounded-circle.bg-primary {
      background: #3b82f6 !important;
    }

    .badge {
      &.bg-light {
        background-color: #2d3233 !important;
        color: #e5e7eb !important;
      }
    }
  }
}
</style>
