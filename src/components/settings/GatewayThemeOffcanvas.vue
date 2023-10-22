<script setup>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

import 'swiper/css/navigation'
import 'swiper/css/pagination'

// import required modules
import { Navigation } from 'swiper/modules'
import { Pagination } from 'swiper/modules'

const modules = [Navigation, Pagination]

// ----- START ----- //
</script>

<template>
  <!-- <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button> -->
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="gatewayTheme_offcanvas"
    aria-labelledby="offcanvasGatewayTheme"
  >
    <div class="offcanvas-body">
      <!-- begin::Content Card -->
      <div class="card border-0 mb-4">
        <div class="card-body">
          <!-- begin::Header -->
          <div class="d-flex gap-4">
            <div>
              <inline-svg src="media/icons/shapes/store.svg"></inline-svg>
            </div>

            <div class="mb-6">
              <h3 class="mb-0 text-gray-900">Gateway Theme</h3>

              <p class="fs-7 mb-0 text-gray-800 ls-base">
                Some info may be visible to other people using Google services.
              </p>
            </div>
          </div>
          <!-- end::Header -->

          <!-- begin::Content -->
          <div>
            <Swiper
              :spaceBetween="16"
              :navigation="true"
              :pagination="{ clickable: true }"
              :modules="modules"
              class="mySwiper"
            >
              <SwiperSlide>
                <img src="media/images/banner/theme.png" alt="theme" class="img-fluid rounded-1" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="media/images/banner/theme.png" alt="theme" class="img-fluid rounded-1" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="media/images/banner/theme.png" alt="theme" class="img-fluid rounded-1" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="media/images/banner/theme.png" alt="theme" class="img-fluid rounded-1" />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="media/images/banner/auth-bg.jpg"
                  alt="theme"
                  class="img-fluid rounded-1"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img src="media/images/banner/theme.png" alt="theme" class="img-fluid rounded-1" />
              </SwiperSlide>
            </Swiper>
          </div>
          <!-- end::Content -->
        </div>
      </div>
      <!-- end::Content Card -->

      <!-- begin::Action Card -->
      <div class="d-flex gap-4">
        <div class="d-none d-md-flex">
          <div
            class="w-56px h-56px d-flex align-items-center justify-content-center rounded bg-white"
          >
            <inline-svg src="media/icons/shapes/bookmark.svg"></inline-svg>
          </div>
        </div>
        <div class="card border-0 mb-6 w-100">
          <div
            class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
          >
            <p class="fs-7 mb-0 ls-base text-gray-800 lh-32px">
              Latest clicks/conversions. Are you sure?
            </p>

            <!-- begin::Actions -->
            <div class="d-flex gap-4 w-100 w-sm-initial">
              <button
                type="button"
                class="btn btn-sm bg-gray-500 text-white w-100 w-sm-104px h-24px ls-base fw-normal"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                Cancel
              </button>

              <button type="submit" class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base fw-normal">
                Apply
              </button>
            </div>
            <!-- end::Actions -->
          </div>
        </div>
      </div>
      <!-- end::Action Card -->
    </div>
  </div>
</template>
