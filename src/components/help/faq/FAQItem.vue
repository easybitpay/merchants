<script setup>
// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button
        class="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="`#faq-${item.id}`"
        aria-expanded="true"
        :aria-controls="`faq-${item.id}`"
      >
        {{ item.title }}
      </button>
    </h2>
    <div :id="`faq-${item.id}`" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
      <div class="accordion-body">
        {{ item.description }}

        <!-- begin::User Reaction -->
        <div class="d-flex flex-column flex-md-row justify-content-between gap-4 mt-24">
          <!-- begin::Question Box -->
          <div
            class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between justify-content-md-start w-100 row-gap-3"
          >
            <!-- begin::Question -->
            <p class="mb-0 text-gray-600">Did this answer your question?</p>
            <!-- end::Question -->

            <!-- begin::Emojies -->
            <div class="d-flex gap-4 ms-0 ms-sm-8">
              <img src="/media/icons/emoji/happy.png" class="cursor-pointer" />
              <img src="/media/icons/emoji/sad.png" class="cursor-pointer" />
              <img src="/media/icons/emoji/neutral.png" class="cursor-pointer" />
            </div>
            <!-- end::Emojies -->
          </div>
          <!-- end::Question Box -->

          <!-- begin::Need Edit -->
          <div>
            <button class="btn btn-sm btn-light w-136px h-24px">Need to Edit</button>
          </div>
          <!-- end::Need Edit -->
        </div>
        <!-- end::User Reaction -->
      </div>
    </div>
  </div>
</template>
