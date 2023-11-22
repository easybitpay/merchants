<script setup>
// Vue
import { ref } from 'vue'

// Component
import WizardItem from '../../components/globals/wizard/WizardItem.vue'
import Start from '../../components/add-application/Start.vue'
import Type from '../../components/add-application/Type.vue'
import Info from '../../components/add-application/Info.vue'
import Pro from '../../components/add-application/Pro.vue'
import Verify from '../../components/add-application/Verify.vue'
import Finish from '../../components/add-application/Finish.vue'

// ----- START ----- //
const steps = [
  {
    title: 'Start',
    subject: 'Gateway',
    component: Start
  },
  {
    title: 'Type',
    subject: 'Gateway',
    component: Type
  },
  {
    title: 'Info',
    subject: 'Gateway',
    component: Info
  },
  {
    title: 'Pro',
    subject: 'Gateway',
    component: Pro
  },
  {
    title: 'Verify',
    subject: 'Gateway',
    component: Verify
  },
  {
    title: 'Finish',
    subject: 'Gateway',
    component: Finish
  }
]

const activeStep = ref(0)

const next = () => {
  if (activeStep.value < steps.length - 1) {
    activeStep.value++
  }
}
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <!-- begin::Header -->
    <h2 class="text-primary fw-normal mb-12 neue-machina">Add Applications</h2>
    <!-- end::Header -->

    <div class="wizard flex-root">
      <div class="row gy-6">
        <WizardItem
          v-for="(item, index) in steps"
          :key="index"
          :activeStep="activeStep"
          :step="index"
          :info="item"
        >
          <component :is="item.component" />
        </WizardItem>
      </div>
    </div>

    <!-- begin::Actions -->
    <div>
      <button class="btn btn-primary" @click="next">Continue</button>
    </div>
    <!-- end::Actions -->
  </div>
</template>
