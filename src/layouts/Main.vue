<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

// Components
import Sidebar from './components/Sidebar.vue'
import LockScreen from './LockScreen.vue'
import MainLoading from '../components/globals/MainLoading.vue'

// ----- START ----- //

// Generals
const authStore = useAuthStore()
const appStore = useAppStore()

// Refs
const loading = ref(true)
const sidebarStatus = ref(true)

// Computeds
const currentUser = computed(() => authStore.currentUser)

// Functions
const changeSidebarStatus = () => {
  sidebarStatus.value = !sidebarStatus.value
}

/**
 * Set Email Verify Status
 */
 const setEmailVerifyStatus = () => {
  let emailVerifyAt = currentUser.value?.merchant?.email_verified_at

  if (!emailVerifyAt) {
    authStore.setShowEmailVerifyAlert(true)
  }else {
    authStore.setShowEmailVerifyAlert(false)
  }
}

onMounted(async () => {
  loading.value = true

  localStorage.removeItem('afterLoginPage')

  await authStore.getProfile()
  setEmailVerifyStatus()
  await appStore.getShareAppStatuses()
  await appStore.getTokens()
  await appStore.getNetworks()
  await appStore.getAppList()

  loading.value = false
})
</script>

<template>
  <MainLoading v-if="loading" />
  <div :class="`main-container sidebar-${sidebarStatus ? 'open' : 'close'}`">
    <Sidebar @changeSidebarStatus="changeSidebarStatus" :collapsed="!sidebarStatus" />

    <main id="main">
      <RouterView v-if="!loading" :key="$route.params.id" />
    </main>
  </div>

  <LockScreen />
</template>
