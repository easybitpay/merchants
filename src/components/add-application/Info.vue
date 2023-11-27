<script setup>
// Vue
import { computed, ref, onMounted } from 'vue'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Emit
const emit = defineEmits(['goNext'])

// ----- START ----- //
const { showFeedBacks } = useForm()

// Refs
const logo = ref(null)
const banner = ref(null)

// Update Icon
const hiddenChangeLogoInput = ref(null)
const logoInputClick = () => {
  hiddenChangeLogoInput.value.click()
}

// Update Banner
const hiddenChangeBannerInput = ref(null)
const bannerInputClick = () => {
  hiddenChangeBannerInput.value.click()
}

// Vuelidate
const form = ref({
  name: null,
  site_url: null,
  customer_fee_percent: 0,
})

const rules = {
  name: {
    required: helpers.withMessage('App name is required', required)
  },
  site_url: {
    required: helpers.withMessage('Site url is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Show UplodedItem Preview
 * @param {file} file
 */
const showPreview = (file) => {
  return URL.createObjectURL(file)
}

/**
 * Add App Icon
 * @param {event} e
 */
const addLogoFile = async (e) => {
  logo.value = e.target.files[0]
}

/**
 * Add App Cover
 * @param {event} e
 */
const addBannerFile = async (e) => {
  banner.value = e.target.files[0]
}

/**
 * Submit Form
 * send data to parent for store
 */
const submitForm = async () => {
  // Validate Form
  const result = await v$.value.$validate()
  if (result) {
    // Set Variable
    const content = { ...form.value, logo: logo.value, banner: banner.value }

    // Emit
    emit('goNext', content)
  } else {
    showFeedBacks()
  }
}

onMounted(() => {
  document.addEventListener('submitStep2', function () {
    submitForm()
  })

  var range = document.querySelector('.range')

  var thumb = document.querySelector('.range-thumb')
  var max = parseInt(range.max, 10)
  var thumbWidth = 101 // Thumb width. See CSS

  range.addEventListener('input', function () {
    var width = range.offsetWidth
    var value = parseInt(range.value, 10)
    var text = value >= max ? '100' : value
    var positionInPX = (value * (width - thumbWidth)) / max

    thumb.style.left = positionInPX + 'px'
    thumb.querySelector('.merchant').innerHTML = text
    thumb.querySelector('.user').innerHTML = 100 - text
  })

  window.addEventListener('resize', function () {
    range.dispatchEvent(new Event('input'))
  })

  // Calculate on load
  range.dispatchEvent(new Event('input'))
})
</script>

<template>
  <!-- begin::Title -->
  <div class="mb-10">
    <h4 class="text-primary mb-2 neue-machina fw-normal">Base information</h4>
    <p class="mb-0 ls-base">If you need more info, please check out Help Page.</p>
  </div>
  <!-- begin::Title -->

  <form @submit.prevent="submitForm">
    <button type="submit" hidden></button>
    <!-- begin::App Name -->
    <div class="position-relative mb-6">
      <div class="grouped-input form-control">
        <label for="app-name">App name</label>
        <input type="text" id="app-name" v-model="form.name" />
      </div>

      <div class="invalid-feedback form-control" v-if="v$.name.$errors.length">
        <span> {{ v$.name.$errors[0].$message }}</span>
      </div>
    </div>
    <!-- end::App Name -->

    <!-- begin::Site URL -->
    <div class="position-relative mb-6">
      <div class="grouped-input form-control">
        <label for="site-url">Site URL</label>
        <input type="text" id="site-url" v-model="form.site_url" />
      </div>

      <div class="invalid-feedback form-control" v-if="v$.site_url.$errors.length">
        <span> {{ v$.site_url.$errors[0].$message }}</span>
      </div>
    </div>
    <!-- end::Site URL -->

    <!-- begin::Icon & Banner Card -->
    <div
      class="card gradient-image-box border-gray-200 mb-13 rounded"
      :style="`--background: url(${
        banner ? showPreview(banner) : '/media/images/banner/auth-bg.jpg'
      })`"
    >
      <div class="card-body p-6 pt-4 d-flex flex-column">
        <!-- begin::Logo -->
        <img
          :src="logo ? showPreview(logo) : '/media/images/banner/default-app.png'"
          class="img-fluid mb-12"
          width="38"
        />
        <!-- end::Logo -->

        <div class="w-100 d-flex flex-wrap gap-4 justify-content-between">
          <div class="d-flex flex-wrap gap-4 align-items-end justify-content-between">
            <!-- begin::Status Action -->
            <div class="d-flex flex-wrap gap-4">
              <input
                type="file"
                ref="hiddenChangeLogoInput"
                className="d-none"
                @change="addLogoFile"
              />
              <button type="button" @click="logoInputClick" class="btn btn-light w-sm-120px">
                Add Icon
              </button>

              <input
                type="file"
                ref="hiddenChangeBannerInput"
                className="d-none"
                @change="addBannerFile"
              />
              <button type="button" @click="bannerInputClick" class="btn btn-primary w-sm-144px">
                Add Cover
              </button>
            </div>
            <!-- end::Status Action -->
          </div>

          <div
            class="w-40px h-40px d-flex align-items-center justify-content-center rounded bg-white"
          >
            <inline-svg src="media/icons/shapes/bookmark.svg" height="25"></inline-svg>
          </div>
        </div>
      </div>
    </div>
    <!-- end::Icon & Banner Card -->
  </form>
  <!-- begin::Fee Share -->
  <div class="w-100">
    <div class="mb-10">
      <h4 class="text-primary mb-2 neue-machina fw-normal">Customer Fee Share</h4>
      <p class="mb-0 ls-base">If you need more info, please check out Help Page.</p>
    </div>

    <div class="d-flex align-items-end justify-content-between gap-7 mb-4">
      <!-- begin::Top -->
      <inline-svg src="media/icons/shapes/person.svg" class="d-none d-sm-block"></inline-svg>

      <div class="range-div w-100 w-lg-384px">
        <input
          type="range"
          name=""
          class="range"
          min="0"
          max="100"
          step="5"
          v-model="form.customer_fee_percent"
          @change="checkRangeUpdate"
        />
        <span class="range-thumb">
          <span class="merchant"></span>
          <span class="text-dark mx-2">|</span>
          <span class="user"></span>
        </span>
      </div>

      <inline-svg src="media/icons/shapes/person.svg" class="d-none d-sm-block"></inline-svg>
      <!-- end::Top -->
    </div>

    <div class="d-flex align-items-center justify-content-between ls-base">
      <p class="mb-0">Merchant</p>
      <p class="mb-0">User</p>
    </div>
  </div>
  <!-- end::Fee Share -->
</template>
