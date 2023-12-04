// Axios
import api from '@/core/services/api'

// Vue
import { ref } from 'vue'

// Pinia
import { defineStore } from 'pinia'

// Store
export const useNotificationStore = defineStore('notification', () => {
  // ----- States -----
  const newPage = ref('')

  // ----- Function -----

  function changePage(payload) {
    newPage.value = payload

    setTimeout(() => {
      newPage.value = ''
    }, 100)
  }

  /**
   * Get Notifications Config
   */

  async function getNotificationsConfig() {
    try {
      const { data } = await api.get('notifications')

      //
      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Update Notifications Configs
   */

  async function updateNotificationsConfig(payload) {
    try {
      await api.put('notifications', payload)

      //
      return true
    } catch (error) {
      return false
    }
  }

  return {
    newPage,

    changePage,
    getNotificationsConfig,
    updateNotificationsConfig
  }
})
