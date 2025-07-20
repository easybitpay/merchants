<script setup>
// Vue
import { ref, computed } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hook
import useActionShareAllowed from '@/hooks/useActionShareAllowed.js'

// Component
import AppSettingCard from '../../../components/application/AppSettingCard.vue'
import AppInfo from '../../../components/application/setting/AppInfo.vue'
import ChangeAppStatus from '../../../components/application/setting/ChangeAppStatus.vue'
import AvailableCoin from '../../../components/application/setting/AvailableCoin.vue'
import CustomCoin from '../../../components/application/setting/CustomCoin.vue'
import CustomerFeeShare from '../../../components/application/setting/CustomerFeeShare.vue'
import GatewayTheme from '../../../components/application/setting/GatewayTheme.vue'
import AppColor from '../../../components/application/setting/AppColor.vue'
import Partners from '../../../components/application/Partners.vue'

// Emit
const emit = defineEmits(['refreshCreateInvoice'])

// ----- START ----- //

// Generals
const store = useAppStore()
const { actionShareAllowed } = useActionShareAllowed()

// Refs
const availableCoinsRefreshKey = ref(0)

// Computeds
const selectedApp = computed(() => store.selectedApp)

// Functions

/**
 * Update Available Coins Component
 */
const refreshAvailableCoins = () => {
  availableCoinsRefreshKey.value++
  emit('refreshCreateInvoice')
}
</script>

<template>
  <AppSettingCard />

  <AppInfo />

  <ChangeAppStatus />

  <AppColor />

  <AvailableCoin :key="availableCoinsRefreshKey" />

  <CustomCoin @refreshAvailableCoins="refreshAvailableCoins" />

  <CustomerFeeShare />

  <GatewayTheme />

  <Partners v-if="actionShareAllowed(selectedApp.share_type, 'get_share')" />
</template>
