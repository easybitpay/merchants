<script setup>
// Vue
import { computed, ref } from 'vue'

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
    icon:'print',
    title: 'Start',
    subject: 'Gateway',
    component: Start
  },
  {
    icon:'archive',
    title: 'Type',
    subject: 'Gateway',
    component: Type
  },
  {
    icon:'deep-view',
    title: 'Info',
    subject: 'Gateway',
    component: Info
  },
  {
    icon:'tag',
    title: 'Pro',
    subject: 'Gateway',
    component: Pro
  },
  {
    icon:'camera',
    title: 'Verify',
    subject: 'Gateway',
    component: Verify
  },
  {
    icon:'package',
    title: 'Finish',
    subject: 'Gateway',
    component: Finish
  }
]

// Refs
const activeStep = ref(0)
const loading = ref(false)
const appInfo = ref({})
const createdAppInfo = ref({})

// Computeds
const nextButtonText = computed(() => {
  if (appInfo.value.type && appInfo.value.type.type == 1) {
    if (activeStep.value === 4) return 'Verify'

    return 'Continue'
  } else {
    return 'Continue'
  }
})

// Functions
const changeLoadingStatus = (status) => {
  loading.value = status
}

const next = () => {
  if (activeStep.value < steps.length - 1) {
    activeStep.value++
  }
}

const prev = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

const goNext = (info) => {
  for (const [key, value] of Object.entries(info)) {
    appInfo.value[key] = value
  }

  console.log(appInfo.value)
  next()
}

const setCreatedAppInfo = (info) => {
  createdAppInfo.value = info
}

const submitForm = () => {
  document.dispatchEvent(new CustomEvent(`submitStep${activeStep.value}`))
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
          <component
            :is="item.component"
            @goNext="goNext"
            @setCreatedAppInfo="setCreatedAppInfo"
            @changeLoadingStatus="changeLoadingStatus"
            :appInfo="appInfo"
            :createdAppInfo="createdAppInfo"
          />
        </WizardItem>
      </div>
    </div>

    <!-- begin::Actions -->
    <div class="d-flex flex-wrap gap-4 mt-10">
      <button type="button" @click="prev" class="btn border-0 bg-gray-200 p-0 w-40px h-40px">
        <inline-svg src="media/icons/icons/arrow-left.svg" class="svg-icon-primary"></inline-svg>
      </button>

      <button
        :disabled="loading"
        class="btn btn-primary w-184px"
        @click="submitForm"
        v-if="activeStep != 5"
      >
        {{ loading ? 'Loading...' : nextButtonText }}
      </button>

      <RouterLink
        :to="{ name: 'application-overview', params: { id: createdAppInfo.id } }"
        v-if="activeStep === 5"
        class="btn btn-primary w-184px"
      >
        Go to App
      </RouterLink>

      <button
        class="btn btn-primary w-184px"
        @click="next"
        v-if="appInfo?.type?.type == 1 && activeStep === 4"
      >
        Skip
      </button>
    </div>
    <!-- end::Actions -->
  </div>
</template>
