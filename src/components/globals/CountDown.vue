<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  timer: {
    type: Number,
    default: 90
  }
})

const leftTime = ref(0)
const interval = ref(null)

const minAndSec = (value) => {
  var minutes = Math.floor(parseInt(value, 10) / 60)
  var seconds = parseInt(value, 10) - minutes * 60
  return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

const startTimer = () => {
  if (leftTime.value === 0) {
    leftTime.value = props.timer

    interval.value = setInterval(() => {
      leftTime.value -= 1

      if (leftTime.value == 0) {
        clearInterval(interval.value)
      }
    }, 1000)
  }
}

onMounted(() => {
  startTimer()
})
</script>

<template>
  <span @click="startTimer" :class="[{ 'cursor-pointer': leftTime === 0 }]">
    Send Again <template v-if="leftTime != 0">in {{ minAndSec(leftTime) }}</template>
  </span>
</template>
