// Vue
import { computed, ref, watch } from 'vue'

// Pinia
import { defineStore } from 'pinia'

// Store
export const useThemeStore = defineStore('theme', () => {
  // Refs
  const isDark = ref(false)

  // Computeds
  const theme = computed(() => (isDark.value ? 'dark' : 'light'))

  // ----- Function -----

  const applyTheme = () => {
    document.documentElement.setAttribute('data-bs-theme', theme.value)
  }

  const checkThemeColor = () => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }

    document.documentElement.setAttribute('data-theme', theme.value)
  }

  watch(isDark, () => {
    applyTheme()
    localStorage.setItem('theme', theme.value)
  })

  return {
    isDark,
    theme,
    checkThemeColor
  }
})
