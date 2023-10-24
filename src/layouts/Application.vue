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
      <RouterLink :to="{ name: 'application-overview' }"> Mini game </RouterLink>
    </header>

    <div class="d-flex flex-column flex-root">
      <RouterView />
    </div>
  </div>
</template>
