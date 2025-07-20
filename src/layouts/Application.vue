<script setup>
// Vue
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Store
import { useAppStore } from '@/stores/app'

// Componenets
import AddPartnerOffcanvas from '../components/application/AddPartnerOffcanvas.vue'
import CreateInvoiceOffcanvas from '../components/application/CreateInvoiceOffcanvas.vue'

// ----- START ----- //
const route = useRoute()
const store = useAppStore()

// Refs
const createInvoiceRefreshKey = ref(0)

// Computeds
const appId = computed(() => route.params.id)
const selectedApp = computed(() => store.selectedApp)

// Functions

/**
 * Update Create Invoice Component
 */
const refreshCreateInvoice = () => {
  createInvoiceRefreshKey.value++
}

onMounted(() => {
  store.setSelectedApp(appId.value)
})
</script>
<template>
  <div id="navbar-layout" class="h-100 d-flex flex-column">
    <header class="d-flex flex-nowrap column-gap-8 row-gap-4 mb-12">
      <RouterLink :to="{ name: 'application-overview', params: { id: appId } }">
        {{ selectedApp.name }}
      </RouterLink>
      <RouterLink :to="{ name: 'application-transaction', params: { id: appId } }">
        Transaction
      </RouterLink>
      <RouterLink :to="{ name: 'application-setting', params: { id: appId } }">
        Setting
      </RouterLink>
      <RouterLink :to="{ name: 'application-notification', params: { id: appId } }">
        Notification
      </RouterLink>
      <RouterLink :to="{ name: 'application-withdraw', params: { id: appId } }">
        Withdraw
      </RouterLink>
    </header>

    <div class="d-flex flex-column flex-root" v-if="selectedApp.id">
      <RouterView @refreshCreateInvoice="refreshCreateInvoice" />
    </div>
  </div>

  <AddPartnerOffcanvas />
  <CreateInvoiceOffcanvas :key="createInvoiceRefreshKey" />
</template>
