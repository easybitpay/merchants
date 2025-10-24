<script setup>
// Component
import PluginCard from '../../components/plugin/PluginCard.vue'
</script>
<template>
  <div class="premium-plugin-page">
    <!-- Header -->
    <div class="page-header">
      <h2 class="page-title">Plugins</h2>
      <p class="page-description">Integrate EasyBitPay with your favorite platforms and tools</p>
    </div>

    <!-- Cards -->
    <div class="plugins-grid">
      <PluginCard />
      <PluginCard />
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-plugin-page {
  padding: 2rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.page-description {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.plugins-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
