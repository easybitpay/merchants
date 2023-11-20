// Axios
import api from '@/core/services/api'

// Vue
import { ref, computed } from 'vue'

// Pinia
import { defineStore } from 'pinia'

// Store
export const useAuthStore = defineStore('auth', () => {
  // ----- States -----
  const user = ref({})
  const lockScreen = ref('')

  // Computeds
  const currentUser = computed(() =>
    Object.keys(user.value).length ? user.value : JSON.parse(localStorage.getItem('user') || '{}')
  )

  const lockScreenStatus = computed(() => {
    const storage = localStorage.getItem('lockScreenStatus')

    if (lockScreen.value) return true
    if (storage) return true

    return false
  })

  // ----- Function -----
  function changeLockScreenStatus(status) {
    if (status) {
      lockScreen.value = 'active'
      localStorage.setItem('lockScreenStatus', 'active')

      document.body.classList.add('overflow-hidden')
    } else {
      lockScreen.value = ''
      localStorage.removeItem('lockScreenStatus')

      document.body.classList.remove('overflow-hidden')
    }
  }

  function logout() {
    user.value = {}

    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('sandbox')
  }

  /**
   * Set User Info
   */
  function setUserInfo(userInfo) {
    // Set User Info
    user.value = userInfo
    localStorage.setItem('user', JSON.stringify(userInfo))

    // Set Token
    if (userInfo.auth_token) {
      localStorage.setItem('token', userInfo.auth_token)
    }
  }

  /**
   * Update User Info
   */
  function setMerchantInfo(userInfo) {
    user.value.merchant = userInfo
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  /**
   * Change 2FA Status
   */
  function changeMerchant2FA(status) {
    user.value.merchant.two_factor_enabled = status
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  /**
   * Login User
   * @param {user form} payload
   */
  async function loginUser(payload) {
    try {
      const { data } = await api.post('auth/login', payload)

      setUserInfo(data)

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Verify Login
   * @param {code, user id} payload
   */
  async function vefiryLogin(payload) {
    try {
      const { data } = await api.post('auth/login-two', payload)

      setUserInfo(data)

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Google Login
   * @param {auth_code} payload
   */
  async function googleLogin(payload) {
    try {
      const { data } = await api.post('auth/google/login', payload)

      setUserInfo(data)

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Register User
   * @param {user form} payload
   */
  async function registerUser(payload) {
    try {
      const { data } = await api.post('merchants/register', payload)

      setUserInfo(data)

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Send Forget Password Email
   * @param {user email} paylaod
   */
  async function sendForgetPasswordEmail(paylaod) {
    try {
      await api.post('auth/recovery', paylaod)

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Reset Password
   * @param {code, passwords} paylaod
   */
  async function resetPassword(paylaod) {
    try {
      await api.patch(`auth/recovery/${paylaod.code}`, {
        password: paylaod.password,
        password_confirmation: paylaod.password_confirmation
      })

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Get Profile Info
   */
  async function getProfile() {
    try {
      const { data } = await api.post('auth/info')

      //
      setUserInfo(data)

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Update Profile
   * @param {profile form} payload
   */
  async function updateProfile(payload) {
    try {
      const { data } = await api.post('merchants', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      //
      setMerchantInfo(data)

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Get 2FA Info
   */
  async function get2FAInfo() {
    try {
      const { data } = await api.get('merchants/enable-2fa')

      //
      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Disable 2FA
   * @param {form} payload
   */
  async function disable2FA(payload) {
    try {
      await api.post('merchants/disable-2fa', payload)

      //
      changeMerchant2FA(0)

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Enable 2FA
   * @param {form} payload
   */
  async function enable2FA(payload) {
    try {
      await api.post('merchants/enable-2fa-verify', payload)

      //
      changeMerchant2FA(1)

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * KYC Document List
   */
  async function KYCList() {
    try {
      const { data } = await api.get('merchant-documents')

      //
      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Send New KYC Document
   * @param {type, file} payload
   */

  async function uploadKYC(payload) {
    try {
      await api.post('merchant-documents', payload, {
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
   * Delete KYC Document
   * @param {id} payload
   */

    async function deleteKYC(payload) {
      try {
        await api.delete(`merchant-documents/${payload}`)
  
        //
        return true
      } catch (error) {
        return false
      }
    }

  return {
    currentUser,
    lockScreenStatus,

    logout,
    loginUser,
    vefiryLogin,
    googleLogin,
    registerUser,
    sendForgetPasswordEmail,
    resetPassword,
    getProfile,
    updateProfile,
    changeLockScreenStatus,
    get2FAInfo,
    disable2FA,
    enable2FA,
    KYCList,
    uploadKYC,
    deleteKYC
  }
})
