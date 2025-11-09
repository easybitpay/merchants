<script setup>
// Vue
import { computed } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Components
import PersonalInfoOffcanvas from './PersonalInfoOffcanvas.vue'
import TextColumn from '../../globals/TextColumn.vue'

// ----- START ----- //

// Generals
const store = useAuthStore()

// Computeds
const currentUser = computed(() => store.currentUser)
const profile = computed(() => JSON.parse(currentUser.value?.merchant?.profile || '{}'))
</script>

<template>
  <!-- begin::Contact Info -->
  <div class="card mb-6">
    <!-- begin::Header -->
    <div class="card-header">
      <div>
        <h6 class="title">Personal Information</h6>

        <p class="desc">Update your personal details</p>
      </div>

      <button
        class="btn btn-sm btn-light w-150px"
        data-bs-toggle="offcanvas"
        data-bs-target="#personalInfo_offcanvas"
        aria-controls="personalInfo_offcanvas"
      >
        Edit
      </button>
    </div>
    <!-- end::Head -->

    <!-- begin::Content -->
    <div class="card-body">
      <!-- begin::Item -->
      <TextColumn
        title="full name"
        :value="`${currentUser?.merchant?.first_name} ${currentUser?.merchant?.last_name}`"
      />
      <!-- end::Item -->

      <div class="divider"></div>

      <!-- begin::Item -->
      <TextColumn title="Birthday" :value="profile.birth_date || 'Not Set'" />
      <!-- end::Item -->

      <div class="divider"></div>

      <!-- begin::Item -->
      <TextColumn title="Gender" :value="profile.gender || 'Not Set'" />
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Contact Info -->

  <PersonalInfoOffcanvas />
</template>
