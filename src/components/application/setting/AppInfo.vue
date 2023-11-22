<script setup>
// Vue
import { computed } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Components
import TextColumn from '../../globals/TextColumn.vue'
import AppInfoOffcanvas from './AppInfoOffcanvas.vue'

// ----- START ----- //

// Generals
const store = useAppStore()

// Computeds
const selectedApp = computed(() => store.selectedApp)
</script>

<template>
  <!-- begin::App Info -->
  <div class="mb-12 mt-10">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">App info</h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-4">
      <!-- begin::Item -->
      <TextColumn title="App Name" :content="selectedApp.name" canvasId="appInfo_offcanvas" />
      <!-- end::Item -->

      <!-- begin::Item -->
      <TextColumn
        title="Site Url"
        :content="selectedApp.site_url || 'Not Set'"
        canvasId="appInfo_offcanvas"
      />
      <!-- end::Item -->

      <!-- begin::Item -->
      <TextColumn
        title="Callback URL"
        :content="selectedApp.callback_url || 'Not Set'"
        canvasId="appInfo_offcanvas"
      />
      <!-- end::Item -->

      <!-- begin::Item -->
      <TextColumn
        title="Redirect URL"
        :content="selectedApp.redirect_url || 'Not Set'"
        canvasId="appInfo_offcanvas"
      />
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::App Info -->

  <AppInfoOffcanvas />
</template>
