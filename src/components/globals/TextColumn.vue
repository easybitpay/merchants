<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String
  },
  badge: {
    type: Object,
    required: false
  }
})
</script>

<template>
  <div class="text-column">
    <p class="title">{{ title }}</p>
    <p class="value">
      {{ value || 'Not Set' }}

      <span
        v-if="badge"
        :class="`badge badge-${badge.color} d-flex align-items-center g-1`"
        style="border-radius: 0.25rem"
        :data-bs-toggle="badge.offcanvas ? 'offcanvas' : ''"
        :data-bs-target="badge.offcanvas ? `#${badge.offcanvas}` : ''"
        :aria-controls="badge.offcanvas ? badge.offcanvas : ''"
      >
        <inline-svg
          v-if="badge.icon"
          :src="`media/icons/icons/${badge.icon}.svg`"
          :class="`w-10px svg-icon-${badge.color} me-1`"
        ></inline-svg>

        {{ badge.text }}
      </span>
    </p>
  </div>
</template>
