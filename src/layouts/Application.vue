<script setup>
// Vue
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

// ----- START ----- //
const route = useRoute()
onMounted(() => {
  console.log(route)
})
</script>
<template>
  <div id="navbar-layout" class="h-100 d-flex flex-column">
    <header class="d-flex flex-nowrap column-gap-8 row-gap-4 mb-12">
      <RouterLink :to="{ name: 'application-overview' }"> Mini game </RouterLink>
      <RouterLink :to="{ name: 'application-transaction' }"> Transaction </RouterLink>
      <RouterLink :to="{ name: 'application-setting' }"> Setting </RouterLink>
      <RouterLink :to="{ name: 'application-notification' }"> Notification </RouterLink>
      <RouterLink :to="{ name: 'application-withdraw' }"> Withdraw </RouterLink>
    </header>

    <div class="d-flex flex-column flex-root">
      <RouterView />
    </div>
  </div>
</template>
