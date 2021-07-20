import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '@/feathers-client.js'

// Creates a model class
class Trace extends BaseModel {
  constructor(data, options = {}) {
    super(data, options)
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Trace'

  // Define default properties here
  static instanceDefaults() {
    return {}
  }
}

const servicePath = 'traces'
// Registers model class with makeServicePlugin
const servicePlugin = makeServicePlugin({
  // Required per service:
  Model: Trace,
  service: feathersClient.service(servicePath),
  // Optional and only configurable per service:
  servicePath: servicePath,
  // handleEvents: { created, patched, updated, removed ... },

  // Vuex store:
  state: {},
  getters: {},
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
  actions: {}
})

import { addHostId } from '@/hooks/add-host-id.js'

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [addHostId],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
})

export default servicePlugin
