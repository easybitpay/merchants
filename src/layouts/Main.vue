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
const showSidebar = ref(true)

// Computeds
const currentUser = computed(() => authStore.currentUser)

// Functions
const changeSidebarStatus = () => {
  sidebarStatus.value = !sidebarStatus.value
}

const changeShowSidebar = () => {
  if (sidebarStatus.value) {
    changeSidebarStatus()
  }
  showSidebar.value = !showSidebar.value
}

/**
 * Set Email Verify Status
 */
const setEmailVerifyStatus = () => {
  let emailVerifyAt = currentUser.value?.merchant?.email_verified_at

  if (!emailVerifyAt) {
    authStore.setShowEmailVerifyAlert(true)
  } else {
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
  <div
    :class="[
      { 'main-container': true },
      { 'sidebar-open': sidebarStatus },
      { 'sidebar-close': !sidebarStatus },
      { 'sidebar-hide': !showSidebar }
    ]"
  >
    <Sidebar @changeSidebarStatus="changeSidebarStatus" :collapsed="!sidebarStatus" />

    <main id="main">
      <RouterView v-if="!loading" :key="$route.params.id" />
    </main>
  </div>

  <button
    type="button"
    class="btn bg-white border-0 w-40px h-40px p-0 align-items-center d-flex d-sm-none shadow"
    @click="changeShowSidebar"
    style="position: fixed; top: 1rem; right: 1rem;"
  >
    <inline-svg :src="`/media/icons/icons/${showSidebar ? 'close' : 'grid'}.svg`"></inline-svg>
  </button>

  <LockScreen />
</template>
