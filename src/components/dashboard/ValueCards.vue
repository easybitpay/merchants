<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
import useConvertDate from '@/hooks/useConvertDate.js'

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
  <div class="premium-value-cards">
    <ValueCard
      :loading="loading"
      iconColor="#3b82f6"
      title="Total Earning"
      :value="summary.total_income"
    />

    <ValueCard
      :loading="loading"
      iconColor="#f59e0b"
      title="Withdrawn"
      :value="summary.total_withdraws"
    />

    <ValueCard
      :loading="loading"
      iconColor="#8b5cf6"
      :title="`Earned in ${getCurrent('MMMM')}`"
      :value="summary.last_month_income"
    />

    <ValueCard
      :loading="loading"
      iconColor="#10b981"
      title="Available"
      :value="summary.usd_value"
    />
  </div>
</template>

<style scoped lang="scss">
.premium-value-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
