<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

onMounted(() => {
  console.log(route)
})
</script>
<template>
  <div id="navbar-layout" class="h-100 d-flex flex-column">
    <header class="d-flex flex-nowrap column-gap-8 row-gap-4 mb-12">
      <RouterLink :to="{ name: 'settings-basic' }"> Basic </RouterLink>
      <RouterLink :to="{ name: 'settings-privacy' }"> Privacy </RouterLink>
      <RouterLink :to="{ name: 'settings-notification' }"> Notification </RouterLink>
      <RouterLink :to="{ name: 'settings-customize' }"> Customize </RouterLink>
    </header>

    <div class="d-flex flex-column flex-root">
      <RouterView />
    </div>
  </div>
</template>
