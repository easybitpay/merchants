<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

// Components
import Sidebar from './components/Sidebar.vue'
import LockScreen from './LockScreen.vue'

// ----- START ----- //
const authStore = useAuthStore()
const appStore = useAppStore()

const loading = ref(true)

const sidebarStatus = ref(true)

const changeSidebarStatus = () => {
  sidebarStatus.value = !sidebarStatus.value
}

onMounted(async () => {
  loading.value = true

  await authStore.getProfile()
  await appStore.getShareAppStatuses()
  await appStore.getTokens()
  await appStore.getNetworks()
  await appStore.getAppList()

  loading.value = false
})
</script>

<template>
  <div :class="`main-container sidebar-${sidebarStatus ? 'open' : 'close'}`">
    <Sidebar @changeSidebarStatus="changeSidebarStatus" :collapsed="!sidebarStatus" />

    <main id="main">
      <RouterView v-if="!loading" :key="$route.fullPath" />
    </main>
  </div>

  <LockScreen />
</template>
