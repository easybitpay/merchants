<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useForm from '@/composables/useForm.js'
import useActionShareAllowed from '@/composables/useActionShareAllowed.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Components
import SelectDropdown from '../../globals/SelectDropdown.vue'
import MultiSelectDropdown from '../../globals/MultiSelectDropdown.vue'

// ----- START ----- //

// Generals
const store = useAppStore()
const { showFeedBacks } = useForm()
const { actionShareAllowed } = useActionShareAllowed()

// Refs
const loading = ref(false)
const tokens = ref([])
const base_token = ref({})
const available_tokens = ref([])

// Computeds
const selectedApp = computed(() => store.selectedApp)

// Vuelidate
const form = ref({
  baseCoin: null,
  availableCoins: null
})

const rules = {
  baseCoin: {
    required: helpers.withMessage('Main coin is required', required)
  },
  availableCoins: {
    required: helpers.withMessage('Can pay coins is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Get App Tokens
 */
const getAppTokens = async () => {
  // Start Loading
  loading.value = true;

  // Request
  await store.getAppTokens(selectedApp.value.id).then(res => {
    if (res) {
      tokens.value = res
    }
  })

  // Stop Loading
  loading.value = false
}

/**
 * Set Default Values
 */
const setDefaultValues = () => {
  base_token.value = selectedApp.value.baseToken
  available_tokens.value = selectedApp.value.availableTokens

  form.value = {
    baseCoin: selectedApp.value.baseToken.id,
    availableCoins: `${selectedApp.value.availableTokens.length}`
  }
}

/**
 * Toggle Base Coin
 * @param {token} token
 */
const toggleBaseToken = (token) => {
  base_token.value = token
  form.value.baseCoin = token.id
}

/**
 * Toggle Available Coins
 * @param {tokens} tokens
 */
const toggleAvialableToken = (tokens) => {
  available_tokens.value = tokens
  if (tokens.length) {
    form.value.availableCoins = `${tokens.length}`
  } else {
    form.value.availableCoins = null
  }
}

/**
 * Check Base Token Update
 */
const checkBaseTokensUpdate = () => {
  const defaultBase = selectedApp.value.baseToken.id
  const newBase = base_token.value.id

  if (defaultBase != newBase) {
    updateAppInfo()
  }
}

/**
 * Check For Update Available coins
 */
const checkAvailableTokensUpdate = () => {
  let sameValues = true

  // Set Default Available Coins
  let defaults = []
  for (let i = 0; i < selectedApp.value.availableTokens.length; i++) {
    const token = selectedApp.value.availableTokens[i]
    defaults.push(token.id)
  }

  // Set New Available Coins
  let news = []
  for (let i = 0; i < available_tokens.value.length; i++) {
    const token = available_tokens.value[i]
    news.push(token.id)
  }

  // Check
  if (defaults.length !== news.length) {
    sameValues = false
  }

  if (sameValues) {
    const elements = new Set([...defaults, ...news])
    for (const x of elements) {
      const count1 = defaults.filter((e) => e === x).length
      const count2 = news.filter((e) => e === x).length
      if (count1 !== count2) {
        sameValues = false
        break
      }
    }
  }

  if (!sameValues) {
    updateAppInfo()
  }
}

/**
 * Update App Info
 */
const updateAppInfo = async () => {
  // Validion Form
  const result = await v$.value.$validate()
  if (result) {
    // Start Loading
    loading.value = true

    // Set Variables
    const id = selectedApp.value.id
    let fd = new FormData()

    // set base coin
    fd.append('base_token_id', base_token.value.id)

    // set available coins
    let array = []
    for (let i = 0; i < available_tokens.value.length; i++) {
      const token = available_tokens.value[i]
      array.push(token.id)
    }

    let string = array.toString()

    fd.append('available_tokens', string)

    // Request
    await store.updateApp({ id, fd })

    // Stop Loading
    loading.value = false
  } else {
    showFeedBacks()
  }
}

onMounted(() => {
  getAppTokens()
  setDefaultValues()
})
</script>
<template>
  <!-- begin::Available Coins -->
  <div class="mb-12">
    <!-- begin::Title -->
    <h4 class="mb-2 lh-1 text-gray-900 d-flex align-items-center gap-3">
      Available Coin
      <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
    </h4>

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
          <div class="w-100 w-lg-264px position-relative d-flex align-items-center">
            <SelectDropdown
              placeholder="Select Your Main Coin"
              show="name"
              showImage
              showCoinNetwork
              :items="tokens"
              :selected="base_token"
              @change="toggleBaseToken"
              @update="checkBaseTokensUpdate"
              :disabled="loading || !actionShareAllowed(selectedApp.share_type, 'edit_app')"
            />

            <div
              class="invalid-feedback form-control form-control-sm"
              v-if="v$.baseCoin.$errors.length"
            >
              <span> {{ v$.baseCoin.$errors[0].$message }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="row ls-base">
        <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2 text-gray-900 lh-24px">Can pay Coins</div>

        <div class="col-sm-7 col-md-8 col-lg-9 col-xl-10 d-flex justify-content-start">
          <div class="w-100 w-lg-264px position-relative d-flex align-items-center">
            <MultiSelectDropdown
              placeholder="Select Your Can Pay Coin"
              show="name"
              showImage
              showCoinNetwork
              :items="tokens"
              :selected="available_tokens"
              @change="toggleAvialableToken"
              @update="checkAvailableTokensUpdate"
              :disabled="loading || !actionShareAllowed(selectedApp.share_type, 'edit_app')"
            />
            <div
              class="invalid-feedback form-control form-control-sm"
              v-if="v$.availableCoins.$errors.length"
            >
              <span> {{ v$.availableCoins.$errors[0].$message }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Available Coins -->
</template>
