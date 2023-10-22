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
    <header class="d-flex flex-wrap column-gap-8 row-gap-4 mb-12">
      <RouterLink :to="{ name: 'help-knowledge' }"> Knowledge </RouterLink>
      <RouterLink :to="{ name: 'help-faq' }"> FAQ </RouterLink>
      <RouterLink :to="{ name: 'help-ticket' }"> Ticket </RouterLink>
    </header>

    <div class="d-flex flex-column flex-root">
      <RouterView />
    </div>
  </div>
</template>
