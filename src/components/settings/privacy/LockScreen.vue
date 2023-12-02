<script setup></script>

<template>
  <!-- begin::Lock Screen -->
  <div>
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Lock screen</h4>

    <p class="mb-6 text-gray-800">
      Make sure that you can always access your Google Account by keeping this information up to
      date
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-4">
      <!-- begin::Item -->
      <div class="row ls-base form-check form-switch d-flex align-items-center p-0">
        <div class="col-9 col-md-4 col-lg-3 col-xl-2 text-gray-800 lh-24px">
          <label class="form-check-label" for="lockScreenSwitch">Lock screen</label>
        </div>
        <div
          class="col-3 col-md-6 col-lg-5 col-xl-4 d-flex justify-content-end justify-content-sm-start"
        >
          <input class="form-check-input m-0" type="checkbox" role="switch" id="lockScreenSwitch" />
        </div>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="row ls-base">
        <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2 text-gray-800 lh-24px">
          Lock screen Passcode
        </div>
        <div class="col-sm-7 col-md-6 col-lg-5 col-xl-4 lh-24px">On since 10 Nov 2021</div>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Lock Screen -->
</template>
