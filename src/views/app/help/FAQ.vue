<script setup>
// Vue
import { onMounted } from 'vue'

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

// ----- START ----- //
const checkActiveAccordion = () => {
  const accordion = document.querySelector('#faqAccordion')

  const accordionItems = accordion.querySelectorAll('.accordion-item')

  accordionItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      item.classList.toggle('accordion-active')

      removeClass(index)
    })
  })
  const removeClass = (clickedIndex) => {
    accordionItems.forEach((item, index) => {
      if (clickedIndex !== index) {
        item.classList.remove('accordion-active')
      }
    })
  }
}

onMounted(() => {
  checkActiveAccordion()
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

  <!-- begin::Accordion -->
  <div class="accordion" id="faqAccordion">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#faqOne"
          aria-expanded="true"
          aria-controls="faqOne"
        >
          How do I deal with Bitcoin’sprice volatility?
        </button>
      </h2>
      <div id="faqOne" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
        <div class="accordion-body">
          If you are a risk-averse business, you can accept bitcoin payments without ever worrying
          about the price volatility that comes with it. The automatic conversion and split
          settlement features let businesses choose to have their bitcoin payments automatically
          converted to our supported currencies, either in full or as a percentage, at the time of a
          transaction.

          <!-- begin::User Reaction -->
          <div class="d-flex flex-column flex-md-row justify-content-between gap-4 mt-24">
            <!-- begin::Question Box -->
            <div
              class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between justify-content-md-start w-100 row-gap-3"
            >
              <!-- begin::Question -->
              <p class="mb-0 text-gray-600">Did this answer your question?</p>
              <!-- end::Question -->

              <!-- begin::Emojies -->
              <div class="d-flex gap-4 ms-0 ms-sm-8">
                <img src="media/icons/emoji/happy.png" class="cursor-pointer" />
                <img src="media/icons/emoji/sad.png" class="cursor-pointer" />
                <img src="media/icons/emoji/neutral.png" class="cursor-pointer" />
              </div>
              <!-- end::Emojies -->
            </div>
            <!-- end::Question Box -->

            <!-- begin::Need Edit -->
            <div>
              <button class="btn btn-sm btn-light w-136px h-24px">Need to Edit</button>
            </div>
            <!-- end::Need Edit -->
          </div>
          <!-- end::User Reaction -->
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#faqTwo"
          aria-expanded="false"
          aria-controls="faqTwo"
        >
          What is lightning network (LN)?
        </button>
      </h2>
      <div id="faqTwo" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
        <div class="accordion-body">
          If you are a risk-averse business, you can accept bitcoin payments without ever worrying
          about the price volatility that comes with it. The automatic conversion and split
          settlement features let businesses choose to have their bitcoin payments automatically
          converted to our supported currencies, either in full or as a percentage, at the time of a
          transaction.
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#faqThree"
          aria-expanded="false"
          aria-controls="faqThree"
        >
          Accordion Item #3
        </button>
      </h2>
      <div id="faqThree" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
        <div class="accordion-body">
          If you are a risk-averse business, you can accept bitcoin payments without ever worrying
          about the price volatility that comes with it. The automatic conversion and split
          settlement features let businesses choose to have their bitcoin payments automatically
          converted to our supported currencies, either in full or as a percentage, at the time of a
          transaction.
        </div>
      </div>
    </div>
  </div>
  <!-- end::Accordion -->
</template>
