<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Store
import { useTicketStore } from '@/stores/ticket'

// Hooks
import useForm from '@/hooks/useForm.js'
import useAccordion from '@/hooks/useAccordion'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

// Components
import TicketItem from '../../../components/help/ticket/TicketItem.vue'
import AccordionItemLoading from '../../../components/loadings/AccordionItemLoading.vue'
import PaginationCard from '../../../components/globals/PaginationCard.vue'

// ----- START ----- //
const store = useTicketStore()
const { showFeedBacks } = useForm()
const { checkActiveAccordion } = useAccordion()

// Refs
const loadings = ref({
  list: false,
  pagination: false
})
const list = ref([])
const lastPage = ref(1)
const currentPage = ref(1)
const totals = ref(0)

// Vuelidate
const form = ref({
  subject: null
})

const rules = {
  subject: {
    required: helpers.withMessage('Subject is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

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
  params.set('pageSize', '15')
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

/**
 * Create Ticket
 */
const createTicket = async () => {
  const result = await v$.value.$validate()
  if (result) {
    console.log('asd')
  } else {
    showFeedBacks()
  }
}

onMounted(async () => {
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
      <SwiperSlide>
        <!-- begin::Card -->
        <div class="card border-gray-200 cursor-pointer">
          <div class="card-body p-4 text-gray-800">
            <!-- begin::Icon -->
            <inline-svg src="/media/icons/shapes/wallet.svg" height="33"></inline-svg>
            <!-- end::Icon -->

            <!-- begin::Title -->
            <div class="mt-5 mb-2 d-flex align-items-center justify-content-between">
              <h5 class="m-0 neue-machina active-parent-text-primary">Finance</h5>
            </div>
            <!-- end::Title -->

            <!-- begin::Count -->
            <small class="text-gray-500">No Chat</small>
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
            <inline-svg src="/media/icons/shapes/coin.svg" height="33"></inline-svg>
            <!-- end::Icon -->

            <!-- begin::Title -->
            <div class="mt-5 mb-2 d-flex align-items-center justify-content-between">
              <h5 class="m-0 neue-machina active-parent-text-primary">Technical</h5>

              <span
                class="h-24px d-flex align-items-center justify-content-center bg-danger text-white rounded-pill"
                style="padding: 0 7px"
              >
                5
              </span>
            </div>
            <!-- end::Title -->

            <!-- begin::Count -->
            <small class="text-gray-500">New Message</small>
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
            <inline-svg src="/media/icons/shapes/person.svg" height="33"></inline-svg>
            <!-- end::Icon -->

            <!-- begin::Title -->
            <div class="mt-5 mb-2 d-flex align-items-center justify-content-between">
              <h5 class="m-0 neue-machina active-parent-text-primary">Finance</h5>
            </div>
            <!-- end::Title -->

            <!-- begin::Count -->
            <small class="text-gray-500">No Chat</small>
            <!-- end::Count -->
          </div>
        </div>
        <!-- end::Card -->
      </SwiperSlide>
    </Swiper>
  </div>
  <!-- end::Categories -->

  <!-- begin::Create Message -->
  <div class="card rounded-4 border-gray-200 mb-6">
    <div class="card-body">
      <form @submit.prevent="createTicket" class="d-flex flex-column flex-md-row gap-6">
        <!-- begin::Subject -->
        <div class="position-relative w-100">
          <input
            type="text"
            :class="[{ 'form-control': true }, { 'is-valid': !v$.subject.$invalid }]"
            placeholder="Subject"
            v-model="form.subject"
          />

          <div class="invalid-feedback form-control" v-if="v$.subject.$errors.length">
            <span> {{ v$.subject.$errors[0].$message }}</span>
          </div>
        </div>
        <!-- end::Subject -->

        <!-- begin::Action -->
        <div>
          <button class="btn btn-primary w-100 w-md-168px">Start New</button>
        </div>
        <!-- end::Action -->
      </form>
    </div>
  </div>
  <!-- end::Create Message -->

  <AccordionItemLoading v-if="loadings.list" />

  <template v-else>
    <!-- begin::Accordion -->
    <div class="accordion" id="ticketAccordion">
      <TicketItem v-for="(item, index) in list" :key="index" :item="item" />
    </div>
    <!-- end::Accordion -->

    <PaginationCard
      class="mt-4"
      v-if="lastPage > currentPage"
      :bold="false"
      text="Show More Tickets"
      :count="totals - list.length"
      :loading="loadings.pagination"
      @clicked="getTicketList(currentPage + 2)"
    />

    <!-- begin::No Ticket Image -->
    <inline-svg
      v-if="!list.length"
      src="/media/icons/shapes/no-ticket.svg"
      class="d-block mx-auto mt-10"
    ></inline-svg>
    <!-- end::No Ticket Image -->
  </template>
</template>
