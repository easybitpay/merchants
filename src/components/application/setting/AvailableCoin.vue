<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Components
import SelectDropdown from '../../globals/SelectDropdown.vue'
import MultiSelectDropdown from '../../globals/MultiSelectDropdown.vue'

// ----- Start -----

// Generals
const store = useAppStore()

// Refs
const base_token = ref({})
const available_tokens = ref([])

// Computeds
const tokens = computed(() => store.tokens)
const selectedApp = computed(() => store.selectedApp)


// Functions
const toggleBaseToken = (token) => {
  base_token.value = token
}

const toggleAvialableToken = (tokens) => {
  available_tokens.value = tokens
}

onMounted(() => {
  base_token.value = selectedApp.value.baseToken
  available_tokens.value = selectedApp.value.availableTokens
})
</script>
<template>
  <!-- begin::Available Coins -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Available Coin</h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-4">
      <!-- begin::Item -->
      <div class="row ls-base">
        <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2 text-gray-900 lh-24px">Main Coin</div>

        <div class="col-sm-7 col-md-8 col-lg-9 col-xl-10 d-flex justify-content-start">
          <div class="w-100 w-lg-264px d-flex justify-content-between justify-content-lg-start">
            <SelectDropdown
              placeholder="Select Your Main Coin"
              show="name"
              showImage
              btnSize="sm"
              showCoinNetwork
              :items="tokens"
              :selected="base_token"
              @change="toggleBaseToken"
            /> 
          </div>
        </div>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="row ls-base">
        <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2 text-gray-900 lh-24px">Can pay Coins</div>

        <div class="col-sm-7 col-md-8 col-lg-9 col-xl-10 d-flex justify-content-start">
          <div class="w-100 w-lg-264px d-flex justify-content-between justify-content-lg-start">
            <MultiSelectDropdown
              placeholder="Select Your Main Coin"
              show="name"
              showImage
              btnSize="sm"
              showCoinNetwork
              :items="tokens"
              :selected="available_tokens"
              @change="toggleAvialableToken"
            />
          </div>
        </div>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Available Coins -->
</template>
