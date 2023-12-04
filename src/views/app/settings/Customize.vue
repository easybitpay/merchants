<script setup></script>

<template>
  <!-- begin::Theme -->
  <div>
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Theme</h4>

    <div class="d-flex align-items-center justify-content-between flex-wrap gap-6">
      <p class="text-gray-800 mb-0">
        Choose language - Changes will be applied after restarting the app
      </p>

      <div class="dropdown">
        <button
          class="btn btn-sm dropdown-toggle w-250px justify-content-between border border-gray-200"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          data-bs-offset="0,0"
        >
          Dark mode
        </button>
        <ul class="dropdown-menu sm-triangle w-100">
          <li><a class="dropdown-item">Dark mode</a></li>
          <li><a class="dropdown-item">Light mode</a></li>
        </ul>
      </div>
    </div>
    <!-- end::Title -->
  </div>
  <!-- end::Theme -->
</template>
