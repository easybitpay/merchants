<script setup></script>
<template>
  <!-- begin::Header -->
  <h2 class="text-primary fw-normal mb-12 roboto-mono">Applications</h2>
  <!-- end::Header -->

  <div class="d-flex flex-column gap-6">
    <!-- begin::Item -->
    <div
      v-for="item in 2"
      :key="item"
      :class="[
        { 'card gradient-image-box application-card': true },
        { 'have-partners disabled': item === 1 }
      ]"
      style="--background: url(media/images/banner/auth-bg.jpg)"
    >
      <div
        class="card-body d-flex flex-column flex-lg-row align-items-start align-items-lg-end gap-4"
      >
        <div class="d-flex flex-column align-items-start w-100 overflow-auto">
          <div class="mb-4">
            <!-- begin::Type -->
            <span class="type"> API </span>
            <!-- end::Type -->

            <!-- begin::Partners -->
            <div class="partners">
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
          </div>

          <!-- begin::Share Type -->
          <p class="mb-0 fs-7 ls-base text-gray-600">as Partner</p>
          <!-- end::Share Type -->

          <!-- begin::Name -->
          <h2 class="name text-indigo-400 neue-machina">
            <inline-svg src="media/icons/icons/stop.svg" height="32"></inline-svg>
            Mini Games
          </h2>
          <!-- end::Name -->

          <!-- begin::Info -->
          <div class="infos mt-6">
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

            <!-- begin::Item -->
            <div class="item">
              <p class="value">$30.00</p>
              <p class="title">Earned in July</p>
            </div>
            <!-- end::Item -->

            <!-- begin::Item -->
            <div class="item">
              <p class="value">$76.00</p>
              <p class="title">Available</p>
            </div>
            <!-- end::Item -->
          </div>
          <!-- end::Info -->
        </div>
        <!-- begin::Action -->
        <div class="enter-btn">
          <div class="w-200px">
            <RouterLink :to="{ name: 'dashboard' }" class="btn btn-primary w-100">
              Enter

              <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
            </RouterLink>
          </div>
        </div>
        <!-- end::Action -->
      </div>
    </div>
    <!-- end::Item -->
  </div>

  <!-- begin::Add New App -->
  <RouterLink :to="{ name: 'dashboard' }" class="btn btn-primary w-200px mt-6">
    Add new Service
  </RouterLink>
  <!-- end::Add New App -->
</template>
