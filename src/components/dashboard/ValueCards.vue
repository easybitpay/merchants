<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
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
        image="blue-image"
        title="Total Earning"
        :value="summary.total_income"
      />
    </div>

    <div class="col-sm-6 col-xl-3">
      <ValueCard
        :loading="loading"
        image="warning-image"
        title="Withdrawn"
        :value="summary.total_withdraws"
      />
    </div>

    <div class="col-sm-6 col-xl-3">
      <ValueCard
        :loading="loading"
        image="purple-image"
        :title="`Earned in ${getCurrent('MMMM')}`"
        :value="summary.last_month_income"
      />
    </div>

    <div class="col-sm-6 col-xl-3">
      <ValueCard
        :loading="loading"
        image="success-image"
        title="Available"
        :value="summary.usd_value"
      />
    </div>
  </div>
</template>
