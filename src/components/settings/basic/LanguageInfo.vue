<script setup></script>

<template>
  <!-- begin::Language Info -->
  <div class="card language-info-card">
    <!-- begin::Header -->
    <div class="card-header">
      <div>
        <h6 class="title">Language</h6>

        <p class="desc">Choose your preferred language</p>
      </div>
    </div>
    <!-- end::Head -->

    <!-- begin::Content -->
    <div class="card-body d-flex">
      <div class="dropdown w-100 mw-400px">
        <button
          class="btn dropdown-toggle w-100"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          data-bs-offset="0,0"
        >
          English
        </button>
        <ul class="dropdown-menu triangle w-100">
          <li><a class="dropdown-item">English</a></li>
          <li><a class="dropdown-item">English 2</a></li>
        </ul>
      </div>
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Language Info -->
</template>
