<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hook
import useIconImage from '@/composables/useIconImage'
import useActionShareAllowed from '@/composables/useActionShareAllowed.js'

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
  <div
    :class="`card border-app-${app.settings.color} rounded h-100 min-h-481px gradient-image-box`"
    :style="`--background: url(${
      app.banner ? storageImage(app.banner) : '/media/images/banner/auth-bg.jpg'
    })`"
  >
    <div class="card-body d-flex flex-column justify-content-between">
      <!-- begin::Top -->
      <div>
        <!-- begin::Partners -->
        <div class="partners mb-6" v-if="holders.length">
          <!-- begin::Item -->
          <span class="item" v-for="item in holders" :key="item.id">
            <img
              :src="
                item.avatar ? storageImage(item.avatar, 40) : `/media/images/banner/auth-bg.jpg`
              "
              :alt="item.first_name"
            />
          </span>
          <!-- end::Item -->
        </div>
        <!-- end::Partners -->

        <!-- begin::Type -->
        <p class="mb-2">{{ $filters.capitalize(app.share_type) }}</p>
        <!-- end::Type -->

        <!-- begin::Name -->
        <h2 :class="`mb-0 text-app-${app.settings.color}`">{{ app.name }}</h2>
        <!-- end::Name -->
      </div>
      <!-- end::Top -->

      <!-- begin::Bottom -->
      <div>
        <!-- begin::Balance Infos -->
        <div class="value-infos mb-8">
          <!-- begin::Item -->
          <div class="item">
            <p class="value">${{ app?.summary?.total_income.toFixed(2) }}</p>
            <p class="title">Total Earning</p>
          </div>
          <!-- end::Item -->
          <!-- begin::Item -->
          <div class="item">
            <p class="value">${{ app?.summary?.total_withdraws.toFixed(2) }}</p>
            <p class="title">Withdrawn</p>
          </div>
          <!-- end::Item -->
        </div>
        <!-- end::Balance Infos -->

        <!-- begin::Link -->
        <RouterLink
          :to="{ name: 'application-overview', params: { id: app.id } }"
          class="btn btn-primary w-100"
        >
          Full View
          <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
        </RouterLink>
        <!-- end::Link -->
      </div>
      <!-- begin::Bottom -->
    </div>
  </div>
</template>
