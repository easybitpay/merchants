<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

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
import CategoryItemLoading from '../../../components/loadings/CategoryItemLoading.vue'
import ItemCategory from '../../../components/globals/ItemCategories.vue'

// ----- START ----- //

// Generals
const store = useAppStore()
const { checkActiveAccordion } = useAccordion()

// Refs
const loading = ref(false)
const list = ref([])
const categories = ref([])
const selectedCategory = ref('')

// Computeds
const filteredList = computed(() => {
  return list.value.filter((item) => item.category_id == selectedCategory.value)
})

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
      categories.value = res.faq_categories
      list.value = res.faqs
      selectedCategory.value = categories.value[0].id
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
  <div class="premium-faq-page">
    <!-- Categories -->
    <div v-if="loading || categories.length" class="categories-section">
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
        class="categories-swiper"
      >
        <template v-if="loading">
          <SwiperSlide v-for="item in 6" :key="item">
            <CategoryItemLoading />
          </SwiperSlide>
        </template>

        <template v-else>
          <SwiperSlide v-for="item in categories" :key="item.id" @click="selectedCategory = item.id">
            <ItemCategory
              :active="selectedCategory === item.id"
              :title="item.title"
              icon="wallet"
              :subject="`${item.count} FAQ`"
            />
          </SwiperSlide>
        </template>
      </Swiper>
    </div>

    <!-- FAQ List -->
    <div class="faq-list">
      <AccordionItemLoading v-if="loading" />

      <template v-else>
        <div class="faq-accordion">
          <FAQItem v-for="(item, index) in filteredList" :key="index" :item="item" />
        </div>

        <!-- Empty State -->
        <div v-if="!filteredList.length" class="empty-state">
          <inline-svg
            src="/media/icons/shapes/no-ticket.svg"
            class="empty-icon"
          ></inline-svg>
          <p class="empty-text">No FAQs available for this category</p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-faq-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.categories-section {
  margin-bottom: 2rem;
}

.categories-swiper {
  padding: 0.25rem;
}

.faq-list {
  max-width: 900px;
  margin: 0 auto;
}

.faq-accordion {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;

  .empty-icon {
    width: 120px;
    height: 120px;
    opacity: 0.5;
    margin-bottom: 1.5rem;
  }

  .empty-text {
    font-size: 0.9375rem;
    color: #6b7280;
    margin: 0;
  }
}
</style>
