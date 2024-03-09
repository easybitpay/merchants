<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Components
import SelectDropdown from '../globals/SelectDropdown.vue'
import MultiSelectDropdown from '../globals/MultiSelectDropdown.vue'

// Props
const props = defineProps({
  appInfo: {
    type: Object,
    required: true
  },
  createdAppInfo: {
    type: Object,
    required: true
  }
})

// Emit
const emit = defineEmits(['goNext', 'changeLoadingStatus', 'setCreatedAppInfo'])

// ----- START ----- //

// Generals
const store = useAppStore()
const { showFeedBacks } = useForm()

// Refs
const base_token = ref({})
const available_tokens = ref([])

// Computeds
const tokens = computed(() => store.tokens)

// Vuelidate
const generalForm = ref({
  callback_url: '',
  redirect_url: '',
  baseCoin: null,
  availableCoins: null,
  need_name: false,
  need_email: false
})

const amountForm = ref({
  amount: ''
})

const generalRules = {
  callback_url: {
    required: helpers.withMessage('Callback url is required', required)
  },
  redirect_url: {
    required: helpers.withMessage('Redirect url is required', required)
  },
  baseCoin: {
    required: helpers.withMessage('Bse coin is required', required)
  },
  availableCoins: {
    required: helpers.withMessage('Availabe coins is required', required)
  }
}

const amountRules = {
  amount: {
    required: helpers.withMessage('Amount is required', required)
  }
}

const vGeneral$ = useVuelidate(generalRules, generalForm)
const vAmount$ = useVuelidate(amountRules, amountForm)

// Functions

/**
 * Toggle Base Coin
 * @param {token} token
 */
const toggleBaseToken = (token) => {
  base_token.value = token
  generalForm.value.baseCoin = token.id
}

/**
 * Toggle Available Coins
 * @param {tokens} tokens
 */
const toggleAvialableToken = (tokens) => {
  available_tokens.value = tokens
  if (tokens.length) {
    generalForm.value.availableCoins = `${tokens.length}`
  } else {
    generalForm.value.availableCoins = null
  }
}

/**
 * Submit Form
 * send data to parent for store
 */
const submitForm = async () => {
  // Validion Form
  const generalResult = await vGeneral$.value.$validate()
  let amountResult = true

  if (props?.appInfo?.type?.type == 2) {
    amountResult = await vAmount$.value.$validate()
  }

  if (generalResult && amountResult) {
    // Start Loading
    emit('changeLoadingStatus', true)

    // Set Variables
    let array = []
    for (let i = 0; i < available_tokens.value.length; i++) {
      const token = available_tokens.value[i]
      array.push(token.id)
    }

    let availableCoinsString = array.toString()

    const id = props.createdAppInfo.id

    let setting = {}
    setting.need_name = generalForm.value.need_name
    setting.need_email = generalForm.value.need_email
    setting.color = props.appInfo.color
    

    if (props.appInfo.type.type == 2) setting.amount = amountForm.value.amount

    let fd = new FormData()
    fd.append('settings', JSON.stringify(setting))
    fd.append('type', props.appInfo.type.type)
    fd.append('name', props.appInfo.name)
    fd.append('site_url', props.appInfo.site_url)
    fd.append('customer_fee_percent', props.appInfo.customer_fee_percent)
    fd.append('callback_url', generalForm.value.callback_url)
    fd.append('redirect_url', generalForm.value.redirect_url)
    fd.append('base_token_id', base_token.value.id)
    fd.append('available_tokens', availableCoinsString)
    if (props.appInfo.logo) {
      fd.append('logo', props.appInfo.logo)
    }
    if (props.appInfo.banner) {
      fd.append('banner', props.appInfo.banner)
    }


    if (id) {
      await store.updateApp({ id, fd })
    } else {
      await store.createApp(fd).then((res) => {
        if (res) {
          emit('setCreatedAppInfo', res)
        }
      })
    }

    // Change Page
    const content = {
      ...generalForm.value,
      ...amountForm.value,
      baseCoin: base_token.value,
      availableCoins: available_tokens.value
    }
    emit('goNext', content)

    // Stop Loading
    emit('changeLoadingStatus', false)
  } else {
    showFeedBacks()
  }
}

