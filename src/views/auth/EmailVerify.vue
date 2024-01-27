<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Router
import { useRoute } from 'vue-router'

// Store
import { useAuthStore } from '@/stores/auth'

// ----- START ----- //

// Generals
const emit = defineEmits(['changeBG'])
const store = useAuthStore()
const route = useRoute()

// Refs
const loading = ref(false)
const varified = ref(false)
const emailToken = computed(() => route.params.token)

// Functions

/**
 * Verify Email
 */
const verifyEmail = async () => {
  // start loading
  loading.value = true

  // request
  await store.verifyEmail(emailToken.value).then((res) => {
    if (res) {
      varified.value = true
    } else {
      emit('changeBG')
    }
  })

  // stop loading
  loading.value = false
}

onMounted(() => {
  verifyEmail()
})
</script>

<template>
  <div class="card mw-448px w-100 min-h-400px">
    <div class="card-body d-flex flex-column justify-content-between">
      <div>
        <!-- begin::Icon -->
        <inline-svg
          :src="`/media/icons/shapes/${$filters.shapeStatus('lock')}.svg`"
          width="45"
          height="48"
        ></inline-svg>
        <!-- end::Icon -->

        <!-- begin::Text -->
        <h4 class="my-6 text-dark d-flex align-items-center gap-3">
          Email Verify
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
        </h4>
        <!-- end::Text -->
      </div>

      <div class="mb-10">
        <h1
          :class="`text-center mb-0 text-${varified ? 'success' : 'danger'}`"
          style="font-size: 2rem"
        >
          {{ varified ? 'Activation successfull' : 'Activation failed' }}
        </h1>
      </div>

      <!-- begin::Action -->
      <RouterLink to="/" class="btn btn-primary w-100"> Go Home </RouterLink>
      <!-- end::Action -->
    </div>
  </div>
</template>
