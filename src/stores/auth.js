import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // States
  const user = ref({})


  // Getters


  // Function
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { doubleCount, increment }
})
