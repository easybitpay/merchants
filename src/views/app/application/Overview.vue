<script setup>
// Vue
import { computed } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hook
import useActionShareAllowed from '@/hooks/useActionShareAllowed.js'

// Components
import ApiKey from '../../../components/application/ApiKey.vue'
import Charts from '../../../components/application/Charts.vue'
import Partners from '../../../components/application/Partners.vue'
import ApplicationCard from '../../../components/application/ApplicationCard.vue'

// ----- START ----- //

// Generals
const store = useAppStore()
const { actionShareAllowed } = useActionShareAllowed()

// Computeds
const selectedApp = computed(() => store.selectedApp)
</script>

<template>
  <ApplicationCard action="action" :app="selectedApp" />

  <ApiKey />

  <Charts />

  <Partners v-if="actionShareAllowed(selectedApp.share_type, 'get_share')" />
</template>
