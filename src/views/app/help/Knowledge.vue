<script setup>
// Vue
import { onMounted } from 'vue'

// Bootstrap
import { ScrollSpy } from 'bootstrap'

// main.js or another entry point
import Prism from 'prismjs'

// Components
import Nav from '../../../components/help/knowledge/Nav.vue'
import Overview from '../../../components/help/knowledge/Overview.vue'
import Concept from '../../../components/help/knowledge/Concept.vue'
import Authentication from '../../../components/help/knowledge/Authentication.vue'
import BaseUrls from '../../../components/help/knowledge/BaseUrls.vue'
import KeyManagement from '../../../components/help/knowledge/KeyManagement.vue'
import InvoiceApi from '../../../components/help/knowledge/InvoiceApi.vue'
import Callback from '../../../components/help/knowledge/Callback.vue'
import Sandbox from '../../../components/help/knowledge/Sandbox.vue'
import Withdraw from '../../../components/help/knowledge/Withdraw.vue'
import DataModel from '../../../components/help/knowledge/DataModel.vue'

const JS = `const options = { 
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'API_KEY'
},`

const PHP = `const options = { 
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'API_KEY'
},`

onMounted(() => {
  const scrollSpy = new ScrollSpy(document.body, {
    target: '#knowledge-nav'
  })

  scrollSpy.refresh()

  // This initializes Prism.js to highlight code
  Prism.highlightAll()
})
</script>

<template>
  <div class="d-flex gap-12">
    <div id="knowledge-holder">
      <div
        data-bs-spy="scroll"
        data-bs-target="#knowledge-nav"
        data-bs-smooth-scroll="true"
        tabindex="0"
      >
        <Overview />

        <div class="divider my-10 h-2px"></div>

        <Concept />

        <Authentication />

        <BaseUrls />

        <KeyManagement />

        <InvoiceApi />

        <Callback />

        <Sandbox />

        <Withdraw />

        <DataModel />
      </div>
    </div>

    <Nav />
  </div>
</template>
