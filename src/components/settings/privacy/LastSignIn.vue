<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Components
import LastSignInLoading from '../../loadings/LastSignInLoading.vue'

// ----- START ----- //

// Generals
const store = useAuthStore()

// Refs
const showCount = ref(2)
const loading = ref(false)
const list = ref(false)

// Computeds
const filteredList = computed(() => {
  if (list.value.length) {
    return list.value.slice(0, showCount.value)
  } else {
    return []
  }
})

// Functions

/**
 * Get Active Sessions
 */
const getActiveSessions = async () => {
  // Start Loading
  loading.value = true

  // Request
  await store.getActiveSessions().then((res) => {
    if (res) {
      list.value = res
    }
  })

  // Stop Loading
  loading.value = false
}

onMounted(() => {
  getActiveSessions()
})
</script>

<template>
  <!-- begin::Last Sign in -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Your Last Signed</h4>

    <p class="mb-6 text-gray-800">Where you’re signed in</p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-2">
      <LastSignInLoading v-if="loading" />

      <!-- begin::Item -->
      <div
        class="row ls-base text-gray-800 text-hover-primary hover-sm-show-parent"
        v-for="item in filteredList"
        :key="item.id"
      >
        <div
          class="col-4 col-sm-6 col-md-4 col-lg-3 col-xl-2 lh-24px d-flex justify-content-between"
        >
          {{ item.type }}

          <div class="d-none d-sm-block">
            <span
              class="d-flex align-items-center justify-content-center rounded-circle w-24px h-24px bg-gray-200 text-primary"
            >
              <small>{{ item.type.charAt(0) }}</small>
            </span>
          </div>
        </div>

        <div
          class="col-8 col-sm-6 col-md-4 col-lg-3 col-xl-2 lh-24px d-flex justify-content-end justify-content-sm-between"
        >
          {{ item.ip }}

          <inline-svg
            src="media/icons/icons/trash.svg"
            height="24"
            class="svg-icon-danger hover-show-target d-none d-sm-block"
          ></inline-svg>
        </div>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->

    <!-- begin::View More -->
    <div class="row" v-if="filteredList.length < list.length">
      <div class="col-12 col-md-8 col-lg-6 col-xl-4">
        <button class="btn bg-gray-200 text-primary w-100 mt-6" @click="showCount = showCount + 2">
          View more
        </button>
      </div>
    </div>
    <!-- end::View More -->
  </div>
  <!-- end::Last Sign in -->
</template>
