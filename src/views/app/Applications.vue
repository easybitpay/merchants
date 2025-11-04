<script setup>
// Vue

// Store
import { useAppStore } from '@/stores/app'
import { computed } from 'vue'

// Components
import ApplicationCard from '../../components/application/ApplicationCard.vue'
import ApplicationCardLoading from '../../components/loadings/ApplicationCardLoading.vue'

// ----- START ----- //
const store = useAppStore()

const appList = computed(() => store.appList)
const appLoading = computed(() => store.appLoading)
</script>
<template>
  <!-- begin::Header -->
  <h2 class="text-primary fw-normal mb-12 roboto-mono">Applications</h2>
  <!-- end::Header -->

  <div class="d-flex flex-column gap-6">
    <ApplicationCardLoading v-if="appLoading" />
    <!-- begin::Item -->
    <div class="row gy-4">
      <div class="col-xl-6" v-for="app in appList" :key="app.id">
        <ApplicationCard :app="app" />
      </div>
    </div>
    <!-- end::Item -->
  </div>

  <!-- begin::Add New App -->
  <RouterLink :to="{ name: 'add-application' }" class="btn btn-primary w-200px mt-6">
    Add new Service
  </RouterLink>
  <!-- end::Add New App -->
</template>
