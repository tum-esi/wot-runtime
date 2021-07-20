// Configuration for feathers-vuex module (docs: vuex.feathersjs.com/getting-started.html)
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { iff, discard } from 'feathers-hooks-common'
import feathersVuex from 'feathers-vuex'

// logger: set log-level on app startup (alternatively from config file)
import loglevel from 'loglevel'
loglevel.setLevel('debug') // can also be used to set log-level dynamically
import { setNow } from 'feathers-hooks-common'
import router from '@/router.js'

const apiURL = router.currentRoute.meta.apiURL || process.env.VUE_APP_API_URL

export function createFeathersClient(host = apiURL) {
  const socket = io(host, { transports: ['websocket'] })

  const feathersClient = feathers()

  feathersClient.configure(socketio(socket))

  feathersClient
    .configure(
      auth({
        header: 'Authorization', // the default authorization header for REST
        path: '/authentication', // the server-side authentication service path
        jwtStrategy: 'jwt', // the name of the JWT authentication strategy
        entity: 'user', // the entity you are authenticating (ie. a users)
        service: 'users', // the service to look up the entity
        cookie: 'wot-runtime-jwt', // the name of the cookie to parse the JWT from when cookies are enabled server side
        storageKey: 'wot-runtime-jwt', // the key to store the accessToken in localstorage or AsyncStorage on React Native
        storage: window.localStorage // Passing a WebStorage-compatible object to enable automatic storage on the client
      })
    )
    .hooks({
      before: {
        all: [
          iff(
            (context) => ['create', 'update', 'patch'].includes(context.method),
            discard('__id', '__isTemp')
          )
          // log,
        ],
        create: [setNow('createdAt', 'updatedAt')],
        update: [setNow('updatedAt')]
      },
      after: {
        // all: [log],
      },
      error: {
        // all: [log],
      }
    })

  // Setting up feathers-vuex
  const {
    makeServicePlugin,
    makeAuthPlugin,
    BaseModel, // each service extends the BaseModel Class and adds unique attrs/methods
    models,
    FeathersVuex
  } = feathersVuex(feathersClient, {
    // Configured globally:
    serverAlias: 'api', // optional for working with multiple APIs (this is the default value)
    paramsForServer: [], // Default: [] - Custom query operators that are ignored in the find getter, but will pass through to the server.
    whitelist: ['$regex', '$options'], // Default: [] - Custom query operators that will be allowed in the find getter.
    // Also configurable per service:
    idField: '_id', // Default: "id" - The field in each database record that will contain the id (must match!).
    tempIdField: '__id', // Default: "__id" - The field in each temporary record that contains the id
    debug: false, // Default: false - Enable some logging for debugging
    addOnUpsert: false, // Default: false - If true add new records pushed by "updated/patched" socketio events into store, instead of discarding them.
    autoRemove: false, // Default: false - If true automatically remove records missing from responses (only use with feathers-rest)
    enableEvents: true, // Default: true - If false socket event listeners will be turned off. See the services handleEvents API
    preferUpdate: false, // Default: false - If true, calling model.save() will do an update instead of a patch.
    replaceItems: false, // Default: false - If true, updates & patches replace the record in the store. Default is false, which merges in changes.
    skipRequestIfExists: false, //  Default: false - For get action, if true the record already exists in store, skip the remote request.
    nameStyle: 'short' // Default: "short" - Use the full service path as the Vuex module name, instead of just the last section.
  })

  return {
    feathersClient,
    makeAuthPlugin,
    makeServicePlugin,
    BaseModel,
    models,
    FeathersVuex
  }
}
