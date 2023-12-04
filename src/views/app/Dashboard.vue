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
const store = useAppStore();

// Computeds
const appList = computed(() => store.appList)
</script>

<template>
  <TwoFaBox />

  <ValueCards />

  <div class="row gy-5 mb-6">
    <div :class="`col-xl-${appList.length ? '7' : '12'} col-xxl-${appList.length ? '9' : '12'}`">
      <TrasactionHistory />
    </div>

    <div class="col-xl-5 col-xxl-3" v-if="appList.length">
      <AppCard :app="appList[0]"/>
    </div>
  </div>

  <LastTransactions />
</template>
