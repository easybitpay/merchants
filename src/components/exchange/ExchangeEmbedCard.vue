<script setup></script>

<template>
  <div class="card  mt-6">
    <div
      class="card-body p-4 d-flex flex-wrap row-gap-4 align-items-center justify-content-between"
    >
      <!-- begin::Title -->
      <div class="d-flex align-items-center gap-4">
        <div>
          <div class="svg-holder svg-holder-sm">
            <inline-svg
              :src="`/media/icons/shapes/${$filters.shapeStatus('embed')}.svg`"
              width="33"
              height="29"
            ></inline-svg>
          </div>
        </div>
        <p class="mb-0">
          Embed Exchange In Your Website

          <RouterLink :to="{ name: 'help-knowledge' }" class="text-primary fw-medium">
            Read more
          </RouterLink>
        </p>
      </div>
      <!-- end::Title -->

      <!-- begin::Action -->
      <button
        class="btn btn-primary w-100 w-md-175px w-lg-200px w-xl-225px fw-nomral"
        data-bs-toggle="offcanvas"
        data-bs-target="#exchangeEmbed_offcanvas"
        aria-controls="exchangeEmbed_offcanvas"
      >
        Embed
      </button>
      <!-- end::Action -->
    </div>
  </div>
</template>
