<script setup>
// Component
import TwoFaBox from '../../components/dashboard/TwoFaBox.vue'
import ValueCard from '../../components/dashboard/ValueCard.vue'
import TrasactionHistory from '../../components/dashboard/TransactionHistory.vue'
import AppCard from '../../components/dashboard/AppCard.vue'
import LastTransactions from '../../components/dashboard/LastTransactions.vue'
</script>

<template>
  <TwoFaBox />

  <div class="row gy-5 mb-6">
    <div class="col-sm-6 col-xl-3">
      <ValueCard image="blue-image" title="Total Earning" value="16.259" />
    </div>

    <div class="col-sm-6 col-xl-3">
      <ValueCard image="warning-image" title="Withdrawn" value="16.259" />
    </div>

    <div class="col-sm-6 col-xl-3">
      <ValueCard image="purple-image" title="Earned in July" value="16.259" />
    </div>

    <div class="col-sm-6 col-xl-3">
      <ValueCard image="success-image" title="Available" value="16.259" />
    </div>
  </div>

  <div class="row gy-5 mb-6">
    <div class="col-xl-7 col-xxl-9">
      <TrasactionHistory />
    </div>

    <div class="col-xl-5 col-xxl-3">
      <AppCard />
    </div>
  </div>

  <LastTransactions />
</template>
