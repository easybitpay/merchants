<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Hooks
import useConvertDate from '@/hooks/useConvertDate.js'

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
const toggleTextMode = ref('selected')

const limits = {
  year: {
    min: 1900,
    max: 2000
  },
  month: {
    min: 1,
    max: 12
  },
  day: {
    min: 1,
    max: 31
  }
}

const date = ref({
  year: '',
  month: '',
  day: ''
})

const selectedBefore = ref({
  year: '',
  month: '',
  day: ''
})

const updateNumber = (key, action) => {
  if (action === 'increase') {
    if (date.value[key]) {
      if (+date.value[key] < limits[key].max) {
        date.value[key] = +date.value[key] + 1
      }
    } else {
      date.value[key] = limits[key].min
    }
  } else {
    if (date.value[key]) {
      if (+date.value[key] > limits[key].min) {
        date.value[key] = +date.value[key] - 1
      }
    } else {
      date.value[key] = limits[key].min
    }
  }
}

const numberCurrector = (key) => {
  if (date.value[key]) {
    if (date.value[key] > limits[key].max) {
      date.value[key] = limits[key].max
    }

    if (date.value[key] < limits[key].min) {
      date.value[key] = limits[key].min
    }
  }
}

const setSelectedDate = () => {
  if (props.selected) {
    let splited = props.selected.split('.')
    date.value = {
      year: splited[2],
      month: splited[1],
      day: splited[0]
    }

    selectedBefore.value = {
      year: splited[2],
      month: splited[1],
      day: splited[0]
    }
  }
}

const convertDate = (key) => {
  if (props.selected) {
    let splited = props.selected.split('.')
    const dateObject = {
      year: splited[2],
      month: splited[1],
      day: splited[0]
    }

    return dateObject[key]
  }
}

onMounted(() => {
  const myDropdown = document.getElementById('birthdateDropdown')

  /**
   * Dropdown Fire On Show
   */
  myDropdown.addEventListener('show.bs.dropdown', () => {
    toggleTextMode.value = 'selecting'
    setSelectedDate()
  })

  /**
   * Dropdown Fire On Hide
   */
  myDropdown.addEventListener('hide.bs.dropdown', () => {
    toggleTextMode.value = 'selected'

    const { year, month, day } = date.value

    if (year && month && day) {
      emit('change', `${day}.${month}.${year}`)
    }
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
            <template v-if="toggleTextMode === 'selected'">
              {{ convertDate('year') }} {{ convertDate('month') }} {{ convertDate('day') }}
            </template>

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
      <div class="input-box">
        <!-- begin::Year -->
        <div class="item">
          <div class="cursor-pointer" @click="updateNumber('year', 'decrease')">
            <div class="svg-box">
              <inline-svg src="media/icons/icons/chevron-left.svg"></inline-svg>
            </div>
          </div>

          <input
            type="number"
            class="form-control form-control-sm"
            :min="limits.year.min"
            :max="limits.year.max"
            step="1"
            v-model="date.year"
            :placeholder="selectedBefore.year ? selectedBefore.year : limits.year.max"
            @change="numberCurrector('year')"
          />

          <div class="cursor-pointer" @click="updateNumber('year', 'increase')">
            <div class="svg-box">
              <inline-svg src="media/icons/icons/chevron-right.svg"></inline-svg>
            </div>
          </div>
        </div>
        <!-- end::Year -->

        <!-- begin::Month -->
        <div class="item">
          <div class="cursor-pointer" @click="updateNumber('month', 'decrease')">
            <div class="svg-box">
              <inline-svg src="media/icons/icons/chevron-left.svg"></inline-svg>
            </div>
          </div>

          <input
            type="number"
            class="form-control form-control-sm"
            :min="limits.month.min"
            :max="limits.month.max"
            step="1"
            v-model="date.month"
            :placeholder="selectedBefore.month ? selectedBefore.month : limits.month.max"
            @change="numberCurrector('month')"
          />

          <div class="cursor-pointer" @click="updateNumber('month', 'increase')">
            <div class="svg-box">
              <inline-svg src="media/icons/icons/chevron-right.svg"></inline-svg>
            </div>
          </div>
        </div>
        <!-- end::Month -->

        <!-- begin::Day -->
        <div class="item">
          <div class="cursor-pointer" @click="updateNumber('day', 'decrease')">
            <div class="svg-box">
              <inline-svg src="media/icons/icons/chevron-left.svg"></inline-svg>
            </div>
          </div>

          <input
            type="number"
            class="form-control form-control-sm"
            :min="limits.day.min"
            :max="limits.day.max"
            step="1"
            v-model="date.day"
            :placeholder="selectedBefore.day ? selectedBefore.day : limits.day.max"
            @change="numberCurrector('day')"
          />

          <div class="cursor-pointer" @click="updateNumber('day', 'increase')">
            <div class="svg-box">
              <inline-svg src="media/icons/icons/chevron-right.svg"></inline-svg>
            </div>
          </div>
        </div>
        <!-- end::Day -->
      </div>
    </ul>
    <!-- end::Dropdown Menu -->
  </div>
</template>
