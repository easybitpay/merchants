// Axios
import api from '@/core/services/api'

// Pinia
import { defineStore } from 'pinia'

// Store
export const useSwapStore = defineStore('swap', () => {
  // ----- Function -----

  /**
   * Get Swap Tokens
   */
  async function getSwapTokens() {
    try {
      const { data } = await api.get('swap/details')

      //
      let networks = []
      let tokens = {}

      for (let i = 0; i < data.result.length; i++) {
        const element = data.result[i]
        if (element.swap_contract) {
          networks.push({
            id: element.id,
            name: element.name,
            status: element.status,
            nick_name: element.nick_name,
            swap_contract: element.swap_contract,
            weth: element.weth
          })
  
          tokens[element.nick_name] = {
            featuredTokens: element.featuredTokens,
            tokens: element.tokens
          }
        }
      }

      return { networks, tokens }
    } catch (error) {
      return false
    }
  }

  return {
    getSwapTokens
  }
})
