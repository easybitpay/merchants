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

      for (let i = 0; i < data.result.coins.length; i++) {
        const coins = data.result.coins[i]
        for (let i = 0; i < coins.providers.length; i++) {
          const element = coins.providers[i]
          list.push({
            ...element.token,
            contract_version: element.contract_version,
            contract_id: element.id,
            contract_name: element.name,
            status: element.status,
            stake_contract_address: element.stake_contract_address
          })
        }
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
