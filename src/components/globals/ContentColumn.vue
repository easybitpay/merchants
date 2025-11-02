<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String
  },
  svgIcon: {
    type: String
  },
  textIcon: {
    type: String
  }
})
</script>

<template>
  <div class="content-column">
    <div class="icon-box" v-if="svgIcon || textIcon">
      <inline-svg v-if="svgIcon" :src="`media/icons/icons/${svgIcon}.svg`"></inline-svg>
    </div>

    <div class="text-box">
      <p class="title">{{ title }}</p>
      <p class="value">
        {{ value }}
      </p>
    </div>

    <slot></slot>
  </div>
</template>
