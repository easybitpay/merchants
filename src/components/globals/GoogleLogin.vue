<script setup>
// Vue
import { computed, onMounted } from 'vue'

// Props
const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  }
})

// Emit
const emit = defineEmits(['success'])

// ----- START ----- //
const clientId = computed(() => import.meta.env.VITE_APP_GOOGLE_LOGIN)

onMounted(() => {
  if (!window.gapi) {
    throw new Error(
      '"https://apis.google.com/js/api:client.js" needs to be included as a <script>.'
    )
  }

  if (!clientId.value) {
    throw new Error('Client Id must be specified.')
  }

  window.gapi.load('auth2', () => {
    const auth2 = window.gapi.auth2.init({
      client_id: clientId.value,
      scope: 'email profile'
    })
    auth2.attachClickHandler(
      'googleLogin',
      {},
      (googleUser) => {
        let auth_code = ''

        for (const [key, value] of Object.entries(googleUser)) {
          for (const [k, v] of Object.entries(value)) {
            if (k === 'access_token') {
              auth_code = v
            }
          }
        }
        emit('success', auth_code)
      },
      (error) => {
        console.log(error)
      }
    )
  })
})
</script>
<template>
  <button type="button" class="btn btn-light w-100" id="googleLogin" :disabled="loading">
    <inline-svg src="media/icons/companies/google-logo.svg"></inline-svg>

    {{ loading ? 'Loading...' : 'Connect to Google' }}
  </button>
</template>
