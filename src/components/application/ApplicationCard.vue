<script setup>
// Hook
import useIconImage from '@/hooks/useIconImage'

// Props
const props = defineProps({
  action: {
    type: String,
    default: 'enter'
  },
  app: {
    type: Object,
    required: true
  }
})

// ----- Start -----
const { storageImage } = useIconImage()

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
  <div
    :class="[
      { 'card gradient-image-box application-card have-partners': true },
      { disabled: app.type != 1 }
    ]"
    :style="`--background: url(${
      app.banner ? storageImage(app.banner) : '/media/images/banner/auth-bg.jpg'
    })`"
  >
    <div
      class="card-body d-flex flex-column flex-lg-row align-items-start align-items-lg-end gap-4"
    >
      <div class="d-flex flex-column align-items-start w-100 overflow-auto">
        <div class="mb-4">
          <!-- begin::Type -->
          <span class="type"> {{ convartAppType(app.type) }} </span>
          <!-- end::Type -->

          <!-- begin::Partners -->
          <div class="partners">
            <!-- begin::Item -->
            <span class="item">
              <img src="/media/images/banner/auth-bg.jpg" alt="partner" />
            </span>
            <!-- end::Item -->

            <!-- begin::Item -->
            <span class="item">
              <img src="/media/images/banner/auth-bg.jpg" alt="partner" />
            </span>
            <!-- end::Item -->

            <!-- begin::Item -->
            <span class="item">
              <img src="/media/images/banner/auth-bg.jpg" alt="partner" />
            </span>
            <!-- end::Item -->
          </div>
          <!-- end::Partners -->
        </div>

        <!-- begin::Share Type -->
        <p class="mb-0 fs-7 ls-base text-gray-600">as {{ $filters.capitalize(app.share_type) }}</p>
        <!-- end::Share Type -->

        <!-- begin::Name -->
        <h2 class="name text-indigo-400 neue-machina">
          <img src="/media/icons/icons/stop.png" alt="stop" />
          {{ app.name }}
        </h2>
        <!-- end::Name -->

        <!-- begin::Info -->
        <div class="infos mt-6">
          <!-- begin::Item -->
          <div class="item">
            <p class="value">$135.00</p>
            <p class="title">Total Earning</p>
          </div>
          <!-- end::Item -->

          <!-- begin::Item -->
          <div class="item">
            <p class="value">$42.00</p>
            <p class="title">Withdrawn</p>
          </div>
          <!-- end::Item -->

          <!-- begin::Item -->
          <div class="item">
            <p class="value">$30.00</p>
            <p class="title">Earned in July</p>
          </div>
          <!-- end::Item -->

          <!-- begin::Item -->
          <div class="item">
            <p class="value">$76.00</p>
            <p class="title">Available</p>
          </div>
          <!-- end::Item -->
        </div>
        <!-- end::Info -->
      </div>
      <!-- begin::Enter Action -->
      <div class="enter-btn" v-if="action === 'enter'">
        <div class="w-200px">
          <RouterLink
            :to="{ name: 'application-overview', params: { id: 2 } }"
            class="btn btn-primary w-100"
          >
            Enter

            <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
          </RouterLink>
        </div>
      </div>
      <!-- end::Enter Action -->

      <!-- begin::Status Action -->
      <div class="d-flex flex-wrap flex-lg-nowrap gap-4" v-if="action === 'status'">
        <button
          type="button"
          class="btn btn-primary p-0 w-40px h-40px"
          data-bs-toggle="offcanvas"
          data-bs-target="#addPartner_offcanvas"
          aria-controls="addPartner_offcanvas"
        >
          <inline-svg src="media/icons/icons/share.svg"></inline-svg>
        </button>

        <button class="btn btn-primary w-168px">
          <inline-svg src="media/icons/icons/off.svg"></inline-svg>
          Deactivate
        </button>
      </div>
      <!-- end::Status Action -->
    </div>
  </div>
</template>
