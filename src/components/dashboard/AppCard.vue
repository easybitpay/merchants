<script setup></script>
<template>
  <div
    class="card border-purple-500 rounded h-100 min-h-481px gradient-image-box"
    style="--background: url(/media/images/banner/auth-bg.jpg)"
  >
    <div class="card-body d-flex flex-column justify-content-between">
      <!-- begin::Top -->
      <div>
        <!-- begin::Partners -->
        <div class="partners mb-6">
          <!-- begin::Item -->
          <span class="item">
            <img src="/media/images/banner/auth-bg.jpg" alt="partner" />
          </span>
          <!-- end::Item -->

          <!-- begin::Item -->
          <span class="item">
            <img src="/media/images/banner/auth-bg.jpg" alt="partner" />
          </span>
          <!-- end::Item -->

          <!-- begin::Item -->
          <span class="item">
            <img src="/media/images/banner/auth-bg.jpg" alt="partner" />
          </span>
          <!-- end::Item -->
        </div>
        <!-- end::Partners -->

        <!-- begin::Type -->
        <p class="mb-2">Reporter</p>
        <!-- end::Type -->

        <!-- begin::Name -->
        <h2 class="mb-0 text-purple-500">Mini Games</h2>
        <!-- end::Name -->
      </div>
      <!-- end::Top -->

      <!-- begin::Bottom -->
      <div>
        <!-- begin::Balance Infos -->
        <div class="value-infos mb-8">
          <!-- begin::Item -->
          <div class="item">
            <p class="value">$135.00</p>
            <p class="title">Total Earning</p>
          </div>
          <!-- end::Item -->
          <!-- begin::Item -->
          <div class="item">
            <p class="value">$42.00</p>
            <p class="title">Withdrawn</p>
          </div>
          <!-- end::Item -->
        </div>
        <!-- end::Balance Infos -->

        <!-- begin::Link -->
        <RouterLink :to="{ name: 'application-overview' }" class="btn btn-primary w-100">
          Full View
          <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
        </RouterLink>
        <!-- end::Link -->
      </div>
      <!-- begin::Bottom -->
    </div>
  </div>
</template>
