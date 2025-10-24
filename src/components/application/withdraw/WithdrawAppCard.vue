<script setup>
// Vue
import { computed, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hook
import useIconImage from '@/hooks/useIconImage'

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
 * Emit Select Balance
 * @param {balance item} balance
 */
const selectBalance = (balance) => {
  emit('onSelectBalance', balance)
}
</script>

<template>
  <div
    class="card gradient-image-box application-card mb-10"
    :style="`--background: url(${
      selectedApp.banner ? storageImage(selectedApp.banner) : '/media/images/banner/auth-bg.jpg'
    })`"
  >
    <div class="card-body d-flex flex-column align-items-start w-100 overflow-auto">
      <p class="fs-7 text-gray-600 ls-base mb-0">Available in</p>

      <!-- begin::Name -->
      <h2 :class="`name text-app-${selectedApp.settings.color} neue-machina`">{{ selectedApp.name }}</h2>
      <!-- end::Name -->

      <!-- begin::Info -->
      <div class="infos mt-6">
        <template v-if="mainLoading">
          <div class="item" v-for="item in 2" :key="item">
            <p class="value">
              <Skeletor width="80px" class="rounded-0" />
            </p>
            <p class="title">
              <Skeletor class="rounded-0" />
            </p>
          </div>
        </template>

        <template v-else>
          <Swiper :slidesPerView="'auto'" :freeMode="true" v-if="balances.length" class="mySwiper w-100">
            <SwiperSlide
              v-for="(item, index) in balances"
              :key="index"
              @click="selectBalance(item)"
            >
              <div class="item cursor-pointer">
                <p class="value">
                  {{
                    Number(item.balance)
                      .toFixed(item.decimals)
                      .replace(/\.?0+$/, '')
                  }}
                </p>
                <p class="title cursor-pointer">{{ item.symbol }} ({{ item.network.name }})</p>
              </div>
            </SwiperSlide>
          </Swiper>

          <template v-else>
            <div class="item cursor-pointer">
              <p class="value">$0</p>
              <p class="title cursor-pointer">Available</p>
            </div>
          </template>
        </template>
      </div>
      <!-- end::Info -->
    </div>
  </div>
</template>
