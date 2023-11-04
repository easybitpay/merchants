<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Hooks
import useForm from '@/hooks/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

// ----- START ----- //
const { showFeedBacks } = useForm()

const checkActiveAccordion = () => {
  const accordion = document.querySelector('#ticketAccordion')

  const accordionItems = accordion.querySelectorAll('.accordion-item')

  accordionItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      item.classList.toggle('accordion-active')

      removeClass(index)
    })
  })
  const removeClass = (clickedIndex) => {
    accordionItems.forEach((item, index) => {
      if (clickedIndex !== index) {
        item.classList.remove('accordion-active')
      }
    })
  }
}

const form = ref({
  subject: null
})

const rules = {
  subject: {
    required: helpers.withMessage('Subject is required', required)
  }
}

const v$ = useVuelidate(rules, form)

const medias = ref([])
const addFile = (e) => {
  for (let i = 0; i < e.target.files.length; i++) {
    const element = e.target.files[i]

    //
    medias.value.push(element)
  }
}

const removeFiles = (file) => {
  medias.value = medias.value.filter((item) => item !== file)
}

const hiddenFileInput = ref(null)
const inputClick = () => {
  hiddenFileInput.value.click()
}

const createTicket = async () => {
  const result = await v$.value.$validate()
  if (result) {
    console.log('asd')
  } else {
    showFeedBacks()
  }
}

const showPreview = (file) => {
  return URL.createObjectURL(file)
}

