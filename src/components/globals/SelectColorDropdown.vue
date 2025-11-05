<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
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

let colors = ['orange', 'green', 'purple', 'red', 'lime', 'blue']

// ----- START ----- //
const toggleTextMode = ref('selected')

const selectItem = (e, item) => {
  const menu = e.target.offsetParent
  menu.classList.remove('show')
  toggleTextMode.value = 'selected'
  emit('change', item)
}

onMounted(() => {
  const myDropdown = document.getElementById('colorDropdown')

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
  <div class="dropdown w-100" id="colorDropdown">
    <a
      :class="`btn btn-${btnSize} bg-gray-100  dropdown-toggle justify-content-between w-100`"
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
          <p class="mb-0 d-flex gap-4" style="--ellipsis-width: 100%">
            <span class="text-gray-600 d-none d-sm-block">Enter Your Color</span>
            <span
              class="d-flex align-items-center gap-2 text-gray-800"
              v-if="toggleTextMode === 'selected'"
            >
              <!-- begin::Selected Color Box -->
              <span :class="`w-12px h-12px bg-app-${selected}`" style="border-radius: 4px"></span>
              <!-- end::Selected Color Box -->
              {{ $filters.capitalize(selected) }}
            </span>
            <span v-if="toggleTextMode === 'selecting'" class="text-gray-600 d-block d-sm-none"
              >Enter Your Color</span
            >
          </p>
        </div>
      </div>
      <!-- end::Show Selected -->

      <!-- begin::Show Placeholder -->
      <div v-else class="text-start">
        <span class="text-gray-600">Enter Your Color</span>
      </div>
      <!-- end::Show Placeholder -->
    </a>

    <!-- begin::Dropdown Menu -->
    <ul :class="`dropdown-menu gap-0 ${btnSize}-triangle w-100`" aria-labelledby="dropdownMenuLink">
      <div class="d-flex align-items-center justify-content-center gap-8 flex-wrap">
        <div
          v-for="item in colors"
          :key="item"
          :class="`w-32px h-32px cursor-pointer d-flex align-items-center justify-content-center bg-app-${item}`"
          style="border-radius: 10px"
          @click="(e) => selectItem(e, item)"
        >
          <inline-svg v-if="selected === item" src="media/icons/icons/ok.svg"></inline-svg>
        </div>
      </div>
    </ul>
    <!-- end::Dropdown Menu -->
  </div>
</template>
