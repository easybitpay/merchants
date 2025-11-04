<script setup>
// Hook
import useIconImage from '@/composables/useIconImage'
import useConvertDate from '@/composables/useConvertDate'
import useActionShareAllowed from '@/composables/useActionShareAllowed.js'

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

// ----- START ----- //

// Generals
const { storageImage } = useIconImage()
const { getCurrent } = useConvertDate()
const { actionShareAllowed } = useActionShareAllowed()

// Functions

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
      { 'card background-image application-card': true },
      { disabled: app.status != 1 },
      { 'have-partners': holders.length }
    ]"
    :style="`--background: url(${
      app.banner ? storageImage(app.banner) : '/media/images/banner/auth-bg.jpg'
    })`"
  >
    <div class="card-body">
      <!-- begin::Name Action -->
      <div class="info-action-box">
        <!-- begin::Main Info -->
        <div class="main-info">
          <!-- begin::Logo -->
          <img
            :src="app.logo ? storageImage(app.logo, 48) : '/media/images/banner/default-app.png'"
            :alt="app.name"
            class="img-fluid rounded-1"
            width="48"
          />
          <!-- end::Logo -->

          <!-- begin::Info -->
          <div class="info">
            <h6 class="name">{{ app.name }}</h6>

            <div class="other">
              <span class="text-primary">
                {{ convartAppType(app.type) }}
              </span>
              <span>•</span>
              <span>{{ $filters.capitalize(app.share_type) }}</span>
              <template v-if="app.status != 1">
                <span>•</span>
                <span class="badge badge-danger">Inactive</span>
              </template>
            </div>
          </div>
          <!-- end::Info -->
        </div>
        <!-- end::Main Info -->

        <!-- begin::Action -->
        <div class="d-flex gap-2">
          <button
            v-if="action === 'action' && actionShareAllowed(app.share_type, 'update_share')"
            type="button"
            class="btn btn-sm btn-primary p-0 w-40px h-40px share-btn"
            data-bs-toggle="offcanvas"
            data-bs-target="#addPartner_offcanvas"
            aria-controls="addPartner_offcanvas"
          >
            <inline-svg src="media/icons/icons/share.svg"></inline-svg>
          </button>

          <button
            v-if="app.type == 1 && action === 'action'"
            type="button"
            :disabled="app.status != 1"
            class="btn btn-sm btn-primary w-120px h-40px d-none d-md-flex invoice-btn"
            data-bs-toggle="offcanvas"
            data-bs-target="#createInvoice_offcanvas"
            aria-controls="createInvoice_offcanvas"
          >
            <inline-svg src="media/icons/icons/card.svg"></inline-svg>
            Invoice
          </button>

          <RouterLink
            v-if="action === 'enter'"
            :to="{ name: 'application-overview', params: { id: app.id } }"
            class="btn btn-sm btn-primary d-none d-md-flex w-120px h-40px enter-btn"
          >
            Enter

            <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
          </RouterLink>
        </div>

        <!-- end::Action -->
      </div>
      <!-- end::Name Action -->

      <!-- begin::Info -->
      <div class="infos">
        <div class="row gy-4">
          <!-- begin::Item -->
          <div class="col-6 col-md-3 item">
            <p class="value">${{ app?.summary?.total_income.toFixed(2) }}</p>
            <p class="title">Total Earning</p>
          </div>
          <!-- end::Item -->

          <!-- begin::Item -->
          <div class="col-6 col-md-3 item">
            <p class="value">${{ app?.summary?.total_withdraws.toFixed(2) }}</p>
            <p class="title">Withdrawn</p>
          </div>
          <!-- end::Item -->

          <!-- begin::Item -->
          <div class="col-6 col-md-3 item">
            <p class="value">${{ app?.summary?.last_month_income.toFixed(2) }}</p>
            <p class="title">{{ getCurrent('MMMM') }}</p>
          </div>
          <!-- end::Item -->

          <!-- begin::Item -->
          <div class="col-6 col-md-3 item">
            <p class="value text-success">${{ app?.summary?.usd_value.toFixed(2) }}</p>
            <p class="title">Available</p>
          </div>
          <!-- end::Item -->
        </div>
      </div>
      <!-- end::Info -->

      <!-- begin::Bottom Action -->
      <div
        class="bottom-action pt-12 d-block d-md-none"
        v-if="action === 'enter' || (action == 'action' && app.type == 1)"
      >
        <RouterLink
          v-if="action === 'enter'"
          :to="{ name: 'application-overview', params: { id: app.id } }"
          class="btn btn-sm btn-primary h-40px w-100"
        >
          Enter

          <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
        </RouterLink>

        <button
          v-if="action === 'action'"
          type="button"
          :disabled="app.status != 1"
          class="btn btn-sm btn-primary h-40px w-100"
          data-bs-toggle="offcanvas"
          data-bs-target="#createInvoice_offcanvas"
          aria-controls="createInvoice_offcanvas"
        >
          <inline-svg src="media/icons/icons/card.svg"></inline-svg>
          Invoice
        </button>
      </div>
      <!-- end::Bottom Action -->
    </div>
  </div>
</template>
