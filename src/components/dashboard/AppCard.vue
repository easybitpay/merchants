<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hook
import useIconImage from '@/hooks/useIconImage'
import useActionShareAllowed from '@/hooks/useActionShareAllowed.js'

// Props
const props = defineProps({
  app: {
    type: Object,
    required: true
  }
})

// ----- START ----- //

// Generals
const store = useAppStore()
const { storageImage } = useIconImage()
const { actionShareAllowed } = useActionShareAllowed()

// Refs
const holders = ref([])

// Functions

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
  getAppShareHolders()
})
</script>
<template>
  <div class="premium-gateway-card">
    <div
      class="gateway-banner"
      :style="`background: linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(139, 92, 246, 0.95)), url(${
        app.banner ? storageImage(app.banner) : '/media/images/banner/auth-bg.jpg'
      }); background-size: cover; background-position: center;`"
    >
      <!-- Partners -->
      <div class="gateway-partners" v-if="holders.length">
        <div class="partner-avatars">
          <span class="partner-avatar" v-for="item in holders" :key="item.id">
            <img
              :src="
                item.avatar ? storageImage(item.avatar, 40) : `/media/images/banner/auth-bg.jpg`
              "
              :alt="item.first_name"
            />
          </span>
        </div>
      </div>

      <!-- Gateway Info -->
      <div class="gateway-info">
        <div class="gateway-type">{{ $filters.capitalize(app.share_type) }}</div>
        <h3 class="gateway-name">{{ app.name }}</h3>
      </div>
    </div>

    <div class="gateway-stats">
      <div class="stat-item">
        <div class="stat-label">Total Earning</div>
        <div class="stat-value">${{ app?.summary?.total_income.toFixed(2) }}</div>
      </div>

      <div class="stat-divider"></div>

      <div class="stat-item">
        <div class="stat-label">Withdrawn</div>
        <div class="stat-value">${{ app?.summary?.total_withdraws.toFixed(2) }}</div>
      </div>
    </div>

    <div class="gateway-action">
      <RouterLink
        :to="{ name: 'application-overview', params: { id: app.id } }"
        class="btn-full-view"
      >
        <span>View Gateway</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 3l5 5-5 5"/>
        </svg>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-gateway-card {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.gateway-banner {
  padding: 1.5rem;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.gateway-partners {
  margin-bottom: 1rem;
}

.partner-avatars {
  display: flex;
  gap: 0.5rem;
}

.partner-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.gateway-info {
  margin-top: auto;
}

.gateway-type {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

.gateway-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin: 0;
  line-height: 1.3;
}

.gateway-stats {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
  border-bottom: 1.5px solid #e5e7eb;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.2;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e5e7eb;
}

.gateway-action {
  padding: 1.5rem;
  margin-top: auto;
}

.btn-full-view {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: all 0.2s ease;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);

    svg {
      transform: translateX(4px);
    }
  }
}

@media (max-width: 1199px) {
  .gateway-banner {
    min-height: 180px;
  }

  .gateway-stats {
    padding: 1.25rem;
  }

  .gateway-action {
    padding: 1.25rem;
  }
}
</style>
