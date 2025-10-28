<script setup>
// Vue
import { computed, onMounted, ref, watch } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

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
const store = useAppStore()
const { storageImage } = useIconImage()
const { getCurrent } = useConvertDate()
const { actionShareAllowed } = useActionShareAllowed()

// Refs
const holders = ref([])

const partnerListKey = computed(() => store.partnerListKey)

// Functions

/**
 * Gateway List Status Converter
 */
const convartAppType = (type) => {
  if (type == '1') return 'API'
  if (type == '2') return 'Custom'
  if (type == '3') return 'Donate'
}

/**
 * Get Share App Holders
 */
const getAppShareHolders = async () => {
  if (actionShareAllowed(props.app.share_type, 'get_share')) {
    await store.getAppShareHolders(props.app.id).then((res) => {
      if (res) {
        holders.value = res
      }
    })
  }
}

onMounted(() => {
  setTimeout(() => {
    getAppShareHolders()
  }, 1000)
})

watch(partnerListKey, () => {
  getAppShareHolders()
})
</script>

<template>
  <div
    :class="[
      { 'card gradient-image-box application-card': true },
      { disabled: app.status != 1 },
      { 'have-partners': holders.length }
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
          <!-- begin::Logo -->
          <img
            :src="app.logo ? storageImage(app.logo, 48) : '/media/images/banner/default-app.png'"
            :alt="app.name"
            class="img-fluid rounded-1"
            width="48"
          />
          <!-- end::Logo -->

          <!-- begin::Partners -->
          <div class="partners" v-if="holders.length">
            <!-- begin::Item -->
            <span class="item" v-for="item in holders" :key="item.id">
              <img
                :src="
                  item.avatar ? storageImage(item.avatar, 40) : `/media/images/banner/auth-bg.jpg`
                "
                :alt="item.first_name"
              />
            </span>
            <!-- end::Item -->
          </div>
          <!-- end::Partners -->
        </div>

        <!-- begin::Share Type -->
        <p class="mb-0 fs-7 ls-base text-gray-600">as {{ $filters.capitalize(app.share_type) }}</p>
        <!-- end::Share Type -->

        <!-- begin::Name -->
        <h2 :class="`name text-app-${app.settings.color}  `">
          <img src="/media/icons/icons/stop.png" alt="stop" />
          {{ app.name }}
        </h2>
        <!-- end::Name -->

        <!-- begin::Info -->
        <div class="infos mt-6">
          <!-- begin::Item -->
          <div class="item">
            <p class="value">${{ app?.summary?.total_income.toFixed(2) }}</p>
            <p class="title">Total Earning</p>
          </div>
          <!-- end::Item -->

          <!-- begin::Item -->
          <div class="item">
            <p class="value">${{ app?.summary?.total_withdraws.toFixed(2) }}</p>
            <p class="title">Withdrawn</p>
          </div>
          <!-- end::Item -->

          <!-- begin::Item -->
          <div class="item">
            <p class="value">${{ app?.summary?.last_month_income.toFixed(2) }}</p>
            <p class="title">Earned in {{ getCurrent('MMMM') }}</p>
          </div>
          <!-- end::Item -->

          <!-- begin::Item -->
          <div class="item">
            <p class="value">${{ app?.summary?.usd_value.toFixed(2) }}</p>
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
            :to="{ name: 'application-overview', params: { id: app.id } }"
            class="btn btn-primary w-100"
          >
            Enter

            <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
          </RouterLink>
        </div>
      </div>
      <!-- end::Enter Action -->

      <!-- begin::Status Action -->
      <div class="d-flex flex-wrap flex-lg-nowrap gap-4" v-if="action === 'action'">
        <button
          v-if="actionShareAllowed(app.share_type, 'update_share')"
          type="button"
          class="btn btn-primary p-0 w-40px h-40px"
          data-bs-toggle="offcanvas"
          data-bs-target="#addPartner_offcanvas"
          aria-controls="addPartner_offcanvas"
        >
          <inline-svg src="media/icons/icons/share.svg"></inline-svg>
        </button>

        <button
          v-if="app.type == 1"
          type="button"
          :disabled="app.status != 1"
          class="btn btn-primary w-168px"
          data-bs-toggle="offcanvas"
          data-bs-target="#createInvoice_offcanvas"
          aria-controls="createInvoice_offcanvas"
        >
          <inline-svg src="media/icons/icons/card.svg"></inline-svg>
          Invoice
        </button>
      </div>
      <!-- end::Status Action -->
    </div>
  </div>
</template>
