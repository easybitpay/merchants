// Axios
// import api from '@/core/services/api'

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

  return {
    newPage,

    changePage
  }
})
