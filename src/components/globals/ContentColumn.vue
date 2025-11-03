<script setup>
const props = defineProps({
  title: {
    type: String
  },
  value: {
    type: String
  },
  svgIcon: {
    type: String
  },
  textIcon: {
    type: String
  },
  imageIcon: {
    type: String
  },
  textLoading: {
    type: Boolean
  },
  iconLoading: {
    type: Boolean
  }
})
</script>

<template>
  <div class="content-column">
    <Skeletor v-if="iconLoading" class="rounded-1" size="40px" />
    <div class="icon-box" v-if="svgIcon || textIcon || imageIcon">
      <inline-svg v-if="svgIcon" :src="`media/icons/icons/${svgIcon}.svg`"></inline-svg>

      <img :src="imageIcon" class="h-24px"/>

      <span v-if="textIcon">{{ textIcon }}</span>
    </div>

    <div class="text-box">
      <p class="title">
        <Skeletor v-if="textLoading" class="rounded-0" width="100px" />
        <template v-else>{{ title }}</template>
      </p>
      <p class="value">
        <Skeletor v-if="textLoading" class="rounded-0" width="70px" />
        <template v-else> {{ value }} </template>
      </p>
    </div>

    <slot></slot>
  </div>
</template>
