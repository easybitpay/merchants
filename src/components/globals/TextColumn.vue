<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  loading: {
    type: Boolean
  },
  canvasId: {
    type: String,
    required: false
  }
})
</script>
<template>
  <div class="row ls-base">
    <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2 text-gray-800 lh-24px">{{ title }}</div>

    <div class="col-sm-7 col-md-8 col-lg-9 col-xl-10 d-flex justify-content-start">
      <div
        class="w-100 w-lg-initial d-flex justify-content-between justify-content-lg-start text-hover-primary hover-sm-show-parent text-break"
        :data-bs-toggle="canvasId ? 'offcanvas' : ''"
        :data-bs-target="canvasId ? `#${canvasId}` : ''"
        :aria-controls="canvasId ? `${canvasId}` : ''"
      >
        {{ content }}

        <inline-svg
          src="media/icons/icons/arrow-right.svg"
          class="svg-icon-primary hover-show-target d-none ms-0 ms-lg-16"
        ></inline-svg>
      </div>
    </div>
  </div>
</template>
