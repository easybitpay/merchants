<script setup>
import ApplicationCard from '../../components/application/ApplicationCard.vue'
</script>
<template>
  <!-- begin::Header -->
  <h2 class="text-primary fw-normal mb-12 roboto-mono">Applications</h2>
  <!-- end::Header -->

  <div class="d-flex flex-column gap-6">
    <!-- begin::Item -->
    <ApplicationCard />
    <!-- end::Item -->
    <ApplicationCard />
  </div>

  <!-- begin::Add New App -->
  <RouterLink :to="{ name: 'add-application' }" class="btn btn-primary w-200px mt-6">
    Add new Service
  </RouterLink>
  <!-- end::Add New App -->
</template>
