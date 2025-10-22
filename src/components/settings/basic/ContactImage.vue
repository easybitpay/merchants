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
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Contact Image</h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex align-items-center gap-4">
      <div>
        <div class="h-40px w-40px">
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
      </div>

      <div class="d-flex justify-content-start">
        <div
          class="w-100 w-lg-initial d-flex justify-content-between justify-content-lg-start text-break text-hover-primary hover-sm-show-parent lh-24px"
          data-bs-toggle="offcanvas"
          data-bs-target="#uploadAvatar_offcanvas"
          aria-controls="uploadAvatar_offcanvas"
        >
          Change Profile Photo

          <inline-svg
            src="media/icons/icons/arrow-right.svg"
            class="svg-icon-primary hover-show-target d-none d-sm-block ms-0 ms-lg-16"
          ></inline-svg>
        </div>
      </div>
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Contact Image -->

  <UploadImageOffcanvas />
</template>
