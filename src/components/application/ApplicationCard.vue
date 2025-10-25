<script setup>
// Vue
import { computed, onMounted, ref, watch } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hook
import useIconImage from '@/hooks/useIconImage'
import useConvertDate from '@/hooks/useConvertDate'
import useActionShareAllowed from '@/hooks/useActionShareAllowed.js'

// Props
const props = defineProps({
  action: {
    type: String,
    default: 'enter'
  },
  app: {
    type: Object,
    required: true
  }
})

// ----- START ----- //

// Generals
const store = useAppStore()
const { storageImage } = useIconImage()
const { getCurrent } = useConvertDate()
const { actionShareAllowed } = useActionShareAllowed()

// Refs
const holders = ref([])

const partnerListKey = computed(() => store.partnerListKey)

// Functions

/**
 * Gateway List Status Converter
 */
const convartAppType = (type) => {
  if (type == '1') return 'API'
  if (type == '2') return 'Custom'
  if (type == '3') return 'Donate'
}

/**
 * Get Share App Holders
 */
const getAppShareHolders = async () => {
  if (actionShareAllowed(props.app.share_type, 'get_share')) {
    await store.getAppShareHolders(props.app.id).then((res) => {
      if (res) {
        holders.value = res
      }
    })
  }
}

onMounted(() => {
  setTimeout(() => {
    getAppShareHolders()
  }, 1000)
})

watch(partnerListKey, () => {
  getAppShareHolders()
})
</script>

<template>
  <div class="premium-gateway-card" :class="{ 'is-disabled': app.status != 1 }">
    <!-- Card Header -->
    <div class="gateway-card-header">
      <div class="gateway-identity">
        <img
          :src="app.logo ? storageImage(app.logo, 48) : '/media/images/banner/default-app.png'"
          :alt="app.name"
          class="gateway-logo"
        />
        <div class="gateway-info">
          <h3 class="gateway-name">{{ app.name }}</h3>
          <div class="gateway-meta">
            <span class="gateway-type">{{ convartAppType(app.type) }}</span>
            <span class="gateway-divider">•</span>
            <span class="gateway-role">{{ $filters.capitalize(app.share_type) }}</span>
            <span v-if="app.status != 1" class="gateway-status-badge">Inactive</span>
          </div>
        </div>
      </div>

      <div class="gateway-actions">
        <button
          v-if="actionShareAllowed(app.share_type, 'update_share')"
          type="button"
          class="btn-gateway-icon"
          data-bs-toggle="offcanvas"
          data-bs-target="#addPartner_offcanvas"
          aria-controls="addPartner_offcanvas"
          title="Share"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="4" cy="9" r="2" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="14" cy="5" r="2" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="14" cy="13" r="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M6 8.5L12 5.5M6 9.5L12 12.5" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </button>

        <RouterLink
          :to="{ name: 'application-overview', params: { id: app.id } }"
          class="btn-gateway-primary"
        >
          Open
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </RouterLink>
      </div>
    </div>

    <!-- Partners -->
    <div v-if="holders.length" class="gateway-partners">
      <div class="partners-avatars">
        <img
          v-for="item in holders.slice(0, 4)"
          :key="item.id"
          :src="item.avatar ? storageImage(item.avatar, 40) : `/media/images/banner/auth-bg.jpg`"
          :alt="item.first_name"
          class="partner-avatar"
        />
        <span v-if="holders.length > 4" class="partner-more">+{{ holders.length - 4 }}</span>
      </div>
      <span class="partners-label">{{ holders.length }} {{ holders.length === 1 ? 'Partner' : 'Partners' }}</span>
    </div>

    <!-- Stats Grid -->
    <div class="gateway-stats">
      <div class="stat-item">
        <div class="stat-value">${{ app?.summary?.total_income.toFixed(2) }}</div>
        <div class="stat-label">Total Earned</div>
      </div>

      <div class="stat-item">
        <div class="stat-value">${{ app?.summary?.total_withdraws.toFixed(2) }}</div>
        <div class="stat-label">Withdrawn</div>
      </div>

      <div class="stat-item">
        <div class="stat-value">${{ app?.summary?.last_month_income.toFixed(2) }}</div>
        <div class="stat-label">{{ getCurrent('MMMM') }}</div>
      </div>

      <div class="stat-item stat-item-highlight">
        <div class="stat-value">${{ app?.summary?.usd_value.toFixed(2) }}</div>
        <div class="stat-label">Available</div>
      </div>
    </div>

    <!-- Invoice Button (if applicable) -->
    <div v-if="app.type == 1 && action === 'action'" class="gateway-footer">
      <button
        type="button"
        :disabled="app.status != 1"
        class="btn-gateway-invoice"
        data-bs-toggle="offcanvas"
        data-bs-target="#createInvoice_offcanvas"
        aria-controls="createInvoice_offcanvas"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="2" width="10" height="12" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M6 6H10M6 9H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Create Invoice
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-gateway-card {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/media/images/banner/auth-bg.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.08;
    z-index: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    border-radius: inherit;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    &::before {
      opacity: 0.12;
    }
  }

  &.is-disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

[data-bs-theme="dark"] .premium-gateway-card {
  background: #1a1d1e;
  border-color: #2d3233;

  &::before {
    opacity: 0.15;
  }

  &:hover {
    border-color: #3d4344;
    box-shadow: 0 4px 12px rgba(31, 117, 255, 0.15);

    &::before {
      opacity: 0.22;
    }
  }
}

.gateway-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.gateway-identity {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
}

.gateway-logo {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid #e5e7eb;
}

.gateway-info {
  flex: 1;
  min-width: 0;
}

.gateway-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.375rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gateway-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #6b7280;
}

.gateway-type {
  font-weight: 500;
  color: #6366f1;
}

.gateway-divider {
  color: #d1d5db;
}

.gateway-role {
  text-transform: capitalize;
}

.gateway-status-badge {
  padding: 0.125rem 0.5rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.gateway-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-gateway-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
    color: #374151;
  }
}

.btn-gateway-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    color: white;
  }
}

.gateway-partners {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 1.25rem;
}

.partners-avatars {
  display: flex;
  align-items: center;
}

.partner-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid white;
  margin-left: -8px;
  object-fit: cover;

  &:first-child {
    margin-left: 0;
  }
}

.partner-more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e5e7eb;
  border: 2px solid white;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #6b7280;
  margin-left: -8px;
}

.partners-label {
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
}

.gateway-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1.25rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-item {
  text-align: center;

  &.stat-item-highlight {
    .stat-value {
      color: #10b981;
    }
  }
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.gateway-footer {
  margin-top: 1.25rem;
}

.btn-gateway-invoice {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #6366f1;
    color: #6366f1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
