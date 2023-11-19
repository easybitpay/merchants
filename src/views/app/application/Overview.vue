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

// ----- Start -----
const store = useAppStore()
const selectedApp = computed(() => store.selectedApp)
</script>

<template>
  <ApplicationCard action="status" :app="selectedApp" />

  <ApiKey />

  <Charts />

  <Partners />
</template>
