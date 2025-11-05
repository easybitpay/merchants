<script setup>
// Vue
import { ref } from 'vue'

// Store
import { useTicketStore } from '@/stores/ticket'

// Hooks
import useForm from '@/composables/useForm.js'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Props
const props = defineProps({
  department: {
    type: Number,
    required: true
  }
})

// Emit
const emit = defineEmits(['addNew'])

// ----- START ----- //

// Generalas
const store = useTicketStore()
const { showFeedBacks } = useForm()

// Refs
const loading = ref(false)

// Vuelidate
const form = ref({
  subject: null
})

const rules = {
  subject: {
    required: helpers.withMessage('Subject is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions

/**
 * Reset Form
 */
const resetForm = () => {
  form.value = {
    subject: null
  }
  v$.value.$reset()
}

/**
 * Create Ticket
 */
const createTicket = async () => {
  // Validation Form
  const result = await v$.value.$validate()

  if (result) {
    // Start Loading
    loading.value = true

    // Set Variables
    let fd = new FormData()
    fd.append('title', form.value.subject)
    fd.append('department_id', props.department)

    // Request
    await store.createNewTicket(fd).then((res) => {
      if (res) {
        emit('addNew', res)
        resetForm()
      }
    })

    // Stop Loading
    loading.value = false
  } else {
    showFeedBacks()
  }
}
</script>

<template>
  <div class="card rounded-1 border-gray-200 mb-6">
    <div class="card-body">
      <form @submit.prevent="createTicket" class="d-flex flex-column flex-md-row gap-6">
        <!-- begin::Title -->
        <div class="position-relative w-100">
          <input type="text" class="form-control" placeholder="Subject" v-model="form.subject" />

          <div class="invalid-feedback form-control" v-if="v$.subject.$errors.length">
            <span> {{ v$.subject.$errors[0].$message }}</span>
          </div>
        </div>
        <!-- end::Title -->

        <!-- begin::Action -->
        <div>
          <button type="submit" class="btn btn-primary w-100 w-md-168px" :disabled="loading">
            {{ loading ? 'Loading...' : 'Start New' }}
          </button>
        </div>
        <!-- end::Action -->
      </form>
    </div>
  </div>
</template>
