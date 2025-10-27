// Vue
import { ref, computed, watch } from 'vue'

// Pinia
import { defineStore } from 'pinia'

// Store
export const useThemeStore = defineStore('theme', () => {
  // ----- States -----
  const theme = ref('light')

  // ----- Computed -----
  const isDark = computed(() => theme.value === 'dark')

  // ----- Functions -----

  /**
   * Initialize theme from localStorage
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      theme.value = savedTheme
    } else {
      // Default to light mode
      theme.value = 'light'
      localStorage.setItem('theme', 'light')
    }
    applyTheme()
  }

  /**
   * Apply theme to document
   */
  function applyTheme() {
    const htmlElement = document.querySelector('html')
    if (htmlElement) {
      htmlElement.setAttribute('data-bs-theme', theme.value)
    }
  }

  /**
   * Toggle between light and dark mode
   */
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    applyTheme()
  }

  /**
   * Set specific theme
   * @param {string} newTheme - 'light' or 'dark'
   */
  function setTheme(newTheme) {
    if (newTheme === 'light' || newTheme === 'dark') {
      theme.value = newTheme
      localStorage.setItem('theme', newTheme)
      applyTheme()
    }
  }

  // Watch for theme changes
  watch(theme, () => {
    applyTheme()
  })

  return {
    theme,
    isDark,
    initTheme,
    toggleTheme,
    setTheme
  }
})
