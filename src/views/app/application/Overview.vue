<script setup>
// Vue
import { computed } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Components
import ApiKey from '../../../components/application/ApiKey.vue'
import Charts from '../../../components/application/Charts.vue'
import Partners from '../../../components/application/Partners.vue'
import ApplicationCard from '../../../components/application/ApplicationCard.vue'

// ----- START ----- //

// Generals
const store = useAppStore()

// Computeds
const selectedApp = computed(() => store.selectedApp)
</script>

<template>
  <ApplicationCard action="action" :app="selectedApp" />

  <ApiKey />

  <Charts />

  <Partners v-if="selectedApp.share_type === 'owner'" />
</template>
