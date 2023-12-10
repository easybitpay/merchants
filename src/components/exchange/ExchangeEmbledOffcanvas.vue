<script setup>
// Vue
import { onMounted } from 'vue'

// Prism
import Prism from 'prismjs'

// ----- START ----- //
const JS = `<iframe width="1280" height="720" src="https://www.youtube.com/embed/uIkJg7mPhng"
  title="Modeling, UV Unwrapping and Texturing Tutorial #31 | Detergent Bottle"
  frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media;
  gyroscope; picture-in-picture; web-share" allowfullscreen>
</iframe>`

onMounted(() => {
  Prism.highlightAll()
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
              <h3 class="mb-0 text-gray-900">Exchange Embed</h3>

              <p class="fs-7 mb-0 text-gray-800 ls-base">Two-factor authentication</p>
            </div>
          </div>
          <!-- end::Header -->

          <!-- begin::Content -->
          <div>
            <!-- begin::Steps Table -->
            <table class="w-100 text-gray-800 ls-base mb-4">
              <tbody>
                <!-- begin::Row -->
                <tr>
                  <td class="pe-2">
                    <div class="max-content">Step 1</div>
                  </td>
                  <td>Copy Code Blow Step</td>
                </tr>
                <!-- end::Row -->

                <!-- begin::Row -->
                <tr>
                  <td class="pe-2">
                    <div class="max-content">Step 2</div>
                  </td>
                  <td>Go to the social post or webpage you’d like to embed.</td>
                </tr>
                <!-- end::Row -->

                <!-- begin::Row -->
                <tr>
                  <td class="pe-2">
                    <div class="max-content">Step 3</div>
                  </td>
                  <td>Generate the embed code using the post’s options.</td>
                </tr>
                <!-- end::Row -->

                <!-- begin::Row -->
                <tr>
                  <td class="pe-2">
                    <div class="max-content">Step 4</div>
                  </td>
                  <td>
                    If applicable, customize the embed post, such as the height and width of the
                  </td>
                </tr>
                <!-- end::Row -->
              </tbody>
            </table>
            <!-- end::Steps Table -->

            <pre class="language-javascript"><code>{{ JS }}</code></pre>
          </div>
          <!-- end::Content -->
        </div>
      </div>
      <!-- end::Content Card -->

      <!-- begin::Action Card -->
      <div class="d-flex gap-4">
        <div class="d-none d-md-flex">
          <div
            class="w-56px h-56px d-flex align-items-center justify-content-center rounded-3 bg-white"
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
            <p class="fs-7 mb-0 ls-base text-gray-800 lh-32px">
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
