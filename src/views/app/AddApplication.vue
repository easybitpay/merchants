<script setup>
// Vue
import { computed, ref } from 'vue'

// Component
import Start from '../../components/add-application/Start.vue'
import Pro from '../../components/add-application/Pro.vue'
import Info from '../../components/add-application/Info.vue'
import Verify from '../../components/add-application/Verify.vue'

// ----- START ----- //
const steps = [
  {
    icon: 'screen',
    title: 'Gateway Setup',
    subject: 'Choose type & basic info',
    component: Start
  },
  {
    icon: 'settings',
    title: 'Configuration',
    subject: 'URLs & token settings',
    component: Pro
  },
  {
    icon: 'palette',
    title: 'Customization',
    subject: 'Branding & appearance',
    component: Info
  },
  {
    icon: 'check-circle',
    title: 'Review & Launch',
    subject: 'Confirm & create',
    component: Verify
  }
]

// Refs
const activeStep = ref(0)
const loading = ref(false)
const appInfo = ref({})
const createdAppInfo = ref({})

// Computeds
const nextButtonText = computed(() => {
  if (activeStep.value === 3) return 'Create Application'
  return 'Continue'
})

const progressPercent = computed(() => {
  return ((activeStep.value + 1) / steps.length) * 100
})

// Functions
const changeLoadingStatus = (status) => {
  loading.value = status
}

const next = () => {
  if (activeStep.value < steps.length - 1) {
    activeStep.value++
    // Smooth scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prev = () => {
  if (activeStep.value > 0) {
    activeStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goNext = (info) => {
  for (const [key, value] of Object.entries(info)) {
    appInfo.value[key] = value
  }
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
  <div class="premium-wizard-container">
    <!-- Progress Header -->
    <div class="premium-progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <div class="premium-wizard-centered">
      <!-- Horizontal Step Progress -->
      <div class="steps-progress-horizontal">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="step-item"
          :class="{ 
            'active': index === activeStep, 
            'completed': index < activeStep 
          }"
        >
          <div class="step-circle">
            <svg v-if="index < activeStep" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11.5 3.5L5.25 9.75L2.5 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span class="step-label">{{ step.title }}</span>
        </div>
      </div>

      <!-- Content Area with Transition -->
      <transition name="slide-fade" mode="out-in">
        <div :key="activeStep" class="step-content-centered">
          <component
            :is="steps[activeStep].component"
            @goNext="goNext"
            @setCreatedAppInfo="setCreatedAppInfo"
            @changeLoadingStatus="changeLoadingStatus"
            :appInfo="appInfo"
            :createdAppInfo="createdAppInfo"
          />
        </div>
      </transition>

      <!-- Navigation -->
      <div class="premium-navigation-centered">
        <button
          v-if="activeStep > 0"
          @click="prev"
          type="button"
          class="btn-back"
        >
          <inline-svg src="media/icons/icons/arrow-left.svg" width="18" height="18"></inline-svg>
          <span>Back</span>
        </button>
        <div v-else></div>

        <div class="nav-actions">
          <button
            v-if="activeStep < 3"
            @click="$router.push('/apps')"
            type="button"
            class="btn-skip"
          >
            Skip for now
          </button>
          
          <button
            @click="submitForm"
            type="button"
            class="btn-premium"
            :disabled="loading"
            :class="{ loading: loading }"
          >
            <span v-if="!loading" class="btn-content">
              <span>{{ nextButtonText }}</span>
              <inline-svg 
                v-if="activeStep < 3"
                src="media/icons/icons/arrow-right.svg" 
                width="18" 
                height="18"
                class="arrow-icon"
              ></inline-svg>
            </span>
            <span v-else class="btn-loading">
              <span class="spinner"></span>
              <span>Processing...</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Help Card at Bottom -->
      <div class="help-card-bottom">
        <div class="help-icon-small">💡</div>
        <span class="help-text-inline">Need help?</span>
        <a href="#" class="help-link-inline">View documentation →</a>
      </div>
    </div>
  </div>
</template>
