<script setup>
// ----- Start -----
const types = [
  {
    type: 1,
    title: 'Standard Gateway',
    subject: 'Best Gateway for online shop'
  },
  {
    type: 2,
    title: 'Donate',
    subject: 'Best Gateway for online shop'
  },
  {
    type: 3,
    title: 'Fix Prices',
    subject: 'Best Gateway for online shop'
  }
]
</script>

<template>
  <!-- begin::Title -->
  <div class="mb-10">
    <h4 class="text-primary mb-2 neue-machina fw-normal">Choose Gateway Type</h4>
    <p class="mb-0 ls-base">If you need more info, please check out Help Page.</p>
  </div>
  <!-- begin::Title -->

  <div class="d-flex flex-column gap-6">
    <!-- begin::Item -->
    <div class="card rounded-xl border-gray-200" v-for="(item, index) in types" :key="index">
      <div class="card-body">
        <inline-svg src="media/icons/shapes/embed.svg" height="40" class="mb-6"></inline-svg>

        <div class="d-flex align-items-end justify-content-between gap-4">
          <!-- begin::Title & Subject -->
          <div>
            <h5 class="text-primary mb-2">
              {{ item.title }}
            </h5>

            <p class="fs-7 mb-0">{{ item.subject }}</p>
          </div>
          <!-- end::Title & Subject -->
        </div>
      </div>
    </div>
    <!-- end::Item -->
  </div>
</template>
