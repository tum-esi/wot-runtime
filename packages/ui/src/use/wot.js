import { ref, computed } from '@vue/composition-api'
import $store from '@/store'

// wot: TODO: import from packages rather than in index.html from CDN (browser-bundle)
/* eslint-disable no-undef */
// import { Servient } from '@node-wot/core'
// import { HttpClientFactory } from '@node-wot/binding-http'
// import { WebSocketClientFactory } from '@node-wot/binding-websockets'

export function useWot() {
  const thing = ref(null)

  async function consumeDescription(td) {
    const servient = new Wot.Core.Servient() // create servient
    servient.addClientFactory(new Wot.Http.HttpClientFactory()) // add http binding
    servient.addClientFactory(new Wot.Http.HttpsClientFactory()) // add https binding
    servient.addClientFactory(new Wot.WebSocket.WebSocketClientFactory()) // add websocket binding
    const wot = await servient.start()
    return wot.consume(JSON.parse(td))
  }

  const selectedInteraction = computed({
    get: () => $store.state.selectedInteraction,
    set: (value) => {
      $store.commit('things/SET', { prop: 'selectedInteraction', value })
    }
  })

  const showInteractions = ref(true)

  function getIconDatatype(interactionType, interaction) {
    console.log(interactionType, interaction)

    if (interactionType === 'action') {
      return 'touch_app'
    } else if (interactionType === 'event') {
      return 'event'
    } else if (interactionType === 'link') {
      return 'insert_link'
    } else if (interactionType === 'property') {
      switch (interaction.type) {
        case 'null':
          return 'block'
        case 'string':
          return 'text_fields'
        case 'anyURI':
          return 'text_fields'
        case 'dateTime':
          return ''
        case 'integer':
          return 'exposure_plus_1'
        case 'number':
          return 'exposure_plus_1'
        case 'unsignedInt':
          return 'exposure_negative_1'
        case 'double':
          return 'exposure_plus_2'
        case 'boolean':
          return 'toggle_on'
        case 'array':
          return 'reorder'
        case 'object':
          return 'list'
        default:
          return 'folder'
      }
    } else {
      return 'folder'
    }
  }

  return {
    thing,
    consumeDescription,
    selectedInteraction,
    showInteractions,
    getIconDatatype
  }
}
