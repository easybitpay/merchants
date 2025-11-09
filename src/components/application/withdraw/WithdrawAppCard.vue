<script setup>
// Vue
import { computed, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Composables
import useIconImage from '@/composables/useIconImage'

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

// Props
const props = defineProps({
  balances: {
    type: Array,
    required: true
  },
  mainLoading: {
    type: Boolean,
    required: true
  }
})

// Emit
const emit = defineEmits(['onSelectBalance'])

// ----- START ----- //

// Generals
const store = useAppStore()
const { storageImage } = useIconImage()

// Computeds
const selectedApp = computed(() => store.selectedApp)

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
 * Emit Select Balance
 * @param {balance item} balance
 */
const selectBalance = (balance) => {
  emit('onSelectBalance', balance)
}
</script>

<template>
  <div
    class="card background-image application-card mb-10"
    :style="`--background: url(${
      selectedApp.banner ? storageImage(selectedApp.banner) : '/media/images/banner/auth-bg.jpg'
    })`"
  >
    <div :class="`card-body border-app-${selectedApp.settings.color}`">
      <!-- begin::Name Action -->
      <div class="info-action-box">
        <!-- begin::Main Info -->
        <div class="main-info">
          <!-- begin::Logo -->
          <img
            :src="
              selectedApp.logo
                ? storageImage(selectedApp.logo, 48)
                : '/media/images/banner/default-app.png'
            "
            :alt="selectedApp.name"
            class="img-fluid rounded-1"
            width="48"
          />
          <!-- end::Logo -->

          <!-- begin::Info -->
          <div class="info">
            <h6 :class="`name text-app-${selectedApp.settings.color}`">{{ selectedApp.name }}</h6>

            <div class="other">
              <span class="text-primary">
                {{ convartAppType(selectedApp.type) }}
              </span>
              <span>•</span>
              <span>{{ $filters.capitalize(selectedApp.share_type) }}</span>
            </div>
          </div>
          <!-- end::Info -->
        </div>
        <!-- end::Main Info -->
      </div>
      <!-- end::Name Action -->

      <!-- begin::Info -->
      <div class="infos" v-if="mainLoading || balances.length">
        <div class="row gy-4">
          <template v-if="mainLoading">
            <!-- begin::Item -->
            <div class="col-6 col-md-3 item" v-for="item in 2" :key="item">
              <p class="value">
                <Skeletor width="80px" class="rounded-0" />
              </p>
              <p class="title">
                <Skeletor class="rounded-0" />
              </p>
            </div>
            <!-- end::Item -->
          </template>

          <!-- begin::Item -->
          <div
            class="col-6 col-md-3 item cursor-pointer"
            @click="selectBalance(item)"
            v-for="(item, index) in balances"
            :key="index"
          >
            <p class="value">
              {{
                Number(item.balance)
                  .toFixed(item.decimals)
                  .replace(/\.?0+$/, '')
              }}
            </p>
            <p class="title">{{ item.symbol }} ({{ item.network.name }})</p>
          </div>
          <!-- end::Item -->
        </div>
      </div>
      <!-- end::Info -->
    </div>
  </div>
</template>
