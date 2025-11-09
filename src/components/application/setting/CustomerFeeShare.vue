<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useActionShareAllowed from '@/composables/useActionShareAllowed.js'

// ----- START ----- //

// Generals
const store = useAppStore()
const { actionShareAllowed } = useActionShareAllowed()

// Refs
const loading = ref(false)
const feeShare = ref(0)

// Computeds
const selectedApp = computed(() => store.selectedApp)

// Functions

/**
 * Check Range Update
 */
const checkRangeUpdate = () => {
  const defaultPercent = selectedApp.value.customer_fee_percent
  const newPercent = feeShare.value

  if (defaultPercent != newPercent) {
    updateAppInfo()
  }
}

/**
 * Update App Info
 */
const updateAppInfo = async () => {
  // Start Loading
  loading.value = true

  // Set Variables
  const id = selectedApp.value.id
  let fd = new FormData()

  fd.append('customer_fee_percent', feeShare.value)

  // Request
  await store.updateApp({ id, fd })

  // Stop Loading
  loading.value = false
}

onMounted(() => {
  feeShare.value = selectedApp.value.customer_fee_percent

  setTimeout(() => {
    var range = document.querySelector('.range')

    var thumb = document.querySelector('.range-thumb')
    var max = parseInt(range.max, 10)
    var thumbWidth = 101 // Thumb width. See CSS

    range.addEventListener('input', function () {
      var width = range.offsetWidth
      var value = parseInt(range.value, 10)
      var text = value >= max ? '100' : value
      var positionInPX = (value * (width - thumbWidth)) / max

      thumb.style.left = positionInPX + 'px'
      thumb.querySelector('.merchant').innerHTML = text
      thumb.querySelector('.user').innerHTML = 100 - text
    })

    window.addEventListener('resize', function () {
      range.dispatchEvent(new Event('input'))
    })

    // Calculate on load
    range.dispatchEvent(new Event('input'))
  }, 1)
})
</script>

<template>
  <!-- begin::Customer Fee Share -->
  <div class="card mb-6">
    <!-- begin::Header -->
    <div class="card-header">
      <div>
        <h6 class="title d-flex align-items-center gap-3">
          Customer Fee Share
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
        </h6>

        <p class="desc">Some info may be visible to other people using Google services.</p>
      </div>
    </div>
    <!-- end::Header -->

    <!-- begin::Content -->
    <div class="card-body d-flex flex-column align-items-start">
      <div class="w-100 w-lg-initial">
        <div class="d-flex align-items-end justify-content-between gap-7 mb-4">
          <!-- begin::Top -->
          <inline-svg
            :src="`/media/icons/shapes/${$filters.shapeStatus('account')}.svg`"
            width="43"
            height="48"
            class="d-none d-sm-block"
          ></inline-svg>

          <div class="range-div w-100 w-lg-384px">
            <input
              :disabled="loading || !actionShareAllowed(selectedApp.share_type, 'edit_app')"
              type="range"
              name=""
              class="range"
              min="0"
              max="100"
              step="5"
              v-model="feeShare"
              @change="checkRangeUpdate"
            />
            <span class="range-thumb">
              <span class="merchant"></span>
              <span class="line"></span>
              <span class="user"></span>
            </span>
          </div>

          <inline-svg
            :src="`/media/icons/shapes/${$filters.shapeStatus('chess')}.svg`"
            width="43"
            height="48"
            class="d-none d-sm-block"
          ></inline-svg>
          <!-- end::Top -->
        </div>

        <div class="d-flex align-items-center justify-content-between text-gray-800 dark-text-gray-400 ls-base">
          <p class="mb-0 fw-medium">Merchant</p>
          <p class="mb-0 fw-medium">User</p>
        </div>
      </div>
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Customer Fee Share -->
</template>
