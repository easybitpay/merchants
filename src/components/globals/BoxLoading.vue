<script setup>
// Store
import { useThemeStore } from '@/stores/theme'

// ----- START ----- //

// Generals
const themeStore = useThemeStore()
</script>

<template>
  <div id="box-loading">
    <inline-svg :src="`media/images/logo/${themeStore.theme}-main-logo.svg`"></inline-svg>

    <span
      class="spinner-border text-primary dark-text-white spinner-border-sm"
      role="status"
    ></span>
  </div>
</template>
