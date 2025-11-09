<script setup>
// Components
import PageHeader from '../../../components/globals/PageHeader.vue'

import PersonalInfo from '../../../components/settings/basic/PersonalInfo.vue'
import ContactImage from '../../../components/settings/basic/ContactImage.vue'
import ContactInfo from '../../../components/settings/basic/ContactInfo.vue'
import LinkedAccounts from '../../../components/settings/basic/LinkedAccounts.vue'
import LanguageInfo from '../../../components/settings/basic/LanguageInfo.vue'
</script>

<template>
  <PageHeader
    title="Account Settings"
    description="Manage your personal information and preferences"
  />

  <ContactImage />

  <PersonalInfo />

  <ContactInfo />

  <LinkedAccounts />

  <LanguageInfo />
</template>
