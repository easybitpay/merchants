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
  <div class="card border-0 two-fa-card mb-6" v-if="!currentUser.merchant.two_factor_enabled">
    <div class="card-body d-flex flex-column flex-md-row align-items-center gap-6">
      <div class="d-flex flex-column flex-md-row align-items-center gap-6 flex-grow-1">
        <div
          class="min-w-48px w-48px h-48px bg-primary rounded-1 text-white d-flex align-items-center justify-content-center"
        >
          <inline-svg src="/media/icons/icons/lock.svg"></inline-svg>
        </div>

        <div class="text-center text-md-start">
          <p class="text-dark fw-medium mb-2">Enable Two-Factor Authentication</p>

          <p class="text-gray-700 dark-text-gray-400 fs-8 mb-0">
            Secure your account with an extra layer of protection. Enable 2FA to protect your
            payments and sensitive data.
          </p>
        </div>
      </div>

      <RouterLink :to="{ name: 'settings-privacy' }" class="btn btn-primary max-content animation">
        Active Now
        <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
      </RouterLink>
    </div>
  </div>
</template>
