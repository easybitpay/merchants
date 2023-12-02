<script setup>
// Hook
import useIconImage from '@/hooks/useIconImage'

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

// Emit
const emit = defineEmits(['openEdit'])

var special = [
  'zeroth',
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
  'eleventh',
  'twelfth',
  'thirteenth',
  'fourteenth',
  'fifteenth',
  'sixteenth',
  'seventeenth',
  'eighteenth',
  'nineteenth'
]
var deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet']

// ----- START ----- //

// Generals
const { storageImage } = useIconImage()

// Functions

/**
 * Convert Number To Text
 * @param {index} n
 */
function stringifyNumber(n) {
  if (n < 20) return special[n]
  if (n % 10 === 0) return deca[Math.floor(n / 10) - 2] + 'ieth'
  return deca[Math.floor(n / 10) - 2] + 'y-' + special[n % 10]
}

/**
 * Open Edit Custom Token
 */
const open_edit = () => {
  emit('openEdit', props.item)
}
</script>

<template>
  <div class="row row-gap-2 ls-base">
    <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2 lh-24px text-gray-900">
      {{ $filters.capitalize(stringifyNumber(index + 1)) }} Custom Coin
    </div>

    <div class="col-sm-7 col-md-8 col-lg-9 col-xl-10 d-flex justify-content-start">
      <div
        @click="open_edit"
        class="w-100 w-lg-initial gap-4 d-flex text-gray-700 text-hover-primary hover-sm-show-parent"
      >
        <img :src="storageImage(item.logo, 40)" :alt="item.symbol" height="24" />

        {{ item.name }}

        <inline-svg
          src="media/icons/icons/arrow-right.svg"
          class="svg-icon-primary hover-show-target d-none ms-0 ms-lg-16"
        ></inline-svg>
      </div>
    </div>
  </div>
</template>
