<script setup>
// Vue

// Store
import { useAuthStore } from '@/stores/auth'

// Components
import ContactInfoOffcanvas from './ContactInfoOffcanvas.vue'
import TextColumn from '../../globals/TextColumn.vue'
import { computed } from 'vue'

// ----- START ----- //

// Generals
const store = useAuthStore()

// Computeds
const currentUser = computed(() => store.currentUser)
const profile = computed(() => JSON.parse(currentUser.value?.merchant?.profile || '{}'))
</script>

<template>
  <!-- begin::Contact Info -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Contact info</h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-4">
      <!-- begin::Item -->
      <TextColumn
        title="Name"
        :content="`${currentUser?.merchant?.first_name} ${currentUser?.merchant?.last_name}`"
        canvasId="contactInfo_offcanvas"
      />
      <!-- end::Item -->

      <!-- begin::Item -->
      <TextColumn
        title="Birthday"
        :content="profile.birth_date || 'Not Set'"
        canvasId="contactInfo_offcanvas"
      />
      <!-- end::Item -->

      <!-- begin::Item -->
      <TextColumn
        title="Gender"
        :content="profile.gender || 'Not Set'"
        canvasId="contactInfo_offcanvas"
      />
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Contact Info -->

  <ContactInfoOffcanvas />
</template>
