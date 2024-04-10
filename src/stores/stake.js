// Axios
import api from '@/core/services/api'

// Pinia
import { defineStore } from 'pinia'

// Store
export const useStakeStore = defineStore('stake', () => {
  // ----- Function -----

  /**
   * Get Stake Tokens
   */
  async function getStakeTokens() {
    try {
      const { data } = await api.get('stake/details')

      //
      let list = []

      for (let i = 0; i < data.result.length; i++) {
        const element = data.result[i];
        list.push({
          ...element.token,
          stake_contract_address: element.stake_contract_address
        })
      }

      return list
    } catch (error) {
      return false
    }
  }

  return {
    getStakeTokens
  }
})
