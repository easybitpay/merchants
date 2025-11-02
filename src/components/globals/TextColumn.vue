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
        :class="`bg-${badge.color}-100 text-${badge.color}-700 fs-9 py-1 px-2 ms-2`"
        style="border-radius: 0.25rem"
        :data-bs-toggle="badge.offcanvas ? 'offcanvas' : ''"
        :data-bs-target="badge.offcanvas ? `#${badge.offcanvas}` : ''"
        :aria-controls="badge.offcanvas ? badge.offcanvas : ''"
      >
        <inline-svg
          v-if="badge.icon"
          :src="`media/icons/icons/${badge.icon}.svg`"
          :class="`w-10px svg-icon-${badge.color}-500 me-1`"
        ></inline-svg>

        {{ badge.text }}
      </span>
    </p>
  </div>
</template>
