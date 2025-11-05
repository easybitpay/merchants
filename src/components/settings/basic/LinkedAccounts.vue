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
  notificationStore.disconnectTelegram().then((res) => {
    if (res) {
      authStore.chengeTelegramChatID(false)
      appendAlert('Telegram disconnected successfully!', {
        color: 'success',
        type: 'alert'
      })
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
  <div class="card mb-6">
    <!-- begin::Header -->
    <div class="card-header">
      <div>
        <h6 class="title">Linked Accounts</h6>
        <p class="desc">Connect your social accounts</p>
      </div>
    </div>
    <!-- end::Head -->

    <!-- begin::Content -->
    <div class="card-body d-flex flex-wrap gap-6">
      <!-- begin::Item -->
      <div class="py-2 ps-4 pe-3 bg-white border  rounded-pill">
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
      <div class="py-2 ps-4 pe-3 bg-white border  rounded-pill">
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
      <div class="py-2 ps-4 pe-3 bg-white border  rounded-pill">
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
