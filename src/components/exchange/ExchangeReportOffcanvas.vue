<script setup></script>

<template>
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="exchangeReport_offcanvas"
    aria-labelledby="offcanvasExchangeReport"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer"
      ></inline-svg>

      <!-- begin::Content Card -->
      <div class="card border-0 mb-4">
        <div class="card-body pb-lg-22">
          <!-- begin::Header -->
          <div class="d-flex gap-4">
            <div>
              <inline-svg src="media/icons/shapes/balance.svg"></inline-svg>
            </div>

            <div class="mb-10">
              <h3 class="mb-0 text-gray-900">Exchange Report</h3>

              <p class="fs-7 mb-0 text-gray-800 ls-base">Instance Exchange Reciep</p>
            </div>
          </div>
          <!-- end::Header -->

          <!-- begin::Content -->
          <div>
            <!-- begin::Receive Address -->
            <div class="fs-7 ls-sm">
              <p class="text-gray-600 mb-2">Receive Address</p>
              <p class="text-gray-800 mb-0">TFGH12F41NHCVBCFG4RTUYFV616DGF71X312XCX3C1VXV1X3SEF</p>
            </div>
            <!-- end::Receive Address -->

            <!-- begin::Spacer -->
            <div class="border-bottom border-gray-400 w-100 my-4"></div>
            <!-- end::Spacer -->

            <!-- begin::Info -->
            <div class="auto-infos">
              <!-- begin::Item -->
              <div class="item">
                <p class="title">Status</p>
                <p class="value text-warning">Pending</p>
              </div>
              <!-- end::Item -->

              <!-- begin::Item -->
              <div class="item">
                <p class="title">Send Token</p>
                <p class="value">USD Coin <small>(Ethereum)</small></p>
              </div>
              <!-- end::Item -->

              <!-- begin::Item -->
              <div class="item">
                <p class="title">Receive Token</p>
                <p class="value">ECS Gold <small>(polygon mumbai)</small></p>
              </div>
              <!-- end::Item -->
            </div>
            <!-- end::Info -->

            <!-- begin::Spacer -->
            <div class="border-bottom border-gray-400 w-100 my-4"></div>
            <!-- end::Spacer -->

            <!-- begin::Info -->
            <div class="auto-infos">
              <!-- begin::Item -->
              <div class="item">
                <p class="title">Order ID</p>
                <p class="value">35</p>
              </div>
              <!-- end::Item -->

              <!-- begin::Item -->
              <div class="item">
                <p class="title">Exchange Rate</p>
                <p class="value">20</p>
              </div>
              <!-- end::Item -->

              <!-- begin::Item -->
              <div class="item">
                <p class="title">Fee</p>
                <p class="value">0</p>
              </div>
              <!-- end::Item -->

              <!-- begin::Item -->
              <div class="item">
                <p class="title">Send Amount</p>
                <p class="value">10</p>
              </div>
              <!-- end::Item -->

              <!-- begin::Item -->
              <div class="item">
                <p class="title">Receive Amount</p>
                <p class="value">200</p>
              </div>
              <!-- end::Item -->
            </div>
            <!-- end::Info -->
          </div>
          <!-- end::Content -->
        </div>
      </div>
      <!-- end::Content Card -->

      <!-- begin::Action Card -->
      <div class="d-flex gap-4">
        <div class="d-none d-md-flex">
          <div
            class="w-56px h-56px d-flex align-items-center justify-content-center rounded bg-white"
          >
            <inline-svg src="media/icons/shapes/bookmark.svg"></inline-svg>
          </div>
        </div>
        <div class="card border-0 mb-6 w-100">
          <div
            class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
          >
            <p class="fs-7 mb-0 ls-base text-gray-800 lh-32px">
              Latest clicks/conversions. Are you sure?
            </p>

            <!-- begin::Actions -->
            <div class="d-flex gap-4 w-100 w-sm-initial">
              <button
                type="button"
                class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base fw-normal"
              >
                Share
              </button>
            </div>
            <!-- end::Actions -->
          </div>
        </div>
      </div>
      <!-- end::Action Card -->
    </div>
  </div>
</template>
