<script setup>
// Hook
import useIconImage from '@/hooks/useIconImage'

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// Emit
const emit = defineEmits(['openEditPartner'])

// ----- START ----- //

// Generals
const { storageImage } = useIconImage()

// Functions

/**
 * Open Edit Partner Offcanvas
 */
const openEditPartner = () => {
  emit('openEditPartner', props.item)
}
</script>

<template>
  <!-- begin::Item -->
  <div class="d-flex gap-4 text-gray-900 text-hover-primary hover-sm-show-parent">
    <!-- begin::Info & Image -->
    <div class="d-flex w-100 gap-4">
      <!-- begin::Image Box -->
      <div>
        <div class="w-40px h-40px">
          <img
            :src="item.avatar ? storageImage(item.avatar, 40) : `/media/images/banner/auth-bg.jpg`"
            :alt="item.first_name"
            class="w-100 h-100 object-cover rounded-circle"
          />
        </div>
      </div>
      <!-- end::Image Box -->

      <!-- begin::Info -->
      <div class="d-flex flex-column justify-content-between">
        <p class="mb-0 ellipsis" style="--ellipsis-width: 100%" @click="openEditPartner">
          {{ item.first_name }} {{ item.last_name }}
        </p>
        <small class="text-gray-700">{{ $filters.capitalize(item.type) }}</small>
      </div>
      <!-- end::Info -->
    </div>
    <!-- end::Info & Image -->

    <!-- begin::Action -->
    <div class="w-175px d-none hover-show-target">
      <button class="btn btn-primary w-100" @click="openEditPartner">Edit</button>
    </div>
    <!-- end::Action -->
  </div>
  <!-- end::Item -->
</template>
