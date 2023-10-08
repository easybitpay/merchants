<script setup>
import Basic from '../../components/settings/Basic.vue'
import Privacy from '../../components/settings/Privacy.vue'
import Customize from '../../components/settings/Customize.vue'
</script>

<template>
  <!-- begin::Nav -->
  <nav>
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
      <button
        class="nav-link active"
        id="nav-basic-tab"
        data-bs-toggle="tab"
        data-bs-target="#nav-basic"
        type="button"
        role="tab"
        aria-controls="nav-basic"
        aria-selected="true"
      >
        Basic
      </button>
      <button
        class="nav-link"
        id="nav-privacy-tab"
        data-bs-toggle="tab"
        data-bs-target="#nav-privacy"
        type="button"
        role="tab"
        aria-controls="nav-privacy"
        aria-selected="false"
      >
        Privacy
      </button>
      <button
        class="nav-link"
        id="nav-customize-tab"
        data-bs-toggle="tab"
        data-bs-target="#nav-customize"
        type="button"
        role="tab"
        aria-controls="nav-customize"
        aria-selected="false"
      >
        Customize
      </button>
    </div>
  </nav>
  <!-- end::Nav -->

  <!-- begin::Content -->
  <div class="tab-content" id="nav-tabContent">
    <div
      class="tab-pane fade show active"
      id="nav-basic"
      role="tabpanel"
      aria-labelledby="nav-basic-tab"
      tabindex="0"
    >
      <Basic />
    </div>
    <div
      class="tab-pane fade"
      id="nav-privacy"
      role="tabpanel"
      aria-labelledby="nav-privacy-tab"
      tabindex="0"
    >
      <Privacy />
    </div>
    <div
      class="tab-pane fade"
      id="nav-customize"
      role="tabpanel"
      aria-labelledby="nav-customize-tab"
      tabindex="0"
    >
      <Customize />
    </div>
  </div>
  <!-- end::Content -->
</template>
