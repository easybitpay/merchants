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
  <!-- Linked Accounts Card -->
  <div class="settings-card">
    <div class="card-header">
      <div>
        <h2 class="card-title">Linked Accounts</h2>
        <p class="card-description">Connect your social accounts</p>
      </div>
    </div>

    <div class="linked-accounts-grid">
      <!-- Google Account -->
      <div class="account-card account-connected">
        <div class="account-info">
          <div class="account-icon google-icon">
            <inline-svg src="media/icons/companies/google-logo.svg"></inline-svg>
          </div>
          <div class="account-details">
            <div class="account-name">Google</div>
            <div class="account-status connected">Connected</div>
          </div>
        </div>
        <button class="btn-disconnect">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Facebook Account -->
      <div class="account-card account-disconnected">
        <div class="account-info">
          <div class="account-icon facebook-icon">
            <inline-svg src="media/icons/companies/facebook-logo.svg"></inline-svg>
          </div>
          <div class="account-details">
            <div class="account-name">Facebook</div>
            <div class="account-status disconnected">Not connected</div>
          </div>
        </div>
        <button class="btn-connect">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Connect
        </button>
      </div>

      <!-- Telegram Account -->
      <div :class="['account-card', currentUser?.merchant?.telegram_chat_id ? 'account-connected' : 'account-disconnected']">
        <div class="account-info">
          <div class="account-icon telegram-icon">
            <inline-svg
              src="media/icons/companies/telegram-logo.svg"
              :class="{ 'gray-icon': !currentUser?.merchant?.telegram_chat_id }"
            ></inline-svg>
          </div>
          <div class="account-details">
            <div class="account-name">Telegram</div>
            <div :class="['account-status', currentUser?.merchant?.telegram_chat_id ? 'connected' : 'disconnected']">
              {{ currentUser?.merchant?.telegram_chat_id ? 'Connected' : 'Not connected' }}
            </div>
          </div>
        </div>
        <button
          v-if="!currentUser?.merchant?.telegram_chat_id"
          class="btn-connect"
          data-bs-toggle="offcanvas"
          data-bs-target="#connectTelegram_offcanvas"
          aria-controls="connectTelegram_offcanvas"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Connect
        </button>
        <button v-else class="btn-disconnect" @click="disconnectTelegram">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <ConnectTeleramOffcanvas />
</template>

<style scoped lang="scss">
.settings-card {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: border-color 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  &:hover {
    border-color: #d1d5db;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.card-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.linked-accounts-grid {
  display: grid;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.account-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  transition: all 0.15s ease;
  gap: 1rem;

  &.account-connected {
    background: #f0fdf4;
    border-color: #86efac;
  }

  &.account-disconnected {
    background: #fafafa;
    border-color: #e5e7eb;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
}

.account-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.account-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  flex-shrink: 0;

  &.google-icon {
    background: white;
    border: 1px solid #e5e7eb;
  }

  &.facebook-icon {
    background: white;
    border: 1px solid #e5e7eb;
  }

  &.telegram-icon {
    background: white;
    border: 1px solid #e5e7eb;
  }

  :deep(svg) {
    width: 24px;
    height: 24px;
  }

  :deep(.gray-icon svg) {
    opacity: 0.4;
  }
}

.account-details {
  flex: 1;
  min-width: 0;
}

.account-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.125rem;
}

.account-status {
  font-size: 0.8125rem;
  font-weight: 500;

  &.connected {
    color: #059669;
  }

  &.disconnected {
    color: #6b7280;
  }
}

.btn-connect {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }
}

.btn-disconnect {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: #fef2f2;
    border-color: #fca5a5;
    color: #dc2626;
  }
}
</style>
