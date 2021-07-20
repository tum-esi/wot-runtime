import { ref, computed, onMounted } from '@vue/composition-api'
import axios from 'axios'
import $store from '@/store'
import { useLocalStorage } from '@vueuse/core'

export function useHosts($api, query = null) {
  // CRUD: to localstorage and directly via HTTP requests (axios) instead of feathersClient

  const hosts = JSON.parse(window.localStorage.getItem('hosts')) // gets unique hosts

  const items = useLocalStorage('hosts', hosts || [])

  const itemsTotal = computed(() => (items.value ? items.value.length : 0))

  async function findRemoteItems() {
    const responses = await Promise.all(
      items.value.map(({ host }) => axios.get(`${host}/servient`))
    )
    return responses.map((r) => r.data.data)[0]
  }

  onMounted(async () => {
    items.value = await findRemoteItems()
  })

  // CRUD:

  async function createItem(item) {
    await createServientInHost({ ...item, _id: require('shortid').generate() })
  }

  async function updateItem(item) {
    await updateServientInHost({ ...item })
  }

  async function removeItem(item) {
    await removeServientInHost({ ...item })
  }

  async function createServientInHost(item) {
    const now = new Date()
    const newItem = { ...item, createdAt: now, updatedAt: now }
    try {
      const hostUrl = `${newItem.host}/servient`
      await axios.post(hostUrl, newItem)
      $store.commit('SET', {
        prop: 'notification',
        value: {
          model: true,
          color: 'success',
          text: `Created host successfully`
        }
      })
    } catch (error) {
      handleError(error)
      // update status to "failed"
      updateItem(item._id, { ...item, status: 'failed' })
    } finally {
      editedItem.value = { ...defaultItem } // reset initial form
      $store.commit('SET', { prop: 'dialog', value: false })
    }
  }

  async function updateServientInHost(item) {
    const now = new Date()
    const newItem = { ...item, updatedAt: now }
    try {
      const hostUrl = `${newItem.host}/servient/${item._id}`
      await axios.put(hostUrl, newItem)
      $store.commit('SET', {
        prop: 'notification',
        value: {
          model: true,
          color: 'success',
          text: `Updated host successfully`
        }
      })
    } catch (error) {
      handleError(error)
    } finally {
      editedItem.value = { ...defaultItem } // reset initial form
      $store.commit('SET', { prop: 'dialog', value: false })
    }
  }

  async function removeServientInHost(item) {
    try {
      const hostUrl = `${item.host}/servient/${item._id}`
      await axios.delete(hostUrl)
      $store.commit('SET', {
        prop: 'notification',
        value: {
          model: true,
          color: 'success',
          text: `Removed host successfully`
        }
      })
    } catch (error) {
      handleError(error)
    } finally {
      editedItem.value = { ...defaultItem } // reset initial form
      $store.commit('SET', { prop: 'dialog', value: false })
    }
  }

  function handleError(error) {
    if (error.response) {
      /*
       * Request made but status code falls out of the range of 2xx
       */
      const { data, status } = error.response
      console.error(status, data)
      $store.commit('SET', {
        prop: 'notification',
        value: { model: true, color: 'error', text: data.message }
      })
    } else if (error.request) {
      /*
       * Request made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.error(error.request)
    } else {
      // Something happened in setting up the request and triggered an Error
      console.error('Error', error.message)
    }
    return error
  }

  $api.service('servient').on('created', (servient) => {
    items.value.push({ ...servient, _id: servient.id })
  })

  $api.service('servient').on('patched', (servient) => {
    items.value = items.value.map((i) =>
      i._id === servient._id ? servient : i
    )
  })

  $api.service('servient').on('updated', (servient) => {
    items.value = items.value.map((i) =>
      i._id === servient._id ? servient : i
    )
  })

  $api.service('servient').on('removed', (servient) => {
    items.value = items.value.filter((i) => i._id !== servient._id)
  })

  // deployment:

  async function start(item) {
    item.status = 'loading'
    const servient = { ...item, status: 'running' }
    await updateItem(servient)
    if (query) query.value = { ...query.value } // refetch items
    return servient
  }

  async function restart(item) {
    item.status = 'loading'
    const servient = { ...item, status: 'running' }
    await updateItem(servient)
    if (query) query.value = { ...query.value } // refetch items
    return servient
  }

  async function stop(item) {
    item.status = 'loading'
    const servient = { ...item, status: 'stopped' }
    await updateItem(servient)
    if (query) query.value = { ...query.value } // refetch items
    return servient
  }

  // utilities:

  const defaultConfig = {
    http: {
      port: 8080,
      proxy: {
        href: 'http://localhost:8080',
        scheme: 'basic',
        token: 'bearerToken',
        username: 'username',
        password: 'password'
      },
      allowSelfSigned: true
    },
    coap: {
      port: 5683
    },
    mqtt: {
      broker: 'mqtt://test.mosquitto.org',
      username: 'username',
      password: 'password',
      clientId: 'uniqueId',
      port: 1883
    },
    credentials: {
      'thing-id': {
        username: 'username',
        password: 'password'
      },
      'other-thing-id': {
        identity: 'identity',
        psk: 'psk'
      },
      'nth-thing-id': {
        token: 'token'
      }
    }
  }

  const defaultItem = {
    name: '',
    host: 'http://localhost:3030',
    config: defaultConfig,
    status: 'running'
  }

  const editedItem = ref({ ...defaultItem })

  return {
    items,
    itemsTotal,
    // CRUD:
    createItem,
    updateItem,
    removeItem,
    // deployment:
    start,
    restart,
    stop,
    // utilities:
    editedItem
  }
}
