<script setup>
// Vue
import { ref } from 'vue'

// Component
import WithdrawAppCard from '../../../components/application/withdraw/WithdrawAppCard.vue'
import WithdrawCard from '../../../components/application/withdraw/WithdrawCard.vue'
import WithdrawList from '../../../components/application/withdraw/WithdrawList.vue'
import WithdrawDetailOffcanvas from '../../../components/application/withdraw/WithdrawDetailOffcanvas.vue'
import PaginationCard from '../../../components/globals/PaginationCard.vue'

// ----- Start -----
const showList = ref(false)
</script>

<template>
  <WithdrawAppCard />

  <WithdrawCard />

  <PaginationCard
    :text="`${showList ? 'Hide' : 'Show'} Transaction`"
    :bold="false"
    :shadows="!showList"
    gap="4"
    @clicked="showList = !showList"
  />

  <WithdrawList v-if="showList" />

  <WithdrawDetailOffcanvas />
</template>
