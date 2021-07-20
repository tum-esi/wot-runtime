import Vue from 'vue'
import Vuex from 'vuex'
import { FeathersVuex } from '@/feathers-client.js'

// plugins:
import auth from '@/store/store.auth.js' // feathers-vuex plugin

Vue.use(Vuex)
Vue.use(FeathersVuex)

// FeathersVuex:
// Import Vuex store modules initialized by feathers-vuex under /services.
// requireModule uses Webpack's require.context features with params:
// 1) path where the service modules live
// 2) wether to look in subfolders
// 3) only include .js files (prevents duplicate imports)
const requireModule = require.context('./services', false, /.js$/)
const servicePlugins = requireModule
  .keys()
  .map((modulePath) => requireModule(modulePath).default)

// Persistence:
import { persistPlugin } from '@/store/plugins/persist.plugin.js'
const paths = [
  // 'hosts',
  // 'systems',
  // 'things',
  // 'logs',
  // 'traces',
  // 'metrics',
  // 'users',
]

export default new Vuex.Store({
  state: {
    dialog: false,
    selected: [],
    notification: null,
    selectedInteraction: null,
    observePropertyRefreshInterval: 3000
  },
  mutations: {
    SET(state, payload) {
      state[payload.prop] = payload.value
    },
    TOGGLE(state, payload) {
      state[payload.prop] = !state[payload.prop]
    },
    ADD(state, payload) {
      state[payload.prop].push(payload.value)
    }
  },
  actions: {},
  modules: {},
  plugins: [
    ...servicePlugins,
    auth,
    persistPlugin('wot-runtime', paths) // register persistPlugins for each module
  ]
})
