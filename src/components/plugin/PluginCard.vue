<script setup></script>

<template>
  <div
    class="card gradient-image-box plugin-card "
    style="--background: url(/media/images/banner/auth-bg.jpg)"
  >
    <div
      class="card-body d-flex flex-column flex-lg-row align-items-start align-items-lg-end gap-4"
    >
      <div class="d-flex flex-column align-items-start w-100 overflow-auto">
        <img src="/media/icons/companies/wordpress.png" alt="wordpress" class="img-fluid mb-2" />

        <!-- begin::Type -->
        <p class="mb-2 ls-base">Plugin</p>
        <!-- end::Type -->

        <!-- begin::Name -->
        <h2 class="text-purple-500 mb-0">Wordpress</h2>
        <!-- end::Name -->

        <!-- begin::Info -->
        <div class="infos mt-6">
          <!-- begin::Item -->
          <div class="item">
            <p class="value">12.32 mb</p>
            <p class="title">Size</p>
          </div>
          <!-- end::Item -->

          <!-- begin::Item -->
          <div class="item">
            <p class="value">2.34</p>
            <p class="title">Version</p>
          </div>
          <!-- end::Item -->

          <!-- begin::Item -->
          <div class="item">
            <p class="value">20.10.24</p>
            <p class="title">Realize</p>
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
      <div class="d-flex flex-wrap flex-lg-nowrap gap-4">
        <button type="button" class="btn bg-white p-0 w-40px h-40px">
          <inline-svg :src="`media/icons/shapes/${$filters.shapeStatus('documentation')}.svg`" height="24"></inline-svg>
        </button>

        <button class="btn btn-primary w-200px">
          Download
          <inline-svg src="media/icons/icons/download.svg"></inline-svg>
        </button>
      </div>
      <!-- end::Action -->
    </div>
  </div>
</template>
