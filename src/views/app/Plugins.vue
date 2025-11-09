<script setup>
// Component
import PageHeader from '../../components/globals/PageHeader.vue'
import PluginCard from '../../components/plugin/PluginCard.vue'
</script>
<template>
  <!-- begin::Header -->

  <PageHeader
    title="Plugin"
    description="Latest clicks/conversions. Where you currently have the logo for merchant"
  />
  <!-- end::Header -->

  <!-- begin::Cards -->
  <div class="d-flex flex-column gap-6">
    <PluginCard />
    <PluginCard />
  </div>
  <!-- end::Cards -->
</template>
