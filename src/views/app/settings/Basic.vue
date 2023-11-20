<script setup>
import BasicInfoOffcanvas from '../../../components/settings/basic/BasicInfoOffcanvas.vue'
import ContactInfo from '../../../components/settings/basic/ContactInfo.vue'
import TextColumn from '../../../components/globals/TextColumn.vue'
</script>

<template>
  <ContactInfo />

  <!-- begin::Contact Info -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Basic info</h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-4">
      <!-- begin::Item -->
      <TextColumn title="Phone" content="+98 912 260 46 54" canvasId="basicInfo_offcanvas" />
      <!-- end::Item -->

      <!-- begin::Item -->
      <TextColumn title="Email" content="Plusstudio2007@gmail.com" canvasId="basicInfo_offcanvas" />
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="row ls-base">
        <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2 text-gray-800 lh-24px">Country</div>
        <div class="col-sm-7 col-md-8 col-lg-9 col-xl-10 d-flex justify-content-start">
          <div
            class="w-100 w-lg-initial d-flex justify-content-between justify-content-lg-start text-hover-primary hover-sm-show-parent"
            data-bs-toggle="offcanvas"
            data-bs-target="#basicInfo_offcanvas"
            aria-controls="basicInfo_offcanvas"
          >
            <span class="d-flex gap-4">
              <span class="fi fi-us"></span>
              United State
            </span>

            <inline-svg
              src="media/icons/icons/arrow-right.svg"
              class="svg-icon-primary hover-show-target d-none ms-0 ms-lg-16"
            ></inline-svg>
          </div>
        </div>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Contact Info -->

  <!-- begin::Linked Accounts -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Linked Account</h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-wrap gap-6">
      <!-- begin::Item -->
      <div class="py-2 ps-4 pe-3 bg-white border border-gray-200 rounded-pill">
        <!-- begin::Logo -->
        <inline-svg src="media/icons/companies/google-logo.svg" class="me-7"></inline-svg>
        <!-- end::Logo -->

        <!-- begin::Action -->
        <inline-svg
          src="media/icons/icons/trash.svg"
          width="20"
          class="svg-icon-gray-700 cursor-pointer"
        ></inline-svg>
        <!-- end::Action -->
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="py-2 ps-4 pe-3 bg-white border border-gray-200 rounded-pill">
        <!-- begin::Logo -->
        <inline-svg src="media/icons/companies/facebook-logo.svg" class="me-7"></inline-svg>
        <!-- end::Logo -->

        <!-- begin::Action -->
        <inline-svg
          src="media/icons/icons/link.svg"
          width="20"
          class="svg-icon-primary cursor-pointer"
        ></inline-svg>
        <!-- end::Action -->
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Linked Accounts -->

  <!-- begin::Languege -->
  <div>
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Language</h4>

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
          English
        </button>
        <ul class="dropdown-menu sm-triangle w-100">
          <li><a class="dropdown-item">English</a></li>
          <li><a class="dropdown-item">English 2</a></li>
        </ul>
      </div>
    </div>
    <!-- end::Title -->
  </div>
  <!-- end::Languege -->

  <BasicInfoOffcanvas />
</template>
