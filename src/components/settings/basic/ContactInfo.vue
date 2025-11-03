<script setup>
// Vue
import { computed } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Components
import ContactInfoOffcanvas from './ContactInfoOffcanvas.vue'
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
  <div class="card mb-6">
    <!-- begin::Header -->
    <div class="card-header">
      <div>
        <h6 class="title">Contact Information</h6>

        <p class="desc">Manage your email and phone number</p>
      </div>

      <button
        class="btn btn-sm btn-light w-150px"
        data-bs-toggle="offcanvas"
        data-bs-target="#contactInfo_offcanvas"
        aria-controls="contactInfo_offcanvas"
      >
        Edit
      </button>
    </div>
    <!-- end::Head -->

    <!-- begin::Content -->
    <div class="card-body">
      <!-- begin::Item -->
      <TextColumn
        title="Email address"
        :value="currentUser?.merchant?.email"
        :badge="{
          text: `${!currentUser?.merchant?.email_verified_at ? 'Not' : ''} Verified`,
          color: currentUser?.merchant?.email_verified_at ? 'success' : 'danger',
          icon: currentUser?.merchant?.email_verified_at ? 'ok' : 'close',
          offcanvas: !currentUser?.merchant?.email_verified_at ? 'emailVerify_offcanvas' : ''
        }"
      />
      <!-- end::Item -->

      <div class="divider"></div>

      <!-- begin::Item -->
      <TextColumn
        title="Phone number"
        :value="currentUser?.merchant?.phone"
        :badge="
          currentUser?.merchant?.phone
            ? {
                text: `${!currentUser?.merchant?.phone_verified_at ? 'Not' : ''} Verified`,
                color: currentUser?.merchant?.phone_verified_at ? 'success' : 'danger',
                icon: currentUser?.merchant?.email_verified_at ? 'ok' : 'close',
                offcanvas: !currentUser?.merchant?.phone_verified_at ? 'phoneVerify_offcanvas' : ''
              }
            : null
        "
      />
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Basic Info -->

  <ContactInfoOffcanvas />
  <EmailVerifyOffcanvas />
  <PhoneVerifyOffcanvas />
</template>
