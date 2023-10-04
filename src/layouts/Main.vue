<script setup>
// Vue
import { ref } from 'vue'

// Components
import Sidebar from './components/Sidebar.vue'

// ----- START ----- //
const sidebarStatus = ref(true)

const changeSidebarStatus = () => {
  sidebarStatus.value = !sidebarStatus.value
}
</script>

<template>
  <div :class="`main-container sidebar-${sidebarStatus ? 'open' : 'close'}`">
    <Sidebar @changeSidebarStatus="changeSidebarStatus" :collapsed="!sidebarStatus" />

    <main id="main">
      <RouterView />
    </main>
  </div>
</template>