onMounted(() => {
  document.addEventListener('submitStep3', function () {
    submitForm()
  })
})
</script>

<template>
  <!-- begin::Title -->
  <div class="mb-10 px-6">
    <h4 class="text-primary mb-2 neue-machina fw-normal">Pro information</h4>
    <p class="mb-0 ls-base">If you need more info, please check out Help Page.</p>
  </div>
  <!-- begin::Title -->

  <form @submit.prevent="submitForm" class="px-6">
    <button type="submit" hidden></button>
    <!-- begin::Callback URL -->
    <div class="position-relative mb-6">
      <div class="grouped-input form-control">
        <label for="callback-url">Callback URL</label>
        <input
          type="text"
          id="callback-url"
          placeholder="Callback URL"
          v-model="generalForm.callback_url"
        />
      </div>

      <div class="invalid-feedback form-control" v-if="vGeneral$.callback_url.$errors.length">
        <span> {{ vGeneral$.callback_url.$errors[0].$message }}</span>
      </div>
    </div>
    <!-- end::Callback URL -->

    <!-- begin::Redirect URL -->
    <div class="position-relative mb-6">
      <div class="grouped-input form-control">
        <label for="redirect-url">Redirect URL</label>
        <input
          type="text"
          id="redirect-url"
          placeholder="Redirect URL"
          v-model="generalForm.redirect_url"
        />
      </div>

      <div class="invalid-feedback form-control" v-if="vGeneral$.redirect_url.$errors.length">
        <span> {{ vGeneral$.redirect_url.$errors[0].$message }}</span>
      </div>
    </div>
    <!-- end::Redirect URL -->

    <!-- begin::Amount -->
    <div class="position-relative mb-6" v-if="appInfo?.type?.type == 2">
      <div class="grouped-input form-control">
        <label for="amount">Amount</label>
        <input type="text" id="amount" placeholder="Amount" v-model="amountForm.amount" />
      </div>

      <div class="invalid-feedback form-control" v-if="vAmount$.amount.$errors.length">
        <span> {{ vAmount$.amount.$errors[0].$message }}</span>
      </div>
    </div>
    <!-- end::Amount -->

    <!-- begin::Base Coin -->
    <div class="position-relative mb-6">
      <SelectDropdown
        show="name"
        width="initial"
        grouped="Base Coin"
        placeholder="Base Coin"
        showImage
        showCoinNetwork
        :items="tokens"
        :selected="base_token"
        @change="toggleBaseToken"
      />

      <div class="invalid-feedback form-control" v-if="vGeneral$.baseCoin.$errors.length">
        <span> {{ vGeneral$.baseCoin.$errors[0].$message }}</span>
      </div>
    </div>
    <!-- end::Base Coin -->

    <!-- begin::Available Coins -->
    <div class="position-relative mb-6">
      <MultiSelectDropdown
        show="name"
        width="initial"
        grouped="Available Token"
        placeholder="Available Token"
        showImage
        showCoinNetwork
        :items="tokens"
        :selected="available_tokens"
        @change="toggleAvialableToken"
      />

      <div class="invalid-feedback form-control" v-if="vGeneral$.availableCoins.$errors.length">
        <span> {{ vGeneral$.availableCoins.$errors[0].$message }}</span>
      </div>
    </div>
    <!-- end::Available Coins -->

    <!-- begin::Features -->
    <div class="d-flex flex-column gap-6" v-if="appInfo?.type?.type == 3">
      <!-- begin::Item -->
      <div
        class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-start gap-3 form-check form-switch p-0"
      >
        <label class="form-check-label" for="app-feature-1"> Get user's name in pay page </label>
        <input class="form-check-input m-0" type="checkbox" role="switch" id="app-feature-1" />
      </div>
      <!-- begin::Item -->

      <!-- begin::Item -->
      <div
        class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-start gap-3 form-check form-switch p-0"
      >
        <label class="form-check-label" for="app-feature-2"> Get user's email in pay page </label>
        <input class="form-check-input m-0" type="checkbox" role="switch" id="app-feature-2" />
      </div>
      <!-- begin::Item -->
    </div>
    <!-- end::Features -->
  </form>
</template>
