<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Router
import { useRouter } from 'vue-router'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
import useForm from '@/composables/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required, email, sameAs } from '@vuelidate/validators'

// Password Mettwr
import { PasswordMeterComponent } from '@/assets/js/PasswordMeter'

// Components
import GoogleLogin from '../../components/globals/GoogleLogin.vue'

// ----- START ----- //

// Generals
const emit = defineEmits(['changeBG'])
const { showFeedBacks } = useForm()
const store = useAuthStore()
const router = useRouter()

// Refs
const passwordMeter = ref(null)

const showPass1 = ref(false)
const showPass2 = ref(false)

const loadings = ref({
  register: false,
  google: false
})

// Vuelidate
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

// Functions

/**
 * Register User
 */
const register = async () => {
  // Validate Form
  const result = await v$.value.$validate()
  if (result) {
    // Start loading
    loadings.value.register = true

    // Request
    await store.registerUser(form.value).then((res) => {
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
    loadings.value.register = false
  } else {
    showFeedBacks()
    emit('changeBG')
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
      router.push({ name: 'dashboard' })
    } else {
      emit('changeBG')
    }
  })

  // Stop loading
  loadings.value.google = false
}

onMounted(() => {
  passwordMeter.value = new PasswordMeterComponent({})
})
</script>

<template>
  <div class="card mw-448px w-100 min-h-560px">
    <div class="card-body d-flex flex-column justify-content-between">
      <div>
        <!-- begin::Icon -->
        <inline-svg
          :src="`/media/icons/shapes/${$filters.shapeStatus('signin')}.svg`"
          width="45"
          height="48"
        ></inline-svg>
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
              :src="`media/icons/icons/${showPass1 ? 'hide' : 'show'}.svg`"
              class="position-absolute end-16px cursor-pointer svg-icon-gray-700"
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
              :src="`media/icons/icons/${showPass2 ? 'hide' : 'show'}.svg`"
              class="position-absolute end-16px cursor-pointer svg-icon-gray-700"
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
        <button type="submit" class="btn btn-primary w-100" :disabled="loadings.register">
          <template v-if="!loadings.register">
            Register
            <inline-svg src="media/icons/icons/arrow-right.svg"></inline-svg>
          </template>

          <span v-else>Loading...</span>
        </button>
        <!-- end::Action -->

        <p class="my-6 text-center ls-base">or</p>

        <!-- begin::Action -->
        <GoogleLogin :loading="loadings.google" @success="successGoogleLogin" />
        <!-- end::Action -->
      </form>
      <!-- end::Form -->
    </div>
  </div>

  <RouterLink :to="{ name: 'login' }" class="text-white mt-6 ls-base">
    Already have an Square account? Log in
  </RouterLink>
</template>
