import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from '@/router.js'
import store from '@/store'
import vuetify from '@/plugins/vuetify.plugin.js'

Vue.config.productionTip = false

// activate performance mode on Vue app to use User Timing API
// that Vue uses internally to mark component performance
// see https://vuedose.tips/measure-runtime-performance-in-vue-js-apps/
Vue.config.performance = process.env.NODE_ENV !== 'production'

import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import VJsonEditor from 'v-jsoneditor'
Vue.use(VJsonEditor)

import VueMermaid from 'vue-mermaid'
Vue.use(VueMermaid)

import VuePrism from 'vue-prism'
import 'prismjs/themes/prism.css'
Vue.use(VuePrism)

// add feathers client as instance property
import feathersClient from '@/feathers-client.js'
Vue.prototype.$api = feathersClient

export default new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
