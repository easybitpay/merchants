<script setup>
// Vue
import { computed, onMounted } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

// Bootstrap
import { Tooltip } from 'bootstrap'

// Componenets
import ConnectTeleramOffcanvas from './ConnectTeleramOffcanvas.vue'

// ----- START ----- //

// Generals
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Computeds
const currentUser = computed(() => authStore.currentUser)

// Functions

/**
 * Disconnect Telegram Account
 */
const disconnectTelegram = async () => {
  notificationStore.disconnectTelegram().then(res => {
    if (res) {
      authStore.chengeTelegramChatID(false)
      appendAlert('Telegram disconnected successfully!', 'success')
    }
  })
}

onMounted(() => {
  new Tooltip(document.body, {
    selector: "[data-bs-html='true']"
  })
})
</script>

<template>
  <!-- begin::Linked Accounts -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Linked Account</h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-wrap gap-6">
      <!-- begin::Item -->
      <div class="py-2 ps-4 pe-3 bg-white border border-gray-200 rounded-pill">
        <!-- begin::Logo -->
        <inline-svg src="media/icons/companies/google-logo.svg" class="me-7"></inline-svg>
        <!-- end::Logo -->

        <!-- begin::Action -->
        <inline-svg
          src="media/icons/icons/trash.svg"
          width="20"
          class="svg-icon-gray-700 cursor-pointer"
        ></inline-svg>
        <!-- end::Action -->
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="py-2 ps-4 pe-3 bg-white border border-gray-200 rounded-pill">
        <!-- begin::Logo -->
        <inline-svg src="media/icons/companies/facebook-logo.svg" class="me-7"></inline-svg>
        <!-- end::Logo -->

        <!-- begin::Action -->
        <inline-svg
          src="media/icons/icons/link.svg"
          width="20"
          class="svg-icon-primary cursor-pointer"
        ></inline-svg>
        <!-- end::Action -->
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="py-2 ps-4 pe-3 bg-white border border-gray-200 rounded-pill">
        <!-- begin::Logo -->
        <inline-svg
          src="media/icons/companies/telegram-logo.svg"
          :class="[{ 'me-7': true }, { 'gray-icon': !currentUser?.merchant?.telegram_chat_id }]"
        ></inline-svg>
        <!-- end::Logo -->

        <!-- begin::Action -->
        <inline-svg
          v-if="!currentUser?.merchant?.telegram_chat_id"
          src="media/icons/icons/link.svg"
          width="20"
          class="svg-icon-primary cursor-pointer"
          data-bs-toggle="offcanvas"
          data-bs-target="#connectTelegram_offcanvas"
          aria-controls="connectTelegram_offcanvas"
        ></inline-svg>

        <inline-svg
          v-else
          @click="disconnectTelegram"
          src="media/icons/icons/trash.svg"
          width="20"
          class="svg-icon-gray-700 svg-icon-hover-danger cursor-pointer"
        ></inline-svg>
        <!-- end::Action -->
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Linked Accounts -->

  <ConnectTeleramOffcanvas />
</template>
