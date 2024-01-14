<script setup>
// Component
import AppSettingCard from '../../../components/application/AppSettingCard.vue'
import AppInfo from '../../../components/application/setting/AppInfo.vue'
import ChangeAppStatus from '../../../components/application/setting/ChangeAppStatus.vue'
import AvailableCoin from '../../../components/application/setting/AvailableCoin.vue'
import CustomCoin from '../../../components/application/setting/CustomCoin.vue'
import CustomerFeeShare from '../../../components/application/setting/CustomerFeeShare.vue'
import GatewayTheme from '../../../components/application/setting/GatewayTheme.vue'
import { ref } from 'vue'

// ----- START ----- //

// Refs
const availableCoinsRefreshKey = ref(0)

// Functions

/**
 * Update Available Coins Component
 */
const refreshAvailableCoins = () => {
  availableCoinsRefreshKey.value++
}
</script>

<template>
  <AppSettingCard />

  <AppInfo />

  <ChangeAppStatus />

  <AvailableCoin :key="availableCoinsRefreshKey"/>

  <CustomCoin @refreshAvailableCoins="refreshAvailableCoins"/>

  <CustomerFeeShare />

  <GatewayTheme />
</template>
