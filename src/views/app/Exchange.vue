<script setup>
// Vue
import { computed, ref } from 'vue'

// Component
import CoinDropdownVue from '../../components/globals/CoinDropdown.vue'

// ----- Start -----
import { useAuthStore } from '@/stores/auth'

const store = useAuthStore()

const tokens = computed(() => store.tokens)
const sendToken = ref('')
const toggleSendToken = (token) => {
  sendToken.value = token
}
</script>

<template>
  <!-- begin::Header -->
  <h2 class="text-primary fw-normal mb-12 neue-machina">Exchange</h2>
  <!-- end::Header -->

  <!-- begin::Content -->
  <div class="card border-cyan-500">
    <div class="card-body">
      <div class="row">
        <!-- begin::Form Box -->
        <div class="col-md-5">
          <!-- begin::Icon -->
          <inline-svg src="media/icons/shapes/exchange.svg"></inline-svg>
          <!-- end::Icon -->

          <!-- begin::Title -->
          <h4 class="mt-6 mb-2 fw-normal lh-1 text-gray-900">Instance Exchange</h4>
          <!-- end::Title -->

          <!-- begin::Subject -->
          <p class="mb-0">Some info may be visible to other people</p>
          <!-- end::Subject -->

          <!-- begin::Form -->
          <form class="mt-11 mb-10">
            <!-- begin::Send -->
            <div
              class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-4 mb-8"
            >
              <div>
                <label for="send" class="w-100 w-sm-104px text-gray-900"> You send </label>
              </div>

              <div class="w-100 position-relative d-flex align-items-center">
                <input id="send" type="number" class="form-control px-9" placeholder="Amount" />

                <!-- begin::Icon -->
                <inline-svg
                  src="media/icons/icons/arrow-forward.svg"
                  class="position-absolute start-8px"
                ></inline-svg>
                <!-- end::Icon -->

                <CoinDropdownVue
                  class="position-absolute end-8px"
                  showImage
                  check="id"
                  :items="tokens"
                  :selected="sendToken"
                  @toggleSelect="toggleSendToken"
                />
              </div>
            </div>
            <!-- end::Send -->
          </form>
          <!-- end::Form -->
        </div>
        <!-- end::Form Box -->

        <div class="col-md-7">
          <div
            class="card-linear-background rounded h-100 p-6 d-flex flex-column align-item-start justify-content-end text-white lh-1 fs-7 ls-base"
            style="--background: url(/media/images/banner/auth-bg.jpg)"
          >
            <p class="mb-0">You will send 1 of USDT in Tron network</p>
            <p class="mb-0">and will get 20 of ALN in Polygon network</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end::Content -->
</template>
