<script setup>
// Vue
import { computed } from 'vue'

// Store
import { usePayStore } from '@/stores/pay'

// Hooks
import useIconImage from '@/hooks/useIconImage'

// ----- START ----- //

// Generals
const store = usePayStore()
const { iconImage, storageImage } = useIconImage()

// Computeds
const invoiceCode = computed(() => store.getInvoiceCode)
const invoiceDetail = computed(() => store.getInvoiceDetail)
const userInputs = computed(() => store.getUserInputs)
</script>

<template>
  <!-- begin::Gateway Info -->
  <div
    class="card gradient-image-box border-gray-200 h-156px rounded mb-11"
    :style="`--background: url(${
      invoiceDetail?.app?.banner
        ? storageImage(invoiceDetail?.app?.banner)
        : '/media/images/banner/auth-bg.jpg'
    })`"
  >
    <div class="card-body d-flex flex-column justify-content-between p-4 h-100">
      <!-- begin::Gateway Logo -->
      <inline-svg src="/media/images/logo/Logo.svg" height="27" width="137"></inline-svg>
      <!-- end::Gateway Logo -->

      <!-- begin::Bottom Box -->
      <div class="d-flex align-items-end justify-content-between gap-4 flex-wrap">
        <!-- begin::Left Side -->
        <div class="d-flex align-items-end gap-4">
          <!-- begin::Logo -->
          <div>
            <img
              :src="
                invoiceDetail?.app?.logo
                  ? storageImage(invoiceDetail?.app?.logo, 48)
                  : '/media/images/banner/default-app.png'
              "
              class="img-fluid rounded-1"
              width="40"
            />
          </div>
          <!-- end::Logo -->

          <div>
            <p class="fs-7 mb-2 text-gray-600 ls-base lh-1">{{ invoiceDetail?.app?.name }}</p>

            <h2 class="mb-0 text-gray-800 neue-machina lh-1 fw-medium">
              {{ invoiceDetail.amount ? invoiceDetail.amount : userInputs.amount || 0 }}
              {{ invoiceDetail.base_token }}
            </h2>
          </div>
        </div>
        <!-- end::Left Side -->

        <!-- begin::Invoice ID -->
        <div>
          <p class="invoice-code mb-2" v-if="invoiceDetail.client_order_identifier">
            #{{ invoiceDetail.client_order_identifier }}
          </p>

          <p class="invoice-code">#{{ invoiceCode }}</p>
        </div>
        <!-- end::Invoice ID -->
      </div>
      <!-- end::Bottom Box -->
    </div>
  </div>
  <!-- end::Gateway Info -->
</template>
