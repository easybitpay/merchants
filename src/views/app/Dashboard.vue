<script setup>
// Vue
import { computed } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Component
import TwoFaBox from '../../components/dashboard/TwoFaBox.vue'
import ValueCards from '../../components/dashboard/ValueCards.vue'
import TrasactionHistory from '../../components/dashboard/TransactionHistory.vue'
import AppCard from '../../components/dashboard/AppCard.vue'
import LastTransactions from '../../components/dashboard/LastTransactions.vue'

// ----- START ----- //

// Generals
const store = useAppStore()

// Computeds
const appList = computed(() => store.appList)
</script>

<template>
  <div class="premium-dashboard-page">
    <TwoFaBox />

    <ValueCards />

    <div class="dashboard-content-grid" :class="{ 'has-gateway': appList.length }">
      <div class="chart-section">
        <TrasactionHistory />
      </div>

      <div class="gateway-section" v-if="appList.length">
        <AppCard :app="appList[0]" />
      </div>
    </div>

    <LastTransactions />
  </div>
</template>

<style scoped lang="scss">
.premium-dashboard-page {
  padding: 2rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
}

.dashboard-content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  &.has-gateway {
    @media (min-width: 1200px) {
      grid-template-columns: 2fr 1fr;
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.chart-section {
  min-width: 0;
}

.gateway-section {
  min-width: 0;
}
</style>
