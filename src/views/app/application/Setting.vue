<script setup>
// Vue
import { computed, ref } from 'vue'

// Component
import ApplicationCard from '../../../components/application/ApplicationCard.vue'
import TextColumn from '../../../components/globals/TextColumn.vue'
import SelectCoinDropdown from '../../../components/globals/SelectCoinDropdown.vue'

// ----- START ----- //
import { useAuthStore } from '@/stores/auth'

const store = useAuthStore()

const tokens = computed(() => store.tokens)
const base_token = ref({})
const toggleBaseToken = (token) => {
  base_token.value = token
}

const available_tokens = ref([])
const toggleAvialableToken = (tokens) => {
  available_tokens.value = tokens
}
</script>

<template>
  <ApplicationCard action="status" />

  <!-- begin::App Info -->
  <div class="mb-12 mt-10">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">App info</h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-4">
      <!-- begin::Item -->
      <TextColumn title="App Name" content="mini Game" />
      <!-- end::Item -->

      <!-- begin::Item -->
      <TextColumn title="Site Url" content="easybitpay.com" />
      <!-- end::Item -->

      <!-- begin::Item -->
      <TextColumn
        title="Callback URL"
        content="panel.easybitpay.com/api/exchange/instant-exchange-callback"
      />
      <!-- end::Item -->

      <!-- begin::Item -->
      <TextColumn
        title="Redirect URL"
        content="panel.easybitpay.com/#/no-wrapper/instance-exchange"
      />
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::App Info -->

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
            <SelectCoinDropdown
              text="Select Your Main Coin"
              showImage
              show="name"
              check="id"
              :items="tokens"
              :selected="base_token"
              @toggleSelect="toggleBaseToken"
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
            <SelectCoinDropdown
              text="Select Your Main Coin"
              showImage
              show="name"
              check="id"
              multiple
              :items="tokens"
              :selected="available_tokens"
              @toggleSelect="toggleAvialableToken"
            />
          </div>
        </div>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Available Coins -->

  <!-- begin::Custom Coin -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Custom Coin</h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div class="d-flex flex-column gap-4 mb-10">
      <!-- begin::Item -->
      <div class="row row-gap-2 ls-base">
        <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2 lh-24px text-gray-900">Firest Custom Coin</div>

        <div class="col-sm-7 col-md-8 col-lg-9 col-xl-10 d-flex justify-content-start">
          <div
            class="w-100 w-lg-initial gap-4 d-flex text-gray-700 text-hover-primary hover-sm-show-parent"
          >
            <img src="https://panel.easybitpay.com/icons/32/color/trx.png" alt="trx" height="24" />

            PLUS COIN

            <inline-svg
              src="media/icons/icons/arrow-right.svg"
              class="svg-icon-primary hover-show-target d-none ms-0 ms-lg-16"
            ></inline-svg>
          </div>
        </div>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="row row-gap-2 ls-base">
        <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2 lh-24px text-gray-900">Secend Custom Coin</div>

        <div class="col-sm-7 col-md-8 col-lg-9 col-xl-10 d-flex justify-content-start">
          <div
            class="w-100 w-lg-initial gap-4 d-flex text-gray-700 text-hover-primary hover-sm-show-parent"
          >
            <img src="https://panel.easybitpay.com/icons/32/color/trx.png" alt="trx" height="24" />

            VINI COIN

            <inline-svg
              src="media/icons/icons/arrow-right.svg"
              class="svg-icon-primary hover-show-target d-none ms-0 ms-lg-16"
            ></inline-svg>
          </div>
        </div>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->

    <!-- begin::Add Coin -->
    <button class="btn btn-primary px-5">Create Custom Coin</button>
    <!-- end::Add Coin -->
  </div>
  <!-- end::Custom Coin -->

  <!-- begin::Customer Fee Share -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900">Customer Fee Share</h4>

    <p class="mb-6 text-gray-800">
      Some info may be visible to other people using Google services.
    </p>
    <!-- end::Title -->

    <!-- begin::Content -->
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. A omnis officia nostrum magni
      voluptatem nihil unde totam eligendi quae autem, natus dolorum magnam quisquam vero illo ut
      iure? Culpa, maiores!
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Customer Fee Share -->
</template>
