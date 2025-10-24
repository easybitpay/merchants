<script setup>
// Vue
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Store
import { useAppStore } from '@/stores/app'

// Componenets
import AddPartnerOffcanvas from '../components/application/AddPartnerOffcanvas.vue'
import CreateInvoiceOffcanvas from '../components/application/CreateInvoiceOffcanvas.vue'

// ----- START ----- //
const route = useRoute()
const store = useAppStore()

// Refs
const createInvoiceRefreshKey = ref(0)

// Computeds
const appId = computed(() => route.params.id)
const selectedApp = computed(() => store.selectedApp)

// Functions

/**
 * Update Create Invoice Component
 */
const refreshCreateInvoice = () => {
  createInvoiceRefreshKey.value++
}

onMounted(() => {
  store.setSelectedApp(appId.value)
})
</script>
<template>
  <div class="premium-application-layout">
    <!-- Header -->
    <div class="application-header">
      <h2 class="application-title">{{ selectedApp.name }}</h2>
      <p class="application-description">Manage your application settings and view transactions</p>
    </div>

    <!-- Premium Tabs -->
    <div class="premium-tabs-container">
      <nav class="premium-tabs">
        <RouterLink 
          :to="{ name: 'application-overview', params: { id: appId } }"
          class="premium-tab"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="tab-icon">
            <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="2" y="10" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="10" y="10" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <span class="tab-text">Overview</span>
        </RouterLink>

        <RouterLink 
          :to="{ name: 'application-transaction', params: { id: appId } }"
          class="premium-tab"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="tab-icon">
            <path d="M4 9h10M9 4v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <span class="tab-text">Transaction</span>
        </RouterLink>

        <RouterLink 
          :to="{ name: 'application-setting', params: { id: appId } }"
          class="premium-tab"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="tab-icon">
            <circle cx="9" cy="9" r="2.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M9 2v2M9 14v2M16 9h-2M4 9H2M13.5 4.5l-1.4 1.4M5.9 12.1l-1.4 1.4M13.5 13.5l-1.4-1.4M5.9 5.9L4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="tab-text">Setting</span>
        </RouterLink>

        <RouterLink 
          :to="{ name: 'application-notification', params: { id: appId } }"
          class="premium-tab"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="tab-icon">
            <path d="M6 6.5C6 4.567 7.567 3 9.5 3h0c1.933 0 3.5 1.567 3.5 3.5v2c0 1.5 1 2.5 1.5 3H4.5c.5-.5 1.5-1.5 1.5-3v-2z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7.5 14a2 2 0 004 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="tab-text">Notification</span>
        </RouterLink>

        <RouterLink 
          :to="{ name: 'application-withdraw', params: { id: appId } }"
          class="premium-tab"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="tab-icon">
            <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M6 9h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
          </svg>
          <span class="tab-text">Withdraw</span>
        </RouterLink>
      </nav>
    </div>

    <!-- Content -->
    <div class="application-content" v-if="selectedApp.id">
      <RouterView @refreshCreateInvoice="refreshCreateInvoice" />
    </div>
  </div>

  <AddPartnerOffcanvas />
  <CreateInvoiceOffcanvas :key="createInvoiceRefreshKey" />
</template>

<style scoped lang="scss">
.premium-application-layout {
  padding: 2rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
}

.application-header {
  margin-bottom: 2rem;
}

.application-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.application-description {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.premium-tabs-container {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 2px;
  }
}

.premium-tabs {
  display: flex;
  gap: 0.5rem;
  min-width: max-content;
}

.premium-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.15s ease;
  white-space: nowrap;
  cursor: pointer;
  position: relative;

  .tab-icon {
    flex-shrink: 0;
    transition: all 0.15s ease;
  }

  .tab-text {
    transition: all 0.15s ease;
  }

  &:hover {
    background: #f9fafb;
    color: #374151;
  }

  &.router-link-active {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);

    .tab-icon {
      path, rect, circle {
        stroke: white;
      }
    }

    &:hover {
      background: linear-gradient(135deg, #5558e3 0%, #7c4de8 100%);
      color: white;
    }
  }

  @media (max-width: 640px) {
    padding: 0.5rem 0.875rem;
    font-size: 0.8125rem;

    .tab-icon {
      width: 16px;
      height: 16px;
    }
  }
}

.application-content {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
