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
  <div :class="`col-12 ${step === activeStep ? 'col-xl-8' : 'col-xl'}`">
    <div
      :class="[
        { 'card wizard-item': true },
        { 'wizard-prev': step < activeStep },
        { 'wizard-active': step === activeStep },
        { 'wizard-inactive': step > activeStep }
      ]"
    >
      <div class="card-body px-0 py-6">
        <div class="wizard-data" v-show="step === activeStep">
          <slot></slot>
        </div>

        <!-- begin::Info Show -->
        <div class="wizard-info p-6 py-0 px-xl-0" v-if="step != activeStep">
          <div class="d-flex align-items-center gap-3 w-100">
            <div class="svg-holder svg-holder-sm flex-shrink-0">
              <inline-svg
                :src="`/media/icons/shapes/${$filters.shapeStatus(
                  info.icon,
                  step < activeStep ? 'active' : 'gray'
                )}.svg`"
              ></inline-svg>
            </div>

            <div class="flex-grow-1 text-start">
              <h6 class="mb-1 text-gray-800 neue-machina fw-normal">{{ info.title }}</h6>
              <small class="text-gray-500 ls-base d-none d-md-block">{{ info.subject }}</small>
            </div>

            <h6
              :class="`mb-0 text-${
                step < activeStep ? 'primary' : 'gray-400'
              } neue-machina fw-normal`"
            >
              {{ step < activeStep ? '✓' : '0' + (step + 1) }}
            </h6>
          </div>
        </div>
        <!-- end::Info Show -->
      </div>
    </div>
  </div>
</template>
