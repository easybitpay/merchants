<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

// Components
import PageHeader from '../../../components/globals/PageHeader.vue'

// ----- START ----- //

// Generals
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Refs
const drivers = ref({})
const events = ref([])
const notifications = ref({})

const loadings = ref({
  list: true,
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
  <PageHeader
    title="Notification Preferences"
    description="Manage your personal information and preferences"
  />

  <div class="card">
    <div class="card-body">
      <div class="table-responsive">
        <table class="table simple-table align-middle notification-table">
          <thead>
            <tr>
              <th>Activity</th>

              <th class="w-100px text-center" v-for="(driver, index) in drivers" :key="index">
                {{ driver.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loadings.list">
              <tr v-for="item in 2" :key="item">
                <td><Skeletor class="rounded-0 w-200px" /></td>
              </tr>
            </template>

            <template v-else>
              <tr v-for="(event, index) in filteredEvents" :key="index">
                <td>{{ event.label }}</td>
                <td v-for="(driver, i) in drivers" :key="i">
                  <div class="d-flex justify-content-center">
                    <div class="form-check form-switch form-switch-lg p-0">
                      <input
                        class="form-check-input m-0"
                        type="checkbox"
                        role="switch"
                        :disabled="disableSwitchItem(driver)"
                        v-model="notifications[event.name][driver.name]"
                        @change="updateConfig"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
