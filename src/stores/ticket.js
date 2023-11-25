// Axios
import api from '@/core/services/api'

// Pinia
import { defineStore } from 'pinia'

// Store
export const useTicketStore = defineStore('ticket', () => {
  // ----- Function -----
  /**
   * Get Ticket List
   * @param {search params} payload
   */
  async function getTicketList(payload) {
    try {
      const { data } = await api.get('tickets', {
        params: payload
      })

      //
      const list = data.data
      const lastPage = data.meta.last_page
      const total = data.meta.items_size

      //
      return { list, lastPage, total }
    } catch (error) {
      return false
    }
  }

  /**
   * Get Ticket Detail
   * @param {ticket id} payload
   */
  async function getTicketDetail(payload) {
    try {
      const { data } = await api.get(`tickets/${payload}`)

      //
      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Reply Ticket
   * @param {ticket id, form} payload
   */
  async function replyTicket(payload) {
    try {
      const { data } = await api.post(`tickets/${payload.id}/reply`, payload.fd)

      //
      return data
    } catch (error) {
      return false
    }
  }

  return {
    getTicketList,
    getTicketDetail,
    replyTicket
  }
})
