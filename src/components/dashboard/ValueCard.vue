<script setup>
const props = defineProps({
  color: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: String
  },
  valuePrifix: {
    type: String,
    default: '$'
  },
  loading: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <div class="card">
    <div class="card-body d-flex align-items-center gap-3">
      <div
        :class="`w-48px h-48px bg-${color} rounded-1 shadow text-white d-flex align-items-center justify-content-center`"
      >
        <inline-svg src="media/icons/icons/plus.svg"></inline-svg>
      </div>

      <div class="d-flex flex-column justify-content-between">
        <p class="mb-2 fs-8 text-gray-600">
          <Skeletor class="rounded-0 mw-100px w-100" v-if="loading" />

          <template v-else>
            {{ title }}
          </template>
        </p>
        <p class="mb-0 fs-3 text-gray-800 lh-1 fw-medium">
          <Skeletor class="rounded-0 mw-200px w-100" v-if="loading" />
          <template v-else> {{ valuePrifix }}{{ value }} </template>
        </p>
      </div>
    </div>
  </div>
</template>
