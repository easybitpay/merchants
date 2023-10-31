<script setup>
import ApiKey from '../../../components/application/ApiKey.vue'
import Charts from '../../../components/application/Charts.vue'
import Partners from '../../../components/application/Partners.vue'
import ApplicationCard from '../../../components/application/ApplicationCard.vue'
</script>

<template>
  <ApplicationCard action="status" />

  <ApiKey />

  <Charts />

  <Partners />
</template>
