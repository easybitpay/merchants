// Axios
import api from '@/core/services/api'

// Vue
import { ref } from 'vue'

// Pinia
import { defineStore } from 'pinia'

// Store
export const useAppStore = defineStore('app', () => {
  // ----- States -----
  const appList = ref([])
  const appLoading = ref(false)

  const selectedApp = ref({})

  const tokens = ref([])
  const distinctTokens = ref([])
  const networks = ref([])
  const shareAppStatus = ref([])

  // ----- Function -----

  function setSelectedApp(appId) {
    const filteredApp = appList.value.filter((item) => item.id == appId)
    selectedApp.value = filteredApp[0]
  }

  /**
   * Get Tokens
   */
  async function getTokens() {
    try {
      const { data } = await api.get('tokens')

      //
      tokens.value = data

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Get App Tokens
   * @param {app id} payload
   */
  async function getAppTokens(payload) {
    try {
      const { data } = await api.get(`tokens/${payload}`)

      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Get Networks
   */
  async function getNetworks() {
    try {
      const { data } = await api.get('networks')

      //
      networks.value = data

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Get App List
   */
  async function getAppList() {
    try {
      appLoading.value = true

      //
      const { data } = await api.get('merchants/apps')

      //
      appList.value = data
      appLoading.value = false

      //
      return data
    } catch (error) {
      appLoading.value = false
      return false
    }
  }

  return {
    appList,
    appLoading,
    selectedApp,
    tokens,
    distinctTokens,
    networks,
    shareAppStatus,

    getTokens,
    getAppTokens,
    getNetworks,
    getAppList,
    setSelectedApp
  }
})
