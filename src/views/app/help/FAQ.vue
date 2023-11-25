<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hook
import useAccordion from '@/hooks/useAccordion'

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

// Components
import FAQItem from '../../../components/help/faq/FAQItem.vue'
import AccordionItemLoading from '../../../components/loadings/AccordionItemLoading.vue'

// ----- START ----- //

// Generals
const store = useAppStore()
const { checkActiveAccordion } = useAccordion()

// Refs
const loading = ref(false)
const list = ref([])

// Functions

/**
 * Get FAQ List
 */
const getFAQList = async () => {
  // Start Loading
  loading.value = true

  // Request
  await store.getFAQList().then((res) => {
    if (res) {
      list.value = res
    }
  })

  // Stop Loading
  loading.value = false
}

onMounted(async () => {
  await getFAQList()
  checkActiveAccordion('faqAccordion')
})
</script>
<template>
  <!-- begin::Categories -->
  <div>
    <Swiper
      :slidesPerView="1.2"
      :spaceBetween="16"
      :breakpoints="{
        '450': {
          slidesPerView: 2
        },
        '576': {
          slidesPerView: 3
        },
        '768': {
          slidesPerView: 4
        },
        '1200': {
          slidesPerView: 5
        },
        '1400': {
          slidesPerView: 6
        }
      }"
      class="mySwiper swiper-tab"
    >
      <SwiperSlide>
        <!-- begin::Card -->
        <div class="card border-gray-200 cursor-pointer">
          <div class="card-body p-4 text-gray-800">
            <!-- begin::Icon -->
            <inline-svg src="media/icons/shapes/wallet.svg" height="33"></inline-svg>
            <!-- end::Icon -->

            <!-- begin::Title -->
            <h5 class="mt-5 mb-4 neue-machina h-48px active-parent-text-primary">
              Payments overview
            </h5>
            <!-- end::Title -->

            <!-- begin::Count -->
            <small class="text-gray-500">19 FAQ</small>
            <!-- end::Count -->
          </div>
        </div>
        <!-- end::Card -->
      </SwiperSlide>
      <SwiperSlide>
        <!-- begin::Card -->
        <div class="card border-primary cursor-pointer transition-all active-box active-tab-shadow">
          <div class="card-body p-4 text-gray-800">
            <!-- begin::Icon -->
            <inline-svg src="media/icons/shapes/coin.svg" height="33"></inline-svg>
            <!-- end::Icon -->

            <!-- begin::Title -->
            <h5 class="mt-5 mb-4 neue-machina h-48px active-parent-text-primary">
              Currency conversion
            </h5>
            <!-- end::Title -->

            <!-- begin::Count -->
            <small class="text-gray-500">17 FAQ</small>
            <!-- end::Count -->
          </div>
        </div>
        <!-- end::Card -->
      </SwiperSlide>
      <SwiperSlide>
        <!-- begin::Card -->
        <div class="card border-gray-200 cursor-pointer">
          <div class="card-body p-4 text-gray-800">
            <!-- begin::Icon -->
            <inline-svg src="media/icons/shapes/person.svg" height="33"></inline-svg>
            <!-- end::Icon -->

            <!-- begin::Title -->
            <h5 class="mt-5 mb-4 neue-machina h-48px active-parent-text-primary">
              Hosted checkout
            </h5>
            <!-- end::Title -->

            <!-- begin::Count -->
            <small class="text-gray-500">17 FAQ</small>
            <!-- end::Count -->
          </div>
        </div>
        <!-- end::Card -->
      </SwiperSlide>
      <SwiperSlide>
        <!-- begin::Card -->
        <div class="card border-gray-200 cursor-pointer">
          <div class="card-body p-4 text-gray-800">
            <!-- begin::Icon -->
            <inline-svg src="media/icons/shapes/trash.svg" height="33"></inline-svg>
            <!-- end::Icon -->

            <!-- begin::Title -->
            <h5 class="mt-5 mb-4 neue-machina h-48px active-parent-text-primary">
              Security & Protection
            </h5>
            <!-- end::Title -->

            <!-- begin::Count -->
            <small class="text-gray-500">17 FAQ</small>
            <!-- end::Count -->
          </div>
        </div>
        <!-- end::Card -->
      </SwiperSlide>
      <SwiperSlide>
        <!-- begin::Card -->
        <div class="card border-gray-200 cursor-pointer">
          <div class="card-body p-4 text-gray-800">
            <!-- begin::Icon -->
            <inline-svg src="media/icons/shapes/message.svg" height="33"></inline-svg>
            <!-- end::Icon -->

            <!-- begin::Title -->
            <h5 class="mt-5 mb-4 neue-machina h-48px active-parent-text-primary">
              Payment buttons
            </h5>
            <!-- end::Title -->

            <!-- begin::Count -->
            <small class="text-gray-500">17 FAQ</small>
            <!-- end::Count -->
          </div>
        </div>
        <!-- end::Card -->
      </SwiperSlide>
      <SwiperSlide>
        <!-- begin::Card -->
        <div class="card border-gray-200 cursor-pointer">
          <div class="card-body p-4">
            <!-- begin::Icon -->
            <inline-svg src="media/icons/shapes/transfer.svg" height="33"></inline-svg>
            <!-- end::Icon -->

            <!-- begin::Title -->
            <h5 class="mt-5 mb-4 neue-machina h-48px active-parent-text-primary">
              Settlement & Transfer
            </h5>
            <!-- end::Title -->

            <!-- begin::Count -->
            <small class="text-gray-500">17 FAQ</small>
            <!-- end::Count -->
          </div>
        </div>
        <!-- end::Card -->
      </SwiperSlide>
    </Swiper>
  </div>
  <!-- end::Categories -->

  <AccordionItemLoading v-if="loading" />

  <!-- begin::Accordion -->
  <div class="accordion" id="faqAccordion">
    <FAQItem v-for="(item, index) in list" :key="index" :item="item" />
  </div>
  <!-- end::Accordion -->
</template>
