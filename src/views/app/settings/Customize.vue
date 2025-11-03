<script setup>
// Components
import PageHeader from '../../../components/globals/PageHeader.vue'
</script>

<template>
  <div>
    <PageHeader title="Theme" description="Choose your preferred theme" />

    <!-- begin::Theme -->
    <div class="dropdown w-100 mw-400px">
      <button
        class="btn dropdown-toggle w-100"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-offset="0,0"
      >
        Dark mode
      </button>
      <ul class="dropdown-menu triangle w-100">
        <li><a class="dropdown-item">Dark mode</a></li>
        <li><a class="dropdown-item">Light mode</a></li>
      </ul>
    </div>
    <!-- end::Theme -->
  </div>
</template>
