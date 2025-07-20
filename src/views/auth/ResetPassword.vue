<script setup>
// Vue
import { ref, computed, watch } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required, email, sameAs } from '@vuelidate/validators'

// Components
import VOtpInput from 'vue3-otp-input'
import CountDown from '../../components/globals/CountDown.vue'

//
import { PasswordMeterComponent } from '@/assets/js/PasswordMeter'

// ----- START ----- //

// Generals
const emit = defineEmits(['changeBG'])
const { showFeedBacks } = useForm()
const store = useAuthStore()

// Refs
const step = ref(1)

const loading = ref(false)
const otpInputValue = ref('')

const showPass1 = ref(false)
const showPass2 = ref(false)

const passwordMeter = ref(null)

// Vuelidate
const stepOneForm = ref({
  email: null
})

const stepTwoForm = ref({
  password: null,
  password_confirmation: null
})

const passwordComputed = computed(() => stepTwoForm.value.password)

const stepOneRules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage("Email isn't valid", email)
  }
}

const stepTwoRules = {
  password: {
    required: helpers.withMessage('Password is required', required)
  },
  password_confirmation: {
    required: helpers.withMessage('rePassword is required', required),
    sameAsPassword: helpers.withMessage('Password not matching ', sameAs(passwordComputed))
  }
}

const v1$ = useVuelidate(stepOneRules, stepOneForm)
const v2$ = useVuelidate(stepTwoRules, stepTwoForm)

watch(step, () => {
  if (step.value === 2) {
    setTimeout(() => {
      passwordMeter.value = new PasswordMeterComponent({})
    }, 1000)
  }
})

// Functions

/**
 * Send Forget Password Email
 */
const sendEmail = async () => {
  // Validate Form
  const result = await v1$.value.$validate()
  if (result) {
    // Start loading
    loading.value = true

    // Request
    await store.sendForgetPasswordEmail(stepOneForm.value).then((res) => {
      if (res) {
        if (step.value === 1) {
          step.value = 2
        }
      } else {
        emit('changeBG')
      }
    })

    // Stop Loading
    loading.value = false
  } else {
    showFeedBacks()
    emit('changeBG')
  }
}

/**
 * Get New Passwords Of User
 */
const submitPassword = async () => {
  // Validate Form
  const result = await v2$.value.$validate()
  if (result) {
    // Validate Size Of Code
    if (otpInputValue.value.length == 6) {
      let content = { ...stepTwoForm.value }
      content.code = otpInputValue.value

      // Start loading
      loading.value = true

      // Request
      await store.resetPassword(content).then((res) => {
        if (res) {
          step.value = 3
        }
      })

      // Stop loading
      loading.value = false
    }
  } else {
    showFeedBacks()
    emit('changeBG')
  }
}
</script>

