<script setup>
// Componets
import PageHeader from '../../../components/globals/PageHeader.vue'
import Authentication from '../../../components/settings/privacy/Authentication.vue'
// import KYC from '../../../components/settings/privacy/KYC.vue'
import LastSignIn from '../../../components/settings/privacy/LastSignIn.vue'

// ----- START ----- //
</script>

<template>
  <PageHeader
    title="Privacy & Security"
    description="Manage your security settings and account access"
  />
  <Authentication />

  <LastSignIn />

  <!-- <KYC /> -->
</template>
