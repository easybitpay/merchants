<script setup>
// Store
import { useThemeStore } from '@/stores/theme'

// Components
import PageHeader from '../../../components/globals/PageHeader.vue'

// ----- START ----- //

// Generals
const themeStore = useThemeStore()
</script>

<template>
  <div>
    <PageHeader title="Theme" description="Choose your preferred theme" />

    <!-- begin::Theme -->
    <div class="dropdown w-100 mw-400px">
      <button
        class="btn dropdown-toggle w-100"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-offset="0,0"
      >
        {{ $filters.capitalize(themeStore.theme) }} mode
      </button>
      <ul class="dropdown-menu triangle w-100">
        <li @click="themeStore.isDark = true">
          <a :class="[{ 'dropdown-item': true }, { active: themeStore.theme === 'dark' }]">
            Dark mode
          </a>
        </li>
        <li @click="themeStore.isDark = false">
          <a :class="[{ 'dropdown-item': true }, { active: themeStore.theme === 'light' }]">
            Light mode
          </a>
        </li>
      </ul>
    </div>
    <!-- end::Theme -->
  </div>
</template>
