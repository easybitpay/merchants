<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Components
import ContentColumn from '../../globals/ContentColumn.vue'

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
  <div class="card mb-6">
    <!-- begin::Header -->
    <div class="card-header">
      <div>
        <h6 class="title">Active Sessions</h6>

        <p class="desc">Devices currently signed into your account</p>
      </div>
    </div>
    <!-- end::Header -->

    <!-- begin::Content -->
    <div class="card-body d-flex flex-column gap-4">
      <!-- begin::Loading -->
      <template v-if="loading">
        <ContentColumn v-for="item in 2" :key="item" textLoading iconLoading />
      </template>
      <!-- end::Loading -->

      <!-- begin::Item -->
      <ContentColumn
        v-for="item in filteredList"
        :key="item.id"
        :title="item.type"
        :value="item.ip"
        :textIcon="item.type.charAt(0)"
        class="hover-sm-show-parent"
      >
        <inline-svg
          src="media/icons/icons/trash.svg"
          height="24"
          class="svg-icon-danger hover-show-target"
        ></inline-svg>
      </ContentColumn>
      <!-- end::Item -->

      <!-- begin::View More -->
      <button
        v-if="filteredList.length < list.length"
        class="btn btn-light"
        @click="showCount = showCount + 2"
      >
        View more
      </button>
      <!-- end::View More -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Last Sign in -->
</template>
