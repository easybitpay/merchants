<script setup>
// Vue
import { computed, onMounted, reactive, ref } from 'vue'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required, email, sameAs } from '@vuelidate/validators'

//
import { PasswordMeterComponent } from '@/assets/js/PasswordMeter'

// ----- START ----- //
const emit = defineEmits(['changeBG'])

const { showFeedBacks } = useForm()

const showPass1 = ref(false)
const showPass2 = ref(false)

const form = ref({
  email: null,
  password: null,
  confirmPassword: null
})

const passwordComputed = computed(() => form.value.password)

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage("Email isn't valid", email)
  },
  password: {
    required: helpers.withMessage('Password is required', required)
  },
  confirmPassword: {
    required: helpers.withMessage('rePassword is required', required),
    sameAsPassword: helpers.withMessage('Password not matching ', sameAs(passwordComputed))
  }
}

const v$ = useVuelidate(rules, form)

const passwordMeter = ref(null)

onMounted(() => {
  passwordMeter.value = new PasswordMeterComponent({})
})

const register = async () => {
  console.log(passwordMeter.value.getScore())
  const result = await v$.value.$validate()
  if (result) {
    console.log('login')
  } else {
    showFeedBacks()
    emit('changeBG')
  }
}
</script>

<template>
  <div class="card mw-448px w-100 min-h-560px">
    <div class="card-body d-flex flex-column justify-content-between">
      <div>
        <!-- begin::Icon -->
        <inline-svg src="media/icons/shapes/auth.svg"></inline-svg>
        <!-- end::Icon -->

        <!-- begin::Text -->
        <h4 class="my-6 text-dark">Sign Up</h4>

        <p class="text-gray-700 mb-12 ls-base">
          By signing up, you confirm that you’ve read
          <br />
          and accepted our User Notice and
          <a href="" class="text-primary"> Privacy Policy.</a>
        </p>
        <!-- end::Text -->
      </div>

      <!-- begin::Form -->
      <form @submit.prevent="register">
        <!-- begin::Email -->
        <div class="mb-6 position-relative">
          <input
            type="text"
            :class="[{ 'form-control': true }, { 'is-valid': !v$.email.$invalid }]"
            placeholder="Your Email"
            v-model="form.email"
          />

          <div class="invalid-feedback form-control" v-if="v$.email.$errors.length">
            <span> {{ v$.email.$errors[0].$message }}</span>
          </div>
        </div>
        <!-- end::Email -->

        <div data-password-meter="true">
          <!-- begin::Password -->
          <div class="mb-6 position-relative d-flex align-items-center">
            <input
              :type="showPass1 ? 'text' : 'password'"
              class="form-control"
              placeholder="Password"
              v-model="form.password"
            />
            <div class="invalid-feedback form-control" v-if="v$.password.$errors.length">
              <span> {{ v$.password.$errors[0].$message }}</span>
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

          <!-- begin::Confirm Password -->
          <div class="mb-4 position-relative d-flex align-items-center">
            <input
              :type="showPass2 ? 'text' : 'password'"
              class="form-control"
              placeholder="rePassword"
              v-model="form.confirmPassword"
            />
            <div class="invalid-feedback form-control" v-if="v$.confirmPassword.$errors.length">
              <span> {{ v$.confirmPassword.$errors[0].$message }} </span>
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

          <!--begin::Meter-->
          <div
            class="d-flex align-items-center gap-7 px-2 mb-14"
            data-password-meter-control="highlight"
          >
            <div class="flex-grow-1 bg-gray-200 bg-active-primary rounded h-6px"></div>
            <div class="flex-grow-1 bg-gray-200 bg-active-primary rounded h-6px"></div>
            <div class="flex-grow-1 bg-gray-200 bg-active-primary rounded h-6px"></div>
            <div class="flex-grow-1 bg-gray-200 bg-active-primary rounded h-6px"></div>
          </div>
          <!--end::Meter-->
        </div>

        <!-- begin::Action -->
        <button type="submit" class="btn btn-primary w-100">
          Register
          <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
        </button>
        <!-- end::Action -->

        <p class="my-6 text-center ls-base">or</p>

        <!-- begin::Action -->
        <button type="button" class="btn btn-light w-100">
          <inline-svg src="media/icons/companies/google-logo.svg"></inline-svg>

          Connect to Google
        </button>
        <!-- end::Action -->
      </form>
      <!-- end::Form -->
    </div>
  </div>

  <RouterLink :to="{ name: 'login' }" class="text-white mt-6 ls-base">
    Already have an Square account? Log in
  </RouterLink>
</template>
