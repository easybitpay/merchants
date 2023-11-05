<script setup>
// Component
import PluginCard from '../../components/plugin/PluginCard.vue'
</script>
<template>
  <!-- begin::Header -->
  <h2 class="text-primary fw-normal mb-12 neue-machina">Plugin</h2>
  <!-- end::Header -->

  <!-- begin::text -->
  <p class="mb-6">Latest clicks/conversions. Where you currently have the logo for merchant</p>
  <!-- end::text -->

  <!-- begin::Cards -->
  <div class="d-flex flex-column gap-6">
    <PluginCard />
    <PluginCard />
  </div>
  <!-- end::Cards -->
</template>
