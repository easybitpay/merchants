// Axios
import api from '@/core/services/api'

// Pinia
import { defineStore } from 'pinia'

// Store
export const useTicketStore = defineStore('ticket', () => {
  // ----- Function -----

  /**
   * Get Ticket Departments
   */
  async function getTicketDepartments() {
    try {
      const { data } = await api.get('tickets/departments')

      //
      return data
    } catch (error) {
      return false
    }
  }

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
      const { data } = await api.post(`tickets/${payload.id}/reply`, payload.fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      //
      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Create New Ticket
   * @param {form} payload
   */
  async function createNewTicket(payload) {
    try {
      const { data } = await api.post('tickets', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      //
      return data
    } catch (error) {
      return false
    }
  }

  /**
   * Close Ticket
   * @param {ticket id} payload
   */
  async function closeTicket(payload) {
    try {
      await api.get(`tickets/${payload}/close`)

      //
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Set Ticket Reaction
   * @param {ticket id, {score}} payload
   */
  async function setTicketReaction(payload) {
    try {
      await api.post(`tickets/${payload.id}/reaction`, payload.content)

      //
      return true
    } catch (error) {
      return false
    }
  }

  return {
    getTicketDepartments,
    getTicketList,
    getTicketDetail,
    replyTicket,
    createNewTicket,
    closeTicket,
    setTicketReaction
  }
})
