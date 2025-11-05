<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

// ----- START ----- //

// Generals
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Refs
const loading = ref(false)
const telegramCode = ref('')

// Computeds
const telegramLink = import.meta.env.VITE_APP_TELEGRAM_LINK

// Functions

/**
 * Get Telegram Code
 */
const getTelegramCode = async () => {
  await notificationStore.getTelegramConnectCode().then((res) => {
    telegramCode.value = res
  })
}

const checkTelegramConnect = async () => {
  // Start Loading
  loading.value = true

  // Request
  await notificationStore.checkTelegramStatus().then((res) => {
    if (res) {
      appendAlert('Telegram connected successfully!', {
        color: 'success',
        type: 'alert'
      })
      authStore.chengeTelegramChatID(true)
      closeOffcanvas()
    }
  })

  // Stop Loading
  loading.value = false
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('connectTelegram_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Set Default Values
 */
const setDefaultValues = () => {
  telegramCode.value = ''
}

const copy = (text) => {
  navigator.clipboard.writeText(text)
  appendAlert('Copied to clipboard', {
    color: 'success',
    type: 'alert'
  })
}

onMounted(() => {
  const myOffcanvas = document.getElementById('connectTelegram_offcanvas')

  /**
   * Offcanvas Fire On Show
   */
  myOffcanvas.addEventListener('shown.bs.offcanvas', () => {
    getTelegramCode()
  })

  /**
   * Offcanvas Fire On Hide
   */
  myOffcanvas.addEventListener('hidden.bs.offcanvas', () => {
    setDefaultValues()
  })
})
</script>

<template>
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="connectTelegram_offcanvas"
    aria-labelledby="offcanvasConnectTelegram"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <!-- begin::Content Card -->
      <div class="card border-0 mb-4 min-h-354px">
        <div class="card-body pb-lg-22">
          <!-- begin::Header -->
          <div class="d-flex gap-4">
            <div>
              <div class="svg-holder">
                <inline-svg
                  :src="`/media/icons/shapes/${$filters.shapeStatus('chat')}.svg`"
                ></inline-svg>
              </div>
            </div>

            <div class="mb-10">
              <h3 class="mb-0 text-dark">Connect Telegram</h3>

              <p class="fs-7 mb-0 text-gray-800 ls-base">
                Connect your Telegram account for receive notifications
              </p>
            </div>
          </div>
          <!-- end::Header -->

          <!-- begin::Content -->
          <div>
            <div class="d-flex align-items-center mb-3">
              <div
                class="w-50px h-50px bg-blue-100 me-5 rounded-1 d-flex align-items-center justify-content-center"
              >
                <h1 class="mb-0">1</h1>
              </div>
              <div>
                <h5 class="mb-0">Join Easybitpay Bot</h5>
                <span class="fs-9">
                  Use Connect Button Or
                  <span
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-html="true"
                    data-bs-offset="0,20"
                    class="text-primary cursor-pointer"
                    @click="copy('@easybitpaybot')"
                    :data-bs-title="`
                    <div>
                        <div class='w-168px h-168px'>
                            <img src='https://api.qrserver.com/v1/create-qr-code/?size=165x165&data=${telegramLink}'/>
                        </div>
                    </div>
                  `"
                  >
                    @easybitpaybot
                  </span>
                  Telegram ID
                </span>
              </div>
            </div>

            <a
              :href="telegramLink"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary bg-blue-100 border-blue-100 text-primary w-100 mb-3"
            >
              Join To Easybitpay Bot
            </a>

            <div class="d-flex align-items-center mb-3">
              <div
                class="w-50px h-50px bg-blue-100 me-5 rounded-1 d-flex align-items-center justify-content-center"
              >
                <h1 class="mb-0">2</h1>
              </div>
              <div>
                <h5 class="mb-0">Send Code & Verify</h5>
                <span class="fs-9"> Send code to bot for verify your account </span>
              </div>
            </div>

            <button class="btn btn-primary w-100" @click="copy(telegramCode)">
              {{ telegramCode }}
            </button>
          </div>
          <!-- end::Content -->
        </div>
      </div>
      <!-- end::Content Card -->

      <!-- begin::Action Card -->
      <div class="d-flex gap-4">
        <div class="d-none d-md-flex">
          <div
            class="w-56px h-56px d-flex align-items-center justify-content-center rounded-1 bg-white"
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
            <p class="offcanvas-action-text">
              Latest clicks/conversions. Are you sure?
            </p>

            <!-- begin::Actions -->
            <div class="d-flex gap-4 w-100 w-sm-initial">
              <button
                type="button"
                class="btn btn-sm btn-light w-100 w-sm-104px h-24px ls-base fw-normal"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                Cancel
              </button>

              <button
                :disabled="loading"
                @click="checkTelegramConnect"
                class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base fw-normal"
              >
                {{ loading ? 'Loading...' : 'Check' }}
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
