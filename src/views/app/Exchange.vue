<script setup>
// Component
import PageHeader from '../../components/globals/PageHeader.vue'

import ExchangeCard from '../../components/exchange/ExchangeCard.vue'
import ExchangeEmbedCard from '../../components/exchange/ExchangeEmbedCard.vue'
import ExchangeReportOffcanvas from '../../components/exchange/ExchangeReportOffcanvas.vue'
import ExchangeEmbledOffcanvas from '../../components/exchange/ExchangeEmbledOffcanvas.vue'
</script>

<template>
  <!-- begin::Header -->
  <PageHeader
    title="Instant Exchange"
    description="Swap crypto assets instantly with real-time exchange rates"
  />
  <!-- end::Header -->

  <ExchangeCard />

  <ExchangeEmbedCard />

  <ExchangeReportOffcanvas />

  <ExchangeEmbledOffcanvas />
</template>
