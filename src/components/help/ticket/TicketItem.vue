<script setup>
// Vue
import { onMounted, ref } from 'vue'

// Store
import { useTicketStore } from '@/stores/ticket'

// Hooks
import useForm from '@/composables/useForm.js'
import useConvertDate from '@/composables/useConvertDate.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Components
import LongImageCard from '../../globals/LongImageCard.vue'

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const reactions = [1, 2, 3]

// ----- START ----- //

// Generals
const store = useTicketStore()
const { showFeedBacks } = useForm()
const { convertDate, createDate } = useConvertDate()

// Refs
const uploadedFile = ref(null)
const hiddenFileInput = ref(null)

const sendMessageStep = ref(1)
const ticketDetail = ref({})
const loadings = ref({
  details: false,
  reply: false,
  close: false,
  reaction: false
})

// Vuelidate
const form = ref({
  body: null
})

const rules = {
  body: {
    required: helpers.withMessage('Message is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Convert Ticket Reaction To Image Name
 */
const convertReactionToImage = (reaction) => {
  if (reaction == 1) return 'sad'
  if (reaction == 2) return 'neutral'
  if (reaction == 3) return 'happy'
}

/**
 * Reset Form
 */
const resetForm = () => {
  form.value.body = ''
  uploadedFile.value = null
  v$.value.$reset()
}

/**
 * Add File
 * @param {files} e
 */
const addFile = (e) => {
  uploadedFile.value = e.target.files[0]
}

/**
 * Remove File
 * @param {file} file
 */
const removeFiles = (file) => {
  uploadedFile.value = null
}

/**
 * Click On Hidden Input
 */
const inputClick = () => {
  hiddenFileInput.value.click()
}

/**
 * Show UplodedItem Preview
 * @param {file} file
 */
const showPreview = (file) => {
  return URL.createObjectURL(file)
}

/**
 * Get Ticket Detail
 */
const getTicketDetail = async () => {
  // Start Loading
  loadings.value.details = true

  // Request
  await store.getTicketDetail(props.item.id).then((res) => {
    if (res) {
      ticketDetail.value = res
    }
  })

  // Stop Loading
  loadings.value.details = false
}

/**
 * Send Ticket Reply
 */
const sendReply = async () => {
  // Validation Form
  const result = await v$.value.$validate()
  if (result) {
    // Start Loading
    loadings.value.reply = true

    // Set Variables
    const id = props.item.id
    let fd = new FormData()
    fd.append('body', form.value.body)

    let file = uploadedFile.value

    if (file.name) {
      fd.append('file_path', file)
    }

    // Request
    await store.replyTicket({ id, fd }).then((res) => {
      if (res) {
        resetForm()
        ticketDetail.value = res
      }
    })

    // Stop Loading
    loadings.value.reply = false
  } else {
    showFeedBacks()
  }
}

/**
 * Close Ticket
 */
const closeTicket = async () => {
  // Start Loading
  loadings.value.close = true

  // Request
  await store.closeTicket(props.item.id).then((res) => {
    if (res) {
      ticketDetail.value.status = 2
      ticketDetail.value.closed_at = createDate('YYYY-MM-DD hh:mm:ss')
    }
  })

  // Stop Loading
  loadings.value.close = false
}

/**
 * Set Ticket Reaction
 */
const setTicketReaction = async (reaction) => {
  if (!loadings.value.reaction) {
    // Start Loading
    loadings.value.reaction = true

    // Set Variables
    const id = props.item.id
    const content = {
      score: reaction
    }

    // Request
    await store.setTicketReaction({ id, content }).then((res) => {
      if (res) {
        ticketDetail.value.reaction = reaction
      }
    })

    // Stop Loading
    loadings.value.reaction = false
  }
}

onMounted(() => {
  const myCollapsible = document.getElementById(`ticket-${props.item.id}`)

  /**
   * Accordion Fire On Show
   */
  myCollapsible.addEventListener('show.bs.collapse', (event) => {
    getTicketDetail()
  })

  /**
   * Accordion Fire On Hide
   */
  myCollapsible.addEventListener('hidden.bs.collapse', (event) => {
    sendMessageStep.value = 1
    resetForm()
  })
})
</script>

<template>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button
        class="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="`#ticket-${item.id}`"
        aria-expanded="true"
        :aria-controls="`ticket-${item.id}`"
      >
        {{ item.title }}
      </button>
    </h2>
    <div
      :id="`ticket-${item.id}`"
      class="accordion-collapse collapse"
      data-bs-parent="#ticketAccordion"
    >
      <div class="accordion-body p-0">
        <div class="ticket-messages custom-scroll">
          <BoxLoading v-if="loadings.details" />

          <!-- begin::Ticket Messages -->
          <div
            :class="`item-box-holder ${chat.admin_id ? 'admin' : 'user'}`"
            v-for="chat in ticketDetail.replies"
            :key="chat"
          >
            <div class="item-box">
              <div class="item">{{ chat.body }}</div>

              <small class="time lh-1">{{ convertDate(chat.created_at, 'hh:mm') }}</small>
            </div>

            <div class="medias" v-if="chat.file_path">
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
          <div class="both-side-line-title mt-18" v-if="ticketDetail.status == 2">
            <span>
              Finished At
              {{
                convertDate(ticketDetail.closed_at || ticketDetail.created_at, 'DD.MM.YYYY - hh:mm')
              }}

              <img
                :src="`/media/icons/emoji/${convertReactionToImage(ticketDetail.reaction)}.png`"
                class="cursor-pointer"
                v-if="ticketDetail.reaction"
              />
            </span>
          </div>
          <!-- end::Finish Box -->
        </div>

        <!-- begin::Actions -->
        <div class="p-6 border-top border-primary" v-if="ticketDetail.status != 2">
          <!-- begin::Message Actions -->
          <div class="d-flex gap-6" v-if="sendMessageStep == 1">
            <button
              type="button"
              @click="sendMessageStep = 2"
              class="btn btn-primary w-100 w-sm-168px"
            >
              <span class="d-block d-sm-none">New</span>
              <span class="d-none d-sm-block">New Message</span>
            </button>
            <button
              type="button"
              @click="closeTicket"
              :disabled="loadings.close"
              class="btn btn-light w-100 w-sm-200px"
            >
              <span class="d-block d-sm-none">{{ loadings.close ? 'Loading...' : 'Close' }}</span>
              <span class="d-none d-sm-block">
                {{ loadings.close ? 'Loading...' : 'Close Chat' }}
              </span>
            </button>
          </div>
          <!-- end::Message Actions -->

          <!-- begin::Form -->
          <form @submit.prevent="sendReply" v-else>
            <!-- begin::Textarea -->
            <div class="position-relative">
              <textarea
                class="form-control p-0 rounded-0 border-0 bg-transparent min-h-48px"
                placeholder="Your message..."
                v-model="form.body"
              ></textarea>

              <div
                class="invalid-feedback form-control p-0 rounded-0 border-0 min-h-48px bottom-0 align-items-start"
                v-if="v$.body.$errors.length"
              >
                <span> {{ v$.body.$errors[0].$message }}</span>
              </div>
            </div>
            <!-- end::Textarea -->

            <div class="d-flex flex-wrap row-gap-4 column-gap-6 mt-4 mb-2" v-if="uploadedFile">
              <LongImageCard
                :text="uploadedFile.name"
                :background="showPreview(uploadedFile)"
                deleteAction
                @onDelete="removeFiles(uploadedFile)"
                class="w-100 mw-310px"
              />
            </div>

            <!-- begin::Action -->
            <div class="d-flex gap-4 mt-8">
              <input type="file" ref="hiddenFileInput" className="d-none" @change="addFile" />
              <!-- begin::Submit -->
              <button type="submit" class="btn btn-primary w-168px" :disabled="loadings.reply">
                {{ loadings.reply ? 'Loading...' : 'Send' }}
              </button>
              <!-- end::Submit -->

              <!-- begin::Attach -->
              <button
                @click="inputClick"
                type="button"
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
          v-if="ticketDetail.status == 2 && !ticketDetail.reaction"
          class="p-6 pt-20 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between justify-content-md-start w-100 row-gap-3"
        >
          <!-- begin::Question -->
          <p class="mb-0 text-gray-600">Did this answer your question?</p>
          <!-- end::Question -->

          <!-- begin::Emojies -->
          <div class="d-flex flex-row-reverse gap-4 ms-0 ms-sm-8">
            <img
              v-for="reaction in reactions"
              :key="reaction"
              :src="`/media/icons/emoji/${convertReactionToImage(reaction)}.png`"
              class="cursor-pointer"
              @click="setTicketReaction(reaction)"
            />
          </div>
          <!-- end::Emojies -->
        </div>

        <!-- end::User Reaction -->
      </div>
    </div>
  </div>
</template>
