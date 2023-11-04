<script setup>
// Vue
import { ref } from "vue"


// ----- Start -----
const hiddenChangeIconInput = ref(null)
const iconInputClick = () => {
  hiddenChangeIconInput.value.click()
}
const addIconFile = (e) => {
  console.log('icon',e.target.files[0])
}

const hiddenChangeCoverInput = ref(null)
const coverInputClick = () => {
  hiddenChangeCoverInput.value.click()
}
const addCoverFile = (e) => {
  console.log('cover',e.target.files[0])
}
</script>

<template>
  <div
    class="card gradient-image-box border-purple-500"
    style="--background: url(/media/images/banner/auth-bg.jpg)"
  >
    <div class="card-body d-flex flex-column">
      <!-- begin::Logo -->
      <img
        src="/media/icons/companies/wordpress.png"
        alt="wordpress"
        class="img-fluid mb-10 mb-lg-16"
        width="48"
      />
      <!-- end::Logo -->

      <div class="d-flex flex-wrap gap-4 align-items-end justify-content-between">
        <!-- begin::Type & Name -->
        <div>
          <p class="mb-2">as Reporter</p>
          <h2 class="mb-0 text-success lh-1">Plusstudio</h2>
        </div>
        <!-- end::Type & Name -->

        <!-- begin::Status Action -->
        <div class="d-flex flex-wrap gap-4">
          <input type="file" ref="hiddenChangeIconInput" className="d-none" @change="addIconFile" />
          <button @click="iconInputClick" class="btn btn-light w-192px">Change Icon</button>

          <input
            type="file"
            ref="hiddenChangeCoverInput"
            className="d-none"
            @change="addCoverFile"
          />
          <button @click="coverInputClick" class="btn btn-primary w-192px">Change Cover</button>
        </div>
        <!-- end::Status Action -->
      </div>
    </div>
  </div>
</template>
