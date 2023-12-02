<script setup>
// Componets
import TwoFa from '../../../components/settings/privacy/SignIn.vue'
import KYC from '../../../components/settings/privacy/KYC.vue'

// ----- START ----- //
</script>

<template>
  <TwoFa />

  <!-- begin::Last Sign in -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Your Last Signed</h4>

    <p class="mb-6 text-gray-800">Where you’re signed in</p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-2">
      <!-- begin::Item -->
      <div class="row ls-base text-gray-800 text-hover-primary hover-sm-show-parent">
        <div
          class="col-4 col-sm-6 col-md-4 col-lg-3 col-xl-2 lh-24px d-flex justify-content-between"
        >
          Windows

          <div class="d-none d-sm-block">
            <span
              class="d-flex align-items-center justify-content-center rounded-circle w-24px h-24px bg-gray-200 text-primary"
            >
              <small>M</small>
            </span>
          </div>
        </div>

        <div
          class="col-8 col-sm-6 col-md-4 col-lg-3 col-xl-2 lh-24px d-flex justify-content-end justify-content-sm-between"
        >
          192.168.1.54

          <inline-svg
            src="media/icons/icons/trash.svg"
            height="24"
            class="svg-icon-danger hover-show-target d-none"
          ></inline-svg>
        </div>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="row ls-base text-gray-800 text-hover-primary hover-sm-show-parent">
        <div
          class="col-4 col-sm-6 col-md-4 col-lg-3 col-xl-2 lh-24px d-flex justify-content-between"
        >
          iPhone

          <div class="d-none d-sm-block">
            <span
              class="d-flex align-items-center justify-content-center rounded-circle w-24px h-24px bg-gray-200 text-primary"
            >
              <small>P</small>
            </span>
          </div>
        </div>

        <div
          class="col-8 col-sm-6 col-md-4 col-lg-3 col-xl-2 lh-24px d-flex justify-content-end justify-content-sm-between"
        >
          168.205.16.78

          <inline-svg
            src="media/icons/icons/trash.svg"
            height="24"
            class="svg-icon-danger hover-show-target d-none"
          ></inline-svg>
        </div>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->

    <!-- begin::View More -->
    <button class="btn bg-gray-200 text-primary w-200px mt-6">View more</button>
    <!-- end::View More -->
  </div>
  <!-- end::Last Sign in -->

  <KYC />

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
