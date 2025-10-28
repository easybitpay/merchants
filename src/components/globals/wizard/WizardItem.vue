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
    <div
      :class="[
        { 'card wizard-item': true },
        { 'wizard-prev': step < activeStep },
        { 'wizard-active': step === activeStep }
      ]"
    >
      <div class="card-body px-0 py-6">
        <div class="wizard-data" v-show="step === activeStep">
          <slot></slot>
        </div>

        <!-- begin::Info Show -->
        <div class="wizard-info p-6 py-0 px-xl-0" v-if="step != activeStep">
          <div>
            <div class="svg-holder svg-holder-sm">
              <inline-svg
                :src="`/media/icons/shapes/${$filters.shapeStatus(
                  info.icon,
                  step < activeStep ? 'active' : 'gray'
                )}.svg`"
              ></inline-svg>
            </div>
          </div>

          <div class="text-center">
            <h5 class="mb-2 text-gray-800   fw-normal">{{ info.title }}</h5>
            <small class="text-gray-500 ls-base">{{ info.subject }}</small>
          </div>

          <h5
            :class="`mb-0 mb-xl-2 text-${
              step < activeStep ? 'primary' : 'gray-500'
            }   fw-normal text-center`"
          >
            0{{ step + 1 }}
          </h5>
        </div>
        <!-- end::Info Show -->
      </div>
    </div>
  </div>
</template>
