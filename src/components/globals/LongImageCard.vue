<script setup>
// Props
const props = defineProps({
  deleteAction: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    required: true
  },
  background: {
    type: String,
    required: true
  },
  error: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div
    :style="`--background: url(${background})`"
    :class="`gradient-image-box h-40px border rounded ps-4 pe-2 d-flex align-items-center justify-content-between 
    ${error ? 'border-danger text-danger' : 'border-gray-300 text-gray-800 text-hover-primary'}
    ${deleteAction ? 'hover-show-parent hover-shadow' : ''}`"
  >
    <p class="mb-0 ellipsis" style="--ellipsis-width: 50%">{{ text }}</p>

    <inline-svg
      v-if="deleteAction"
      src="media/icons/icons/trash.svg"
      height="24"
      class="svg-icon-danger hover-show-target bg-white"
      style="border-radius: 3px"
      @click="$emit('onDelete')"
    ></inline-svg>
  </div>
</template>
