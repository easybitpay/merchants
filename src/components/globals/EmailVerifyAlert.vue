<script setup></script>

<template>
  <div id="email-verify-alert" class="d-flex gap-4">
    <div class="card border-warning bg-yellow-100 w-100">
      <div
        class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
      >
        <p class="fs-7 mb-0 ls-base text-gray-800 lh-32px">Please verify your email</p>

        <!-- begin::Actions -->
        <div class="d-flex gap-4 w-100 w-sm-initial">
          <RouterLink
            :to="{ name: 'settings-basic' }"
            class="btn btn-sm btn-warning w-100 h-24px ls-base"
          >
            Verify
          </RouterLink>
        </div>
        <!-- end::Actions -->
      </div>
    </div>
  </div>
</template>
