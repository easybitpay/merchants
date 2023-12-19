<script setup></script>

<template>
  <form action="">
    <!-- begin::Info -->
    <div class="auto-infos">
      <!-- begin::Item -->
      <div class="item">
        <p class="title">Name</p>
        <p class="value">Mohamad r Moradi</p>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="item">
        <p class="title">Email</p>
        <p class="value">Plusstudio2007@Gmail.com</p>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Info -->

    <!-- begin::Spacer -->
    <div class="border-bottom border-gray-400 w-100 my-4"></div>
    <!-- end::Spacer -->

    <!-- begin::Note -->
    <p class="text-gray-800 ls-base mb-0 lh-24px">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate laboriosam illum ut
      voluptatibus dolor repellat doloribus quo error est voluptates beatae quae iste, tempora
      soluta quod sit qui, voluptatum cumque!
    </p>
    <!-- end::Note -->

    <!-- begin::Spacer -->
    <div class="border-bottom border-gray-400 w-100 mt-4 mb-10"></div>
    <!-- end::Spacer -->

    <!-- begin::Email -->
    <div class="mb-4 position-relative d-flex align-items-center">
      <input
        type="email"
        class="form-control ps-9"
        placeholder="Merchant Email"
        v-model="form.email"
      />

      <div class="invalid-feedback form-control" v-if="v$.email.$errors.length">
        <span> {{ v$.email.$errors[0].$message }}</span>
      </div>

      <!-- begin::Icon -->
      <inline-svg
        src="media/icons/icons/card.svg"
        class="position-absolute start-8px"
      ></inline-svg>
      <!-- end::Icon -->
    </div>
    <!-- end::Email -->
  </form>
</template>
