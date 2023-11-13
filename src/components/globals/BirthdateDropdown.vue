<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    required: true
  },
  selected: {
    type: String,
    required: true
  },
  btnSize: {
    type: String,
    default: 'md'
  }
})

// Emit
const emit = defineEmits(['change'])

// ----- Start -----
const toggleTextMode = ref('selecting')

onMounted(() => {
  const myDropdown = document.getElementById('birthdateDropdown')

  /**
   * Dropdown Fire On Show
   */
  myDropdown.addEventListener('show.bs.dropdown', () => {
    toggleTextMode.value = 'selecting'
  })

  /**
   * Dropdown Fire On Hide
   */
  myDropdown.addEventListener('hide.bs.dropdown', () => {
    toggleTextMode.value = 'selected'
  })
})
</script>

<template>
  <div class="dropdown w-100" id="birthdateDropdown">
    <a
      :class="`btn btn-${btnSize} bg-gray-100 border-gray-200 dropdown-toggle justify-content-between w-100`"
      role="button"
      :disabled="disabled"
      id="dropdownMenuLink"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      data-bs-auto-close="outside"
      data-bs-offset="0,0"
    >
      <!-- begin::Show Selected -->
      <div
        class="d-flex align-items-center gap-2 text-gray-800 select-dropdown-text-content"
        v-if="selected"
      >
        <div
          :class="[
            { 'w-100 text-start': true },
            { 'text-gray-600': toggleTextMode === 'selecting' }
          ]"
        >
          <span class="ellipsis" style="--ellipsis-width: 100%">
            <template v-if="toggleTextMode === 'selected'"> 1995 10 20 </template>

            <template v-else> Enter Your Birthday </template>
          </span>
        </div>
      </div>
      <!-- end::Show Selected -->

      <!-- begin::Show Placeholder -->
      <div v-else class="multi-select-dropdown-text-placeholder text-start">
        <span class="text-gray-600 ellipsis" style="--ellipsis-width: 100%">{{ placeholder }}</span>
      </div>
      <!-- end::Show Placeholder -->
    </a>

    <!-- begin::Dropdown Menu -->
    <ul :class="`dropdown-menu gap-0 ${btnSize}-triangle w-100`" aria-labelledby="dropdownMenuLink">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic, doloribus velit omnis quia nemo
      dolores cupiditate unde ullam repudiandae? Laborum, autem tempore suscipit optio voluptatum
      quod fuga eligendi consectetur officia?
    </ul>
    <!-- end::Dropdown Menu -->
  </div>
</template>
