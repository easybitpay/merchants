<script setup>
// Vue
import { computed } from 'vue'

// Store
import { useThemeStore } from '@/stores/theme'

// ----- START ----- //

const themeStore = useThemeStore()

// Computed
const currentTheme = computed(() => themeStore.theme)
const themeLabel = computed(() => {
  return currentTheme.value === 'dark' ? 'Dark mode' : 'Light mode'
})

// Functions
const setTheme = (theme) => {
  themeStore.setTheme(theme)
}
</script>

<template>
  <!-- begin::Theme -->
  <div>
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1">Theme</h4>

    <div class="d-flex align-items-center justify-content-between flex-wrap gap-6">
      <p class="mb-0">
        Choose your preferred theme - Light or Dark mode
      </p>

      <div class="dropdown">
        <button
          class="btn btn-sm dropdown-toggle w-250px justify-content-between border"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          data-bs-offset="0,0"
        >
          <span>{{ themeLabel }}</span>
        </button>
        <ul class="dropdown-menu sm-triangle w-100">
          <li>
            <a 
              class="dropdown-item d-flex align-items-center justify-content-between"
              :class="{ 'active': currentTheme === 'light' }"
              @click="setTheme('light')"
              style="cursor: pointer;"
            >
              <span>Light mode</span>
              <i v-if="currentTheme === 'light'" class="fas fa-check"></i>
            </a>
          </li>
          <li>
            <a 
              class="dropdown-item d-flex align-items-center justify-content-between"
              :class="{ 'active': currentTheme === 'dark' }"
              @click="setTheme('dark')"
              style="cursor: pointer;"
            >
              <span>Dark mode</span>
              <i v-if="currentTheme === 'dark'" class="fas fa-check"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- end::Title -->
  </div>
  <!-- end::Theme -->
</template>
