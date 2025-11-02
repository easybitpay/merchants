<script setup>
// Vue
import { computed } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hook
import useIconImage from '@/composables/useIconImage'

// Components
import UploadImageOffcanvas from './UploadImageOffcanvas.vue'

// ----- START ----- //

// Generals
const store = useAuthStore()
const { storageImage } = useIconImage()

// Computeds
const currentUser = computed(() => store.currentUser)
</script>

<template>
  <!-- begin::Contact Image -->
  <div class="card mb-6 change-image-card">
    <!-- begin::Header -->
    <div class="card-header">
      <div>
        <h6 class="title">Profile</h6>

        <p class="desc">Your photo and personal details</p>
      </div>

      <button
        class="btn btn-sm btn-light w-150px"
        data-bs-toggle="offcanvas"
        data-bs-target="#uploadAvatar_offcanvas"
        aria-controls="uploadAvatar_offcanvas"
      >
        Change Photo
      </button>
    </div>
    <!-- end::Head -->

    <!-- begin::Content -->
    <div class="card-body d-flex align-items-center gap-4">

        <div class="h-80px w-80px">
          <img
            :src="
              currentUser?.merchant?.avatar
                ? storageImage(currentUser.merchant.avatar)
                : '/media/images/banner/auth-bg.jpg'
            "
            :alt="currentUser?.merchant?.first_name"
            class="h-100 w-100 object-cover"
            style="border-radius: 6px"
          />
      
      </div>

      <div class="text">
        <h6 class="name">
          {{ currentUser?.merchant?.first_name }} {{ currentUser?.merchant?.last_name }}
        </h6>
        <p class="email">{{ currentUser?.merchant?.email }}</p>
      </div>
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Contact Image -->

  <UploadImageOffcanvas />
</template>
