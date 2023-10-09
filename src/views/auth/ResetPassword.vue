<script setup>
// Vue
import { ref, computed, watch } from 'vue'

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
const emit = defineEmits(['changeBG'])

const { showFeedBacks } = useForm()

const step = ref(1)

const otpInputValue = ref('')

const showPass1 = ref(false)
const showPass2 = ref(false)

const passwordMeter = ref(null)

const stepOneForm = ref({
  email: null,
  password: null
})

const stepTwoForm = ref({
  password: null,
  confirmPassword: null
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
  confirmPassword: {
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

const submitEmail = async () => {
  const result = await v1$.value.$validate()
  if (result) {
    if (step.value === 1) {
      step.value = 2
    } else {
      console.log('safeye akhare')
    }
  } else {
    showFeedBacks()
    emit('changeBG')
  }
}

const submitPassword = async () => {
  const result = await v2$.value.$validate()
  if (result) {
    step.value = 3
  } else {
    showFeedBacks()
    emit('changeBG')
  }
}

const changePass = () => {
  if (otpInputValue.value.length == 6) {
    step.value = 4
  }
}
</script>

<template>
  <div class="card mw-448px w-100">
    <div class="card-body">
      <!-- begin::Step 1 - Get User Email -->
      <form
        v-if="step === 1"
        @submit.prevent="submitEmail"
        class="d-flex flex-column justify-content-between min-h-560px"
      >
        <div>
          <!-- begin::Icon -->
          <inline-svg src="media/icons/shapes/lock.svg"></inline-svg>
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
        <button type="submit" class="btn btn-primary w-100">
          Send Reset Link
          <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
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
          <!-- begin::Icon -->
          <inline-svg src="media/icons/shapes/lock.svg"></inline-svg>
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

          <div data-password-meter="true">
            <!-- begin::Password -->
            <div class="mb-3 position-relative d-flex align-items-center">
              <input
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
                src="media/icons/icons/webcam.svg"
                :class="[
                  { 'position-absolute end-16px cursor-pointer z-2': true },
                  { 'svg-icon-gray-700': !showPass1 }
                ]"
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
                :type="showPass2 ? 'text' : 'password'"
                class="form-control"
                placeholder="rePassword"
                v-model="stepTwoForm.confirmPassword"
              />
              <div class="invalid-feedback form-control" v-if="v2$.confirmPassword.$errors.length">
                <span> {{ v2$.confirmPassword.$errors[0].$message }} </span>
              </div>

              <!-- begin::Icon -->
              <inline-svg
                @click="showPass2 = !showPass2"
                src="media/icons/icons/webcam.svg"
                :class="[
                  { 'position-absolute end-16px cursor-pointer z-2': true },
                  { 'svg-icon-gray-700': !showPass2 }
                ]"
              ></inline-svg>
              <!-- end::Icon -->
            </div>
            <!-- end::Confirm Password -->
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
          <button type="submit" class="btn btn-primary w-100">
            Reset Password
            <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
          </button>
          <!-- end::Submit Action -->
        </div>
        <!-- end::Actions -->
      </form>
      <!-- end::Step 2 - Password -->

      <!-- begin::Step 3 - Get OTP -->
      <form
        v-if="step === 3"
        @submit.prevent="changePass"
        class="d-flex flex-column justify-content-between min-h-560px"
      >
        <div>
          <!-- begin::Icon -->
          <inline-svg src="media/icons/shapes/lock.svg"></inline-svg>
          <!-- end::Icon -->

          <!-- begin::Text -->
          <h4 class="my-6 text-dark">Reset Password</h4>

          <p class="text-gray-700 mb-12 ls-base">
            A 6-digit confirmation code has been sent
            <br />
            to {{ stepOneForm.email }} via Email.
            <span class="text-primary"> <CountDown /></span>
          </p>
          <!-- end::Text -->

          <!-- begin::OTP -->
          <div class="otp-input">
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
        </div>

        <!-- begin::Actions -->
        <div class="d-flex gap-4">
          <!-- begin::Back Action -->
          <div>
            <button type="button" class="btn btn-light p-0 w-40px" @click="step = 2">
              <inline-svg
                src="media/icons/icons/arrow-left.svg"
                class="svg-icon-primary"
              ></inline-svg>
            </button>
          </div>
          <!-- end::Back Action -->

          <!-- begin::Submit Action -->
          <button type="submit" class="btn btn-primary w-100">Finalize New Password</button>
          <!-- end::Submit Action -->
        </div>
        <!-- end::Actions -->
      </form>
      <!-- end::Step 3 - Get OTP -->

      <!-- begin::Step 4 - Get OTP -->
      <div v-if="step === 4" class="d-flex flex-column justify-content-between min-h-560px">
        <div>
          <!-- begin::Icon -->
          <inline-svg src="media/icons/shapes/star.svg"></inline-svg>
          <!-- end::Icon -->

          <!-- begin::Text -->
          <h4 class="my-6 text-dark">Congratulations</h4>

          <p class="text-gray-700 mb-12 ls-base">
            Your new password is changed. A 6-digit
            <br />
            confirmation code has been sent
          </p>
          <!-- end::Text -->

          <inline-svg src="media/icons/shapes/star-lock-group.svg" class="d-block m-auto"></inline-svg>
        </div>

        <!-- begin::Go Login -->
        <RouterLink :to="{ name: 'login' }" class="btn btn-primary w-100"> Login </RouterLink>
        <!-- end::Go Login -->
      </div>
      <!-- end::Step 4 - Get OTP -->
    </div>
  </div>

  <RouterLink v-if="step === 1" :to="{ name: 'register' }" class="text-white mt-6 ls-base">
    Can’t login, Sign up for new user?
  </RouterLink>

  <RouterLink v-if="step === 2" :to="{ name: 'login' }" class="text-white mt-6 ls-base">
    Already have an Square account? Log in
  </RouterLink>
</template>
