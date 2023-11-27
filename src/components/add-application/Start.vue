<script setup>
import { onMounted, ref } from 'vue'

// Emit
const emit = defineEmits(['goNext'])

// ----- START ----- //
const term = ref(false)

// Functions

/**
 * Submit Form
 * send data to parent for store
 */
const submitForm = () => {
  if (term.value) {
    // Set Variable
    const content = {
      agree: term.value
    }

    // Emit
    emit('goNext', content)
  }
}

onMounted(() => {
  document.addEventListener('submitStep0', function () {
    submitForm()
  })
})
</script>

<template>
  <div class="d-flex flex-column justify-content-between flex-root h-100">
    <div>
      <!-- begin::Title -->
      <h4 class="text-primary mb-6 neue-machina fw-normal">Start</h4>
      <!-- begin::Title -->

      <!-- begin::Title -->
      <p class="lh-24px ls-base mb-6">
        Ich w ar gestern Abend nach dem Umzug sehr müde und habe nur noch ein paar Sachen ausgepackt
        und Lara angerufen.Meine Nachbarn haben laut Musik gehört, aber ich bin sofort
        eingeschlafen.Und so hat mein Tag heute angefangen: Zuerst habe ich heute Morgen den Wecker
        nicht gehört.Ich bin also zu spät aufgestanden.Dann bin ich auch noch in die falsche S-Bahn
        eingestiegen und habees erst zwei Stationen später gemerkt. Aber ich bin schließlich sogar
        noch pünktlich im Hotel angekommen.Oje, ich habe den Wecker auch schon oft nicht gehört.Aber
        zum Glück noch nie am ersten Arbeitstag!Ich w ar gestern Abend nach dem Umzug sehr müde und
        habe nur noch ein paar Sachen ausgepackt und Lara angerufen.Meine Nachbarn haben laut Musik
        gehört, aber ich bin sofort eingeschlafen.Und so hat mein Tag heute angefangen: Zuerst habe
        ich heute Morgen den Wecker nicht gehört.Ich bin also zu spät aufgestanden.Dann bin ich auch
        noch in die falsche S-Bahn eingestiegen und habees erst zwei Stationen später gemerkt. Aber
        ich bin schließlich sogar noch pünktlich im Hotel angekommen.Oje, ich habe den Wecker auch
        schon oft nicht gehört.Aber zum Glück noch nie am ersten Arbeitstag!Ich w ar gestern Abend
        nach dem Umzug sehr müde und habe nur noch ein paar Sachen ausgepackt und Lara
        angerufen.Meine Nachbarn haben laut Musik gehört, aber ich bin sofort eingeschlafen.Und so
        hat mein Tag heute angefangen: Zuerst habe ich heute Morgen den Wecker nicht gehört.Ich bin
        also zu spät aufgestanden.Dann bin ich auch noch in die
      </p>
      <!-- end::Text -->
    </div>

    <div class="form-check">
      <input
        class="form-check-input cursor-pointer"
        type="radio"
        name="flexRadioDefault"
        id="createAppTerm"
        :checked="term"
        @click="term = !term"
      />
      <label class="form-check-label cursor-pointer fw-medium fs-5" for="createAppTerm">
        Aggre with Term & Conditions
      </label>
    </div>
  </div>
</template>
