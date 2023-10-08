<script setup>
// Vue
import { ref } from 'vue'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'

// Components
import Dropzone from '../globals/Dropzone.vue'

// ----- START ----- //
const { showFeedBacks } = useForm()

const documents = ref([])

const setFile = (files) => {
  documents.value = files
}

const removeFiles = (file) => {
  documents.value = documents.value.filter((item) => item !== file)
}

const form = ref({
  type: null,
  email: null
})

const rules = {
  type: {
    required: helpers.withMessage('Type is required', required)
  },
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage("Email isn't valid", email)
  }
}

const v$ = useVuelidate(rules, form)

const updateBasicInfo = async () => {
  const result = await v$.value.$validate()
  if (result) {
    console.log('scas')
  } else {
    showFeedBacks()
  }
}
</script>

<template>
  <!-- <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button> -->
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="newKyc_offcanvas"
    aria-labelledby="offcanvasTopLabel"
  >
    <div class="offcanvas-body">
      <form @submit.prevent="updateBasicInfo">
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
                <select class="form-select" aria-label="Large select example" v-model="form.type">
                  <option value="">Select...</option>
                  <option value="1">Passport</option>
                  <option value="2">Address</option>
                  <option value="3">Other</option>
                </select>

                <div class="invalid-feedback form-control" v-if="v$.type.$errors.length">
                  <span> {{ v$.type.$errors[0].$message }}</span>
                </div>
              </div>
              <!-- end::Type -->

              <!-- begin::Dropzone -->
              <div>
                <Dropzone :files="documents" @set-files="setFile" />

                <div class="mt-4" v-if="documents.length">
                  <div
                    v-for="(file, index) in documents"
                    :key="index"
                    :style="`--background: url(${file.preview})`"
                    class="gradient-image-box hover-shadow h-40px border border-gray-300 rounded ps-4 pe-2 d-flex align-items-center justify-content-between text-gray-800 text-hover-primary hover-show-parent"
                  >
                    <p class="mb-0 ellipsis" style="--ellipsis-width: 50%">{{ file.name }}</p>

                    <inline-svg
                      @click="removeFiles(file)"
                      src="media/icons/icons/trash.svg"
                      height="24"
                      class="svg-icon-danger hover-show-target bg-white"
                      style="border-radius: 3px"
                    ></inline-svg>
                  </div>
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
                  class="btn btn-sm bg-gray-500 text-white w-100 w-sm-104px h-24px ls-base"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  class="btn btn-sm btn-primary w-100 w-sm-104px h-24px ls-base"
                >
                  Save
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
