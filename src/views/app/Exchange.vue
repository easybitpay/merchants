<script setup>
// Component
import ExchangeCard from '../../components/exchange/ExchangeCard.vue'
import ExchangeEmbedCard from '../../components/exchange/ExchangeEmbedCard.vue'
import ExchangeReportOffcanvas from '../../components/exchange/ExchangeReportOffcanvas.vue'
import ExchangeEmbledOffcanvas from '../../components/exchange/ExchangeEmbledOffcanvas.vue'
</script>

<template>
  <!-- begin::Header -->
  <h2 class="text-primary fw-normal mb-12 neue-machina">Exchange</h2>
  <!-- end::Header -->

  <ExchangeCard />

  <ExchangeEmbedCard />

  <ExchangeReportOffcanvas />

  <ExchangeEmbledOffcanvas />
</template>
