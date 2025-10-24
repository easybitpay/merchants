<script setup>
// Vue

// Store
import { useAppStore } from '@/stores/app'
import { computed } from 'vue'

// Components
import ApplicationCard from '../../components/application/ApplicationCard.vue'
import ApplicationCardLoading from '../../components/loadings/ApplicationCardLoading.vue'

// ----- START ----- //
const store = useAppStore()

const appList = computed(() => store.appList)
const appLoading = computed(() => store.appLoading)
</script>
<template>
  <div class="premium-applications-page">
    <!-- Header -->
    <div class="premium-page-header">
      <div>
        <h1 class="premium-page-title">Payment Gateways</h1>
        <p class="premium-page-subtitle">Manage your cryptocurrency payment gateways</p>
      </div>
      <RouterLink :to="{ name: 'add-application' }" class="btn-premium-primary">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-right: 0.5rem;">
          <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        New Gateway
      </RouterLink>
    </div>

    <!-- Applications Grid -->
    <div class="premium-apps-grid">
      <ApplicationCardLoading v-if="appLoading" />
      <ApplicationCard v-for="app in appList" :key="app.id" :app="app" />
    </div>

    <!-- Empty State -->
    <div v-if="!appLoading && !appList.length" class="premium-empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="12" y="16" width="40" height="32" rx="4" stroke="#d1d5db" stroke-width="2"/>
          <path d="M12 24H52" stroke="#d1d5db" stroke-width="2"/>
          <circle cx="32" cy="36" r="6" stroke="#d1d5db" stroke-width="2"/>
        </svg>
      </div>
      <h3 class="empty-title">No gateways yet</h3>
      <p class="empty-text">Create your first payment gateway to start accepting crypto payments</p>
      <RouterLink :to="{ name: 'add-application' }" class="btn-premium-primary">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-right: 0.5rem;">
          <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Create Gateway
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-applications-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.premium-page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.premium-page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.premium-page-subtitle {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
}

.btn-premium-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    color: white;
  }

  &:active {
    transform: translateY(0);
  }
}

.premium-apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.premium-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;

  .empty-icon {
    margin-bottom: 1.5rem;
    opacity: 0.6;
  }

  .empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.5rem 0;
  }

  .empty-text {
    font-size: 0.9375rem;
    color: #6b7280;
    margin: 0 0 2rem 0;
    max-width: 400px;
  }
}
</style>
