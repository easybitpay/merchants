// Axios
import api from '@/core/services/api'

// Vue
import { computed, ref } from 'vue'

// Router
import router from '../router/index'

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

  const partnerListKey = ref(0)

  const selectedWithdrawItem = ref({})

  const sandBoxStatus = computed(() => JSON.parse(localStorage.getItem('sandbox') || 'false'))

  // ----- Function -----

  /**
   * Set Selected App
   */
  function setSelectedApp(appId) {
    const filteredApp = appList.value.filter((item) => item.id == appId)
    selectedApp.value = filteredApp[0]
  }

  /**
   * Add New App
   */
  function addNewApp(appInfo) {
    appList.value.push(appInfo)
  }

  /**
   * Update App Info
   */
  function updataAppInfo(appInfo) {
    const elementPos = appList.value
      .map(function (x) {
        return x.id
      })
      .indexOf(appInfo.id)

    appList.value[elementPos] = appInfo

    setSelectedApp(appInfo.id)
  }

  /**
   * Update App Sstatus
   */
  function updataAppStatus(appId) {
    for (let i = 0; i < appList.value.length; i++) {
      const element = appList.value[i]

      if (element.id == appId) {
        let currentStatus = appList.value[i].status
        appList.value[i].status = currentStatus == 1 ? 0 : 1

        selectedApp(appId)
        break
      }
    }
  }

  /**
   * Set Sandbox Status
   */
  function setSandBoxStatus(data) {
    localStorage.setItem('sandbox', JSON.stringify(data))

    router.push({ name: 'dashboard' })
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  /**
   * Set Selected Withdraw Item
   */
  function setSelectedWithdrawItem(withdrawItem) {
    selectedWithdrawItem.value = withdrawItem
  }

  /**
   * Change Partner refresh key
   * for update partners list
   */
  function refreshPartnersList() {
    partnerListKey.value++
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
   * Get Shared App Holders
   * @param {app id} payload
   */
  async function getAppShareHolders(payload) {
    try {
      const { data } = await api.get('app/get-app-share-holders', {
        params: {
          appId: payload
        }
      })

      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Update Shared App
   * @param {search params} payload
   */
  async function updateSharedApp(payload) {
    try {
      const { data } = await api.get('app/update-shared-app', {
        params: payload
      })

      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Delete App Share Holder
   */
  async function deleteAppShareHolder(payload) {
    try {
      await api.get('app/delete-shared-app', {
        params: payload
      })

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
      const { data } = await api.post(`apps/${payload.id}`, payload.fd, {
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
   * Change Gateway Status
   * @param {app id} payload
   */
  async function changeGatewayStatus(payload) {
    try {
      const { data } = await api.get(`apps/${payload}/toggle-status`)

      //
      updataAppStatus(data.app.id)

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Create App
   * @param {fd} payload
   */
  async function createApp(payload) {
    try {
      const { data } = await api.post('apps', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      //
      addNewApp(data)

      //
      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Verify App Domain
   * @param {app merchant id} payload
   */
  async function verifyAppDomain(payload) {
    try {
      await api.get(`apps/${payload}/domain`)

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Revoke Secret
   * @param {app id , {code}} payload
   */
  async function revokeSecret(payload) {
    try {
      const { data } = await api.post(`apps/${payload.app_id}/revoke`, payload.content)

      //
      const private_key = data.private_key

      //
      return private_key
    } catch (error) {
      return false
    }
  }

  /**
   * Create Custom Invoice
   * @param {form} payload
   */
  async function createCustomInvoice(payload) {
    try {
      const { data } = await api.post('invoices/custom', payload)

      //
      return data
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

  /**
   * Get Balance List
   * @param {app id} payload
   */
  async function getAppTokenBalance(payload) {
    try {
      const { data } = await api.get(`apps-balances/${payload}`)
      //

      return data.tokens
    } catch (error) {
      return false
    }
  }

  /**
   * Get Balance List
   * @param {app id, {page, perPage}} payload
   */
  async function getAppBalanceChart(payload) {
    try {
      const { data } = await api.get(`apps-balances/chart/${payload.id}`, {
        params: payload.params
      })
      //

      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Get Minimum Withdraw Amount
   * @param {token id} payload
   */
  async function getMinimumWithdrawAmount(payload) {
    try {
      const { data } = await api.get(`withdrawals/${payload}/min`)

      //
      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Withdraw Request
   * @param {content: {wallet_address} , params: {appId, tokenId}} payload
   */
  async function requestWithdraw(payload) {
    try {
      const { data } = await api.post('withdraws/create', payload.content, {
        params: payload.params
      })

      //
      setSelectedWithdrawItem(data)

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Withdraw Resend Email
   * @param {id} payload
   */
  async function withdrawResendEmail(payload) {
    try {
      await api.get(`withdrawals/${payload}/resend-confirmation`)

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Confirm Withdarw
   * @param {id , content: {email_code , two_factor_code}} payload
   */
  async function confirmWithdraw(payload) {
    try {
      await api.post(`withdrawals/${payload.id}/confirm`, payload.content)

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Confirm Withdarw
   * @param {id} payload
   */
  async function cancelWithdraw(payload) {
    try {
      let { data } = await api.post(`withdrawals/${payload}/cancel`)

      //
      return data.result
    } catch (error) {
      return false
    }
  }

  /**
   * Get Withdraw List
   * @param {page} payload
   */
  async function getAppWithdraws(payload) {
    try {
      const { data } = await api.get('withdraws/index', {
        params: payload
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

  /**
   * Get FAQ List
   */
  async function getFAQList() {
    try {
      const { data } = await api.get('faq/list')

      //
      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Get Custom Tokens List
   */
  async function getCustomTokensList(payload) {
    try {
      const { data } = await api.get('tokens/list-custom', {
        params: payload
      })

      //
      const list = data.data
      const lastPage = data.meta.last_page

      //
      return { list, lastPage }
    } catch (error) {
      return false
    }
  }

  /**
   * Get Contract Info
   * @param {network_id, contract} payload
   */
  async function getContractInfo(payload) {
    try {
      const { data } = await api.post('tokens/fetch-custom', payload)

      //
      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Create Custom Token
   * @param {app_id, {contract_address, network_id, price, logo}} payload
   */
  async function createCustomToken(payload) {
    try {
      await api.post(`tokens/create-custom/${payload.app_id}`, payload.fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Update Custom Token
   * @param {app_id, id, fd} payload
   */
  async function updateCustomToken(payload) {
    try {
      const { data } = await api.post(
        `tokens/update-custom/${payload.app_id}/${payload.id}`,
        payload.fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      //
      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Get App Themes
   * @param {app id} payload
   */
  async function getAppThemes(payload) {
    try {
      const { data } = await api.get(`apps/${payload}/themes`)

      //
      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Get Transactions History
   * @param {from date, to date} payload
   */
  async function getTransactiosnHistory(payload) {
    try {
      const { data } = await api.post('charts/transactions-history', payload)

      //
      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Get Invoices List
   */
  async function getInvoices(payload) {
    try {
      const { data } = await api.get('merchants/latest-invoices', {
        params: payload
      })
      //

      //
      const list = data.data
      const lastPage = data.meta.last_page

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
    sandBoxStatus,
    selectedWithdrawItem,
    partnerListKey,

    getShareAppStatuses,
    getAppShareHolders,
    deleteAppShareHolder,
    updateSharedApp,
    refreshPartnersList,
    getTokens,
    getAppTokens,
    getNetworks,
    getAppList,
    setSelectedApp,
    updateApp,
    changeGatewayStatus,
    createApp,
    verifyAppDomain,
    revokeSecret,
    createCustomInvoice,
    getAppInvoices,
    getAppTokenBalance,
    getAppBalanceChart,
    setSandBoxStatus,
    getMinimumWithdrawAmount,
    requestWithdraw,
    setSelectedWithdrawItem,
    withdrawResendEmail,
    confirmWithdraw,
    cancelWithdraw,
    getAppWithdraws,
    getFAQList,
    getCustomTokensList,
    createCustomToken,
    updateCustomToken,
    getContractInfo,
    getAppThemes,
    getTransactiosnHistory,
    getInvoices
  }
})
