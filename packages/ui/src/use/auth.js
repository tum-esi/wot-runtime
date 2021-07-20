import { ref, computed } from '@vue/composition-api'
import $store from '@/store'
import router from '@/router.js'
import { models } from 'feathers-vuex'
const { User } = models.api

export function useAuth() {
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const confirmPassword = ref('')
  const showConfirmPassword = ref(false)
  const error = ref(null)

  const user = computed(() => $store.getters['auth/user'])

  const isAuthenticated = computed(() => $store.getters['auth/isAuthenticated'])

  function dismissError() {
    error.value = null
  }

  function register(email, password, name) {
    dismissError()
    // Automatically log the user in after successful signup.
    new User({ email, password, name })
      .save()
      .then(() => login(email, password))
  }

  function login(email, password) {
    dismissError()
    $store
      .dispatch('auth/authenticate', { strategy: 'local', email, password })
      .then(() => router.push('/'))
      // Use returned error instead of mapping it from the $store.
      .catch((error) => {
        handleError(error)
      })
  }

  function handleError(err) {
    // Convert the error to a plain object and add a friendly message.
    error.value = err.toJSON()
    // TODO: add friendly error messages to all feathers-vuex auth plugin errors
    switch (error.value.message) {
      case 'An error prevented login.':
        error.value.message = 'That email address is unavailable.'
        console.error(`SignupError: ${error.value.message}`, error.value)
        break
      case 'Incorrect email or password.':
        error.value.message = 'Incorrect email or password.'
        console.error(`SigninError: ${error.value.message}`, error.value)
        break
      default:
        error.value.message === 'uniqueViolated'
          ? 'That email address is unavailable.'
          : 'An error prevented login.'
        console.error(`SigninError: ${error.value.message}`, error.value)
        break
    }
  }

  function logout() {
    $store.dispatch('auth/logout').then(() => router.push('/signin'))
  }

  function switchAccount(account) {
    console.debug('TODO: auto-fill sign-in form with account details:', account)
    $store.dispatch('auth/logout').then(() => router.push('/register'))
  }

  function addAccount() {
    $store.dispatch('auth/logout').then(() => router.push('/register'))
  }

  return {
    name,
    email,
    password,
    showPassword,
    confirmPassword,
    showConfirmPassword,
    error,
    dismissError,
    user,
    isAuthenticated,
    register,
    login,
    logout,
    switchAccount,
    addAccount
  }
}
