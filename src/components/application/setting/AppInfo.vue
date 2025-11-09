<script setup>
// Vue
import { computed } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Composabless
import useActionShareAllowed from '@/composables/useActionShareAllowed.js'

// Components
import TextColumn from '../../globals/TextColumn.vue'
import AppInfoOffcanvas from './AppInfoOffcanvas.vue'

// ----- START ----- //

// Generals
const store = useAppStore()

// Computeds
const selectedApp = computed(() => store.selectedApp)
const { actionShareAllowed } = useActionShareAllowed()

/**
 * Gateway List Status Converter
 */
const convartAppType = (type) => {
  if (type == '1') return 'API'
  if (type == '2') return 'Custom'
  if (type == '3') return 'Donate'
}
</script>

<template>
  <!-- begin::App Info -->
  <div class="card mb-6 mt-10">
    <!-- begin::Header -->
    <div class="card-header">
      <div>
        <h6 class="title">App info</h6>

        <p class="desc">Some info may be visible to other people using Google services.</p>
      </div>

      <button
        v-if="actionShareAllowed(selectedApp.share_type, 'edit_app')"
        class="btn btn-sm btn-light w-150px"
        data-bs-toggle="offcanvas"
        data-bs-target="#appInfo_offcanvas"
        aria-controls="appInfo_offcanvas"
      >
        Edit
      </button>
    </div>
    <!-- end::Header -->

    <!-- begin::Content -->
    <div class="card-body">
      <!-- begin::Item -->
      <TextColumn title="App Name" :value="selectedApp.name" />
      <!-- end::Item -->

      <div class="divider"></div>

      <!-- begin::Item -->
      <TextColumn title="Site Url" :value="selectedApp.site_url" />
      <!-- end::Item -->

      <div class="divider"></div>

      <!-- begin::Item -->
      <TextColumn title="Callback URL" :value="selectedApp.callback_url" />
      <!-- end::Item -->

      <div class="divider"></div>

      <!-- begin::Item -->
      <TextColumn title="Redirect URL" :content="selectedApp.redirect_url" />
      <!-- end::Item -->

      <div class="divider"></div>

      <!-- begin::Item -->
      <TextColumn title="Gateway Type" :value="convartAppType(selectedApp.type)" />
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::App Info -->

  <AppInfoOffcanvas />
</template>
