<script setup>
// Props
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  shadows: {
    type: Boolean,
    default: true
  },
  bold: {
    type: Boolean,
    default: true
  },
  gap: {
    type: String,
    default: '6',
  }
})

// Emit
const emit = defineEmits(['clicked'])

const clicked = () => {
  emit('clicked')
}
</script>
<template>
  <div class="card pagination-card border-gray-200">
    <!-- begin::Shadow -->
    <template v-if="shadows">
      <span class="first"></span>

      <span class="last"></span>
    </template>
    <!-- end::Shadow -->

    <div class="card-body py-4 d-flex align-items-center justify-content-between cursor-pointer" @click="clicked">
      <!-- begin::Title -->
      <div :class="`d-flex align-items-center gap-${gap}`">
        <inline-svg src="media/icons/icons/clock.svg" height="24"></inline-svg>
        <p :class="[{ 'mb-0 fs-7 text-gray-900': true }, { 'fw-medium': bold }]">{{ text }}</p>
      </div>
      <!-- end::Title -->

      <!-- begin::Count -->
      <small class="lh-24px rounded bg-cyan-500 text-white px-2">+40</small>
      <!-- end::Count -->
    </div>
  </div>
</template>
