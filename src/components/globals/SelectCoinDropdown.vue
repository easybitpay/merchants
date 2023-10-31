<template>
  <div class="dropdown w-100 select-dropdown">
    <a
      :class="`btn btn-${btnSize} bg-gray-100 border-gray-200 dropdown-toggle w-100`"
      role="button"
      :disabled="disabled"
      id="dropdownMenuLink"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      :data-bs-auto-close="multiple ? 'outside' : true"
    >
      <div v-if="selectedItems.length">
        <span v-if="multiple">
          <img
            v-for="(item, index) in selected"
            :key="index"
            class="small-coin-icon multiple-coin"
            :src="
              item.logo
                ? storageImage(item.logo, 24)
                : useDefaultImage
                ? 'media/icons/duotune/ecommerce/ecm002.svg'
                : iconImage(item.symbol)
            "
            :alt="item[show] || item.symbol"
          />
        </span>
        <template v-else>
          <img
            v-if="showImage"
            class="me-2 small-coin-icon"
            :src="
              selected.logo
                ? storageImage(selected.logo, 24)
                : useDefaultImage
                ? 'media/icons/duotune/ecommerce/ecm002.svg'
                : iconImage(selected.symbol)
            "
            :alt="selected[show] || selected.symbol"
          />
          <img
            v-if="networkShowImage"
            class="me-2 small-coin-icon"
            :src="iconImage(selected.tokens[0].symbol)"
            :alt="selected.tokens[0].symbol"
          />
          {{ selected[show] || selected.symbol }}
          <template v-if="showCoinNetwork">
            ({{ selected.network?.name || showNetwork(selected.network_id) }})
          </template>
        </template>
      </div>

      <span v-else>{{ text }}</span>
    </a>

    <ul class="dropdown-menu custom-scroll w-100" aria-labelledby="dropdownMenuLink">
      <li v-for="(item, index) in items" :key="index" @click="toggleSelect(item)">
        <a
          :data-bs-toggle="showTooltip ? 'tooltip' : ''"
          :title="item.description"
          :class="{
            'dropdown-item cursor-pointer d-flex flex-stack': true,
            active: checkActive(item)
          }"
        >
          <div>
            <img
              v-if="showImage"
              class="me-2 my-2 small-coin-icon"
              :src="
                item.logo
                  ? storageImage(item.logo, 24)
                  : useDefaultImage
                  ? 'media/icons/duotune/ecommerce/ecm002.svg'
                  : iconImage(item.symbol)
              "
              :alt="item[show] || item.symbol"
            />
            <img
              v-if="networkShowImage"
              class="me-2 my-2 small-coin-icon"
              :src="iconImage(item.symbol)"
              :alt="item.symbol"
            />
            {{ item[show] || item.symbol }}
            <template v-if="showCoinNetwork">
              ({{ item.network?.name || showNetwork(item.network_id) }})
            </template>
          </div>
          <i v-if="showTooltip" class="fas fa-exclamation-circle fs-7"></i>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import useIconImage from '@/hooks/useIconImage'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  emit: ['toggleSelect'],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    selected: {
      type: [Object, Array],
      required: true
    },
    showImage: {
      type: Boolean,
      default: false
    },
    networkShowImage: {
      type: Boolean,
      default: false
    },
    show: {
      type: String,
      default: 'name'
    },
    useDefaultImage: {
      type: Boolean,
      default: false
    },
    check: {
      type: String,
      default: 'name'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showTooltip: {
      type: Boolean,
      default: false
    },
    showCoinNetwork: {
      type: Boolean,
      default: true
    },
    btnSize: {
      type: String,
      default: 'sm'
    }
  },
  setup(props, { emit }) {
    const store = useAuthStore()

    const selectedItems = ref([])
    const { iconImage, storageImage } = useIconImage()

    const networks = computed(() => store.networks)

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

    const checkActive = (item) => {
      for (let i = 0; i < selectedItems.value.length; i++) {
        const selected = selectedItems.value[i]

        if (selected[props.check] === item[props.check]) {
          return true
        }
      }
    }

    const toggleSelect = (select) => {
      let selected = selectedItems.value.filter((item) => item === select)

      if (!selected.length) {
        if (props.multiple) {
          selectedItems.value.push(select)
        } else {
          selectedItems.value = [select]
        }
      } else {
        if (props.multiple) {
          selectedItems.value = selectedItems.value.filter(
            (item) => item[props.check] !== select[props.check]
          )
        }
      }

      if (props.multiple) {
        emit('toggleSelect', selectedItems.value)
      } else {
        emit('toggleSelect', selectedItems.value[0])
      }
    }

    const setSelctedItems = () => {
      if (Array.isArray(props.selected)) {
        selectedItems.value = []
        for (let i = 0; i < props.selected.length; i++) {
          const element = props.selected[i]
          selectedItems.value.push(element)
        }
      } else {
        if (props.selected[props.check]) {
          selectedItems.value.push(props.selected)
        } else {
          selectedItems.value = []
        }
      }
    }

    onMounted(() => {
      setSelctedItems()
    })

    watch(
      () => props.selected,
      () => {
        setSelctedItems()
      }
    )
    return {
      iconImage,
      storageImage,
      checkActive,
      toggleSelect,
      selectedItems,
      showNetwork
    }
  }
})
</script>
