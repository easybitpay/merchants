<script setup>
// Vue
import { computed, ref, onMounted } from 'vue'

// Hook
import useIconImage from '@/hooks/useIconImage'

// Store
import { useAppStore } from '@/stores/app'

// Props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    required: false
  },
  items: {
    type: Array,
    required: true
  },
  selected: {
    type: [Array],
    required: true
  },
  showImage: {
    type: Boolean,
    default: false
  },
  showCoinNetwork: {
    type: Boolean,
    default: false
  },
  show: {
    type: String,
    default: 'symbol'
  },
  check: {
    type: String,
    default: 'id'
  },
  btnSize: {
    type: String,
    default: 'md'
  },
  toggleClass: {
    type: String,
    required: false,
    default: ''
  },
  svgIcon: {
    type: String,
    required: false
  },
  svgIconColor: {
    type: String,
    required: false
  },
  width: {
    Type: String,
    default: '100'
  }
})

// Emit
const emit = defineEmits(['change', 'update'])

// ----- START ----- //
const store = useAppStore()

const { iconImage, storageImage } = useIconImage()

const networks = computed(() => store.networks)

const search = ref('')

const toggleTextMode = ref('selecting')
const isEditingMode = ref(false)
const beforeSelectedItems = ref([])

/**
 * Show Network Name
 */
const showNetwork = (networkID) => {
  let networkName = ''

  for (let i = 0; i < networks.value.length; i++) {
    const network = networks.value[i]
    if (network.id === networkID) {
      networkName = network.name
      break
    }
  }

  return networkName
}

/**
 * Toogle Select
 * add item to selectedItems or remove
 */
const toggleSelect = (select) => {
  let selectedList = [...props.selected]
  let selected = props.selected.filter((item) => item === select)

  if (!selected.length) {
    selectedList.push(select)
  } else {
    selectedList = selectedList.filter((item) => item[props.check] !== select[props.check])
  }

  if (isEditingMode.value) {
    beforeSelectedItems.value = selectedList
  }

  emit('change', selectedList)
}

/**
 * Check Active Item
 */
const checkActive = (item) => {
  for (let i = 0; i < props.selected.length; i++) {
    const selected = props.selected[i]

    if (selected[props.check] === item[props.check]) {
      return true
    }
  }
}

/**
 * Filtered Items
 */
const filteredItems = () => {
  var all = props.items,
    item = search.value

  if (!item) {
    return all
  }

  item = item.trim().toLowerCase()

  all = all.filter((currentItem) => {
    if (props.show) {
      if (currentItem[props.show].toLowerCase().indexOf(item) !== -1) {
        return currentItem
      }
    }

    if (currentItem.symbol) {
      if (currentItem.symbol.toLowerCase().indexOf(item) !== -1) {
        return currentItem
      }
    }
  })

  return all
}

onMounted(() => {
  const myDropdown = document.getElementById('multiSelectDropdown')

  /**
   * Dropdown Fire On Show
   */
  myDropdown.addEventListener('show.bs.dropdown', () => {
    toggleTextMode.value = 'selecting'
    if (props.selected.length) {
      isEditingMode.value = true
      beforeSelectedItems.value = props.selected
    } else {
      isEditingMode.value = false
    }
  })

  /**
   * Dropdown Fire On Hide
   */
  myDropdown.addEventListener('hide.bs.dropdown', () => {
    toggleTextMode.value = 'selected'
    emit('update')
  })
})
</script>

