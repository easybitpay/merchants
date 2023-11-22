// Axios
import api from '@/core/services/api'

// Vue
import { ref } from 'vue'

// Pinia
import { defineStore } from 'pinia'

// Store
export const useAppStore = defineStore('app', () => {
  // ----- States -----
  const shareAppStatus = ref([])

  const appList = ref([])
  const appLoading = ref(false)

  const selectedApp = ref({})

  const tokens = ref([])
  const distinctTokens = ref([])
  const networks = ref([])

  // ----- Function -----

  function setSelectedApp(appId) {
    const filteredApp = appList.value.filter((item) => item.id == appId)
    selectedApp.value = filteredApp[0]
  }

  function updataAppInfo(appInfo) {
    const elementPos = appList.value.map(function(x) {return x.id; }).indexOf(appInfo.id);
    appList.value[elementPos] = appInfo;

    setSelectedApp(appInfo.id)
  }

  /**
   * Get Share App Status
   */
  async function getShareAppStatuses() {
    try {
      const { data } = await api.get('app/get-share-available-stats')

      //
      shareAppStatus.value = data

      return true
    } catch (error) {
      return false
    }
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

  /**
   * Update App
   * @param {id, fd} payload
   */
  async function updateApp(payload) {
    try {
      const {data} = await api.post(`apps/${payload.id}`, payload.fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      //
      updataAppInfo(data)

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Get App Invoices
   * @param {app id & search params} payload
   */
  async function getAppInvoices(payload) {
    try {
      const { data } = await api.get(`apps/${payload.id}/invoices`, {
        params: payload.params
      })

      //
      const list = data.list
      const lastPage = data.totalPages

      //
      return { list, lastPage }
    } catch (error) {
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

    getShareAppStatuses,
    getTokens,
    getAppTokens,
    getNetworks,
    getAppList,
    setSelectedApp,
    updateApp,
    getAppInvoices
  }
})
