<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Prism
import Prism from 'prismjs'

// Constants
const steps = [
  'Customize the widget configuration above',
  'Copy the embed code below',
  "Paste the code into your website's HTML",
  'The widget will appear on your site with exchange functionality'
]

// ----- START ----- //

const embedCode = ref({
  width: '600',
  height: '700',
  theme: 'light',
  radius: '12'
})

const JS = computed(() => {
  return `<iframe 
  width="${embedCode.value.width}" 
  height="${embedCode.value.height}" 
  src="https://panel.easybitpay.com/#/widget/exchange?merchant=YOUR_MERCHANT_ID&theme=${embedCode.value.theme}"
  title="Crypto Exchange Widget"
  frameborder="0"
  style="border-radius: ${embedCode.value.radius}px;"
  allow="clipboard-write"
  loading="lazy">
</iframe>
`
})

// Functions
const changeTheme = (theme) => {
  embedCode.value.theme = theme;
  setTimeout(() => {
    refreshPrism()
  }, 1);
}

const refreshPrism = () => {
  Prism.highlightAll()
}

onMounted(() => {
  refreshPrism()
})
</script>

<template>
  <div
    class="offcanvas offcanvas-bottom w-100 mw-792px"
    tabindex="-1"
    id="exchangeEmbed_offcanvas"
    aria-labelledby="offcanvasExchangeEmbed"
  >
    <div class="offcanvas-body">
      <inline-svg
        src="media/icons/icons/close.svg"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        class="d-block mx-auto mb-4 cursor-pointer svg-icon-primary"
      ></inline-svg>

      <!-- begin::Content Card -->
      <div class="card border-0 mb-4">
        <div class="card-body pb-lg-22">
          <!-- begin::Header -->
          <div class="d-flex gap-4">
            <div>
              <div class="svg-holder">
                <inline-svg
                  :src="`/media/icons/shapes/${$filters.shapeStatus('embed')}.svg`"
                  width="39"
                  height="34"
                ></inline-svg>
              </div>
            </div>

            <div class="mb-10">
              <h3 class="mb-0 text-dark">Exchange Widget Embed</h3>

              <p class="fs-7 mb-0 text-gray-800 dark-text-gray-600 ls-base">
                Integrate exchange widget into your website
              </p>
            </div>
          </div>
          <!-- end::Header -->

          <!-- begin::Content -->
          <div>
            <!-- begin::Customize -->
            <h6 class="text-dark mb-3">Configuration</h6>

            <div class="row gy-4">
              <div class="col-sm-6">
                <label for="width" class="fs-8 mb-1">Width (px)</label>
                <input
                  id="width"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="embedCode.width"
                  @input="refreshPrism"
                />
              </div>

              <div class="col-sm-6">
                <label for="height" class="fs-8 mb-1">Height (px)</label>
                <input
                  id="height"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="embedCode.height"
                  @input="refreshPrism"
                />
              </div>

              <div class="col-sm-6">
                <label for="width" class="fs-8 mb-1">Theme</label>
                <div class="dropdown">
                  <button
                    class="dropdown-toggle w-100 form-control form-control-sm fs-8 d-flex align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {{ embedCode.theme }}
                  </button>
                  <ul class="dropdown-menu w-100">
                    <li @click="changeTheme('light')">
                      <a
                        :class="[
                          { 'dropdown-item': true },
                          { active: embedCode.theme === 'light' }
                        ]"
                      >
                        Light
                      </a>
                    </li>
                    <li @click="changeTheme('dark')">
                      <a
                        :class="[{ 'dropdown-item': true }, { active: embedCode.theme === 'dark' }]"
                      >
                        Dark
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="col-sm-6">
                <label for="radius" class="fs-8 mb-1">Border radius (px)</label>
                <input
                  id="radius"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="embedCode.radius"
                  @input="refreshPrism"
                />
              </div>
            </div>
            <!-- end::Customize -->

            <!-- begin::Steps -->
            <div class="mt-6">
              <h6 class="text-dark mb-3">Steps</h6>

              <table class="w-100 ls-base">
                <tbody>
                  <!-- begin::Row -->
                  <tr v-for="(item, index) in steps" :key="index" class="fs-7">
                    <td class="pe-2">
                      <div class="max-content text-primary">Step {{ index + 1 }}</div>
                    </td>
                    <td>{{ item }}</td>
                  </tr>
                  <!-- end::Row -->
                </tbody>
              </table>
            </div>
            <!-- end::Steps -->

            <!-- begin::Code -->
            <div class="mt-6">
              <h6 class="text-dark mb-3">Code</h6>
              <pre class="language-html" style="max-height: 300px"><code>{{ JS }}</code></pre>
            </div>
            <!-- end::Code -->
          </div>
          <!-- end::Content -->
        </div>
      </div>
      <!-- end::Content Card -->

      <!-- begin::Action Card -->
      <div class="d-flex gap-4">
        <div class="d-none d-md-flex">
          <div
            class="w-56px h-56px d-flex align-items-center justify-content-center rounded-1 bg-white"
          >
            <inline-svg
              :src="`/media/icons/shapes/${$filters.shapeStatus('documentation')}.svg`"
            ></inline-svg>
          </div>
        </div>
        <div class="card border-0 mb-6 w-100">
          <div
            class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4"
          >
            <p class="offcanvas-action-text">
              Latest clicks/conversions. Are you sure?
            </p>

            <!-- begin::Actions -->
            <div class="d-flex gap-4 w-100 w-sm-initial">
              <button
                type="button"
                class="btn btn-sm btn-primary w-100 w-sm-initial h-24px ls-base fw-normal"
              >
                Copy Code
              </button>
            </div>
            <!-- end::Actions -->
          </div>
        </div>
      </div>
      <!-- end::Action Card -->
    </div>
  </div>
</template>
