<script setup>
const props = defineProps({
  image: {
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
  }
})
</script>

<template>
  <div class="card border-gray-200 rounded">
    <div class="card-body p-2">
      <img :src="`media/images/dashboard/${image}.png`" :alt="title" />

      <p class="mt-5 mb-2 fs-extra neue-machina text-gray-800 lh-1">
        {{ valuePrifix }}{{ value }}
      </p>

      <p class="mb-0 text-gray-500">{{ title }}</p>
    </div>
  </div>
</template>
