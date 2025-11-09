<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Composabless
import useConvertDate from '@/composables/useConvertDate.js'

// Components
import ValueCard from './ValueCard.vue'

// ----- START ----- //

// Generals
const store = useAuthStore()
const { getCurrent } = useConvertDate()

// Refs
const loading = ref(false)
const summary = ref({})

// Functions

/**
 * Get Merchat Summary
 */
const getMerchatSummary = async () => {
  // Start Loading
  loading.value = true

  // Request
  await store.getMerchatSummary().then((res) => {
    summary.value = res
  })

  // Stop Loading
  loading.value = false
}

onMounted(() => {
  getMerchatSummary()
})
</script>

<template>
  <div class="row gy-5 mb-6">
    <div class="col-sm-6 col-xl-3">
      <ValueCard
        :loading="loading"
        title="Total Earning"
        :value="summary.total_income"
        color="primary"
      />
    </div>

    <div class="col-sm-6 col-xl-3">
      <ValueCard
        :loading="loading"
        title="Withdrawn"
        :value="summary.total_withdraws"
        color="warning"
      />
    </div>

    <div class="col-sm-6 col-xl-3">
      <ValueCard
        :loading="loading"
        :title="`Earned in ${getCurrent('MMMM')}`"
        :value="summary.last_month_income"
        color="purple"
      />
    </div>

    <div class="col-sm-6 col-xl-3">
      <ValueCard
        :loading="loading"
        image="success-image"
        title="Available"
        :value="summary.usd_value"
        color="success"
      />
    </div>
  </div>
</template>
