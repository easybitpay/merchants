<script setup>
const props = defineProps({
  activeStep: {
    type: Number
  },
  step: {
    type: Number
  },
  info: {
    type: Object,
    required: true
  }
})
</script>
<template>
  <div :class="`col-12 ${step === activeStep ? 'col-xl-6' : 'col-xl'}`">
    <div :class="[{ 'card wizard-item': true }, { 'wizard-active': step === activeStep }]">
      <div class="card-body p-0">
        <div class="wizard-data p-6" v-show="step === activeStep">
          <slot></slot>
        </div>

        <!-- begin::Info Show -->
        <div class="wizard-info p-6 px-xl-0" v-if="step != activeStep">
          <inline-svg src="media/icons/shapes/embed.svg" height="40"></inline-svg>

          <div class="text-center">
            <h5 class="mb-2 text-gray-800 neue-machina fw-normal">{{ info.title }}</h5>
            <small class="text-gray-500 ls-base">{{ info.subject }}</small>
          </div>

          <h5 class="mb-0 mb-xl-2 text-gray-500 neue-machina fw-normal text-center">0{{ step + 1 }}</h5>
        </div>
        <!-- end::Info Show -->
      </div>
    </div>
  </div>
</template>
