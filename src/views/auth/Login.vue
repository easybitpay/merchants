<script setup>
// Vue
import { computed, ref } from 'vue'

// Router
import { useRouter } from 'vue-router'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
import useForm from '@/composables/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'

// Components
import VOtpInput from 'vue3-otp-input'
import GoogleLogin from '../../components/globals/GoogleLogin.vue'

// ----- START ----- //

// Generals
const emit = defineEmits(['changeBG'])
const { showFeedBacks } = useForm()
const store = useAuthStore()
const router = useRouter()

// Refs
const step = ref(1)

const otpInputValue = ref('')
const loadings = ref({
  login: false,
  google: false
})

const showPass = ref(false)

// Computeds
const currentUser = computed(() => store.currentUser)

// Vuelidate
const form = ref({
  email: null,
  password: null
})

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage("Email isn't valid", email)
  },
  password: {
    required: helpers.withMessage('Password is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Login User
 */
const login = async () => {
  // Validate Form
  const result = await v$.value.$validate()
  if (result) {
    // Start loading
    loadings.value.login = true

    // Request
    await store.loginUser(form.value).then((res) => {
      if (res) {
        checkForNextStep()
      } else {
        emit('changeBG')
      }
    })

    // Stop Loading
    loadings.value.login = false
  } else {
    showFeedBacks()
    emit('changeBG')
  }
}

/**
 * Verify User
 * @param {validation code} code
 */
const verifyUser = async () => {
  if (otpInputValue.value.length == 6) {
    const info = {
      code: otpInputValue.value,
      merchant_id: currentUser.value.merchant.id
    }

    // Start loading
    loadings.value.login = true

    // Request
    await store.vefiryLogin(info).then((res) => {
      if (res) {
        if (localStorage.getItem('afterLoginPage')) {
          router.push(localStorage.getItem('afterLoginPage') || '/')
        } else {
          router.push({ name: 'dashboard' })
        }
      } else {
        emit('changeBG')
      }
    })

    // Stop Loading
    loadings.value.login = false
  }
}

/**
 * Success Google Popup
 * @param {google auth code} auth_code
 */
const successGoogleLogin = async (auth_code) => {
  // Start loading
  loadings.value.google = true

  // Request
  await store.googleLogin({ auth_code }).then((res) => {
    if (res) {
      checkForNextStep()
    } else {
      emit('changeBG')
    }
  })

  // Stop loading
  loadings.value.google = false
}

/**
 * Check For Next Step
 * if user has two-fa, show step 2 otherwise go to dashboard
 */
const checkForNextStep = () => {
  const two_factor = currentUser.value.merchant.two_factor_enabled

  if (two_factor) {
    step.value = 2
  } else {
    if (localStorage.getItem('afterLoginPage')) {
      router.push(localStorage.getItem('afterLoginPage') || '/')
    } else {
      router.push({ name: 'dashboard' })
    }
  }
}
</script>

<template>
  <div class="card mw-448px w-100 min-h-560px">
    <div class="card-body d-flex flex-column justify-content-between">
      <!-- begin::Step 1 - Get User Info -->
      <template v-if="step === 1">
        <div>
          <!-- begin::Icon -->
          <inline-svg
            :src="`/media/icons/shapes/${$filters.shapeStatus('signin')}.svg`"
            width="45"
            height="48"
          ></inline-svg>
          <!-- end::Icon -->

          <!-- begin::Text -->
          <h4 class="my-6 text-dark">Login</h4>

          <p class="text-gray-700 mb-12 ls-base">
            By signing up, you confirm that you’ve read
            <br />
            and accepted our User Notice and
            <a href="" class="text-primary"> Privacy Policy.</a>
          </p>
          <!-- end::Text -->
        </div>

        <!-- begin::Form -->
        <form @submit.prevent="login">
          <!-- begin::Email & Phone -->
          <div class="mb-6 position-relative">
            <input
              type="text"
              :class="[{ 'form-control': true }, { 'is-valid': !v$.email.$invalid }]"
              placeholder="Your Email or Phone No."
              v-model="form.email"
            />

            <div class="invalid-feedback form-control" v-if="v$.email.$errors.length">
              <span> {{ v$.email.$errors[0].$message }}</span>
            </div>
          </div>
          <!-- end::Email & Phone -->

          <!-- begin::Password -->
          <div class="mb-12 position-relative d-flex align-items-center">
            <input
              :type="showPass ? 'text' : 'password'"
              class="form-control"
              placeholder="Password"
              v-model="form.password"
            />
            <div class="invalid-feedback form-control" v-if="v$.password.$errors.length">
              <span> {{ v$.password.$errors[0].$message }}</span>
            </div>

            <!-- begin::Icon -->
            <inline-svg
              @click="showPass = !showPass"
              :src="`media/icons/icons/${showPass ? 'hide' : 'show'}.svg`"
              class="position-absolute end-16px cursor-pointer svg-icon-gray-700"
            ></inline-svg>
            <!-- end::Icon -->
          </div>
          <!-- end::Password -->

          <div class="d-flex flex-column flex-sm-row gap-4">
            <RouterLink :to="{ name: 'reset-password' }" class="btn btn-white text-primary w-100">
              Forget Password
            </RouterLink>

            <!-- begin::Submit -->
            <button type="submit" class="btn btn-primary w-100" :disabled="loadings.login">
              <template v-if="!loadings.login">
                Login
                <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
              </template>

              <span v-else>Loading...</span>
            </button>
            <!-- end::Submit -->
          </div>

          <p class="my-6 text-center ls-base">or</p>

          <!-- begin::Google Login -->
          <GoogleLogin :loading="loadings.google" @success="successGoogleLogin" />
          <!-- end::Google Login -->
        </form>
        <!-- end::Form -->
      </template>
      <!-- end::Step 1 - Get User Info -->

      <!-- begin::Step 2 - Get OTP Code -->
      <template v-else>
        <div>
          <!-- begin::Icon -->
          <div class="svg-holder">
            <inline-svg
              :src="`media/icons/shapes/${$filters.shapeStatus('2F')}.svg`"
              width="39"
              height="38"
            ></inline-svg>
          </div>
          <!-- end::Icon -->

          <!-- begin::Text -->
          <h4 class="my-6 text-dark">Validate number</h4>

          <p class="text-gray-700 mb-12 ls-base">Fill inputs with your authenticator</p>
          <!-- end::Text -->

          <!-- begin::OTP -->
          <div class="otp-input">
            <VOtpInput
              ref="otpInput"
              input-classes="form-control p-0 w-40px h-40px w-sm-48px h-sm-48px text-center fs-4"
              separator=""
              :num-inputs="6"
              :should-auto-focus="true"
              input-type="numeric"
              v-model:value="otpInputValue"
              @on-complete="verifyUser"
            />
          </div>
          <!-- end::OTP -->
        </div>

        <!-- begin::Actions -->
        <div class="d-flex gap-4">
          <!-- begin::Back Action -->
          <div>
            <button class="btn btn-light p-0 w-40px" @click="step = 1">
              <inline-svg
                src="media/icons/icons/arrow-left.svg"
                class="svg-icon-primary"
              ></inline-svg>
            </button>
          </div>
          <!-- end::Back Action -->

          <!-- begin::Submit Action -->
          <button
            type="submit"
            class="btn btn-primary w-100"
            @click="verifyUser"
            :disabled="loadings.login"
          >
            <template v-if="!loadings.login">
              Continue
              <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
            </template>

            <span v-else>Loading...</span>
          </button>
          <!-- end::Submit Action -->
        </div>
        <!-- end::Actions -->
      </template>
      <!-- end::Step 2 - Get OTP Code -->
    </div>
  </div>

  <RouterLink v-if="step === 1" :to="{ name: 'register' }" class="text-white mt-6 ls-base">
    Can’t login, Sign up for new user?
  </RouterLink>
</template>
