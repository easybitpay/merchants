<script setup>
// Vue
import { computed } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Components
import BasicInfoOffcanvas from './BasicInfoOffcanvas.vue'
import EmailVerifyOffcanvas from './EmailVerifyOffcanvas.vue'
import PhoneVerifyOffcanvas from './PhoneVerifyOffcanvas.vue'
import TextColumn from '../../globals/TextColumn.vue'

// ----- START ----- //

// Generals
const store = useAuthStore()

// Computeds
const currentUser = computed(() => store.currentUser)
</script>

<template>
  <!-- begin::Basic Info -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Basic info</h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-4">
      <!-- begin::Item -->
      <TextColumn
        title="Phone"
        content="Not Set"
        canvasId="basicInfo_offcanvas"
        :titleCanvas="
          currentUser?.merchant?.phone && !currentUser?.merchant?.phone_verified_at
            ? { id: 'phoneVerify_offcanvas', title: 'Verify Phone' }
            : {}
        "
      />
      <!-- end::Item -->

      <!-- begin::Item -->
      <TextColumn
        title="Email"
        :content="currentUser?.merchant?.email"
        canvasId="basicInfo_offcanvas"
        :titleCanvas="
          !currentUser?.merchant?.email_verified_at
            ? { id: 'emailVerify_offcanvas', title: 'Verify Email' }
            : {}
        "
      />
      <!-- end::Item -->

      <!-- begin::Item -->
      <!-- <div class="row ls-base">
        <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2 text-gray-800 lh-24px">Country</div>
        <div class="col-sm-7 col-md-8 col-lg-9 col-xl-10 d-flex justify-content-start">
          <div
            class="w-100 w-lg-initial d-flex justify-content-between justify-content-lg-start text-hover-primary hover-sm-show-parent"
            data-bs-toggle="offcanvas"
            data-bs-target="#basicInfo_offcanvas"
            aria-controls="basicInfo_offcanvas"
          >
            <span class="d-flex gap-4">
              <span class="fi fi-us"></span>
              United State
            </span>

            <inline-svg
              src="media/icons/icons/arrow-right.svg"
              class="svg-icon-primary hover-show-target d-none ms-0 ms-lg-16"
            ></inline-svg>
          </div>
        </div>
      </div> -->
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Basic Info -->

  <BasicInfoOffcanvas />
  <EmailVerifyOffcanvas />
  <PhoneVerifyOffcanvas />
</template>
