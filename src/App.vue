<script setup>
// Vue
import { computed, watch, onMounted } from 'vue'

// Router
import { useRouter } from 'vue-router'

// Store
import { useNotificationStore } from '@/stores/notification'
import { useThemeStore } from '@/stores/theme'

// ----- START ----- //

// Generals
const notificationStore = useNotificationStore()
const themeStore = useThemeStore()
const router = useRouter()

// Computeds
const newPage = computed(() => notificationStore.newPage)

// Functions

watch(newPage, () => {
  if (newPage.value) {
    router.push({ name: newPage.value })
  }
})

// Initialize theme on mount
onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <RouterView />
  <div id="liveAlertPlaceholder"></div>
</template>

<style lang="scss">
@import '@fortawesome/fontawesome-free/css/all.min.css';
</style>
