<script setup>
// Vue
import { ref, computed, onMounted } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Component
import WithdrawAppCard from '../../../components/application/withdraw/WithdrawAppCard.vue'
import WithdrawCard from '../../../components/application/withdraw/WithdrawCard.vue'
import WithdrawList from '../../../components/application/withdraw/WithdrawList.vue'
import WithdrawDetailOffcanvas from '../../../components/application/withdraw/WithdrawDetailOffcanvas.vue'

// ----- START ----- //

// Generals
const store = useAppStore()

// Refs
const loading = ref(false)
const balances = ref([])
const selectedBalance = ref({})
const updateWithdrawListKey = ref(0)

// Computeds
const selectedApp = computed(() => store.selectedApp)

// Functions

/**
 * Update Withdraw List
 */
const updateWithdrawList = () => {
  updateWithdrawListKey.value += 1
}

/**
 * Get Balances
 */
const getAppTokenBalance = async () => {
  // Start Loading
  loading.value = true

  // Request
  await store.getAppTokenBalance(selectedApp.value.id).then((res) => {
    if (res) {
      // convert & set data
      let array = []
      for (let i = 0; i < res.length; i++) {
        const element = res[i]
        array.push({
          ...element.token,
          balance: element.balance
        })
      }
      balances.value = array
      console.log(balances.value)
    }
  })

  // Stop Loading
  loading.value = false
}

/**
 * Set Selected Balance
 */

const setSelectedBalance = (balance) => {
  selectedBalance.value = balance

  setTimeout(() => {
    selectedBalance.value = {}
  }, 500)
}

onMounted(() => {
  getAppTokenBalance()
})
</script>

<template>
  <WithdrawAppCard
    :balances="balances"
    :mainLoading="loading"
    @onSelectBalance="setSelectedBalance"
  />

  <WithdrawCard :balances="balances" :mainLoading="loading" :selectedBalance="selectedBalance" />

  <WithdrawList :key="updateWithdrawListKey" />

  <WithdrawDetailOffcanvas @updateWithdrawList="updateWithdrawList" />
</template>
