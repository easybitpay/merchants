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

  /**
   * Get Telegram Connect Code
   */
  async function getTelegramConnectCode() {
    try {
      const { data } = await api.get('notifications/telegram/connect')

      //
      const code = data.code

      //
      return code
    } catch (error) {
      return false
    }
  }

  /**
   * Get Telegram Connect Code
   */
  async function checkTelegramStatus() {
    try {
      const { data } = await api.get('notifications/telegram/status')

      //
      const code = data.connected

      //
      return code
    } catch (error) {
      return false
    }
  }

  /**
   * Disconnect Telegram
   */
  async function disconnectTelegram() {
    try {
      const { data } = await api.get('notifications/telegram/disconnect')

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
    updateNotificationsConfig,
    getTelegramConnectCode,
    checkTelegramStatus,
    disconnectTelegram
  }
})
