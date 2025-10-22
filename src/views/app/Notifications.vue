<script setup>
// Vue
import { ref, onMounted } from 'vue'

// Hook
import useAccordion from '@/composables/useAccordion'

// Component
import PaginationCard from '../../components/globals/PaginationCard.vue'

// ----- START ----- //
const types = ref([
  {
    title: 'All',
    color: '#fff',
    bg: '#4FC3F7',
    border: '#4FC3F7'
  },
  {
    title: 'Exchange',
    color: '#C5CF69',
    bg: '#F9FBE7',
    border: '#C5CF69'
  },
  {
    title: 'Payments',
    color: '#7986CB',
    bg: '#E8EAF6',
    border: '#7986CB'
  },
  {
    title: 'Login',
    color: '#4DB6AC',
    bg: '#E0F2F1',
    border: '#4DB6AC'
  },
  {
    title: 'Join',
    color: '#BA68C8',
    bg: '#F3E5F5',
    border: '#BA68C8'
  },
  {
    title: 'Sandbox',
    color: '#FF8A65',
    bg: '#FBE9E7',
    border: '#FF8A65'
  }
])

const { checkActiveAccordion } = useAccordion()

onMounted(() => {
  checkActiveAccordion('notifAccordion')
})
</script>
<template>
  <!-- begin::Header -->
  <h2 class="text-primary fw-normal mb-12 neue-machina">Notifications</h2>
  <!-- end::Header -->

  <!-- begin::text -->
  <p class="mb-6">Latest clicks/conversions. Where you currently have the logo for merchant</p>
  <!-- end::text -->

  <!-- begin::Types -->
  <div class="notification-types">
    <!-- begin::Item -->
    <div
      class="item"
      :style="`--color: ${item.color}; --bg: ${item.bg}; --border: ${item.border}`"
      v-for="(item, index) in types"
      :key="index"
    >
      {{ item.title }}
    </div>
    <!-- end::Item -->
  </div>
  <!-- end::Types -->

  <!-- begin::Accordion -->
  <div class="accordion mb-4" id="notifAccordion">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#notifOne"
          aria-expanded="true"
          aria-controls="notifOne"
        >
          <div class="d-flex align-items-center justify-content-between flex-wrap w-100 gap-4 me-6">
            <!-- begin::Text Info -->
            <div class="d-flex gap-6">
              <inline-svg src="media/icons/icons/valid-form.svg"></inline-svg>

              <div class="d-flex flex-wrap align-items-end row-gap-2 column-gap-6">
                <p class="fw-medium fs-7 text-gray-900 mb-0 title">You Joined as partner</p>

                <small class="text-gray-500 date"> Yesterday, 07:28 pm </small>
              </div>
            </div>
            <!-- end::Text Info -->

            <!-- begin::Action -->
            <div class="d-flex align-items-center gap-4">
              <!-- begin::Cancel -->
              <button class="btn btn-sm bg-gray-300 text-danger w-md-104px h-24px ls-base fw-normal">
                Cancel
              </button>
              <!-- end::Cancel -->

              <!-- begin::Delete -->
              <button class="btn btn-sm btn-danger w-md-104px h-24px ls-base fw-normal">Delete</button>
              <!-- end::Delete -->
            </div>
            <!-- end::Action -->
          </div>
        </button>
      </h2>
      <div id="notifOne" class="accordion-collapse collapse" data-bs-parent="#notifAccordion">
        <div class="accordion-body text-gray-700">
          If you are a risk-averse business, you can accept bitcoin payments without ever worrying
          about the price volatility that comes with it. The automatic conversion and split
          settlement features let businesses choose to have their bitcoin payments automatically
          converted to our supported currencies, either in full or as a percentage, at the time of a
          transaction.

          <!-- begin::Date -->
          <p class="mt-12 mb-0 text-gray-600">Yesterday, 07:28 pm</p>
          <!-- end::Date -->
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#notifTwo"
          aria-expanded="false"
          aria-controls="notifTwo"
        >
          <div class="d-flex align-items-center justify-content-between flex-wrap w-100 gap-4 me-6">
            <!-- begin::Text Info -->
            <div class="d-flex gap-6">
              <inline-svg src="media/icons/icons/valid-form.svg"></inline-svg>

              <div class="d-flex flex-wrap align-items-end row-gap-2 column-gap-6">
                <p class="fw-medium fs-7 text-gray-900 mb-0 title">You Joined as partner</p>

                <small class="text-gray-500 date"> Yesterday, 07:28 pm </small>
              </div>
            </div>
            <!-- end::Text Info -->

            <!-- begin::Action -->
            <div class="d-flex align-items-center gap-4">
              <!-- begin::Cancel -->
              <button class="btn btn-sm bg-gray-300 text-danger w-md-104px h-24px ls-base fw-normal">
                Cancel
              </button>
              <!-- end::Cancel -->

              <!-- begin::Delete -->
              <button class="btn btn-sm btn-danger w-md-104px h-24px ls-base fw-normal">Delete</button>
              <!-- end::Delete -->
            </div>
            <!-- end::Action -->
          </div>
        </button>
      </h2>
      <div id="notifTwo" class="accordion-collapse collapse" data-bs-parent="#notifAccordion">
        <div class="accordion-body text-gray-700">
          If you are a risk-averse business, you can accept bitcoin payments without ever worrying
          about the price volatility that comes with it. The automatic conversion and split
          settlement features let businesses choose to have their bitcoin payments automatically
          converted to our supported currencies, either in full or as a percentage, at the time of a
          transaction.

          <!-- begin::Date -->
          <p class="mt-12 mb-0 text-gray-600">Yesterday, 07:28 pm</p>
          <!-- end::Date -->
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#notifThree"
          aria-expanded="false"
          aria-controls="notifThree"
        >
          <div class="d-flex align-items-center justify-content-between flex-wrap w-100 gap-4 me-6">
            <!-- begin::Text Info -->
            <div class="d-flex gap-6">
              <inline-svg src="media/icons/icons/valid-form.svg"></inline-svg>

              <div class="d-flex flex-wrap align-items-end row-gap-2 column-gap-6">
                <p class="fw-medium fs-7 text-gray-900 mb-0 title">You Joined as partner</p>

                <small class="text-gray-500 date"> Yesterday, 07:28 pm </small>
              </div>
            </div>
            <!-- end::Text Info -->

            <!-- begin::Action -->
            <div class="d-flex align-items-center gap-4">
              <!-- begin::Cancel -->
              <button class="btn btn-sm bg-gray-300 text-danger w-md-104px h-24px ls-base fw-normal">
                Cancel
              </button>
              <!-- end::Cancel -->

              <!-- begin::Delete -->
              <button class="btn btn-sm btn-danger w-md-104px h-24px ls-base fw-normal">Delete</button>
              <!-- end::Delete -->
            </div>
            <!-- end::Action -->
          </div>
        </button>
      </h2>
      <div id="notifThree" class="accordion-collapse collapse" data-bs-parent="#notifAccordion">
        <div class="accordion-body text-gray-700">
          If you are a risk-averse business, you can accept bitcoin payments without ever worrying
          about the price volatility that comes with it. The automatic conversion and split
          settlement features let businesses choose to have their bitcoin payments automatically
          converted to our supported currencies, either in full or as a percentage, at the time of a
          transaction.

          <!-- begin::Date -->
          <p class="mt-12 mb-0 text-gray-600">Yesterday, 07:28 pm</p>
          <!-- end::Date -->
        </div>
      </div>
    </div>
  </div>
  <!-- end::Accordion -->

  <!-- begin::Pagination -->
  <PaginationCard text="All October Notifications"/>
  <!-- end::Pagination -->
</template>
