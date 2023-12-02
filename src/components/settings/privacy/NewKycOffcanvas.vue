<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// Components
import Dropzone from '../../globals/Dropzone.vue'
import LongImageCard from '../../globals/LongImageCard.vue'
import SelectDropdown from '../../globals/SelectDropdown.vue'

// Emit
const emit = defineEmits(['refresh'])

const kycTypes = [
  {
    name: 'Passport',
    value: 'passport'
  },
  {
    name: 'Address',
    value: 'address'
  },
  {
    name: 'Other',
    value: 'other'
  }
]
// ----- START ----- //

// Generals
const store = useAuthStore()
const { showFeedBacks } = useForm()

// Refs
const documents = ref([])
const loading = ref(false)

// Dropzone
const setFile = (files) => {
  documents.value = files
  if (files.length) {
    form.value.document = 'true'
  }
}

const removeFiles = (file) => {
  documents.value = documents.value.filter((item) => item !== file)
  form.value.document = null
}

// Select Dropdown
const selectedType = ref({})
const toggleSelectType = (type) => {
  selectedType.value = type
  form.value.type = type.value
}

// Vuelidate
const form = ref({
  type: null,
  document: null
})

const rules = {
  type: {
    required: helpers.withMessage('Type is required', required)
  },
  document: {
    required: helpers.withMessage('Document is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Reset Form
 */
const resetForm = () => {
  selectedType.value = {}
  form.value = {
    type: null,
    document: null
  }
  documents.value = []
  v$.value.$reset()
}

/**
 * Close Offcanvas
 */
const closeOffcanvas = () => {
  const myOffcanvas = document.getElementById('newKyc_offcanvas')
  Offcanvas.getInstance(myOffcanvas).hide()
}

/**
 * Add New KYC
 */
const addNewKYC = async () => {
  // Validation Form
  const result = await v$.value.$validate()
  if (result) {
    // Start Loading
    loading.value = true

    // Set Variables
    let fd = new FormData()
    fd.append('type', form.value.type)
    fd.append('file', documents.value[0])

    // Request
    await store.uploadKYC(fd).then((res) => {
      if (res) {
        resetForm()
        closeOffcanvas()
        emit('refresh')
      }
    })

    // Stop Loading
    loading.value = false
  } else {
    showFeedBacks()
  }
}

onMounted(() => {
  const myOffcanvas = document.getElementById('newKyc_offcanvas')

  /**
   * Offcanvas Fire On Hide
   */
  myOffcanvas.addEventListener('hidden.bs.offcanvas', () => {
    resetForm()
  })
})
</script>

<template>
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="newKyc_offcanvas"
    aria-labelledby="offcanvasTopLabel"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <form @submit.prevent="addNewKYC">
        <!-- begin::Content Card -->
        <div class="card border-0 mb-4 min-h-354px">
          <div class="card-body">
            <!-- begin::Header -->
            <div class="d-flex gap-4">
              <div>
                <inline-svg src="media/icons/shapes/knowledge.svg"></inline-svg>
              </div>

              <div class="mb-10">
                <h3 class="mb-0 text-gray-900">KYC</h3>

                <p class="fs-7 mb-0 text-gray-800 ls-base">
                  Some info may be visible to other people using Google services.
                </p>
              </div>
            </div>
            <!-- end::Header -->

            <!-- begin::Content -->
            <div>
              <!-- begin::Type -->
              <div class="mb-10 position-relative d-flex align-items-center">
                <SelectDropdown
                  placeholder="Type"
                  show="name"
                  check="value"
                  :items="kycTypes"
                  :selected="selectedType"
                  @change="toggleSelectType"
                />

                <div class="invalid-feedback form-control" v-if="v$.type.$errors.length">
                  <span> {{ v$.type.$errors[0].$message }}</span>
                </div>
              </div>
              <!-- end::Type -->

              <!-- begin::Dropzone -->
              <div>
                <div class="position-relative">
                  <Dropzone :files="documents" @set-files="setFile" />

                  <div class="invalid-feedback dropzone" v-if="v$.document.$errors.length">
                    <span> {{ v$.document.$errors[0].$message }}</span>
                  </div>
                </div>

                <div class="mt-4" v-if="documents.length">
                  <LongImageCard
                    v-for="(file, index) in documents"
                    :key="index"
                    :text="file.name"
                    :background="file.preview"
                    deleteAction
                    @onDelete="removeFiles(file)"
                  />
                </div>
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
              class="w-56px h-56px d-flex align-items-center justify-content-center rounded bg-white"
            >
              <inline-svg src="media/icons/shapes/bookmark.svg"></inline-svg>
            </div>
          </div>
          <div class="card border-0 mb-6 w-100">
            <div
              class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
            >
              <p class="fs-7 mb-0 ls-base text-gray-800 lh-32px">
                Latest clicks/conversions. Are you sure?
              </p>

              <!-- begin::Actions -->
              <div class="d-flex gap-4 w-100 w-sm-initial">
                <button
                  type="button"
                  class="btn btn-sm bg-gray-500 text-white w-100 w-sm-104px h-24px ls-base fw-normal"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  :disabled="loading"
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
      </form>
    </div>
  </div>
</template>
