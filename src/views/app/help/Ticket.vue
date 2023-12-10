<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useTicketStore } from '@/stores/ticket'

// Hooks
import useAccordion from '@/hooks/useAccordion'

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

// Components
import CreateTicket from '../../../components/help/ticket/CreateTicket.vue'
import TicketItem from '../../../components/help/ticket/TicketItem.vue'
import CategoryItem from '../../../components/globals/Categoryitem.vue'
import AccordionItemLoading from '../../../components/loadings/AccordionItemLoading.vue'
import CategoryItemLoading from '../../../components/loadings/CategoryItemLoading.vue'
import PaginationCard from '../../../components/globals/PaginationCard.vue'

// ----- START ----- //
const store = useTicketStore()

const { checkActiveAccordion } = useAccordion()

// Refs
const loadings = ref({
  create: false,
  department: false,
  list: false,
  pagination: false
})
const departments = ref([])
const selectedDepartment = ref('')
const list = ref([])
const lastPage = ref(1)
const currentPage = ref(1)
const totals = ref(0)

// Computeds
const filteredList = computed(() => {
  return list.value.filter((item) => item.department_id == selectedDepartment.value)
})

// Functions

const checkMessageCount = (departmentId) => {
  const filtered = list.value.filter((item) => item.department_id == departmentId)

  return filtered.length
}

/**
 * Add New Ticket To List
 */
const addNew = (ticket) => {
  list.value.unshift(ticket)
}

/**
 * Get Ticket Departments
 */
const getTicketDepartments = async () => {
  // Start Loading
  loadings.value.list = true
  loadings.value.department = true

  // Request
  await store.getTicketDepartments().then((res) => {
    if (res) {
      departments.value = res
      selectedDepartment.value = departments.value[0].id
    }
  })

  // Stop Loading
  loadings.value.list = false
  loadings.value.department = false
}

/**
 * Get Ticket List
 */
const getTicketList = async (page) => {
  // Start Loading
  if (page === 1) {
    loadings.value.list = true
  } else {
    loadings.value.pagination = true
  }

  // Set Variables
  let params = new URLSearchParams()
  params.set('page', `${page}`)
  params.set('pageSize', '100')
  params.set('column', 'updated_at')
  params.set('direction', 'desc')

  // Request
  await store.getTicketList(params).then((res) => {
    if (res) {
      if (page === 1) {
        list.value = res.list
      } else {
        list.value = [...list.value, ...res.list]
      }
      currentPage.value = page
      lastPage.value = res.lastPage
      totals.value = res.total
    }
  })

  // Stop Loading
  loadings.value.list = false
  loadings.value.pagination = false
}

onMounted(async () => {
  await getTicketDepartments()
  await getTicketList(1)
  checkActiveAccordion('ticketAccordion')
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
      <template v-if="loadings.department">
        <SwiperSlide v-for="item in 2" :key="item">
          <CategoryItemLoading />
        </SwiperSlide>
      </template>

      <SwiperSlide v-for="item in departments" :key="item.id" @click="selectedDepartment = item.id">
        <CategoryItem
          :active="selectedDepartment === item.id"
          :title="item.name"
          icon="chat"
          :subject="`${checkMessageCount(item.id)} Ticket`"
        />
      </SwiperSlide>
    </Swiper>
  </div>
  <!-- end::Categories -->

  <!-- begin::Create Message -->
  <CreateTicket :department="selectedDepartment" @addNew="addNew" />
  <!-- end::Create Message -->

  <AccordionItemLoading v-if="loadings.list" />

  <template v-else>
    <!-- begin::Accordion -->
    <div class="accordion" id="ticketAccordion">
      <TicketItem v-for="(item, index) in filteredList" :key="index" :item="item" />
    </div>
    <!-- end::Accordion -->

    <!-- begin::No Ticket Image -->
    <inline-svg
      v-if="!filteredList.length"
      src="/media/icons/shapes/no-ticket.svg"
      class="d-block mx-auto mt-10"
    ></inline-svg>
    <!-- end::No Ticket Image -->

    <PaginationCard
      class="mt-4"
      v-if="lastPage > currentPage"
      :bold="false"
      text="Show More Tickets"
      :count="totals - list.length"
      :loading="loadings.pagination"
      @clicked="getTicketList(currentPage + 2)"
    />
  </template>
</template>
