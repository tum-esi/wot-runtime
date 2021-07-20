// Configures feathers-vuex Auth Plugin for easier authentication

import { makeAuthPlugin } from '../feathers-client.js'

// The plugin automatically injects the following default state, getters
// and actions. To modify/add to the defaults uncomment the objects bellow.

const state = {
  accessToken: undefined, // The JWT
  payload: undefined, // The JWT payload

  userService: 'users', // Specify the userService to automatically populate the user upon login.
  entityIdField: '_id', // The property in the payload storing the user id
  responseEntityField: 'user', // The property in the payload storing the user

  isAuthenticatePending: false,
  isLogoutPending: false,

  errorOnAuthenticate: undefined,
  errorOnLogout: undefined
}

/*
const getters = {
  isAuthenticated  // Boolean - convenient boolean attribute
  user // returns reactive, logged-in user (from userService specified in options) or null if not logged in.
}
const actions = {
  authenticate // Function - handles feathersjs and vuex logic for login
  logout // Function - handles feathersjs and vuex logic for logout
}
*/

export default makeAuthPlugin(state)
