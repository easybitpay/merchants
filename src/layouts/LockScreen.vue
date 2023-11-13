<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// Component
import VOtpInput from 'vue3-otp-input'
import CountDown from '../components/globals/CountDown.vue';

// ----- START ----- //
const store = useAuthStore()
const router = useRouter()

const errorStatus = ref(false)
const timeout = ref(null)

const otpInputValue = ref('')

const changeBG = () => {
  clearTimeout(timeout)

  errorStatus.value = true

  timeout.value = setTimeout(() => {
    errorStatus.value = false
  }, 5000)
}

const unlock = async () => {
  if (otpInputValue.value.length == 6) {
    closeLockScreen()
    otpInputValue.value = ''
  } else {
    changeBG()
  }
}

const lockScreen = computed(() => store.lockScreenStatus)

const closeLockScreen = () => {
  store.changeLockScreenStatus(false)
}

const goLogin = () => {
  store.changeLockScreenStatus(false)
  router.push({name: 'login'})
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
          <inline-svg src="media/images/logo/Logo.svg" class="mb-6"></inline-svg>
          <!-- end::Logo -->

          <!-- begin::Card -->
          <form @submit.prevent="unlock">
            <div class="card mw-448px w-100">
              <div class="card-body">
                <!-- begin::Icon -->
                <inline-svg src="/media/icons/shapes/unlock.svg"></inline-svg>
                <!-- end::Icon -->

                <!-- begin::Text -->
                <h4 class="my-6 text-dark">Unlock</h4>

                <p class="text-gray-700 mb-12 ls-base">
                  A 6-digit confirmation code has been sent
                  <br />
                  to 810-089-5940 via SMS.
                  <span href="" class="text-primary"> <CountDown /></span>
                </p>
                <!-- end::Text -->

                <!-- begin::OTP -->
                <div class="otp-input mb-16">
                  <VOtpInput
                    ref="otpInput"
                    v-model:value="otpInputValue"
                    input-classes="form-control p-0 w-40px h-40px w-sm-48px h-sm-48px text-center fs-4"
                    separator=""
                    :num-inputs="6"
                    :should-auto-focus="true"
                    input-type="numeric"
                  />
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

          <p @click="goLogin" class="text-white mt-3 mb-0 ls-base cursor-pointer">
            Login again?
          </p>
          <!-- end::Card -->
        </div>
        <!-- end::Container -->
      </div>

      <!-- begin::Copyright -->
      <div>
        <small class="text-white text-center neue-machina fw-light d-block mb-4">
          2023 © easybitpay
        </small>
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
