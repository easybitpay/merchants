<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

// Components
import NotificationConfigLoading from '../../../components/loadings/NotificationConfigLoading.vue'

// ----- START ----- //

// Generals
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Refs
const drivers = ref({})
const events = ref([])
const notifications = ref({})

const loadings = ref({
  list: false,
  update: false
})

// Computeds
const currentUser = computed(() => authStore.currentUser)

const filteredEvents = computed(() => {
  return events.value.filter((item) => item.scope === 'profile')
})

// Functions

/**
 * Disable Switch OF Each Item Condition
 * @param {driver key} driver
 */
const disableSwitchItem = (driver) => {
  if (driver === 'telegram' && !currentUser.value?.merchant?.telegram_chat_id) return true

  return false
}

/**
 * Get Notifications Config
 */
const getNotificationsConfig = async () => {
  // Start Loading
  loadings.value.list = true

  // Request
  await notificationStore.getNotificationsConfig().then((res) => {
    if (res) {
      drivers.value = res.drivers
      events.value = res.events
      const notificationsObject = res.notifications
      let lastNotification = {}

      for (const [key, value] of Object.entries(notificationsObject)) {
        lastNotification[key] = {}
        for (let i = 0; i < value.length; i++) {
          const element = value[i]
          lastNotification[key][element] = true
        }
      }

      const defaultNotifications = {}
      for (let e = 0; e < res.events.length; e++) {
        const event = res.events[e]
        defaultNotifications[event.name] = {}

        for (let d = 0; d < res.drivers.length; d++) {
          const driver = res.drivers[d]
          defaultNotifications[event.name][driver.name] = false
        }
      }

      let newNotificatios = {}
      for (const [key, value] of Object.entries(defaultNotifications)) {
        if (lastNotification[key]) {
          newNotificatios[key] = Object.assign(defaultNotifications[key], lastNotification[key])
        } else {
          newNotificatios[key] = value
        }
      }

      notifications.value = newNotificatios
    }
  })

  // Stop Loading
  loadings.value.list = false
}

/**
 * Update Notification Config
 */
const updateConfig = async () => {
  // Start Loadinh
  loadings.value.update = true

  // Set Variable
  let configs = {}
  for (const [key, value] of Object.entries(notifications.value)) {
    configs[key] = []

    for (const [notifKey, notifVal] of Object.entries(value)) {
      if (notifVal) {
        configs[key].push(notifKey)
      }
    }

    if (!configs[key].length) {
      delete configs[key]
    }
  }

  // Request
  await notificationStore.updateNotificationsConfig(configs)

  // Stop Loading
  loadings.value.update = false
}

onMounted(() => {
  getNotificationsConfig()
})
</script>

