<script setup>
// Componets
import PageHeader from '../../../components/globals/PageHeader.vue'
import Authentication from '../../../components/settings/privacy/Authentication.vue'
import TwoFa from '../../../components/settings/privacy/SignIn.vue'
import KYC from '../../../components/settings/privacy/KYC.vue'
import LastSignIn from '../../../components/settings/privacy/LastSignIn.vue'
import LockScreen from '../../../components/settings/privacy/LockScreen.vue'

// ----- START ----- //
</script>

<template>
  <PageHeader
    title="Privacy & Security"
    description="Manage your security settings and account access"
  />
  <Authentication />

  <TwoFa />

  <LastSignIn />

  <KYC />

  <LockScreen />
</template>
