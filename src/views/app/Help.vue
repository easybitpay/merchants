<script setup>
import Basic from '../../components/settings/Basic.vue'
import FAQ from '../../components/help/FAQ.vue'
import Ticket from '../../components/help/Ticket.vue'
</script>
<template>
  <!-- begin::Nav -->
  <nav>
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
      <button
        class="nav-link active"
        id="nav-knowledge-tab"
        data-bs-toggle="tab"
        data-bs-target="#nav-knowledge"
        type="button"
        role="tab"
        aria-controls="nav-knowledge"
        aria-selected="true"
      >
        Knowledge
      </button>
      <button
        class="nav-link"
        id="nav-faq-tab"
        data-bs-toggle="tab"
        data-bs-target="#nav-faq"
        type="button"
        role="tab"
        aria-controls="nav-faq"
        aria-selected="false"
      >
        FAQ
      </button>
      <button
        class="nav-link"
        id="nav-ticket-tab"
        data-bs-toggle="tab"
        data-bs-target="#nav-ticket"
        type="button"
        role="tab"
        aria-controls="nav-ticket"
        aria-selected="false"
      >
        Tickets
      </button>
    </div>
  </nav>
  <!-- end::Nav -->

  <!-- begin::Content -->
  <div class="tab-content" id="nav-tabContent">
    <div
      class="tab-pane show active"
      id="nav-knowledge"
      role="tabpanel"
      aria-labelledby="nav-knowledge-tab"
      tabindex="0"
    >
      <Basic />
    </div>
    <div class="tab-pane" id="nav-faq" role="tabpanel" aria-labelledby="nav-faq-tab" tabindex="0">
      <FAQ />
    </div>
    <div
      class="tab-pane"
      id="nav-ticket"
      role="tabpanel"
      aria-labelledby="nav-ticket-tab"
      tabindex="0"
    >
      <Ticket />
    </div>
  </div>
  <!-- end::Content -->
</template>
