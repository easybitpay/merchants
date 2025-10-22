<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
import useConvertDate from '@/composables/useConvertDate.js'

// Componets
import TextColumn from '../../globals/TextColumn.vue'
import LockScreenOffcanvas from './LockScreenOffcanvas.vue'

// ----- START ----- //

// Generals
const { conevrtUnixToDate } = useConvertDate()
const store = useAuthStore()

// Refs
const lockScreenStatus = ref(false)
const passSetedDate = ref('')

// Functions

/**
 * Change 2FA Status
 */
const changeLockScreenStatus = () => {
  const status = localStorage.getItem('lockScreenInfo')

  if (status) {
    lockScreenStatus.value = true

    //
    const parsedInfo = JSON.parse(status)
    passSetedDate.value = conevrtUnixToDate(parsedInfo.timestamp, 'DD MMM YYYY')
  } else {
    lockScreenStatus.value = false
    passSetedDate.value = ''
  }
}

onMounted(() => {
  changeLockScreenStatus()
})
</script>

<template>
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
          <input
            class="form-check-input m-0"
            type="checkbox"
            role="switch"
            id="lockScreenSwitch"
            data-bs-toggle="offcanvas"
            data-bs-target="#lockScreen_offcanvas"
            aria-controls="lockScreen_offcanvas"
            v-model="lockScreenStatus"
          />
        </div>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <TextColumn
        v-if="passSetedDate"
        title="Lock screen Passcode"
        :content="`On since ${passSetedDate}`"
      />
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Lock Screen -->

  <LockScreenOffcanvas @changeLockScreenStatus="changeLockScreenStatus" />
</template>
