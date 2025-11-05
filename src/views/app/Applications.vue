<script setup>
// Vue

// Store
import { useAppStore } from '@/stores/app'
import { computed } from 'vue'

// Components
import PageHeader from '../../components/globals/PageHeader.vue'
import ApplicationCard from '../../components/application/ApplicationCard.vue'

// ----- START ----- //
const store = useAppStore()

const appList = computed(() => store.appList)
</script>
<template>
  <PageHeader title="Payment Gateways" description="Manage your cryptocurrency payment gateways">
    <!-- begin::Add New App -->
    <RouterLink :to="{ name: 'add-application' }" class="btn btn-primary w-200px mt-6">
      New Gateway
    </RouterLink>
    <!-- end::Add New App -->
  </PageHeader>

  <div class="d-flex flex-column gap-6">
    <!-- begin::Item -->
    <div class="row gy-4">
      <div class="col-xl-6" v-for="app in appList" :key="app.id">
        <ApplicationCard :app="app" />
      </div>
    </div>
    <!-- end::Item -->
  </div>
</template>
