<script setup>
// Component
import ExchangeCard from '../../components/exchange/ExchangeCard.vue'
import ExchangeEmbedCard from '../../components/exchange/ExchangeEmbedCard.vue'
import ExchangeReportOffcanvas from '../../components/exchange/ExchangeReportOffcanvas.vue'
import ExchangeEmbledOffcanvas from '../../components/exchange/ExchangeEmbledOffcanvas.vue'
</script>

<template>
  <div class="premium-exchange-page">
    <!-- Header -->
    <div class="page-header">
      <h2 class="page-title">Instant Exchange</h2>
      <p class="page-description">Swap crypto assets instantly with real-time exchange rates</p>
    </div>

    <!-- Exchange Card -->
    <ExchangeCard />

    <!-- Embed Card -->
    <ExchangeEmbedCard />

    <!-- Offcanvas -->
    <ExchangeReportOffcanvas />
    <ExchangeEmbledOffcanvas />
  </div>
</template>

<style scoped lang="scss">
.premium-exchange-page {
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

[data-bs-theme="dark"] {
  .page-title {
    color: #f3f4f6;
  }

  .page-description {
    color: #9ca3af;
  }
}
</style>
