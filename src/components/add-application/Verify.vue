<script setup>
// Vue
import { onMounted } from 'vue'

// Composables
import useIconImage from '@/composables/useIconImage'

// Store
import { useAppStore } from '@/stores/app'

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
const emit = defineEmits(['goNext', 'changeLoadingStatus'])

// ----- START ----- //

// Generals
const store = useAppStore()
const { iconImage, storageImage } = useIconImage()

// Functions

/**
 * Show UplodedItem Preview
 * @param {file} file
 */
const showPreview = (file) => {
  return URL.createObjectURL(file)
}

/**
 * Submit Form
 * send data to parent for store
 */
const submitForm = async () => {
  let id = props.createdAppInfo.id
  if (id) {
    // Start Loading
    emit('changeLoadingStatus', true)

    // Request
    await store.verifyAppDomain(id).then((res) => {
      if (res) {
        emit('goNext', {})
      }
    })

    // Stop Loading
    emit('changeLoadingStatus', false)
  } else {
    emit('goNext', {})
  }
}

onMounted(() => {
  document.addEventListener('submitStep4', function () {
    submitForm()
  })
})
</script>

<template>
  <!-- begin::Title -->
  <div class="mb-10 px-6">
    <h4 class="text-primary mb-2 fw-normal">Verify</h4>
    <p class="mb-0 ls-base">If you need more info, please check out Help Page.</p>
  </div>
  <!-- begin::Title -->

  <div class="px-6">
    <!-- begin::Spacer -->
    <div class="border-bottom border-gray-400 w-100 mb-4"></div>
    <!-- end::Spacer -->

    <!-- begin::Icon & Banner Card -->
    <div
      class="card gradient-image-box  h-128px rounded"
      :style="`--background: url(${
        appInfo.banner ? showPreview(appInfo.banner) : '/media/images/banner/auth-bg.jpg'
      })`"
    >
      <div class="card-body d-flex align-items-end p-4 h-100">
        <div class="d-flex align-items-end gap-4">
          <!-- begin::Logo -->
          <img
            :src="appInfo.logo ? showPreview(appInfo.logo) : '/media/images/banner/default-app.png'"
            class="img-fluid rounded-1"
            width="40"
          />
          <!-- end::Logo -->

          <div>
            <p class="fs-7 mb-2 text-gray-600 ls-base lh-1">{{ appInfo?.type?.title }}</p>

            <h2 class="mb-0 text-success lh-1">{{ appInfo.name }}</h2>
          </div>
        </div>
      </div>
    </div>
    <!-- end::Icon & Banner Card -->

    <!-- begin::Spacer -->
    <div class="border-bottom border-gray-400 w-100 my-4"></div>
    <!-- end::Spacer -->

    <!-- begin::Info -->
    <div class="auto-infos">
      <!-- begin::Item -->
      <div class="item">
        <p class="title">Site URL</p>
        <p class="value">{{ appInfo.site_url }}</p>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Info -->

    <!-- begin::Spacer -->
    <div class="border-bottom border-gray-400 w-100 my-4"></div>
    <!-- end::Spacer -->

    <!-- begin::Info -->
    <div class="auto-infos">
      <!-- begin::Item -->
      <div class="item">
        <p class="title">Callback URL</p>
        <p class="value">{{ appInfo.callback_url }}</p>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="item">
        <p class="title">Redirect URL</p>
        <p class="value">{{ appInfo.redirect_url }}</p>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Info -->

    <!-- begin::Spacer -->
    <div class="border-bottom border-gray-400 w-100 my-4"></div>
    <!-- end::Spacer -->

    <!-- begin::Info -->
    <div class="auto-infos">
      <!-- begin::Item -->
      <div class="item">
        <p class="title">{{ appInfo?.type?.type == 1 ? 'Api' : 'Link' }}</p>
        <p class="value">
          {{ appInfo?.type?.type == 1 ? createdAppInfo.api_key : createdAppInfo.pay_url }}
        </p>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="item" v-if="appInfo?.type?.type == 1">
        <p class="title">Secret</p>
        <p class="value">{{ createdAppInfo.private_key }}</p>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Info -->

    <!-- begin::Spacer -->
    <div class="border-bottom border-gray-400 w-100 my-4"></div>
    <!-- end::Spacer -->

    <!-- begin::Info -->
    <div class="auto-infos">
      <!-- begin::Item -->
      <div class="item">
        <p class="title">Base Token</p>
        <div class="value" v-if="appInfo.baseCoin">
          <div class="d-flex gap-2">
            <img
              :src="
                appInfo?.baseCoin?.logo
                  ? storageImage(appInfo?.baseCoin?.logo, 32)
                  : iconImage(appInfo?.baseCoin?.symbol)
              "
              :alt="appInfo?.baseCoin?.name"
              class="small-coin-icon"
            />
          </div>
        </div>
      </div>
      <!-- end::Item -->

      <!-- begin::Item -->
      <div class="item">
        <p class="title">Available Tokens</p>
        <div class="value" v-if="appInfo.availableCoins">
          <div class="d-flex gap-2">
            <img
              v-for="(item, index) in appInfo.availableCoins"
              :key="index"
              :src="item.logo ? storageImage(item.logo, 32) : iconImage(item.symbol)"
              :alt="item?.name"
              class="small-coin-icon"
            />
          </div>
        </div>
      </div>
      <!-- end::Item -->
    </div>
    <!-- end::Info -->
  </div>
</template>
