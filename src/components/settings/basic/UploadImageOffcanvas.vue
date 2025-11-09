<script setup>
// Vue
import { computed, onMounted, ref, watch } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// Components
import Dropzone from '../../globals/Dropzone.vue'

import Cropper from 'cropperjs/dist/cropper.js'

// ----- START ----- //

// Generals
const store = useAuthStore()

// Refs
const step = ref(1)
const documents = ref([])
const uploadedFileURL = ref('')
const loading = ref(false)
const zoomPercent = ref(0)

const cropperInfo = ref(null)
const currentUser = computed(() => store.currentUser)

// Dropzone
const setFile = (files) => {
  documents.value = files
  if (files.length) {
    uploadedFileURL.value = URL.createObjectURL(files[0])
    step.value = 2
    setTimeout(() => {
      initCropper()
    }, 500)
    setTimeout(() => {
      initSlider()
    }, 1000)
  }
}

// Functions

const initCropper = () => {
  const image = document.getElementById('uploaded-image')

  cropperInfo.value = new Cropper(image, {
    aspectRatio: 1,
    viewMode: 0,
    responsive: false,
    autoCropArea: 1,
    dragMode: 'move',
    cropBoxResizable: false,
    guides: false,
    center: false
  })
}

const initSlider = () => {
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
    thumb.querySelector('.percent').innerHTML = text
  })

  window.addEventListener('resize', function () {
    range.dispatchEvent(new Event('input'))
  })

  // Calculate on load
  range.dispatchEvent(new Event('input'))
}

/**
 * Reset Form
 */
const resetForm = () => {
  step.value = 1
  uploadedFileURL.value = ''
  zoomPercent.value = 0
  documents.value = []
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('uploadAvatar_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Add New KYC
 */
const updateAvatar = async () => {
  // Set Variables

  // Add Avatar To Form Data
  await cropperInfo.value
    .getCroppedCanvas({
      width: 200,
      height: 200
    })
    .toBlob(async (blob) => {
      // Start Loading
      loading.value = true

      // Set Variables
      let fd = new FormData()
      fd.append('_method', 'put')
      fd.append('first_name', currentUser.value?.merchant?.first_name || '')
      fd.append('last_name', currentUser.value?.merchant?.last_name || '')
      fd.append('avatar', blob , documents.value[0].name)

      // Request
      await store.updateProfile(fd).then((res) => {
        if (res) {
          closeOffcanvas()
        }
      })

      // Stop Loading
      loading.value = false
    }, 'image/png')
}

watch(zoomPercent, (next, prev) => {
  if (prev < next) {
    cropperInfo.value.zoom((next - prev) / 10)
  } else {
    cropperInfo.value.zoom((next - prev) / 10)
  }
})

onMounted(() => {
  const myOffcanvas = document.getElementById('uploadAvatar_offcanvas')

  /**
   * Offcanvas Fire On Hide
   */
  myOffcanvas.addEventListener('hidden.bs.offcanvas', () => {
    resetForm()
    if (cropperInfo.value) {
      cropperInfo.value.distroy()
    }
  })
})
</script>

<template>
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="uploadAvatar_offcanvas"
    aria-labelledby="offcanvasUploadAvatar"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <!-- begin::Content Card -->
      <div class="card border-0 mb-4">
        <div class="card-body pb-lg-22">
          <!-- begin::Header -->
          <div class="d-flex gap-4">
            <div>
              <div class="svg-holder">
                <inline-svg
                  :src="`media/icons/shapes/${$filters.shapeStatus('knowledge')}.svg`"
                  width="38"
                  height="28"
                ></inline-svg>
              </div>
            </div>

            <div class="mb-10">
              <h3 class="mb-0 text-dark">Change Profile Photo</h3>

              <p class="fs-7 mb-0 text-gray-800 dark-text-gray-600 ls-base">
                Some info may be visible to other people using Google services.
              </p>
            </div>
          </div>
          <!-- end::Header -->

          <!-- begin::Content -->
          <div>
            <!-- begin::Dropzone -->
            <div>
              <Dropzone :files="documents" @set-files="setFile" v-if="step === 1" />

              <template v-else>
                <img
                  :src="uploadedFileURL"
                  alt="image"
                  id="uploaded-image"
                  class="h-300px w-auto m-auto opacity-0"
                />

                <div class="d-flex align-items-center gap-2 mt-8">
                  <span class="text-gray-800 ls-base pt-2">Zoom</span>
                  <div class="range-div w-100">
                    <input
                      type="range"
                      name=""
                      class="range"
                      min="0"
                      max="100"
                      step="1"
                      v-model="zoomPercent"
                    />
                    <span class="range-thumb gap-1">
                      <span>%</span>
                      <span class="percent"></span>
                    </span>
                  </div>
                </div>
              </template>
            </div>
            <!-- end::Dropzone -->
          </div>
          <!-- end::Content -->
        </div>
      </div>
      <!-- end::Content Card -->

      <!-- begin::Action Card -->
      <div class="d-flex gap-4">
        <div class="d-none d-md-flex">
          <div
            class="w-56px h-56px d-flex align-items-center justify-content-center rounded-1 bg-white"
          >
            <inline-svg
              :src="`/media/icons/shapes/${$filters.shapeStatus('documentation')}.svg`"
            ></inline-svg>
          </div>
        </div>
        <div class="card border-0 mb-6 w-100">
          <div
            class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
          >
            <p class="offcanvas-action-text">
              Latest clicks/conversions. Are you sure?
            </p>

            <!-- begin::Actions -->
            <div class="d-flex gap-4 w-100 w-sm-initial">
              <button
                type="button"
                class="btn btn-sm btn-light w-100 w-sm-104px h-24px ls-base fw-normal"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                Cancel
              </button>

              <button
                type="button"
                :disabled="step === 1 || loading"
                @click="updateAvatar"
                class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base fw-normal"
              >
                {{ loading ? 'Loading...' : 'Save' }}
              </button>
            </div>
            <!-- end::Actions -->
          </div>
        </div>
      </div>
      <!-- end::Action Card -->
    </div>
  </div>
</template>
