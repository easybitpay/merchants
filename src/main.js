import './assets/sass/styles.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import "bootstrap";

const app = createApp(App)

app.use(createPinia())
app.use(router)

import InlineSvg from 'vue-inline-svg'
app.component('inline-svg', InlineSvg)

app.mount('#app')