<template>
  <div class="card mw-448px w-100">
    <div class="card-body">
      <!-- begin::Step 1 - Get User Email -->
      <form
        v-if="step === 1"
        @submit.prevent="sendEmail"
        class="d-flex flex-column justify-content-between min-h-560px"
      >
        <div>
          <!-- begin::Icon -->
          <div class="svg-holder">
            <inline-svg
              :src="`media/icons/shapes/${$filters.shapeStatus('lock')}.svg`"
              width="21"
              height="32"
            ></inline-svg>
          </div>
          <!-- end::Icon -->

          <!-- begin::Text -->
          <h4 class="my-6 text-dark">Reset Password</h4>

          <p class="text-gray-700 mb-12 ls-base">
            By signing up, you confirm that you’ve read
            <br />
            and accepted our User Notice and
            <a href="" class="text-primary"> Privacy Policy.</a>
          </p>
          <!-- end::Text -->

          <!-- begin::Email -->
          <div class="mb-6 position-relative">
            <input
              type="text"
              :class="[{ 'form-control': true }, { 'is-valid': !v1$.email.$invalid }]"
              placeholder="Email Address"
              v-model="stepOneForm.email"
            />

            <div class="invalid-feedback form-control" v-if="v1$.email.$errors.length">
              <span> {{ v1$.email.$errors[0].$message }}</span>
            </div>
          </div>
          <!-- end::Email -->
        </div>

        <!-- begin::Submit -->
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <template v-if="!loading">
            Send Reset Link
            <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
          </template>
          <span v-else>Loading...</span>
        </button>
        <!-- end::Submit -->
      </form>
      <!-- end::Step 1 - Get User Email -->

      <!-- begin::Step 2 - Password -->
      <form
        v-if="step === 2"
        @submit.prevent="submitPassword"
        class="d-flex flex-column justify-content-between min-h-560px"
      >
        <div>
          <div>
            <!-- begin::Icon -->
            <div class="svg-holder">
              <inline-svg
                :src="`media/icons/shapes/${$filters.shapeStatus('lock')}.svg`"
                width="21"
                height="32"
              ></inline-svg>
            </div>
            <!-- end::Icon -->

            <!-- begin::Text -->
            <h4 class="my-6 text-dark">Reset Password</h4>

            <p class="text-gray-700 mb-12 ls-base">
              A 6-digit confirmation code has been sent
              <br />
              to {{ stepOneForm.email }} via Email.
              <span class="text-primary"> <CountDown @isRestarted="sendEmail" /></span>
            </p>
            <!-- end::Text -->

            <div data-password-meter="true">
              <!-- begin::Password -->
              <div class="mb-3 position-relative d-flex align-items-center">
                <input
                  id="password"
                  :type="showPass1 ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Password"
                  v-model="stepTwoForm.password"
                />
                <div class="invalid-feedback form-control" v-if="v2$.password.$errors.length">
                  <span> {{ v2$.password.$errors[0].$message }}</span>
                </div>

                <!-- begin::Icon -->
                <inline-svg
                  @click="showPass1 = !showPass1"
                  :src="`media/icons/icons/${showPass1 ? 'hide' : 'show'}.svg`"
                  class="position-absolute end-16px cursor-pointer svg-icon-gray-700"
                ></inline-svg>
                <!-- end::Icon -->
              </div>
              <!-- end::Password -->

              <!--begin::Meter-->
              <div
                class="d-flex align-items-center gap-7 px-2 mb-6"
                data-password-meter-control="highlight"
              >
                <div class="flex-grow-1 bg-gray-200 bg-active-primary rounded h-6px"></div>
                <div class="flex-grow-1 bg-gray-200 bg-active-primary rounded h-6px"></div>
                <div class="flex-grow-1 bg-gray-200 bg-active-primary rounded h-6px"></div>
                <div class="flex-grow-1 bg-gray-200 bg-active-primary rounded h-6px"></div>
              </div>
              <!--end::Meter-->

              <!-- begin::Confirm Password -->
              <div class="mb-4 position-relative d-flex align-items-center">
                <input
                  id="confirmation"
                  :type="showPass2 ? 'text' : 'password'"
                  class="form-control"
                  placeholder="rePassword"
                  v-model="stepTwoForm.password_confirmation"
                />
                <div
                  class="invalid-feedback form-control"
                  v-if="v2$.password_confirmation.$errors.length"
                >
                  <span> {{ v2$.password_confirmation.$errors[0].$message }} </span>
                </div>

                <!-- begin::Icon -->
                <inline-svg
                  @click="showPass2 = !showPass2"
                  :src="`media/icons/icons/${showPass2 ? 'hide' : 'show'}.svg`"
                  class="position-absolute end-16px cursor-pointer svg-icon-gray-700"
                ></inline-svg>
                <!-- end::Icon -->
              </div>
              <!-- end::Confirm Password -->
            </div>
          </div>

          <div class="mt-4 pt-4 border-top border-gray-200">
            <p class="text-gray-700 mb-3 ls-base fs-7">
              Enter verification code here.
            </p>
            <div class="otp-input">
              <VOtpInput
                ref="otpInput"
                input-classes="form-control p-0 w-40px h-40px w-sm-48px h-sm-48px text-center fs-4"
                separator=""
                :num-inputs="6"
                :should-auto-focus="false"
                input-type="numeric"
                v-model:value="otpInputValue"
                @on-complete="submitPassword"
              />
            </div>
          </div>
        </div>

        <!-- begin::Actions -->
        <div class="d-flex gap-4">
          <!-- begin::Back Action -->
          <div>
            <button type="button" class="btn btn-light p-0 w-40px" @click="step = 1">
              <inline-svg
                src="media/icons/icons/arrow-left.svg"
                class="svg-icon-primary"
              ></inline-svg>
            </button>
          </div>
          <!-- end::Back Action -->

          <!-- begin::Submit Action -->
          <button type="submit" :disabled="loading" class="btn btn-primary w-100">
            {{ loading ? 'Loading...' : 'Reset Password' }}
            <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
          </button>
          <!-- end::Submit Action -->
        </div>
        <!-- end::Actions -->
      </form>
      <!-- end::Step 2 - Password -->

      <!-- begin::Step 3 - Finalize -->
      <div v-if="step === 3" class="d-flex flex-column justify-content-between min-h-560px">
        <div>
          <!-- begin::Icon -->
          <div class="svg-holder">
            <inline-svg
              :src="`media/icons/shapes/${$filters.shapeStatus('star')}.svg`"
              width="32"
              height="30"
            ></inline-svg>
          </div>
          <!-- end::Icon -->

          <!-- begin::Text -->
          <h4 class="my-6 text-dark">Congratulations</h4>

          <p class="text-gray-700 mb-12 ls-base">
            Your new password is changed. A 6-digit
            <br />
            confirmation code has been sent
          </p>
          <!-- end::Text -->

          <inline-svg
            src="media/icons/shapes/star-lock-group.svg"
            class="d-block m-auto"
          ></inline-svg>
        </div>

        <!-- begin::Go Login -->
        <RouterLink :to="{ name: 'login' }" class="btn btn-primary w-100"> Login </RouterLink>
        <!-- end::Go Login -->
      </div>
      <!-- end::Step 4 - Finalize -->
    </div>
  </div>

  <RouterLink v-if="step === 1" :to="{ name: 'register' }" class="text-white mt-6 ls-base">
    Can’t login, Sign up for new user?
  </RouterLink>

  <RouterLink v-if="step === 2" :to="{ name: 'login' }" class="text-white mt-6 ls-base">
    Already have an Square account? Log in
  </RouterLink>
</template>