<template>
  <div class="premium-settings-page">
    <!-- Page Header -->
    <div class="settings-header">
      <div>
        <h1 class="settings-title">Notification Preferences</h1>
        <p class="settings-subtitle">Manage how you receive notifications</p>
      </div>
    </div>

    <!-- Notification Settings Card -->
    <div class="settings-card">
      <div v-if="loadings.list" class="notification-loading">
        <NotificationConfigLoading v-for="item in 2" :key="item" />
      </div>

      <div v-else class="notification-table">
        <!-- Table Header -->
        <div class="notification-header">
          <div class="activity-column">Activity</div>
          <div class="channels-columns">
            <div v-for="(driver, index) in drivers" :key="index" class="channel-header">
              <svg v-if="driver.name === 'email'" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M.05 3.555A2 2 0 012 2h12a2 2 0 011.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 002 14h12a2 2 0 001.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/>
              </svg>
              <svg v-else-if="driver.name === 'telegram'" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M16 8A8 8 0 110 8a8 8 0 0116 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 01-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 00-.013-.315.337.337 0 00-.114-.217.526.526 0 00-.31-.093c-.3.005-.763.166-2.984 1.09z"/>
              </svg>
              <span>{{ driver.label }}</span>
            </div>
          </div>
        </div>

        <!-- Table Rows -->
        <div class="notification-rows">
          <div v-for="(event, index) in filteredEvents" :key="index" class="notification-row">
            <div class="activity-cell">
              <div class="activity-icon">
                <svg v-if="event.name === 'new_login'" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M7 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3 12s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H3z"/>
                </svg>
                <svg v-else-if="event.name.includes('two_factor')" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="3" y="6" width="8" height="6" rx="1" stroke="currentColor" stroke-width="1.2" fill="none"/>
                  <path d="M5 6V4a2 2 0 114 0v2" stroke="currentColor" stroke-width="1.2" fill="none"/>
                </svg>
                <svg v-else-if="event.name === 'profile_updated'" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M9.854 3.854a.5.5 0 000-.708l-2-2a.5.5 0 00-.708 0l-2 2a.5.5 0 10.708.708L7 2.707V8.5a.5.5 0 001 0V2.707l1.146 1.147a.5.5 0 00.708 0z"/>
                  <path d="M2 6.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5z"/>
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/>
                  <path d="M5 7l1.5 1.5L9.5 5" stroke="currentColor" stroke-width="1.2" fill="none"/>
                </svg>
              </div>
              <span>{{ event.label }}</span>
            </div>
            <div class="channels-cells">
              <div v-for="(driver, i) in drivers" :key="i" class="channel-cell">
                <label class="toggle-switch" :class="{ disabled: disableSwitchItem(driver.name) }">
                  <input
                    type="checkbox"
                    :disabled="disableSwitchItem(driver.name)"
                    v-model="notifications[event.name][driver.name]"
                    @change="updateConfig"
                  />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Telegram Connection Notice -->
      <div v-if="!currentUser?.merchant?.telegram_chat_id" class="telegram-notice">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
        </svg>
        <div>
          <div class="notice-title">Connect Telegram for notifications</div>
          <div class="notice-subtitle">Link your Telegram account to receive notifications via Telegram</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-settings-page {
  max-width: 100%;
  width: 100%;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.settings-header {
  margin-bottom: 2rem;
}

.settings-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.settings-subtitle {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
}

.settings-card {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #d1d5db;
  }
}

.notification-loading {
  padding: 2rem;
}

.notification-table {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.notification-header {
  display: flex;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-radius: 0.5rem 0.5rem 0 0;
  border-bottom: 1.5px solid #e5e7eb;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.activity-column {
  flex: 1;
  min-width: 200px;
}

.channels-columns {
  display: flex;
  gap: 1rem;
  min-width: 200px;
  
  @media (max-width: 640px) {
    gap: 0.5rem;
  }
}

.channel-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  flex: 1;
  min-width: 80px;
  
  @media (max-width: 640px) {
    span {
      display: none;
    }
  }
}

.notification-rows {
  display: flex;
  flex-direction: column;
}

.notification-row {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }
}

.activity-cell {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9375rem;
  color: #111827;
  font-weight: 500;
}

.activity-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 0.5rem;
  color: #6366f1;
  flex-shrink: 0;
}

.channels-cells {
  display: flex;
  gap: 1rem;
  min-width: 200px;
  
  @media (max-width: 640px) {
    gap: 0.5rem;
  }
}

.channel-cell {
  flex: 1;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: pointer;

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .toggle-slider {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);

      &:before {
        transform: translateX(20px);
      }
    }

    &:disabled + .toggle-slider {
      cursor: not-allowed;
    }
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #d1d5db;
    transition: 0.3s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
  }
}

.telegram-notice {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  margin-top: 1rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  color: #1e40af;

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
}

.notice-title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 0.125rem;
}

.notice-subtitle {
  font-size: 0.8125rem;
  color: #3b82f6;
}

// ===== DARK MODE STYLES =====
[data-bs-theme="dark"] {
  .settings-title {
    color: #f3f4f6;
  }

  .settings-subtitle {
    color: #9ca3af;
  }

  .settings-card {
    background: #1a1d1e;
    border-color: #2d3233;

    &:hover {
      border-color: #374151;
    }
  }

  .notification-header {
    background: #0f1011;
    border-bottom-color: #2d3233;
    color: #9ca3af;
  }

  .notification-row {
    border-bottom-color: #2d3233;

    &:hover {
      background: #0f1011;
    }
  }

  .activity-cell {
    color: #f3f4f6;
  }

  .activity-icon {
    background: #0f1011;
    color: #a5b4fc;
  }

  .telegram-notice {
    background: #1e3a8a;
    border-color: #1e40af;
    color: #bfdbfe;
  }

  .notice-title {
    color: #bfdbfe;
  }

  .notice-subtitle {
    color: #93c5fd;
  }
}
</style>
