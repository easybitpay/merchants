<script setup>
// Vue
import { computed } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// ----- START ----- //

// Generals
const authStore = useAuthStore()

// Computeds
const currentUser = computed(() => authStore.currentUser)
</script>

<template>
  <div class="premium-2fa-banner" v-if="!currentUser.merchant.two_factor_enabled">
    <div class="banner-content">
      <div class="banner-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="11" width="12" height="9" rx="1.5"/>
          <path d="M9 11V7a3 3 0 116 0v4"/>
          <circle cx="12" cy="15.5" r="1" fill="currentColor"/>
        </svg>
      </div>
      
      <div class="banner-text">
        <h3 class="banner-title">Enable Two-Factor Authentication</h3>
        <p class="banner-description">
          Secure your account with an extra layer of protection. Enable 2FA to protect your payments and sensitive data.
        </p>
      </div>

      <RouterLink :to="{ name: 'settings-privacy' }" class="btn-activate">
        <span>Activate Now</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 3l5 5-5 5"/>
        </svg>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-2fa-banner {
  margin-bottom: 2rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.banner-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 0.75rem;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}

.banner-text {
  flex: 1;
  min-width: 0;
}

.banner-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.banner-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.btn-activate {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

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
</style>
