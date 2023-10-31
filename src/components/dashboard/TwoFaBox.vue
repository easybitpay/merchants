<script setup></script>

<template>
  <div class="card border-0 two-fa-card mb-6">
    <div class="card-body pe-md-8">
      <h1 class="title mt-lg-18 mb-6 text-cyan-500 lh-1">2F Vertification</h1>

      <div class="d-flex align-items-center justify-content-between flex-wrap gap-4">
        <p class="info text-white mb-0">
          Latest clicks/conversions. Where you currently have the logo for merchant, we should
          instead have a logo that represent the referring traffic sources (ex. Google or Facebook).
        </p>

        <div>
          <RouterLink :to="{name: 'settings-privacy'}" class="btn btn-primary w-168px">
            Active
            <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
