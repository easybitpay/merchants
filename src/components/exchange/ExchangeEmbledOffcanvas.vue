<script setup>
// Vue
import { ref, computed, onMounted } from 'vue'

// Prism
import Prism from 'prismjs'

// Store
import { useAuthStore } from '@/stores/auth'

// ----- START ----- //
const authStore = useAuthStore()

// Widget Configuration
const widgetConfig = ref({
  width: '600',
  height: '700',
  theme: 'light',
  borderRadius: '12',
  defaultSendToken: '',
  defaultReceiveToken: ''
})

// Get user's API key or merchant ID for tracking
const merchantId = computed(() => authStore.user?.merchant_id || 'YOUR_MERCHANT_ID')

// Generate the embed code based on configuration
const embedCode = computed(() => {
  const { width, height, theme, borderRadius } = widgetConfig.value
  const baseUrl = window.location.origin
  
  // Build query parameters
  const params = new URLSearchParams({
    merchant: merchantId.value,
    theme: theme
  })
  
  if (widgetConfig.value.defaultSendToken) {
    params.set('sendToken', widgetConfig.value.defaultSendToken)
  }
  
  if (widgetConfig.value.defaultReceiveToken) {
    params.set('receiveToken', widgetConfig.value.defaultReceiveToken)
  }

  return `<iframe 
  width="${width}" 
  height="${height}" 
  src="${baseUrl}/#/exchange?${params.toString()}"
  title="Crypto Exchange Widget"
  frameborder="0"
  style="border-radius: ${borderRadius}px; border: 1px solid #e5e7eb;"
  allow="clipboard-write"
  loading="lazy">
</iframe>`
})

// Copy to clipboard
const copied = ref(false)
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(embedCode.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

onMounted(() => {
  setTimeout(() => {
    Prism.highlightAll()
  }, 100)
})
</script>

<template>
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="exchangeEmbed_offcanvas"
    aria-labelledby="offcanvasExchangeEmbed"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <!-- begin::Content Card -->
      <div class="card border-0 mb-4">
        <div class="card-body pb-lg-22">
          <!-- begin::Header -->
          <div class="d-flex gap-4">
            <div>
              <div class="svg-holder">
                <inline-svg
                  :src="`/media/icons/shapes/${$filters.shapeStatus('embed')}.svg`"
                  width="39"
                  height="34"
                ></inline-svg>
              </div>
            </div>

            <div class="mb-10">
              <h3 class="mb-0 text-gray-900">Exchange Widget Embed</h3>

              <p class="fs-7 mb-0 text-gray-800 ls-base">Integrate exchange widget into your website</p>
            </div>
          </div>
          <!-- end::Header -->

                    <!-- begin::Content -->
          <div>
            <!-- begin::Widget Configuration -->
            <div class="mb-4">
              <h5 class="fs-6 text-gray-900 mb-3 fw-semibold">Widget Configuration</h5>
              
              <div class="row g-3 mb-4">
                <!-- Width -->
                <div class="col-6">
                  <label class="form-label fs-7 text-gray-700">Width (px)</label>
                  <input 
                    type="number" 
                    class="form-control form-control-sm" 
                    v-model="widgetConfig.width"
                    min="300"
                    max="1200"
                  />
                </div>
                
                <!-- Height -->
                <div class="col-6">
                  <label class="form-label fs-7 text-gray-700">Height (px)</label>
                  <input 
                    type="number" 
                    class="form-control form-control-sm" 
                    v-model="widgetConfig.height"
                    min="400"
                    max="1000"
                  />
                </div>
                
                <!-- Theme -->
                <div class="col-6">
                  <label class="form-label fs-7 text-gray-700">Theme</label>
                  <select class="form-select form-select-sm" v-model="widgetConfig.theme">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                
                <!-- Border Radius -->
                <div class="col-6">
                  <label class="form-label fs-7 text-gray-700">Border Radius (px)</label>
                  <input 
                    type="number" 
                    class="form-control form-control-sm" 
                    v-model="widgetConfig.borderRadius"
                    min="0"
                    max="24"
                  />
                </div>
              </div>
            </div>

            <!-- begin::Steps -->
            <div class="mb-4">
              <h5 class="fs-6 text-gray-900 mb-3 fw-semibold">Integration Steps</h5>
              <div class="d-flex flex-column gap-2">
                <div class="d-flex align-items-start gap-2">
                  <span class="badge bg-primary">1</span>
                  <span class="fs-7 text-gray-800">Customize the widget configuration above</span>
                </div>
                <div class="d-flex align-items-start gap-2">
                  <span class="badge bg-primary">2</span>
                  <span class="fs-7 text-gray-800">Copy the embed code below</span>
                </div>
                <div class="d-flex align-items-start gap-2">
                  <span class="badge bg-primary">3</span>
                  <span class="fs-7 text-gray-800">Paste the code into your website's HTML</span>
                </div>
                <div class="d-flex align-items-start gap-2">
                  <span class="badge bg-primary">4</span>
                  <span class="fs-7 text-gray-800">The widget will appear on your site with exchange functionality</span>
                </div>
              </div>
            </div>

            <!-- begin::Embed Code -->
            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="fs-6 text-gray-900 mb-0 fw-semibold">Embed Code</h5>
                <span class="badge bg-light-success text-success" v-if="copied">
                  <inline-svg src="media/icons/icons/check.svg" width="14" height="14"></inline-svg>
                  Copied!
                </span>
              </div>
              <pre class="language-markup" style="max-height: 300px; overflow: auto;"><code>{{ embedCode }}</code></pre>
            </div>

            <!-- begin::Preview Note -->
            <div class="alert alert-light-info d-flex align-items-center p-3">
              <inline-svg src="media/icons/icons/info.svg" width="20" height="20" class="me-2"></inline-svg>
              <span class="fs-7 text-gray-700">
                <strong>Note:</strong> The widget will inherit your exchange settings and available tokens. 
                Make sure to test the integration in your development environment first.
              </span>
            </div>
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
              Need help integrating? Check our 
              <RouterLink :to="{ name: 'help-knowledge' }" class="text-primary fw-semibold">
                documentation
              </RouterLink>
              for detailed guides.
            </p>

            <!-- begin::Actions -->
            <div class="d-flex gap-4 w-100 w-sm-initial">
              <button
                type="button"
                class="btn btn-sm btn-primary w-100 w-sm-initial h-24px ls-base fw-normal"
                @click="copyToClipboard"
              >
                <inline-svg 
                  v-if="!copied"
                  src="media/icons/icons/copy.svg" 
                  width="14" 
                  height="14" 
                  class="me-1"
                ></inline-svg>
                <inline-svg 
                  v-else
                  src="media/icons/icons/check.svg" 
                  width="14" 
                  height="14" 
                  class="me-1"
                ></inline-svg>
                {{ copied ? 'Copied!' : 'Copy Code' }}
              </button>
            </div>
            <!-- end::Actions -->
          </div>
        </div>
      </div>
      <!-- end::Action Card -->
    </div>
  </div>
</template>
