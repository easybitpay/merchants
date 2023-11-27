<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Emit
const emit = defineEmits(['goNext'])

// ----- START ----- //
const types = [
  {
    type: 1,
    title: 'Standard Gateway',
    subject: 'Best Gateway for online shop'
  },
  {
    type: 2,
    title: 'Donate',
    subject: 'Best Gateway for online shop'
  },
  {
    type: 3,
    title: 'Fix Prices',
    subject: 'Best Gateway for online shop'
  }
]

// Refs
const selectedType = ref({})

// Functions

/**
 * Submit Form
 * send data to parent for store
 */
const submitForm = () => {
  if (selectedType.value) {
    // Set Variable
    const content = {
      type: selectedType.value
    }

    // Emit
    emit('goNext', content)
  }
}

onMounted(() => {
  document.addEventListener('submitStep1', function () {
    submitForm()
  })
})
</script>

<template>
  <!-- begin::Title -->
  <div class="mb-10">
    <h4 class="text-primary mb-2 neue-machina fw-normal">Choose Gateway Type</h4>
    <p class="mb-0 ls-base">If you need more info, please check out Help Page.</p>
  </div>
  <!-- begin::Title -->

  <div class="d-flex flex-column gap-6">
    <!-- begin::Item -->
    <div
      :class="`card rounded-xl cursor-pointer ${
        selectedType.type === item.type ? 'border-primary shadow' : 'border-gray-200'
      }`"
      @click="selectedType = item"
      v-for="(item, index) in types"
      :key="index"
    >
      <div class="card-body">
        <inline-svg src="media/icons/shapes/embed.svg" height="40" class="mb-6"></inline-svg>

        <div class="d-flex align-items-end justify-content-between gap-4">
          <!-- begin::Title & Subject -->
          <div>
            <h5 class="text-primary mb-2">
              {{ item.title }}
            </h5>

            <p class="fs-7 mb-0">{{ item.subject }}</p>
          </div>
          <!-- end::Title & Subject -->

          <!-- begin::Radio Box -->
          <div class="form-check p-0">
            <input
              class="form-check-input m-0"
              type="radio"
              :checked="selectedType.type === item.type"
            />
          </div>
          <!-- end::Radio Box -->
        </div>
      </div>
    </div>
    <!-- end::Item -->
  </div>
</template>