<template>
  <div :class="`dropdown w-${width}`" id="multiSelectDropdown">
    <a
      :class="`btn btn-${btnSize} bg-gray-100 border-gray-200 dropdown-toggle justify-content-between w-100 ${toggleClass}`"
      role="button"
      :disabled="disabled"
      id="dropdownMenuLink"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      data-bs-auto-close="outside"
      data-bs-offset="0,0"
    >
      <!-- begin::Icon -->
      <div v-if="svgIcon">
        <inline-svg
          :src="svgIcon"
          :class="`me-1 ${svgIconColor ? `svg-icon-${svgIconColor}` : ''}`"
        ></inline-svg>
      </div>
      <!-- end::Icon -->

      <!-- begin::Show Selected -->
      <div
        :class="[
          {
            'd-flex align-items-center gap-2 text-gray-800 active multi-select-dropdown-text-content': true
          },
          { 'with-svg': svgIcon }
        ]"
        v-if="selected.length"
      >
        <!-- begin::Radio Box -->
        <div>
          <div class="radio-box">
            <span></span>
          </div>
        </div>
        <!-- end::Radio Box -->
        <div
          :class="[
            { 'w-100 text-start': true },
            { 'text-gray-600': toggleTextMode === 'selecting' }
          ]"
        >
          <span class="ellipsis" style="--ellipsis-width: 100%">
            <template v-if="toggleTextMode === 'selected'">
              <span class="and-after" v-for="(item, index) in selected" :key="index">
                {{ item[show] }}
              </span>
            </template>

            <template v-else> {{ selected.length }} coins selected </template>
          </span>
        </div>
      </div>
      <!-- end::Show Selected -->

      <!-- begin::Show Placeholder -->
      <div
        v-else
        :class="[
          { 'multi-select-dropdown-text-placeholder text-start': true },
          { 'with-svg': svgIcon }
        ]"
      >
        <span class="text-gray-600 ellipsis" style="--ellipsis-width: 100%">{{ placeholder }}</span>
      </div>
      <!-- end::Show Placeholder -->
    </a>

    <!-- begin::Dropdown Menu -->
    <ul :class="`dropdown-menu gap-0 ${btnSize}-triangle w-100`" aria-labelledby="dropdownMenuLink">
      <!-- begin::Search Input -->
      <div class="position-relative d-flex align-items-center mb-6" v-if="items.length > 10">
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="Search anything"
          v-model="search"
        />

        <!-- begin::Icon -->
        <inline-svg
          src="media/icons/icons/search.svg"
          class="position-absolute end-16px"
        ></inline-svg>
        <!-- end::Icon -->
      </div>
      <!-- end::Search Input -->

      <!-- begin::Items -->
      <div class="custom-scroll d-flex flex-column gap-2">
        <!-- begin::Before Selected Items -->
        <div class="mb-6 d-flex flex-column gap-2" v-if="beforeSelectedItems.length">
          <li v-for="(item, index) in beforeSelectedItems" :key="index" @click="toggleSelect(item)">
            <a class="dropdown-item active">
              <div class="d-flex align-items-center gap-2">
                <!-- begin::Radio Box -->
                <div class="form-check p-0">
                  <input
                    class="form-check-input form-check-input-sm m-0 border-2"
                    type="radio"
                    :checked="true"
                  />
                </div>
                <!-- end::Radio Box -->

                {{ item[show] }}
                <span v-if="showCoinNetwork" class="fs-9 text-gray-600">
                  {{ item.network?.name || showNetwork(item.network_id) }}
                </span>
              </div>

              <img
                v-if="showImage"
                class="small-coin-icon me-3"
                :src="item.logo ? storageImage(item.logo, 24) : iconImage(item.symbol)"
                :alt="item[show]"
              />
            </a>
          </li>
        </div>
        <!-- end::Before Selected Items -->

        <!-- begin::Item -->
        <li v-for="(item, index) in filteredItems()" :key="index" @click="toggleSelect(item)">
          <a :class="[{ 'dropdown-item': true }, { active: checkActive(item) }]">
            <div class="d-flex align-items-center gap-2">
              <!-- begin::Radio Box -->
              <div class="form-check p-0">
                <input
                  class="form-check-input form-check-input-sm m-0 border-2"
                  type="radio"
                  :checked="checkActive(item)"
                />
              </div>
              <!-- end::Radio Box -->

              {{ item[show] }}
              <span v-if="showCoinNetwork" class="fs-9 text-gray-600">
                {{ item.network?.name || showNetwork(item.network_id) }}
              </span>
            </div>

            <img
              v-if="showImage"
              class="small-coin-icon me-3"
              :src="item.logo ? storageImage(item.logo, 24) : iconImage(item.symbol)"
              :alt="item[show]"
            />
          </a>
        </li>
        <!-- end::Item -->
      </div>
      <!-- end::Items -->
    </ul>
    <!-- end::Dropdown Menu -->
  </div>
</template>
