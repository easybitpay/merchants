<script setup>
// Bootstrap
import { Offcanvas } from 'bootstrap'

// Components
import EditPartnerOffcanvas from './EditPartnerOffcanvas.vue'

// ----- START ----- //
const editPartner = () => {
  const bsOffcanvas = new Offcanvas('#editPartner_offcanvas')
  bsOffcanvas.show()
}
</script>

<template>
  <div class="card border-gray-200 rounded-4">
    <div class="card-body pb-4">
      <!-- begin::Header -->
      <div class="pb-12 d-flex align-items-center justify-content-between flex-wrap gap-4">
        <h4 class="roboto-mono mb-0 text-gray-900 d-flex gap-5 fw-normal">
          <inline-svg src="/media/icons/shapes/chess.svg"></inline-svg>

          Plusstudio Team
        </h4>
        <p
          class="mb-0 fw-medium text-primary cursor-pointer"
          data-bs-toggle="offcanvas"
          data-bs-target="#addPartner_offcanvas"
          aria-controls="addPartner_offcanvas"
        >
          Add New Person
        </p>
      </div>
      <!-- end::Header -->

      <!-- begin::Partners -->
      <div class="d-flex flex-column gap-6">
        <!-- begin::Item -->
        <div class="d-flex gap-4 text-gray-900 text-hover-primary hover-sm-show-parent">
          <!-- begin::Info & Image -->
          <div class="d-flex w-100 gap-4">
            <!-- begin::Image Box -->
            <div class="w-40px h-40px">
              <img
                src="/media/images/banner/theme.png"
                alt="user"
                class="w-100 h-100 object-cover rounded-circle"
              />
            </div>
            <!-- end::Image Box -->

            <!-- begin::Info -->
            <div class="d-flex flex-column justify-content-between">
              <p class="mb-0" @click="editPartner()">Golshifte Farahani</p>
              <small class="text-gray-700">Reporter</small>
            </div>
            <!-- end::Info -->
          </div>
          <!-- end::Info & Image -->

          <!-- begin::Action -->
          <div class="w-175px d-none hover-show-target">
            <button class="btn btn-primary w-100" @click="editPartner()">Edit</button>
          </div>
          <!-- end::Action -->
        </div>
        <!-- end::Item -->

        <!-- begin::Item -->
        <div class="d-flex gap-4 text-gray-900 text-hover-primary hover-sm-show-parent">
          <!-- begin::Info & Image -->
          <div class="d-flex w-100 gap-4">
            <!-- begin::Image Box -->
            <div class="w-40px h-40px">
              <img
                src="/media/images/banner/theme.png"
                alt="user"
                class="w-100 h-100 object-cover rounded-circle"
              />
            </div>
            <!-- end::Image Box -->

            <!-- begin::Info -->
            <div class="d-flex flex-column justify-content-between">
              <p class="mb-0" @click="editPartner()">Golshifte Farahani</p>
              <small class="text-gray-700">Reporter</small>
            </div>
            <!-- end::Info -->
          </div>
          <!-- end::Info & Image -->

          <!-- begin::Action -->
          <div class="w-175px d-none hover-show-target" @click="editPartner()">
            <button class="btn btn-primary w-100">Edit</button>
          </div>
          <!-- end::Action -->
        </div>
        <!-- end::Item -->
      </div>
      <!-- end::Partners -->
    </div>
  </div>
  <EditPartnerOffcanvas />
</template>