onMounted(() => {
  checkActiveAccordion()
})
</script>
<template>
  <!-- begin::Categories -->
  <div>
    <Swiper
      :slidesPerView="1.2"
      :spaceBetween="16"
      :breakpoints="{
        '450': {
          slidesPerView: 2
        },
        '576': {
          slidesPerView: 3
        },
        '768': {
          slidesPerView: 4
        },
        '1200': {
          slidesPerView: 5
        },
        '1400': {
          slidesPerView: 6
        }
      }"
      class="mySwiper swiper-tab"
    >
      <SwiperSlide>
        <!-- begin::Card -->
        <div class="card border-gray-200 cursor-pointer">
          <div class="card-body p-4 text-gray-800">
            <!-- begin::Icon -->
            <inline-svg src="/media/icons/shapes/wallet.svg" height="33"></inline-svg>
            <!-- end::Icon -->

            <!-- begin::Title -->
            <div class="mt-5 mb-2 d-flex align-items-center justify-content-between">
              <h5 class="m-0 neue-machina active-parent-text-primary">Finance</h5>
            </div>
            <!-- end::Title -->

            <!-- begin::Count -->
            <small class="text-gray-500">No Chat</small>
            <!-- end::Count -->
          </div>
        </div>
        <!-- end::Card -->
      </SwiperSlide>
      <SwiperSlide>
        <!-- begin::Card -->
        <div class="card border-primary cursor-pointer transition-all active-box active-tab-shadow">
          <div class="card-body p-4 text-gray-800">
            <!-- begin::Icon -->
            <inline-svg src="/media/icons/shapes/coin.svg" height="33"></inline-svg>
            <!-- end::Icon -->

            <!-- begin::Title -->
            <div class="mt-5 mb-2 d-flex align-items-center justify-content-between">
              <h5 class="m-0 neue-machina active-parent-text-primary">Technical</h5>

              <span
                class="h-24px d-flex align-items-center justify-content-center bg-danger text-white rounded-pill"
                style="padding: 0 7px"
              >
                5
              </span>
            </div>
            <!-- end::Title -->

            <!-- begin::Count -->
            <small class="text-gray-500">New Message</small>
            <!-- end::Count -->
          </div>
        </div>
        <!-- end::Card -->
      </SwiperSlide>
      <SwiperSlide>
        <!-- begin::Card -->
        <div class="card border-gray-200 cursor-pointer">
          <div class="card-body p-4 text-gray-800">
            <!-- begin::Icon -->
            <inline-svg src="/media/icons/shapes/person.svg" height="33"></inline-svg>
            <!-- end::Icon -->

            <!-- begin::Title -->
            <div class="mt-5 mb-2 d-flex align-items-center justify-content-between">
              <h5 class="m-0 neue-machina active-parent-text-primary">Finance</h5>
            </div>
            <!-- end::Title -->

            <!-- begin::Count -->
            <small class="text-gray-500">No Chat</small>
            <!-- end::Count -->
          </div>
        </div>
        <!-- end::Card -->
      </SwiperSlide>
    </Swiper>
  </div>
  <!-- end::Categories -->

  <!-- begin::Create Message -->
  <div class="card rounded-4 border-gray-200">
    <div class="card-body">
      <form @submit.prevent="createTicket" class="d-flex flex-column flex-md-row gap-6">
        <!-- begin::Subject -->
        <div class="position-relative w-100">
          <input
            type="text"
            :class="[{ 'form-control': true }, { 'is-valid': !v$.subject.$invalid }]"
            placeholder="Subject"
            v-model="form.subject"
          />

          <div class="invalid-feedback form-control" v-if="v$.subject.$errors.length">
            <span> {{ v$.subject.$errors[0].$message }}</span>
          </div>
        </div>
        <!-- end::Subject -->

        <!-- begin::Action -->
        <div>
          <button class="btn btn-primary w-100 w-md-168px">Start New</button>
        </div>
        <!-- end::Action -->
      </form>
    </div>
  </div>
  <!-- end::Create Message -->

  <!-- begin::No Ticket Image -->
  <inline-svg
    v-if="false"
    src="/media/icons/shapes/no-ticket.svg"
    class="d-block mx-auto mt-16"
  ></inline-svg>
  <!-- end::No Ticket Image -->

  <!-- begin::Accordion -->
  <div class="accordion mt-6" id="ticketAccordion">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#ticketOne"
          aria-expanded="true"
          aria-controls="ticketOne"
        >
          Accordion Item #1
        </button>
      </h2>
      <div id="ticketOne" class="accordion-collapse collapse" data-bs-parent="#ticketAccordion">
        <div class="accordion-body p-0">
          <div class="ticket-messages custom-scroll">
            <!-- begin::Ticket Messages -->
            <div
              :class="`item-box-holder ${item === 1 ? 'user' : 'admin'}`"
              v-for="item in 20"
              :key="item"
            >
              <div class="item-box">
                <div class="item">If you are a risk-averse business</div>

                <small class="time lh-1">17:30</small>
              </div>

              <div class="medias">
                <a href="" class="item">
                  <img src="/media/images/banner/auth-bg.jpg" alt="item" />
                </a>
                <a href="" class="item">
                  <img src="/media/images/banner/theme.png" alt="item" />
                </a>
                <a href="" class="item">
                  <img src="/media/images/banner/theme.png" alt="item" />
                </a>
              </div>
            </div>
            <!-- end::Ticket Messages -->

            <!-- begin::Finish Box -->
            <div class="both-side-line-title mt-18">
              <span>
                Finished At 16.10.2023 - 07:28

                <img src="/media/icons/emoji/happy.png" class="cursor-pointer" />
              </span>
            </div>
            <!-- end::Finish Box -->
          </div>

          <!-- begin::Actions -->
          <div class="p-6 border-top border-primary" v-if="false">
            <!-- begin::Create Message -->
            <div class="d-flex gap-6">
              <button type="button" class="btn btn-primary w-100 w-sm-168px">
                <span class="d-block d-sm-none">New</span>
                <span class="d-none d-sm-block">New Message</span>
              </button>
              <button type="button" class="btn btn-light w-100 w-sm-200px">
                <span class="d-block d-sm-none">Close</span>
                <span class="d-none d-sm-block">Close Chat</span>
              </button>
            </div>
            <!-- end::Create Message -->

            <!-- begin::Form -->
            <form @submit.prevent="sendReply" v-if="false">
              <!-- begin::Textarea -->
              <textarea
                class="form-control p-0 rounded-0 border-0 bg-transparent min-h-48px"
                placeholder="Your message..."
              ></textarea>
              <!-- end::Textarea -->

              <div class="d-flex flex-wrap row-gap-4 column-gap-6 mt-4 mb-2" v-if="medias.length">
                <div
                  v-for="(file, index) in medias"
                  :key="index"
                  :style="`--background: url(${showPreview(file)})`"
                  class="gradient-image-box h-40px border border-gray-300 rounded ps-4 pe-2 d-flex align-items-center justify-content-between text-gray-800 w-100 mw-310px"
                >
                  <p class="mb-0 ellipsis" style="--ellipsis-width: 50%">{{ file.name }}</p>

                  <inline-svg
                    @click="removeFiles(file)"
                    src="/media/icons/icons/trash.svg"
                    height="24"
                    class="svg-icon-danger bg-white cursor-pointer"
                    style="border-radius: 3px"
                  ></inline-svg>
                </div>
              </div>

              <!-- begin::Action -->
              <div class="d-flex gap-4 mt-8">
                <input
                  type="file"
                  ref="hiddenFileInput"
                  multiple
                  className="d-none"
                  @change="addFile"
                />
                <!-- begin::Submit -->
                <button type="submit" class="btn btn-primary w-168px">Send</button>
                <!-- end::Submit -->

                <!-- begin::Attach -->
                <button
                  @click="inputClick"
                  class="btn btn-light border-0 w-40px h-40px p-0 align-items-center"
                >
                  <inline-svg src="/media/icons/icons/attach.svg"></inline-svg>
                </button>
                <!-- end::Attach -->
              </div>
              <!-- end::Action -->
            </form>
            <!-- end::Form -->
          </div>
          <!-- end::Actions -->

          <!-- begin::User Reaction -->

          <div
            class="p-6 pt-20 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between justify-content-md-start w-100 row-gap-3"
          >
            <!-- begin::Question -->
            <p class="mb-0 text-gray-600">Did this answer your question?</p>
            <!-- end::Question -->

            <!-- begin::Emojies -->
            <div class="d-flex gap-4 ms-0 ms-sm-8">
              <img src="/media/icons/emoji/happy.png" class="cursor-pointer" />
              <img src="/media/icons/emoji/sad.png" class="cursor-pointer" />
              <img src="/media/icons/emoji/neutral.png" class="cursor-pointer" />
            </div>
            <!-- end::Emojies -->
          </div>

          <!-- end::User Reaction -->
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#ticketTwo"
          aria-expanded="false"
          aria-controls="ticketTwo"
        >
          Accordion Item #2
        </button>
      </h2>
      <div id="ticketTwo" class="accordion-collapse collapse" data-bs-parent="#ticketAccordion">
        <div class="accordion-body">
          <strong>This is the second item's accordion body.</strong> It is hidden by default, until
          the collapse plugin adds the appropriate classes that we use to style each element. These
          classes control the overall appearance, as well as the showing and hiding via CSS
          transitions. You can modify any of this with custom CSS or overriding our default
          variables. It's also worth noting that just about any HTML can go within the
          <code>.accordion-body</code>, though the transition does limit overflow.
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#ticketThree"
          aria-expanded="false"
          aria-controls="ticketThree"
        >
          Accordion Item #3
        </button>
      </h2>
      <div id="ticketThree" class="accordion-collapse collapse" data-bs-parent="#ticketAccordion">
        <div class="accordion-body">
          <strong>This is the third item's accordion body.</strong> It is hidden by default, until
          the collapse plugin adds the appropriate classes that we use to style each element. These
          classes control the overall appearance, as well as the showing and hiding via CSS
          transitions. You can modify any of this with custom CSS or overriding our default
          variables. It's also worth noting that just about any HTML can go within the
          <code>.accordion-body</code>, though the transition does limit overflow.
        </div>
      </div>
    </div>
  </div>
  <!-- end::Accordion -->
</template>
