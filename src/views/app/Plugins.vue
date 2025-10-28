<script setup>
// Component
import PluginCard from '../../components/plugin/PluginCard.vue'
</script>
<template>
  <!-- begin::Header -->
  <div class="page-header">
    <h1 class="title">Plugin</h1>
    <p class="description">
      Latest clicks/conversions. Where you currently have the logo for merchant
    </p>
  </div>
  <!-- end::Header -->

  <!-- begin::Cards -->
  <div class="d-flex flex-column gap-6">
    <PluginCard />
    <PluginCard />
  </div>
  <!-- end::Cards -->
</template>
