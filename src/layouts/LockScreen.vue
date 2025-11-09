<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

// Composabless
import useCrypto from '@/composables/useCrypto.js'

// Component
import VOtpInput from 'vue3-otp-input'

// ----- START ----- //

// Generals
const store = useAuthStore()
const themeStore = useThemeStore();
const { decriptCrypto } = useCrypto()

// Refs
const timeout = ref(null)
const errorStatus = ref(false)
const otpInputValue = ref('')

// Computeds
const lockScreen = computed(() => store.lockScreenStatus)

// Functions

const changeBG = () => {
  clearTimeout(timeout)

  errorStatus.value = true

  timeout.value = setTimeout(() => {
    errorStatus.value = false
  }, 5000)
}

const unlock = async () => {
  if (otpInputValue.value.length == 4) {
    const status = localStorage.getItem('lockScreenInfo')
    const parsedInfo = JSON.parse(status)

    const decriptedPassword = decriptCrypto(parsedInfo.password, otpInputValue.value)

    if (decriptedPassword) {
      closeLockScreen()
      otpInputValue.value = ''
    } else {
      changeBG()
    }
  } else {
    changeBG()
  }
}

const closeLockScreen = () => {
  store.changeLockScreenStatus(false)
}

const goLogin = () => {
  store.changeLockScreenStatus(false)
  store.logout()
  window.location.reload()
}

onMounted(() => {
  if (lockScreen.value) {
    store.changeLockScreenStatus(true)
  }
})
</script>

<template>
  <div class="lock-screen" v-if="lockScreen">
    <!-- begin::Main Box -->
    <div class="d-flex flex-column flex-root card-box">
      <div class="d-flex flex-column flex-root justify-content-center">
        <!-- begin::Container -->
        <div class="container d-flex flex-column align-items-center pb-8 pt-8">
          <!-- begin::Logo -->
          <inline-svg :src="`media/images/logo/${themeStore.theme}-main-logo.svg`" class="mb-6"></inline-svg>
          <!-- end::Logo -->

          <!-- begin::Card -->
          <form @submit.prevent="unlock" class="mw-448px w-100">
            <div class="card">
              <div class="card-body">
                <!-- begin::Icon -->
                <inline-svg
                  :src="`/media/icons/shapes/${$filters.shapeStatus('unlock')}.svg`"
                  width="30"
                  height="48"
                ></inline-svg>
                <!-- end::Icon -->

                <!-- begin::Text -->
                <h4 class="my-6 text-dark">Unlock</h4>

                <p class="text-gray-700 mb-12 ls-base">
                  Enter your 4 digits lock screen code to unlock
                </p>
                <!-- end::Text -->

                <!-- begin::OTP -->
                <div class="d-flex align-items-center justify-content-center mb-16">
                  <div class="otp-input otp-input-center">
                    <VOtpInput
                      ref="otpInput"
                      input-classes="form-control p-0 w-40px h-40px w-sm-48px h-sm-48px text-center fs-4"
                      separator=""
                      :num-inputs="4"
                      :should-auto-focus="true"
                      input-type="numeric"
                      v-model:value="otpInputValue"
                      @on-complete="unlock"
                    />
                  </div>
                </div>
                <!-- end::OTP -->

                <!-- begin::Actions -->
                <div class="d-flex">
                  <!-- begin::Submit Action -->
                  <button type="submit" class="btn btn-primary w-200px">
                    Unlock
                    <inline-svg src="media/icons/icons/lock.svg"></inline-svg>
                  </button>
                  <!-- end::Submit Action -->
                </div>
                <!-- end::Actions -->
              </div>
            </div>
          </form>

          <p @click="goLogin" class="text-white mt-3 mb-0 ls-base cursor-pointer">Login again?</p>
          <!-- end::Card -->
        </div>
        <!-- end::Container -->
      </div>

      <!-- begin::Copyright -->
      <div>
        <small class="text-white text-center fw-light d-block mb-4"> 2023 © easybitpay </small>
      </div>
      <!-- end::Copyright -->
    </div>
    <!-- end::Main Box -->

    <!-- begin::Backgroun Image -->
    <div
      :class="[{ 'position-fixed bottom-0 w-100 h-53vh auth-bg': true }, { error: errorStatus }]"
      style="background-image: url('media/images/banner/auth-bg.jpg')"
    ></div>
    <!-- end::Backgroun Image -->
  </div>
</template>
