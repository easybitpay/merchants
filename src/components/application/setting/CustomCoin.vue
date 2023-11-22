<script setup>
import AddCustomTokenOffcanvas from './AddCustomTokenOffcanvas.vue'
</script>
<template>
  <!-- begin::Custom Coin -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Custom Coin</h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-4 mb-10">
      <!-- begin::Item -->
      <div class="row row-gap-2 ls-base">
        <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2 lh-24px text-gray-900">
          Firest Custom Coin
        </div>

        <div class="col-sm-7 col-md-8 col-lg-9 col-xl-10 d-flex justify-content-start">
          <div
            class="w-100 w-lg-initial gap-4 d-flex text-gray-700 text-hover-primary hover-sm-show-parent"
          >
            <img src="https://panel.easybitpay.com/icons/32/color/trx.png" alt="trx" height="24" />

            PLUS COIN

            <inline-svg
              src="media/icons/icons/arrow-right.svg"
              class="svg-icon-primary hover-show-target d-none ms-0 ms-lg-16"
            ></inline-svg>
          </div>
        </div>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="row row-gap-2 ls-base">
        <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2 lh-24px text-gray-900">
          Secend Custom Coin
        </div>

        <div class="col-sm-7 col-md-8 col-lg-9 col-xl-10 d-flex justify-content-start">
          <div
            class="w-100 w-lg-initial gap-4 d-flex text-gray-700 text-hover-primary hover-sm-show-parent"
          >
            <img src="https://panel.easybitpay.com/icons/32/color/trx.png" alt="trx" height="24" />

            VINI COIN

            <inline-svg
              src="media/icons/icons/arrow-right.svg"
              class="svg-icon-primary hover-show-target d-none ms-0 ms-lg-16"
            ></inline-svg>
          </div>
        </div>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->

    <!-- begin::Add Coin -->
    <button
      class="btn btn-primary px-5"
      data-bs-toggle="offcanvas"
      data-bs-target="#addCustomToken_offcanvas"
      aria-controls="addCustomToken_offcanvas"
    >
      Create Custom Coin
    </button>
    <!-- end::Add Coin -->
  </div>
  <!-- end::Custom Coin -->

  <AddCustomTokenOffcanvas />
</template>
