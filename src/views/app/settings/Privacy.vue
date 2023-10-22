<script setup>
import NewKycOffcanvas from '../../../components/settings/NewKycOffcanvas.vue'

const convertStatusToColor = (status) => {
  const colors = {
    checking: 'cyan',
    verify: 'blue',
    error: 'red'
  }

  return colors[status] || 'blue'
}
</script>

<template>
  <!-- begin::Sign -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">How you Signin</h4>

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
          <label class="form-check-label" for="flexSwitchCheckDefault">2-Step Verification</label>
        </div>
        <div
          class="col-3 col-md-6 col-lg-5 col-xl-4 d-flex justify-content-end justify-content-sm-start"
        >
          <input
            class="form-check-input m-0"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckDefault"
          />
        </div>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Sign -->

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

  <!-- begin::KYC -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">KYC</h4>

    <p class="mb-6 text-gray-800">
      KYC process includes ID card verification, face verification, document verification such as
      utility bills as proof of address, and biometric verification. Banks must comply with KYC
      regulations and anti-money laundering regulations to limit fraud.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-6">
      <!-- begin::Item -->
      <div class="row align-items-center gy-3">
        <div class="col-12 col-sm-6 col-md-8 col-lg-6 col-xl-4">
          <div
            style="--background: url(media/images/banner/auth-bg.jpg)"
            class="gradient-image-box hover-shadow h-40px border border-gray-300 rounded ps-4 pe-2 d-flex align-items-center justify-content-between text-gray-800 text-hover-primary hover-show-parent"
          >
            ID Card

            <inline-svg
              src="media/icons/icons/trash.svg"
              height="24"
              class="svg-icon-danger hover-show-target bg-white"
              style="border-radius: 3px"
            ></inline-svg>
          </div>
        </div>

        <div class="col-12 col-sm d-flex">
          <div
            :class="`h-33px d-flex align-items-center ps-2 pe-4 rounded-2 border gap-2 
            border-${convertStatusToColor('checking')}-500 fs-7 ls-base 
            bg-${convertStatusToColor('checking')}-100
            text-${convertStatusToColor('checking')}-500`"
          >
            <inline-svg
              src="media/icons/icons/re.svg"
              height="24"
              :class="`svg-icon-${convertStatusToColor('checking')}-500`"
            ></inline-svg>

            Checking 23:17:26
          </div>
        </div>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="row align-items-center gy-3">
        <div class="col-12 col-sm-6 col-md-8 col-lg-6 col-xl-4">
          <div
            style="--background: url(media/images/banner/auth-bg.jpg)"
            class="gradient-image-box hover-shadow h-40px border border-gray-300 rounded ps-4 pe-2 d-flex align-items-center justify-content-between text-gray-800 text-hover-primary hover-show-parent"
          >
            <p class="mb-0 ellipsis" style="--ellipsis-width: 50%">ID Card</p>

            <inline-svg
              src="media/icons/icons/trash.svg"
              height="24"
              class="svg-icon-danger hover-show-target bg-white"
              style="border-radius: 3px"
            ></inline-svg>
          </div>
        </div>

        <div class="col-12 col-sm d-flex">
          <div
            :class="`h-33px d-flex align-items-center ps-2 pe-4 rounded-2 border gap-2 
            border-${convertStatusToColor('verify')}-500 fs-7 ls-base 
            bg-${convertStatusToColor('verify')}-100
            text-${convertStatusToColor('verify')}-500`"
          >
            <inline-svg
              src="media/icons/icons/read.svg"
              height="24"
              :class="`svg-icon-${convertStatusToColor('verify')}-500`"
            ></inline-svg>

            Verified
          </div>
        </div>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="row align-items-center gy-3">
        <div class="col-12 col-sm-6 col-md-8 col-lg-6 col-xl-4">
          <div
            style="--background: url(media/images/banner/auth-bg.jpg)"
            class="gradient-image-box hover-shadow h-40px border border-danger rounded ps-4 pe-2 d-flex align-items-center justify-content-between text-danger hover-show-parent"
          >
            ID Card

            <inline-svg
              src="media/icons/icons/trash.svg"
              height="24"
              class="svg-icon-danger hover-show-target bg-white"
              style="border-radius: 3px"
            ></inline-svg>
          </div>
        </div>

        <div class="col-12 col-sm d-flex">
          <div
            :class="`h-33px d-flex align-items-center ps-2 pe-4 rounded-2 border gap-2 
            border-${convertStatusToColor('error')}-500 fs-7 ls-base 
            bg-${convertStatusToColor('error')}-100
            text-${convertStatusToColor('error')}-500`"
          >
            <inline-svg
              src="media/icons/icons/error.svg"
              height="24"
              :class="`svg-icon-${convertStatusToColor('error')}-500`"
            ></inline-svg>

            Error
          </div>
        </div>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->

    <!-- begin::Attach -->
    <button
      class="btn btn-primary w-144px mt-6"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#newKyc_offcanvas"
      aria-controls="newKyc_offcanvas"
    >
      Attach
    </button>
    <!-- end::Attach -->
  </div>
  <!-- end::KYC -->

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

  <NewKycOffcanvas />
</template>
